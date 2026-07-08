import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { getIcon } from "@/lib/icon-map";

interface ProductFeature {
  id: number;
  icon: string;
  title: string;
  description: string;
  gradient: string;
  category: string;
}

const GRADIENT_ACCENT: Record<string, string> = {
  "from-indigo-500 to-blue-500": "#6366f1",
  "from-purple-500 to-pink-500": "#a855f7",
  "from-cyan-500 to-teal-500": "#14b8a6",
  "from-emerald-500 to-green-500": "#10b981",
  "from-orange-500 to-red-500": "#f97316",
  "from-violet-500 to-fuchsia-500": "#8b5cf6",
};

const FALLBACK: ProductFeature[] = [];

const ProductFeatures = () => {
  const [features, setFeatures] = useState<ProductFeature[] | null>(null);

  useEffect(() => {
    fetch("/api/product-features")
      .then(r => r.json())
      .then(setFeatures)
      .catch(() => setFeatures(FALLBACK));
  }, []);

  if (!features || features.length === 0) return null;

  // Group by category
  const categories = new Map<string, ProductFeature[]>();
  features.forEach(f => {
    const cat = f.category || "通用";
    if (!categories.has(cat)) categories.set(cat, []);
    categories.get(cat)!.push(f);
  });

  return (
    <section id="product-features" className="py-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-b from-primary/[0.02] to-transparent" />
        <div className="absolute top-[30%] right-[5%] w-[300px] h-[300px] bg-purple-500/[0.03] rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/[0.08] text-primary text-sm font-semibold mb-5 border border-primary/[0.12] backdrop-blur-sm">
            <Sparkles size={15} />
            <span>产品功能</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-5">
            全面<span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">产品功能</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed font-medium">
            三大产品线，覆盖云端虚拟化全部场景
          </p>
        </motion.div>

        {/* Category sections */}
        {Array.from(categories.entries()).map(([category, items], catIdx) => {
          const firstGradient = items[0]?.gradient || "from-indigo-500 to-blue-500";
          const accentColor = GRADIENT_ACCENT[firstGradient] || "#6366f1";

          return (
            <div key={category} className="mb-10 last:mb-0">
              {/* Section heading */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: catIdx * 0.1 }}
                className="flex items-center gap-3 mb-6"
              >
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
                    boxShadow: `0 0 12px ${accentColor}66`,
                  }}
                />
                <h3 className="text-xl font-bold tracking-tight">{category}</h3>
                <span className="text-sm text-muted-foreground font-medium ml-auto">{items.length} 项</span>
              </motion.div>

              {/* Feature cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {items.map((feat, idx) => {
                  const Icon = getIcon(feat.icon);
                  const featAccent = GRADIENT_ACCENT[feat.gradient] || "#6366f1";
                  return (
                    <motion.div
                      key={feat.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.06 }}
                      className="group h-full rounded-2xl overflow-hidden bg-white dark:bg-slate-900/80 border border-border/50 hover:border-primary/25 shadow-[0_1px_4px_rgba(0,0,0,0.03)] hover:shadow-md hover:-translate-y-1 transition-all duration-300 p-6 flex items-start gap-4 relative"
                    >
                      {/* Top accent line */}
                      <div className={`absolute top-0 left-6 right-6 h-0.5 bg-gradient-to-r ${feat.gradient || "from-indigo-500 to-blue-500"} opacity-20 group-hover:opacity-70 transition-opacity`} />
                      {/* Icon */}
                      <div
                        className={`shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${feat.gradient || "from-indigo-500 to-blue-500"} flex items-center justify-center`}
                        style={{ boxShadow: `0 6px 20px ${featAccent}28` }}
                      >
                        <Icon size={22} className="text-white" />
                      </div>
                      {/* Text */}
                      <div className="min-w-0 flex-1 pt-1">
                        <h4 className="font-bold text-base mb-1.5 text-foreground group-hover:text-primary transition-colors">{feat.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed font-medium">{feat.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ProductFeatures;
