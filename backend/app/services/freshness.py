from dataclasses import dataclass
from datetime import date
from typing import Any


@dataclass
class FreshnessResult:
    freshness_score: float
    risk: str
    urgency: str
    estimated_life_hours: float
    freshness_pct: float = 0.0
    remaining_life_days: float = 0.0
    spoilage_risk: str = ""

    def __post_init__(self):
        if not self.freshness_pct:
            self.freshness_pct = self.freshness_score
        if not self.spoilage_risk:
            self.spoilage_risk = self.risk
        if not self.remaining_life_days:
            self.remaining_life_days = round(self.estimated_life_hours / 24, 2)

    def __getitem__(self, item):
        return getattr(self, item)


def predict(
    commodity: Any,
    harvest_date: date | str = None,
    temperature_c: float = 10.0,
    handling_delay_min: float = 0.0,
    storage_duration_days: float = 0.0,
    grade: str = "A",
) -> dict:
    if isinstance(harvest_date, str):
        try:
            harvest_date = date.fromisoformat(harvest_date)
        except Exception:
            harvest_date = date.today()
    elif harvest_date is None:
        harvest_date = date.today()

    age = (date.today() - harvest_date).days + storage_duration_days + (handling_delay_min / 1440.0)

    # Handle commodity model object or slug string
    if hasattr(commodity, "min_temp_c"):
        min_temp = commodity.min_temp_c
        max_temp = commodity.max_temp_c
        shelf_life = commodity.shelf_life_days
        sensitivity = getattr(commodity, "freshness_sensitivity", 1.0)
    else:
        c_slug = str(commodity).lower()
        defaults = {
            "tomato": (8, 14, 7.0, 0.9),
            "onion": (5, 12, 12.0, 0.65),
            "potato": (6, 18, 18.0, 0.45),
            "spinach": (2, 8, 3.0, 1.2),
        }
        min_temp, max_temp, shelf_life, sensitivity = defaults.get(c_slug, (8, 14, 7.0, 1.0))

    temp_mid = (min_temp + max_temp) / 2.0
    temp_penalty = max(0.0, abs(temperature_c - temp_mid) - 2) * sensitivity * 4.0
    age_penalty = (age / max(shelf_life, 0.1)) * 72.0 * sensitivity
    grade_penalty = {"A": 0, "B": 8, "C": 18}.get(grade.upper() if isinstance(grade, str) else "A", 10)
    freshness = max(0.0, min(100.0, 100.0 - age_penalty - temp_penalty - grade_penalty))
    remaining = max(0.0, shelf_life - age)

    risk = "LOW" if freshness >= 75 else "MEDIUM" if freshness >= 50 else "HIGH"
    urgency = "NORMAL" if remaining > 2 else "PRIORITY" if remaining > 1 else "IMMEDIATE"

    return {
        "freshness_pct": round(freshness, 1),
        "remaining_life_days": round(remaining, 2),
        "spoilage_risk": risk,
        "urgency": urgency,
    }


def predict_freshness(*args, **kwargs):
    # If called with 6 positional args: (commodity, harvest_date, temperature_c, handling_delay_min, storage_duration_days, grade)
    if len(args) == 6 or "harvest_date" in kwargs:
        return predict(*args, **kwargs)

    # AI router call: commodity, age_hours, temperature_c, grade
    commodity = kwargs.get("commodity") if "commodity" in kwargs else (args[0] if len(args) > 0 else "tomato")
    age_hours = kwargs.get("age_hours") if "age_hours" in kwargs else (args[1] if len(args) > 1 else 0.0)
    temperature_c = kwargs.get("temperature_c") if "temperature_c" in kwargs else (args[2] if len(args) > 2 else 10.0)
    grade = kwargs.get("grade") if "grade" in kwargs else (args[3] if len(args) > 3 else "A")

    c_str = commodity.slug if hasattr(commodity, "slug") else str(commodity).lower()
    base = {
        "tomato": 88,
        "onion": 92,
        "potato": 90,
        "spinach": 78,
    }.get(c_str, 85)

    score = float(base)
    score -= max(age_hours, 0) * {
        "tomato": 1.8,
        "onion": 0.45,
        "potato": 0.35,
        "spinach": 3.0,
    }.get(c_str, 1.0)

    ideal_temp = {
        "tomato": 10,
        "onion": 8,
        "potato": 8,
        "spinach": 4,
    }.get(c_str, 8)

    score -= abs(temperature_c - ideal_temp) * 1.8
    score += {"A": 5, "B": 0, "C": -8}.get(str(grade).upper(), 0)
    score = max(0.0, min(100.0, score))

    if score >= 75:
        risk = "LOW"
        urgency = "NORMAL"
    elif score >= 50:
        risk = "MEDIUM"
        urgency = "PRIORITY"
    else:
        risk = "HIGH"
        urgency = "CRITICAL"

    life = max(2.0, round(score / 12.0, 1))

    return FreshnessResult(
        freshness_score=round(score, 2),
        risk=risk,
        urgency=urgency,
        estimated_life_hours=life,
    )


def calculate_freshness(commodity: str, age_hours: float = 0, temperature_c: float = 10, grade: str = "A"):
    return predict_freshness(commodity, age_hours, temperature_c, grade)
