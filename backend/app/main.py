from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Krishi Marg API",
    description="Perishability-Aware Agricultural Transportation & Logistics",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "name": "KRISHI MARG",
        "message": "Right produce. Right vehicle. Right route. On time.",
        "status": "online",
        "docs": "/docs"
    }

@app.get("/health")
def health():
    return {"status": "healthy"}

from app.routers import auth, orders, dashboard, map, ai, operations, demo, traceability
from app.websocket import tracking
from app.seed.seed import seed
import asyncio

app.include_router(auth.r)
app.include_router(orders.r)
app.include_router(dashboard.r)
app.include_router(map.r)
app.include_router(ai.r)
app.include_router(operations.r)
app.include_router(demo.r)
app.include_router(traceability.r)

app.websocket("/ws/tracking")(tracking.endpoint)

@app.on_event("startup")
async def startup():
    try:
        seed()
    except Exception as e:
        print("Auto seed notice:", e)
    asyncio.create_task(tracking.broadcast_demo())
    print("=" * 60)
    print("KRISHI MARG API STARTED")
    print("API:  http://127.0.0.1:8000")
    print("Docs: http://127.0.0.1:8000/docs")
    print("=" * 60)



