import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { getSiteSettings, getNavMenus } from "@/lib/api";
import { Menu, X, Send, Sun, Moon, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";

const FALLBACK_MENUS = [
  { id: 1, label: "首页", type: "route" as const, target: "/", sort_order: 1, is_visible: 1 },
  { id: 2, label: "产品", type: "route" as const, target: "/products", sort_order: 2, is_visible: 1 },
  { id: 3, label: "优势", type: "scroll" as const, target: "advantages", sort_order: 3, is_visible: 1 },
  { id: 4, label: "应用场景", type: "scroll" as const, target: "usecases", sort_order: 4, is_visible: 1 },
  { id: 5, label: "帮助中心", type: "route" as const, target: "/help", sort_order: 5, is_visible: 1 },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [telegramLink, setTelegramLink] = useState("https://t.me/CloudNestSupport");
  const [navMenus, setNavMenus] = useState(FALLBACK_MENUS);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { currentLang, setLang, supportedLangs } = useLanguage();
  const { t } = useTranslation();
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getSiteSettings().then((s) => {
      setTelegramLink(s.telegram_nav_link || s.telegram_link || "https://t.me/CloudNestSupport");
    }).catch(() => {});
  }, []);

  useEffect(() => {
    getNavMenus().then((menus) => {
      const visible = (menus || []).filter((m) => m.is_visible === 1);
      if (visible.length > 0) setNavMenus(visible);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleClick = (menu: typeof FALLBACK_MENUS[0]) => {
    if (menu.type === "route") {
      if (menu.target === "/") {
        navigate("/");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate(menu.target);
      }
    } else {
      scrollToSection(menu.target);
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "bg-gradient-to-r from-primary/[0.06] via-background/50 to-primary/[0.04] backdrop-blur-2xl border-b border-primary/15 shadow-[0_4px_32px_rgba(59,130,246,0.08)]" : "bg-transparent"}`}>
      <div className="container mx-auto px-6">
        <div className={`flex items-center justify-between transition-all duration-500 ${isScrolled ? "py-3" : "py-5"}`}>
          <Link to="/" className="flex items-center">
            <Logo />
          </Link>

          <div className="hidden lg:flex items-center space-x-2">
            {navMenus.map((menu) => {
              const isActive = menu.type === "route"
                ? location.pathname === menu.target || (menu.target !== "/" && location.pathname.startsWith(menu.target))
                : false;
              return (
                <button
                  key={menu.id}
                  onClick={() => handleClick(menu)}
                  className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 cursor-pointer bg-transparent border-none ${
                    isActive
                      ? "text-primary bg-primary/15 shadow-[0_0_12px_rgba(59,130,246,0.15)] font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04]"
                  }`}
                >
                  {menu.label}
                </button>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center space-x-2">
            {/* Language Switch */}
            <div ref={langRef} className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 cursor-pointer bg-foreground/[0.03] hover:bg-foreground/[0.06] border border-border/50 hover:border-primary/20 rounded-xl backdrop-blur-sm group"
                title={t("common.lang.switch")}
              >
                <Globe size={14} className="text-primary/70" />
                <span>{supportedLangs.find(l => l.code === currentLang)?.native_name?.slice(0, 2) || currentLang}</span>
                <svg className="w-3 h-3 opacity-40 group-hover:opacity-70 transition-opacity" viewBox="0 0 10 6"><path d="M1 1l4 4 4-4" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>
              {isLangOpen && (
                <div className="absolute right-0 top-full mt-2 bg-background/90 backdrop-blur-2xl border border-border/40 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] py-2 min-w-[150px] z-50 overflow-hidden">
                  {supportedLangs.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { setLang(lang.code); setIsLangOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-all duration-200 cursor-pointer border-none flex items-center justify-between ${
                        currentLang === lang.code
                          ? "text-primary bg-primary/[0.06] font-semibold"
                          : "text-foreground/80 hover:bg-foreground/[0.04] hover:text-foreground"
                      }`}
                    >
                      <span>{lang.native_name}</span>
                      {currentLang === lang.code && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="relative w-9 h-9 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground transition-all duration-300 cursor-pointer bg-foreground/[0.03] hover:bg-foreground/[0.06] border border-border/50 hover:border-primary/20 backdrop-blur-sm"
              title={theme === "dark" ? t("common.theme.light") : t("common.theme.dark")}
            >
              <motion.span
                key={theme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              </motion.span>
            </button>

            {/* CTA Button */}
            <Button
              size="sm"
              className="gradient-primary hover:opacity-90 text-white shadow-[0_2px_12px_rgba(59,130,246,0.3)] hover:shadow-[0_4px_20px_rgba(59,130,246,0.4)] transition-shadow rounded-xl"
              onClick={() => window.open(telegramLink, "_blank")}
            >
              <Send size={13} className="mr-1.5" />
              联系 Telegram
            </Button>
          </div>

          <button
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-foreground/[0.04] backdrop-blur-sm border border-border/40 hover:border-primary/20 transition-all duration-300 cursor-pointer text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-gradient-to-b from-primary/[0.06] via-background/70 to-background/70 backdrop-blur-2xl border-b border-primary/10 shadow-[0_8px_32px_rgba(0,0,0,0.10)]"
          >
            <div className="container mx-auto px-6 py-4 space-y-4">
              {navMenus.map((menu) => (
                <button
                  key={menu.id}
                  onClick={() => { handleClick(menu); setIsMobileMenuOpen(false); }}
                  className="block text-foreground hover:text-primary transition-all duration-300 w-full text-left cursor-pointer bg-transparent border border-transparent hover:border-border/40 px-4 py-3 rounded-xl hover:bg-foreground/[0.04] font-medium"
                >
                  {menu.label}
                </button>
              ))}
              <div className="flex items-center gap-1 pt-3 border-t border-border/40">
                <button
                  onClick={() => { setIsLangOpen(!isLangOpen); }}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer bg-transparent border-none p-2 rounded-xl transition-all duration-300 hover:bg-foreground/5"
                >
                  <Globe size={16} /> <span>{currentLang === "zh-CN" ? "中文" : "English"}</span>
                </button>
                <button
                  onClick={toggleTheme}
                  className="text-muted-foreground hover:text-foreground cursor-pointer bg-transparent border-none p-2 rounded-xl transition-all duration-300 hover:bg-foreground/5"
                >
                  {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              </div>
              <Button
                className="w-full gradient-primary hover:opacity-90 text-white shadow-[0_2px_12px_rgba(59,130,246,0.3)] rounded-xl"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  window.open(telegramLink, "_blank");
                }}
              >
                <Send size={14} className="mr-1.5" />
                联系 Telegram
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
