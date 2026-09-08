from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select
from datetime import date
from ..database import get_db
from ..models import *
from ..schemas.api import GradeIn
from ..services.freshness import predict_freshness as predict
from ..services.notify import notify,alert
from ..services.pricing import calculate_price as calculate
from ..services.matching import match_vehicles
from ..optimization.router import optimize_route
r=APIRouter(prefix='/api/operations',tags=['operations'])
@r.post('/aggregate')
def aggregate(db:Session=Depends(get_db)):
    out=[]
    for c in db.scalars(select(Commodity)).all():
        demand=sum(x.quantity_kg for x in db.scalars(select(OrderItem).where(OrderItem.commodity_id==c.id)).all())
        supply=sum(x.available_qty_kg for x in db.scalars(select(FarmerSupply).where(FarmerSupply.commodity_id==c.id)).all())
        a=DemandAggregation(commodity_id=c.id,demand_kg=demand,available_supply_kg=supply,fulfillment_pct=min(100,supply/max(demand,1)*100)); db.add(a); out.append({'commodity':c.slug,'demand_kg':demand,'supply_kg':supply,'fulfillment_pct':a.fulfillment_pct})
    notify(db,'Demand aggregation completed across all four commodities.'); db.commit(); return out
@r.post('/match-farmer')
def match_farmer(db:Session=Depends(get_db)):
    tomato=db.scalar(select(Commodity).where(Commodity.slug=='tomato')); supply=db.scalar(select(FarmerSupply).where(FarmerSupply.commodity_id==tomato.id).order_by(FarmerSupply.available_qty_kg.desc())); farmer=db.get(Farmer,supply.farmer_id) if supply else None
    if not farmer: raise HTTPException(404,'No supply')
    notify(db,f'Farmer {farmer.farmer_code} matched for tomato demand.'); db.commit(); return {'farmer_id':farmer.id,'farmer_code':farmer.farmer_code,'quantity_kg':supply.available_qty_kg}
@r.post('/grade/{lot_id}')
def grade(lot_id:int,data:GradeIn,db:Session=Depends(get_db)):
    lot=db.get(ProduceLot,lot_id)
    if not lot: raise HTTPException(404,'Lot not found')
    c=db.get(Commodity,lot.commodity_id); rec='A' if data.visual_quality>=85 and data.damage_pct<=5 and data.freshness>=80 else 'B' if data.visual_quality>=65 and data.damage_pct<=15 and data.freshness>=55 else 'C'
    confirmed=data.confirmed_grade or rec; old=lot.grade; lot.grade=confirmed
    p= predict(c,lot.harvest_date,data.temperature_c,data.handling_delay_min,0,confirmed); lot.freshness_pct=p['freshness_pct']; lot.remaining_life_days=p['remaining_life_days']
    db.add(QualityInspection(lot_id=lot.id,visual_quality=data.visual_quality,damage_pct=data.damage_pct,freshness=data.freshness,temperature_c=data.temperature_c,handling_delay_min=data.handling_delay_min,recommended_grade=rec,confirmed_grade=confirmed)); db.add(FreshnessPrediction(lot_id=lot.id,**p))
    if old!=confirmed: notify(db,f'Grade changed from {old} to {confirmed}. Final price recalculation triggered.',severity='warning'); db.add(AuditLog(entity_type='lot',entity_id=lot.id,action='GRADE_CHANGE',details=f'{old}->{confirmed}'))
    db.commit(); return {'recommended_grade':rec,'confirmed_grade':confirmed,'freshness':p}
@r.get('/lots')
def get_lots(db:Session=Depends(get_db)):
    lots=db.scalars(select(ProduceLot).order_by(ProduceLot.id.desc())).all()
    out=[]
    for lot in lots:
        c=db.get(Commodity,lot.commodity_id)
        f=db.get(Farmer,lot.farmer_id)
        cc=db.get(CollectionCentre,lot.collection_centre_id) if lot.collection_centre_id else None
        pc=db.get(PackageCentre,lot.package_centre_id) if lot.package_centre_id else None
        hub=db.get(CityHub,lot.hub_id) if lot.hub_id else None
        out.append({
            'id':lot.id,
            'lot_code':lot.lot_code,
            'farmer_name':f.name if f else 'Ramesh Kumar',
            'farmer_code':f.farmer_code if f else 'KM-FMR-0001',
            'commodity':c.name if c else 'Tomato',
            'commodity_slug':c.slug if c else 'tomato',
            'quantity_kg':lot.quantity_kg,
            'harvest_date':str(lot.harvest_date),
            'grade':lot.grade,
            'freshness_pct':lot.freshness_pct,
            'remaining_life_days':lot.remaining_life_days,
            'temperature_c':lot.temperature_c,
            'status':lot.status,
            'collection_name':cc.name if cc else 'KM Collection - Shamshabad',
            'package_name':pc.name if pc else 'KM Packhouse - Hyderabad',
            'hub_name':hub.name if hub else 'Hyderabad Central Hub'
        })
    return out

