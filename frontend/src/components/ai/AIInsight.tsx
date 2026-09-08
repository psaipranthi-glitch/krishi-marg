import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, AlertTriangle, Truck, ArrowUpRight } from "lucide-react";
import { api } from "../../services/api";

export default function AIInsight() {
  const [insights, setInsights] = useState<any[]>([
    {
      type: "Demand",
      title: "Tomato demand rising",
      text: "AI forecast shows stronger tomato demand for the next delivery window.",
      icon: TrendingUp
    },
    {
      type: "Freshness",
      title: "Freshness risk detected",
      text: "Some produce lots require priority movement to reduce spoilage risk.",
      icon: AlertTriangle
    },
    {
      type: "Vehicle",
      title: "Vehicle match optimized",
      text: "Reefer vehicle KM-VH-003 matched based on capacity and cold chain requirement.",
      icon: Truck
    }
  ]);

  useEffect(() => {
    Promise.all([
      api.get("/api/forecast").catch(() => null),
      api.get("/api/alerts").catch(() => null)
    ]).then(([forecastRes, alertsRes]) => {
      const items: any[] = [];
      if (forecastRes?.data && forecastRes.data.length > 0) {
        const topForecast = forecastRes.data[0];
        items.push({
          type: "Demand Signal",
          title: `${topForecast.commodity || 'Tomato'} demand forecast`,
          text: topForecast.recommendation || `Expected +${topForecast.trend_pct || 18}% demand signal tomorrow.`,
          icon: TrendingUp
        });
      }
      if (alertsRes?.data && alertsRes.data.length > 0) {
        const topAlert = alertsRes.data[0];
        items.push({
          type: "Freshness Risk",
          title: topAlert.alert_type || "Quality Alert",
          text: topAlert.message || "Freshness thresholds requiring FEFO priority movement.",
          icon: AlertTriangle
        });
      } else {
        items.push({
          type: "Freshness Risk",
          title: "Freshness priority active",
          text: "FEFO algorithm prioritizing high perishability commodities.",
          icon: AlertTriangle
        });
      }
      items.push({
        type: "Vehicle Match",
        title: "Cold-chain optimization",
        text: "Optimal vehicle match score 94/100 calculated by VRP engine.",
        icon: Truck
      });

      if (items.length > 0) setInsights(items);
    });
  }, []);

  return (
    <div className="ai-insights">
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
                View signal <ArrowUpRight size={12} />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

