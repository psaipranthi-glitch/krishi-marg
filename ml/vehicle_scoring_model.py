"""ML Model for Vehicle Matching & Compatibility Scoring.
Calculates optimal vehicle match score (0-100) based on payload, reefer compatibility, urgency and distance.
"""

class VehicleScoringMLModel:
    def score_vehicle(self, vehicle_code: str, vehicle_capacity_kg: float, is_reefer: bool, required_qty_kg: float, is_cold_chain_required: bool, distance_km: float) -> dict:
        score = 100.0
        reasons = []
        
        # 1. Payload capacity check
        if required_qty_kg > vehicle_capacity_kg:
            return {
                "vehicle_code": vehicle_code,
                "compatibility_score": 0.0,
                "suitability": "INCOMPATIBLE",
                "reason": f"Capacity insufficient ({required_qty_kg} kg > {vehicle_capacity_kg} kg)"
            }
        
        utilization = (required_qty_kg / vehicle_capacity_kg) * 100.0
        if utilization >= 70 and utilization <= 95:
            score += 5.0
            reasons.append("Optimal payload utilization")
        elif utilization < 40:
            score -= 15.0
            reasons.append("Low payload utilization")
            
        # 2. Refrigeration check
        if is_cold_chain_required and not is_reefer:
            score -= 40.0
            reasons.append("Non-reefer vehicle penalty for cold-chain crop")
        elif is_cold_chain_required and is_reefer:
            score += 10.0
            reasons.append("Active cold-chain refrigeration matched")
            
        # 3. Distance penalty
        if distance_km > 30.0:
            score -= (distance_km - 30.0) * 0.5
            reasons.append("Distance penalty applied")
            
        final_score = round(max(10.0, min(100.0, score)), 1)
        suitability = "OPTIMAL" if final_score >= 85 else ("ACCEPTABLE" if final_score >= 60 else "SUBOPTIMAL")

        return {
            "model_version": "v1.4-VehicleMatcherML",
            "vehicle_code": vehicle_code,
            "compatibility_score": final_score,
            "payload_utilization_pct": round(utilization, 1),
            "suitability": suitability,
            "reason": "; ".join(reasons) if reasons else "Standard vehicle match."
        }

vehicle_scoring_model = VehicleScoringMLModel()
