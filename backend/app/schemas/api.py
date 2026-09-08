from pydantic import BaseModel, Field
from typing import Optional

class LoginIn(BaseModel):
    email: str
    password: str

class OrderItemIn(BaseModel):
    commodity: str
    quantity_kg: float = Field(gt=0)

class OrderCreate(BaseModel):
    items: list[OrderItemIn]
    delivery_address: str
    delivery_lat: float
    delivery_lon: float
    delivery_window: str = '09:00-12:00'

class GradeIn(BaseModel):
    visual_quality: float = Field(ge=0, le=100)
    damage_pct: float = Field(ge=0, le=100)
    freshness: float = Field(ge=0, le=100)
    temperature_c: float
    handling_delay_min: float = Field(ge=0)
    confirmed_grade: Optional[str] = None

class FreshnessIn(BaseModel):
    commodity: str
    harvest_date: str
    temperature_c: float
    handling_delay_min: float
    storage_duration_days: float
    grade: str = 'A'

class LocationIn(BaseModel):
    driver_id: int
    lat: float
    lon: float
    speed_kmh: float = 25

class DemoActionIn(BaseModel):
    action: str
