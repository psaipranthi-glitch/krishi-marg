import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import PremiumFarmScene from "../components/PremiumFarmScene";

import {
  Leaf,
  Truck,
  ShoppingCart,
  AlertTriangle,
  PackageCheck,
  Activity,
  ArrowUpRight,
  Sparkles,
  Route,
} from "lucide-react";

import { api } from "../services/api";

import KPI from "../components/ui/KPI";
import LiveMap from "../components/maps/LiveMap";
import GlassCard from "../components/ui/GlassCard";

import {
  DemandChart,
  ForecastChart,
} from "../components/charts/DemandChart";

import AIInsight from "../components/ai/AIInsight";

export default function Dashboard({ role, onNavigate }: { role: string; onNavigate?: (page: string) => void }) {
  const [kpi, setKpi] = useState<any>({});
  const [demand, setDemand] = useState<any[]>([]);
  const [forecast, setForecast] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [runningDemo, setRunningDemo] = useState(false);

  const refresh = () => {
    api
      .get("/api/kpis")
      .then((r) => setKpi(r.data))
      .catch((err) => console.error("KPI error:", err));

    api
      .get("/api/demand")
      .then((r) => setDemand(r.data))
      .catch((err) => console.error("Demand error:", err));

    api
      .get("/api/forecast")
      .then((r) => setForecast(r.data))
      .catch((err) => console.error("Forecast error:", err));

    api
      .get("/api/orders")
      .then((r) => setOrders(r.data))
      .catch((err) => console.error("Orders error:", err));
  };

  useEffect(() => {
    refresh();

    const interval = setInterval(() => {
      refresh();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const demo = async () => {
    if (runningDemo) return;

    try {
      setRunningDemo(true);

      await api.post("/api/orders", {
        items: [
          {
            commodity: "tomato",
            quantity_kg: 300,
          },
          {
            commodity: "tomato",
            quantity_kg: 200,
          },
        ],
        delivery_address: "Gachibowli, Hyderabad",
        delivery_lat: 17.4401,
        delivery_lon: 78.3489,
        delivery_window: "10:00-13:00",
      });

      await api.post("/api/operations/aggregate");

      await api.post("/api/operations/match-farmer");

      await api.post("/api/operations/route");

      await api.post("/api/demo/run");

      refresh();
    } catch (error) {
      console.error("Demo journey failed:", error);
    } finally {
      setRunningDemo(false);
    }
  };

  const formatRole = () => {
    if (role === "admin") {
      return "Logistics Control Tower";
    }

    if (role === "customer") {
      return "Fresh market, delivered smarter";
    }

    return `${role.charAt(0).toUpperCase() + role.slice(1)} workspace`;
  };

  return (
    <div className="page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <motion.div
        className="hero-row"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <div className="eyebrow">
            <Activity size={14} />
            LIVE OPERATIONS
          </div>

          <h1>{formatRole()}</h1>

          <p>
            Hyderabad network Â· perishability-aware Â· updated in real time
          </p>
        </div>

        {role === "admin" && (
          <motion.button
            className="primary"
            onClick={demo}
            disabled={runningDemo}
            whileHover={{ scale: runningDemo ? 1 : 1.03 }}
            whileTap={{ scale: runningDemo ? 1 : 0.97 }}
          >
            <Sparkles size={16} />

            {runningDemo
              ? "Running demo..."
              : "Run full demo journey"}
          </motion.button>
        )}
      </motion.div>

      {/* =====================================================
          ANIMATED FARM / CROP FIELD
      ===================================================== */}

      <motion.div
        className="dashboard-crop-field"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.7,
          delay: 0.15,
        }}
      >
        <PremiumFarmScene />
      </motion.div>

      {/* =====================================================
          KPI GRID
      ===================================================== */}

      <motion.div
        className="kpi-grid"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          delay: 0.25,
        }}
      >
        <KPI
          label="Active Orders"
          value={kpi.active_orders || 0}
          trend="12% today"
          icon={ShoppingCart}
        />

        <KPI
          label="Freshness Critical"
          value={kpi.freshness_critical || 0}
          trend="Priority queue"
          icon={AlertTriangle}
        />

        <KPI
          label="Active Vehicles"
          value={kpi.active_vehicles || 0}
          trend="92% utilization"
          icon={Truck}
        />

        <KPI
          label="On-Time Delivery"
          value={kpi.on_time_delivery || 0}
          unit="%"
          trend="+4.2%"
          icon={Route}
        />

        <KPI
          label="Demand Served"
          value={kpi.demand_served || 0}
          unit="%"
          trend="Across 4 crops"
          icon={Leaf}
        />
      </motion.div>

      {/* =====================================================
          LIVE MAP + AI COPILOT
      ===================================================== */}

      <motion.div
        className="grid-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          delay: 0.35,
        }}
      >

        {/* LIVE MAP */}

        <GlassCard className="map-card span-2">

          <div className="card-head">

            <div>
              <h3>Live Hyderabad Network</h3>

              <span>
                Drivers, farms, collection, packhouses, hubs & customers
              </span>
            </div>

            <div className="live">
              <i />
              LIVE
            </div>

          </div>

          <LiveMap />

        </GlassCard>

        {/* AI COPILOT */}

        <GlassCard>

          <div className="card-head">

            <div>
              <h3>AI Copilot</h3>

              <span>
                Signals affecting logistics now
              </span>
            </div>

            <motion.div
              animate={{
                rotate: [0, 8, -8, 0],
                scale: [1, 1.08, 1],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
              }}
            >
              <Sparkles size={19} />
            </motion.div>

          </div>

          <AIInsight />

        </GlassCard>

      </motion.div>

      {/* =====================================================
          DEMAND + FORECAST
      ===================================================== */}

      <motion.div
        className="grid-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          delay: 0.45,
        }}
      >

        {/* DEMAND */}

        <GlassCard>

          <div className="card-head">

            <div>
              <h3>
                Demand vs available supply
              </h3>

              <span>
                Backend-fed aggregation across the operating area
              </span>
            </div>

          </div>

          <DemandChart data={demand} />

        </GlassCard>

        {/* FORECAST */}

        <GlassCard>

          <div className="card-head">

            <div>
              <h3>
                Tomorrow's AI forecast
              </h3>

              <span>
                Confidence-weighted demand signal
              </span>
            </div>

          </div>

          <ForecastChart data={forecast} />

        </GlassCard>

      </motion.div>

      {/* =====================================================
          LIVE OPERATIONS + IMPACT
      ===================================================== */}

      <motion.div
        className="grid-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          delay: 0.55,
        }}
      >

        {/* LIVE OPERATIONS */}

        <GlassCard>

          <div className="card-head">

            <h3>
              Live operations feed
            </h3>

            <ArrowUpRight size={17} />

          </div>

          <div className="activity">

            {orders.length === 0 ? (

              <div className="empty-state">
                No active operations yet.
              </div>

            ) : (

              orders.slice(0, 6).map((o, i) => (

                <motion.div
                  key={o.id}
                  initial={{
                    opacity: 0,
                    x: -10,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay: i * 0.05,
                  }}
                >

                  <time>
                    {`${18 + i}:4${i}`}
                  </time>

                  <span>
                    {o.order_code} Â· {o.quantity_kg} kg Â·{" "}
                    <b>{o.status}</b>
                  </span>

                </motion.div>

              ))

            )}

          </div>

        </GlassCard>

        {/* IMPACT */}

        <GlassCard>

          <div className="card-head">

            <h3>
              Impact snapshot
            </h3>

            <PackageCheck size={18} />

          </div>

          <div className="impact">

            <motion.div
              whileHover={{
                y: -3,
              }}
            >
              <b>
                {kpi.empty_km || 12.4}
              </b>

              <span>
                Empty KM avoided index
              </span>
            </motion.div>

            <motion.div
              whileHover={{
                y: -3,
              }}
            >
              <b>
                â‚¹{kpi.cost_per_kg || 4.8}
              </b>

              <span>
                Avg logistics / kg
              </span>
            </motion.div>

            <motion.div
              whileHover={{
                y: -3,
              }}
            >
              <b>
                {kpi.spoilage || 3.2}%
              </b>

              <span>
                Estimated spoilage
              </span>
            </motion.div>

            <motion.div
              whileHover={{
                y: -3,
              }}
            >
              <b>
                96%
              </b>

              <span>
                Grade retained
              </span>
            </motion.div>

          </div>

        </GlassCard>

      </motion.div>

    </div>
  );
}

