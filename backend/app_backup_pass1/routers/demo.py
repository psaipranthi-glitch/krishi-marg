from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from sqlalchemy import select
from ..database import get_db
from ..models import *
from ..services.notify import notify
from ..services.workflow import transition
from ..optimization.router import optimize_route
r=APIRouter(prefix='/api/demo',tags=['demo'])
@r.post('/run')
def run(db:Session=Depends(get_db)):
    o=db.scalar(select(Order).order_by(Order.id.desc()));
    if not o: return {'message':'Create a demo order first','steps':[]}
    steps=[]
    # Valid transitions are applied in sequence where possible.
    for s in ['AGGREGATING','MATCHED','PICKUP_ASSIGNED','PICKED_UP','AT_COLLECTION','INSPECTED','PACKED','AT_PACKAGE_CENTRE','AT_HUB','OUT_FOR_DELIVERY','DELIVERED']:
        if o.status==s: continue
        if s in {'AGGREGATING','MATCHED','PICKUP_ASSIGNED','PICKED_UP','AT_COLLECTION','INSPECTED','PACKED','AT_PACKAGE_CENTRE','AT_HUB','OUT_FOR_DELIVERY','DELIVERED'}:
            try: transition(o,s); steps.append(s)
            except Exception: pass
    notify(db,f'Demo journey completed for {o.order_code}.'); db.commit(); return {'order_code':o.order_code,'status':o.status,'steps':steps}
