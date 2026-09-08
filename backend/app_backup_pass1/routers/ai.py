from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from sqlalchemy import select
from datetime import date
from ..database import get_db
from ..models import *
from ..schemas.api import FreshnessIn
from ..services.freshness import predict
r=APIRouter(prefix='/api/ai',tags=['ai'])
@r.post('/freshness')
def freshness(data:FreshnessIn,db:Session=Depends(get_db)):
    c=db.scalar(select(Commodity).where(Commodity.slug==data.commodity))
    if not c: return {'error':'commodity not found'}
    return predict(c,date.fromisoformat(data.harvest_date),data.temperature_c,data.handling_delay_min,data.storage_duration_days,data.grade)
