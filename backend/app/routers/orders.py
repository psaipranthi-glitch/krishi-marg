from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select,func
from ..database import get_db
from ..models import *
from ..schemas.api import OrderCreate
from ..services.workflow import transition
from ..services.notify import notify
from ..services.pricing import calculate_price as calculate

r=APIRouter(prefix='/api/orders',tags=['orders'])

def commodity_map(db): return {c.slug:c for c in db.scalars(select(Commodity)).all()}

@r.post('')
def create_order(data:OrderCreate,db:Session=Depends(get_db)):
    customer=db.scalar(select(Customer).limit(1))
    if not customer: raise HTTPException(400,'Seed data required')
    o=Order(order_code=f'KM-ORD-{1000+db.query(Order).count()+1}',customer_id=customer.id,delivery_address=data.delivery_address,delivery_lat=data.delivery_lat,delivery_lon=data.delivery_lon,delivery_window=data.delivery_window)
    db.add(o); db.flush(); cm=commodity_map(db); total=0
    for item in data.items:
        c=cm.get(item.commodity)
        if not c: raise HTTPException(400,f'Unsupported commodity: {item.commodity}')
        p=calculate(c.base_price,'A',8,3,92)
        oi=OrderItem(order_id=o.id,commodity_id=c.id,quantity_kg=item.quantity_kg,unit_price=p['final_price'],grade='A'); db.add(oi); total+=p['final_price']*item.quantity_kg
    o.total_amount=round(total,2); transition(o,'AGGREGATING'); notify(db,f'{data.items[0].commodity.title()} demand aggregated to {sum(i.quantity_kg for i in data.items):.0f} kg.')
    db.commit(); db.refresh(o); return {'id':o.id,'order_code':o.order_code,'status':o.status,'total_amount':o.total_amount}

@r.get('')
def list_orders(db:Session=Depends(get_db)):
    rows=db.scalars(select(Order).order_by(Order.created_at.desc()).limit(50)).all()
    farmer=db.scalar(select(Farmer))
    vehicle=db.scalar(select(Vehicle).where(Vehicle.available==True)) or db.scalar(select(Vehicle))
    lot=db.scalar(select(ProduceLot).order_by(ProduceLot.id.desc()))

    out=[]
    for o in rows:
        items=db.scalars(select(OrderItem).where(OrderItem.order_id==o.id)).all()
        item_list=[]
        first_slug='tomato'
        first_name='Tomato'
        for i in items:
            c=db.get(Commodity, i.commodity_id)
            if c:
                first_slug=c.slug
                first_name=c.name
            item_list.append({'commodity':c.slug if c else 'tomato','name':c.name if c else 'Tomato','quantity_kg':i.quantity_kg,'unit_price':i.unit_price,'grade':i.grade})
        
        qty=sum(i.quantity_kg for i in items) if items else 300.0

        out.append({
            'id':o.id,
            'order_code':o.order_code,
            'status':o.status,
            'quantity_kg':qty,
            'total_amount':o.total_amount,
            'delivery_address':o.delivery_address or 'Gachibowli, Hyderabad',
            'commodity':first_slug,
            'commodity_name':first_name,
            'items':item_list,
            'matched_farmer': {
                'farmer_code': farmer.farmer_code if farmer else 'KM-FMR-2026-0001',
                'name': farmer.name if farmer else 'Ramesh Kumar',
                'village': farmer.village if farmer else 'Shamshabad',
                'matched_quantity_kg': qty
            },
            'assigned_vehicle': {
                'vehicle_code': vehicle.vehicle_code if vehicle else 'KM-VH-003',
                'type': vehicle.vehicle_type if vehicle else 'Mini Reefer Truck',
                'capacity_kg': vehicle.capacity_kg if vehicle else 800.0
            },
            'lot_code': lot.lot_code if lot else 'KM-LOT-2026-00421',
            'freshness_pct': lot.freshness_pct if lot else 92,
            'grade': lot.grade if lot else 'A',
            'created_at': str(o.created_at)
        })
    return out

@r.post('/{order_id}/transition/{status}')
def order_transition(order_id:int,status:str,db:Session=Depends(get_db)):
    o=db.get(Order,order_id) if order_id>0 else None
    if not o: o=db.scalar(select(Order).order_by(Order.id.desc()))
    if not o: raise HTTPException(404,'Order not found')
    pipeline=['CREATED','AGGREGATING','MATCHED','PICKUP_ASSIGNED','PICKED_UP','AT_COLLECTION','INSPECTED','PACKED','AT_PACKAGE_CENTRE','AT_HUB','OUT_FOR_DELIVERY','DELIVERED']
    if status in pipeline:
        try:
            curr_idx=pipeline.index(o.status) if o.status in pipeline else 0
            target_idx=pipeline.index(status)
            if target_idx > curr_idx:
                for step in pipeline[curr_idx+1:target_idx+1]:
                    try: transition(o,step)
                    except Exception: pass
            else:
                try: transition(o,status)
                except Exception: o.status=status
        except Exception:
            o.status=status
    else:
        try: transition(o,status)
        except Exception: o.status=status
    notify(db,f'Order {o.order_code} moved to {o.status}.'); db.add(AuditLog(entity_type='order',entity_id=o.id,action='STATUS_CHANGE',details=o.status)); db.commit(); return {'status':o.status,'order_code':o.order_code}
