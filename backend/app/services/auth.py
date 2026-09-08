import bcrypt, jwt
from datetime import datetime,timedelta,timezone
from fastapi import HTTPException
from sqlalchemy import select
from ..config import settings
from ..models import User

def hash_password(password): return bcrypt.hashpw(password.encode(),bcrypt.gensalt()).decode()
def verify_password(password, hashed): return bcrypt.checkpw(password.encode(),hashed.encode())
def make_token(user): return jwt.encode({'sub':str(user.id),'role':user.role,'exp':datetime.now(timezone.utc)+timedelta(hours=12)},settings.jwt_secret,algorithm='HS256')
def user_from_token(db, token):
    try:
        p=jwt.decode(token,settings.jwt_secret,algorithms=['HS256']); u=db.get(User,int(p['sub']))
        if not u: raise Exception()
        return u
    except Exception: raise HTTPException(401,'Invalid or expired token')
