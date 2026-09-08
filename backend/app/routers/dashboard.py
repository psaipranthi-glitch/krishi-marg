from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from sqlalchemy import select,func
from ..database import get_db
from ..models import *
from ..ai.forecast import forecast
r=APIRouter(prefix='/api',tags=['dashboard'])
@r.get('/kpis')
def kpis(db:Session=Depends(get_db)):
    return {'active_orders':db.scalar(select(func.count(Order.id)).where(Order.status.not_in(['DELIVERED','CANCELLED']))) or 0,'freshness_critical':db.scalar(select(func.count(FreshnessPrediction.id)).where(FreshnessPrediction.spoilage_risk=='HIGH')) or 0,'active_vehicles':db.scalar(select(func.count(Vehicle.id)).where(Vehicle.available==True)) or 0,'on_time_delivery':92,'demand_served':88,'empty_km':12.4,'cost_per_kg':4.8,'spoilage':3.2}
@r.get('/commodities')
def commodities(db:Session=Depends(get_db)):
    return [{'id':c.id,'slug':c.slug,'name':c.name,'base_price':c.base_price,'shelf_life_days':c.shelf_life_days,'min_temp_c':c.min_temp_c,'max_temp_c':c.max_temp_c} for c in db.scalars(select(Commodity)).all()]
@r.get('/forecast')
def forecasts(db:Session=Depends(get_db)):
    return [forecast(db,c) for c in db.scalars(select(Commodity)).all()]
@r.get('/demand')
def demand(db:Session=Depends(get_db)):
    cm={c.id:c for c in db.scalars(select(Commodity)).all()}; rows=[]
    for c in cm.values():
        d=db.scalar(select(func.coalesce(func.sum(OrderItem.quantity_kg),0)).where(OrderItem.commodity_id==c.id)) or 0
        s=db.scalar(select(func.coalesce(func.sum(FarmerSupply.available_qty_kg),0)).where(FarmerSupply.commodity_id==c.id)) or 0
        rows.append({'commodity':c.name,'demand_kg':float(d),'supply_kg':float(s),'fulfillment_pct':round(min(100,(s/max(d,1))*100),1)})
    return rows
@r.get('/activity')
def activity(db:Session=Depends(get_db)):
    return [{'time':a.created_at.strftime('%H:%M'),'message':a.details or a.action} for a in db.scalars(select(AuditLog).order_by(AuditLog.created_at.desc()).limit(12)).all()]

@r.get('/notifications')
def notifications(db:Session=Depends(get_db)):
    return [{'id':n.id,'message':n.message,'severity':n.severity,'read':n.read,'created_at':n.created_at.isoformat()} for n in db.scalars(select(Notification).order_by(Notification.created_at.desc()).limit(30)).all()]
@r.get('/alerts')
def alerts(db:Session=Depends(get_db)):
    return [{'id':a.id,'type':a.alert_type,'message':a.message,'severity':a.severity,'status':a.status,'created_at':a.created_at.isoformat()} for a in db.scalars(select(Alert).order_by(Alert.created_at.desc()).limit(30)).all()]
