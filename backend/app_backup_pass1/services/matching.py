import math

def km(a,b,c,d):
    return math.hypot((a-c)*111,(b-d)*96)

def match_vehicles(vehicles, order_qty, commodity, urgency, origin, destination):
    out=[]
    for v in vehicles:
        if not v.available or v.capacity_kg<order_qty: continue
        d=km(v.lat,v.lon,origin[0],origin[1])
        score=100-min(35,d*2)-max(0,(v.capacity_kg-order_qty)/max(v.capacity_kg,1))*15
        if urgency=='IMMEDIATE': score+=10
        if commodity in {'spinach','tomato'} and v.refrigerated: score+=15
        reason=f'{v.capacity_kg:.0f} kg capacity; {d:.1f} km away; '+('cold-chain compatible; ' if v.refrigerated else '')+'freshness urgency considered.'
        out.append((v,round(score,1),reason))
    return sorted(out,key=lambda x:x[1],reverse=True)
