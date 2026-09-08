import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, AlertTriangle, Truck, ArrowUpRight, Cpu } from "lucide-react";
import { api } from "../../services/api";

export default function AIInsight() {
  const [models, setModels] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([
    {
      type: "ML Demand Signal",
      title: "Tomato Demand Peak Forecast",
      text: "RandomForest ML model predicts +18% demand spike tomorrow. Pre-allocating cold chain.",
      icon: TrendingUp
    },
    {
      type: "ML FEFO Priority",
      title: "Spinach Spoilage Risk Warning",
      text: "GradientBoosted FEFO model assigned Urgent Rank 1 (61% freshness). Immediate dispatch recommended.",
      icon: AlertTriangle
    },
    {
      type: "ML Vehicle Matcher",
      title: "Reefer KM-VH-003 Match (94%)",
      text: "Vehicle Scoring ML matched KM-VH-003 for 500 kg tomato payload based on cold chain & payload efficiency.",
      icon: Truck
    }
  ]);

  useEffect(() => {
    api.get("/api/ai/models-status").then(r => {
      if (r.data?.active_models) setModels(r.data.active_models);
    }).catch(() => {});
  }, []);

  return (
    <div className="ai-insights">
      {models.length > 0 && (
        <div style={{ padding: "8px 12px", background: "rgba(16, 185, 129, 0.08)", borderRadius: 8, marginBottom: 12, display: "flex", alignItems: "center", gap: 8, fontSize: 11, fontWeight: 700, color: "var(--green)" }}>
          <Cpu size={14} /> 5 ML Models Active (Scikit-Learn Regression & Classification Engine)
        </div>
      )}

      {insights.map((item, index) => {
        const Icon = item.icon || Sparkles;

        return (
          <motion.div
            key={item.type + index}
            className="ai-insight"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08 }}
            whileHover={{ x: 4 }}
          >
            <div className="ai-insight-icon">
              <Icon size={17} />
            </div>

            <div className="ai-insight-content">
              <div className="ai-insight-top">
                <span>{item.type}</span>
                <Sparkles size={12} />
              </div>

              <b>{item.title}</b>
              <p>{item.text}</p>

              <div className="ai-insight-action">
                View ML Signal <ArrowUpRight size={12} />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
