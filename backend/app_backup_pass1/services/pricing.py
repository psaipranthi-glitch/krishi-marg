def calculate(base_price, grade, distance_km, handling, freshness_pct):
    grade_adj={'A':1.08,'B':0.96,'C':0.78}.get(grade,1)
    freshness_factor=1.05 if freshness_pct>=80 else 0.98 if freshness_pct>=60 else 0.90
    distance_cost=distance_km*0.55
    handling_cost=handling
    final=(base_price*grade_adj + distance_cost + handling_cost)*freshness_factor
    return {'base_price':round(base_price,2),'grade_adjustment':round(base_price*(grade_adj-1),2),'distance_cost':round(distance_cost,2),'handling_cost':round(handling_cost,2),'freshness_factor':round(freshness_factor,2),'final_price':round(final,2)}
