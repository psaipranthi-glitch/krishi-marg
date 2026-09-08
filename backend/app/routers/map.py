from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from sqlalchemy import select
from ..database import get_db
from ..models import *
r=APIRouter(prefix='/api/map',tags=['map'])
@r.get('/locations')
def locations(db:Session=Depends(get_db)):
    out=[]
    for cls,typ in [(Farmer,'farmer'),(CollectionCentre,'collection'),(PackageCentre,'package'),(CityHub,'hub'),(Driver,'driver'),(Customer,'customer')]:
        for x in db.scalars(select(cls)).all():
            name=getattr(x,'name',getattr(x,'farmer_code',getattr(x,'driver_code','Location')))
            out.append({'type':typ,'id':x.id,'name':name,'lat':x.lat,'lon':x.lon,'status':getattr(x,'available',None)})
    return out
