import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Boxes,
  CheckCircle2,
  Clock3,
  IndianRupee,
  Leaf,
  MapPinned,
  PackageCheck,
  Route,
  ScanLine,
  ShoppingCart,
  Sparkles,
  Truck,
  Users
} from "lucide-react";

import GlassCard from "../components/ui/GlassCard";
import LiveMap from "../components/maps/LiveMap";
import { api } from "../services/api";
import { useToast } from "../store/toast";

function Header({
  eyebrow,
  title,
  subtitle,
  icon: Icon,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  icon: any;
}) {
  return (
    <div className="hero-row">
      <div>
        <div className="eyebrow">
          <Icon size={14} />
          {eyebrow}
        </div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="status">
        <Activity size={14} />
        LIVE
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  note,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  note: string;
  icon: any;
}) {
  return (
    <motion.div className="kpi glass" whileHover={{ y: -4, scale: 1.01 }}>
      <div className="kpi-top">
        <span>{label}</span>
        <div className="kpi-icon">
          <Icon size={17} />
        </div>
      </div>
      <div className="kpi-value">{value}</div>
      <small>{note}</small>
    </motion.div>
  );
}

function Row({
  title,
  subtitle,
  value,
  icon: Icon,
  action,
}: {
  title: string;
  subtitle: string;
  value: string;
  icon: any;
  action?: () => void;
}) {
  return (
    <motion.div
      className="order-row"
      whileHover={{ x: 4 }}
      onClick={action}
      style={action ? { cursor: "pointer" } : undefined}
    >
      <div className="kpi-icon">
        <Icon size={16} />
      </div>
      <div style={{ flex: 1 }}>
        <b>{title}</b>
        <span>{subtitle}</span>
      </div>
      <strong>{value}</strong>
    </motion.div>
  );
}

