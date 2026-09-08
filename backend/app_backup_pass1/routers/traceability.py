from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select
from ..database import get_db
from ..models import *
import qrcode,io,base64
r=APIRouter(prefix='/api/traceability',tags=['traceability'])
@r.get('/{lot_code}')
def trace(lot_code:str,db:Session=Depends(get_db)):
    lot=db.scalar(select(ProduceLot).where(ProduceLot.lot_code==lot_code))
    if not lot: raise HTTPException(404,'Lot not found')
    c=db.get(Commodity,lot.commodity_id); f=db.get(Farmer,lot.farmer_id); cc=db.get(CollectionCentre,lot.collection_centre_id) if lot.collection_centre_id else None; pc=db.get(PackageCentre,lot.package_centre_id) if lot.package_centre_id else None; hub=db.get(CityHub,lot.hub_id) if lot.hub_id else None
    payload={'lot_id':lot.lot_code,'farmer':f.farmer_code,'commodity':c.name,'quantity_kg':lot.quantity_kg,'harvest_date':str(lot.harvest_date),'grade':lot.grade,'freshness_pct':lot.freshness_pct,'collection':cc.name if cc else None,'package_centre':pc.name if pc else None,'hub':hub.name if hub else None,'status':lot.status}
    return payload
@r.get('/{lot_code}/qr')
def qr(lot_code:str):
    img=qrcode.make(f'/traceability/{lot_code}'); b=io.BytesIO(); img.save(b,format='PNG'); return {'data_url':'data:image/png;base64,'+base64.b64encode(b.getvalue()).decode()}
