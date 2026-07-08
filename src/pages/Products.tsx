import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Layers, Check, ArrowRight, Zap, Tag, Sparkles, Shield, Smartphone, Box, Globe, Cpu, Wifi, HardDrive, Eye, Lock, Server, Cloud, Monitor, Rocket, Gauge, Clock, MapPin, Fingerprint, RefreshCw, Database, Code2, Settings2, Terminal, Layers2, Cable, Radio, Antenna, Satellite, HardDriveDownload, HardDriveUpload, KeyRound, FileCheck, Bell, Users, BarChart3, Activity, CircleDot, Star, Heart, ThumbsUp, Award, BadgeCheck, Crown, Diamond, Gem, Hexagon, Octagon, Pentagon, Square, Triangle, Circle, PentagonIcon, HexagonIcon, OctagonIcon, SquareIcon, TriangleIcon, CircleIcon, StarIcon, HeartIcon, ThumbsUpIcon, AwardIcon, BadgeCheckIcon, CrownIcon, DiamondIcon, GemIcon } from "lucide-react";
import { getProducts, getProductCategories, getSiteSettings, type ProductData } from "@/lib/api";
import { getIcon } from "@/lib/icon-map";

// Section icon mapping for visual variety
const SECTION_ICONS: Record<string, any> = {
  "核心亮点": Sparkles,
  "功能特性": Zap,
  "技术特性": Cpu,
  "产品优势": Award,
  "应用场景": Globe,
  "安全保障": Shield,
  "性能指标": Gauge,
  "部署方案": Server,
  "集成能力": Cable,
  "运维管理": Settings2,
  "网络架构": Wifi,
  "数据存储": Database,
  "开发支持": Code2,
  "监控告警": Bell,
  "用户管理": Users,
  "统计分析": BarChart3,
  "系统架构": Layers2,
  "默认": Check,
};

// Item icon keywords mapping
const ITEM_ICON_MAP: Record<string, any> = {
  "启动": Rocket, "快速": Zap, "秒": Clock, "分钟": Clock, "小时": Clock,
  "节点": MapPin, "全球": Globe, "区域": MapPin, "位置": MapPin,
  "在线": Activity, "24": Activity, "7×24": Activity, "运行": Activity,
  "IP": Globe, "网络": Wifi, "连接": Cable, "带宽": Wifi,
  "隔离": Shield, "安全": Shield, "防护": Shield, "加密": Lock,
  "系统": Server, "环境": Box, "容器": Box, "虚拟": Cloud,
  "CPU": Cpu, "内存": HardDrive, "存储": Database, "硬盘": HardDrive,
  "GPU": Monitor, "显卡": Monitor, "显示": Monitor, "屏幕": Monitor,
  "API": Code2, "接口": Cable, "SDK": Code2, "开发": Terminal,
  "多开": Layers2, "分身": Users, "账号": Users, "用户": Users,
  "监控": Eye, "日志": FileCheck, "告警": Bell, "通知": Bell,
  "备份": RefreshCw, "恢复": RefreshCw, "同步": RefreshCw, "迁移": RefreshCw,
  "自动化": Settings2, "脚本": Terminal, "定时": Clock, "任务": Check,
  "文件": HardDriveDownload, "上传": HardDriveUpload, "下载": HardDriveDownload,
  "远程": Globe, "操控": Smartphone, "控制": Settings2, "管理": Settings2,
  "指纹": Fingerprint, "生物": Fingerprint, "识别": Eye, "认证": BadgeCheck,
  "性能": Gauge, "速度": Zap, "延迟": Clock, "吞吐": BarChart3,
  "扩展": Server, "弹性": Cloud, "伸缩": RefreshCw, "扩容": Server,
  "高可用": Shield, "容灾": Shield, "冗余": Database, "集群": Server,
  "默认": Check,
};

function getItemIcon(key: string): any {
  for (const [keyword, icon] of Object.entries(ITEM_ICON_MAP)) {
    if (key.includes(keyword)) return icon;
  }
  return Check;
}

