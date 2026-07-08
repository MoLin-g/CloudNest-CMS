import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Target } from "lucide-react";
import { getUseCases, type UseCaseData } from "@/lib/api";
import { getIcon } from "@/lib/icon-map";

const FALLBACK: UseCaseData[] = [
  { id: 1, icon: "Music2", title: "社媒运营", description: "多账号批量管理", gradient: "from-violet-500 to-fuchsia-500", tags: JSON.stringify(["TikTok", "Instagram", "Facebook"]), icon_bg: "bg-violet-500/15", sort_order: 1 },
  { id: 2, icon: "Gamepad2", title: "游戏多开", description: "新游戏开、轻松上分", gradient: "from-blue-500 to-cyan-400", tags: JSON.stringify(["Clash of Clans", "PUBG", "ML"]), icon_bg: "bg-blue-500/15", sort_order: 2 },
  { id: 3, icon: "ShoppingBag", title: "跨境电商", description: "多店铺管理、安全关联", gradient: "from-pink-500 to-rose-500", tags: JSON.stringify(["亚马逊", "eBay", "Shopify"]), icon_bg: "bg-pink-500/15", sort_order: 3 },
  { id: 4, icon: "Megaphone", title: "广告投放", description: "多环境测试、提升ROI", gradient: "from-orange-500 to-amber-400", tags: JSON.stringify(["广告测试", "投放优化"]), icon_bg: "bg-orange-500/15", sort_order: 4 },
  { id: 5, icon: "TestTube", title: "应用测试", description: "安全沙盒、放心测试", gradient: "from-teal-400 to-emerald-500", tags: JSON.stringify(["开发测试", "应用体验"]), icon_bg: "bg-teal-500/15", sort_order: 5 },
];

const GRADIENT_ACCENT: Record<string, string> = {
  "from-violet-500 to-fuchsia-500": "#8b5cf6",
  "from-blue-500 to-cyan-400": "#3b82f6",
  "from-pink-500 to-rose-500": "#ec4899",
  "from-orange-500 to-amber-400": "#f97316",
  "from-teal-400 to-emerald-500": "#14b8a6",
  "from-indigo-500 to-blue-500": "#6366f1",
};

function parseTags(tags: string | undefined): string[] {
  if (!tags) return [];
  try {
    let parsed = JSON.parse(tags);
    if (typeof parsed === "string") parsed = JSON.parse(parsed);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const UseCases = () => {
  const [useCases, setUseCases] = useState<UseCaseData[] | null>(null);

  useEffect(() => {
    getUseCases().then(setUseCases).catch(() => setUseCases(FALLBACK));
  }, []);

  const list = useCases || FALLBACK;

  return (
    <section id="usecases" className="py-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[8%] w-[320px] h-[320px] bg-cyan-500/[0.03] rounded-full blur-3xl" />
        <div className="absolute bottom-[15%] right-[10%] w-[280px] h-[280px] bg-purple-500/[0.03] rounded-full blur-3xl" />
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
            <Target size={15} />
            <span>应用场景</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-5">
            适用于<span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">多种场景</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-md mx-auto leading-relaxed font-medium">
            满足您的多样化需求
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {list.map((useCase, index) => {
            const Icon = getIcon(useCase.icon);
            const tags = parseTags(useCase.tags);
            const accentColor = GRADIENT_ACCENT[useCase.gradient] || "#6366f1";
            return (
              <motion.div
                key={useCase.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group"
              >
                <div className="h-full rounded-2xl overflow-hidden bg-white dark:bg-slate-900/80 border border-border/50 hover:border-primary/25 shadow-[0_1px_4px_rgba(0,0,0,0.03)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-6 relative cursor-pointer">
                  {/* Top accent bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${useCase.gradient}`} />

                  {/* Icon */}
                  <div
                    className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${useCase.gradient} text-white shadow-lg mb-5 group-hover:scale-110 transition-transform duration-300`}
                    style={{ boxShadow: `0 8px 24px ${accentColor}33` }}
                  >
                    <Icon size={26} />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-foreground mb-2.5 group-hover:text-primary transition-colors duration-200">
                    {useCase.title}
                  </h3>

                  {/* Tags */}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {tags.map((tag, i) => (
                        <span key={i} className="text-xs px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-muted-foreground border border-border/30 font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                    {useCase.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UseCases;
