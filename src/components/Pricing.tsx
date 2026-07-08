import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Zap, Tag } from "lucide-react";
import { getSiteSettings } from "@/lib/api";

interface PricingPlan {
  id: number;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted: number;
  button_text: string;
  gradient: string;
}

const FALLBACK: PricingPlan[] = [];

const Pricing = () => {
  const [plans, setPlans] = useState<PricingPlan[] | null>(null);
  const [telegramLink, setTelegramLink] = useState("https://t.me/CloudNestSupport");

  useEffect(() => {
    fetch("/api/pricing")
      .then(r => r.json())
      .then(setPlans)
      .catch(() => setPlans(FALLBACK));
    getSiteSettings().then(s => {
      if (s.telegram_cta_link) setTelegramLink(s.telegram_cta_link);
      else if (s.telegram_link) setTelegramLink(s.telegram_link);
    }).catch(() => {});
  }, []);

  if (!plans || plans.length === 0) return null;

  return (
    <section id="pricing" className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-2 bg-white/10 text-sky-400 px-4 py-1.5 rounded-full text-sm font-medium mb-6 backdrop-blur-sm border border-white/10">
            <Tag size={16} />
            <span>价格方案</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            灵活<span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">定价方案</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            从个人到企业，选择最适合您的方案
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {plans.map((plan, index) => {
            const isHighlighted = plan.highlighted === 1;
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative"
              >
                {/* Highlight badge */}
                {isHighlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                    <span className="inline-flex items-center gap-1 bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg shadow-indigo-500/30">
                      <Zap size={12} /> 最受欢迎
                    </span>
                  </div>
                )}

                <div className={`h-full rounded-2xl overflow-hidden border transition-all duration-300 backdrop-blur-sm ${
                  isHighlighted
                    ? "border-indigo-400/60 shadow-xl shadow-indigo-500/20 scale-[1.03] bg-white/[0.08]"
                    : "border-white/[0.10] bg-white/[0.05] hover:border-white/[0.18] hover:bg-white/[0.08] hover:shadow-lg hover:shadow-black/20"
                }`}>
                  {/* Header */}
                  <div className={`p-6 pb-4 ${
                    isHighlighted
                      ? "bg-gradient-to-br from-indigo-500/20 to-blue-600/15"
                      : "bg-gradient-to-b from-white/[0.06] to-transparent"
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`text-lg font-bold ${isHighlighted ? "text-white" : "text-slate-200"}`}>{plan.name}</h3>
                      {!isHighlighted && (
                        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold px-2 py-0.5 rounded-full border border-white/10">Standard</span>
                      )}
                    </div>
                    <p className={`text-sm mb-4 ${isHighlighted ? "text-slate-300" : "text-slate-400"}`}>{plan.description}</p>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-3xl font-extrabold ${isHighlighted ? "text-white" : "text-slate-100"}`}>{plan.price}</span>
                      <span className={`text-sm ${isHighlighted ? "text-slate-300" : "text-slate-500"}`}>{plan.period}</span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className={`mx-6 h-px ${isHighlighted ? "bg-indigo-400/20" : "bg-white/[0.08]"}`} />

                  {/* Features */}
                  <div className="p-6 pt-5">
                    <ul className="space-y-3 mb-7">
                      {plan.features.map((feat, fi) => (
                        <li key={fi} className={`flex items-start gap-2.5 text-sm ${isHighlighted ? "text-slate-300" : "text-slate-400"}`}>
                          <Check size={16} className={`mt-0.5 shrink-0 ${isHighlighted ? "text-sky-400" : "text-emerald-400"}`} />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Button */}
                    <a
                      href={plan.button_text === "联系我们" ? telegramLink : telegramLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block w-full text-center py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                        isHighlighted
                          ? "bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-[1.02]"
                          : "bg-white/[0.08] text-slate-200 border border-white/12 hover:bg-white/[0.14] hover:border-white/[0.2]"
                      }`}
                    >
                      {plan.button_text}
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
