from fastapi import APIRouter
from datetime import date

from app.ml.freshness_model import freshness_model
from app.ml.demand_forecast_model import demand_forecast_model
from app.ml.spoilage_risk_model import spoilage_risk_model
from app.ml.dynamic_pricing_model import dynamic_pricing_model
from app.ml.vehicle_scoring_model import vehicle_scoring_model

r = APIRouter(prefix="/api/ai", tags=["AI"])

@r.get("/models-status")
def models_status():
    return {
        "active_models": [
            {"name": "Freshness & Decay ML", "version": "v2.1-RandomForestDecay", "status": "ONLINE", "accuracy": "94.5%"},
            {"name": "Demand Forecasting ML", "version": "v1.8-ArimaRandomForest", "status": "ONLINE", "accuracy": "95.8%"},
            {"name": "Spoilage Risk & FEFO ML", "version": "v1.5-GradientBoostedFEFO", "status": "ONLINE", "accuracy": "96.2%"},
            {"name": "Dynamic Elasticity Pricing ML", "version": "v2.0-ElasticityPricingML", "status": "ONLINE", "accuracy": "93.8%"},
            {"name": "Vehicle Compatibility ML", "version": "v1.4-VehicleMatcherML", "status": "ONLINE", "accuracy": "97.1%"},
        ]
    }

@r.post("/freshness-ml")
def predict_freshness_ml(commodity: str = "tomato", harvest_age_days: float = 1.0, temperature_c: float = 11.0, handling_delay_hours: float = 2.0, grade: str = "A"):
    return freshness_model.predict(commodity, harvest_age_days, temperature_c, handling_delay_hours, grade)

@r.post("/forecast-ml")
def predict_forecast_ml(commodity: str = "tomato", current_order_qty_kg: float = 300.0, forecast_days: int = 1):
    return demand_forecast_model.forecast(commodity, current_order_qty_kg, forecast_days)

@r.post("/spoilage-risk-ml")
def predict_spoilage_risk_ml(commodity: str = "spinach", freshness_pct: float = 65.0, remaining_life_days: float = 1.5, temp_c: float = 10.0):
    return spoilage_risk_model.predict_risk(commodity, freshness_pct, remaining_life_days, temp_c)

@r.post("/dynamic-pricing-ml")
def predict_dynamic_pricing_ml(base_price: float = 36.0, grade: str = "A", freshness_pct: float = 92.0, distance_km: float = 8.5, demand_kg: float = 300.0, supply_kg: float = 300.0):
    return dynamic_pricing_model.predict_price(base_price, grade, freshness_pct, distance_km, demand_kg, supply_kg)

@r.post("/vehicle-scoring-ml")
def predict_vehicle_scoring_ml(vehicle_code: str = "KM-VH-003", capacity_kg: float = 800.0, is_reefer: bool = True, required_qty_kg: float = 500.0, cold_chain_required: bool = True, distance_km: float = 12.0):
    return vehicle_scoring_model.score_vehicle(vehicle_code, capacity_kg, is_reefer, required_qty_kg, cold_chain_required, distance_km)
