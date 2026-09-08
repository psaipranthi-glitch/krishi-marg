from datetime import datetime, date
from sqlalchemy import String, Integer, Float, Boolean, DateTime, Date, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column
from ..database import Base

class User(Base):
    __tablename__='users'
    id: Mapped[int]=mapped_column(primary_key=True)
    email: Mapped[str]=mapped_column(String(180), unique=True, index=True)
    password_hash: Mapped[str]=mapped_column(String(255))
    role: Mapped[str]=mapped_column(String(30), index=True)
    name: Mapped[str]=mapped_column(String(120))
    created_at: Mapped[datetime]=mapped_column(DateTime, default=datetime.utcnow)

class Farmer(Base):
    __tablename__='farmers'
    id: Mapped[int]=mapped_column(primary_key=True)
    user_id: Mapped[int|None]=mapped_column(ForeignKey('users.id'), nullable=True)
    farmer_code: Mapped[str]=mapped_column(String(40), unique=True)
    name: Mapped[str]=mapped_column(String(120))
    phone: Mapped[str]=mapped_column(String(30))
    village: Mapped[str]=mapped_column(String(120))
    lat: Mapped[float]=mapped_column(Float)
    lon: Mapped[float]=mapped_column(Float)

class Customer(Base):
    __tablename__='customers'
    id: Mapped[int]=mapped_column(primary_key=True)
    user_id: Mapped[int|None]=mapped_column(ForeignKey('users.id'), nullable=True)
    name: Mapped[str]=mapped_column(String(120))
    address: Mapped[str]=mapped_column(String(220))
    lat: Mapped[float]=mapped_column(Float)
    lon: Mapped[float]=mapped_column(Float)

class Driver(Base):
    __tablename__='drivers'
    id: Mapped[int]=mapped_column(primary_key=True)
    user_id: Mapped[int|None]=mapped_column(ForeignKey('users.id'), nullable=True)
    driver_code: Mapped[str]=mapped_column(String(40), unique=True)
    name: Mapped[str]=mapped_column(String(120))
    available: Mapped[bool]=mapped_column(Boolean, default=True)
    lat: Mapped[float]=mapped_column(Float)
    lon: Mapped[float]=mapped_column(Float)

class CollectionCentre(Base):
    __tablename__='collection_centres'
    id: Mapped[int]=mapped_column(primary_key=True)
    name: Mapped[str]=mapped_column(String(150))
    lat: Mapped[float]=mapped_column(Float)
    lon: Mapped[float]=mapped_column(Float)
    capacity_kg: Mapped[float]=mapped_column(Float, default=5000)

class PackageCentre(Base):
    __tablename__='package_centres'
    id: Mapped[int]=mapped_column(primary_key=True)
    name: Mapped[str]=mapped_column(String(150))
    lat: Mapped[float]=mapped_column(Float)
    lon: Mapped[float]=mapped_column(Float)
    capacity_kg: Mapped[float]=mapped_column(Float, default=10000)

class CityHub(Base):
    __tablename__='city_hubs'
    id: Mapped[int]=mapped_column(primary_key=True)
    name: Mapped[str]=mapped_column(String(150))
    lat: Mapped[float]=mapped_column(Float)
    lon: Mapped[float]=mapped_column(Float)

class Vehicle(Base):
    __tablename__='vehicles'
    id: Mapped[int]=mapped_column(primary_key=True)
    vehicle_code: Mapped[str]=mapped_column(String(40), unique=True)
    vehicle_type: Mapped[str]=mapped_column(String(80))
    capacity_kg: Mapped[float]=mapped_column(Float)
    refrigerated: Mapped[bool]=mapped_column(Boolean, default=False)
    available: Mapped[bool]=mapped_column(Boolean, default=True)
    lat: Mapped[float]=mapped_column(Float)
    lon: Mapped[float]=mapped_column(Float)

