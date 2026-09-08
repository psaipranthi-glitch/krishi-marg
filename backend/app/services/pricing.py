GRADE_MULTIPLIER = {
    "A": 1.08,
    "B": 0.96,
    "C": 0.78,
}

FRESHNESS_MULTIPLIER = {
    "LOW": 1.05,
    "MEDIUM": 0.98,
    "HIGH": 0.90,
}

BASE_PRICE = {
    "tomato": 36.0,
    "onion": 28.0,
    "potato": 24.0,
    "spinach": 42.0,
}


def calculate(base_price=30.0, grade="A", distance_km=0.0, handling=2.0, freshness_pct=90.0):
    # Handle if first arg is a commodity name string
    if isinstance(base_price, str):
        c_slug = base_price.lower()
        base_num = BASE_PRICE.get(c_slug, 30.0)
    else:
        base_num = float(base_price)

    grade_str = str(grade).upper()
    grade_adj = GRADE_MULTIPLIER.get(grade_str, 1.0)

    # freshness_pct might be numeric percentage or risk string ('LOW', 'MEDIUM', 'HIGH')
    if isinstance(freshness_pct, str):
        freshness_factor = FRESHNESS_MULTIPLIER.get(freshness_pct.upper(), 1.0)
        freshness_pct_val = 90.0 if freshness_pct.upper() == "LOW" else (65.0 if freshness_pct.upper() == "MEDIUM" else 40.0)
    else:
        freshness_pct_val = float(freshness_pct)
        freshness_factor = 1.05 if freshness_pct_val >= 80.0 else (0.98 if freshness_pct_val >= 60.0 else 0.90)

    dist_num = float(distance_km or 0.0)
    handling_num = float(handling or 0.0)

    distance_cost = dist_num * 0.55
    handling_cost = handling_num
    final = (base_num * grade_adj + distance_cost + handling_cost) * freshness_factor

    return {
        "base_price": round(base_num, 2),
        "grade_adjustment": round(base_num * (grade_adj - 1.0), 2),
        "distance_cost": round(distance_cost, 2),
        "handling_cost": round(handling_cost, 2),
        "freshness_factor": round(freshness_factor, 2),
        "freshness_pct": round(freshness_pct_val, 1),
        "final_price": round(final, 2),
        "unit_price": round(final, 2),
    }


def calculate_price(*args, **kwargs):
    # If first arg is numeric: calculate(base_price, grade, distance_km, handling, freshness_pct)
    if args and isinstance(args[0], (int, float)):
        return calculate(*args, **kwargs)

    # If first arg is str and quantity_kg is passed
    commodity = kwargs.get("commodity") if "commodity" in kwargs else (args[0] if len(args) > 0 else "tomato")
    quantity_kg = kwargs.get("quantity_kg") if "quantity_kg" in kwargs else (args[1] if len(args) > 1 else 100.0)
    grade = kwargs.get("grade") if "grade" in kwargs else (args[2] if len(args) > 2 else "A")
    freshness_risk = kwargs.get("freshness_risk") if "freshness_risk" in kwargs else (args[3] if len(args) > 3 else "LOW")
    distance_km = kwargs.get("distance_km") if "distance_km" in kwargs else (args[4] if len(args) > 4 else 0.0)
    handling_cost = kwargs.get("handling_cost") if "handling_cost" in kwargs else (args[5] if len(args) > 5 else 2.0)

    c_str = commodity.slug if hasattr(commodity, "slug") else str(commodity).lower()
    base = BASE_PRICE.get(c_str, 30.0)

    calc = calculate(base_price=base, grade=grade, distance_km=distance_km, handling=handling_cost, freshness_pct=freshness_risk)
    calc["commodity"] = c_str
    calc["quantity_kg"] = float(quantity_kg)
    calc["freshness_risk"] = str(freshness_risk).upper()
    calc["transport_cost_per_kg"] = round(float(distance_km) * 0.55, 2)
    calc["total_price"] = round(calc["final_price"] * float(quantity_kg), 2)
    return calc


def preview_price(commodity, quantity_kg=100.0, grade="A", freshness_risk="LOW", distance_km=0.0):
    return calculate_price(commodity, quantity_kg, grade, freshness_risk, distance_km)