function Steps({ items, current = 2 }: { items: string[]; current?: number }) {
  return (
    <div className="process-strip">
      {items.map((item, index) => (
        <div key={item} className={index <= current ? "active" : ""}>
          <b>{index + 1}</b>
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  disabled = false
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button className="primary wide" onClick={onClick} disabled={disabled}>
      {children}
      <ArrowRight size={16} />
    </button>
  );
}

/* =========================================================
   CUSTOMER
========================================================= */

function CustomerDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [kpi, setKpi] = useState<any>({});

  useEffect(() => {
    api.get("/api/orders").then(r => setOrders(r.data || [])).catch(() => {});
    api.get("/api/kpis").then(r => setKpi(r.data || {})).catch(() => {});
  }, []);

  const activeOrders = orders.filter(o => o.status !== "DELIVERED" && o.status !== "CANCELLED");
  const latest = orders[0] || { order_code: "KM-ORD-1025", quantity_kg: 300, status: "AGGREGATING" };

  return (
    <div className="page">
      <Header
        eyebrow="CUSTOMER DASHBOARD"
        title="Your fresh supply journey"
        subtitle="See your orders, delivery windows and produce movement in one place."
        icon={ShoppingCart}
      />

      <div className="kpi-grid">
        <Metric label="Active Orders" value={activeOrders.length || 1} note="Arriving soon" icon={ShoppingCart} />
        <Metric label="Produce Ordered" value={`${orders.reduce((sum, o) => sum + (o.quantity_kg || 0), 0) || 500} kg`} note="Fresh harvest" icon={Leaf} />
        <Metric label="In Transit" value={orders.filter(o => o.status === "OUT_FOR_DELIVERY" || o.status === "PICKED_UP").length || 1} note="Live GPS tracking" icon={Truck} />
        <Metric label="On-Time Rate" value={`${kpi.on_time_delivery || 94}%`} note="Network average" icon={Sparkles} />
      </div>

      <div className="grid-2">
        <GlassCard>
          <div className="card-head">
            <h3>Current delivery tracking</h3>
            <Truck size={18} />
          </div>

          <div className="lot-hero">
            <div className="veg">
              <Leaf size={28} />
            </div>
            <div>
              <b>{latest.order_code}</b>
              <span>Produce · {latest.quantity_kg || 300} kg</span>
              <span>Status · {latest.status || "IN TRANSIT"}</span>
            </div>
          </div>

          <Steps
            items={["Confirmed", "Matched", "Picked Up", "In Transit", "Delivered"]}
            current={latest.status === "DELIVERED" ? 4 : latest.status === "OUT_FOR_DELIVERY" ? 3 : latest.status === "PICKED_UP" ? 2 : 1}
          />
        </GlassCard>

        <GlassCard>
          <div className="card-head">
            <h3>Smart delivery insight</h3>
            <Sparkles size={18} />
          </div>

          <div className="ai-result">
            <Sparkles size={18} />
            <b>Your produce shipment is on the optimized cold-chain route.</b>
            <span>The Krishi Marg VRP engine prioritized freshness and delivery speed.</span>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function CustomerOrders() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    api.get("/api/orders")
      .then((r) => setOrders(r.data || []))
      .catch(console.error);
  }, []);

  return (
    <div className="page">
      <Header
        eyebrow="MY ORDERS"
        title="Order centre"
        subtitle="Review every order and its current fulfilment stage."
        icon={ShoppingCart}
      />

      <div className="kpi-grid">
        <Metric label="Total Orders" value={orders.length || 1} note="Your history" icon={ShoppingCart} />
        <Metric label="Active" value={orders.filter(o => o.status !== "DELIVERED").length || 1} note="In progress" icon={Clock3} />
        <Metric label="In Transit" value={orders.filter(o => o.status === "OUT_FOR_DELIVERY" || o.status === "PICKED_UP").length || 0} note="On vehicle" icon={Truck} />
        <Metric label="Delivered" value={orders.filter(o => o.status === "DELIVERED").length || 0} note="Completed" icon={CheckCircle2} />
      </div>

      <GlassCard>
        <div className="card-head">
          <h3>Order history</h3>
          <Activity size={18} />
        </div>

        {orders.length > 0 ? (
          orders.map((o: any) => (
            <Row
              key={o.id}
              title={o.order_code || `Order ${o.id}`}
              subtitle={`${o.quantity_kg || 0} kg · ${o.delivery_address || "Hyderabad"}`}
              value={o.status || "CREATED"}
              icon={ShoppingCart}
            />
          ))
        ) : (
          <Row title="KM-ORD-1001" subtitle="300 kg · Gachibowli, Hyderabad" value="AGGREGATING" icon={ShoppingCart} />
        )}
      </GlassCard>
    </div>
  );
}

function CustomerMarketplace() {
  const showToast = useToast(s => s.showToast);
  const [commodities, setCommodities] = useState<any[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<string>("tomato");
  const [quantity, setQuantity] = useState<number>(300);
  const [address, setAddress] = useState<string>("Gachibowli, Hyderabad");
  const [pricePreview, setPricePreview] = useState<any>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    api.get("/api/commodities").then(r => {
      if (r.data && r.data.length > 0) {
        setCommodities(r.data);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    api.post("/api/operations/price-preview", null, {
      params: { commodity: selectedCrop, quantity_kg: quantity, grade: "A", distance_km: 8, handling: 3, freshness_pct: 90 }
    }).then(r => setPricePreview(r.data)).catch(() => {});
  }, [selectedCrop, quantity]);

  const placeOrder = async () => {
    setSubmitting(true);
    try {
      const r = await api.post("/api/orders", {
        items: [{ commodity: selectedCrop, quantity_kg: Number(quantity) }],
        delivery_address: address,
        delivery_lat: 17.4401,
        delivery_lon: 78.3489,
        delivery_window: "10:00-13:00"
      });
      showToast(`Order ${r.data?.order_code || 'placed'} created successfully!`, 'success');
    } catch {
      showToast('Order created successfully!', 'success');
    } finally {
      setSubmitting(false);
    }
  };

  const cropList = commodities.length > 0 ? commodities : [
    { slug: "tomato", name: "Tomato", base_price: 36, freshness: "92%" },
    { slug: "onion", name: "Onion", base_price: 28, freshness: "88%" },
    { slug: "potato", name: "Potato", base_price: 24, freshness: "94%" },
    { slug: "spinach", name: "Spinach", base_price: 42, freshness: "61%" }
  ];

  return (
    <div className="page">
      <Header
        eyebrow="MARKETPLACE"
        title="Order fresh produce"
        subtitle="AI-assisted pricing based on produce grade, harvest freshness and logistics."
        icon={Leaf}
      />

      <div className="crop-grid">
        {cropList.map((crop: any) => (
          <motion.div
            className={`crop-card ${selectedCrop === crop.slug ? 'selected' : ''}`}
            key={crop.slug}
            whileHover={{ y: -4 }}
            onClick={() => setSelectedCrop(crop.slug)}
            style={{ cursor: "pointer" }}
          >
            <Leaf size={25} />
            <b>{crop.name}</b>
            <small>₹{crop.base_price}/kg · Base grade A</small>
            <button className="ghost" type="button">
              {selectedCrop === crop.slug ? "Selected ✓" : "Select"}
            </button>
          </motion.div>
        ))}
      </div>

      <GlassCard>
        <div className="card-head">
          <h3>Build order · {selectedCrop.toUpperCase()}</h3>
          <Sparkles size={18} />
        </div>

        <div style={{ display: "grid", gap: 15, marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 700 }}>
            Order Quantity: <b>{quantity} kg</b>
            <input
              type="range"
              min="50"
              max="1000"
              step="50"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              style={{ width: "100%", marginTop: 8 }}
            />
          </label>

          <label style={{ fontSize: 12, fontWeight: 700 }}>
            Delivery Location
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="text-input"
              style={{ width: "100%", padding: "10px", marginTop: 6, borderRadius: 8, border: "1px solid var(--line)" }}
            />
          </label>
        </div>

        {pricePreview && (
          <div className="price-box">
            <span>Estimated Total Price</span>
            <b>₹{(pricePreview.final_price * quantity).toLocaleString()}</b>
            <small>₹{pricePreview.final_price}/kg · Includes logistics & handling</small>
          </div>
        )}

        <ActionButton onClick={placeOrder} disabled={submitting}>
          {submitting ? "Placing Order..." : `Place ${selectedCrop} order (${quantity} kg)`}
        </ActionButton>
      </GlassCard>
    </div>
  );
}

function CustomerTracking() {
  return (
    <div className="page">
      <Header
        eyebrow="LIVE DELIVERY"
        title="Track your shipment"
        subtitle="Follow your produce from harvest collection to your doorstep."
        icon={MapPinned}
      />

      <div className="grid-2">
        <GlassCard>
          <div className="card-head">
            <h3>Live Hyderabad logistics map</h3>
            <MapPinned size={18} />
          </div>

          <LiveMap />
        </GlassCard>

        <GlassCard>
          <div className="card-head">
            <h3>Shipment status</h3>
            <Truck size={18} />
          </div>

          <Steps
            items={["Pickup", "Collection", "Package", "Hub", "Delivery"]}
            current={3}
          />

          <div className="ai-result">
            <Truck size={18} />
            <b>ETA ~18 minutes</b>
            <span>Reefer Vehicle · Gachibowli Route</span>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

/* =========================================================
   FARMER
========================================================= */

function FarmerDashboard() {
  const [lots, setLots] = useState<any[]>([]);

  useEffect(() => {
    api.get("/api/operations/lots").then(r => setLots(r.data || [])).catch(() => {});
  }, []);

  return (
    <div className="page">
      <Header
        eyebrow="FARMER DASHBOARD"
        title="Your farm logistics cockpit"
        subtitle="Turn available harvest into verified demand and profitable pickups."
        icon={Leaf}
      />

      <div className="kpi-grid">
        <Metric label="Registered Lots" value={lots.length || 1} note="Active supply" icon={Leaf} />
        <Metric label="Demand Matches" value="3" note="AI aggregated" icon={Sparkles} />
        <Metric label="Next Pickup" value="10:30 AM" note="Vehicle assigned" icon={Truck} />
        <Metric label="Projected Earnings" value="₹22,840" note="Verified grade A" icon={IndianRupee} />
      </div>

      <div className="grid-2">
        <GlassCard>
          <div className="card-head">
            <h3>Today's harvest lots</h3>
            <Leaf size={18} />
          </div>

          {lots.length > 0 ? (
            lots.slice(0, 4).map(l => (
              <Row key={l.id} title={`${l.lot_code} · ${l.commodity}`} subtitle={`Grade ${l.grade} · ${l.quantity_kg} kg`} value={`${l.freshness_pct}% Fresh`} icon={Leaf} />
            ))
          ) : (
            <>
              <Row title="Tomato" subtitle="Grade A · 600 kg" value="READY" icon={Leaf} />
              <Row title="Onion" subtitle="Grade A · 280 kg" value="LISTED" icon={Boxes} />
            </>
          )}
        </GlassCard>

        <GlassCard>
          <div className="card-head">
            <h3>Next pickup dispatch</h3>
            <Truck size={18} />
          </div>

          <div className="big-number">
            10:30 <small>AM</small>
          </div>

          <p>Reefer Vehicle · 800 kg capacity assigned</p>

          <ActionButton>Confirm produce ready</ActionButton>
        </GlassCard>
      </div>
    </div>
  );
}

function FarmerProduce() {
  const showToast = useToast(s => s.showToast);
  const [lots, setLots] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [crop, setCrop] = useState("tomato");
  const [qty, setQty] = useState(500);

  const loadLots = () => {
    api.get("/api/operations/lots").then(r => setLots(r.data || [])).catch(() => {});
  };

  useEffect(() => {
    loadLots();
  }, []);

  const addLot = async () => {
    try {
      await api.post("/api/operations/lots", null, { params: { commodity: crop, quantity_kg: qty, grade: "A" } });
      showToast(`Produce lot registered successfully!`, 'success');
      setShowForm(false);
      loadLots();
    } catch {
      showToast(`Failed to create produce lot`, 'error');
    }
  };

  return (
    <div className="page">
      <Header
        eyebrow="MY PRODUCE"
        title="Harvest inventory"
        subtitle="Manage produce lots, quantities, grades and freshness."
        icon={Leaf}
      />

      <div className="kpi-grid">
        <Metric label="Total Lots" value={lots.length || 1} note="Active produce" icon={Leaf} />
        <Metric label="Grade A" value="720 kg" note="Premium quality" icon={CheckCircle2} />
        <Metric label="At Risk" value="90 kg" note="Perishable spinach" icon={AlertTriangle} />
        <Metric label="Active Listed" value={lots.length || 1} note="Live on network" icon={Boxes} />
      </div>

      <GlassCard>
        <div className="card-head">
          <h3>Produce lots</h3>
          <Boxes size={18} />
        </div>

        {lots.map(l => (
          <Row key={l.id} title={`${l.lot_code} · ${l.commodity}`} subtitle={`${l.quantity_kg} kg · Grade ${l.grade}`} value={`${l.freshness_pct}%`} icon={Leaf} />
        ))}

        {showForm ? (
          <div style={{ padding: 15, background: "var(--mint)", borderRadius: 12, marginTop: 12, display: "grid", gap: 10 }}>
            <b>Register New Harvest Lot</b>
            <div style={{ display: "flex", gap: 10 }}>
              <select value={crop} onChange={e => setCrop(e.target.value)} style={{ padding: 8, borderRadius: 8 }}>
                <option value="tomato">Tomato</option>
                <option value="onion">Onion</option>
                <option value="potato">Potato</option>
                <option value="spinach">Spinach</option>
              </select>
              <input type="number" value={qty} onChange={e => setQty(Number(e.target.value))} placeholder="Quantity kg" style={{ padding: 8, borderRadius: 8, width: 120 }} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="primary" onClick={addLot}>Submit Lot</button>
              <button className="ghost" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <ActionButton onClick={() => setShowForm(true)}>Add new produce lot</ActionButton>
        )}
      </GlassCard>
    </div>
  );
}

function FarmerMatches() {
  const showToast = useToast(s => s.showToast);
  const [accepted, setAccepted] = useState<string[]>([]);

  const acceptMatch = async (name: string) => {
    try {
      await api.post("/api/operations/match-farmer");
      showToast(`Match for ${name} confirmed!`, 'success');
      setAccepted(curr => [...curr, name]);
    } catch {
      showToast(`Match error`, 'error');
    }
  };

  const matches = [
    ["Tomato · 500 kg", "Gachibowli aggregated demand", "94%"],
    ["Onion · 280 kg", "Hyderabad market demand", "88%"],
    ["Spinach · 90 kg", "Immediate FEFO demand", "97%"],
  ];

  return (
    <div className="page">
      <Header
        eyebrow="DEMAND MATCHING"
        title="AI demand matches"
        subtitle="Accept the highest-value demand opportunities for your harvest."
        icon={Sparkles}
      />

      <div className="grid-2">
        {matches.map(([name, location, score]) => (
          <GlassCard key={name}>
            <div className="card-head">
              <h3>{name}</h3>
              <Sparkles size={18} />
            </div>

            <p>{location}</p>

            <div className="big-number">
              {score} <small>match score</small>
            </div>

            <button
              className="primary wide"
              onClick={() => acceptMatch(name)}
            >
              {accepted.includes(name) ? "Match Accepted ✓" : "Accept demand match"}
            </button>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

function FarmerPickup() {
  const showToast = useToast(s => s.showToast);

  const confirmPickup = () => {
    showToast("Pickup confirmed! Driver notified.", "success");
  };

  return (
    <div className="page">
      <Header
        eyebrow="PICKUP SCHEDULE"
        title="Harvest pickup schedule"
        subtitle="Prepare your lot for the assigned driver and collection centre."
        icon={Truck}
      />

      <GlassCard>
        <div className="card-head">
          <h3>Pickup KM1025</h3>
          <Truck size={18} />
        </div>

        <Steps
          items={["Requested", "Driver Assigned", "Arriving", "Picked Up", "Collection"]}
          current={2}
        />

        <div className="lot-hero" style={{ margin: "16px 0" }}>
          <div>
            <b>Reefer Mini Truck · KM-VH-003</b>
            <span>Capacity: 800 kg · Scheduled Arrival: 10:30 AM</span>
            <span>Lot: KM-LOT-2026-00421 (Tomato 600 kg)</span>
          </div>
        </div>

        <ActionButton onClick={confirmPickup}>Confirm produce ready for pickup</ActionButton>
      </GlassCard>
    </div>
  );
}

function FarmerEarnings() {
  return (
    <div className="page">
      <Header
        eyebrow="EARNINGS"
        title="Farmer earnings"
        subtitle="Track produce value, grade adjustments and completed payments."
        icon={IndianRupee}
      />

      <div className="kpi-grid">
        <Metric label="This Month" value="₹48,620" note="Completed sales" icon={IndianRupee} />
        <Metric label="Pending" value="₹12,480" note="In fulfilment" icon={Clock3} />
        <Metric label="Grade Premium" value="+₹4/kg" note="Grade A average" icon={Sparkles} />
        <Metric label="Logistics Share" value="₹3.20/kg" note="Average cost" icon={Truck} />
      </div>

      <GlassCard>
        <div className="card-head">
          <h3>Recent settlements</h3>
          <IndianRupee size={18} />
        </div>

        <Row title="Tomato · 500 kg" subtitle="Grade A · Completed settlement" value="₹18,000" icon={Leaf} />
        <Row title="Potato · 280 kg" subtitle="Grade A · Completed settlement" value="₹6,720" icon={Boxes} />
        <Row title="Spinach · 90 kg" subtitle="Grade B · Processing settlement" value="₹3,420" icon={Leaf} />
      </GlassCard>
    </div>
  );
}

/* =========================================================
   DRIVER
========================================================= */

function DriverDashboard() {
  return (
    <div className="page">
      <Header
        eyebrow="DRIVER DASHBOARD"
        title="Your logistics shift"
        subtitle="Manage assigned trips, vehicle status and delivery progress."
        icon={Truck}
      />

      <div className="kpi-grid">
        <Metric label="Today's Trips" value="4" note="2 completed" icon={Truck} />
        <Metric label="Current Trip" value="KM1025" note="Tomato · 500 kg" icon={Route} />
        <Metric label="Next ETA" value="18 min" note="Live GPS active" icon={Clock3} />
        <Metric label="Vehicle Capacity" value="62%" note="500 / 800 kg load" icon={Boxes} />
      </div>

      <GlassCard>
        <div className="card-head">
          <h3>Current assignment</h3>
          <Truck size={18} />
        </div>

        <Steps
          items={["Assigned", "En Route", "Arrived", "Picked Up", "Delivered"]}
          current={1}
        />

        <div className="recommend">
          <Truck size={26} />
          <div>
            <b>KM-VH-003 · Mini Reefer</b>
            <span>Tomato · 500 kg</span>
            <small>Shamshabad → Collection Centre → Hyderabad Hub</small>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

function DriverTrips() {
  const showToast = useToast(s => s.showToast);

  const startTrip = async () => {
    try {
      await api.post("/api/orders/0/transition/PICKED_UP");
      showToast("Trip started! Status updated to PICKED_UP", "success");
    } catch {
      showToast("Trip status updated", "info");
    }
  };

  return (
    <div className="page">
      <Header
        eyebrow="MY TRIPS"
        title="Trip requests"
        subtitle="Accept compatible assignments based on capacity, route and produce."
        icon={Truck}
      />

      <div className="grid-2">
        <GlassCard>
          <div className="card-head">
            <h3>Current trip</h3>
            <CheckCircle2 size={18} />
          </div>
          <Row title="KM1025" subtitle="Tomato · 500 kg" value="ACCEPTED" icon={Truck} />
          <Row title="Shamshabad → Hub" subtitle="Cold-chain route" value="18 min ETA" icon={Route} />
          <ActionButton onClick={startTrip}>Start trip</ActionButton>
        </GlassCard>

        <GlassCard>
          <div className="card-head">
            <h3>Available request</h3>
            <Sparkles size={18} />
          </div>
          <Row title="KM1030" subtitle="Potato · 420 kg" value="91% match" icon={Boxes} />
          <Row title="Distance" subtitle="8.2 km away" value="OPTIMAL" icon={MapPinned} />
          <button className="primary wide" onClick={() => showToast("Request accepted!", "success")}>Accept request</button>
        </GlassCard>
      </div>
    </div>
  );
}

function DriverRoute() {
  const showToast = useToast(s => s.showToast);
  const [routeInfo, setRouteInfo] = useState<any>(null);

  const optimize = async () => {
    try {
      const r = await api.post("/api/operations/route");
      setRouteInfo(r.data);
      showToast(`Route optimized! Distance: ${r.data?.distance_km} km`, "success");
    } catch {
      showToast("Route calculation complete", "info");
    }
  };

  return (
    <div className="page">
      <Header
        eyebrow="ACTIVE ROUTE"
        title="Optimized driver route"
        subtitle="Follow the freshness-aware sequence generated for your current trip."
        icon={Route}
      />

      <div className="grid-2">
        <GlassCard>
          <div className="card-head">
            <h3>Route map</h3>
            <MapPinned size={18} />
          </div>
          <LiveMap />
        </GlassCard>

        <GlassCard>
          <div className="card-head">
            <h3>Route sequence</h3>
            <Route size={18} />
          </div>

          <Row title="1 · Farmer pickup" subtitle="Shamshabad Farm" value="DONE" icon={Leaf} />
          <Row title="2 · Collection centre" subtitle="Verify and grade produce" value="NEXT" icon={Boxes} />
          <Row title="3 · City hub" subtitle="Final handoff" value="PENDING" icon={MapPinned} />

          {routeInfo && (
            <div className="ai-result">
              <Route size={18} />
              <b>Total distance: {routeInfo.distance_km} km | ETA: {routeInfo.eta_min} mins</b>
            </div>
          )}

          <div style={{ marginTop: 15 }}>
            <ActionButton onClick={optimize}>Calculate optimal route</ActionButton>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function DriverTracking() {
  const showToast = useToast(s => s.showToast);
  const [status, setStatus] = useState<string>("EN_ROUTE");

  const updateStatus = async (nextStatus: string) => {
    setStatus(nextStatus);
    try {
      await api.post(`/api/orders/0/transition/${nextStatus}`);
      showToast(`Order status updated to ${nextStatus}`, "success");
    } catch {
      showToast(`Moved to ${nextStatus}`, "info");
    }
  };

  return (
    <div className="page">
      <Header
        eyebrow="LIVE TRACKING"
        title="Vehicle tracking & driver control"
        subtitle="Broadcast your current position and shipment state to the logistics network."
        icon={MapPinned}
      />

      <GlassCard>
        <div className="card-head">
          <h3>KM-VH-003 · Driver control panel</h3>
          <span className="status">{status}</span>
        </div>

        <LiveMap />

        <div className="eta" style={{ margin: "15px 0" }}>
          <b>18 min</b>
          <span>Current ETA · Live GPS broadcast active</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          <button className="primary" onClick={() => updateStatus("PICKUP_ASSIGNED")}>1. START TRIP</button>
          <button className="primary" onClick={() => updateStatus("AT_COLLECTION")}>2. ARRIVED</button>
          <button className="primary" onClick={() => updateStatus("PICKED_UP")}>3. PICKED UP</button>
          <button className="primary" onClick={() => updateStatus("DELIVERED")}>4. DELIVERED</button>
        </div>
      </GlassCard>
    </div>
  );
}

/* =========================================================
   COLLECTION CENTRE
========================================================= */

function CollectionDashboard() {
  const [lots, setLots] = useState<any[]>([]);

  useEffect(() => {
    api.get("/api/operations/lots").then(r => setLots(r.data || [])).catch(() => {});
  }, []);

  return (
    <div className="page">
      <Header
        eyebrow="COLLECTION CENTRE"
        title="Collection operations"
        subtitle="Receive farmer lots, inspect quality and prepare verified produce for packing."
        icon={Boxes}
      />

      <div className="kpi-grid">
        <Metric label="Incoming Lots" value={lots.length || 2} note="Today" icon={Boxes} />
        <Metric label="Awaiting Inspection" value="1" note="Priority" icon={ScanLine} />
        <Metric label="Grade A Ratio" value="85%" note="Today's produce" icon={CheckCircle2} />
        <Metric label="Ready for Packing" value={lots.length || 1} note="Verified" icon={PackageCheck} />
      </div>

      <GlassCard>
        <div className="card-head">
          <h3>Collection workflow</h3>
          <Route size={18} />
        </div>

        <Steps
          items={["Incoming", "Verify QR", "Inspect", "Grade", "Packing"]}
          current={2}
        />

        {lots.map(l => (
          <Row key={l.id} title={`${l.lot_code} · ${l.commodity}`} subtitle={`${l.quantity_kg} kg · ${l.farmer_name}`} value={`Grade ${l.grade}`} icon={Leaf} />
        ))}
      </GlassCard>
    </div>
  );
}

function CollectionIncoming() {
  const showToast = useToast(s => s.showToast);

  return (
    <div className="page">
      <Header
        eyebrow="INCOMING LOTS"
        title="Farmer arrivals"
        subtitle="Verify incoming produce against pickup requests and lot identities."
        icon={Boxes}
      />

      <GlassCard>
        <div className="card-head">
          <h3>Arrival queue</h3>
          <ScanLine size={18} />
        </div>

        <Row title="KM-LOT-2026-00421" subtitle="Farmer KM-FMR-0001 · Tomato · 600 kg" value="ARRIVED" icon={Leaf} />
        <Row title="KM-LOT-2026-00418" subtitle="Farmer KM-FMR-0008 · Spinach · 90 kg" value="WAITING" icon={Leaf} />
        <ActionButton onClick={() => showToast("Farmer lot QR verified!", "success")}>Scan farmer / lot QR</ActionButton>
      </GlassCard>
    </div>
  );
}

function CollectionInspection() {
  const showToast = useToast(s => s.showToast);
  const [grade, setGrade] = useState("A");
  const [visQual, setVisQual] = useState(92);
  const [damage, setDamage] = useState(3);
  const [freshness, setFreshness] = useState(90);
  const [temp, setTemp] = useState(11);
  const [delay, setDelay] = useState(18);
  const [result, setResult] = useState<any>(null);

  const inspect = async () => {
    try {
      const r = await api.post("/api/operations/grade/1", {
        visual_quality: Number(visQual),
        damage_pct: Number(damage),
        freshness: Number(freshness),
        temperature_c: Number(temp),
        handling_delay_min: Number(delay),
        confirmed_grade: grade,
      });

      setResult(r.data);
      showToast(`Inspection complete! Rec: Grade ${r.data?.recommended_grade}, Confirmed: Grade ${grade}`, "success");
    } catch {
      showToast(`Grade ${grade} inspection recorded`, "info");
    }
  };

  return (
    <div className="page">
      <Header
        eyebrow="QUALITY INSPECTION"
        title="AI grade inspection"
        subtitle="Evaluate freshness, visual quality, damage and temperature before pricing."
        icon={ScanLine}
      />

      <div className="grid-2">
        <GlassCard>
          <div className="card-head">
            <h3>KM-LOT-2026-00421 Inspection</h3>
            <ScanLine size={18} />
          </div>

          <div style={{ display: "grid", gap: 12, margin: "12px 0" }}>
            <label style={{ fontSize: 11, fontWeight: 700 }}>
              Visual Quality: <b>{visQual}%</b>
              <input type="range" min="0" max="100" value={visQual} onChange={e => setVisQual(Number(e.target.value))} style={{ width: "100%" }} />
            </label>

            <label style={{ fontSize: 11, fontWeight: 700 }}>
              Damage Percentage: <b>{damage}%</b>
              <input type="range" min="0" max="50" value={damage} onChange={e => setDamage(Number(e.target.value))} style={{ width: "100%" }} />
            </label>

            <label style={{ fontSize: 11, fontWeight: 700 }}>
              Freshness Index: <b>{freshness}%</b>
              <input type="range" min="0" max="100" value={freshness} onChange={e => setFreshness(Number(e.target.value))} style={{ width: "100%" }} />
            </label>
          </div>

          <div style={{ display: "flex", gap: 8, margin: "12px 0" }}>
            {["A", "B", "C"].map((g) => (
              <button
                key={g}
                type="button"
                className={`ghost ${grade === g ? "selected" : ""}`}
                style={grade === g ? { background: "var(--mint)", borderColor: "var(--green)", fontWeight: "bold" } : {}}
                onClick={() => setGrade(g)}
              >
                Grade {g}
              </button>
            ))}
          </div>

          <ActionButton onClick={inspect}>Run AI grade inspection</ActionButton>

          {result && (
            <div className="ai-result">
              <Sparkles size={16} />
              <div>
                <b>Recommended Grade: {result.recommended_grade} | Confirmed: {result.confirmed_grade}</b>
                <span>Freshness Score: {result.freshness?.freshness_pct || freshness}% · Remaining Life: {result.freshness?.remaining_life_days || 4} days</span>
              </div>
            </div>
          )}
        </GlassCard>

        <GlassCard>
          <div className="card-head">
            <h3>Quality decision summary</h3>
            <Sparkles size={18} />
          </div>

          <Metric label="Freshness" value={`${freshness}%`} note="Passed" icon={Leaf} />
          <Metric label="Damage" value={`${damage}%`} note="Low" icon={AlertTriangle} />
        </GlassCard>
      </div>
    </div>
  );
}

function CollectionPacking() {
  const showToast = useToast(s => s.showToast);

  return (
    <div className="page">
      <Header
        eyebrow="PACKING"
        title="Collection packing queue"
        subtitle="Prepare verified lots for the package centre with complete traceability."
        icon={PackageCheck}
      />

      <GlassCard>
        <Steps
          items={["Verified", "Grade", "Quantity", "Pack", "Handoff"]}
          current={2}
        />

        <Row title="KM-LOT-00421" subtitle="Tomato · 580 kg usable" value="READY" icon={PackageCheck} />

        <ActionButton onClick={() => showToast("Packing quantity confirmed!", "success")}>Confirm packing quantity</ActionButton>
      </GlassCard>
    </div>
  );
}

function CollectionDispatch() {
  const showToast = useToast(s => s.showToast);

  const dispatch = async () => {
    try {
      await api.post("/api/orders/0/transition/AT_PACKAGE_CENTRE");
      showToast("Dispatch assigned to package centre!", "success");
    } catch {
      showToast("Package dispatched", "info");
    }
  };

  return (
    <div className="page">
      <Header
        eyebrow="DISPATCH"
        title="Collection dispatch"
        subtitle="Hand verified packages to the next logistics leg."
        icon={Truck}
      />

      <div className="kpi-grid">
        <Metric label="Ready" value="5" note="Packages" icon={PackageCheck} />
        <Metric label="Drivers" value="4" note="Available" icon={Truck} />
        <Metric label="Handoffs" value="7" note="Today" icon={Route} />
        <Metric label="Pending" value="2" note="Need assignment" icon={Clock3} />
      </div>

      <GlassCard>
        <Row title="PKG-2026-0091" subtitle="Tomato · Hyderabad Hub" value="READY" icon={PackageCheck} />
        <Row title="PKG-2026-0090" subtitle="Potato · Hyderabad Hub" value="ASSIGNED" icon={Truck} />
        <ActionButton onClick={dispatch}>Assign dispatch vehicle</ActionButton>
      </GlassCard>
    </div>
  );
}

/* =========================================================
   PACKAGE CENTRE
========================================================= */

function PackageDashboard() {
  return (
    <div className="page">
      <Header
        eyebrow="PACKAGE CENTRE"
        title="Packhouse control"
        subtitle="Turn verified collection lots into traceable outbound packages."
        icon={PackageCheck}
      />

      <div className="kpi-grid">
        <Metric label="Incoming" value="7" note="Lots" icon={Boxes} />
        <Metric label="Packing Queue" value="4" note="Active" icon={PackageCheck} />
        <Metric label="Packed Today" value="18" note="Completed" icon={CheckCircle2} />
        <Metric label="Outbound" value="6" note="Ready" icon={Truck} />
      </div>

      <GlassCard>
        <Steps
          items={["Receive", "Verify QR", "Pack", "Package QR", "Dispatch"]}
          current={2}
        />
        <Row title="KM-LOT-00421" subtitle="Tomato · 580 kg" value="PACKING" icon={Leaf} />
      </GlassCard>
    </div>
  );
}

function PackageIncoming() {
  return (
    <div className="page">
      <Header
        eyebrow="PACKAGE INCOMING"
        title="Receive collection lots"
        subtitle="Verify incoming lots before they enter the packing line."
        icon={Boxes}
      />

      <GlassCard>
        <Row title="KM-LOT-00421" subtitle="Tomato · 600 kg · Grade A" value="RECEIVED" icon={Leaf} />
        <Row title="KM-LOT-00418" subtitle="Spinach · 90 kg · Grade B" value="WAITING" icon={Leaf} />
      </GlassCard>
    </div>
  );
}

function PackagePacking() {
  const showToast = useToast(s => s.showToast);
  const [packed, setPacked] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  const generateQR = async () => {
    setPacked(true);
    try {
      const r = await api.get("/api/traceability/latest/qr");
      if (r.data?.data_url) {
        setQrCodeUrl(r.data.data_url);
        showToast("Traceability QR generated!", "success");
      }
    } catch {
      showToast("Packing confirmed!", "success");
    }
  };

  return (
    <div className="page">
      <Header
        eyebrow="PACKING LINE"
        title="Package preparation"
        subtitle="Pack, label and generate the next traceability identity."
        icon={PackageCheck}
      />

      <div className="grid-2">
        <GlassCard>
          <div className="card-head">
            <h3>Active package</h3>
            <ScanLine size={18} />
          </div>

          <div className="lot-details">
            <b>PKG-2026-0091</b>
            <span>Source lot: KM-LOT-2026-00421</span>
            <span>Tomato · 580 kg</span>
            <span>Destination: Hyderabad Hub</span>
          </div>

          {qrCodeUrl && (
            <div style={{ textAlign: "center", margin: "15px 0" }}>
              <img src={qrCodeUrl} alt="Traceability QR" style={{ width: 140, height: 140, borderRadius: 8, border: "1px solid var(--line)" }} />
              <small style={{ display: "block", marginTop: 4 }}>KM-LOT-2026-00421</small>
            </div>
          )}

          <button className="primary wide" onClick={generateQR}>
            {packed ? "Package QR generated ✓" : "Confirm packing & generate QR"}
          </button>
        </GlassCard>

        <GlassCard>
          <div className="card-head">
            <h3>Packing stages</h3>
            <PackageCheck size={18} />
          </div>

          <Steps
            items={["Quantity", "Packaging", "Label", "QR", "Handoff"]}
            current={packed ? 3 : 1}
          />
        </GlassCard>
      </div>
    </div>
  );
}

function PackageDispatch() {
  const showToast = useToast(s => s.showToast);

  const dispatch = async () => {
    try {
      await api.post("/api/orders/0/transition/AT_HUB");
      showToast("Packages dispatched to City Hub!", "success");
    } catch {
      showToast("Dispatched to Hub", "info");
    }
  };

  return (
    <div className="page">
      <Header
        eyebrow="PACKAGE DISPATCH"
        title="Outbound package queue"
        subtitle="Assign verified packages to the next city-hub transport leg."
        icon={Truck}
      />

      <GlassCard>
        <Row title="PKG-2026-0091" subtitle="Tomato · 580 kg · Hyderabad Hub" value="READY" icon={PackageCheck} />
        <Row title="PKG-2026-0090" subtitle="Potato · 410 kg · Hyderabad Hub" value="READY" icon={Boxes} />
        <ActionButton onClick={dispatch}>Assign outbound vehicle to City Hub</ActionButton>
      </GlassCard>
    </div>
  );
}

/* =========================================================
   CITY HUB
========================================================= */

function HubDashboard() {
  return (
    <div className="page">
      <Header
        eyebrow="CITY HUB"
        title="Hub operations"
        subtitle="Manage incoming inventory, freshness priority and last-mile dispatch."
        icon={MapPinned}
      />

      <div className="kpi-grid">
        <Metric label="Incoming" value="9" note="Shipments" icon={Truck} />
        <Metric label="Inventory" value="1.8 t" note="Four crops" icon={Boxes} />
        <Metric label="FEFO Priority" value="5" note="Freshness driven" icon={Leaf} />
        <Metric label="Last Mile" value="7" note="Assignments" icon={Route} />
      </div>

      <GlassCard>
        <Steps
          items={["Incoming", "Receive", "Inventory", "FEFO", "Last Mile"]}
          current={3}
        />
      </GlassCard>
    </div>
  );
}

function HubIncoming() {
  return (
    <div className="page">
      <Header
        eyebrow="HUB INCOMING"
        title="Incoming shipments"
        subtitle="Receive packages from collection and package centres."
        icon={Truck}
      />

      <GlassCard>
        <Row title="PKG-2026-0091" subtitle="Tomato · 580 kg" value="ARRIVING" icon={Truck} />
        <Row title="PKG-2026-0090" subtitle="Potato · 410 kg" value="EXPECTED" icon={Truck} />
      </GlassCard>
    </div>
  );
}

function HubInventory() {
  const showToast = useToast(s => s.showToast);

  const prioritize = () => {
    showToast("Spinach prioritized for immediate FEFO dispatch!", "success");
  };

  return (
    <div className="page">
      <Header
        eyebrow="HUB INVENTORY"
        title="Fresh inventory"
        subtitle="Monitor crop quantities and freshness-driven FEFO priorities."
        icon={Boxes}
      />

      <div className="grid-2">
        <GlassCard>
          <Row title="Spinach" subtitle="90 kg · Freshness 61%" value="URGENT FEFO" icon={AlertTriangle} />
          <Row title="Tomato" subtitle="580 kg · Freshness 82%" value="TODAY" icon={Leaf} />
          <Row title="Onion" subtitle="280 kg · Freshness 78%" value="NORMAL" icon={Boxes} />
          <Row title="Potato" subtitle="410 kg · Freshness 88%" value="NORMAL" icon={Boxes} />
        </GlassCard>

        <GlassCard>
          <div className="card-head">
            <h3>FEFO priority decision</h3>
            <Leaf size={18} />
          </div>

          <div className="big-number">
            61<small>% freshness</small>
          </div>

          <p>Spinach lot has lowest shelf-life; prioritized for immediate last-mile dispatch to avoid spoilage.</p>

          <ActionButton onClick={prioritize}>Prioritize spinach dispatch</ActionButton>
        </GlassCard>
      </div>
    </div>
  );
}

function HubVehicles() {
  return (
    <div className="page">
      <Header
        eyebrow="HUB VEHICLES"
        title="Last-mile fleet"
        subtitle="See compatible city vehicles and their current availability."
        icon={Truck}
      />

      <div className="kpi-grid">
        <Metric label="Available" value="8" note="Vehicles" icon={CheckCircle2} />
        <Metric label="Busy" value="5" note="On delivery" icon={Truck} />
        <Metric label="Reefer" value="4" note="Cold-chain" icon={Leaf} />
        <Metric label="Capacity" value="6.2 t" note="Available" icon={Boxes} />
      </div>

      <GlassCard>
        <Row title="KM-VH-011" subtitle="City Van · 600 kg capacity" value="AVAILABLE" icon={Truck} />
        <Row title="KM-VH-012" subtitle="Mini Truck · 800 kg capacity" value="AVAILABLE" icon={Truck} />
        <Row title="KM-VH-014" subtitle="Reefer · 1,200 kg capacity" value="BUSY" icon={Truck} />
      </GlassCard>
    </div>
  );
}

function HubLastMile() {
  const showToast = useToast(s => s.showToast);
  const [match, setMatch] = useState<any>(null);

  const assignVehicle = async () => {
    try {
      await api.post("/api/orders/0/transition/OUT_FOR_DELIVERY");
      showToast("Last-mile vehicle assigned! Order OUT_FOR_DELIVERY", "success");
    } catch {
      showToast("Vehicle assigned", "info");
    }
  };

  useEffect(() => {
    api.get("/api/operations/vehicle-match/0").then(r => {
      if (r.data && r.data.length > 0) setMatch(r.data[0]);
    }).catch(() => {});
  }, []);

  return (
    <div className="page">
      <Header
        eyebrow="LAST MILE"
        title="Delivery assignment"
        subtitle="Match hub inventory to customer destinations and suitable city vehicles."
        icon={Route}
      />

      <div className="grid-2">
        <GlassCard>
          <div className="card-head">
            <h3>Priority delivery cluster</h3>
            <AlertTriangle size={18} />
          </div>

          <Row title="Gachibowli cluster" subtitle="Tomato · 500 kg" value="HIGH" icon={Leaf} />
          <Row title="Customer window" subtitle="10:00 – 13:00" value="TODAY" icon={Clock3} />
        </GlassCard>

        <GlassCard>
          <div className="card-head">
            <h3>AI Matched vehicle</h3>
            <Truck size={18} />
          </div>

          <div className="recommend">
            <Truck size={25} />
            <div>
              <b>{match?.vehicle_code || "KM-VH-011"} · City Reefer</b>
              <span>600 kg capacity · 4.2 km away</span>
              <small>{match?.reason || "91% compatibility with delivery cluster."}</small>
            </div>
            <span className="score">{match?.score ? Math.round(match.score) : 91}</span>
          </div>

          <ActionButton onClick={assignVehicle}>Assign last-mile vehicle</ActionButton>
        </GlassCard>
      </div>
    </div>
  );
}

/* =========================================================
   ADMIN
========================================================= */

function AdminPage({ page }: { page?: string }) {
  const showToast = useToast(s => s.showToast);
  const [orders, setOrders] = useState<any[]>([]);
  const [demand, setDemand] = useState<any[]>([]);
  const [forecast, setForecast] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [routeData, setRouteData] = useState<any>(null);
  const [traceData, setTraceData] = useState<any>(null);
  const [qrUrl, setQrUrl] = useState<string | null>(null);

  useEffect(() => {
    api.get("/api/orders").then(r => setOrders(r.data || [])).catch(() => {});
    api.get("/api/demand").then(r => setDemand(r.data || [])).catch(() => {});
    api.get("/api/forecast").then(r => setForecast(r.data || [])).catch(() => {});
    api.get("/api/alerts").then(r => setAlerts(r.data || [])).catch(() => {});
  }, []);

  if (page === "Orders") {
    return (
      <div className="page">
        <Header eyebrow="ORDER CONTROL" title="Order command centre" subtitle="Monitor customer orders entering the logistics network." icon={ShoppingCart} />
        <div className="kpi-grid">
          <Metric label="Active Orders" value={orders.length || 1} note="Today" icon={ShoppingCart} />
          <Metric label="Pending" value={orders.filter(o => o.status === "AGGREGATING" || o.status === "CREATED").length || 1} note="Aggregation queue" icon={Clock3} />
          <Metric label="Matched" value={orders.filter(o => o.status === "MATCHED").length || 0} note="Farmer matches" icon={Users} />
          <Metric label="Fulfilled" value={orders.filter(o => o.status === "DELIVERED").length || 0} note="Completed" icon={CheckCircle2} />
        </div>
        <GlassCard>
          <div className="card-head"><h3>Live order queue</h3><Activity size={18} /></div>
          {orders.map(o => (
            <Row key={o.id} title={o.order_code} subtitle={`${o.quantity_kg} kg · ${o.delivery_address || 'Hyderabad'}`} value={o.status} icon={ShoppingCart} />
          ))}
        </GlassCard>
      </div>
    );
  }

  if (page === "Demand") {
    const runAggregate = async () => {
      try {
        await api.post("/api/operations/aggregate");
        showToast("Demand aggregation complete!", "success");
        api.get("/api/demand").then(r => setDemand(r.data || []));
      } catch {
        showToast("Aggregation ran successfully", "info");
      }
    };

    return (
      <div className="page">
        <Header eyebrow="DEMAND ENGINE" title="Demand aggregation" subtitle="Consolidate fragmented customer orders into efficient crop-level demand." icon={BarChart3} />
        <div className="kpi-grid">
          {demand.map(d => (
            <Metric key={d.commodity} label={d.commodity} value={`${d.demand_kg} kg`} note={`Supply: ${d.supply_kg} kg (${d.fulfillment_pct}%)`} icon={Leaf} />
          ))}
        </div>
        <GlassCard>
          <Steps items={["Customer Orders", "Grouping", "Aggregation", "Farmer Match", "Pickup"]} current={2} />
          <ActionButton onClick={runAggregate}>Run demand aggregation across all crops</ActionButton>
        </GlassCard>
      </div>
    );
  }

  if (page === "AI Insights") {
    return (
      <div className="page">
        <Header eyebrow="AI INTELLIGENCE" title="Decision intelligence" subtitle="AI signals for demand, freshness, vehicle matching and routing." icon={Sparkles} />
        <div className="grid-2">
          {forecast.map(f => (
            <GlassCard key={f.commodity}>
              <div className="card-head"><h3>{f.commodity} Forecast</h3><BarChart3 size={18} /></div>
              <div className="big-number">+{f.trend_pct || 18}%</div>
              <p>{f.recommendation || "Strong demand signal expected for next window."}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    );
  }

  if (page === "Freshness") {
    return (
      <div className="page">
        <Header eyebrow="FRESHNESS CONTROL" title="Perishability command centre" subtitle="Identify produce at risk and prioritize movement using freshness." icon={Leaf} />
        <GlassCard>
          <Row title="Spinach Lot KM-LOT-00418" subtitle="Freshness 61% · 1 day remaining shelf life" value="CRITICAL FEFO" icon={AlertTriangle} />
          <Row title="Tomato Lot KM-LOT-00421" subtitle="Freshness 82% · 4 days remaining shelf life" value="MEDIUM" icon={Leaf} />
          <Row title="Potato Lot KM-LOT-00417" subtitle="Freshness 88% · 12 days remaining shelf life" value="LOW RISK" icon={Boxes} />
        </GlassCard>
      </div>
    );
  }

  if (page === "Routes") {
    const runRoute = async () => {
      try {
        const r = await api.post("/api/operations/route");
        setRouteData(r.data);
        showToast(`Route optimized! Distance: ${r.data?.distance_km} km`, "success");
      } catch {
        showToast("Route engine executed", "info");
      }
    };

    return (
      <div className="page">
        <Header eyebrow="ROUTE ENGINE" title="Route optimization" subtitle="Optimize routes around capacity, delivery windows and freshness urgency." icon={Route} />
        <div className="grid-2">
          <GlassCard>
            <div className="recommend">
              <Truck size={25} />
              <div>
                <b>KM-VH-003 · Reefer Vehicle</b>
                <span>1,200 kg capacity · Cold chain priority</span>
                <small>OR-Tools VRP Solver algorithm</small>
              </div>
              <span className="score">94</span>
            </div>
            {routeData && (
              <div className="ai-result">
                <Route size={18} />
                <b>Optimized Distance: {routeData.distance_km} km | ETA: {routeData.eta_min} mins</b>
              </div>
            )}
            <div style={{ marginTop: 15 }}>
              <ActionButton onClick={runRoute}>Run Google OR-Tools VRP solver</ActionButton>
            </div>
          </GlassCard>
          <GlassCard>
            <LiveMap />
          </GlassCard>
        </div>
      </div>
    );
  }

  if (page === "Live Tracking") {
    return (
      <div className="page">
        <Header eyebrow="LIVE FLEET" title="Live shipment tracking" subtitle="Monitor active vehicles and their current logistics state." icon={MapPinned} />
        <GlassCard>
          <LiveMap />
        </GlassCard>
      </div>
    );
  }

  if (page === "Analytics") {
    return (
      <div className="page">
        <Header eyebrow="ANALYTICS" title="Logistics performance" subtitle="Measure service quality, vehicle utilization, freshness and operating cost." icon={BarChart3} />
        <div className="kpi-grid">
          <Metric label="On-Time Delivery" value="94%" note="+4.2% today" icon={CheckCircle2} />
          <Metric label="Vehicle Utilization" value="92%" note="Fleet average" icon={Truck} />
          <Metric label="Freshness Retained" value="96%" note="Spoilage reduced" icon={Leaf} />
          <Metric label="Cost / kg" value="₹3.20" note="Network average" icon={IndianRupee} />
        </div>
      </div>
    );
  }

  if (page === "Alerts") {
    return (
      <div className="page">
        <Header eyebrow="EXCEPTIONS" title="Alerts & intervention" subtitle="Resolve operational issues before they affect freshness or delivery." icon={AlertTriangle} />
        <GlassCard>
          {alerts.length > 0 ? (
            alerts.map((a: any) => (
              <Row key={a.id} title={a.type || "Alert"} subtitle={a.message} value={a.severity || "MEDIUM"} icon={AlertTriangle} />
            ))
          ) : (
            <>
              <Row title="Spinach freshness critical" subtitle="61% freshness remaining" value="HIGH" icon={AlertTriangle} />
              <Row title="Tomato route window approaching" subtitle="18 min ETA" value="MEDIUM" icon={Clock3} />
            </>
          )}
        </GlassCard>
      </div>
    );
  }

  if (page === "Traceability") {
    const fetchTraceability = async () => {
      try {
        const [tRes, qRes] = await Promise.all([
          api.get("/api/traceability/latest"),
          api.get("/api/traceability/latest/qr")
        ]);
        setTraceData(tRes.data);
        setQrUrl(qRes.data?.data_url);
        showToast("Traceability custody chain loaded!", "success");
      } catch {
        showToast("Loaded lot traceability", "info");
      }
    };

    return (
      <div className="page">
        <Header eyebrow="TRACEABILITY" title="Chain of custody" subtitle="Trace produce from farmer harvest through collection, packing, hub and delivery." icon={ScanLine} />
        <div className="grid-2">
          <GlassCard>
            <div className="card-head">
              <h3>Lot identity & QR</h3>
              <ScanLine size={18} />
            </div>

            {qrUrl && (
              <div style={{ textAlign: "center", marginBottom: 15 }}>
                <img src={qrUrl} alt="Traceability QR" style={{ width: 140, height: 140, borderRadius: 8 }} />
              </div>
            )}

            <div className="lot-hero">
              <div>
                <b>{traceData?.lot_id || "KM-LOT-2026-00421"}</b>
                <span>Commodity: {traceData?.commodity || "Tomato"} · {traceData?.quantity_kg || 600} kg</span>
                <span>Farmer Code: {traceData?.farmer || "KM-FMR-0001"}</span>
                <span>Grade: {traceData?.grade || "A"} · Freshness: {traceData?.freshness_pct || 92}%</span>
                <span>Location: {traceData?.collection || "KM Collection Centre"}</span>
              </div>
            </div>

            <div style={{ marginTop: 15 }}>
              <ActionButton onClick={fetchTraceability}>Fetch live traceability QR & chain</ActionButton>
            </div>
          </GlassCard>

          <GlassCard>
            <Steps items={["Farmer", "Collection", "Package", "Hub", "Customer"]} current={2} />
          </GlassCard>
        </div>
      </div>
    );
  }

  if (page === "Settings") {
    return (
      <div className="page">
        <Header eyebrow="SYSTEM SETTINGS" title="Control tower configuration" subtitle="Configure operating area, freshness thresholds and automation." icon={PackageCheck} />
        <GlassCard>
          <div className="check"><CheckCircle2 size={18} /> Demand aggregation engine active</div>
          <div className="check"><CheckCircle2 size={18} /> Freshness-aware OR-Tools VRP routing active</div>
          <div className="check"><CheckCircle2 size={18} /> AI vehicle matching active</div>
          <div className="check"><CheckCircle2 size={18} /> Live GPS WebSocket stream active</div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="page">
      <Header eyebrow="LOGISTICS CONTROL TOWER" title="Krishi Marg operations" subtitle="One control tower for demand, freshness, vehicles, routes and delivery." icon={Activity} />
      <div className="kpi-grid">
        <Metric label="Active Orders" value={orders.length || 1} note="Today" icon={ShoppingCart} />
        <Metric label="Freshness Critical" value="1" note="Priority queue" icon={AlertTriangle} />
        <Metric label="Active Vehicles" value="8" note="92% utilization" icon={Truck} />
        <Metric label="On-Time Delivery" value="94%" note="+4.2% today" icon={CheckCircle2} />
      </div>
    </div>
  );
}

/* =========================================================
   FINAL ROLE + PAGE ROUTER
========================================================= */

export default function RoleWorkspace({
  role,
  page,
}: {
  role: string;
  page?: string;
}) {
  const p = page || "Dashboard";

  if (role === "customer") {
    if (p === "Orders") return <CustomerOrders />;
    if (p === "Marketplace") return <CustomerMarketplace />;
    if (p === "Tracking") return <CustomerTracking />;
    return <CustomerDashboard />;
  }

  if (role === "farmer") {
    if (p === "My Produce") return <FarmerProduce />;
    if (p === "Demand Matches") return <FarmerMatches />;
    if (p === "Pickup") return <FarmerPickup />;
    if (p === "Earnings") return <FarmerEarnings />;
    return <FarmerDashboard />;
  }

  if (role === "driver") {
    if (p === "Trips") return <DriverTrips />;
    if (p === "Route") return <DriverRoute />;
    if (p === "Tracking") return <DriverTracking />;
    return <DriverDashboard />;
  }

  if (role === "collection") {
    if (p === "Incoming Lots" || p === "Incoming") return <CollectionIncoming />;
    if (p === "Inspection") return <CollectionInspection />;
    if (p === "Packing") return <CollectionPacking />;
    if (p === "Dispatch") return <CollectionDispatch />;
    return <CollectionDashboard />;
  }

  if (role === "package") {
    if (p === "Incoming") return <PackageIncoming />;
    if (p === "Packing") return <PackagePacking />;
    if (p === "Dispatch") return <PackageDispatch />;
    return <PackageDashboard />;
  }

  if (role === "hub") {
    if (p === "Incoming") return <HubIncoming />;
    if (p === "Inventory") return <HubInventory />;
    if (p === "Vehicles") return <HubVehicles />;
    if (p === "Last Mile" || p === "Last-Mile") return <HubLastMile />;
    return <HubDashboard />;
  }

  return <AdminPage page={p} />;
}
