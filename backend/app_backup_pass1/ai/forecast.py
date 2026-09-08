from datetime import date,timedelta
from sqlalchemy import select, func
from ..models import Order, OrderItem, Commodity

def forecast(db, commodity: Commodity):
    q=db.execute(select(func.coalesce(func.sum(OrderItem.quantity_kg),0)).join(Order,Order.id==OrderItem.order_id).where(OrderItem.commodity_id==commodity.id)).scalar_one()
    baseline=float(q or 500)
    factor={'tomato':1.12,'onion':1.08,'potato':1.04,'spinach':1.15}.get(commodity.slug,1.05)
    demand=round(max(300,baseline*factor/3),0)
    return {'commodity':commodity.name,'forecast_date':str(date.today()+timedelta(days=1)),'demand_kg':demand,'trend_pct':round((factor-1)*100,1),'confidence_pct':84 if commodity.slug=='tomato' else 79}
