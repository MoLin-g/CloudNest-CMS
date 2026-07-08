import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import { getContactInfo, getSiteSettings, type ContactInfoItem, type SiteSettings } from "@/lib/api";
import { getIcon } from "@/lib/icon-map";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [contacts, setContacts] = useState<ContactInfoItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({});
  const { t } = useTranslation();

  useEffect(() => {
    getContactInfo().then(setContacts).catch(() => {});
    getSiteSettings().then(setSettings).catch(() => {});
  }, []);

  return (
    <footer id="footer" className="relative bg-slate-50 dark:bg-slate-950/90 border-t border-border/30">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1.3fr] gap-10 lg:gap-8">
          {/* Brand column */}
          <div>
            <Logo className="mb-5" />
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-xs">
              {settings.footer_description || settings.site_description || "安全、稳定、高效的云虚拟环境解决方案"}
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-2.5">
              {contacts.slice(0, 4).map((item) => {
                const Icon = getIcon(item.icon);
                return (
                  <a
                    key={item.id}
                    href="#"
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-border/40 text-muted-foreground hover:text-primary hover:border-primary/25 hover:bg-primary/[0.04] transition-all duration-250 shadow-sm"
                    title={item.title}
                  >
                    <Icon size={15} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-5 tracking-wide">{t("nav.products")}</h4>
            <ul className="space-y-3">
              {["云手机", "沙箱环境", "应用分身"].map((name) => (
                <li key={name}>
                  <Link
                    to="/products"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2.5 h-px bg-primary/60 transition-all duration-300 rounded-full" />
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-5 tracking-wide">{t("nav.about")}</h4>
            <ul className="space-y-3">
              {[
                { to: "/about", label: t("nav.about") },
                { to: "/help", label: t("nav.help") },
                { to: "/contact", label: t("nav.contact") },
                { to: "/posts", label: "文章中心" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2.5 h-px bg-primary/60 transition-all duration-300 rounded-full" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-5 tracking-wide">{t("contact.info.title")}</h4>
            <ul className="space-y-3.5">
              {contacts.map((item) => {
                const Icon = getIcon(item.icon);
                return (
                  <li key={item.id} className="flex items-start gap-3 group">
                    <div className="w-9 h-9 flex items-center justify-center rounded-lg shrink-0 mt-0.5 bg-slate-100 dark:bg-slate-800 border border-border/30 group-hover:bg-primary/[0.06] group-hover:border-primary/20 transition-colors duration-200">
                      <Icon size={14} className="text-muted-foreground/70 group-hover:text-primary/80 transition-colors duration-200" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground/85">{item.title}</p>
                      {item.title !== item.content && item.content && (
                        <p className="text-xs text-muted-foreground/70 truncate">{item.content}</p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground/60">
            &copy; {currentYear}{" "}
            <span className="font-semibold text-primary/80">{settings.site_name || "CloudNest"}</span>
            . {t("footer.rights")}
          </p>
          <div className="flex items-center gap-6">
            <Link
              to={"/page/" + (settings.privacy_slug || "privacy-policy")}
              className="text-xs text-muted-foreground/60 hover:text-primary transition-colors duration-200"
            >
              {t("footer.privacy")}
            </Link>
            <Link
              to={"/page/" + (settings.terms_slug || "terms-of-service")}
              className="text-xs text-muted-foreground/60 hover:text-primary transition-colors duration-200"
            >
              {t("footer.terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
