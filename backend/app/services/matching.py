import math


def km(a, b, c, d):
    return math.hypot((a - c) * 111, (b - d) * 96)


def match_vehicles(vehicles, order_qty=0, commodity="tomato", urgency="NORMAL", origin=(17.385, 78.4867), destination=None, **kwargs):
    if "quantity_kg" in kwargs and not order_qty:
        order_qty = kwargs["quantity_kg"]

    out = []
    c_str = commodity.slug if hasattr(commodity, "slug") else str(commodity).lower()
    urg_str = str(urgency).upper()

    origin_lat, origin_lon = origin if (isinstance(origin, (list, tuple)) and len(origin) >= 2) else (17.385, 78.4867)

    for v in vehicles:
        available = getattr(v, "available", True)
        capacity = float(getattr(v, "capacity_kg", 0) or 0)
        refrigerated = bool(getattr(v, "refrigerated", False))

        if not available or (order_qty > 0 and capacity < order_qty):
            continue

        v_lat = float(getattr(v, "lat", 17.385) or 17.385)
        v_lon = float(getattr(v, "lon", 78.4867) or 78.4867)
        d = km(v_lat, v_lon, origin_lat, origin_lon)

        score = 100.0 - min(35.0, d * 2.0)
        if capacity > 0 and order_qty > 0:
            score -= max(0.0, (capacity - order_qty) / capacity) * 15.0

        if urg_str in ["IMMEDIATE", "CRITICAL"]:
            score += 10.0
        elif urg_str == "PRIORITY":
            score += 5.0

        if c_str in {"spinach", "tomato"} and refrigerated:
            score += 15.0

        score = max(0.0, min(100.0, score))

        reason = (
            f"{capacity:.0f} kg capacity; {d:.1f} km away; "
            + ("cold-chain compatible; " if refrigerated else "")
            + "freshness urgency considered."
        )

        out.append((v, round(score, 1), reason))

    return sorted(out, key=lambda x: x[1], reverse=True)


def vehicle_score(
    vehicle,
    required_kg: float,
    distance_km: float = 0,
    urgency: str = "NORMAL",
    refrigerated_required: bool = False,
):
    capacity = float(getattr(vehicle, "capacity_kg", 0) or 0)
    refrigerated = bool(getattr(vehicle, "refrigerated", False))

    if capacity < required_kg:
        return -1

    score = 50.0

    utilization = required_kg / max(capacity, 1)

    if 0.55 <= utilization <= 0.9:
        score += 25
    elif utilization > 0.9:
        score += 10
    else:
        score += 15

    score -= min(distance_km * 1.2, 25)

    if refrigerated_required:
        score += 20 if refrigerated else -30

    if urgency == "CRITICAL":
        score += 10 if refrigerated else -5
    elif urgency == "PRIORITY":
        score += 5 if refrigerated else 0

    return round(score, 2)


def rank_vehicles(
    vehicles,
    required_kg: float,
    distance_km: float = 0,
    urgency: str = "NORMAL",
    refrigerated_required: bool = False,
):
    matches = match_vehicles(
        vehicles=vehicles,
        order_qty=required_kg,
        commodity="tomato",
        urgency=urgency,
        origin=(17.385, 78.4867),
    )
    return [(v, score) for v, score, _ in matches]


def match_vehicle(
    vehicles,
    required_kg: float,
    distance_km: float = 0,
    urgency: str = "NORMAL",
    refrigerated_required: bool = False,
):
    ranked = rank_vehicles(
        vehicles,
        required_kg,
        distance_km,
        urgency,
        refrigerated_required,
    )

    return ranked[0][0] if ranked else None
