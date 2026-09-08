from datetime import date,timedelta
from sqlalchemy import select
from ..database import Base,engine,SessionLocal
from ..models import *
from ..services.auth import hash_password
Base.metadata.create_all(bind=engine)

def seed():
    db=SessionLocal()
    try:
        if db.scalar(select(User).limit(1)): print('Seed already exists'); return
        roles=[('admin@krishimarg.local','admin','Aarav Mehta'),('farmer@krishimarg.local','farmer','Ramesh Kumar'),('customer@krishimarg.local','customer','Ananya Rao'),('driver@krishimarg.local','driver','Ramesh Driver'),('collection@krishimarg.local','collection','Priya Sharma'),('package@krishimarg.local','package','Suresh R.'),('hub@krishimarg.local','hub','Kiran Hub Manager')]
        users=[]
        for email,role,name in roles:
            u=User(email=email,password_hash=hash_password('Krishi@123'),role=role,name=name); db.add(u); users.append(u)
        db.flush()
        commodities=[('onion','Onion',12,5,12,28,0.65,0.9),('tomato','Tomato',7,8,14,36,0.9,1.1),('potato','Potato',18,6,18,24,0.45,0.7),('spinach','Spinach',3,2,8,42,1.2,1.5)]
        for x in commodities: db.add(Commodity(slug=x[0],name=x[1],shelf_life_days=x[2],min_temp_c=x[3],max_temp_c=x[4],base_price=x[5],freshness_sensitivity=x[6],urgency_factor=x[7]))
        db.flush(); cm={c.slug:c for c in db.scalars(select(Commodity)).all()}
        coords=[('Shamshabad',17.2510,78.4290),('LB Nagar',17.3457,78.5522),('Kukatpally',17.4849,78.4138),('Gachibowli',17.4401,78.3489),('Uppal',17.4062,78.5591),('Medchal',17.6300,78.4810),('Secunderabad',17.4399,78.4983),('Miyapur',17.4969,78.3498),('Kompally',17.5440,78.4880),('Nanakramguda',17.4145,78.3420)]
        farmers=[]
        for i,(place,lat,lon) in enumerate(coords,1):
            f=Farmer(user_id=users[1].id if i==1 else None,farmer_code=f'KM-FMR-2026-{i:04d}',name=['Ramesh Kumar','Savitri Devi','Ravi Naik','Lakshmi Rao','Mahesh Reddy'][i%5],phone=f'+91 98765 {43000+i:05d}',village=place,lat=lat,lon=lon); db.add(f); farmers.append(f)
        db.flush()
        for i,f in enumerate(farmers):
            for j,slug in enumerate(['tomato','onion','potato','spinach']):
                qty=120+(i*23)+(j*40); db.add(FarmerSupply(farmer_id=f.id,commodity_id=cm[slug].id,quantity_kg=qty,available_qty_kg=qty,harvest_date=date.today()-timedelta(days=(j%3))))
        cust_coords=[(17.385,78.4867),(17.452,78.367),(17.475,78.430),(17.350,78.580),(17.525,78.400),(17.420,78.520),(17.460,78.500),(17.390,78.350),(17.510,78.470),(17.320,78.450)]
        for i,(lat,lon) in enumerate(cust_coords,1): db.add(Customer(user_id=users[2].id if i==1 else None,name=f'Customer {i}',address=f'Hyderabad Delivery Zone {i}',lat=lat,lon=lon))
        for i,(place,lat,lon) in enumerate(coords[:8],1): db.add(Driver(user_id=users[3].id if i==1 else None,driver_code=f'KM-DRV-{i:03d}',name=f'Driver {i}',available=True,lat=lat,lon=lon))
        for i,(place,lat,lon) in enumerate(coords[:3],1): db.add(CollectionCentre(name=f'KM Collection – {place}',lat=lat,lon=lat and lon,capacity_kg=5000))
        db.add(PackageCentre(name='KM Packhouse – Hyderabad',lat=17.4480,lon=78.3910,capacity_kg=12000)); db.add(PackageCentre(name='KM Packhouse – Medchal',lat=17.6300,lon=78.4810,capacity_kg=12000))
        db.add(CityHub(name='Hyderabad Central Hub',lat=17.3850,lon=78.4867)); db.add(CityHub(name='West Hyderabad Hub',lat=17.4401,lon=78.3489))
        for i in range(1,11): db.add(Vehicle(vehicle_code=f'KM-VH-{i:03d}',vehicle_type=['Mini Truck','Tata Ace','Reefer Van'][i%3],capacity_kg=[500,800,1200][i%3],refrigerated=i%3==2,available=True,lat=coords[i%10][1],lon=coords[i%10][2]))
        db.flush(); customer=db.scalar(select(Customer));
        o=Order(order_code='KM-DEMO-001',customer_id=customer.id,status='CREATED',delivery_address=customer.address,delivery_lat=customer.lat,delivery_lon=customer.lon,delivery_window='09:00-12:00')
        db.add(o); db.flush(); db.add(OrderItem(order_id=o.id,commodity_id=cm['tomato'].id,quantity_kg=300,unit_price=38,grade='A')); db.add(OrderItem(order_id=o.id,commodity_id=cm['tomato'].id,quantity_kg=200,unit_price=38,grade='A'))
        farmer=farmers[0]; cc=db.scalar(select(CollectionCentre)); pc=db.scalar(select(PackageCentre)); hub=db.scalar(select(CityHub)); lot=ProduceLot(lot_code='KM-LOT-2026-00421',farmer_id=farmer.id,commodity_id=cm['tomato'].id,quantity_kg=600,harvest_date=date.today(),grade='A',freshness_pct=92,remaining_life_days=6,temperature_c=11,collection_centre_id=cc.id,package_centre_id=pc.id,hub_id=hub.id,status='AT_COLLECTION'); db.add(lot)
        db.add(AuditLog(entity_type='demo',entity_id=o.id,action='DEMO_READY',details='Tomato order 500 kg staged for end-to-end demo'))
        db.commit(); print('Seed complete. Password for all demo users: Krishi@123')
    finally: db.close()
if __name__=='__main__': seed()
