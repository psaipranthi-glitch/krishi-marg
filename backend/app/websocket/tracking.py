from fastapi import WebSocket
import asyncio, math
from sqlalchemy import select
from ..models import Driver, GPSLocation
from ..database import SessionLocal

clients = set()


async def endpoint(ws: WebSocket):
    await ws.accept()
    clients.add(ws)
    try:
        while True:
            await ws.receive_text()
    except Exception:
        pass
    finally:
        clients.discard(ws)


async def broadcast_demo():
    t = 0
    while True:
        try:
            db = SessionLocal()
            try:
                drivers = db.scalars(select(Driver).limit(3)).all()
                for i, d in enumerate(drivers):
                    d.lat = 17.35 + 0.025 * math.sin(t / 12 + i)
                    d.lon = 78.43 + 0.055 * math.cos(t / 14 + i)
                    db.add(GPSLocation(driver_id=d.id, lat=d.lat, lon=d.lon, speed_kmh=28))
                    payload = {
                        "type": "driver_update",
                        "driver_id": d.id,
                        "lat": d.lat,
                        "lon": d.lon,
                        "speed_kmh": 28,
                        "eta_min": max(5, 28 - int(t) % 20),
                    }
                    dead = []
                    for c in list(clients):
                        try:
                            await c.send_json(payload)
                        except Exception:
                            dead.append(c)
                    for c in dead:
                        clients.discard(c)
                db.commit()
            finally:
                db.close()
        except Exception:
            pass

        t += 1
        await asyncio.sleep(2)

