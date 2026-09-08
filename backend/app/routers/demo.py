from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import select

from ..database import get_db
from ..models import *
from ..services.notify import notify
from ..services.workflow import transition

r = APIRouter(prefix="/api/demo", tags=["demo"])


@r.post("/run")
def run(db: Session = Depends(get_db)):
    o = db.scalar(
        select(Order).where(Order.order_code == "KM-DEMO-001")
    )

    if not o:
        return {
            "message": "KM-DEMO-001 not found",
            "steps": []
        }

    # Reset if already completed so demo can be repeated
    if o.status in ["DELIVERED", "CANCELLED"]:
        o.status = "CREATED"
        db.flush()

    steps = []

    workflow = [
        "AGGREGATING",
        "MATCHED",
        "PICKUP_ASSIGNED",
        "PICKED_UP",
        "AT_COLLECTION",
        "INSPECTED",
        "PACKED",
        "AT_PACKAGE_CENTRE",
        "AT_HUB",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
    ]

    for target in workflow:
        if o.status == target:
            continue

        try:
            transition(o, target)
            steps.append(target)
        except Exception:
            pass

    notify(
        db,
        f"Demo journey completed for {o.order_code}."
    )

    db.commit()

    return {
        "order_code": o.order_code,
        "status": o.status,
        "steps": steps,
    }
