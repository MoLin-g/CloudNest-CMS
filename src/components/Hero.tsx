import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Send, Users, CircleCheck, Globe, Sparkles } from "lucide-react";
import Hero3DBackground from "./Hero3DBackground";
import { getHero, getAllHeroes, getSiteSettings, type HeroData, type SiteSettings } from "@/lib/api";

const HERO_FALLBACK: HeroData = {
  badge: "全新发布",
  badge_subtitle: "更强大、更全的云手机解决方案",
  main_title: "云手机·",
  subtitle1: "沙箱·",
  subtitle2: "分身",
  description: "CloudNest 为您提供安全、稳定、高效的云虚拟环境",
  stats: [
    { value: "10,000+", label: "全球用户" },
    { value: "99.9%", label: "稳定运行" },
    { value: "50+", label: "全球节点" },
  ],
  primary_btn_text: "立即免费试用",
  primary_btn_link: "/products",
  secondary_btn_text: "加入 Telegram",
  secondary_btn_link: "",
  cta_subtitle: "注册即享 7 天免费试用，无需绑定信用卡",
};

const STAT_ICONS = [Users, CircleCheck, Globe];

const Hero = () => {
  const [heroes, setHeroes] = useState<HeroData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    getAllHeroes().then(data => {
      const visible = (data || []).filter(h => h.is_visible !== 0);
      setHeroes(visible.length > 0 ? visible : [HERO_FALLBACK]);
    }).catch(() => setHeroes([HERO_FALLBACK]));
    getSiteSettings().then(setSettings).catch(() => {});
  }, []);

  const next = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % heroes.length);
  }, [heroes.length]);

  // Auto-rotate every 6s if multiple heroes
  useEffect(() => {
    if (heroes.length <= 1) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [heroes.length, next]);

  const h = heroes[currentIndex] || heroes[0] || HERO_FALLBACK;
  const hasMultiple = heroes.length > 1;

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <Hero3DBackground />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.15),transparent_70%)] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 pt-20 pb-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <span className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full glass-card text-sm text-primary border-primary/30">
                  <Sparkles size={14} />
                  <span>{h.badge}</span>
                  {h.badge_subtitle && (
                    <span className="text-muted-foreground">{h.badge_subtitle}</span>
                  )}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight whitespace-nowrap tracking-tight"
              >
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-sm">{h.main_title}</span>
                <span className="text-foreground mx-3">·</span>
                <span className="text-foreground">{h.subtitle1}</span>
                <span className="text-foreground mx-3">·</span>
                <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent drop-shadow-sm">{h.subtitle2}</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed whitespace-pre-line font-medium"
              >
                {h.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="flex flex-col sm:flex-row gap-4 mb-4"
              >
                <Button size="lg" className="gradient-primary hover:opacity-90 transition-opacity group px-8 h-12 text-base"
                  onClick={() => {
                    const link = h.primary_btn_link || "/products";
                    if (link.startsWith("http")) window.open(link, "_blank");
                    else window.location.href = link;
                  }}>
                  {h.primary_btn_text || "立即免费试用"}
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-border text-foreground hover:bg-card hover:text-foreground px-8 h-12 text-base"
                  onClick={() => {
                    const link = h.secondary_btn_link || (settings?.telegram_hero_link || settings?.telegram_link || "https://t.me/CloudNestSupport");
                    window.open(link, "_blank");
                  }}
                >
                  {h.secondary_btn_text || "加入 Telegram"}
                  <Send className="ml-2" size={16} />
                </Button>
              </motion.div>

              {h.cta_subtitle && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="text-sm text-muted-foreground mb-8 -mt-2"
                >
                  {h.cta_subtitle}
                </motion.p>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.55 }}
                className="flex flex-wrap gap-8"
              >
                {h.stats.map((stat, index) => {
                  const Icon = STAT_ICONS[index] || Users;
                  return (
                    <div key={index} className="flex items-center space-x-3">
                      <Icon size={24} className="text-primary/80" />
                      <div>
                        <div className="text-2xl font-extrabold text-foreground">{stat.value}</div>
                        <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:flex justify-center items-center relative"
            >
              {h.hero_image ? (
                <img src={h.hero_image} alt="Hero" className="w-[380px] h-[520px] object-cover rounded-[40px] shadow-2xl shadow-indigo-500/20" />
              ) : (
              <div className="relative w-[380px] h-[520px] rounded-[40px] border border-white/10 bg-gradient-to-br from-slate-900/80 to-indigo-950/40 backdrop-blur-sm shadow-2xl shadow-indigo-500/20 overflow-hidden">
                <div className="absolute inset-4 rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 overflow-hidden">
                  <div className="flex justify-between items-center px-6 pt-3 pb-2">
                    <span className="text-[11px] text-white/60">16:41</span>
                    <div className="flex space-x-1">
                      <div className="w-4 h-2 rounded-sm bg-white/40"></div>
                    </div>
                  </div>
                  <div className="px-5 pt-2 pb-3">
                    <p className="text-white/80 text-sm font-medium">Cloud Phone 001</p>
                    <p className="text-white/40 text-xs">已启动 · 3 个应用</p>
                  </div>
                  <div className="px-4 grid grid-cols-4 gap-y-4 gap-x-2 mt-2">
                    {[
                      { name: "抖音", color: "bg-black", emoji: "🎵" },
                      { name: "Instagram", color: "bg-pink-500/80", emoji: "📷" },
                      { name: "WhatsApp", color: "bg-green-500/80", emoji: "💬" },
                      { name: "Telegram", color: "bg-blue-400/60", emoji: "✈️" },
                      { name: "Facebook", color: "bg-blue-600/80", emoji: "f" },
                      { name: "Twitter", color: "bg-blue-400/80", emoji: "🐦" },
                      { name: "Chrome", color: "bg-red-500/60", emoji: "◉" },
                      { name: "YouTube", color: "bg-red-600/80", emoji: "▶" },
                    ].map((app, i) => (
                      <div key={i} className="flex flex-col items-center space-y-1.5">
                        <div className={`w-12 h-12 rounded-2xl ${app.color} flex items-center justify-center text-lg shadow-md`}>
                          {app.emoji}
                        </div>
                        <span className="text-[9px] text-white/50">{app.name}</span>
                      </div>
                    ))}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex justify-around items-end pb-1">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div className={`w-7 h-7 ${i === 0 ? "bg-primary/30" : ""} rounded-lg`}></div>
                        <div className="w-1 h-1 mt-1 rounded-full bg-white/20"></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-cyan-500/20 blur-2xl rounded-[50px] -z-10" />
              </div>
              )}
              <div className="absolute top-10 right-0 w-16 h-16 rounded-full bg-purple-500/20 blur-xl animate-pulse" />
              <div className="absolute bottom-20 left-0 w-24 h-24 rounded-full bg-cyan-500/15 blur-xl animate-pulse" style={{ animationDelay: "1s" }} />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Carousel dots */}
      {hasMultiple && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {heroes.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer border-none ${
                i === currentIndex ? "bg-primary scale-125" : "bg-foreground/20 hover:bg-foreground/40"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Hero;
