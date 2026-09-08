import { motion } from "framer-motion";
import { Activity, BrainCircuit, MapPin, Truck, Sprout, Droplets } from "lucide-react";

export default function PremiumFarmScene() {
  return (
    <section className="premium-farm-scene">

      <div className="farm-sky">
        <div className="farm-sun-glow" />
        <div className="farm-sun" />
        <div className="farm-cloud cloud-a" />
        <div className="farm-cloud cloud-b" />
      </div>

      <svg className="farm-hills" viewBox="0 0 1200 360" preserveAspectRatio="none">
        <path
          d="M0 250 C180 130 280 190 420 110 C570 25 700 170 820 115 C980 40 1050 120 1200 65 L1200 360 L0 360Z"
          className="hill-back"
        />
        <path
          d="M0 285 C150 205 280 250 420 175 C590 90 710 235 850 175 C1000 110 1100 175 1200 125 L1200 360 L0 360Z"
          className="hill-front"
        />
      </svg>

      <div className="farm-ground">

        <div className="farm-field">
          {Array.from({ length: 8 }).map((_, row) => (
            <div className="crop-row" key={row}>
              {Array.from({ length: 15 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="crop"
                  animate={{
                    rotate: [-2, 2, -2],
                    scaleY: [0.95, 1.04, 0.95],
                  }}
                  transition={{
                    duration: 2.5 + (i % 3) * 0.3,
                    repeat: Infinity,
                    delay: (row + i) * 0.04,
                  }}
                >
                  <span className="stem" />
                  <span className="leaf leaf-1" />
                  <span className="leaf leaf-2" />
                  <span className="leaf leaf-3" />
                </motion.div>
              ))}
            </div>
          ))}
        </div>

        <div className="field-lane lane-one" />
        <div className="field-lane lane-two" />

        <motion.div
          className="ai-scan-line"
          animate={{ top: ["12%", "82%", "12%"] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="sensor sensor-one">
          <motion.div
            className="sensor-pulse"
            animate={{ scale: [1, 2.5], opacity: [0.7, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <div className="sensor-core" />
        </div>

        <div className="sensor sensor-two">
          <motion.div
            className="sensor-pulse"
            animate={{ scale: [1, 2.5], opacity: [0.7, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
          />
          <div className="sensor-core" />
        </div>

        <svg className="route-svg" viewBox="0 0 1000 320">
          <path
            d="M80 250 C250 250 280 110 450 145 C610 180 650 70 900 95"
            className="route-base"
          />
          <motion.path
            d="M80 250 C250 250 280 110 450 145 C610 180 650 70 900 95"
            className="route-active"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 4, repeat: Infinity, repeatDelay: 1 }}
          />
        </svg>

        <div className="route-point point-one"><MapPin size={12} /></div>
        <div className="route-point point-two"><MapPin size={12} /></div>
        <div className="route-point point-three"><MapPin size={12} /></div>

        <motion.div
          className="farm-truck"
          animate={{
            x: [0, 620, 0],
            y: [0, -5, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="truck-glow" />
          <div className="truck-cargo">
            <div className="cargo-lines" />
            <div className="cargo-lines" />
            <div className="cargo-lines" />
          </div>
          <div className="truck-cabin">
            <div className="truck-window" />
          </div>
          <div className="truck-wheel wheel-a" />
          <div className="truck-wheel wheel-b" />
        </motion.div>

      </div>

      <div className="farm-overlay">

        <motion.div
          className="farm-status-card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="status-icon">
            <Activity size={18} />
          </div>
          <div>
            <span>LIVE FARM NETWORK</span>
            <strong>Hyderabad Supply Zone</strong>
          </div>
          <div className="live-dot" />
        </motion.div>

        <motion.div
          className="farm-ai-card"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <div className="ai-icon">
            <BrainCircuit size={19} />
          </div>
          <div>
            <span>AI FIELD ANALYSIS</span>
            <strong>Tomato demand rising</strong>
            <small>Freshness window: 18h</small>
          </div>
        </motion.div>

        <div className="farm-metrics">
          <div>
            <Sprout size={15} />
            <span>600 kg</span>
            <small>Available</small>
          </div>
          <div>
            <Droplets size={15} />
            <span>92%</span>
            <small>Freshness</small>
          </div>
          <div>
            <Truck size={15} />
            <span>14 km</span>
            <small>To hub</small>
          </div>
        </div>

      </div>

    </section>
  );
}
