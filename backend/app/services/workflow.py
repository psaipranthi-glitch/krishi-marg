from fastapi import HTTPException

STATES = [
    "CREATED",
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
    "CANCELLED",
]
ORDER_STATES = STATES

ALLOWED = {
    "CREATED": {"AGGREGATING", "CANCELLED"},
    "AGGREGATING": {"MATCHED", "CANCELLED"},
    "MATCHED": {"PICKUP_ASSIGNED", "CANCELLED"},
    "PICKUP_ASSIGNED": {"PICKED_UP", "CANCELLED"},
    "PICKED_UP": {"AT_COLLECTION", "CANCELLED"},
    "AT_COLLECTION": {"INSPECTED", "CANCELLED"},
    "INSPECTED": {"PACKED", "CANCELLED"},
    "PACKED": {"AT_PACKAGE_CENTRE", "CANCELLED"},
    "AT_PACKAGE_CENTRE": {"AT_HUB", "CANCELLED"},
    "AT_HUB": {"OUT_FOR_DELIVERY", "CANCELLED"},
    "OUT_FOR_DELIVERY": {"DELIVERED", "CANCELLED"},
    "DELIVERED": set(),
    "CANCELLED": set(),
}


def can_transition(current: str, target: str) -> bool:
    return target in ALLOWED.get(current, set())


def transition(order_or_current, target: str):
    if hasattr(order_or_current, "status"):
        current = order_or_current.status
        if not can_transition(current, target):
            raise HTTPException(400, f"Invalid workflow transition: {current} -> {target}")
        order_or_current.status = target
        return order_or_current
    else:
        current = str(order_or_current)
        if not can_transition(current, target):
            raise HTTPException(400, f"Invalid workflow transition: {current} -> {target}")
        return target

