from datetime import date
from ..models import Commodity

def predict(commodity: Commodity, harvest_date: date, temperature_c: float, handling_delay_min: float, storage_duration_days: float, grade: str):
    age=(date.today()-harvest_date).days + storage_duration_days + handling_delay_min/1440
    temp_mid=(commodity.min_temp_c+commodity.max_temp_c)/2
    temp_penalty=max(0, abs(temperature_c-temp_mid)-2)*commodity.freshness_sensitivity*4
    age_penalty=(age/max(commodity.shelf_life_days,0.1))*72*commodity.freshness_sensitivity
    grade_penalty={'A':0,'B':8,'C':18}.get(grade,10)
    freshness=max(0,min(100,100-age_penalty-temp_penalty-grade_penalty))
    remaining=max(0, commodity.shelf_life_days-age)
    risk='LOW' if freshness>=75 else 'MEDIUM' if freshness>=50 else 'HIGH'
    urgency='NORMAL' if remaining>2 else 'PRIORITY' if remaining>1 else 'IMMEDIATE'
    return {'freshness_pct':round(freshness,1),'remaining_life_days':round(remaining,2),'spoilage_risk':risk,'urgency':urgency}