@r.post('/lots')
def create_lot(commodity:str='tomato',quantity_kg:float=500,grade:str='A',db:Session=Depends(get_db)):
    c=db.scalar(select(Commodity).where(Commodity.slug==commodity)) or db.scalar(select(Commodity))
    f=db.scalar(select(Farmer))
    cc=db.scalar(select(CollectionCentre))
    pc=db.scalar(select(PackageCentre))
    hub=db.scalar(select(CityHub))
    lot_code=f'KM-LOT-{date.today().year}-{1000+db.query(ProduceLot).count()+1}'
    lot=ProduceLot(lot_code=lot_code,farmer_id=f.id if f else 1,commodity_id=c.id,quantity_kg=quantity_kg,harvest_date=date.today(),grade=grade,freshness_pct=92,remaining_life_days=c.shelf_life_days,temperature_c=11,collection_centre_id=cc.id if cc else 1,package_centre_id=pc.id if pc else 1,hub_id=hub.id if hub else 1,status='AT_COLLECTION')
    db.add(lot); notify(db,f'New produce lot {lot_code} registered by farmer.'); db.commit(); db.refresh(lot)
    return {'id':lot.id,'lot_code':lot.lot_code,'quantity_kg':lot.quantity_kg,'status':lot.status}

@r.get('/vehicle-match/{order_id}')
def vehicle_match(order_id:int,db:Session=Depends(get_db)):
    o=db.get(Order,order_id) if order_id>0 else None
    if not o: o=db.scalar(select(Order).order_by(Order.id.desc()))
    if not o: raise HTTPException(404,'Order not found')
    item=db.scalar(select(OrderItem).where(OrderItem.order_id==o.id)); c=db.get(Commodity,item.commodity_id) if item else db.scalar(select(Commodity));
    qty=item.quantity_kg if item else 300
    slug=c.slug if c else 'tomato'
    matches=match_vehicles(db.scalars(select(Vehicle)).all(),qty,slug,'PRIORITY',(17.39,78.49),(o.delivery_lat,o.delivery_lon));
    return [{'vehicle_id':v.id,'vehicle_code':v.vehicle_code,'score':score,'reason':reason} for v,score,reason in matches[:5]]

@r.post('/route')
def route(db:Session=Depends(get_db)):
    hub=db.scalar(select(CityHub)); cust=db.scalar(select(Customer)); pc=db.scalar(select(PackageCentre));
    stops=[{'name':hub.name if hub else 'Hub','lat':hub.lat if hub else 17.385,'lon':hub.lon if hub else 78.4867,'demand_kg':0},{'name':pc.name if pc else 'Packhouse','lat':pc.lat if pc else 17.448,'lon':pc.lon if pc else 78.391,'demand_kg':0},{'name':cust.name if cust else 'Customer','lat':cust.lat if cust else 17.440,'lon':cust.lon if cust else 78.348,'demand_kg':300}]
    result=optimize_route(stops); v=db.scalar(select(Vehicle).where(Vehicle.available==True)); route=Route(route_code=f'KM-R-{db.query(Route).count()+1:04d}',vehicle_id=v.id if v else None,distance_km=result['distance_km'],eta_min=result['eta_min']); db.add(route); db.flush()
    for seq,idx in enumerate(result['order']):
        s=stops[idx]; db.add(RouteStop(route_id=route.id,sequence=seq,stop_type='STOP',reference_id=idx,lat=s['lat'],lon=s['lon']))
    db.commit(); return {'route_id':route.id,'route_code':route.route_code,'distance_km':route.distance_km,'eta_min':route.eta_min,'stops':[stops[i] for i in result['order']]}

@r.post('/price-preview')
def price_preview(commodity:str,grade:str='A',quantity_kg:float=100,distance_km:float=8,handling:float=3,freshness_pct:float=90,db:Session=Depends(get_db)):
    c=db.scalar(select(Commodity).where(Commodity.slug==commodity))
    if not c: raise HTTPException(404,'Commodity not found')
    return calculate(c.base_price,grade,distance_km,handling,freshness_pct)



