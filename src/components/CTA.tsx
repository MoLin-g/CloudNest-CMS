import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Send } from "lucide-react";
import { getCTA, getSiteSettings, type CTAData, type SiteSettings } from "@/lib/api";

const FALLBACK: CTAData = {
  title: "准备好开始了吗？",
  subtitle: "加入 CloudNest，探索云端虚拟化的无限可能",
  button_text: "立即免费试用",
  secondary_button_text: "加入 Telegram",
};

const CTA = () => {
  const [cta, setCta] = useState<CTAData | null>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    getCTA().then((data: any) => {
      const ctaData = Array.isArray(data) ? (data[0] || null) : data;
      setCta(ctaData);
    }).catch(() => setCta(FALLBACK));
    getSiteSettings().then(setSettings).catch(() => {});
  }, []);

  const c = cta || FALLBACK;

  return (
    <section id="cta" className="py-24 relative overflow-hidden">
      {/* Background gradient mesh */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-purple-500/[0.03] to-cyan-500/[0.03]" />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.06, 0.1, 0.06] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[10%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.06, 0.1, 0.06] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[5%] right-[10%] w-[350px] h-[350px] bg-purple-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`max-w-3xl mx-auto rounded-3xl overflow-hidden border border-border/40 shadow-xl shadow-black/[0.05] relative`}
        >
          {/* Top gradient bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-primary via-purple-500 to-cyan-500" />

          {/* Card body */}
          <div className="bg-white dark:bg-slate-900/90 p-12 md:p-16 text-center backdrop-blur-sm">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-5 tracking-tight text-foreground">
              {c.title}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-lg mx-auto leading-relaxed font-medium">
              {c.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {/* Primary button */}
              <button
                onClick={() => window.location.href = "/products"}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-primary to-purple-500 text-white font-semibold text-sm rounded-2xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer border-none"
              >
                {c.button_text}
                <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Secondary button */}
              <button
                onClick={() => {
                  const link = settings?.telegram_cta_link || settings?.telegram_link || "https://t.me/CloudNestSupport";
                  window.open(link, "_blank");
                }}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-slate-100 dark:bg-slate-800 text-foreground font-semibold text-sm rounded-2xl border border-border/60 hover:border-border hover:bg-slate-200 dark:hover:bg-slate-700 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer shadow-sm"
              >
                <Send size={16} />
                {c.secondary_button_text}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
