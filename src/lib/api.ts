const BASE = "/api";

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}

export type HeroData = {
  badge: string;
  badge_subtitle: string;
  main_title: string;
  subtitle1: string;
  subtitle2: string;
  description: string;
  stats: { value: string; label: string }[];
  primary_btn_text?: string;
  primary_btn_link?: string;
  secondary_btn_text?: string;
  secondary_btn_link?: string;
  cta_subtitle?: string;
};

export type SiteSettings = Record<string, string>;

export type ContactInfoItem = {
  id: number;
  icon: string;
  title: string;
  content: string;
  gradient: string;
  sort_order: number;
};

export type ProductData = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  gradient: string;
  highlights: { text: string }[];
  features: { title: string; desc: string }[];
  specs: { label: string; value: string }[];
  icon: string;
  sort_order: number;
  category_id?: number | null;
  sections?: { name: string; items: { key: string; value: string }[] }[];
};

export type UseCaseData = {
  id: number;
  icon: string;
  title: string;
  description: string;
  gradient: string;
  tags: string;
  icon_bg: string;
  sort_order: number;
};

export type FeatureData = {
  id: number;
  icon: string;
  title: string;
  description: string;
  icon_gradient: string;
  sort_order: number;
};

export type CTAData = {
  title: string;
  subtitle: string;
  button_text: string;
  secondary_button_text: string;
};

export type FaqCategoryData = {
  id: number;
  title: string;
  gradient: string;
  icon: string;
  sort_order: number;
  questions: {
    id: number;
    category_id: number;
    question: string;
    answer: string;
    sort_order: number;
  }[];
};

export type AboutData = {
  id: number;
  page_title: string;
  page_subtitle: string;
  heading: string;
  intro_paragraph_1: string;
  intro_paragraph_2: string;
  values: { icon: string; title: string; description: string }[];
};

export type NavMenuItem = {
  id: number;
  label: string;
  type: "route" | "scroll";
  target: string;
  sort_order: number;
  is_visible: number;
};

// ---- Public read APIs (no auth needed) ----

export function getHero(): Promise<HeroData> {
  return fetchJSON<HeroData>(`${BASE}/hero`);
}

export function getAllHeroes(): Promise<HeroData[]> {
  return fetchJSON<HeroData[]>(`${BASE}/hero?format=array`);
}

export function getSiteSettings(): Promise<SiteSettings> {
  return fetchJSON<SiteSettings>(`${BASE}/site-settings`);
}

export function getContactInfo(): Promise<ContactInfoItem[]> {
  return fetchJSON<ContactInfoItem[]>(`${BASE}/contact-info`);
}

export function getProductCategories(): Promise<{id:number;name:string;slug:string}[]> {
  return fetchJSON<{id:number;name:string;slug:string}[]>(`${BASE}/categories?type=product`);
}

export function getProducts(): Promise<ProductData[]> {
  return fetchJSON<ProductData[]>(`${BASE}/products`);
}

export function getUseCases(): Promise<UseCaseData[]> {
  return fetchJSON<UseCaseData[]>(`${BASE}/usecases`);
}

export function getFeatures(): Promise<FeatureData[]> {
  return fetchJSON<FeatureData[]>(`${BASE}/features`);
}

export function getCTA(): Promise<CTAData> {
  return fetchJSON<CTAData>(`${BASE}/cta`);
}

export function getFAQ(): Promise<FaqCategoryData[]> {
  return fetchJSON<FaqCategoryData[]>(`${BASE}/faq`);
}

export function getAbout(): Promise<AboutData | null> {
  return fetchJSON<AboutData | null>(`${BASE}/about`);
}

export function getNavMenus(): Promise<NavMenuItem[]> {
  return fetchJSON<NavMenuItem[]>(`${BASE}/nav-menus`);
}

// ---- New API types and functions for ShopAgg features ----

export type ThemeData = {
  id: number;
  name: string;
  tokens: Record<string, string>;
  is_default: number;
  created_at: string;
};

export type LanguageData = {
  code: string;
  name: string;
  native_name: string;
  is_default: number;
  is_visible: number;
  sort_order: number;
};

export type TranslationItem = {
  id: number;
  lang_code: string;
  key: string;
  value: string;
};

export type MediaItem = {
  id: number;
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  folder: string;
  created_at: string;
};

export type InquiryData = {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  product_id: string;
  status: "pending" | "replied" | "closed";
  notes: string;
  created_at: string;
  updated_at: string;
};

export type CategoryData = {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
  type: "product" | "post";
  description: string;
  sort_order: number;
  is_visible: number;
};

export type SliderData = {
  id: number;
  name: string;
  slug: string;
  description: string;
  status: string;
  sort_order: number;
};

export type SliderItemData = {
  id: number;
  slider_id: number;
  image: string;
  title: string;
  subtitle: string;
  link_url: string;
  link_text: string;
  sort_order: number;
  status: string;
};

export type PostData = {
  id: number;
  title: string;
  slug: string;
  cover: string;
  summary: string;
  content: string;
  type: "post" | "case";
  category_id: number;
  status: string;
  is_featured: number;
  created_at: string;
  updated_at: string;
};

export type CustomPageData = {
  id: number;
  title: string;
  slug: string;
  content: string;
  meta_title: string;
  meta_description: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export function getThemes(): Promise<ThemeData[]> {
  return fetchJSON<ThemeData[]>(`${BASE}/themes`);
}

export function getLanguages(): Promise<LanguageData[]> {
  return fetchJSON<LanguageData[]>(`${BASE}/languages`);
}

export function getTranslations(lang?: string): Promise<Record<string, string>> {
  const url = lang ? `${BASE}/translations?lang=${lang}` : `${BASE}/translations`;
  return fetchJSON<Record<string, string>>(url);
}

export function getMedia(): Promise<MediaItem[]> {
  return fetchJSON<MediaItem[]>(`${BASE}/media`);
}

export function getInquiries(): Promise<InquiryData[]> {
  return fetchJSON<InquiryData[]>(`${BASE}/inquiries`);
}

export function getCategories(type?: string): Promise<CategoryData[]> {
  const url = type ? `${BASE}/categories?type=${type}` : `${BASE}/categories`;
  return fetchJSON<CategoryData[]>(url);
}

export function getSliders(): Promise<SliderData[]> {
  return fetchJSON<SliderData[]>(`${BASE}/sliders`);
}

export function getSliderItems(slug: string): Promise<SliderItemData[]> {
  return fetchJSON<SliderItemData[]>(`${BASE}/sliders/${slug}/items`);
}

export function getPosts(type?: string): Promise<PostData[]> {
  const url = type ? `${BASE}/posts?type=${type}` : `${BASE}/posts`;
  return fetchJSON<PostData[]>(url);
}

export function getPostBySlug(slug: string): Promise<PostData> {
  return fetchJSON<PostData>(`${BASE}/posts/${slug}`);
}

export function getPages(): Promise<CustomPageData[]> {
  return fetchJSON<CustomPageData[]>(`${BASE}/pages`);
}

export function getPageBySlug(slug: string): Promise<CustomPageData> {
  return fetchJSON<CustomPageData>(`${BASE}/pages/${slug}`);
}
