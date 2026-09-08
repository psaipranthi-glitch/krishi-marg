from ortools.constraint_solver import pywrapcp, routing_enums_pb2
import math

def optimize_route(stops):
    # stops: [{name,lat,lon,demand_kg,time_window:[start,end]}], first is depot
    if len(stops)<2: return {'order':list(range(len(stops))),'distance_km':0,'eta_min':0}
    n=len(stops)
    manager=pywrapcp.RoutingIndexManager(n,1,0)
    routing=pywrapcp.RoutingModel(manager)
    def dist(i,j):
        a,b=stops[manager.IndexToNode(i)],stops[manager.IndexToNode(j)]
        return int(math.hypot((a['lat']-b['lat'])*111,(a['lon']-b['lon'])*96)*1000)
    idx=routing.RegisterTransitCallback(dist)
    routing.SetArcCostEvaluatorOfAllVehicles(idx)
    routing.AddDimension(idx,0,300000,True,'Distance')
    params=pywrapcp.DefaultRoutingSearchParameters()
    params.first_solution_strategy=routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
    params.local_search_metaheuristic=routing_enums_pb2.LocalSearchMetaheuristic.GUIDED_LOCAL_SEARCH
    params.time_limit.seconds=2
    sol=routing.SolveWithParameters(params)
    if not sol: return {'order':list(range(n)),'distance_km':0,'eta_min':0}
    index=routing.Start(0); order=[]; total=0
    while not routing.IsEnd(index):
        node=manager.IndexToNode(index); order.append(node)
        nxt=sol.Value(routing.NextVar(index)); total+=routing.GetArcCostForVehicle(index,nxt,0); index=nxt
    order.append(manager.IndexToNode(index))
    distance_km=total/1000
    return {'order':order,'distance_km':round(distance_km,1),'eta_min':round(distance_km/28*60+len(order)*4)}
