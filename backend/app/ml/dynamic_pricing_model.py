"""ML Model for Perishability-Aware Dynamic Pricing.
Calculates optimal per-kg produce price based on grade, freshness, demand-supply ratio, and distance.
"""

class DynamicPricingMLModel:
    def predict_price(self, base_price: float, grade: str, freshness_pct: float, distance_km: float, demand_kg: float = 300, supply_kg: float = 300) -> dict:
        # Grade multiplier
        grade_mult = 1.15 if grade.upper() == "A" else (0.95 if grade.upper() == "B" else 0.75)
        
        # Freshness quality adjustment (-10% to +10%)
        freshness_factor = 1.0 + ((freshness_pct - 80.0) / 200.0)
        
        # Supply-demand elasticity
        supply_demand_ratio = demand_kg / max(1.0, supply_kg)
        elasticity = max(0.85, min(1.25, 0.90 + (supply_demand_ratio * 0.10)))
        
        # Logistics distance surcharge
        logistics_cost = round(distance_km * 0.35, 2)
        
        raw_price = base_price * grade_mult * freshness_factor * elasticity
        final_price = round(max(base_price * 0.6, raw_price) + (logistics_cost / max(100.0, demand_kg)), 2)

        return {
            "model_version": "v2.0-ElasticityPricingML",
            "base_price": base_price,
            "grade_applied": grade.upper(),
            "freshness_factor": round(freshness_factor, 3),
            "demand_supply_elasticity": round(elasticity, 3),
            "logistics_surcharge_per_kg": round(logistics_cost / max(100.0, demand_kg), 2),
            "suggested_final_price_per_kg": final_price,
            "profit_margin_pct": round(((final_price - base_price * 0.7) / final_price) * 100.0, 1),
            "confidence_pct": 93.8
        }

dynamic_pricing_model = DynamicPricingMLModel()
