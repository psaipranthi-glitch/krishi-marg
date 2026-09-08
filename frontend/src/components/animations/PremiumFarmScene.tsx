import { motion } from "framer-motion";

const cropRows = Array.from({ length: 7 });
const cropColumns = Array.from({ length: 13 });

export default function PremiumFarmScene() {
  return (
    <div className="premium-farm-scene">

      {/* Ambient atmosphere */}
      <motion.div
        className="farm-sky-glow"
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.45, 0.75, 0.45],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Sun */}
      <motion.div
        className="farm-sun"
        animate={{
          scale: [1, 1.06, 1],
          opacity: [0.72, 0.92, 0.72],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Clouds */}
      <motion.div
        className="farm-cloud farm-cloud-one"
        animate={{ x: [0, 45, 0] }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="farm-cloud farm-cloud-two"
        animate={{ x: [0, -35, 0] }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Distant landscape */}
      <svg
        className="farm-landscape"
        viewBox="0 0 1200 320"
        preserveAspectRatio="none"
      >
        <path
          d="M0 235 C120 175 230 195 350 125 C480 50 580 170 710 120 C830 75 920 150 1035 105 C1110 78 1160 95 1200 65 L1200 320 L0 320 Z"
          className="farm-hill-back"
        />

        <path
          d="M0 255 C160 205 275 230 405 170 C530 110 640 200 775 155 C900 110 1000 185 1115 140 C1160 123 1180 130 1200 112 L1200 320 L0 320 Z"
          className="farm-hill-front"
        />
      </svg>

      {/* Agricultural field */}
      <div className="farm-field">

        <div className="farm-field-perspective" />

        <div className="farm-crop-grid">
          {cropRows.map((_, row) => (
            <div className="farm-crop-row" key={row}>
              {cropColumns.map((_, index) => (
                <motion.div
                  className="farm-crop"
                  key={index}
                  initial={{
                    opacity: 0,
                    scaleY: 0,
                  }}
                  animate={{
                    opacity: 1,
                    scaleY: [0.9, 1.08, 0.96],
                  }}
                  transition={{
                    opacity: {
                      duration: 0.7,
                      delay: row * 0.08 + index * 0.015,
                    },
                    scaleY: {
                      duration: 3.2 + index * 0.04,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.07,
                    },
                  }}
                >
                  <span className="crop-leaf crop-leaf-left" />
                  <span className="crop-leaf crop-leaf-right" />
                </motion.div>
              ))}
            </div>
          ))}
        </div>

        {/* Field lanes */}
        <div className="farm-lane farm-lane-one" />
        <div className="farm-lane farm-lane-two" />
        <div className="farm-lane farm-lane-three" />
      </div>

      {/* Logistics road */}
      <div className="farm-road">
        <motion.div
          className="road-marker"
          animate={{ y: [0, 105] }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Supply route */}
      <div className="farm-route">
        <motion.div
          className="route-progress"
          animate={{ width: ["0%", "100%"] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        <motion.div
          className="route-node route-node-one"
          animate={{ scale: [1, 1.25, 1] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
          }}
        />

        <motion.div
          className="route-node route-node-two"
          animate={{ scale: [1, 1.25, 1] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: 0.8,
          }}
        />

        <motion.div
          className="route-node route-node-three"
          animate={{ scale: [1, 1.25, 1] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: 1.6,
          }}
        />
      </div>

      {/* Moving logistics vehicle */}
      <motion.div
        className="farm-vehicle"
        animate={{
          x: [0, 75, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="vehicle-shadow" />

        <div className="vehicle-body">
          <div className="vehicle-storage">
            <span />
            <span />
            <span />
          </div>

          <div className="vehicle-cabin">
            <div className="vehicle-window" />
          </div>
        </div>

        <div className="vehicle-wheel vehicle-wheel-left" />
        <div className="vehicle-wheel vehicle-wheel-right" />
      </motion.div>

      {/* Smart field sensor */}
      <motion.div
        className="field-sensor"
        animate={{
          y: [0, -5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <motion.div
          className="sensor-ring"
          animate={{
            scale: [1, 1.7],
            opacity: [0.6, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />

        <div className="sensor-core" />
      </motion.div>

      {/* AI scanning beam */}
      <motion.div
        className="ai-scan"
        animate={{
          x: ["-15%", "115%"],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Network nodes */}
      <div className="network-node node-farm">
        <span />
        <label>FARM</label>
      </div>

      <div className="network-node node-collection">
        <span />
        <label>COLLECTION</label>
      </div>

      <div className="network-node node-hub">
        <span />
        <label>CITY HUB</label>
      </div>

      {/* Main information panel */}
      <motion.div
        className="farm-info"
        initial={{
          opacity: 0,
          y: 18,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.7,
          delay: 0.4,
        }}
      >
        <div className="farm-info-top">
          <div>
            <span className="farm-label">
              SMART FARM NETWORK
            </span>

            <h3>
              Hyderabad Agricultural Belt
            </h3>
          </div>

          <div className="farm-status">
            <span />
            LIVE
          </div>
        </div>

        <div className="farm-metrics">

          <div className="farm-metric">
            <strong>600</strong>
            <span>kg available</span>
          </div>

          <div className="farm-metric">
            <strong>92%</strong>
            <span>freshness</span>
          </div>

          <div className="farm-metric">
            <strong>4.8</strong>
            <span>km to hub</span>
          </div>

        </div>
      </motion.div>

      {/* AI intelligence card */}
      <motion.div
        className="farm-ai-card"
        initial={{
          opacity: 0,
          x: 20,
        }}
        animate={{
          opacity: 1,
          x: 0,
        }}
        transition={{
          duration: 0.7,
          delay: 0.8,
        }}
      >
        <motion.div
          className="ai-dot"
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(55,145,116,.35)",
              "0 0 0 10px rgba(55,145,116,0)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          <span />
        </motion.div>

        <div>
          <small>AI FIELD SIGNAL</small>

          <strong>
            Tomato demand rising
          </strong>

          <p>
            +18% expected tomorrow
          </p>
        </div>
      </motion.div>

      {/* Freshness indicator */}
      <motion.div
        className="freshness-indicator"
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 1.1,
        }}
      >
        <div className="freshness-ring">
          <svg viewBox="0 0 42 42">
            <circle
              cx="21"
              cy="21"
              r="17"
              className="freshness-track"
            />

            <motion.circle
              cx="21"
              cy="21"
              r="17"
              className="freshness-progress"
              initial={{
                pathLength: 0,
              }}
              animate={{
                pathLength: 0.92,
              }}
              transition={{
                duration: 1.5,
                delay: 1.2,
              }}
            />
          </svg>

          <strong>92</strong>
        </div>

        <div>
          <small>FRESHNESS</small>
          <span>Optimal condition</span>
        </div>
      </motion.div>

    </div>
  );
}