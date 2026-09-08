import { useState } from "react";
import { motion } from "framer-motion";
import {
  Leaf,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  MapPin,
  Package,
  Warehouse,
  UserRound,
} from "lucide-react";
import { api } from "../../services/api";
import { useAuth } from "../../store/auth";

const demos = [
  "admin",
  "farmer",
  "customer",
  "driver",
  "collection",
  "package",
  "hub",
];

const nodes = [
  { label: "Farm", icon: Leaf },
  { label: "Collection", icon: Package },
  { label: "Packhouse", icon: Warehouse },
  { label: "City Hub", icon: MapPin },
  { label: "Customer", icon: UserRound },
];

export default function Login() {
  const [email, setEmail] = useState("admin@krishimarg.local");
  const [password, setPassword] = useState("Krishi@123");
  const [loading, setLoading] = useState(false);
  const setUser = useAuth((s) => s.setUser);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const r = await api.post("/api/auth/login", { email, password });
      localStorage.setItem("km_token", r.data.access_token);
      setUser(r.data.user);
    } catch {
      alert("Login failed. Try the demo credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* LEFT VISUAL */}
      <section className="login-visual">

        <div className="login-glow login-glow-one" />
        <div className="login-glow login-glow-two" />

        <motion.div
          className="login-sun"
          animate={{ scale: [1, 1.08, 1], opacity: [0.55, 0.8, 0.55] }}
          transition={{ duration: 7, repeat: Infinity }}
        />

        <motion.div
          className="login-cloud login-cloud-one"
          animate={{ x: [0, 45, 0] }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="login-cloud login-cloud-two"
          animate={{ x: [0, -35, 0] }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* BRAND */}
        <motion.div
          className="login-brand"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="login-brandmark">
            <Leaf size={25} />
          </div>

          <div>
            <strong>Krishi Marg</strong>
            <span>Connecting Farms to Markets</span>
          </div>
        </motion.div>

        {/* HERO */}
        <motion.div
          className="login-copy"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="login-kicker">
            <span />
            INTELLIGENT AGRICULTURAL LOGISTICS
          </div>

          <h1>
            Right produce.
            <br />
            <em>Right vehicle.</em>
            <br />
            Right route.
            <br />
            <strong>On time.</strong>
          </h1>

          <p>
            Perishability-aware agricultural logistics connecting
            demand, supply, freshness and movement in one intelligent
            network.
          </p>
        </motion.div>

        {/* LANDSCAPE */}
        <div className="login-landscape">

          <motion.div
            className="login-sun"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 6, repeat: Infinity }}
          />

          <svg
            className="landscape-hills"
            viewBox="0 0 1200 350"
            preserveAspectRatio="none"
          >
            <path
              className="hill-back"
              d="M0 245 C130 175 220 205 350 135 C470 70 575 170 700 125 C830 75 930 155 1040 105 C1120 75 1165 100 1200 65 L1200 350 L0 350Z"
            />
            <path
              className="hill-front"
              d="M0 270 C145 205 270 245 405 175 C530 115 640 205 775 160 C905 110 1000 195 1115 145 C1160 125 1180 135 1200 120 L1200 350 L0 350Z"
            />
          </svg>

          {/* FIELD */}
          <div className="login-field">
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                className="login-crop"
                style={{
                  left: `${4 + (i % 10) * 9}%`,
                  bottom: `${22 + Math.floor(i / 10) * 18}px`,
                }}
                animate={{
                  rotate: [-2, 2, -2],
                  scaleY: [0.92, 1.05, 0.92],
                }}
                transition={{
                  duration: 3 + (i % 4) * 0.3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.06,
                }}
              >
                <span className="crop-leaf-left" />
                <span className="crop-leaf-right" />
              </motion.div>
            ))}
          </div>

          {/* ROAD */}
          <div className="login-road">
            <motion.div
              className="road-marker"
              animate={{ y: [0, 90] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </div>

          {/* TRUCK */}
          <motion.div
            className="login-truck"
            animate={{ x: [0, 100, 0] }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="truck-shadow" />

            <div className="truck-body">
              <div className="truck-storage">
                <span />
                <span />
                <span />
              </div>

              <div className="truck-cabin">
                <div className="truck-window" />
              </div>
            </div>

            <div className="truck-wheel truck-wheel-one" />
            <div className="truck-wheel truck-wheel-two" />
          </motion.div>
        </div>

        {/* NETWORK */}
        <motion.div
          className="network-panel"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="network-panel-header">
            <div>
              <span>LIVE NETWORK</span>
              <strong>Supply movement</strong>
            </div>

            <div className="network-live">
              <span />
              LIVE
            </div>
          </div>

          <div className="network-route">

            <motion.div
              className="network-progress"
              animate={{ width: ["0%", "100%"] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            {nodes.map((node, index) => {
              const Icon = node.icon;

              return (
                <motion.div
                  className="network-stop"
                  key={node.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.12 }}
                >
                  <motion.div
                    className="network-node"
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      delay: index * 0.35,
                    }}
                  >
                    <Icon size={15} />
                  </motion.div>

                  <span>{node.label}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* AI SIGNAL */}
        <motion.div
          className="login-ai-signal"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <div className="ai-signal-icon">
            <Sparkles size={15} />
          </div>

          <div>
            <small>AI FIELD SIGNAL</small>
            <strong>Tomato demand rising</strong>
            <span>+18% expected tomorrow</span>
          </div>
        </motion.div>

      </section>

      {/* RIGHT LOGIN */}
      <section className="login-form-side">

        <motion.form
          className="login-card"
          onSubmit={submit}
          initial={{ opacity: 0, x: 35 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >

          <div className="eyebrow">
            <ShieldCheck size={15} />
            Secure operations network
          </div>

          <h2>Welcome back</h2>

          <p className="login-subtitle">
            Sign in to your Krishi Marg workspace.
          </p>

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>

          <motion.button
            className="primary wide login-submit"
            disabled={loading}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? "Signing in..." : "Sign in"}
            <ArrowRight size={17} />
          </motion.button>

          <div className="demo-label">
            <Sparkles size={14} />
            One-click demo roles
          </div>

          <div className="demo-grid">
            {demos.map((role) => (
              <motion.button
                type="button"
                key={role}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setEmail(`${role}@krishimarg.local`);
                  setPassword("Krishi@123");
                }}
              >
                {role}
              </motion.button>
            ))}
          </div>

          <small className="hint">
            Demo access enabled for prototype evaluation
          </small>

        </motion.form>

      </section>
    </div>
  );
}