class Commodity(Base):
    __tablename__='commodities'
    id: Mapped[int]=mapped_column(primary_key=True)
    slug: Mapped[str]=mapped_column(String(40), unique=True)
    name: Mapped[str]=mapped_column(String(80))
    shelf_life_days: Mapped[float]=mapped_column(Float)
    min_temp_c: Mapped[float]=mapped_column(Float)
    max_temp_c: Mapped[float]=mapped_column(Float)
    base_price: Mapped[float]=mapped_column(Float)
    freshness_sensitivity: Mapped[float]=mapped_column(Float)
    urgency_factor: Mapped[float]=mapped_column(Float)

class FarmerSupply(Base):
    __tablename__='farmer_supply'
    id: Mapped[int]=mapped_column(primary_key=True)
    farmer_id: Mapped[int]=mapped_column(ForeignKey('farmers.id'))
    commodity_id: Mapped[int]=mapped_column(ForeignKey('commodities.id'))
    quantity_kg: Mapped[float]=mapped_column(Float)
    harvest_date: Mapped[date]=mapped_column(Date)
    available_qty_kg: Mapped[float]=mapped_column(Float)

class Order(Base):
    __tablename__='orders'
    id: Mapped[int]=mapped_column(primary_key=True)
    order_code: Mapped[str]=mapped_column(String(50), unique=True)
    customer_id: Mapped[int]=mapped_column(ForeignKey('customers.id'))
    status: Mapped[str]=mapped_column(String(40), default='CREATED', index=True)
    delivery_address: Mapped[str]=mapped_column(String(220))
    delivery_lat: Mapped[float]=mapped_column(Float)
    delivery_lon: Mapped[float]=mapped_column(Float)
    delivery_window: Mapped[str]=mapped_column(String(80), default='09:00-12:00')
    total_amount: Mapped[float]=mapped_column(Float, default=0)
    created_at: Mapped[datetime]=mapped_column(DateTime, default=datetime.utcnow)

class OrderItem(Base):
    __tablename__='order_items'
    id: Mapped[int]=mapped_column(primary_key=True)
    order_id: Mapped[int]=mapped_column(ForeignKey('orders.id'))
    commodity_id: Mapped[int]=mapped_column(ForeignKey('commodities.id'))
    quantity_kg: Mapped[float]=mapped_column(Float)
    unit_price: Mapped[float]=mapped_column(Float, default=0)
    grade: Mapped[str]=mapped_column(String(1), default='A')

class DemandAggregation(Base):
    __tablename__='demand_aggregations'
    id: Mapped[int]=mapped_column(primary_key=True)
    commodity_id: Mapped[int]=mapped_column(ForeignKey('commodities.id'))
    demand_kg: Mapped[float]=mapped_column(Float)
    available_supply_kg: Mapped[float]=mapped_column(Float)
    fulfillment_pct: Mapped[float]=mapped_column(Float)
    created_at: Mapped[datetime]=mapped_column(DateTime, default=datetime.utcnow)

class ProduceLot(Base):
    __tablename__='produce_lots'
    id: Mapped[int]=mapped_column(primary_key=True)
    lot_code: Mapped[str]=mapped_column(String(60), unique=True)
    farmer_id: Mapped[int]=mapped_column(ForeignKey('farmers.id'))
    commodity_id: Mapped[int]=mapped_column(ForeignKey('commodities.id'))
    quantity_kg: Mapped[float]=mapped_column(Float)
    harvest_date: Mapped[date]=mapped_column(Date)
    grade: Mapped[str]=mapped_column(String(1), default='A')
    freshness_pct: Mapped[float]=mapped_column(Float, default=90)
    remaining_life_days: Mapped[float]=mapped_column(Float, default=2)
    temperature_c: Mapped[float]=mapped_column(Float, default=8)
    status: Mapped[str]=mapped_column(String(40), default='AT_COLLECTION')
    collection_centre_id: Mapped[int|None]=mapped_column(ForeignKey('collection_centres.id'))
    package_centre_id: Mapped[int|None]=mapped_column(ForeignKey('package_centres.id'))
    hub_id: Mapped[int|None]=mapped_column(ForeignKey('city_hubs.id'))

