from fastapi import APIRouter
from datetime import date

from ..schemas.api import FreshnessIn
from ..services.freshness import predict_freshness

r = APIRouter(prefix="/api/ai", tags=["AI"])


@r.post("/freshness")
def freshness(data: FreshnessIn):
    harvest = date.fromisoformat(data.harvest_date)

    harvest_age_hours = max(0, (date.today() - harvest).days * 24)
    handling_hours = max(0, data.handling_delay_min) / 60
    storage_hours = max(0, data.storage_duration_days) * 24

    total_age_hours = harvest_age_hours + handling_hours + storage_hours

    result = predict_freshness(
        commodity=data.commodity,
        age_hours=total_age_hours,
        temperature_c=data.temperature_c,
        grade=data.grade,
    )

    return {
        "commodity": data.commodity,
        "harvest_date": data.harvest_date,
        "handling_delay_min": data.handling_delay_min,
        "storage_duration_days": data.storage_duration_days,
        "grade": data.grade,
        "age_hours": round(total_age_hours, 2),
        "freshness_score": result.freshness_score,
        "risk": result.risk,
        "urgency": result.urgency,
        "estimated_life_hours": result.estimated_life_hours,
        "estimated_remaining_life_days": round(
            result.estimated_life_hours / 24, 2
        ),
    }
