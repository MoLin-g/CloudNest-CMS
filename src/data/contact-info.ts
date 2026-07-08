// contact-info.ts - 导出从 API 获取联系信息的方法
// 组件内使用 getContactInfoLive() 或直接调用 @/lib/api 中的 getContactInfo

import { getContactInfo, type ContactInfoItem } from "@/lib/api";

// 静态 fallback（页面加载前使用）
export const contactInfoFallback: { icon: string; title: string; content: string; gradient: string }[] = [
  { icon: "Send", title: "Telegram", content: "@MoLin_g", gradient: "from-blue-500 to-cyan-500" },
  { icon: "Mail", title: "电子邮箱", content: "support@cloudnest.com", gradient: "from-indigo-500 to-violet-500" },
  { icon: "Instagram", title: "Instagram", content: "@cloudnest_official", gradient: "from-pink-500 to-purple-500" },
  { icon: "MessageCircle", title: "WhatsApp", content: "+1 (555) 123-4567", gradient: "from-green-500 to-emerald-500" },
];

// 兼容旧代码：导出 contactInfo（静态 fallback 数组，用于初始化）
export const contactInfo = contactInfoFallback.map((item, idx) => ({
  id: idx + 1,
  ...item,
  sort_order: idx + 1,
}));

// 从 API 获取联系信息
export function fetchContactInfo(): Promise<ContactInfoItem[]> {
  return getContactInfo();
}

// telegram 链接获取函数
export async function getTelegramLink(): Promise<string> {
  try {
    const items = await getContactInfo();
    const tg = items.find((i) => i.icon === "Send" || i.title.toLowerCase() === "telegram");
    if (tg) return `https://t.me/${tg.content.replace("@", "").trim()}`;
  } catch {}
  return "https://t.me/CloudNestSupport";
}
