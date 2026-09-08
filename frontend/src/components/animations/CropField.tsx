import { motion } from "framer-motion";

const crops = ["🌱", "🌿", "🌱", "🌿", "🌱", "🌿", "🌱", "🌿"];

export default function CropField() {
  return (
    <div className="relative h-48 w-full overflow-hidden rounded-3xl bg-gradient-to-b from-sky-100 via-emerald-50 to-emerald-100 border border-emerald-100">
      <motion.div
        className="absolute inset-0"
        animate={{ backgroundPositionX: ["0px", "40px", "0px"] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(255,255,255,.7) 0 20px, transparent 21px), radial-gradient(circle at 70% 35%, rgba(255,255,255,.5) 0 14px, transparent 15px)",
          backgroundSize: "180px 100px",
        }}
      />

      <motion.div
        className="absolute left-8 top-8 text-4xl"
        animate={{ x: [0, 25, 0], y: [0, -4, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        ☁️
      </motion.div>

      <motion.div
        className="absolute right-10 top-5 text-3xl"
        animate={{ x: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      >
        ☁️
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-emerald-500/30 to-transparent" />

      <div className="absolute bottom-3 left-0 right-0 flex justify-around px-5">
        {crops.map((crop, index) => (
          <motion.div
            key={index}
            className="text-4xl origin-bottom"
            animate={{
              rotate: [-4, 4, -4],
              scaleY: [0.95, 1.08, 0.95],
            }}
            transition={{
              duration: 2.2 + index * 0.15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.12,
            }}
          >
            {crop}
          </motion.div>
        ))}
      </div>

      <div className="absolute bottom-4 left-5 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-emerald-700 backdrop-blur">
        🌱 Field growing
      </div>

      <motion.div
        className="absolute bottom-5 right-5 text-4xl"
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      >
        👨‍🌾
      </motion.div>
    </div>
  );
}
