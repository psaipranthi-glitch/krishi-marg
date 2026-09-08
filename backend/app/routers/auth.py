from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select
from ..database import get_db
from ..models import User
from ..schemas.api import LoginIn
from ..services.auth import verify_password,make_token
r=APIRouter(prefix='/api/auth',tags=['auth'])
@r.post('/login')
def login(data:LoginIn,db:Session=Depends(get_db)):
    u=db.scalar(select(User).where(User.email==data.email))
    if not u:
        try:
            from ..seed.seed import seed
            seed()
            u=db.scalar(select(User).where(User.email==data.email))
        except Exception:
            pass
    if not u or not verify_password(data.password,u.password_hash): raise HTTPException(401,'Invalid credentials')
    return {'access_token':make_token(u),'user':{'id':u.id,'name':u.name,'role':u.role,'email':u.email}}