// Gradient → accent color mapping
const GRADIENT_ACCENT: Record<string, string> = {
  "from-indigo-500 to-blue-500": "#6366f1",
  "from-purple-500 to-pink-500": "#a855f7",
  "from-cyan-500 to-teal-500": "#14b8a6",
  "from-emerald-500 to-green-500": "#10b981",
  "from-orange-500 to-red-500": "#f97316",
  "from-violet-500 to-fuchsia-500": "#8b5cf6",
  "from-sky-500 to-indigo-500": "#6366f1",
  "from-amber-500 to-orange-500": "#f97316",
  "from-rose-500 to-pink-500": "#f43f5e",
  "from-teal-500 to-emerald-500": "#14b8a6",
};
const ACCENT_TEXT: Record<string, string> = {
  "from-indigo-500 to-blue-500": "#6366f1",
  "from-purple-500 to-pink-500": "#a855f7",
  "from-cyan-500 to-teal-500": "#14b8a6",
  "from-emerald-500 to-green-500": "#10b981",
  "from-orange-500 to-red-500": "#f97316",
  "from-violet-500 to-fuchsia-500": "#8b5cf6",
  "from-sky-500 to-indigo-500": "#6366f1",
  "from-amber-500 to-orange-500": "#f97316",
  "from-rose-500 to-pink-500": "#f43f5e",
  "from-teal-500 to-emerald-500": "#14b8a6",
};

interface PricingData {
  id: number;
  product_id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted: number;
  button_text: string;
  gradient: string;
}

const FALLBACK: ProductData[] = [
  {
    id: "cloudphone", icon: "Smartphone", title: "云手机", subtitle: "云端独立 Android 实例，随时随地在线",
    gradient: "from-indigo-500 to-blue-500", description: "...", highlights: [{ text: "10 秒快速启动" }, { text: "全球 50+ 节点" }, { text: "7×24 小时在线" }],
    features: [{ title: "独立系统环境", desc: "完整虚拟化" }, { title: "任意 APK 安装", desc: "自由安装应用" }],
    specs: [{ label: "CPU", value: "4-8核" }], sort_order: 1,
  },
  {
    id: "sandbox", icon: "Shield", title: "沙箱环境", subtitle: "应用隔离运行", gradient: "from-purple-500 to-pink-500",
    description: "...", highlights: [{ text: "完全隔离" }], features: [{ title: "完全隔离", desc: "..." }], specs: [{ label: "隔离级别", value: "系统级" }], sort_order: 2,
  },
  {
    id: "clone", icon: "Layers", title: "应用分身", subtitle: "多账号同时在线", gradient: "from-cyan-500 to-teal-500",
    description: "...", highlights: [{ text: "无限多开" }], features: [{ title: "无限多开", desc: "..." }], specs: [{ label: "分身数量", value: "无上限" }], sort_order: 3,
  },
];