class QualityInspection(Base):
    __tablename__='quality_inspections'
    id: Mapped[int]=mapped_column(primary_key=True)
    lot_id: Mapped[int]=mapped_column(ForeignKey('produce_lots.id'))
    visual_quality: Mapped[float]=mapped_column(Float)
    damage_pct: Mapped[float]=mapped_column(Float)
    freshness: Mapped[float]=mapped_column(Float)
    temperature_c: Mapped[float]=mapped_column(Float)
    handling_delay_min: Mapped[float]=mapped_column(Float)
    recommended_grade: Mapped[str]=mapped_column(String(1))
    confirmed_grade: Mapped[str|None]=mapped_column(String(1), nullable=True)
    created_at: Mapped[datetime]=mapped_column(DateTime, default=datetime.utcnow)

class PriceUpdate(Base):
    __tablename__='price_updates'
    id: Mapped[int]=mapped_column(primary_key=True)
    order_item_id: Mapped[int]=mapped_column(ForeignKey('order_items.id'))
    base_price: Mapped[float]=mapped_column(Float)
    grade_adjustment: Mapped[float]=mapped_column(Float)
    distance_cost: Mapped[float]=mapped_column(Float)
    handling_cost: Mapped[float]=mapped_column(Float)
    freshness_factor: Mapped[float]=mapped_column(Float)
    final_price: Mapped[float]=mapped_column(Float)
    created_at: Mapped[datetime]=mapped_column(DateTime, default=datetime.utcnow)

class PickupTask(Base):
    __tablename__='pickup_tasks'
    id: Mapped[int]=mapped_column(primary_key=True)
    order_id: Mapped[int]=mapped_column(ForeignKey('orders.id'))
    farmer_id: Mapped[int]=mapped_column(ForeignKey('farmers.id'))
    driver_id: Mapped[int|None]=mapped_column(ForeignKey('drivers.id'), nullable=True)
    vehicle_id: Mapped[int|None]=mapped_column(ForeignKey('vehicles.id'), nullable=True)
    status: Mapped[str]=mapped_column(String(40), default='ASSIGNED')

class PackageTask(Base):
    __tablename__='package_tasks'
    id: Mapped[int]=mapped_column(primary_key=True)
    lot_id: Mapped[int]=mapped_column(ForeignKey('produce_lots.id'))
    package_centre_id: Mapped[int]=mapped_column(ForeignKey('package_centres.id'))
    status: Mapped[str]=mapped_column(String(40), default='RECEIVED')

class HubTask(Base):
    __tablename__='hub_tasks'
    id: Mapped[int]=mapped_column(primary_key=True)
    lot_id: Mapped[int]=mapped_column(ForeignKey('produce_lots.id'))
    hub_id: Mapped[int]=mapped_column(ForeignKey('city_hubs.id'))
    status: Mapped[str]=mapped_column(String(40), default='INBOUND')

class DeliveryTask(Base):
    __tablename__='delivery_tasks'
    id: Mapped[int]=mapped_column(primary_key=True)
    order_id: Mapped[int]=mapped_column(ForeignKey('orders.id'))
    driver_id: Mapped[int|None]=mapped_column(ForeignKey('drivers.id'), nullable=True)
    vehicle_id: Mapped[int|None]=mapped_column(ForeignKey('vehicles.id'), nullable=True)
    status: Mapped[str]=mapped_column(String(40), default='READY')
    eta_min: Mapped[int]=mapped_column(Integer, default=30)

class Route(Base):
    __tablename__='routes'
    id: Mapped[int]=mapped_column(primary_key=True)
    route_code: Mapped[str]=mapped_column(String(50), unique=True)
    vehicle_id: Mapped[int|None]=mapped_column(ForeignKey('vehicles.id'), nullable=True)
    distance_km: Mapped[float]=mapped_column(Float, default=0)
    eta_min: Mapped[float]=mapped_column(Float, default=0)
    status: Mapped[str]=mapped_column(String(40), default='PLANNED')

