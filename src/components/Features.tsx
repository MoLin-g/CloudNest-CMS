import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { getFeatures, type FeatureData } from "@/lib/api";
import { getIcon } from "@/lib/icon-map";

const FALLBACK: FeatureData[] = [
  { id: 1, icon: "Zap", title: "10秒快速启动", description: "即开即用、快速部署", icon_gradient: "from-yellow-400 to-orange-500", sort_order: 1 },
  { id: 2, icon: "Shield", title: "独立IP环境", description: "纯净IP、防检测封禁", icon_gradient: "from-cyan-400 to-blue-500", sort_order: 2 },
  { id: 3, icon: "Globe", title: "全球节点覆盖", description: "50+国家地区节点", icon_gradient: "from-sky-400 to-indigo-500", sort_order: 3 },
  { id: 4, icon: "CloudDownload", title: "无需Root", description: "免Root操作、安装即用", icon_gradient: "from-emerald-400 to-teal-500", sort_order: 4 },
  { id: 5, icon: "Smartphone", title: "APK自由安装", description: "支持自定义安装应用", icon_gradient: "from-violet-400 to-purple-500", sort_order: 5 },
  { id: 6, icon: "Headphones", title: "专业技术支持", description: "7x24小时在线服务", icon_gradient: "from-pink-400 to-rose-500", sort_order: 6 },
];

const GRADIENT_ACCENT: Record<string, string> = {
  "from-yellow-400 to-orange-500": "#f97316",
  "from-cyan-400 to-blue-500": "#3b82f6",
  "from-sky-400 to-indigo-500": "#6366f1",
  "from-emerald-400 to-teal-500": "#14b8a6",
  "from-violet-400 to-purple-500": "#8b5cf6",
  "from-pink-400 to-rose-500": "#ec4899",
};

const Features = () => {
  const [features, setFeatures] = useState<FeatureData[] | null>(null);

  useEffect(() => {
    getFeatures().then(setFeatures).catch(() => setFeatures(FALLBACK));
  }, []);

  const list = features || FALLBACK;

  return (
    <section id="advantages" className="py-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-b from-primary/[0.02] to-transparent" />
        <div className="absolute top-[20%] right-[5%] w-[350px] h-[350px] bg-purple-500/[0.03] rounded-full blur-3xl" />
        <div className="absolute bottom-[15%] left-[8%] w-[280px] h-[280px] bg-cyan-500/[0.03] rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10 max-w-6xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/[0.08] text-primary text-sm font-semibold mb-5 border border-primary/[0.12] backdrop-blur-sm">
            <Sparkles size={15} />
            <span>核心优势</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-5">
            核心<span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">优势</span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-md mx-auto leading-relaxed font-medium">
            为什么选择 CloudNest
          </p>
        </motion.div>

        {/* Feature Cards - 3 columns on desktop, 2 on tablet */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {list.map((feature) => {
            const Icon = getIcon(feature.icon);
            const accentColor = GRADIENT_ACCENT[feature.icon_gradient || ''] || "#6366f1";

            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (feature.sort_order - 1) * 0.07 }}
              >
                <div className={`group h-full rounded-2xl overflow-hidden bg-white dark:bg-slate-900/80 border border-border/40 hover:border-primary/25 shadow-[0_1px_4px_rgba(0,0,0,0.03)] hover:shadow-xl hover:shadow-black/[0.08] hover:-translate-y-1 transition-all duration-300 relative p-7`}>
                  {/* Top accent bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${feature.icon_gradient}`} />

                  <div className="flex flex-col h-full pt-2">
                    {/* Icon with glow */}
                    <div className="mb-5 relative inline-flex self-start">
                      <div
                        className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.icon_gradient}`}
                        style={{
                          boxShadow: `0 8px 24px ${accentColor}33`,
                        }}
                      >
                        <Icon size={26} className="text-white drop-shadow-sm" />
                      </div>
                    </div>

                    {/* Title + Description */}
                    <h3 className="text-lg font-bold text-foreground mb-2.5 group-hover:text-primary transition-colors duration-200">
                      {feature.title}
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed flex-1 font-medium">
                      {feature.description}
                    </p>

                    {/* Bottom subtle indicator line */}
                    <div className={`mt-5 h-1 w-12 rounded-full bg-gradient-to-r ${feature.icon_gradient} opacity-30 group-hover:w-20 group-hover:opacity-70 transition-all duration-300`} />
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

export default Features;
