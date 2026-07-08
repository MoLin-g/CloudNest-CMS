import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Layers, ArrowRight, Check } from "lucide-react";
import Card from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { getProducts, getSiteSettings, type ProductData, type SiteSettings } from "@/lib/api";
import { getIcon } from "@/lib/icon-map";

const FALLBACK: ProductData[] = [
  { id: "cloudphone", title: "云手机", subtitle: "", description: "云端独立 Android 实例", gradient: "from-indigo-500 to-blue-500", highlights: [], features: [], specs: [], icon: "Smartphone", sort_order: 1 },
  { id: "sandbox", title: "沙箱环境", subtitle: "", description: "应用隔离运行，安全无痕测试", gradient: "from-purple-500 to-pink-500", highlights: [], features: [], specs: [], icon: "Shield", sort_order: 2 },
  { id: "clone", title: "应用分身", subtitle: "", description: "多账号同时在线，无限多开", gradient: "from-cyan-500 to-teal-500", highlights: [], features: [], specs: [], icon: "Layers", sort_order: 3 },
];

// Map gradients to accent color for small decorative elements
const GRADIENT_ACCENT: Record<string, string> = {
  "from-indigo-500 to-blue-500": "#6366f1",
  "from-purple-500 to-pink-500": "#a855f7",
  "from-cyan-500 to-teal-500": "#14b8a6",
  "from-emerald-500 to-green-500": "#10b981",
  "from-orange-500 to-red-500": "#f97316",
};

const Solutions = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductData[] | null>(null);
  const [settings, setSettings] = useState<SiteSettings>({});

  useEffect(() => {
    getProducts().then(setProducts).catch(() => setProducts(FALLBACK));
    getSiteSettings().then(setSettings).catch(() => {});
  }, []);

  const list = products || FALLBACK;
  // Filter out test/invisible products for display
  const displayList = list.filter(p => p.is_visible !== 0 && p.id !== "测试");

  // Heading from site-settings (products_heading / products_subtitle)
  const heading = settings.products_heading || "三大核心产品";
  const subtitle = settings.products_subtitle || "云端虚拟化技术驱动，满足不同业务场景需求";

  return (
    <section id="products" className="py-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-primary/[0.03] to-transparent" />
        <div className="absolute top-20 left-[10%] w-[400px] h-[400px] bg-primary/[0.03] rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-[5%] w-[350px] h-[350px] bg-purple-500/[0.03] rounded-full blur-3xl" />
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
            <Layers size={15} />
            <span>{heading.replace(/[三大两大一个]+/, "").trim() || "核心产品"}</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-5">
            <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">{heading}</span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto leading-relaxed font-medium">
            {subtitle}
          </p>
        </motion.div>

        {/* Product Cards Grid */}
        <div className={`grid gap-6 ${
          displayList.length <= 3
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        }`}>
          {displayList.map((product, index) => {
            const Icon = getIcon(product.icon);
            const accentColor = GRADIENT_ACCENT[product.gradient] || "#6366f1";
            const previewHighlights = (product.highlights || []).slice(0, 3);

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: index * 0.1 }}
              >
                <div
                  onClick={() => navigate(`/products?tab=${product.id}`)}
                  className="group cursor-pointer h-full rounded-2xl overflow-hidden bg-white dark:bg-slate-900/80 border border-border/50 hover:border-primary/25 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-xl hover:shadow-black/[0.08] hover:-translate-y-1 transition-all duration-300 flex flex-col relative"
                >
                  {/* Top gradient bar */}
                  <div className={`h-2 w-full bg-gradient-to-r ${product.gradient}`} />

                  {/* Card body */}
                  <div className="flex flex-col p-7 lg:p-8 flex-1 min-h-[300px]">
                    {/* Icon area */}
                    <div className="mb-5 relative">
                      <div
                        className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${product.gradient} shadow-lg`}
                        style={{
                          boxShadow: `0 8px 24px ${accentColor}28`,
                        }}
                      >
                        <Icon size={28} className="text-white" />
                      </div>
                      {/* Subtle glow behind icon on hover */}
                      <div className={`absolute -inset-3 bg-gradient-to-br ${product.gradient} opacity-0 group-hover:opacity-[0.08] rounded-3xl blur-xl transition-opacity duration-500`} />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-foreground mb-2.5 group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-purple-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                      {product.title}
                    </h3>

                    {/* Subtitle / Description */}
                    {(product.subtitle || product.description) && (
                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4 font-medium">
                        {product.subtitle || product.description}
                      </p>
                    )}

                    {/* Feature highlights */}
                    {previewHighlights.length > 0 ? (
                      <ul className="space-y-2.5 mb-5 flex-1">
                        {previewHighlights.map((item: any, i: number) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-muted-foreground font-medium"
                          >
                            <Check size={14} className="mt-0.5 shrink-0" style={{ color: `${accentColor}` }} />
                            <span>{typeof item === "string" ? item : item.text}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="flex-1" />
                    )}

                    {/* CTA link */}
                    <div className="pt-4 mt-auto border-t border-border/40">
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all duration-200">
                        了解详情
                        <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-center mt-14"
        >
          <button
            onClick={() => navigate("/products")}
            className="inline-flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-primary to-purple-500 text-white text-sm font-semibold rounded-2xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer border-none"
          >
            <span>查看全部产品详情</span>
            <ArrowRight size={16} />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Solutions;
