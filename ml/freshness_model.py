"""Small explainable prototype model used by the backend freshness service.
The production hook can replace this formula with a trained regression model without changing API contracts.
"""
def freshness_score(age_days, temperature_error, handling_hours, sensitivity, grade_penalty=0):
    return max(0.0, min(100.0, 100 - age_days*10*sensitivity - temperature_error*4*sensitivity - handling_hours*1.5 - grade_penalty))