class RouteStop(Base):
    __tablename__='route_stops'
    id: Mapped[int]=mapped_column(primary_key=True)
    route_id: Mapped[int]=mapped_column(ForeignKey('routes.id'))
    sequence: Mapped[int]=mapped_column(Integer)
    stop_type: Mapped[str]=mapped_column(String(30))
    reference_id: Mapped[int]=mapped_column(Integer)
    lat: Mapped[float]=mapped_column(Float)
    lon: Mapped[float]=mapped_column(Float)

class GPSLocation(Base):
    __tablename__='gps_locations'
    id: Mapped[int]=mapped_column(primary_key=True)
    driver_id: Mapped[int]=mapped_column(ForeignKey('drivers.id'))
    route_id: Mapped[int|None]=mapped_column(ForeignKey('routes.id'), nullable=True)
    lat: Mapped[float]=mapped_column(Float)
    lon: Mapped[float]=mapped_column(Float)
    speed_kmh: Mapped[float]=mapped_column(Float, default=0)
    recorded_at: Mapped[datetime]=mapped_column(DateTime, default=datetime.utcnow)

class Notification(Base):
    __tablename__='notifications'
    id: Mapped[int]=mapped_column(primary_key=True)
    user_id: Mapped[int|None]=mapped_column(ForeignKey('users.id'), nullable=True)
    message: Mapped[str]=mapped_column(Text)
    severity: Mapped[str]=mapped_column(String(20), default='info')
    read: Mapped[bool]=mapped_column(Boolean, default=False)
    created_at: Mapped[datetime]=mapped_column(DateTime, default=datetime.utcnow)

class Alert(Base):
    __tablename__='alerts'
    id: Mapped[int]=mapped_column(primary_key=True)
    alert_type: Mapped[str]=mapped_column(String(50))
    message: Mapped[str]=mapped_column(Text)
    severity: Mapped[str]=mapped_column(String(20), default='warning')
    status: Mapped[str]=mapped_column(String(20), default='OPEN')
    created_at: Mapped[datetime]=mapped_column(DateTime, default=datetime.utcnow)

class Forecast(Base):
    __tablename__='forecasts'
    id: Mapped[int]=mapped_column(primary_key=True)
    commodity_id: Mapped[int]=mapped_column(ForeignKey('commodities.id'))
    forecast_date: Mapped[date]=mapped_column(Date)
    demand_kg: Mapped[float]=mapped_column(Float)
    trend_pct: Mapped[float]=mapped_column(Float)
    confidence_pct: Mapped[float]=mapped_column(Float)

class FreshnessPrediction(Base):
    __tablename__='freshness_predictions'
    id: Mapped[int]=mapped_column(primary_key=True)
    lot_id: Mapped[int]=mapped_column(ForeignKey('produce_lots.id'))
    freshness_pct: Mapped[float]=mapped_column(Float)
    remaining_life_days: Mapped[float]=mapped_column(Float)
    spoilage_risk: Mapped[str]=mapped_column(String(20))
    urgency: Mapped[str]=mapped_column(String(20))
    created_at: Mapped[datetime]=mapped_column(DateTime, default=datetime.utcnow)

class VehicleMatch(Base):
    __tablename__='vehicle_matches'
    id: Mapped[int]=mapped_column(primary_key=True)
    order_id: Mapped[int]=mapped_column(ForeignKey('orders.id'))
    vehicle_id: Mapped[int]=mapped_column(ForeignKey('vehicles.id'))
    score: Mapped[float]=mapped_column(Float)
    reason: Mapped[str]=mapped_column(Text)

class AuditLog(Base):
    __tablename__='audit_logs'
    id: Mapped[int]=mapped_column(primary_key=True)
    entity_type: Mapped[str]=mapped_column(String(50))
    entity_id: Mapped[int]=mapped_column(Integer)
    action: Mapped[str]=mapped_column(String(80))
    details: Mapped[str]=mapped_column(Text)
    created_at: Mapped[datetime]=mapped_column(DateTime, default=datetime.utcnow)
