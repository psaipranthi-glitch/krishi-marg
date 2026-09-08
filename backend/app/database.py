import os, tempfile
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from .config import settings

class Base(DeclarativeBase):
    pass

db_url = settings.database_url
if os.environ.get("VERCEL") or not os.access(".", os.W_OK):
    tmp_db = os.path.join(tempfile.gettempdir(), "krishi_marg.db")
    db_url = f"sqlite:///{tmp_db}"

connect_args = {"check_same_thread": False} if db_url.startswith("sqlite") else {}
engine = create_engine(db_url, pool_pre_ping=True, connect_args=connect_args)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