const ProductsPage = () => {
  const [products, setProducts] = useState<ProductData[] | null>(null);
  const [activeTab, setActiveTab] = useState("cloudphone");
  const [settings, setSettings] = useState<any>(null);
  const [telegramLink, setTelegramLink] = useState("https://t.me/CloudNestSupport");
  const [pricing, setPricing] = useState<PricingData[]>([]);
  const [categories, setCategories] = useState<{id:number;name:string}[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    getProducts().then((data) => {
      const parsed = data.map((p: any) => ({
        ...p,
        highlights: typeof p.highlights === "string" ? JSON.parse(p.highlights) : (p.highlights || []),
        features: typeof p.features === "string" ? JSON.parse(p.features) : (p.features || []),
        specs: typeof p.specs === "string" ? JSON.parse(p.specs) : (p.specs || []),
        sections: typeof p.sections === "string" ? JSON.parse(p.sections) : (p.sections || []),
      }));
      setProducts(parsed);
      if (parsed.length > 0) setActiveTab(parsed[0].id);
    }).catch(() => setProducts(FALLBACK));
    getProductCategories().then(setCategories).catch(() => {});
    getSiteSettings().then(s => { setSettings(s); setTelegramLink(s.telegram_products_link || s.telegram_link || "https://t.me/CloudNestSupport"); }).catch(() => {});
  }, []);

  // Fetch pricing when active tab changes
  useEffect(() => {
    fetch(`/api/pricing?product_id=${activeTab}`)
      .then(r => r.json())
      .then(setPricing)
      .catch(() => setPricing([]));
  }, [activeTab]);

  const list = products || FALLBACK;
  const activeProduct = list.find((p) => p.id === activeTab) || list[0];
  const ActiveIcon = getIcon(activeProduct.icon);

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="pt-28 pb-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] to-transparent pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/[0.08] text-primary text-sm font-semibold mb-5 border border-primary/[0.12] backdrop-blur-sm">
              <Layers size={15} />
              <span>产品中心</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-5 tracking-tight">
              {settings?.products_heading || "三大核心"}<span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">产品</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed font-medium">
              {settings?.products_subtitle || "选择适合您的云端解决方案，开启无限可能的数字世界"}
            </p>
          </motion.div>

          {/* Product tabs */}
          <div className="flex justify-center mt-12">
            <div className="inline-flex bg-white dark:bg-slate-900/80 border border-border/50 rounded-2xl p-1.5 shadow-sm backdrop-blur-md">
              {list.map((product) => {
                const PIcon = getIcon(product.icon);
                return (
                  <button
                    key={product.id}
                    onClick={() => setActiveTab(product.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-250 cursor-pointer border-none ${
                      activeTab === product.id
                        ? `bg-gradient-to-r ${product.gradient} text-white shadow-md`
                        : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <PIcon size={18} />
                    {product.title}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24 relative">
        <div className="container mx-auto px-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Product Hero Card */}
            <div className="rounded-3xl overflow-hidden border border-border/40 shadow-lg bg-white dark:bg-slate-900/80 mb-16 relative">
              {/* Top gradient bar */}
              <div className={`h-1.5 w-full bg-gradient-to-r ${activeProduct.gradient}`} />
              {/* Background decoration */}
              <div className={`absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl ${activeProduct.gradient} opacity-[0.03] rounded-full blur-3xl pointer-events-none`} />
              <div className="p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start relative">
                <div className={`flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${activeProduct.gradient} shrink-0 shadow-xl`}
                  style={{ boxShadow: `0 12px 40px ${GRADIENT_ACCENT[activeProduct.gradient] || '#6366f1'}30` }}>
                  <ActiveIcon size={36} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">{activeProduct.title}</h2>
                    {activeProduct.subtitle && (
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${activeProduct.gradient} text-white shadow-md`}>
                        {activeProduct.subtitle}
                      </span>
                    )}
                  </div>
                  {activeProduct.description && (
                    <p className="text-base text-muted-foreground leading-relaxed max-w-2xl font-medium">{activeProduct.description}</p>
                  )}
                  {/* Quick stats row */}
                  <div className="flex flex-wrap gap-4 mt-5">
                    {(activeProduct.highlights || []).slice(0, 4).map((h: any, i: number) => (
                      <div key={i} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-border/30 text-sm font-medium text-foreground">
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center bg-gradient-to-br ${activeProduct.gradient}`}>
                          <Check size={10} className="text-white" />
                        </div>
                        {typeof h === "string" ? h : h.text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic product sections */}
            {activeProduct.sections && activeProduct.sections.length > 0 ? activeProduct.sections.map((section: any, si: number) => {
              const SectionIcon = SECTION_ICONS[section.name] || SECTION_ICONS["默认"];
              const sectionAccent = GRADIENT_ACCENT[activeProduct.gradient] || "#6366f1";
              return (
                <div key={si} className="mb-14">
                  {/* Section heading with icon */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: si * 0.1 }}
                    className="flex items-center gap-3 mb-8"
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br ${activeProduct.gradient}`}
                      style={{ boxShadow: `0 4px 16px ${sectionAccent}22` }}>
                      <SectionIcon size={18} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight">{section.name}</h3>
                    <span className="text-sm text-muted-foreground font-medium ml-auto px-2.5 py-1 rounded-full bg-slate-50 dark:bg-slate-800 border border-border/40">
                      {section.items?.length || 0} 项
                    </span>
                  </motion.div>

                  {/* Feature cards grid - 2 columns on md, 3 on lg */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {section.items.map((item: any, ii: number) => {
                      const ItemIcon = getItemIcon(item.key);
                      const itemAccent = GRADIENT_ACCENT[activeProduct.gradient] || "#6366f1";
                      return (
                        <motion.div
                          key={ii}
                          initial={{ opacity: 0, y: 15 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: ii * 0.05 }}
                        >
                          <div className="h-full rounded-2xl bg-white dark:bg-slate-900/80 border border-border/40 hover:border-primary/30 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-6 group relative overflow-hidden flex flex-col">
                            {/* Subtle gradient background on hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${activeProduct.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none`} />
                            {/* Top accent bar */}
                            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${activeProduct.gradient} opacity-40 group-hover:opacity-100 transition-opacity`} />

                            <div className="relative flex-1 flex flex-col">
                              {/* Icon + Title row */}
                              <div className="flex items-start gap-3.5 mb-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br ${activeProduct.gradient} shadow-md`}
                                  style={{ boxShadow: `0 4px 16px ${itemAccent}25` }}>
                                  <ItemIcon size={18} className="text-white" />
                                </div>
                                <div className="min-w-0 flex-1 pt-0.5">
                                  <h4 className="font-bold text-base text-foreground group-hover:text-primary transition-colors leading-snug break-words">{item.key}</h4>
                                </div>
                              </div>
                              {/* Description */}
                              <p className="text-sm text-muted-foreground leading-relaxed pl-[52px] break-words flex-1 font-medium">{item.value}</p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            }) : (
            // Legacy fallback for old data
            <>
              {(activeProduct.highlights || []).length > 0 && (
                <div className="mb-14">
                  <div className="flex items-center gap-3 mb-8">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br ${activeProduct.gradient}`}
                      style={{ boxShadow: `0 4px 16px ${GRADIENT_ACCENT[activeProduct.gradient] || '#6366f1'}22` }}>
                      <Sparkles size={18} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold tracking-tight">核心亮点</h3>
                    <span className="text-xs text-muted-foreground font-medium ml-auto px-2.5 py-1 rounded-full bg-slate-50 dark:bg-slate-800 border border-border/40">
                      {(activeProduct.highlights || []).length} 项
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {(activeProduct.highlights as any[]).map((h: any, i: number) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: i * 0.04 }}
                        className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-white dark:bg-slate-900/80 border border-border/40 shadow-sm hover:shadow-md hover:border-primary/25 hover:-translate-y-0.5 transition-all duration-300"
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center bg-gradient-to-br ${activeProduct.gradient}`}
                          style={{ boxShadow: `0 2px 8px ${GRADIENT_ACCENT[activeProduct.gradient] || '#6366f1'}22` }}>
                          <Check size={14} className="text-white" />
                        </div>
                        <span className="text-sm font-medium text-foreground">{typeof h === "string" ? h : h.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </>
            )}

          {/* Pricing Plans for this product */}
            {pricing.length > 0 ? (
              <div className="mt-16">
                <div className="text-center mb-12">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/[0.08] text-primary text-sm font-semibold mb-5 border border-primary/[0.12]"
                  >
                    <Tag size={14} />
                    <span>{activeProduct.title} 价格方案</span>
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="text-2xl md:text-3xl font-extrabold tracking-tight"
                  >
                    灵活<span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">定价方案</span>
                  </motion.h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                  {pricing.map((plan, index) => {
                    const isHighlighted = plan.highlighted === 1;
                    const planGradient = plan.gradient || "from-slate-500 to-gray-500";
                    // Generate friendly names if all are "新套餐"
                    const friendlyNames = ["基础版", "专业版", "企业版"];
                    const displayName = plan.name === "新套餐" ? (friendlyNames[index] || plan.name) : plan.name;
                    return (
                      <motion.div
                        key={plan.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.15 }}
                        className="relative"
                      >
                        {isHighlighted && (
                          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-primary to-purple-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg shadow-primary/25">
                              <Zap size={12} /> 最受欢迎
                            </span>
                          </div>
                        )}
                        <div className={`h-full rounded-2xl overflow-hidden border transition-all duration-300 ${
                          isHighlighted
                            ? "border-primary/40 shadow-xl shadow-primary/10 scale-[1.02] bg-white dark:bg-slate-900"
                            : "border-border/50 bg-white dark:bg-slate-900/80 hover:border-border hover:shadow-lg hover:-translate-y-0.5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                        }`}>
                          <div className={`p-6 pb-4 ${
                            isHighlighted
                              ? "bg-gradient-to-br from-primary/[0.04] to-purple-500/[0.03]"
                              : "bg-transparent"
                          }`}>
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-xl font-bold text-foreground">{displayName}</h4>
                              {!isHighlighted && (
                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-2 py-0.5 rounded-full border border-border/40 bg-slate-50 dark:bg-slate-800">Standard</span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-4 font-medium">{plan.description}</p>
                            <div className="flex items-baseline gap-1">
                              <span className="text-4xl font-extrabold text-foreground">{plan.price}</span>
                              <span className="text-sm text-muted-foreground font-medium">{plan.period}</span>
                            </div>
                          </div>
                          <div className={`mx-6 h-px ${isHighlighted ? "bg-primary/15" : "bg-border/60"}`} />
                          <div className="p-6 pt-5">
                            <ul className="space-y-3 mb-7">
                              {(plan.features || []).map((feat, fi) => (
                                <li key={fi} className="flex items-start gap-2.5 text-sm text-muted-foreground font-medium">
                                  <Check size={16} className={`mt-0.5 shrink-0 ${isHighlighted ? "text-primary" : "text-green-500"}`} />
                                  <span>{feat}</span>
                                </li>
                              ))}
                            </ul>
                            <a
                              href={telegramLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`block w-full text-center py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                                isHighlighted
                                  ? "bg-gradient-to-r from-primary to-purple-500 text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02]"
                                  : "bg-slate-100 dark:bg-slate-800 text-foreground border border-border/60 hover:bg-slate-200 dark:hover:bg-slate-700 hover:border-border"
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
            ) : (
              <div className="mt-16">
                <div className="text-center mb-10">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/[0.08] text-primary text-sm font-semibold mb-5 border border-primary/[0.12]"
                  >
                    <Tag size={14} />
                    <span>{activeProduct.title} 价格方案</span>
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="text-2xl md:text-3xl font-extrabold tracking-tight"
                  >
                    灵活<span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">定价方案</span>
                  </motion.h3>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="max-w-md mx-auto text-center rounded-2xl border border-dashed border-border/60 bg-slate-50/50 dark:bg-slate-900/30 p-10"
                >
                  <div className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-gradient-to-br ${activeProduct.gradient}`}
                    style={{ boxShadow: `0 6px 24px ${GRADIENT_ACCENT[activeProduct.gradient] || '#6366f1'}25` }}>
                    <Tag size={24} className="text-white" />
                  </div>
                  <h4 className="text-xl font-bold mb-2 text-foreground">价格方案即将上线</h4>
                  <p className="text-sm text-muted-foreground mb-5 leading-relaxed font-medium">我们正在为您准备最具竞争力的定价方案，敬请期待</p>
                  <button
                    onClick={() => window.open(telegramLink, "_blank")}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r ${activeProduct.gradient} shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer border-none`}
                  >
                    联系获取报价
                    <ArrowRight size={14} />
                  </button>
                </motion.div>
              </div>
            )}
          </motion.div>

          <div className="mt-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto rounded-3xl overflow-hidden border border-border/40 shadow-lg bg-white dark:bg-slate-900/80 relative"
            >
              <div className={`h-1.5 w-full bg-gradient-to-r ${activeProduct.gradient}`} />
              <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl ${activeProduct.gradient} opacity-[0.04] rounded-full blur-3xl pointer-events-none`} />
              <div className="p-10 md:p-14 relative">
                <div className={`w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center bg-gradient-to-br ${activeProduct.gradient} shadow-xl`}
                  style={{ boxShadow: `0 10px 32px ${GRADIENT_ACCENT[activeProduct.gradient] || '#6366f1'}30` }}>
                  <Rocket size={28} className="text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold mb-3 text-foreground">准备开始使用 {activeProduct.title}？</h3>
                <p className="text-base text-muted-foreground mb-8 leading-relaxed max-w-md mx-auto font-medium">联系我们获取专属方案和免费试用，专业团队为您量身定制最优解决方案</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => window.open(telegramLink, "_blank")}
                    className={`inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r ${activeProduct.gradient} text-white font-semibold text-sm rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer border-none`}
                    style={{ boxShadow: `0 8px 32px ${GRADIENT_ACCENT[activeProduct.gradient] || '#6366f1'}33` }}
                  >
                    联系 Telegram
                    <ArrowRight size={16} />
                  </button>
                  <a
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-slate-100 dark:bg-slate-800 text-foreground font-semibold text-sm rounded-2xl border border-border/60 hover:bg-slate-200 dark:hover:bg-slate-700 hover:border-border transition-all duration-300"
                  >
                    了解更多
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductsPage;
