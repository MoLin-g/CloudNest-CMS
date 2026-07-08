import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

export const SUPPORTED_LANGS = [
  { code: "zh-CN", name: "简体中文", nativeName: "简体中文" },
  { code: "en-US", name: "English", nativeName: "English" },
] as const;

export type LangCode = (typeof SUPPORTED_LANGS)[number]["code"];

// Inline translations (bundle for zero-network startup; can be overridden by backend)
const resources = {
  "zh-CN": {
    translation: {
      // Navbar
      "nav.home": "首页",
      "nav.products": "产品",
      "nav.solutions": "解决方案",
      "nav.about": "关于我们",
      "nav.contact": "联系我们",
      "nav.help": "帮助中心",
      "nav.admin": "管理后台",

      // Hero
      "hero.badge": "新一代企业云手机解决方案",
      "hero.title.part1": "安全、高效、智能的",
      "hero.title.highlight": "企业云手机平台",
      "hero.subtitle": "为企业提供云端移动办公、应用批量管理、数据安全隔离的一站式解决方案，助力企业数字化转型",
      "hero.cta.primary": "免费试用",
      "hero.cta.secondary": "了解更多",

      // Features
      "features.title": "平台核心优势",
      "features.subtitle": "六大核心能力，全方位赋能企业移动化办公",
      "features.learnMore": "了解更多",

      // UseCases
      "usecases.title": "应用场景",
      "usecases.subtitle": "覆盖多个行业，满足不同业务需求",

      // CTA
      "cta.title.default": "准备好开始了吗？",
      "cta.subtitle.default": "立即体验企业级云手机解决方案",
      "cta.button.default": "联系我们",

      // Products
      "products.title": "我们的产品",
      "products.subtitle": "三大核心产品，满足不同规模企业的云手机需求",
      "products.specs": "技术规格",
      "products.highlights": "产品亮点",
      "products.pricing": "价格方案",
      "products.cta": "立即咨询",
      "products.cta.subtitle": "选择最适合您企业的云手机方案",

      // Pricing
      "pricing.monthly": "/月",
      "pricing.startTrial": "立即试用",
      "pricing.contact": "联系我们",
      "pricing.popular": "推荐",

      // About
      "about.title": "关于我们",
      "about.subtitle": "致力于为企业提供最优质的云手机服务",

      // Contact
      "contact.title": "联系我们",
      "contact.subtitle": "有任何问题，欢迎随时与我们联系",
      "contact.form.name": "姓名",
      "contact.form.email": "邮箱",
      "contact.form.phone": "电话",
      "contact.form.company": "公司",
      "contact.form.message": "留言内容",
      "contact.form.submit": "提交留言",
      "contact.form.namePlaceholder": "请输入您的姓名",
      "contact.form.emailPlaceholder": "请输入您的邮箱",
      "contact.form.phonePlaceholder": "请输入您的电话",
      "contact.form.companyPlaceholder": "请输入您的公司名称",
      "contact.form.messagePlaceholder": "请输入您想咨询的内容",
      "contact.info.title": "联系方式",
      "contact.info.address": "地址",
      "contact.info.phone": "电话",
      "contact.info.email": "邮箱",
      "contact.info.wechat": "微信",

      // Help/FAQ
      "help.title": "帮助中心",
      "help.subtitle": "常见问题与解答",

      // Footer
      "footer.rights": "版权所有",
      "footer.privacy": "隐私政策",
      "footer.terms": "服务条款",

      // Solutions
      "solutions.title": "解决方案",
      "solutions.subtitle": "为企业提供全方位的云手机解决方案",

      // Admin
      "admin.dashboard": "仪表盘",
      "admin.products": "产品管理",
      "admin.features": "功能特性",
      "admin.usecases": "应用场景",
      "admin.pricing": "价格方案",
      "admin.faq": "常见问题",
      "admin.hero": "首页内容",
      "admin.about": "关于我们",
      "admin.contact": "联系方式",
      "admin.nav": "导航菜单",
      "admin.settings": "站点设置",
      "admin.themes": "主题管理",
      "admin.languages": "语言管理",
      "admin.media": "媒体库",
      "admin.users": "用户管理",
      "admin.inquiries": "询单管理",
      "admin.categories": "分类管理",
      "admin.sliders": "轮播图",
      "admin.posts": "文章管理",
      "admin.cases": "案例管理",
      "admin.pages": "自定义页面",
      "admin.seo": "SEO设置",

      // General
      "common.save": "保存",
      "common.cancel": "取消",
      "common.delete": "删除",
      "common.edit": "编辑",
      "common.add": "添加",
      "common.search": "搜索",
      "common.loading": "加载中...",
      "common.noData": "暂无数据",
      "common.confirm": "确认",
      "common.back": "返回",
      "common.theme.light": "亮色模式",
      "common.theme.dark": "暗色模式",
      "common.lang.switch": "切换语言",
    },
  },
  "en-US": {
    translation: {
      "nav.home": "Home",
      "nav.products": "Products",
      "nav.solutions": "Solutions",
      "nav.about": "About Us",
      "nav.contact": "Contact",
      "nav.help": "Help Center",
      "nav.admin": "Admin Panel",

      "hero.badge": "Next-Gen Enterprise Cloud Phone Solution",
      "hero.title.part1": "Secure, Efficient & Intelligent",
      "hero.title.highlight": "Enterprise Cloud Phone Platform",
      "hero.subtitle":
        "One-stop solution for enterprise mobile office, bulk app management, and data security isolation, empowering digital transformation",
      "hero.cta.primary": "Free Trial",
      "hero.cta.secondary": "Learn More",

      "features.title": "Core Advantages",
      "features.subtitle": "Six core capabilities empowering enterprise mobile operations",
      "features.learnMore": "Learn More",

      "usecases.title": "Use Cases",
      "usecases.subtitle": "Covering multiple industries for diverse business needs",

      "cta.title.default": "Ready to Get Started?",
      "cta.subtitle.default": "Experience enterprise cloud phone solutions now",
      "cta.button.default": "Contact Us",

      "products.title": "Our Products",
      "products.subtitle": "Three core products for enterprises of all sizes",
      "products.specs": "Specifications",
      "products.highlights": "Highlights",
      "products.pricing": "Pricing Plans",
      "products.cta": "Inquire Now",
      "products.cta.subtitle": "Choose the best cloud phone plan for your enterprise",

      "pricing.monthly": "/month",
      "pricing.startTrial": "Start Trial",
      "pricing.contact": "Contact Us",
      "pricing.popular": "Popular",

      "about.title": "About Us",
      "about.subtitle": "Committed to providing the best cloud phone services",

      "contact.title": "Contact Us",
      "contact.subtitle": "Feel free to reach out with any questions",
      "contact.form.name": "Name",
      "contact.form.email": "Email",
      "contact.form.phone": "Phone",
      "contact.form.company": "Company",
      "contact.form.message": "Message",
      "contact.form.submit": "Submit",
      "contact.form.namePlaceholder": "Enter your name",
      "contact.form.emailPlaceholder": "Enter your email",
      "contact.form.phonePlaceholder": "Enter your phone",
      "contact.form.companyPlaceholder": "Enter your company",
      "contact.form.messagePlaceholder": "Enter your message",
      "contact.info.title": "Contact Info",
      "contact.info.address": "Address",
      "contact.info.phone": "Phone",
      "contact.info.email": "Email",
      "contact.info.wechat": "WeChat",

      "help.title": "Help Center",
      "help.subtitle": "Frequently Asked Questions",

      "footer.rights": "All Rights Reserved",
      "footer.privacy": "Privacy Policy",
      "footer.terms": "Terms of Service",

      "solutions.title": "Solutions",
      "solutions.subtitle": "Comprehensive cloud phone solutions for enterprises",

      "admin.dashboard": "Dashboard",
      "admin.products": "Products",
      "admin.features": "Features",
      "admin.usecases": "Use Cases",
      "admin.pricing": "Pricing Plans",
      "admin.faq": "FAQ",
      "admin.hero": "Hero Content",
      "admin.about": "About Us",
      "admin.contact": "Contact Info",
      "admin.nav": "Navigation",
      "admin.settings": "Site Settings",
      "admin.themes": "Theme Manager",
      "admin.languages": "Language Manager",
      "admin.media": "Media Library",
      "admin.users": "User Management",
      "admin.inquiries": "Inquiries",
      "admin.categories": "Categories",
      "admin.sliders": "Sliders",
      "admin.posts": "Posts",
      "admin.cases": "Cases",
      "admin.pages": "Custom Pages",
      "admin.seo": "SEO Settings",

      "common.save": "Save",
      "common.cancel": "Cancel",
      "common.delete": "Delete",
      "common.edit": "Edit",
      "common.add": "Add",
      "common.search": "Search",
      "common.loading": "Loading...",
      "common.noData": "No Data",
      "common.confirm": "Confirm",
      "common.back": "Back",
      "common.theme.light": "Light Mode",
      "common.theme.dark": "Dark Mode",
      "common.lang.switch": "Switch Language",
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "zh-CN",
    lng: "zh-CN",
    interpolation: { escapeValue: false },
    react: {
      useSuspense: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "cloudnest-lang",
    },
  });

export default i18n;
