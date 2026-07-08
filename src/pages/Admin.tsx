import { useState, useEffect, useCallback } from "react";
import {
  LayoutDashboard, Settings, CircleHelp, Layout, Star, Zap, MessageSquare, Megaphone,
  Phone, LogOut, TriangleAlert, CircleCheck, Loader, Package, ChevronDown,
  Globe, Smartphone, Shield, Layers, FileText, Plus, Trash2, Eye, EyeOff,
  GripVertical, Grid3x3, X, MapPin, ChevronRight, Tag, Sparkles, ListChecks,
  Image, FolderOpen, Users, Mail, ListTree, SlidersHorizontal, PenLine,
  BookOpen, Palette, Languages, Search, Upload, Download, RotateCw, Lock
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "../components/ui/dialog";

const API = "/api";
const TOKEN_KEY = "admin_token";
const CURRENT_USER_KEY = "admin_user";

// ==================== API Helper ====================
async function api(path: string, options: any = {}) {
  const token = localStorage.getItem(TOKEN_KEY);
  try {
    const { headers: customHeaders, ...restOptions } = options;
    const res = await fetch(`${API}${path}`, {
      ...restOptions,
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: token } : {}), ...customHeaders },
    });
    if (res.status === 401) { localStorage.removeItem(TOKEN_KEY); window.location.reload(); return; }
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
    return data;
  } catch (err: any) {
    if (err.message === "Failed to fetch") throw new Error("无法连接服务器，请检查网络");
    throw err;
  }

}
// ==================== Icon Picker ====================
const ALL_ICONS = [
  "Smartphone","Shield","Layers","Zap","Globe","CloudDownload","Headphones",
  "Music2","Gamepad2","ShoppingBag","Megaphone","TestTube","Ship","Globe","RefreshCw",
  "Lock","SmartphoneNfc","Send","Mail","Instagram","MessageCircle","Phone","MapPin",
  "Users","CircleCheck","Cloud","ArrowRight","BookOpen","CircleHelp","CircleAlert",
  "Brain","Star","Trophy","Rocket","Heart","ThumbsUp","Eye","Camera","Video","Package",
  "Target","Copy","Menu",
];

// ==================== Save Button ====================
function SaveButton({ onClick, label = "保存", loadingLabel = "保存中..." }: {
  onClick: () => Promise<void>; label?: string; loadingLabel?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const handleClick = async () => {
    setLoading(true); setError("");
    try { await onClick(); setSaved(true); setTimeout(() => setSaved(false), 2500); }
    catch (err: any) { setError(err.message || "保存失败"); }
    finally { setLoading(false); }
  };
  return (
    <div>
      <button onClick={handleClick} disabled={loading}
        className={`px-8 py-2.5 rounded-xl font-semibold text-sm transition cursor-pointer border-none shadow-sm ${
          saved ? "bg-emerald-500 text-white" : "bg-gradient-to-r from-indigo-500 to-violet-500 text-white hover:from-indigo-600 hover:to-violet-600"
        } disabled:opacity-60 disabled:cursor-not-allowed`}>
        {loading ? <span className="flex items-center gap-2 justify-center"><Loader size={15} className="animate-spin"/>{loadingLabel}</span>
        : saved ? <span className="flex items-center gap-2 justify-center"><CircleCheck size={15}/>已保存</span>
        : label}
      </button>
      {error && <p className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg flex items-center gap-1.5"><TriangleAlert size={14}/>{error}</p>}
    </div>
  );
}
 

// ==================== Inline Save Btn ====================
function InlineSaveBtn({ onClick, label, size = "md" }: {
  onClick: () => Promise<void>; label: string; size?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const handle = async () => {
    setLoading(true); setError("");
    try { await onClick(); setSaved(true); setTimeout(()=>setSaved(false),2500); }
    catch(err: any) { setError(err.message||"失败"); }
    finally { setLoading(false); }
  };
  const cls = size==="sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm";
  return (
    <div>
      <button onClick={handle} disabled={loading}
        className={`${cls} rounded-lg font-semibold cursor-pointer border-none transition ${
          saved ? "bg-emerald-500 text-white" : "bg-indigo-100 hover:bg-indigo-200 text-indigo-700"
        } disabled:opacity-50 disabled:cursor-not-allowed`}>
        {loading ? "..." : saved ? "✓" : label}
      </button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
 
  );
}

// ==================== Loading / Error ====================
function LoadingBox() {
  return <div className="flex items-center justify-center py-20"><Loader size={24} className="animate-spin text-indigo-400"/><span className="ml-3 text-gray-400">加载中...</span></div>;
}
function ErrorBox({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-md">
        <TriangleAlert size={40} className="text-red-400 mx-auto mb-4"/>
        <p className="text-red-700 font-semibold text-lg mb-1">加载失败</p>
        <p className="text-red-500 text-sm mb-4">{message}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition cursor-pointer border-none">重试</button>
      </div>
    </div>
 
  );
}

// ==================== Page Header ====================
function PageHeader({ icon: Icon, title, description, gradient = "from-indigo-500 to-violet-500" }: {
  icon: any; title: string; description?: string; gradient?: string;
}) {
  return (
    <div className={`bg-gradient-to-r ${gradient} rounded-2xl p-6 mb-8 text-white shadow-lg`} style={{ boxShadow: "0 10px 40px rgba(102,126,234,0.3)" }}>
      <div className="flex items-center gap-3 mb-1">
        {Icon && <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><Icon size={22}/></div>}
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      {description && <p className="text-white/80 text-sm mt-2 ml-[52px]">{description}</p>}
    </div>
 

  );
}
// ==================== Section Title ====================
function SectionTitle({ icon: Icon, title, iconColor = "primary" }: {
  icon: any; title: string; iconColor?: string;
}) {
  const colors: Record<string, string> = {
    primary: "bg-indigo-100 text-indigo-600",
    info: "bg-cyan-100 text-cyan-600",
    success: "bg-emerald-100 text-emerald-600",
    warning: "bg-amber-100 text-amber-600",
    danger: "bg-red-100 text-red-600",
  };
  return (
    <div className="flex items-center gap-3 mb-5">
      {Icon && <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${colors[iconColor] || colors.primary}`}><Icon size={18}/></div>}
      <h2 className="text-lg font-bold text-slate-800">{title}</h2>
    </div>
 

  );
}
// ==================== Field ====================
function Field({ label, value, onChange, type = "text", rows = 3, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; rows?: number; placeholder?: string;
}) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      {type === "textarea" ? (
        <textarea value={value || ""} onChange={e => onChange(e.target.value)} rows={rows} placeholder={placeholder}
          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none resize-vertical bg-white"/>
      ) : (
        <input type="text" value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none bg-white"/>
      )}
    </div>
 

  );
}
// ==================== Visibility Toggle ====================
function VisibilityToggle({ visible, onChange }: { visible: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!visible)}
      className={`p-2 rounded-lg transition cursor-pointer border-none flex items-center gap-1.5 text-xs font-semibold ${
        visible ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" : "bg-slate-100 text-slate-400 hover:bg-slate-200"
      }`}
      title={visible ? "显示中" : "已隐藏"}>
      {visible ? <Eye size={15}/> : <EyeOff size={15}/>}
      {visible ? "显示" : "隐藏"}
    </button>
 

  );
}
function IconSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <select value={value || "Star"} onChange={e => onChange(e.target.value)}
      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none bg-white">
      {ALL_ICONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
    </select>
 
  );
}

const GRADIENT_PRESETS = [
  { label: "紫粉", value: "from-violet-500 to-fuchsia-500", from: "#8b5cf6", to: "#d946ef" },
  { label: "蓝青", value: "from-blue-500 to-cyan-400", from: "#3b82f6", to: "#22d3ee" },
  { label: "粉玫", value: "from-pink-500 to-rose-500", from: "#ec4899", to: "#f43f5e" },
  { label: "橙琥珀", value: "from-orange-500 to-amber-400", from: "#f97316", to: "#fbbf24" },
  { label: "青绿", value: "from-teal-400 to-emerald-500", from: "#2dd4bf", to: "#10b981" },
  { label: "靛紫", value: "from-indigo-500 to-purple-500", from: "#6366f1", to: "#a855f7" },
  { label: "黄橙", value: "from-yellow-400 to-orange-500", from: "#facc15", to: "#f97316" },
  { label: "天靛", value: "from-sky-400 to-indigo-500", from: "#38bdf8", to: "#6366f1" },
  { label: "翡翠青", value: "from-emerald-400 to-teal-500", from: "#34d399", to: "#14b8a6" },
  { label: "玫红", value: "from-pink-400 to-rose-500", from: "#f472b6", to: "#fb7185" },
  { label: "红橙", value: "from-red-500 to-orange-500", from: "#ef4444", to: "#f97316" },
  { label: "蓝紫", value: "from-blue-600 to-violet-500", from: "#2563eb", to: "#8b5cf6" },
];

function GradientPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <div className="grid grid-cols-6 gap-2 mb-2">
        {GRADIENT_PRESETS.map(p => (
          <button
            key={p.value}
            onClick={() => onChange(p.value)}
            title={p.label}
            className={`w-full h-9 rounded-lg bg-gradient-to-r ${p.value} transition-all duration-150 ${
              value === p.value ? 'ring-2 ring-offset-2 ring-indigo-500 scale-105 shadow-md' : 'hover:scale-105 hover:shadow-sm opacity-80 hover:opacity-100'
            }`}
          />
        ))}
      </div>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="或输入自定义 Tailwind 渐变类，如 from-red-500 to-blue-600"
        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-600 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none bg-slate-50"
      />
    </div>
 

  );
}
// ==================== Card Wrapper ====================
function CardWrapper({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white border border-slate-200 rounded-2xl p-6 mb-5 shadow-sm ${className}`}>
      {children}
    </div>
 

  );
}
// ==================== Frontend Location Info ====================
function LocationInfo({ page, section, description, color = "indigo" }: {
  page: string; section: string; description?: string; color?: string;
}) {
  const colors: Record<string, string> = {
    indigo: "bg-indigo-50 border-indigo-200 text-indigo-800",
    blue: "bg-blue-50 border-blue-200 text-blue-800",
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-800",
    amber: "bg-amber-50 border-amber-200 text-amber-800",
    violet: "bg-violet-50 border-violet-200 text-violet-800",
    cyan: "bg-cyan-50 border-cyan-200 text-cyan-800",
    rose: "bg-rose-50 border-rose-200 text-rose-800",
    sky: "bg-sky-50 border-sky-200 text-sky-800",
    teal: "bg-teal-50 border-teal-200 text-teal-800",
    slate: "bg-slate-50 border-slate-200 text-slate-700",
  };
  return (
    <div className={`${colors[color] || colors.indigo} border rounded-xl p-4 mb-6 flex items-start gap-3`}>
      <MapPin size={18} className="shrink-0 mt-0.5 opacity-70"/>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-sm">{page}</span>
          <ChevronRight size={14} className="opacity-50"/>
          <span className="text-sm font-medium">{section}</span>
        </div>
        {description && <p className="text-xs opacity-75">{description}</p>}
      </div>
    </div>
 

  );
}
// ==================== Stat Card ====================
function StatCard({ icon: Icon, label, value, color = "primary", bgGradient }: {
  icon: any; label: string; value: number; color?: string; bgGradient?: string;
}) {
  const colors: Record<string, string> = {
    primary: "border-t-indigo-500", info: "border-t-cyan-500", success: "border-t-emerald-500",
    warning: "border-t-amber-500", danger: "border-t-red-500", link: "border-t-sky-500",
    dark: "border-t-slate-500", purple: "border-t-violet-500",
  };
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div className={`h-1 ${colors[color] || colors.primary}`}/>
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
            <p className="text-3xl font-bold text-slate-800">{value}</p>
          </div>
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${bgGradient || "from-indigo-500 to-violet-500"} flex items-center justify-center shadow-md`}>
            <Icon size={24} className="text-white"/>
          </div>
        </div>
      </div>
    </div>
 

  );
}
// ==================== Quick Action ====================
function QuickAction({ icon: Icon, label, description, onClick, color = "indigo" }: {
  icon: any; label: string; description: string; onClick: () => void; color?: string;
}) {
  const colors: Record<string, string> = {
    indigo: "hover:bg-indigo-50 hover:border-indigo-200",
    cyan: "hover:bg-cyan-50 hover:border-cyan-200",
    emerald: "hover:bg-emerald-50 hover:border-emerald-200",
    amber: "hover:bg-amber-50 hover:border-amber-200",
    violet: "hover:bg-violet-50 hover:border-violet-200",
  };
  return (
    <button onClick={onClick}
      className={`w-full text-left p-4 bg-white border border-slate-200 rounded-xl transition cursor-pointer ${colors[color] || colors.indigo}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center"><Icon size={18} className="text-slate-600"/></div>
        <div>
          <p className="font-semibold text-slate-800 text-sm">{label}</p>
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        </div>
      </div>
    </button>
 

  );
}
// ==================== Login Screen ====================
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      }).then(r => r.json());
      if (res.success) {
        localStorage.setItem(TOKEN_KEY, res.token);
        // Store user info from login response directly (role, permissions, display_name)
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(res.user || {}));
        onLogin();
      }
      else setError(res.message || "登录失败");
    } catch { setError("无法连接服务器，请确认后台已启动"); }
    finally { setLoading(false); }
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Settings size={32} className="text-white"/>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">CloudNest 管理后台</h1>
          <p className="text-sm text-slate-500">请登录以管理网站内容</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">用户名</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none text-slate-900 bg-white" required/>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">密码</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none text-slate-900 bg-white" required/>
          </div>
          {error && <p className="text-red-600 text-sm font-medium bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 cursor-pointer border-none shadow-lg shadow-indigo-500/25">
            {loading ? "登录中..." : "登 录"}
          </button>
        </form>
        <p className="text-center text-slate-400 text-xs mt-5">默认账号：admin / admin123</p>
      </div>
    </div>
 

  );
}
// ==================== DASHBOARD ====================
function DashboardTab({ onNavigate, permissions }: { onNavigate: (g: string, t?: string) => void; permissions?: string[] }) {
  const [stats, setStats] = useState<any>({});
  const perms = permissions || [];
  const can = (id: string) => perms.includes("all") || permissions === undefined || permissions.length === 0 ? true : perms.includes(id);
  useEffect(() => { api("/stats").then(setStats).catch(()=>{}); }, []);
  return (<div>
    <PageHeader icon={LayoutDashboard} title="管理仪表盘" description="欢迎使用 CloudNest 管理后台，下面是整体数据概览和常用操作入口。"/>
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {can("products")     && <StatCard icon={Package} label="产品" value={stats.products || 0} color="link" bgGradient="from-sky-500 to-indigo-500"/>}
      {can("products")     && <StatCard icon={Sparkles} label="产品亮点" value={stats.product_features || 0} color="purple" bgGradient="from-violet-500 to-purple-500"/>}
      {can("pricing")      && <StatCard icon={Tag} label="价格套餐" value={stats.pricing_plans || 0} color="warning" bgGradient="from-amber-500 to-orange-500"/>}
      {can("hero")         && <StatCard icon={Layout} label="Hero" value={stats.hero_content || 0} color="dark" bgGradient="from-slate-500 to-slate-700"/>}
      {can("posts")        && <StatCard icon={BookOpen} label="文章" value={stats.posts || 0} color="violet" bgGradient="from-violet-500 to-purple-500"/>}
    </div>
    <SectionTitle icon={Zap} title="快捷操作" iconColor="warning"/>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
      {can("settings")     && <QuickAction icon={Settings} label="全局配置" description="网站名称/SEO/社交链接" onClick={()=>onNavigate("settings","settings")} color="indigo"/>}
      {can("hero")         && <QuickAction icon={Layout} label="首页 Hero" description="首屏轮播/标题/CTA" onClick={()=>onNavigate("content","hero")} color="violet"/>}
      {can("sliders")      && <QuickAction icon={Image} label="轮播图" description="管理首页幻灯片" onClick={()=>onNavigate("content","sliders")} color="rose"/>}
      {can("products")     && <QuickAction icon={Package} label="产品管理" description="产品信息/详情/亮点" onClick={()=>onNavigate("products","products")} color="sky"/>}
      {can("pricing")      && <QuickAction icon={Tag} label="价格方案" description="各产品套餐定价" onClick={()=>onNavigate("products","pricing")} color="amber"/>}
      {can("usecases")     && <QuickAction icon={Zap} label="应用场景" description="使用场景卡片展示" onClick={()=>onNavigate("content","usecases")} color="amber"/>}
      {can("features")     && <QuickAction icon={Star} label="平台优势" description="为什么选择我们" onClick={()=>onNavigate("content","features")} color="emerald"/>}
      {can("cta")          && <QuickAction icon={Megaphone} label="CTA 号召" description="首页底部行动号召" onClick={()=>onNavigate("content","cta")} color="red"/>}
      {can("contact")      && <QuickAction icon={Phone} label="联系渠道" description="联系页面卡片管理" onClick={()=>onNavigate("settings","contact")} color="cyan"/>}
      {can("inquiries")    && <QuickAction icon={MessageSquare} label="询单留言" description="查看用户提交留言" onClick={()=>onNavigate("settings","inquiries")} color="green"/>}
      {can("posts")        && <QuickAction icon={BookOpen} label="文章/案例" description="博客和客户案例" onClick={()=>onNavigate("cms","posts")} color="violet"/>}
      {can("pages")        && <QuickAction icon={FileText} label="自定义页面" description="独立页面管理" onClick={()=>onNavigate("cms","pages")} color="orange"/>}
      {can("faq")          && <QuickAction icon={CircleHelp} label="帮助中心" description="FAQ 分类与问题" onClick={()=>onNavigate("settings","faq")} color="indigo"/>}
      {can("navmenus")     && <QuickAction icon={ListTree} label="导航菜单" description="导航栏增删改排序" onClick={()=>onNavigate("settings","navmenus")} color="violet"/>}
      {can("about")        && <QuickAction icon={Globe} label="关于我们" description="公司介绍/价值观" onClick={()=>onNavigate("content","about")} color="emerald"/>}
      {can("themes")       && <QuickAction icon={Palette} label="主题管理" description="颜色/样式主题" onClick={()=>onNavigate("settings","themes")} color="pink"/>}
    </div>
  </div>);
}


// 站点配置项 -> 前端显示位置映射表
const SITE_SETTING_MAP: Record<string, { label: string; location: string; components: { name: string; color: string }[] }> = {
  site_name: { label: '网站名称', location: '导航栏 Logo + 页脚版权', components: [{ name: '导航栏 Logo', color: 'bg-violet-100 text-violet-700' },{ name: '页脚版权', color: 'bg-sky-100 text-sky-700' }] },
  site_title: { label: '页面标题', location: '浏览器标签页 title + SEO', components: [{ name: '浏览器标签', color: 'bg-amber-100 text-amber-700' }] },
  site_description: { label: 'SEO 描述', location: '搜索引擎 meta 标签', components: [{ name: 'SEO 描述', color: 'bg-amber-100 text-amber-700' }] },
  footer_description: { label: '页脚简介', location: '页面底部 Footer', components: [{ name: '页脚简介', color: 'bg-sky-100 text-sky-700' }] },
  telegram_link: { label: 'TG 全局链接', location: '所有 TG 按钮默认链接', components: [{ name: '全局', color: 'bg-slate-100 text-slate-700' }] },
  telegram_nav_link: { label: '导航栏 TG 链接', location: '顶部导航栏右侧', components: [{ name: '导航栏按钮', color: 'bg-violet-100 text-violet-700' }] },
  telegram_hero_link: { label: 'Hero TG 链接', location: '首页首屏 Hero', components: [{ name: 'Hero CTA', color: 'bg-blue-100 text-blue-700' }] },
  telegram_cta_link: { label: 'CTA TG 链接', location: '首页底部 CTA', components: [{ name: 'CTA 区域', color: 'bg-indigo-100 text-indigo-700' }] },
  telegram_help_link: { label: '帮助中心 TG 链接', location: '帮助中心页面', components: [{ name: '帮助中心', color: 'bg-emerald-100 text-emerald-700' }] },
  telegram_products_link: { label: '产品页 TG 链接', location: '产品详情页底部', components: [{ name: '产品页 CTA', color: 'bg-cyan-100 text-cyan-700' }] },
  telegram_username: { label: 'TG 用户名', location: '预留', components: [{ name: '预留', color: 'bg-slate-100 text-slate-400' }] },
  whatsapp: { label: 'WhatsApp', location: '预留', components: [{ name: '预留', color: 'bg-slate-100 text-slate-400' }] },
  products_heading: { label: '产品大标题', location: '首页「核心产品」区域 + /products 页面顶部', components: [{ name: '首页 Solutions', color: 'bg-violet-100 text-violet-700' }, { name: '产品页 H1', color: 'bg-sky-100 text-sky-700' }] },
  products_subtitle: { label: '产品副标题', location: '首页「核心产品」区域 + /products 副标题', components: [{ name: '首页 Solutions', color: 'bg-violet-100 text-violet-700' }, { name: '产品页副标题', color: 'bg-sky-100 text-sky-700' }] },
  privacy_slug: { label: '隐私政策 Slug', location: 'Footer 隐私政策链接', components: [{ name: 'Footer 隐私', color: 'bg-sky-100 text-sky-700' }] },
  terms_slug: { label: '服务条款 Slug', location: 'Footer 服务条款链接', components: [{ name: 'Footer 条款', color: 'bg-sky-100 text-sky-700' }] }
};

function SiteSettingsTab() {
  const [items, setItems] = useState<any[] | null>(null);
  const [loadError, setLoadError] = useState("");
  // 添加配置项模态框
  const [showAddModal, setShowAddModal] = useState(false);
  const [newKey, setNewKey] = useState("");

  const load = useCallback(() => {
    api("/site-settings?format=array").then(setItems).catch((err: any) => setLoadError(err.message));
  }, []);
  useEffect(() => { load(); }, [load]);
  if (loadError) return <ErrorBox message={loadError}/>;
  if (!items) return <LoadingBox/>;

  const save = () => api("/site-settings/batch", { method: "PUT", body: JSON.stringify(items) });
  const addNew = async () => {
    if (!newKey.trim()) return;
    await api("/site-settings", { method: "POST", body: JSON.stringify({ key: newKey.trim(), value: "", is_visible: 1 }) });
    setShowAddModal(false);
    setNewKey("");
    load();
  };
  const remove = async (key: string) => {
    if (!confirm(`确认删除「${key}」？`)) return;
    await api(`/site-settings/${encodeURIComponent(key)}`, { method: "DELETE" });
    load();
  };

  const getMap = (key: string) => SITE_SETTING_MAP[key] || null;

  return (
    <div>
      <PageHeader icon={Settings} title="全局配置" description="管理网站名称、SEO、社交链接等全局参数" gradient="from-indigo-500 to-violet-500"/>

      {/* 图例说明 */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-6 flex items-start gap-3">
        <CircleHelp size={18} className="text-blue-500 mt-0.5 shrink-0" />
        <div className="text-sm text-blue-800">
          <p className="font-semibold mb-1">提示：修改值后请点击底部「批量保存」使之生效</p>
          <p className="text-blue-600">每条配置下方 <span className="inline-flex gap-1 align-middle mx-0.5"><span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-violet-100 text-violet-700">导航栏 Logo</span><span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-sky-100 text-sky-700">页脚版权</span></span> 标签表示该配置会影响前端的哪个区域</p>
        </div>
      </div>

      {items.map((item, i) => {
        const map = getMap(item.key);
        const isBuiltin = map !== null;
        return (
        <div key={item.key} className={`bg-white border rounded-2xl p-5 mb-4 shadow-sm ${isBuiltin ? "border-indigo-300 ring-1 ring-indigo-100" : "border-slate-200"}`}>
          {/* 顶部标题栏 */}
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-indigo-100 text-indigo-600 text-xs font-bold">{i+1}</span>
              <div>
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">{item.key}</code>
                  {map && <span className="text-sm font-semibold text-slate-800">{map.label}</span>}
                  {isBuiltin && <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-500 text-[10px] rounded font-medium border border-indigo-200">内置</span>}
                  {!isBuiltin && <span className="px-1.5 py-0.5 bg-amber-50 text-amber-500 text-[10px] rounded font-medium border border-amber-200">自定义</span>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <VisibilityToggle visible={!!item.is_visible} onChange={v => {
                const c = [...items]; c[i] = { ...c[i], is_visible: v ? 1 : 0 }; setItems(c);
              }}/>
              <button onClick={() => remove(item.key)} className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-semibold cursor-pointer border-none transition">删除</button>
            </div>
          </div>

          {/* 前端显示位置标注 */}
          {map && (
            <div className="mb-3 flex items-start gap-3 text-xs">
              <span className="text-slate-400 whitespace-nowrap pt-0.5">
                <Globe size={13} className="inline mr-0.5" />
                影响前端：
              </span>
              <span className="text-slate-500 leading-relaxed">{map.location}</span>
            </div>
          )}
          {map && (
            <div className="mb-4 flex flex-wrap gap-1.5">
              {map.components.map((comp, ci) => (
                <span key={ci} className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${comp.color} border`}>{comp.name}</span>
              ))}
            </div>
          )}

          {/* 值编辑 */}
          <div className="grid grid-cols-1 gap-3">
            <Field label={map ? `${map.label}的值` : "Value（值）"} value={item.value} onChange={v => { const c = [...items]; c[i] = { ...c[i], value: v }; setItems(c); }}/>
          </div>
        </div>
        );
      })}
      <div className="flex gap-3 mt-6">
        <SaveButton onClick={save} label="批量保存"/>
        <button onClick={() => setShowAddModal(true)} className="px-6 py-2.5 border-2 border-dashed border-indigo-300 text-indigo-600 rounded-xl font-semibold text-sm hover:bg-indigo-50 transition cursor-pointer bg-white">+ 添加配置项</button>
      </div>

      {/* 添加配置项模态框 */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>添加配置项</DialogTitle>
            <DialogDescription>新增一个站点全局配置项（key-value 对）</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">配置 Key</label>
              <input
                value={newKey}
                onChange={e => setNewKey(e.target.value)}
                placeholder="如 site_name, hero_title, contact_email"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 bg-white"
                onKeyDown={e => { if (e.key === "Enter") addNew(); }}
              />
            </div>
            <p className="text-xs text-muted-foreground">创建后可编辑 Value 值并设置是否显示在前端。</p>
          </div>
          <DialogFooter>
            <button onClick={() => setShowAddModal(false)} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm hover:bg-slate-50 cursor-pointer transition">取消</button>
            <button onClick={addNew} disabled={!newKey.trim()} className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-xl text-sm hover:opacity-90 cursor-pointer transition disabled:opacity-40 disabled:cursor-not-allowed">
              <Plus size={14} className="inline mr-1"/> 确认添加
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
 

  );
}
// ==================== 1.2 HERO TAB (multi-row + CRUD + visibility) ====================
function HeroTab() {
  const [heroes, setHeroes] = useState<any[] | null>(null);
  const [loadError, setLoadError] = useState("");
  const load = useCallback(() => { api("/hero?format=array").then(setHeroes).catch((err: any) => setLoadError(err.message)); }, []);
  useEffect(() => { load(); }, [load]);
  if (loadError) return <ErrorBox message={loadError}/>;
  if (!heroes) return <LoadingBox/>;

  const save = () => api("/hero/batch", { method: "PUT", body: JSON.stringify(heroes) });
  const addNew = async () => { await api("/hero", { method: "POST", body: JSON.stringify({ badge: "新发布", badge_subtitle: "副标题", main_title: "标题", subtitle1: "", subtitle2: "", description: "描述文字", stats: [{value:"0",label:"标签"}], primary_btn_text: "立即体验", primary_btn_link: "/products", secondary_btn_text: "联系我们", secondary_btn_link: "", cta_subtitle: "", hero_image: "" }) }); load(); };
  const remove = async (id: number) => { if (!confirm("确认删除此 Hero？")) return; await api(`/hero/${id}`, { method: "DELETE" }); load(); };
  const addStat = (hi: number) => { const c = [...heroes]; c[hi] = { ...c[hi], stats: [...(c[hi].stats||[]), {value:"",label:""}] }; setHeroes(c); };
  const removeStat = (hi: number, si: number) => { const c = [...heroes]; const s = [...c[hi].stats]; s.splice(si,1); c[hi] = { ...c[hi], stats: s }; setHeroes(c); };

  return (<div>
    <PageHeader icon={Layout} title="首页 Hero 区域" description="管理首屏展示，统计数据支持添加/删除，右侧支持配图" gradient="from-blue-500 to-cyan-500"/>
    <LocationInfo page="首页" section="首屏 Hero 区域" color="blue" description="访问者看到的第一屏 —— 大标题、描述、统计数据、按钮和右侧配图。支持多条轮播。"/>
    {heroes.map((hero, i) => (<div key={hero.id} className="bg-white border border-slate-200 rounded-2xl p-5 mb-4 shadow-sm">
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2"><span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-blue-100 text-blue-600 text-xs font-bold">{i+1}</span><span className="font-semibold text-slate-800 text-sm">Hero #{hero.id}</span></div>
        <div className="flex items-center gap-2"><VisibilityToggle visible={!!hero.is_visible} onChange={v=>{const c=[...heroes];c[i]={...c[i],is_visible:v?1:0};setHeroes(c)}}/><button onClick={()=>remove(hero.id)} className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-semibold cursor-pointer border-none transition">删除</button></div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Field label="顶部 Badge" value={hero.badge} onChange={v=>{const c=[...heroes];c[i]={...c[i],badge:v};setHeroes(c)}}/>
        <Field label="Badge 副标题" value={hero.badge_subtitle} onChange={v=>{const c=[...heroes];c[i]={...c[i],badge_subtitle:v};setHeroes(c)}}/>
        <Field label="主标题 Part 1" value={hero.main_title} onChange={v=>{const c=[...heroes];c[i]={...c[i],main_title:v};setHeroes(c)}}/>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="主标题 Part 2（渐变色）" value={hero.subtitle1} onChange={v=>{const c=[...heroes];c[i]={...c[i],subtitle1:v};setHeroes(c)}}/>
        <Field label="主标题 Part 3" value={hero.subtitle2} onChange={v=>{const c=[...heroes];c[i]={...c[i],subtitle2:v};setHeroes(c)}}/>
      </div>
      <Field label="描述文字" value={hero.description} onChange={v=>{const c=[...heroes];c[i]={...c[i],description:v};setHeroes(c)}} type="textarea"/>
      <Field label="右侧配图 URL（可选）" value={hero.hero_image||""} onChange={v=>{const c=[...heroes];c[i]={...c[i],hero_image:v};setHeroes(c)}} placeholder="https://... 留空则显示 3D 背景动画"/>
      <label className="block text-sm font-semibold text-slate-700 mb-2 mt-4">按钮配置</label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Field label="主按钮文字" value={hero.primary_btn_text||""} onChange={v=>{const c=[...heroes];c[i]={...c[i],primary_btn_text:v};setHeroes(c)}}/>
        <Field label="主按钮链接" value={hero.primary_btn_link||""} onChange={v=>{const c=[...heroes];c[i]={...c[i],primary_btn_link:v};setHeroes(c)}}/>
        <Field label="副按钮文字" value={hero.secondary_btn_text||""} onChange={v=>{const c=[...heroes];c[i]={...c[i],secondary_btn_text:v};setHeroes(c)}}/>
        <Field label="副按钮链接" value={hero.secondary_btn_link||""} onChange={v=>{const c=[...heroes];c[i]={...c[i],secondary_btn_link:v};setHeroes(c)}} placeholder="留空使用 TG 链接"/>
      </div>
      <Field label="CTA 副标题" value={hero.cta_subtitle||""} onChange={v=>{const c=[...heroes];c[i]={...c[i],cta_subtitle:v};setHeroes(c)}} placeholder="如：注册即享 7 天免费试用"/>
      
      {/* Stats section with add/delete */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-slate-700">统计数据</label>
          <button onClick={()=>addStat(i)} className="px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-xs font-semibold cursor-pointer border-none flex items-center gap-1"><Plus size={12}/>添加统计</button>
        </div>
        {(hero.stats||[]).map((stat:any, si:number) => (
          <div key={si} className="flex gap-3 mb-3 items-center">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-indigo-50 text-indigo-600 text-xs font-bold shrink-0">{si+1}</span>
            <input value={stat.value||""} onChange={e=>{const c=[...heroes];const s=[...c[i].stats];s[si]={...s[si],value:e.target.value};c[i]={...c[i],stats:s};setHeroes(c)}} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 bg-white" placeholder="数值，如 10,000+"/>
            <input value={stat.label||""} onChange={e=>{const c=[...heroes];const s=[...c[i].stats];s[si]={...s[si],label:e.target.value};c[i]={...c[i],stats:s};setHeroes(c)}} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 bg-white" placeholder="说明，如 全球用户"/>
            <Trash2 size={16} className="text-red-400 hover:text-red-600 cursor-pointer shrink-0" onClick={()=>removeStat(i,si)}/>
          </div>
        ))}
      </div>
    </div>))}
    <div className="flex gap-3 mt-6"><SaveButton onClick={save} label="批量保存 Hero"/><button onClick={addNew} className="px-6 py-2.5 border-2 border-dashed border-indigo-300 text-indigo-600 rounded-xl font-semibold text-sm hover:bg-indigo-50 transition cursor-pointer bg-white">+ 添加 Hero</button></div>
  </div>);
}

// ==================== USE CASES TAB ====================
function UseCasesTab() {
  const [items, setItems] = useState<any[] | null>(null);
  const [loadError, setLoadError] = useState("");
  const load = useCallback(() => {
    api("/usecases").then((data: any[]) => {
      // Normalize tags to array for editing
      const normalized = data.map(item => {
        let tags = item.tags;
        if (typeof tags === "string") {
          try {
            let parsed = JSON.parse(tags);
            if (typeof parsed === "string") parsed = JSON.parse(parsed);
            tags = Array.isArray(parsed) ? parsed : [];
          } catch { tags = []; }
        }
        return { ...item, tags };
      });
      setItems(normalized);
    }).catch((err: any) => setLoadError(err.message));
  }, []);
  useEffect(()=>{load();},[load]);
  if (loadError) return <ErrorBox message={loadError}/>;
  if (!items) return <LoadingBox/>;

  const save = () => api("/usecases", { method: "PUT", body: JSON.stringify(items) });
  const addNew = async () => {
    await api("/usecases", { method: "POST", body: JSON.stringify({icon:"Star",title:"新场景",description:"场景描述",gradient:"from-blue-500 to-cyan-500",tags:[],icon_bg:"bg-blue-50"})});
    load();
  };
  const remove = async (id: number) => { if(!confirm("确认删除？")) return; await api(`/usecases/${id}`,{method:"DELETE"}); load(); };

  return (
    <div>
      <PageHeader icon={Zap} title="应用场景" description="管理首页展示的场景卡片" gradient="from-amber-500 to-orange-500"/>
      <LocationInfo page="首页" section="「应用场景」区域" color="amber"
        description="位于首页 Hero 下方，以卡片形式展示 CloudNest 的使用场景。每张卡片包含图标、标题、描述、标签。" />
      {items.map((item,i)=>(
        <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-5 mb-4 shadow-sm">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-amber-100 text-amber-600 text-xs font-bold">{i+1}</span>
              <span className="font-semibold text-slate-800">场景 #{i+1}</span>
            </div>
            <button onClick={()=>remove(item.id)} className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-semibold cursor-pointer border-none transition">删除</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">图标</label><IconSelect value={item.icon} onChange={v=>{const c=[...items];c[i]={...c[i],icon:v};setItems(c);}}/></div>
            <Field label="标题" value={item.title} onChange={v=>{const c=[...items];c[i]={...c[i],title:v};setItems(c);}}/>
          </div>
          <Field label="描述" value={item.description} onChange={v=>{const c=[...items];c[i]={...c[i],description:v};setItems(c);}} type="textarea" rows={2}/>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">图标渐变色</label>
              <GradientPicker value={item.gradient || ""} onChange={v=>{const c=[...items];c[i]={...c[i],gradient:v};setItems(c);}}/>
            </div>
            <Field label="图标背景色" value={item.icon_bg||""} onChange={v=>{const c=[...items];c[i]={...c[i],icon_bg:v};setItems(c);}}/>
          </div>
          <Field label="标签（逗号分隔）" value={Array.isArray(item.tags) ? item.tags.join(',') : ''} onChange={v=>{const c=[...items];c[i]={...c[i],tags:v.split(',').map((s:string)=>s.trim()).filter(Boolean)};setItems(c);}}/>
        </div>
      ))}
      <div className="flex gap-3">
        <SaveButton onClick={save} label="保存场景"/>
        <button onClick={addNew} className="px-6 py-2.5 border-2 border-dashed border-indigo-300 text-indigo-600 rounded-xl font-semibold text-sm hover:bg-indigo-50 transition cursor-pointer bg-white">+ 添加场景</button>
      </div>
    </div>
 

  );
}
// ==================== FEATURES TAB ====================
function FeaturesTab() {
  const [items, setItems] = useState<any[] | null>(null);
  const [loadError, setLoadError] = useState("");
  const load = useCallback(() => { api("/features").then(setItems).catch((err: any) => setLoadError(err.message)); }, []);
  useEffect(()=>{load();},[load]);
  if (loadError) return <ErrorBox message={loadError}/>;
  if (!items) return <LoadingBox/>;

  const save = () => api("/features", { method: "PUT", body: JSON.stringify(items) });
  const addNew = async () => { await api("/features",{method:"POST",body:JSON.stringify({icon:"Star",title:"新优势",description:"优势描述",icon_gradient:"from-indigo-500 to-blue-500"})}); load(); };
  const remove = async (id: number) => { if(!confirm("确认删除？")) return; await api(`/features/${id}`,{method:"DELETE"}); load(); };

  return (
    <div>
      <PageHeader icon={Star} title="平台优势" description="管理首页「为什么选择我们」特性展示" gradient="from-emerald-500 to-teal-500"/>
      <LocationInfo page="首页" section="「为什么选择我们」区域" color="emerald"
        description="位于首页应用场景下方，展示 CloudNest 的平台优势。每项优势包含图标、标题、描述文字。" />
      {items.map((item,i)=>(
        <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-5 mb-4 shadow-sm">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-emerald-100 text-emerald-600 text-xs font-bold">{i+1}</span>
              <span className="font-semibold text-slate-800">优势 #{i+1}</span>
            </div>
            <button onClick={()=>remove(item.id)} className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-semibold cursor-pointer border-none transition">删除</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">图标</label><IconSelect value={item.icon} onChange={v=>{const c=[...items];c[i]={...c[i],icon:v};setItems(c);}}/></div>
            <Field label="标题" value={item.title} onChange={v=>{const c=[...items];c[i]={...c[i],title:v};setItems(c);}}/>
          </div>
          <Field label="描述" value={item.description} onChange={v=>{const c=[...items];c[i]={...c[i],description:v};setItems(c);}} type="textarea" rows={2}/>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">图标渐变色</label>
            <GradientPicker value={item.icon_gradient || ""} onChange={v=>{const c=[...items];c[i]={...c[i],icon_gradient:v};setItems(c);}}/>
          </div>
        </div>
      ))}
      <div className="flex gap-3">
        <SaveButton onClick={save} label="保存优势"/>
        <button onClick={addNew} className="px-6 py-2.5 border-2 border-dashed border-indigo-300 text-indigo-600 rounded-xl font-semibold text-sm hover:bg-indigo-50 transition cursor-pointer bg-white">+ 添加强项</button>
      </div>
    </div>
 

  );
}
// ==================== CTA TAB ====================
function CTATab() {
  const [cta, setCta] = useState<any>(null);
  const [loadError, setLoadError] = useState("");
  useEffect(() => { api("/cta").then((data: any) => { setCta(Array.isArray(data) ? data[0] : data); }).catch((err: any) => setLoadError(err.message)); }, []);
  if (loadError) return <ErrorBox message={loadError}/>;
  if (!cta) return <LoadingBox/>;
  const save = () => api("/cta", { method: "PUT", body: JSON.stringify([cta]) });
  return (
    <div>
      <PageHeader icon={MessageSquare} title="CTA 行动号召" description="编辑页面底部行动号召区域文案" gradient="from-violet-500 to-purple-500"/>
      <LocationInfo page="首页底部" section="「CTA 行动号召」区域" color="violet"
        description="位于首页最下方，包含主副标题和两个操作按钮。按钮文字可在此编辑，按钮链接通过「站点信息」中的 telegram_cta_link 设置。" />
      <CardWrapper>
        <SectionTitle icon={FileText} title="文案"/>
        <Field label="主标题" value={cta.title} onChange={v=>setCta((c:any)=>({...c,title:v}))}/>
        <Field label="副标题/描述" value={cta.subtitle} onChange={v=>setCta((c:any)=>({...c,subtitle:v}))}/>
        <Field label="主按钮文字" value={cta.button_text} onChange={v=>setCta((c:any)=>({...c,button_text:v}))}/>
        <Field label="次按钮文字" value={cta.secondary_button_text} onChange={v=>setCta((c:any)=>({...c,secondary_button_text:v}))}/>
      </CardWrapper>
      <SaveButton onClick={save} label="保存 CTA"/>
    </div>
 

  );
}
// ==================== 2. CONTACT TAB (CRUD + visibility) ====================
function ContactTab() {
  const [items, setItems] = useState<any[] | null>(null);
  const [loadError, setLoadError] = useState("");
  const load = useCallback(() => {
    api("/contact-info?all=1").then(setItems).catch((err: any) => setLoadError(err.message));
  }, []);
  useEffect(() => { load(); }, [load]);
  if (loadError) return <ErrorBox message={loadError}/>;
  if (!items) return <LoadingBox/>;

  const save = () => api("/contact-info", { method: "PUT", body: JSON.stringify(items) });
  const addNew = async () => {
    await api("/contact-info", { method: "POST", body: JSON.stringify({ icon: "Mail", title: "新渠道", content: "描述", gradient: "from-blue-500 to-cyan-500" }) });
    load();
  };
  const remove = async (id: number) => {
    if (!confirm("确认删除此联系方式？")) return;
    await api(`/contact-info/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div>
      <PageHeader icon={Phone} title="联系方式" description="管理网站联系渠道，支持添加、删除、显示/隐藏" gradient="from-cyan-500 to-blue-500"/>
      <LocationInfo page="「联系我们」页面" section="联系渠道卡片" color="cyan"
        description="显示在 /contact 页面，以卡片形式展示各联系渠道。每个卡片包含图标、渠道名称（标题）、联系信息（显示内容）。" />
      {items.map((item, i) => (
        <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-5 mb-4 shadow-sm">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-cyan-100 text-cyan-600 text-xs font-bold">{i+1}</span>
              <span className="font-semibold text-slate-800">联系方式 #{i+1}</span>
            </div>
            <div className="flex items-center gap-2">
              <VisibilityToggle visible={!!item.is_visible} onChange={v => {
                const c = [...items]; c[i] = { ...c[i], is_visible: v ? 1 : 0 }; setItems(c);
              }}/>
              <button onClick={() => remove(item.id)} className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-semibold cursor-pointer border-none transition">删除</button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">图标</label><IconSelect value={item.icon} onChange={v=>{const c=[...items];c[i]={...c[i],icon:v};setItems(c);}}/></div>
            <Field label="标题" value={item.title} onChange={v=>{const c=[...items];c[i]={...c[i],title:v};setItems(c);}}/>
          </div>
          <Field label="显示内容" value={item.content} onChange={v=>{const c=[...items];c[i]={...c[i],content:v};setItems(c);}}/>
          <Field label="渐变色" value={item.gradient||""} onChange={v=>{const c=[...items];c[i]={...c[i],gradient:v};setItems(c);}}/>
        </div>
      ))}
      <div className="flex gap-3 mt-6">
        <SaveButton onClick={save} label="批量保存"/>
        <button onClick={addNew} className="px-6 py-2.5 border-2 border-dashed border-cyan-300 text-cyan-600 rounded-xl font-semibold text-sm hover:bg-cyan-50 transition cursor-pointer bg-white">+ 添加联系方式</button>
      </div>
    </div>
 

  );
}
// ==================== 1.3 ABOUT TAB (CRUD values) ====================
function AboutTab() {
  const [about, setAbout] = useState<any>(null);
  const [loadError, setLoadError] = useState("");
  const load = useCallback(() => {
    api("/about").then((data: any) => {
      // Handle array response from generic CRUD
      const a = Array.isArray(data) ? (data[0] || null) : data;
      // Parse card_values if it's a JSON string
      if (a && typeof a.card_values === 'string') {
        try { a.card_values = JSON.parse(a.card_values); } catch(e) { a.card_values = []; }
      }
      if (a && !a.card_values) a.card_values = [];
      setAbout(a);
    }).catch((err: any) => setLoadError(err.message));
  }, []);
  useEffect(() => { load(); }, [load]);
  if (loadError) return <ErrorBox message={loadError}/>;
  if (about === null) return <LoadingBox/>;
  if (!about) return <div className="text-center py-16 text-slate-400">暂无关于我们的数据</div>;

  const save = () => {
    // Save card_values as JSON string for DB storage
    const toSave = { ...about };
    if (Array.isArray(toSave.card_values)) {
      toSave.card_values = JSON.stringify(toSave.card_values);
    }
    return api("/about", { method: "PUT", body: JSON.stringify([toSave]) });
  };

  const addValue = () => {
    const v = [...(about.card_values || [])];
    v.push({ icon: "Star", title: "新价值观", description: "描述" });
    setAbout((a: any) => ({ ...a, card_values: v }));
  };
  const deleteValue = (idx: number) => {
    if (!confirm("确认删除此价值观卡片？")) return;
    const v = [...(about.card_values || [])];
    v.splice(idx, 1);
    setAbout((a: any) => ({ ...a, card_values: v }));
  };

  const updateValue = (idx: number, field: string, value: string) => {
    const v = [...(about.card_values || [])];
    v[idx] = { ...v[idx], [field]: value };
    setAbout((a: any) => ({ ...a, card_values: v }));
  };

  return (
    <div>
      <PageHeader icon={Globe} title="关于我们" description="编辑公司介绍和价值观内容，可增删卡片" gradient="from-teal-500 to-cyan-500"/>
      <LocationInfo page="「关于我们」页面 (/about)" section="公司介绍 + 价值观" color="teal"
        description="包含页面标题、公司介绍段落（两段文字）和价值观卡片列表。价值观卡片以图标+标题+描述的形式展示公司核心理念。" />
      <CardWrapper>
        <SectionTitle icon={FileText} title="页面文案" iconColor="info"/>
        <Field label="页面标题" value={about.page_title} onChange={v => setAbout((a:any)=>({...a,page_title:v}))}/>
        <Field label="页面副标题" value={about.page_subtitle} onChange={v => setAbout((a:any)=>({...a,page_subtitle:v}))}/>
        <Field label="介绍标题" value={about.heading} onChange={v => setAbout((a:any)=>({...a,heading:v}))}/>
        <Field label="介绍第一段" value={about.intro_paragraph_1} onChange={v => setAbout((a:any)=>({...a,intro_paragraph_1:v}))} type="textarea" rows={4}/>
        <Field label="介绍第二段" value={about.intro_paragraph_2} onChange={v => setAbout((a:any)=>({...a,intro_paragraph_2:v}))} type="textarea" rows={4}/>
      </CardWrapper>

      <CardWrapper>
        <div className="flex justify-between items-center mb-4">
          <SectionTitle icon={Star} title="价值观卡片" iconColor="success"/>
          <button onClick={addValue}
            className="px-4 py-2 border-2 border-dashed border-emerald-300 text-emerald-600 rounded-xl text-sm font-semibold hover:bg-emerald-50 transition cursor-pointer bg-white flex items-center gap-1.5">
            <Plus size={15}/> 添加卡片
          </button>
        </div>
        {(about.card_values || []).map((v: any, i: number) => (
          <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-3">
            <div className="flex justify-between items-center mb-3">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 text-xs font-bold">{i+1}</span>
              <button onClick={() => deleteValue(i)} className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-semibold cursor-pointer border-none transition">删除</button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div><label className="block text-xs font-semibold text-slate-500 mb-1">图标</label><IconSelect value={v.icon} onChange={val => updateValue(i, "icon", val)}/></div>
              <Field label="标题" value={v.title} onChange={val => updateValue(i, "title", val)}/>
              <Field label="描述" value={v.description} onChange={val => updateValue(i, "description", val)}/>
            </div>
          </div>
        ))}
      </CardWrapper>
      <SaveButton onClick={save} label="保存关于我们"/>
    </div>
 

  );
}
// ==================== NAV MENU TAB ====================
function NavMenuTab() {
  const [menus, setMenus] = useState<any[] | null>(null);
  const [loadError, setLoadError] = useState("");
  const load = useCallback(() => { api("/nav-menus").then(setMenus).catch((err: any) => setLoadError(err.message)); }, []);
  useEffect(()=>{load();},[load]);
  if (loadError) return <ErrorBox message={loadError}/>;
  if (!menus) return <LoadingBox/>;

  const save = () => api("/nav-menus", { method: "PUT", body: JSON.stringify(menus) });
  const addNew = async () => {
    await api("/nav-menus", { method: "POST", body: JSON.stringify({ label: "新菜单", type: "route", target: "/", is_visible: 1 }) });
    load();
  };
  const removeItem = async (id: number) => { if(!confirm("确认删除？")) return; await api(`/nav-menus/${id}`,{method:"DELETE"}); load(); };
  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const copy = [...menus];
    [copy[idx - 1], copy[idx]] = [copy[idx], copy[idx - 1]];
    // Update sort_order to match new positions
    copy.forEach((m, i) => { m.sort_order = i + 1; });
    setMenus(copy);
  };
  const moveDown = (idx: number) => {
    if (idx === menus.length - 1) return;
    const copy = [...menus];
    [copy[idx], copy[idx + 1]] = [copy[idx + 1], copy[idx]];
    // Update sort_order to match new positions
    copy.forEach((m, i) => { m.sort_order = i + 1; });
    setMenus(copy);
  };

  return (
    <div>
      <PageHeader icon={Layout} title="导航菜单管理" description="管理顶部导航栏，支持增删改排序 + 显示/隐藏" gradient="from-rose-500 to-pink-500"/>
      <LocationInfo page="全局" section="顶部导航栏" color="rose"
        description="导航栏出现在网站的每一个页面上方。菜单项的类型：route=跳转到页面路由（如 /products），scroll=滚动到首页锚点（如 Hero/CTA 区域）。" />
      {menus.map((menu, i) => (
        <div key={menu.id} className="bg-white border border-slate-200 rounded-2xl p-5 mb-4 shadow-sm">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 text-white text-sm font-bold shadow">{i+1}</span>
              <span className="font-semibold text-slate-800">菜单项 — {menu.label || "(未命名)"}</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => moveUp(i)} disabled={i===0}
                className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 cursor-pointer border-none bg-transparent transition">
                <ChevronDown size={16} className="text-slate-500 rotate-90"/>
              </button>
              <button onClick={() => moveDown(i)} disabled={i===menus.length-1}
                className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 cursor-pointer border-none bg-transparent transition">
                <ChevronDown size={16} className="text-slate-500 -rotate-90"/>
              </button>
              <VisibilityToggle visible={!!menu.is_visible} onChange={v => { const c=[...menus]; c[i]={...c[i], is_visible:v?1:0}; setMenus(c); }}/>
              <button onClick={()=>removeItem(menu.id)} className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-semibold cursor-pointer border-none transition">删除</button>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Field label="显示名称" value={menu.label||""} onChange={v=>{const c=[...menus];c[i]={...c[i],label:v};setMenus(c);}}/>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">类型</label>
              <select value={menu.type||"route"} onChange={e=>{const c=[...menus];c[i]={...c[i],type:e.target.value};setMenus(c);}}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none bg-white">
                <option value="route">页面路由（如 /products）</option>
                <option value="scroll">锚点滚动（如 cta）</option>
              </select>
            </div>
            <Field label={menu.type==="route"?"目标路径（如 /help）":"锚点 ID（如 cta）"} value={menu.target||""} onChange={v=>{const c=[...menus];c[i]={...c[i],target:v};setMenus(c);}}/>
          </div>
        </div>
      ))}
      <div className="flex gap-3 mt-6">
        <SaveButton onClick={save} label="保存菜单"/>
        <button onClick={addNew} className="px-6 py-2.5 border-2 border-dashed border-pink-300 text-pink-600 rounded-xl font-semibold text-sm hover:bg-pink-50 transition cursor-pointer bg-white">+ 添加菜单项</button>
      </div>
    </div>
 

  );
}
// ==================== Product category selector ====================
function ProductCategorySelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [cats, setCats] = useState<any[]>([]);
  useEffect(() => { api("/categories?type=product").then(setCats).catch(() => {}); }, []);
  return (
    <select value={value || ""} onChange={e => onChange(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 bg-white outline-none">
      <option value="">无分类</option>
      {cats.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
    </select>
 

  );
}
// ==================== 3. PRODUCTS TAB (CRUD + visibility + sub-items CRUD) ====================
function ProductsTab() {
  const [products, setProducts] = useState<any[] | null>(null);
  const [loadError, setLoadError] = useState("");
  const [activeProduct, setActiveProduct] = useState<string | null>(null);
  // 添加产品模态框
  const [showAddModal, setShowAddModal] = useState(false);
  const [newId, setNewId] = useState("");
  const [newTitle, setNewTitle] = useState("");

  const load = useCallback(() => {
    api("/products?all=1").then((data: any[]) => {
      const parsed = data.map((p: any) => ({
        ...p,
        highlights: typeof p.highlights === "string" ? JSON.parse(p.highlights) : (p.highlights || []),
        features: typeof p.features === "string" ? JSON.parse(p.features) : (p.features || []),
        specs: typeof p.specs === "string" ? JSON.parse(p.specs) : (p.specs || []),
        sections: typeof p.sections === "string" ? JSON.parse(p.sections) : (p.sections || []),
      }));
      setProducts(parsed);
    }).catch((err: any) => setLoadError(err.message));
  }, []);
  useEffect(() => { load(); }, [load]);
  // Pricing plans for this product
  const [pricingPlans, setPricingPlans] = useState<any[]>([]);
  useEffect(() => {
    const prod = activeProduct ? (products || []).find((p: any) => p.id === activeProduct) : null;
    if (!prod) { setPricingPlans([]); return; }
    api("/pricing").then((data: any[]) => {
      setPricingPlans((data || []).filter((p: any) => p.product_id === prod.id));
    }).catch(() => {});
  }, [activeProduct, products]);

  const addPlan = async () => {
    if (!activeProduct) return;
    const prod = products?.find((p: any) => p.id === activeProduct);
    if (!prod) return;
    await api("/pricing", { method: "POST", body: JSON.stringify({ product_id: prod.id, name: "新套餐", price: "¥99", period: "/月", description: "", features: JSON.stringify(["功能1","功能2"]), highlighted: 0, button_text: "立即试用", gradient: prod.gradient || "from-indigo-500 to-blue-500" }) });
    api("/pricing").then((data: any[]) => setPricingPlans((data || []).filter((p: any) => p.product_id === prod.id)));
  };
  const delPlan = async (id: number) => { if (!confirm("删除此套餐？")) return; await api("/pricing/" + id, { method: "DELETE" }); api("/pricing").then((data: any[]) => setPricingPlans((data || []).filter((p: any) => p.product_id === activeProduct))); };
  const updatePlan = (pid: number, field: string, value: any) => { setPricingPlans(prev => prev.map(p => p.id === pid ? { ...p, [field]: value } : p)); };
  const savePlans = async () => { try { await api("/pricing", { method: "PUT", body: JSON.stringify(pricingPlans) }); alert("价格方案已保存" + pricingPlans.length + " 个套餐"); } catch(e: any) { alert("保存失败: " + (e.message || "未知错误")); } };
  const addPlanFeature = (planId: number) => { setPricingPlans(prev => prev.map(p => p.id === planId ? { ...p, features: [...(p.features||[]), "新功能"] } : p)); };
  const removePlanFeature = (planId: number, fi: number) => { setPricingPlans(prev => prev.map(p => p.id === planId ? { ...p, features: (p.features||[]).filter((_:any, i:number) => i !== fi) } : p)); };


  if (loadError) return <ErrorBox message={loadError}/>;
  if (!products) return <LoadingBox/>;

  const active = activeProduct ? products.find((p: any) => p.id === activeProduct) : null;

  const iconMap: Record<string, any> = { Smartphone, Shield, Layers };
  const saveProduct = async () => {
    if (!active) return;
    // Stringify array fields back to JSON strings for DB storage
    const toSave: any = { ...active };
    if (Array.isArray(toSave.sections)) toSave.sections = JSON.stringify(toSave.sections);
    if (Array.isArray(toSave.highlights)) toSave.highlights = JSON.stringify(toSave.highlights);
    if (Array.isArray(toSave.features)) toSave.features = JSON.stringify(toSave.features);
    if (Array.isArray(toSave.specs)) toSave.specs = JSON.stringify(toSave.specs);
    // Save product first (don't let pricing failure block product save)
    await api("/products", { method: "PUT", body: JSON.stringify([toSave]) });
    // Auto-save pricing plans (non-blocking - catch errors separately)
    if (pricingPlans.length > 0) {
      try { await api("/pricing", { method: "PUT", body: JSON.stringify(pricingPlans) }); }
      catch (e) { console.error("Pricing save failed:", e); }
    }
    load();
  };

  const addProduct = async () => {
    if (!newId.trim() || !newTitle.trim()) return;
    await api("/products", { method: "POST", body: JSON.stringify({ id: newId.trim(), title: newTitle.trim(), subtitle: "", description: "", gradient: "from-indigo-500 to-blue-500", icon: "Package" }) });
    setShowAddModal(false);
    setNewId("");
    setNewTitle("");
    load();
  };

  const deleteProduct = async (id: string) => {
    if (!confirm(`确认删除产品「${id}」？此操作不可恢复！`)) return;
    await api(`/products/${id}`, { method: "DELETE" });
    load();
    setActiveProduct(null);
  };

  const updateProduct = (field: string, value: any) => {
    setProducts((prev: any) => prev.map((p: any) => p.id === activeProduct ? { ...p, [field]: value } : p));
  };

  // Sections CRUD (generic)
  const sections = active?.sections || [];
;

  const addSection = () => { if (!active) return; updateProduct("sections", [...sections, { name: "新区块", items: [{ key: "项名称", value: "项值" }] }]); };
  const deleteSection = (idx: number) => { if (!active) return; const s = [...sections]; s.splice(idx, 1); updateProduct("sections", s); };
  const updateSectionName = (idx: number, name: string) => { if (!active) return; const s = [...sections]; s[idx] = { ...s[idx], name }; updateProduct("sections", s); };
  const addSectionItem = (si: number) => { if (!active) return; const s = [...sections]; s[si] = { ...s[si], items: [...s[si].items, { key: "新项", value: "" }] }; updateProduct("sections", s); };
  const deleteSectionItem = (si: number, ii: number) => { if (!active) return; const s = [...sections]; s[si] = { ...s[si], items: s[si].items.filter((_: any, i: number) => i !== ii) }; updateProduct("sections", s); };
  const updateSectionItem = (si: number, ii: number, field: "key"|"value", val: string) => { if (!active) return; const s = [...sections]; const items = [...s[si].items]; items[ii] = { ...items[ii], [field]: val }; s[si] = { ...s[si], items }; updateProduct("sections", s); };

  return (
    <div>
      <PageHeader icon={Package} title="产品信息" description="管理产品详情，通用内容区块系统，支持自定义任意内容" gradient="from-sky-500 to-indigo-500"/>
      <LocationInfo page="「产品中心」页面 (/products)" section="产品详情展示" color="sky"
        description="每个产品包含基本信息和内容区块。内容区块是通用的内容管理系统 —— 可创建任意命名的区块（如核心亮点、功能特性、技术规格等），每个区块内可添加键值对内容。产品页底部 Telegram 按钮的链接由「站点信息」的 telegram_products_link 控制。" />

      {/* Product Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <div className="inline-flex bg-white rounded-2xl p-1.5 shadow-sm border border-slate-200 flex-wrap">
          {products.map((p: any) => {
            const Icon = iconMap[p.icon] || Package;
            return (
              <button key={p.id} onClick={() => setActiveProduct(p.id)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition flex items-center gap-2 cursor-pointer border-none ${
                  activeProduct === p.id
                    ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}>
                <Icon size={16}/> {p.title}
                {!p.is_visible && <EyeOff size={12} className="opacity-60"/>}
              </button>
            );
          })}
        </div>
        <button onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 border-2 border-dashed border-sky-300 text-sky-600 rounded-xl text-sm font-semibold hover:bg-sky-50 transition cursor-pointer bg-white flex items-center gap-1.5">
          <Plus size={15}/> 添加产品
        </button>
      </div>

      {active && (
        <div>
          {/* Product visibility + delete toolbar */}
          <CardWrapper className="!p-4 !mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-slate-700">产品状态：</span>
                <VisibilityToggle visible={!!active.is_visible} onChange={v => updateProduct("is_visible", v ? 1 : 0)}/>
              </div>
              <button onClick={() => deleteProduct(active.id)}
                className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-sm font-semibold cursor-pointer border-none transition flex items-center gap-1.5">
                <Trash2 size={15}/> 删除此产品
              </button>
            </div>
          </CardWrapper>

          {/* Basic Info */}
          <CardWrapper>
            <SectionTitle icon={FileText} title="基本信息"/>
            <div className="grid grid-cols-2 gap-4">
              <Field label="产品 ID（英文）" value={active.id} onChange={v => updateProduct("id", v)}/>
              <Field label="产品名称" value={active.title} onChange={v => updateProduct("title", v)}/>
            </div>
            <Field label="副标题" value={active.subtitle} onChange={v => updateProduct("subtitle", v)}/>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">图标</label><IconSelect value={active.icon} onChange={v => updateProduct("icon", v)}/></div>
              <Field label="渐变色" value={active.gradient} onChange={v => updateProduct("gradient", v)}/>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">产品分类</label>
                <ProductCategorySelect value={active.category_id || ""} onChange={v => updateProduct("category_id", v ? parseInt(v) : null)}/>
              </div>
            </div>
            <Field label="描述" value={active.description} onChange={v => updateProduct("description", v)} type="textarea" rows={4}/>
          </CardWrapper>

          {/* Dynamic Sections - 通用内容区块 */}
          <CardWrapper>
            <div className="flex justify-between items-center mb-4">
              <SectionTitle icon={Grid3x3} title="内容区块" iconColor="info"/>
              <button onClick={addSection}
                className="px-4 py-2 border-2 border-dashed border-cyan-300 text-cyan-600 rounded-xl text-sm font-semibold hover:bg-cyan-50 transition cursor-pointer bg-white flex items-center gap-1.5">
                <Plus size={15}/> 添加区块
              </button>
            </div>
            {(!sections || sections.length === 0) ? (
              <div className="text-center py-10">
                <Grid3x3 size={40} className="mx-auto mb-3 text-slate-300"/>
                <p className="text-slate-400 text-sm mb-2">暂无内容区块</p>
                <p className="text-slate-400 text-xs">点击「添加区块」创建自定义内容，如：核心亮点、功能特性、技术规格、使用案例等</p>
              </div>
            ) : sections.map((section: any, si: number) => (
              <div key={si} className="border border-slate-200 rounded-2xl p-4 mb-3 bg-white">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-100 text-indigo-600 text-xs font-bold">{si+1}</span>
                    <input value={section.name} onChange={e => updateSectionName(si, e.target.value)}
                      placeholder="区块标题（如：核心亮点、功能特性、技术规格）" className="text-sm font-semibold text-slate-800 border-0 border-b-2 border-transparent hover:border-indigo-300 focus:border-indigo-400 outline-none px-1 py-0.5 bg-transparent flex-1"/>
                  </div>
                  <button onClick={() => deleteSection(si)} className="p-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg cursor-pointer border-none transition" title="删除区块"><Trash2 size={14}/></button>
                </div>
                <div className="space-y-2">
                  {section.items.map((item: any, ii: number) => (
                    <div key={ii} className="flex gap-2 items-center">
                      <input value={item.key} onChange={e => updateSectionItem(si, ii, "key", e.target.value)}
                        placeholder="名称（如：启动速度、CPU、功能标题）" className="w-48 px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 bg-white outline-none focus:border-indigo-400"/>
                      <input value={item.value} onChange={e => updateSectionItem(si, ii, "value", e.target.value)}
                        placeholder="内容（如：≤10 秒、4-8 核、功能描述...）" className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 bg-white outline-none focus:border-indigo-400"/>
                      <button onClick={() => deleteSectionItem(si, ii)} className="p-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg cursor-pointer border-none transition shrink-0" title="删除"><X size={12}/></button>
                    </div>
                  ))}
                </div>
                <button onClick={() => addSectionItem(si)}
                  className="mt-2 inline-flex items-center gap-1 px-3 py-1 text-xs text-indigo-600 hover:bg-indigo-50 rounded-lg cursor-pointer border border-dashed border-indigo-200 bg-white transition">
                  <Plus size={12}/> 添加行
                </button>
              </div>
            ))}
          </CardWrapper>

          {/* Pricing Plans */}
          <CardWrapper>
            <div className="flex justify-between items-center mb-4">
              <SectionTitle icon={Tag} title="价格方案" iconColor="warning"/>
              <button onClick={addPlan} className="px-4 py-2 border-2 border-dashed border-amber-300 text-amber-600 rounded-xl text-sm font-semibold hover:bg-amber-50 transition cursor-pointer bg-white flex items-center gap-1.5">
                <Plus size={15}/> 添加套餐
              </button>
            </div>
            {pricingPlans.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-4">暂无价格方案</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pricingPlans.map((plan: any) => (
                  <div key={plan.id} className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <input value={plan.name} onChange={e => updatePlan(plan.id, "name", e.target.value)} className="font-semibold text-slate-800 border-0 border-b-2 border-transparent hover:border-amber-300 focus:border-amber-400 outline-none px-1 py-0.5 bg-transparent text-sm"/>
                      <button onClick={() => delPlan(plan.id)} className="text-red-400 hover:text-red-600 cursor-pointer border-none bg-transparent"><X size={14}/></button>
                    </div>
                    <div className="flex items-baseline gap-1 mb-2">
                      <input value={plan.price} onChange={e => updatePlan(plan.id, "price", e.target.value)} className="text-2xl font-bold text-slate-900 border-0 border-b-2 border-transparent hover:border-amber-300 focus:border-amber-400 outline-none px-1 py-0.5 bg-transparent w-24"/>
                      <input value={plan.period} onChange={e => updatePlan(plan.id, "period", e.target.value)} className="text-xs text-slate-500 border-0 border-b-2 border-transparent hover:border-amber-300 focus:border-amber-400 outline-none px-1 py-0.5 bg-transparent w-16"/>
                    </div>
                    <input value={plan.description} onChange={e => updatePlan(plan.id, "description", e.target.value)} className="w-full text-xs text-slate-600 mb-2 border-0 border-b border-slate-100 focus:border-amber-300 outline-none bg-transparent py-1"/>
                    <div className="space-y-1">
                      {(plan.features || []).map((f: any, fi: number) => (
                        <div key={fi} className="flex gap-1 items-center"><input value={f} onChange={e => { const feats = [...plan.features]; feats[fi] = e.target.value; updatePlan(plan.id, "features", feats); }} className="flex-1 text-xs text-slate-700 border border-slate-100 rounded px-2 py-1 bg-slate-50 outline-none focus:border-amber-300"/><button onClick={() => removePlanFeature(plan.id, fi)} className="text-red-400 hover:text-red-600 cursor-pointer border-none bg-transparent shrink-0" title="删除"><X size={12}/></button></div>
                      ))}
                    <button onClick={() => addPlanFeature(plan.id)} className="mt-1.5 inline-flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 cursor-pointer border-none bg-transparent"><Plus size={11}/> 添加功能说明</button>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                      <label className="flex items-center gap-1 text-xs text-slate-500"><input type="checkbox" checked={!!plan.highlighted} onChange={e => updatePlan(plan.id, "highlighted", e.target.checked ? 1 : 0)}/> 高亮</label>
                      <input value={plan.button_text} onChange={e => updatePlan(plan.id, "button_text", e.target.value)} className="flex-1 text-xs border border-slate-200 rounded px-2 py-1 bg-white outline-none focus:border-amber-300"/>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {pricingPlans.length > 0 && (
              <div className="mt-3 text-right">
                <button onClick={savePlans} className="px-4 py-1.5 bg-amber-500 text-white rounded-lg text-xs font-semibold cursor-pointer border-none hover:bg-amber-600">保存价格方案</button>
              </div>
            )}
          </CardWrapper>

          <SaveButton onClick={saveProduct} label="保存产品"/>
        </div>
      )}

      {!active && (
        <div className="text-center py-16 text-slate-400">
          <Package size={48} className="mx-auto mb-4 opacity-30"/>
          <p className="text-lg font-medium">选择上方产品标签开始编辑</p>
        </div>
      )}

      {/* 添加产品模态框 */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>添加新产品</DialogTitle>
            <DialogDescription>填写产品基本信息以创建新产品的</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">产品 ID（英文标识）</label>
              <input
                value={newId}
                onChange={e => setNewId(e.target.value)}
                placeholder="如 cloudphone, sandbox, clone"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 bg-white"
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); const titleEl = (e.target as HTMLElement).parentElement?.parentElement?.querySelector('input:nth-of-type(2)'); (titleEl as HTMLInputElement)?.focus(); } }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">产品名称</label>
              <input
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="如 云手机、沙箱环境"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 bg-white"
                onKeyDown={e => { if (e.key === "Enter") addProduct(); }}
              />
            </div>
          </div>
          <DialogFooter>
            <button onClick={() => setShowAddModal(false)} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm hover:bg-slate-50 cursor-pointer transition">取消</button>
            <button onClick={addProduct} disabled={!newId.trim() || !newTitle.trim()} className="px-4 py-2 bg-gradient-to-r from-sky-500 to-indigo-500 text-white rounded-xl text-sm hover:opacity-90 cursor-pointer transition disabled:opacity-40 disabled:cursor-not-allowed">
              <Plus size={14} className="inline mr-1"/> 确认添加
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
 

  );
}
// ==================== FAQ TAB ====================
function FAQTab() {
  const [categories, setCategories] = useState<any[] | null>(null);
  const [loadError, setLoadError] = useState("");
  const load = useCallback(() => { api("/faq").then(setCategories).catch((err: any) => setLoadError(err.message)); }, []);
  useEffect(()=>{load();},[load]);
  if (loadError) return <ErrorBox message={loadError}/>;
  if (!categories) return <LoadingBox/>;

  const saveCat = (cat: any) => api(`/faq/categories/${cat.id}`,{method:"PUT",body:JSON.stringify(cat)});
  const saveItem = (item: any) => api(`/faq/items/${item.id}`,{method:"PUT",body:JSON.stringify(item)});
  const addItem = async (categoryId: number) => { await api("/faq/items",{method:"POST",body:JSON.stringify({category_id:categoryId,question:"新问题",answer:"编辑此答案"})}); load(); };
  const removeItem = async (id: number) => { if(!confirm("确认删除？")) return; await api(`/faq/items/${id}`,{method:"DELETE"}); load(); };
  const addCategory = async () => { await api("/faq/categories",{method:"POST",body:JSON.stringify({title:"新分类",icon:"BookOpen",gradient:"from-indigo-500 to-violet-500"})}); load(); };
  const removeCategory = async (id: number) => { if(!confirm("删除分类将同时删除该分类下的所有问题，确认？")) return; await api(`/faq/categories/${id}`,{method:"DELETE"}); load(); };

  return (
    <div>
      <PageHeader icon={CircleHelp} title="帮助中心 FAQ" description="管理帮助中心的分类和常见问题" gradient="from-indigo-500 to-violet-500"/>
      <LocationInfo page="「帮助中心」页面 (/help)" section="FAQ 常见问题" color="indigo"
        description="以分类 + 手风琴形式展示在 /help 页面。每个分类下包含多条问答，分类标题可配图标和渐变色。" />
      {categories.map(cat=>(
        <div key={cat.id} className="mb-8">
          <div className="flex gap-3 mb-4 items-end">
            <div className="flex-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-500 mb-1.5">FAQ 分类</label>
              <input value={cat.title||""} onChange={e=>{const copy=categories.map(c=>c.id===cat.id?{...c,title:e.target.value}:c);setCategories(copy);}}
                className="w-full px-4 py-2.5 border-2 border-indigo-200 rounded-xl font-bold text-slate-900 text-base outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 bg-white"/>
            </div>
            <div className="w-40">
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-500 mb-1.5">图标</label>
              <IconSelect value={cat.icon||"BookOpen"} onChange={v=>{const copy=categories.map(c=>c.id===cat.id?{...c,icon:v}:c);setCategories(copy);}}/>
            </div>
            <InlineSaveBtn onClick={()=>saveCat(cat)} label="保存"/>
            <button onClick={()=>removeCategory(cat.id)} className="px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-xs font-semibold cursor-pointer border-none transition" title="删除分类"><Trash2 size={14}/></button>
          </div>
          <div className="mb-4 ml-0">
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">渐变色</label>
            <input value={cat.gradient||""} onChange={e=>{const copy=categories.map(c=>c.id===cat.id?{...c,gradient:e.target.value}:c);setCategories(copy);}}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 bg-white"/>
          </div>
          {(cat.questions||[]).map((q: any, qi: number)=>(
            <div key={q.id} className="bg-white border border-slate-200 rounded-2xl p-5 mb-3 ml-2 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <span className="inline-flex items-center justify-center min-w-[2rem] h-7 px-2 bg-indigo-500 text-white text-xs font-bold rounded-lg">Q{qi+1}</span>
                <button onClick={()=>removeItem(q.id)} className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-semibold cursor-pointer border-none transition">删除</button>
              </div>
              <Field label="问题" value={q.question} onChange={v=>{
                const copy=categories.map(c=>c.id!==cat.id?c:{...c,questions:c.questions.map((qq:any)=>qq.id===q.id?{...qq,question:v}:qq)});
                setCategories(copy);
              }}/>
              <Field label="答案" value={q.answer} onChange={v=>{
                const copy=categories.map(c=>c.id!==cat.id?c:{...c,questions:c.questions.map((qq:any)=>qq.id===q.id?{...qq,answer:v}:qq)});
                setCategories(copy);
              }} type="textarea" rows={3}/>
              <InlineSaveBtn onClick={()=>saveItem(q)} label="保存此条" size="sm"/>
            </div>
          ))}
          <button onClick={()=>addItem(cat.id)} className="ml-2 mt-1 px-5 py-2 border-2 border-dashed border-slate-300 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 hover:border-slate-400 transition cursor-pointer bg-white">+ 添加问题</button>
        </div>
      ))}
      <button onClick={addCategory} className="px-6 py-2.5 border-2 border-dashed border-indigo-300 text-indigo-600 rounded-xl font-semibold text-sm hover:bg-indigo-50 transition cursor-pointer bg-white">+ 添加分类</button>
    </div>
 

  );
}
// ==================== Pricing Tab ====================
function PricingTab() {
  const [plans, setPlans] = useState<any[] | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loadError, setLoadError] = useState("");
  // 添加套餐模态框
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPlanName, setNewPlanName] = useState("");

  const load = useCallback(() => {
    Promise.all([
      api("/pricing?all=1"),
      api("/products?all=1"),
    ]).then(([pricingData, productsData]) => {
      setPlans(pricingData);
      setProducts(productsData || []);
    }).catch((err: any) => setLoadError(err.message));
  }, []);
  useEffect(() => { load(); }, [load]);
  if (loadError) return <ErrorBox message={loadError}/>;
  if (!plans) return <LoadingBox/>;

  const save = () => {
    const toSave = plans.map((p: any) => ({
      ...p,
      features: Array.isArray(p.features) ? JSON.stringify(p.features) : p.features,
    }));
    return api("/pricing", { method: "PUT", body: JSON.stringify(toSave) });
  };
  const addNew = async () => {
    if (!newPlanName.trim()) return;
    await api("/pricing", { method: "POST", body: JSON.stringify({ product_id: products[0]?.id || "", name: newPlanName.trim(), price: "¥0", period: "/月", description: "", features: [], highlighted: 0, button_text: "立即购买", gradient: "" }) });
    setShowAddModal(false);
    setNewPlanName("");
    load();
  };
  const remove = async (id: number) => {
    if (!confirm("确认删除此套餐？")) return;
    await api(`/pricing/${id}`, { method: "DELETE" });
    load();
  };

  const productMap: Record<string, string> = {};
  products.forEach(p => { productMap[p.id] = p.title; });

  return (
    <div>
      <PageHeader icon={Tag} title="价格方案" description="为每个产品独立设置价格方案，支持添加/删除/显示/隐藏 + 套餐功能列表" gradient="from-amber-500 to-orange-600"/>
      <LocationInfo page="产品中心 (/products)" section="产品详情页底部「价格方案」区域" color="amber"
        description="每个产品独立的价格方案，在 /products 页面切换产品 Tab 后展示对应价格卡片。编辑左侧 features 时按回车添加新行。" />

      {plans.map((plan, i) => (
        <div key={plan.id} className="bg-white border border-slate-200 rounded-2xl p-5 mb-4 shadow-sm">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-amber-100 text-amber-600 text-xs font-bold">{i+1}</span>
              <div className="flex items-center gap-2">
                <select value={plan.product_id || ""} onChange={e => { const c = [...plans]; c[i] = { ...c[i], product_id: e.target.value }; setPlans(c); }}
                  className="border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700 bg-white outline-none focus:border-amber-400 transition font-medium">
                  <option value="">选择产品...</option>
                  {products.map((p: any) => <option key={p.id} value={p.id}>{p.title}</option>)}
                </select>
                {plan.highlighted ? <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full">最受欢迎</span> : null}
                <span className="font-semibold text-slate-800">{plan.name || "未命名"}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <VisibilityToggle visible={!!plan.is_visible} onChange={v => { const c = [...plans]; c[i] = { ...c[i], is_visible: v ? 1 : 0 }; setPlans(c); }}/>
              <button onClick={() => remove(plan.id)} className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-semibold cursor-pointer border-none transition">删除</button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3">
            <Field label="套餐名称" value={plan.name} onChange={v => { const c = [...plans]; c[i] = { ...c[i], name: v }; setPlans(c); }}/>
            <Field label="价格（如 ¥299）" value={plan.price} onChange={v => { const c = [...plans]; c[i] = { ...c[i], price: v }; setPlans(c); }}/>
            <Field label="周期（如 /月）" value={plan.period} onChange={v => { const c = [...plans]; c[i] = { ...c[i], period: v }; setPlans(c); }}/>
            <Field label="按钮文字" value={plan.button_text} onChange={v => { const c = [...plans]; c[i] = { ...c[i], button_text: v }; setPlans(c); }}/>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-500 mb-1">高亮推荐</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={plan.highlighted === 1} onChange={e => { const c = [...plans]; c[i] = { ...c[i], highlighted: e.target.checked ? 1 : 0 }; setPlans(c); }} className="w-4 h-4 rounded accent-indigo-500"/>
                <span className="text-xs text-slate-600">{plan.highlighted ? "是" : "否"}</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1">套餐描述</label>
              <input value={plan.description || ""} onChange={e => { const c = [...plans]; c[i] = { ...c[i], description: e.target.value }; setPlans(c); }} placeholder="方案简要描述"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 bg-white outline-none focus:border-indigo-400 transition"/>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1">渐变色（如 from-indigo-500 to-blue-600）</label>
              <input value={plan.gradient || ""} onChange={e => { const c = [...plans]; c[i] = { ...c[i], gradient: e.target.value }; setPlans(c); }} placeholder="Tailwind gradient class"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 bg-white outline-none focus:border-indigo-400 transition"/>
            </div>
          </div>

          {/* Features list */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <label className="text-xs font-semibold text-slate-500 block mb-2">功能列表</label>
            {(plan.features || []).map((f: string, fi: number) => (
              <div key={fi} className="flex items-center gap-2 mb-1.5">
                <input value={f} onChange={e => {
                  const c = [...plans]; const feats = [...(c[i].features || [])]; feats[fi] = e.target.value; c[i] = { ...c[i], features: feats }; setPlans(c);
                }} placeholder="功能描述" className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 bg-white outline-none focus:border-indigo-400 transition"/>
                <button onClick={() => {
                  const c = [...plans]; const feats = [...(c[i].features || [])]; feats.splice(fi, 1); c[i] = { ...c[i], features: feats }; setPlans(c);
                }} className="p-1 text-red-400 hover:text-red-600 cursor-pointer border-none bg-transparent"><Trash2 size={14}/></button>
              </div>
            ))}
            <button onClick={() => {
              const c = [...plans]; c[i] = { ...c[i], features: [...(c[i].features || []), "新功能"] }; setPlans(c);
            }} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-indigo-600 hover:bg-indigo-50 rounded-lg cursor-pointer border border-dashed border-indigo-200 bg-white mt-1 transition">
              <Plus size={12}/> 添加功能项
            </button>
          </div>
        </div>
      ))}

      <div className="flex gap-3 mt-6">
        <SaveButton onClick={save} label="批量保存"/>
        <button onClick={() => setShowAddModal(true)} className="px-6 py-2.5 border-2 border-dashed border-amber-300 text-amber-600 rounded-xl font-semibold text-sm hover:bg-amber-50 transition cursor-pointer bg-white">+ 添加套餐</button>
      </div>

      {/* 添加套餐模态框 */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>添加新价格方案</DialogTitle>
            <DialogDescription>为产品创建一个新的定价方案/套餐</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">套餐名称</label>
              <input
                value={newPlanName}
                onChange={e => setNewPlanName(e.target.value)}
                placeholder="如 入门版、专业版、企业版"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:ring-2 focus:ring-amber-100 focus:border-amber-400 bg-white"
                onKeyDown={e => { if (e.key === "Enter") addNew(); }}
              />
            </div>
            <p className="text-xs text-muted-foreground">创建后可编辑价格、周期、功能列表、归属产品等详细信息。</p>
          </div>
          <DialogFooter>
            <button onClick={() => setShowAddModal(false)} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm hover:bg-slate-50 cursor-pointer transition">取消</button>
            <button onClick={addNew} disabled={!newPlanName.trim()} className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-sm hover:opacity-90 cursor-pointer transition disabled:opacity-40 disabled:cursor-not-allowed">
              <Plus size={14} className="inline mr-1"/> 确认添加
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
 

  );
}
// ==================== Product Features Tab ====================
function ProductFeaturesTab() {
  const [features, setFeatures] = useState<any[] | null>(null);
  const [loadError, setLoadError] = useState("");
  // 添加功能模态框
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFeatTitle, setNewFeatTitle] = useState("");

  const load = useCallback(() => {
    api("/product-features").then(setFeatures).catch((err: any) => setLoadError(err.message));
  }, []);
  useEffect(() => { load(); }, [load]);
  if (loadError) return <ErrorBox message={loadError}/>;
  if (!features) return <LoadingBox/>;

  const save = () => api("/product-features", { method: "PUT", body: JSON.stringify(features) });
  const addNew = async () => {
    if (!newFeatTitle.trim()) return;
    await api("/product-features", { method: "POST", body: JSON.stringify({ icon: "Star", title: newFeatTitle.trim(), description: "", gradient: "", category: "通用" }) });
    setShowAddModal(false);
    setNewFeatTitle("");
    load();
  };
  const remove = async (id: number) => {
    if (!confirm("确认删除此功能？")) return;
    await api(`/product-features/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div>
      <PageHeader icon={Sparkles} title="产品亮点" description="管理首页「产品亮点」区块，按分类分组展示，支持添加/删除/修改" gradient="from-violet-500 to-purple-600"/>
      <LocationInfo page="首页 → 产品亮点" section="产品特性分组展示" color="violet"
        description="按分类（云手机/沙箱/应用分身）分组展示，每张卡片含图标、标题、描述。" />

      {features.map((feat, i) => (
        <div key={feat.id} className="bg-white border border-slate-200 rounded-2xl p-5 mb-3 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-violet-100 text-violet-600 text-xs font-bold">{i+1}</span>
              <span className="font-medium text-slate-700 text-sm">{feat.title || "未命名"}</span>
              <input value={feat.category || ""} onChange={e => { const c = [...features]; c[i] = { ...c[i], category: e.target.value }; setFeatures(c); }}
                placeholder="分类" className="w-24 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-600 bg-slate-50 outline-none focus:border-violet-400 transition"/>
              <input type="number" value={feat.sort_order ?? i+1} onChange={e => { const c = [...features]; c[i] = { ...c[i], sort_order: parseInt(e.target.value) || 0 }; setFeatures(c); }}
                placeholder="排序" className="w-16 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-600 bg-slate-50 outline-none focus:border-violet-400 transition"/>
            </div>
            <div className="flex items-center gap-2">
              <VisibilityToggle visible={!!feat.is_visible} onChange={v => { const c = [...features]; c[i] = { ...c[i], is_visible: v ? 1 : 0 }; setFeatures(c); }}/>
              <button onClick={() => remove(feat.id)} className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-semibold cursor-pointer border-none transition">
                <Trash2 size={14}/>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Field label="图标 (Lucide)" value={feat.icon} onChange={v => { const c = [...features]; c[i] = { ...c[i], icon: v }; setFeatures(c); }}/>
            <Field label="标题" value={feat.title} onChange={v => { const c = [...features]; c[i] = { ...c[i], title: v }; setFeatures(c); }}/>
            <div className="md:col-span-2 flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-500">描述</label>
              <input value={feat.description || ""} onChange={e => { const c = [...features]; c[i] = { ...c[i], description: e.target.value }; setFeatures(c); }}
                placeholder="功能描述" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 bg-white outline-none focus:border-violet-400 transition"/>
            </div>
          </div>
          <div className="mt-2">
            <label className="text-xs text-slate-400">渐变色</label>
            <input value={feat.gradient || ""} onChange={e => { const c = [...features]; c[i] = { ...c[i], gradient: e.target.value }; setFeatures(c); }}
              placeholder="如 from-indigo-500 to-blue-500" className="ml-2 w-64 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-600 bg-white outline-none focus:border-violet-400 transition"/>
          </div>
        </div>
      ))}

      <div className="flex gap-3 mt-6">
        <SaveButton onClick={save} label="批量保存"/>
        <button onClick={() => setShowAddModal(true)} className="px-6 py-2.5 border-2 border-dashed border-violet-300 text-violet-600 rounded-xl font-semibold text-sm hover:bg-violet-50 transition cursor-pointer bg-white">+ 添加功能</button>
      </div>

      {/* 添加功能模态框 */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>添加产品亮点</DialogTitle>
            <DialogDescription>为首页「产品亮点」区块添加一条新的功能特性</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">功能名称</label>
              <input
                value={newFeatTitle}
                onChange={e => setNewFeatTitle(e.target.value)}
                placeholder="如 10秒快速启动、独立IP环境"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:ring-2 focus:ring-violet-100 focus:border-violet-400 bg-white"
                onKeyDown={e => { if (e.key === "Enter") addNew(); }}
              />
            </div>
          </div>
          <DialogFooter>
            <button onClick={() => setShowAddModal(false)} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm hover:bg-slate-50 cursor-pointer transition">取消</button>
            <button onClick={addNew} disabled={!newFeatTitle.trim()} className="px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl text-sm hover:opacity-90 cursor-pointer transition disabled:opacity-40 disabled:cursor-not-allowed">
              <Plus size={14} className="inline mr-1"/> 确认添加
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
 

  );
}
// ==================== Themes Tab ====================
function ThemesTab() {
  const [themes, setThemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try { setThemes(await api("/themes")); setError(""); }
    catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const save = async (id: number, name: string, tokens: any) => {
    await api("/themes", { method: "PUT", body: JSON.stringify([{ id, name, tokens }]) });
    load();
  };
  const setDefault = async (id: number) => {
    // First unset all defaults, then set the new one
    const allThemes = await api("/themes");
    const updates = (allThemes || []).map((t: any) => ({
      id: t.id,
      is_default: t.id === id ? 1 : 0,
      name: t.name,
      tokens: typeof t.tokens === 'string' ? t.tokens : JSON.stringify(t.tokens || {})
    }));
    await api("/themes", { method: "PUT", body: JSON.stringify(updates) });
    load();
  };
  const add = async () => {
    await api("/themes", { method: "POST", body: JSON.stringify({ name: newName, tokens: {} }) });
    setNewName(""); setDialogOpen(false); load();
  };

  if (loading) return <LoadingBox />;
  if (error) return <ErrorBox message={error} />;
  return (
    <div>
      <PageHeader icon={Palette} title="主题管理" description="管理网站主题，创建和编辑色彩方案" gradient="from-purple-500 to-pink-500" />
      <LocationInfo page="全局" section="主题切换" color="purple"
        description="用户在导航栏点击太阳/月亮图标切换主题。当前支持「暗色模式」和「亮色模式」两套配色，通过 CSS 变量统一控制全站颜色。" />
      <CardWrapper>
        <div className="flex items-center justify-between mb-4">
          <SectionTitle icon={Palette} title="主题列表" iconColor="primary" />
          <button onClick={() => setDialogOpen(true)} className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition cursor-pointer border-none">
            <Plus size={15} /> 新增主题
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {themes.map((theme) => (
            <div key={theme.id} className={`border rounded-xl p-4 ${theme.is_default ? "border-purple-300 bg-purple-50" : "border-slate-200"}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-slate-800">{theme.name} {theme.is_default === 1 && <span className="text-xs text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full ml-2">默认</span>}</span>
                <div className="flex gap-1.5">
                  {theme.is_default !== 1 && <button onClick={() => setDefault(theme.id)} className="text-xs px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg transition cursor-pointer border-none text-slate-600">设为默认</button>}
                </div>
              </div>
              <div className="flex gap-1 flex-wrap">
                {Object.entries(typeof theme.tokens === "string" ? JSON.parse(theme.tokens || "{}") : (theme.tokens || {})).slice(0, 8).map(([k, v]) => (
                  <span key={k} className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-white rounded-full border border-slate-200" title={`${k}: ${v}`}>
                    <span className="w-3 h-3 rounded-full border border-slate-300" style={{ background: `hsl(${v})` }} />{k}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardWrapper>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent><DialogHeader><DialogTitle>新增主题</DialogTitle></DialogHeader>
          <Field label="主题名称" value={newName} onChange={setNewName} placeholder="例如：海洋蓝" />
          <DialogFooter><button onClick={add} className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm font-semibold cursor-pointer border-none" disabled={!newName}>创建</button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
 

  );
}
// ==================== Languages Tab ====================
function LanguagesTab() {
  const [langs, setLangs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api("/languages?all=1").then(setLangs).finally(() => setLoading(false)); }, []);

  const toggleVisible = async (code: string, vis: number) => {
    const updated = langs.map(l => l.code === code ? { ...l, is_visible: vis } : l);
    await api("/languages", { method: "PUT", body: JSON.stringify(updated) });
    setLangs(updated);
  };
  const setAsDefault = async (code: string) => {
    const updated = langs.map(l => ({ ...l, is_default: l.code === code ? 1 : 0 }));
    await api("/languages", { method: "PUT", body: JSON.stringify(updated) });
    setLangs(updated);
  };

  if (loading) return <LoadingBox />;
  return (
    <div>
      <PageHeader icon={Languages} title="语言设置" description="管理网站支持的多语言版本" gradient="from-cyan-500 to-blue-500" />
      <LocationInfo page="全局" section="语言切换" color="cyan"
        description="用户在导航栏点击 Globe 图标切换语言。支持中文/英文双语，切换后全站文本（导航、按钮、提示）同步翻译。" />
      <CardWrapper>
        <SectionTitle icon={Languages} title="已配置语言" iconColor="info" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {langs.map((lang) => (
            <div key={lang.code} className={`border rounded-xl p-4 ${lang.is_default ? "border-cyan-300 bg-cyan-50" : "border-slate-200"}`}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="font-semibold text-slate-800 block">{lang.native_name}</span>
                  <span className="text-xs text-slate-400">{lang.name} ({lang.code})</span>
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <VisibilityToggle visible={!!lang.is_visible} onChange={(v) => toggleVisible(lang.code, v ? 1 : 0)} />
                {lang.is_default !== 1 && <button onClick={() => setAsDefault(lang.code)} className="text-xs px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg transition cursor-pointer border-none text-slate-600">设为默认</button>}
              </div>
            </div>
          ))}
        </div>
      </CardWrapper>
    </div>
 

  );
}
// ==================== Media Library Tab ====================
function MediaTab() {
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploadMsg, setUploadMsg] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try { setMedia(await api("/media")); setError(""); }
    catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadMsg("上传中...");
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(",")[1];
      try {
        await api("/media/upload", { method: "POST", body: JSON.stringify({ filename: file.name, data: base64, mime_type: file.type, folder: "" }) });
        setUploadMsg("上传成功！");
        load();
      } catch (err: any) { setUploadMsg("上传失败: " + err.message); }
    };
    reader.readAsDataURL(file);
  };

  const del = async (id: number) => {
    if (!confirm("确认删除此文件？")) return;
    await api(`/media/${id}`, { method: "DELETE" });
    load();
  };

  if (loading) return <LoadingBox />;
  if (error) return <ErrorBox message={error} />;
  return (
    <div>
      <PageHeader icon={FolderOpen} title="媒体库" description="管理上传的图片、文件等媒体资源" gradient="from-emerald-500 to-teal-500" />
      <LocationInfo page="全站" section="图片资源" color="teal"
        description="上传的图片可在文章、案例、轮播图、自定义页面中引用。支持在编辑器中通过 /uploads/文件名 路径引用。" />
      <CardWrapper>
        <div className="flex items-center justify-between mb-4">
          <SectionTitle icon={Image} title="文件列表" iconColor="success" />
          <label className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition cursor-pointer">
            <Upload size={15} /> 上传文件
            <input type="file" onChange={handleUpload} className="hidden" />
          </label>
        </div>
        {uploadMsg && <p className={`mb-4 text-sm px-4 py-2 rounded-lg ${uploadMsg.includes("成功") ? "bg-emerald-50 text-emerald-600" : uploadMsg.includes("失败") ? "bg-red-50 text-red-600" : "bg-slate-100 text-slate-600"}`}>{uploadMsg}</p>}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {media.map((m) => (
            <div key={m.id} className="border border-slate-200 rounded-xl overflow-hidden group relative">
              <div className="aspect-square bg-slate-100 flex items-center justify-center overflow-hidden">
                {m.mime_type?.startsWith("image/") ? (
                  <img src={`/uploads/${m.filename}`} alt={m.original_name} className="w-full h-full object-cover" />
                ) : (
                  <FileText size={40} className="text-slate-300" />
                )}
              </div>
              <div className="p-2">
                <p className="text-xs text-slate-600 truncate" title={m.original_name}>{m.original_name}</p>
                <p className="text-[10px] text-slate-400">{Math.round(m.size / 1024)} KB</p>
              </div>
              <button onClick={() => del(m.id)} className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs flex items-center justify-center cursor-pointer border-none shadow-sm" title="删除文件">
                <X size={12} />
              </button>
            </div>
          ))}
          {media.length === 0 && <p className="text-sm text-slate-400 col-span-full text-center py-8">暂无文件，点击上传按钮添加</p>}
        </div>
      </CardWrapper>
    </div>
 

  );
}
// ==================== Inquiries Tab ====================
function InquiriesTab() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(await api("/inquiries")); setError(""); }
    catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: number, status: string) => {
    await api("/inquiries", { method: "PUT", body: JSON.stringify([{ id, status }]) });
    load();
  };
  const del = async (id: number) => {
    if (!confirm("确认删除此询单？")) return;
    await api(`/inquiries/${id}`, { method: "DELETE" });
    load();
  };

  const statusBadge = (s: string) => {
    const map: Record<string, string> = { pending: "bg-amber-100 text-amber-700", replied: "bg-blue-100 text-blue-700", closed: "bg-slate-100 text-slate-500" };
    const label: Record<string, string> = { pending: "待处理", replied: "已回复", closed: "已关闭" };
    return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${map[s] || map.pending}`}>{label[s] || s}</span>;
  };

  if (loading) return <LoadingBox />;
  if (error) return <ErrorBox message={error} />;
  return (
    <div>
      <PageHeader icon={Mail} title="询单留言" description="查看和管理用户提交的产品咨询和留言" gradient="from-amber-500 to-orange-500" />
      <LocationInfo page="「联系我们」页面 (/contact)" section="留言表单" color="amber"
        description="用户在 /contact 页面底部填写并提交留言表单后，数据出现在此处。支持标记状态（待处理→已回复→已关闭）并删除。" />
      <CardWrapper>
        <SectionTitle icon={MessageSquare} title="留言列表" iconColor="warning" />
        {items.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">暂无询单留言</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-slate-200 text-left text-slate-500">
                <th className="pb-3 font-medium">姓名</th><th className="pb-3 font-medium">邮箱</th><th className="pb-3 font-medium">公司</th><th className="pb-3 font-medium">留言</th><th className="pb-3 font-medium">状态</th><th className="pb-3 font-medium">时间</th><th className="pb-3 font-medium">操作</th>
              </tr></thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 text-slate-800">{item.name || "-"}</td>
                    <td className="py-3 text-slate-600">{item.email || "-"}</td>
                    <td className="py-3 text-slate-600">{item.company || "-"}</td>
                    <td className="py-3 text-slate-600 max-w-[200px] truncate">{item.message}</td>
                    <td className="py-3">{statusBadge(item.status)}</td>
                    <td className="py-3 text-xs text-slate-400">{item.created_at?.slice(0, 10)}</td>
                    <td className="py-3">
                      <div className="flex gap-1">
                        <select value={item.status} onChange={(e) => updateStatus(item.id, e.target.value)}
                          className="text-xs border border-slate-200 rounded px-2 py-1 bg-white text-slate-800 cursor-pointer">
                          <option value="pending">待处理</option><option value="replied">已回复</option><option value="closed">已关闭</option>
                        </select>
                        <button onClick={() => del(item.id)} className="text-xs text-red-500 hover:text-red-700 cursor-pointer border-none bg-transparent">删除</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardWrapper>
    </div>
 

  );
}
// ==================== Categories Tab ====================
function CategoriesTab() {
  const [cats, setCats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [type, setType] = useState("product");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newParent, setNewParent] = useState("");
  // Edit category
  const [editingCat, setEditingCat] = useState<number | null>(null);
  const [editCatName, setEditCatName] = useState("");
  const [editCatSlug, setEditCatSlug] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try { setCats(await api(`/categories?type=${type}`)); setError(""); }
    catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }, [type]);
  useEffect(() => { load(); }, [load]);

  const add = async () => {
    await api("/categories", { method: "POST", body: JSON.stringify({ name: newName, slug: newSlug || newName.toLowerCase().replace(/\s+/g, "-"), parent_id: newParent || null, type }) });
    setNewName(""); setNewSlug(""); setNewParent(""); setDialogOpen(false); load();
  };
  const del = async (id: number) => {
    if (!confirm("确认删除此分类？")) return;
    await api(`/categories/${id}`, { method: "DELETE" });
    load();
  };
  const startEdit = (c: any) => { setEditingCat(c.id); setEditCatName(c.name); setEditCatSlug(c.slug || ""); };
  const saveEdit = async (id: number) => {
    await api("/categories", { method: "PUT", body: JSON.stringify([{ id, name: editCatName, slug: editCatSlug }]) });
    setEditingCat(null); load();
  };
  const cancelEdit = () => setEditingCat(null);

  const renderTree = (parentId: number | null, depth = 0): any => {
    return cats
      .filter(c => (parentId === null ? !c.parent_id : c.parent_id === parentId))
      .map(c => (
        <div key={c.id}>
          <div className="flex items-center justify-between py-2 px-3 hover:bg-slate-50 rounded-lg group" style={{ paddingLeft: `${16 + depth * 24}px` }}>
            {editingCat === c.id ? (
              <div className="flex items-center gap-2 flex-1">
                <input value={editCatName} onChange={e => setEditCatName(e.target.value)} className="px-2 py-1 border border-slate-300 rounded-lg text-sm text-slate-800 w-40 bg-white outline-none focus:border-teal-400" autoFocus />
                <input value={editCatSlug} onChange={e => setEditCatSlug(e.target.value)} className="px-2 py-1 border border-slate-300 rounded-lg text-xs text-slate-500 w-32 bg-white outline-none" placeholder="slug" />
                <button onClick={() => saveEdit(c.id)} className="text-xs px-2 py-1 bg-teal-500 text-white rounded-lg cursor-pointer border-none">保存</button>
                <button onClick={cancelEdit} className="text-xs px-2 py-1 bg-slate-200 text-slate-600 rounded-lg cursor-pointer border-none">取消</button>
              </div>
            ) : (
              <>
                <span className="text-sm text-slate-700 font-medium">{c.name} <span className="text-xs text-slate-400 ml-1">({c.slug})</span></span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button onClick={() => startEdit(c)} className="text-xs text-indigo-400 hover:text-indigo-600 cursor-pointer border-none bg-transparent">编辑</button>
                  <button onClick={() => del(c.id)} className="text-xs text-red-400 hover:text-red-600 cursor-pointer border-none bg-transparent">删除</button>
                </div>
              </>
            )}
          </div>
          {renderTree(c.id, depth + 1)}
        </div>
      ));
  };

  if (loading) return <LoadingBox />;
  if (error) return <ErrorBox message={error} />;
  return (
    <div>
      <PageHeader icon={ListTree} title="分类管理" description="管理产品和文章的分类体系" gradient="from-teal-500 to-emerald-500" />
      <LocationInfo page="产品中心 & 文章中心" section="分类筛选" color="teal"
        description="产品分类用于 Admin「产品列表」中为产品指定分类；文章分类用于 Admin「文章/案例」中为文章指定分类。前端可按分类筛选展示。" />
      <CardWrapper>
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            <button onClick={() => setType("product")} className={`px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer border-none ${type === "product" ? "bg-teal-100 text-teal-700" : "bg-slate-100 text-slate-500"}`}>产品分类</button>
            <button onClick={() => setType("post")} className={`px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer border-none ${type === "post" ? "bg-teal-100 text-teal-700" : "bg-slate-100 text-slate-500"}`}>文章分类</button>
          </div>
          <button onClick={() => setDialogOpen(true)} className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition cursor-pointer border-none">
            <Plus size={15} /> 新增分类
          </button>
        </div>
        {cats.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">暂无分类</p>
        ) : (
          <div className="border border-slate-200 rounded-xl divide-y divide-slate-100">{renderTree(null)}</div>
        )}
      </CardWrapper>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent><DialogHeader><DialogTitle>新增{type === "product" ? "产品" : "文章"}分类</DialogTitle></DialogHeader>
          <Field label="分类名称" value={newName} onChange={setNewName} placeholder="例如：云手机" />
          <Field label="URL Slug（可选）" value={newSlug} onChange={setNewSlug} placeholder="cloud-phone" />
          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">父级分类（可选）</label>
            <select value={newParent} onChange={e => setNewParent(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 bg-white">
              <option value="">无（顶级分类）</option>
              {cats.filter(c => !c.parent_id).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <DialogFooter><button onClick={add} className="px-6 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl text-sm font-semibold cursor-pointer border-none" disabled={!newName}>创建</button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
 

  );
}
// ==================== Sliders Tab ====================
function SlidersTab() {
  const [sliders, setSliders] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [activeSlider, setActiveSlider] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  // Add slider modal
  const [showAddSlider, setShowAddSlider] = useState(false);
  const [newSliderName, setNewSliderName] = useState("");
  const [newSliderSlug, setNewSliderSlug] = useState("");
  // Add/edit item modal
  const [showEditItem, setShowEditItem] = useState(false);
  const [editItemForm, setEditItemForm] = useState({ id: null as number|null, image: "", title: "", subtitle: "", link_url: "", link_text: "", sort_order: 0 });

  const loadSliders = useCallback(() => { api("/sliders").then(setSliders).finally(() => setLoading(false)); }, []);
  useEffect(() => { loadSliders(); }, [loadSliders]);

  const delSlider = async (id: number) => {
    if (!confirm("删除轮播组会同时删除其中的所有轮播项，确认？")) return;
    await api(`/sliders/${id}`, { method: "DELETE" });
    if (activeSlider === id) { setActiveSlider(null); setItems([]); }
    loadSliders();
  };

  const loadItems = async (sliderId: number) => {
    setActiveSlider(sliderId);
    const all = await api("/slider-items");
    setItems((all || []).filter((it: any) => it.slider_id === sliderId));
  };

  const addSlider = async () => {
    if (!newSliderName.trim()) return;
    await api("/sliders", { method: "POST", body: JSON.stringify({ name: newSliderName.trim(), slug: newSliderSlug.trim() || newSliderName.trim().toLowerCase().replace(/\s+/g, "-") }) });
    setShowAddSlider(false); setNewSliderName(""); setNewSliderSlug(""); loadSliders();
  };

  const openNewItem = () => {
    setEditItemForm({ id: null, image: "", title: "", subtitle: "", link_url: "", link_text: "", sort_order: items.length });
    setShowEditItem(true);
  };
  const openEditItem = (item: any) => {
    setEditItemForm({ id: item.id, image: item.image || "", title: item.title || "", subtitle: item.subtitle || "", link_url: item.link_url || "", link_text: item.link_text || "", sort_order: item.sort_order || 0 });
    setShowEditItem(true);
  };
  const saveItem = async () => {
    if (!activeSlider) return;
    if (editItemForm.id) {
      await api("/slider-items", { method: "PUT", body: JSON.stringify([editItemForm]) });
    } else {
      await api("/slider-items", { method: "POST", body: JSON.stringify({ slider_id: activeSlider, ...editItemForm }) });
    }
    setShowEditItem(false); loadItems(activeSlider);
  };
  const delItem = async (id: number) => {
    if (!confirm("删除此轮播项？")) return;
    await api(`/slider-items/${id}`, { method: "DELETE" });
    if (activeSlider) loadItems(activeSlider);
  };

  if (loading) return <LoadingBox />;
  return (
    <div>
      <PageHeader icon={SlidersHorizontal} title="轮播图管理" description="管理首页和其他页面的轮播图内容" gradient="from-blue-500 to-cyan-500" />
      <LocationInfo page="首页 & 各页面顶部" section="图片轮播" color="sky"
        description="创建轮播组后添加轮播项（图片 + 标题 + 链接）。轮播图显示在对应页面顶部，自动轮播，支持点击跳转。" />
      <CardWrapper>
        <div className="flex items-center justify-between mb-4">
          <SectionTitle icon={SlidersHorizontal} title="轮播组列表" iconColor="info" />
          <button onClick={() => setShowAddSlider(true)} className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-semibold hover:opacity-90 cursor-pointer border-none">
            <Plus size={15} /> 新增轮播组
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {sliders.map(s => (
            <button key={s.id} onClick={() => loadItems(s.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer border-none flex items-center gap-2 ${activeSlider === s.id ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
              {s.name}
              <span onClick={(e: any) => { e.stopPropagation(); delSlider(s.id); }} className="text-red-400 hover:text-red-600" title="删除轮播组"><X size={14} /></span>
            </button>
          ))}
          {sliders.length === 0 && <p className="text-sm text-slate-400">暂无轮播组，点击上方按钮创建</p>}
        </div>
        {activeSlider && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-800 text-sm">轮播项列表 ({items.length})</h3>
              <button onClick={openNewItem} className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-100 cursor-pointer border-none">
                <Plus size={13} /> 添加轮播项
              </button>
            </div>
            {items.length === 0 ? (
              <p className="text-sm text-slate-400 py-4">暂无轮播项，点击上方按钮添加</p>
            ) : (
              <div className="space-y-3">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-4 p-3 border border-slate-200 rounded-xl hover:border-blue-300 cursor-pointer" onClick={() => openEditItem(item)}>
                    <div className="w-20 h-14 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image ? <img src={item.image.startsWith("http") ? item.image : `/uploads/${item.image}`} alt="" className="w-full h-full object-cover" /> : <Image size={20} className="text-slate-300 m-auto" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{item.title || "无标题"}</p>
                      <p className="text-xs text-slate-400 truncate">{item.subtitle || "无副标题"}</p>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); delItem(item.id); }} className="text-xs text-red-400 hover:text-red-600 cursor-pointer border-none bg-transparent">删除</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardWrapper>

      {/* Add Slider Modal */}
      <Dialog open={showAddSlider} onOpenChange={setShowAddSlider}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>新增轮播组</DialogTitle><DialogDescription>创建轮播组后可向其中添加轮播图片项</DialogDescription></DialogHeader>
          <div className="space-y-4 py-2">
            <Field label="轮播组名称" value={newSliderName} onChange={setNewSliderName} placeholder="如：首页轮播" />
            <Field label="Slug（英文标识）" value={newSliderSlug} onChange={setNewSliderSlug} placeholder="如 home-slider，留空自动生成" />
          </div>
          <DialogFooter>
            <button onClick={() => setShowAddSlider(false)} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm cursor-pointer">取消</button>
            <button onClick={addSlider} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-semibold cursor-pointer border-none" disabled={!newSliderName.trim()}>创建</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Item Modal */}
      <Dialog open={showEditItem} onOpenChange={setShowEditItem}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>{editItemForm.id ? "编辑" : "新增"}轮播项</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <Field label="图片 URL *" value={editItemForm.image} onChange={v => setEditItemForm(f => ({...f, image: v}))} placeholder="https:// 或 /uploads/xxx.jpg" />
            <Field label="标题" value={editItemForm.title} onChange={v => setEditItemForm(f => ({...f, title: v}))} />
            <Field label="副标题" value={editItemForm.subtitle} onChange={v => setEditItemForm(f => ({...f, subtitle: v}))} />
            <div className="grid grid-cols-2 gap-4">
              <Field label="链接地址" value={editItemForm.link_url} onChange={v => setEditItemForm(f => ({...f, link_url: v}))} placeholder="点击跳转的 URL" />
              <Field label="链接文字" value={editItemForm.link_text} onChange={v => setEditItemForm(f => ({...f, link_text: v}))} placeholder="如：了解更多" />
            </div>
          </div>
          <DialogFooter>
            <button onClick={() => setShowEditItem(false)} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm cursor-pointer">取消</button>
            <button onClick={saveItem} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-semibold cursor-pointer border-none" disabled={!editItemForm.image.trim()}>{editItemForm.id ? "保存" : "添加"}</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
 

  );
}
// ==================== Posts Tab ====================
// ==================== Category selector for posts ====================
function CategorySelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [cats, setCats] = useState<any[]>([]);
  useEffect(() => { api('/categories?type=post').then(setCats).catch(() => {}); }, []);
  return (
    <select value={value || ''} onChange={e => onChange(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 bg-white outline-none">
      <option value="">无分类</option>
      {cats.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
    </select>
 


  );
}
function PostsTab() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [type, setType] = useState("post");
  const [editing, setEditing] = useState<any>(null);
  const [editForm, setEditForm] = useState({ title: "", slug: "", cover: "", summary: "", content: "", type: "post", category_id: "", status: "draft", meta_title: "", meta_description: "" });

  const load = useCallback(async () => { setLoading(true); try { const all = await api("/posts"); setPosts((all || []).filter((p: any) => p.type === type)); setError(""); } catch (e: any) { setError(e.message); } finally { setLoading(false); } }, [type]);
  useEffect(() => { load(); }, [load]);

  const openNew = () => { setEditing("new"); setEditForm({ title: "", slug: "", cover: "", summary: "", content: "", type, category_id: "", status: "draft", meta_title: "", meta_description: "" }); };
  const openEdit = (p: any) => { setEditing(p.id); setEditForm({ title: p.title||"", slug: p.slug||"", cover: p.cover||"", summary: p.summary||"", content: p.content||"", type: p.type||"post", category_id: p.category_id||"", status: p.status||"draft", meta_title: p.meta_title||"", meta_description: p.meta_description||"" }); };
  const save = async () => { if(!editForm.title.trim())return; const raw=editForm.slug||editForm.title.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"").replace(/-+/g,"-"); const slug=(raw&&raw.length>1&&!/^\d+$/.test(raw))?raw:"post-"+Date.now(); const payload = {...editForm, slug}; if(editing==="new")await api("/posts",{method:"POST",body:JSON.stringify(payload)}); else await api("/posts",{method:"PUT",body:JSON.stringify([{...payload, id: editing}])}); setEditing(null);load(); };
  const del = async (id: number) => { if(!confirm("确认删除？"))return; await api("/posts/"+id,{method:"DELETE"}); load(); };
  const toggleStatus = async (id: number, s: string) => { await api("/posts",{method:"PUT",body:JSON.stringify([{id,status:s}])}); load(); };

  if(loading) return <LoadingBox/>;
  if(error) return <ErrorBox message={error}/>;
  return (<div><PageHeader icon={BookOpen} title="文章/案例管理" description="管理博客文章和客户案例" gradient="from-violet-500 to-purple-500"/><LocationInfo page="文章中心 (/posts)" section="文章列表与详情" color="violet" description="已发布文章显示在 /posts 页面。"/><CardWrapper><div className="flex items-center justify-between mb-4"><div className="flex gap-2"><button onClick={()=>setType("post")} className={"px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer border-none "+(type==="post"?"bg-violet-100 text-violet-700":"bg-slate-100 text-slate-500")}>文章</button><button onClick={()=>setType("case")} className={"px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer border-none "+(type==="case"?"bg-violet-100 text-violet-700":"bg-slate-100 text-slate-500")}>案例</button></div><button onClick={openNew} className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl text-sm font-semibold hover:opacity-90 cursor-pointer border-none"><Plus size={15}/>新增{type==="post"?"文章":"案例"}</button></div>{posts.length===0?<p className="text-sm text-slate-400 text-center py-8">暂无{type==="post"?"文章":"案例"}</p>:<div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-slate-200 text-left text-slate-500"><th className="pb-3 font-medium">标题</th><th className="pb-3 font-medium">Slug</th><th className="pb-3 font-medium">状态</th><th className="pb-3 font-medium">时间</th><th className="pb-3 font-medium">操作</th></tr></thead><tbody>{posts.map(p=>(<tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50"><td className="py-3"><button onClick={()=>openEdit(p)} className="text-slate-800 hover:text-violet-600 text-left cursor-pointer bg-transparent border-none p-0 font-medium max-w-[200px] truncate block">{p.title}</button></td><td className="py-3 text-xs text-slate-400 font-mono">{p.slug||"-"}</td><td className="py-3"><select value={p.status} onChange={e=>toggleStatus(p.id,e.target.value)} className="text-xs border border-slate-200 rounded px-2 py-1 bg-white text-slate-800 cursor-pointer"><option value="draft">草稿</option><option value="published">已发布</option></select></td><td className="py-3 text-xs text-slate-400">{p.created_at?.slice(0,10)}</td><td className="py-3 flex gap-2"><button onClick={()=>openEdit(p)} className="text-xs text-indigo-500 hover:text-indigo-700 cursor-pointer border-none bg-transparent">编辑</button><button onClick={()=>del(p.id)} className="text-xs text-red-400 hover:text-red-600 cursor-pointer border-none bg-transparent">删除</button></td></tr>))}</tbody></table></div>}</CardWrapper><Dialog open={editing!==null} onOpenChange={()=>setEditing(null)}><DialogContent className="sm:max-w-2xl"><DialogHeader><DialogTitle>{editing==="new"?"新建":"编辑"}{type==="post"?"文章":"案例"}</DialogTitle></DialogHeader><div className="space-y-4"><div className="grid grid-cols-2 gap-4"><Field label="标题 *" value={editForm.title} onChange={v=>setEditForm(f=>({...f,title:v}))}/><Field label="URL Slug" value={editForm.slug} onChange={v=>setEditForm(f=>({...f,slug:v}))} placeholder="留空自动生成"/></div><Field label="封面图URL" value={editForm.cover} onChange={v=>setEditForm(f=>({...f,cover:v}))} placeholder="https://..."/><Field label="摘要" value={editForm.summary} onChange={v=>setEditForm(f=>({...f,summary:v}))} placeholder="简短描述" type="textarea" rows={2}/><div><label className="block text-sm font-semibold text-slate-700 mb-1.5">正文（支持 HTML）</label><textarea value={editForm.content||""} onChange={e=>setEditForm(f=>({...f,content:e.target.value}))} rows={8} placeholder="<h2>标题</h2><p>内容...</p>" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 bg-white outline-none resize-vertical font-mono"/></div><div className="grid grid-cols-2 gap-4"><Field label="Meta 标题" value={editForm.meta_title||""} onChange={v=>setEditForm(f=>({...f,meta_title:v}))}/><Field label="Meta 描述" value={editForm.meta_description||""} onChange={v=>setEditForm(f=>({...f,meta_description:v}))}/></div><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-semibold text-slate-700 mb-1.5">发布状态</label><select value={editForm.status} onChange={e=>setEditForm(f=>({...f,status:e.target.value}))} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 bg-white"><option value="draft">草稿</option><option value="published">已发布</option></select></div><CategorySelect value={editForm.category_id} onChange={v=>setEditForm(f=>({...f,category_id:v}))}/></div></div><DialogFooter><button onClick={()=>setEditing(null)} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm cursor-pointer">取消</button><button onClick={save} disabled={!editForm.title.trim()} className="px-6 py-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl text-sm font-semibold cursor-pointer border-none disabled:opacity-40">{editing==="new"?"创建":"保存"}</button></DialogFooter></DialogContent></Dialog></div>);
}

// ==================== Pages Tab ====================
function PagesTab() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<any>(null);
  const [editForm, setEditForm] = useState({ title: "", slug: "", content: "", meta_title: "", meta_description: "", status: "draft" });

  const load = useCallback(async () => {
    setLoading(true); try { setPages(await api("/pages")); setError(""); }
    catch (e: any) { setError(e.message); } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const openNew = () => { setEditing("new"); setEditForm({ title: "", slug: "", content: "", meta_title: "", meta_description: "", status: "draft" }); };
  const openEdit = (p: any) => { setEditing(p.id); setEditForm({ title: p.title||"", slug: p.slug||"", content: p.content||"", meta_title: p.meta_title||"", meta_description: p.meta_description||"", status: p.status||"draft" }); };
  const save = async () => {
    if (!editForm.title.trim()) return;
    const raw = editForm.slug || editForm.title.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"").replace(/-+/g,"-");
    const slug = (raw && raw.length>1 && !/^\d+$/.test(raw)) ? raw : "page-"+Date.now();
    if (editing==="new") await api("/pages",{method:"POST",body:JSON.stringify({...editForm,slug})});
    else await api("/pages/"+editing,{method:"PUT",body:JSON.stringify({...editForm,slug})});
    setEditing(null); load();
  };
  const del = async (id: number) => { if(!confirm("确认删除？"))return; await api("/pages/"+id,{method:"DELETE"}); load(); };
  const toggleStatus = async (id: number, s: string) => { await api("/pages/"+id,{method:"PUT",body:JSON.stringify({status:s})}); load(); };

  if(loading) return <LoadingBox/>;
  if(error) return <ErrorBox message={error}/>;
  return (<div>
    <PageHeader icon={FileText} title="自定义页面" description="管理独立的自定义静态页面" gradient="from-orange-500 to-amber-500"/>
    <LocationInfo page="独立页面 (/page/:slug)" section="自定义内容页" color="orange" description="已发布的页面通过 /page/slug 访问。通过导航菜单添加链接即可在前端显示。"/>
    <CardWrapper>
      <div className="flex items-center justify-between mb-4"><SectionTitle icon={FileText} title="页面列表" iconColor="warning"/><button onClick={openNew} className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl text-sm font-semibold hover:opacity-90 cursor-pointer border-none"><Plus size={15}/>新增页面</button></div>
      {pages.length===0?<p className="text-sm text-slate-400 text-center py-8">暂无自定义页面</p>:<div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-slate-200 text-left text-slate-500"><th className="pb-3 font-medium">标题</th><th className="pb-3 font-medium">Slug</th><th className="pb-3 font-medium">状态</th><th className="pb-3 font-medium">时间</th><th className="pb-3 font-medium">操作</th></tr></thead><tbody>{pages.map(p=>(<tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50"><td className="py-3"><button onClick={()=>openEdit(p)} className="text-slate-800 hover:text-amber-600 text-left cursor-pointer bg-transparent border-none p-0 font-medium">{p.title}</button></td><td className="py-3 text-xs text-slate-400 font-mono">{p.slug?<a href={"/page/"+p.slug} target="_blank" className="text-indigo-500 hover:underline" onClick={e=>e.stopPropagation()}>/page/{p.slug}</a>:"-"}</td><td className="py-3"><select value={p.status} onChange={e=>toggleStatus(p.id,e.target.value)} className="text-xs border border-slate-200 rounded px-2 py-1 bg-white text-slate-800 cursor-pointer"><option value="draft">草稿</option><option value="published">已发布</option></select></td><td className="py-3 text-xs text-slate-400">{p.created_at?.slice(0,10)}</td><td className="py-3 flex gap-2"><button onClick={()=>openEdit(p)} className="text-xs text-indigo-500 hover:text-indigo-700 cursor-pointer border-none bg-transparent">编辑</button><button onClick={()=>del(p.id)} className="text-xs text-red-400 hover:text-red-600 cursor-pointer border-none bg-transparent">删除</button></td></tr>))}</tbody></table></div>}
    </CardWrapper>
    <Dialog open={editing!==null} onOpenChange={()=>setEditing(null)}><DialogContent className="sm:max-w-2xl"><DialogHeader><DialogTitle>{editing==="new"?"新建":"编辑"}自定义页面</DialogTitle><DialogDescription>已发布页面可通过 /page/你的slug 访问</DialogDescription></DialogHeader><div className="space-y-4"><div className="grid grid-cols-2 gap-4"><Field label="页面标题 *" value={editForm.title} onChange={v=>setEditForm(f=>({...f,title:v}))}/><Field label="URL Slug" value={editForm.slug} onChange={v=>setEditForm(f=>({...f,slug:v}))} placeholder="如 privacy-policy"/></div><div><label className="block text-sm font-semibold text-slate-700 mb-1.5">正文（支持 HTML）</label><textarea value={editForm.content||""} onChange={e=>setEditForm(f=>({...f,content:e.target.value}))} rows={8} placeholder="<h2>标题</h2><p>内容...</p>" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 bg-white outline-none resize-vertical font-mono"/></div><div className="grid grid-cols-2 gap-4"><Field label="Meta 标题" value={editForm.meta_title} onChange={v=>setEditForm(f=>({...f,meta_title:v}))} placeholder="SEO标题"/><Field label="Meta 描述" value={editForm.meta_description} onChange={v=>setEditForm(f=>({...f,meta_description:v}))} placeholder="SEO描述"/></div><div><label className="block text-sm font-semibold text-slate-700 mb-1.5">状态</label><select value={editForm.status} onChange={e=>setEditForm(f=>({...f,status:e.target.value}))} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 bg-white"><option value="draft">草稿</option><option value="published">已发布</option></select></div></div><DialogFooter><button onClick={()=>setEditing(null)} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm cursor-pointer">取消</button><button onClick={save} disabled={!editForm.title.trim()} className="px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl text-sm font-semibold cursor-pointer border-none disabled:opacity-40">{editing==="new"?"创建":"保存"}</button></DialogFooter></DialogContent></Dialog>
  </div>);
}

// ==================== User Management Tab ====================
interface AdminUser { id: number; username: string; display_name: string; role: string; permissions: string[]; is_active: number; created_at: string; }

const ROLE_LABELS: Record<string, string> = { superadmin: "超级管理员", editor: "编辑", viewer: "只读" };
const ROLE_COLORS: Record<string, string> = { superadmin: "bg-red-100 text-red-700 border-red-200", editor: "bg-indigo-100 text-indigo-700 border-indigo-200", viewer: "bg-slate-100 text-slate-600 border-slate-200" };
// Permission groups with parent/child hierarchy for UI
const PERMISSION_GROUPS = [
  {
    id: "content", label: "页面内容",
    children: [
      { id: "hero", label: "首页 Hero" },
      { id: "sliders", label: "轮播图" },
      { id: "usecases", label: "应用场景" },
      { id: "features", label: "平台优势" },
      { id: "cta", label: "CTA 号召" },
      { id: "product-features", label: "产品亮点" },
      { id: "about", label: "关于我们" },
    ],
  },
  {
    id: "products", label: "产品管理",
    children: [
      { id: "products", label: "产品管理" },
      { id: "pricing", label: "价格方案" },
    ],
  },
  {
    id: "settings", label: "站点设置",
    children: [
      { id: "settings", label: "全局配置" },
      { id: "navmenus", label: "导航菜单" },
      { id: "themes", label: "主题配置" },
      { id: "languages", label: "多语言" },
      { id: "contact", label: "联系方式" },
      { id: "faq", label: "FAQ 管理" },
      { id: "inquiries", label: "留言管理" },
      { id: "users", label: "用户管理" },
    ],
  },
  {
    id: "cms", label: "内容运营",
    children: [
      { id: "posts", label: "文章/案例" },
      { id: "pages", label: "页面管理" },
      { id: "categories", label: "分类管理" },
    ],
  },
  {
    id: "media", label: "媒体库",
    children: [
      { id: "media-lib", label: "媒体库" },
    ],
  },
];

function UsersTab({ isSuperadmin, onRefresh }: { isSuperadmin: boolean; onRefresh?: () => void }) {
  const currentUser = (() => { try { return JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || "{}"); } catch { return {}; } })();
  const selfId = currentUser.id;
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Create form
  const [showCreate, setShowCreate] = useState(false);
  const [newUser, setNewUser] = useState({ username: "", password: "", display_name: "", role: "editor" });
  const [createError, setCreateError] = useState("");
  // Edit permissions
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  // Change password
  const [pwdUser, setPwdUser] = useState<AdminUser | null>(null);
  const [pwdForm, setPwdForm] = useState({ newPassword: "" });
  const [pwdError, setPwdError] = useState("");

  const load = useCallback(() => {
    setLoading(true); setError("");
    api("/users").then(setUsers).catch((e: any) => setError(e.message)).finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const handleCreate = async () => {
    setCreateError("");
    if (!newUser.username || !newUser.password) { setCreateError("用户名和密码不能为空"); return; }
    try {
      await api("/users", { method: "POST", body: JSON.stringify(newUser) });
      setShowCreate(false);
      setNewUser({ username: "", password: "", display_name: "", role: "editor" });
      load();
    } catch (e: any) { setCreateError(e.message); }
  };

  const handleDelete = async (user: AdminUser) => {
    if (user.role === "superadmin" && !isSuperadmin) { alert("只有超级管理员才能删除超级管理员用户"); return; }
    if (user.id === selfId) { alert("不能删除自己的账号"); return; }
    if (!confirm(`确认删除用户「${user.username}」？此操作不可撤销。`)) return;
    try { await api(`/users/${user.id}`, { method: "DELETE" }); load(); }
    catch (e: any) { alert(e.message); }
  };

  const handleToggleActive = async (user: AdminUser) => {
    if (user.role === "superadmin" && !isSuperadmin) { alert("只有超级管理员才能启用/禁用超级管理员用户"); return; }
    if (user.id === selfId) { alert("不能禁用自己的账号"); return; }
    try { await api(`/users/${user.id}`, { method: "PUT", body: JSON.stringify({ is_active: user.is_active ? 0 : 1 }) }); load(); }
    catch (e: any) { alert(e.message); }
  };

  const handleSavePermissions = async () => {
    if (!editUser) return;
    if (!isSuperadmin && editUser.role === "superadmin") { alert("只有超级管理员才能设置超级管理员角色"); return; }
    try {
      await api(`/users/${editUser.id}`, { method: "PUT", body: JSON.stringify({ role: editUser.role, permissions: editUser.permissions, display_name: editUser.display_name }) });
      // 如果编辑的是自己，更新 localStorage 并立即刷新导航
      if (editUser.id === selfId) {
        try {
          const savedUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || "{}");
          savedUser.role = editUser.role;
          savedUser.permissions = editUser.permissions;
          savedUser.display_name = editUser.display_name;
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(savedUser));
        } catch {}
        onRefresh?.();
      }
      setEditUser(null);
      load();
    } catch (e: any) { alert(e.message); }
  };

  const handleChangePassword = async () => {
    if (!pwdUser) return;
    if (pwdUser.role === "superadmin" && !isSuperadmin) { alert("只有超级管理员才能修改超级管理员的密码"); return; }
    setPwdError("");
    if (pwdForm.newPassword.length < 6) { setPwdError("新密码至少6个字符"); return; }
    try {
      await api(`/users/${pwdUser.id}/password`, { method: "PUT", body: JSON.stringify(pwdForm) });
      setPwdUser(null);
      setPwdForm({ newPassword: "" });
      alert("密码修改成功");
    } catch (e: any) { setPwdError(e.message); }
  };

  const togglePermission = (groupId: string) => {
    if (!editUser) return;
    const perms = editUser.permissions.includes(groupId)
      ? editUser.permissions.filter(p => p !== groupId)
      : [...editUser.permissions, groupId];
    setEditUser({ ...editUser, permissions: perms });
  };

  if (loading) return <LoadingBox />;
  if (error) return <ErrorBox message={error} />;

  return (
    <div>
      <PageHeader icon={Users} title="用户管理" description="创建用户、分配权限、管理密码" gradient="from-rose-500 to-pink-500" />
      <LocationInfo page="后台" section="权限管理" color="rose"
        description="超级管理员拥有全部权限，可管理所有用户。编辑只能管理内容和产品，不可创建/修改/删除超级管理员。只读用户只能查看。" />

      {/* User list */}
      <CardWrapper>
        <div className="flex items-center justify-between mb-5">
          <SectionTitle icon={Users} title="用户列表" iconColor="info" />
          <button onClick={() => { setShowCreate(true); setCreateError(""); }}
            className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl text-sm font-semibold cursor-pointer border-none shadow hover:opacity-90 transition">
            + 创建用户
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-xs">
                <th className="text-left py-3 px-3 font-semibold">用户名</th>
                <th className="text-left py-3 px-3 font-semibold">显示名称</th>
                <th className="text-left py-3 px-3 font-semibold">角色</th>
                <th className="text-left py-3 px-3 font-semibold">状态</th>
                <th className="text-left py-3 px-3 font-semibold">创建时间</th>
                <th className="text-right py-3 px-3 font-semibold">操作</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                  <td className="py-3 px-3 font-mono font-semibold text-slate-700">{u.username}</td>
                  <td className="py-3 px-3 text-slate-600">{u.display_name || "-"}</td>
                  <td className="py-3 px-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${ROLE_COLORS[u.role] || ROLE_COLORS.viewer}`}>
                      {ROLE_LABELS[u.role] || u.role}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    {u.role === "superadmin" && !isSuperadmin ? (
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${ROLE_COLORS[u.role] || ROLE_COLORS.viewer}`}>
                        {ROLE_LABELS[u.role] || u.role}
                      </span>
                    ) : (
                      <button onClick={() => handleToggleActive(u)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer border-none transition ${u.is_active ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${u.is_active ? "bg-emerald-500" : "bg-slate-400"}`} />
                        {u.is_active ? "正常" : "禁用"}
                      </button>
                    )}
                  </td>
                  <td className="py-3 px-3 text-slate-400 text-xs">{u.created_at || "-"}</td>
                  <td className="py-3 px-3 text-right">
                    <div className="inline-flex gap-1.5">
                      <button onClick={() => { setEditUser({ ...u }); }} className="px-2.5 py-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-xs font-medium cursor-pointer border-none transition">权限</button>
                      <button onClick={() => { setPwdUser(u); setPwdForm({ newPassword: "" }); setPwdError(""); }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer border-none transition ${
                          u.role === "superadmin" && !isSuperadmin
                            ? "bg-slate-50 text-slate-400 cursor-not-allowed"
                            : "bg-amber-50 text-amber-600 hover:bg-amber-100"
                        }`}
                        disabled={u.role === "superadmin" && !isSuperadmin}
                        title={u.role === "superadmin" && !isSuperadmin ? "只有超级管理员才能修改超级管理员的密码" : ""}>
                        改密码
                      </button>
                      {u.role === "superadmin" && !isSuperadmin ? (
                        <span className="px-2.5 py-1 bg-slate-50 text-slate-400 rounded-lg text-xs cursor-not-allowed border border-slate-100" title="只有超级管理员才能删除超级管理员">删除</span>
                      ) : (
                        <button onClick={() => handleDelete(u)} className="px-2.5 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-medium cursor-pointer border-none transition">删除</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardWrapper>

      {/* Create User Dialog */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowCreate(false)}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-800 mb-4">创建新用户</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">用户名 *</label>
                <input value={newUser.username} onChange={e => setNewUser({ ...newUser, username: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white outline-none focus:border-indigo-400"
                  placeholder="至少3个字符" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">密码 *</label>
                <input type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white outline-none focus:border-indigo-400"
                  placeholder="至少6个字符" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">显示名称</label>
                <input value={newUser.display_name} onChange={e => setNewUser({ ...newUser, display_name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white outline-none focus:border-indigo-400"
                  placeholder="如：内容编辑小王" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">角色</label>
                <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white outline-none">
                  <option value="editor">编辑（可管理内容和产品）</option>
                  <option value="viewer">只读（仅查看）</option>
                  {isSuperadmin && <option value="superadmin">超级管理员（全部权限）</option>}
                </select>
                {!isSuperadmin && <p className="text-xs text-amber-600 mt-1">只有超级管理员才能创建超级管理员用户</p>}
              </div>
              {createError && <p className="text-sm text-red-500">{createError}</p>}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowCreate(false)} className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm cursor-pointer">取消</button>
              <button onClick={handleCreate} className="flex-1 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl text-sm font-semibold cursor-pointer border-none">创建</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Permissions Dialog */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setEditUser(null)}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-800 mb-1">编辑权限 - {editUser.username}</h3>
            <p className="text-xs text-slate-400 mb-5">超级管理员自动拥有全部权限，无需单独分配</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">显示名称</label>
                <input value={editUser.display_name} onChange={e => setEditUser({ ...editUser, display_name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white outline-none focus:border-indigo-400" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">角色</label>
                {editUser.role === "superadmin" && !isSuperadmin ? (
                  <div>
                    <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
                      当前为超级管理员，只有超级管理员才能修改其角色
                    </p>
                  </div>
                ) : isSuperadmin ? (
                  <select value={editUser.role} onChange={e => setEditUser({ ...editUser, role: e.target.value, permissions: e.target.value === "superadmin" ? [] : editUser.permissions })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white outline-none">
                    <option value="superadmin">超级管理员（全部权限）</option>
                    <option value="editor">编辑</option>
                    <option value="viewer">只读</option>
                  </select>
                ) : (
                  <select value={editUser.role} onChange={e => setEditUser({ ...editUser, role: e.target.value, permissions: e.target.value === "superadmin" ? [] : editUser.permissions })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white outline-none">
                    <option value="editor">编辑</option>
                    <option value="viewer">只读</option>
                  </select>
                )}
              </div>
              {editUser.role !== "superadmin" && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">可访问的模块</label>
                  <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                    {PERMISSION_GROUPS.map(group => {
                      const allChecked = group.children.every(c => editUser.permissions.includes(c.id));
                      const someChecked = group.children.some(c => editUser.permissions.includes(c.id)) && !allChecked;
                      return (
                        <div key={group.id} className="border border-slate-100 rounded-xl p-3">
                          <label className="flex items-center gap-2.5 cursor-pointer select-none">
                            <input type="checkbox" checked={allChecked}
                              onChange={() => {
                                if (allChecked) {
                                  const groupIds = new Set(group.children.map(c => c.id));
                                  setEditUser({ ...editUser, permissions: editUser.permissions.filter(p => !groupIds.has(p)) });
                                } else {
                                  const groupIds = group.children.map(c => c.id);
                                  setEditUser({ ...editUser, permissions: [...new Set([...editUser.permissions, ...groupIds])] });
                                }
                              }}
                              className="w-4 h-4 rounded accent-indigo-500"
                            />
                            <span className="text-sm font-semibold text-slate-700">{group.label}</span>
                            {someChecked && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-500 font-medium">部分</span>
                            )}
                          </label>
                          <div className="pl-6 mt-1.5 grid grid-cols-2 gap-2">
                            {group.children.map(child => (
                              <label key={child.id} className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={editUser.permissions.includes(child.id)}
                                  onChange={() => togglePermission(child.id)}
                                  className="w-4 h-4 rounded accent-indigo-500"
                                />
                                <span className="text-sm text-slate-600">{child.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs text-slate-400 mt-2">不勾选任何模块 = 只有仪表盘访问权限</p>
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditUser(null)} className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm cursor-pointer">取消</button>
              <button onClick={handleSavePermissions} className="flex-1 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-xl text-sm font-semibold cursor-pointer border-none">保存</button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Dialog */}
      {pwdUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setPwdUser(null)}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-800 mb-1">修改密码 - {pwdUser.username}</h3>
            <p className="text-xs text-slate-400 mb-5">设置新密码后用户需重新登录</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">新密码 *</label>
                <input type="password" value={pwdForm.newPassword} onChange={e => setPwdForm({ ...pwdForm, newPassword: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white outline-none focus:border-indigo-400"
                  placeholder="至少6个字符" />
              </div>
              {pwdError && <p className="text-sm text-red-500">{pwdError}</p>}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setPwdUser(null)} className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm cursor-pointer">取消</button>
              <button onClick={handleChangePassword} className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-sm font-semibold cursor-pointer border-none">确认修改</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface NavGroup {
  id: string;
  label: string;
  icon: any;
  tabs: { id: string; label: string }[];
}

const NAV_GROUPS: NavGroup[] = [
  { id: "dashboard", label: "仪表盘", icon: LayoutDashboard, tabs: [] },
  {
    id: "content", label: "页面内容", icon: FileText,
    tabs: [
      { id: "hero", label: "首页 Hero" },
      { id: "sliders", label: "轮播图" },
      { id: "usecases", label: "应用场景" },
      { id: "features", label: "平台优势" },
      { id: "cta", label: "CTA 号召" },
      { id: "product-features", label: "产品亮点" },
      { id: "about", label: "关于我们" },
    ],
  },
  {
    id: "products", label: "产品管理", icon: Package,
    tabs: [
      { id: "products", label: "产品信息" },
    ],
  },
  {
    id: "settings", label: "站点设置", icon: Settings,
    tabs: [
      { id: "settings", label: "全局配置" },
      { id: "navmenus", label: "导航菜单" },
      { id: "contact", label: "联系渠道" },
      { id: "inquiries", label: "询单留言" },
      { id: "faq", label: "帮助中心" },
      { id: "themes", label: "主题管理" },
      { id: "languages", label: "语言设置" },
      { id: "users", label: "用户管理" },
    ],
  },
  {
    id: "cms", label: "内容运营", icon: BookOpen,
    tabs: [
      { id: "posts", label: "文章/案例" },
      { id: "pages", label: "自定义页面" },
      { id: "categories", label: "分类管理" },
    ],
  },
  {
    id: "media", label: "媒体库", icon: Image,
    tabs: [
      { id: "media-lib", label: "文件管理" },
    ],
  },
];

// ==================== MAIN ADMIN PANEL ====================
export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem(TOKEN_KEY));
  const [activeGroup, setActiveGroup] = useState("dashboard");
  const [activeTab, setActiveTab] = useState("settings");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  // Self-service password change
  const [selfPwdOpen, setSelfPwdOpen] = useState(false);
  const [selfPwdForm, setSelfPwdForm] = useState({ newPassword: "", confirmPassword: "" });
  const [selfPwdError, setSelfPwdError] = useState("");

  // Current logged-in user info (for permission filtering)
  const [currentUser, setCurrentUser] = useState<{ id?: number; role?: string; permissions?: string[]; username?: string; display_name?: string }>(() => {
    try { return JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || "{}"); } catch { return {}; }
  });
  const refreshCurrentUser = () => {
    try { setCurrentUser(JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || "{}")); } catch { setCurrentUser({}); }
  };
  const isSuperadmin = currentUser.role === "superadmin";
  // Filter nav groups based on role — superadmin sees all; others see only tabs whose id is in their permissions
  const visibleGroups = isSuperadmin
    ? NAV_GROUPS
    : NAV_GROUPS
        .map(g => ({
          ...g,
          tabs: g.id === "dashboard"
            ? g.tabs
            : g.tabs.filter(t => (currentUser.permissions || []).includes(t.id)),
        }))
        .filter(g => g.id === "dashboard" || g.tabs.length > 0);

  if (!loggedIn) return <LoginScreen onLogin={() => { refreshCurrentUser(); setLoggedIn(true); }}/>;

  const logout = () => { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(CURRENT_USER_KEY); setLoggedIn(false); };

  const handleSelfChangePassword = async () => {
    setSelfPwdError("");
    if (selfPwdForm.newPassword.length < 6) { setSelfPwdError("新密码至少6个字符"); return; }
    if (selfPwdForm.newPassword !== selfPwdForm.confirmPassword) { setSelfPwdError("两次输入的新密码不一致"); return; }
    try {
      await api(`/users/${currentUser.id}/password`, { method: "PUT", body: JSON.stringify({ newPassword: selfPwdForm.newPassword }) });
      setSelfPwdOpen(false);
      setSelfPwdForm({ newPassword: "", confirmPassword: "" });
      alert("密码修改成功，请妥善保管新密码");
    } catch (e: any) { setSelfPwdError(e.message); }
  };

  const navigateTo = (group: string, tab?: string) => {
    setActiveGroup(group);
    if (tab) setActiveTab(tab);
  };

  const currentGroup = visibleGroups.find(g => g.id === activeGroup);

  const renderContent = () => {
    if (activeGroup === "dashboard") return <DashboardTab onNavigate={navigateTo} permissions={currentUser.permissions}/>;

    const components: Record<string, any> = {
      settings: SiteSettingsTab, hero: HeroTab, navmenus: NavMenuTab,
      usecases: UseCasesTab, features: FeaturesTab, cta: CTATab,
      contact: ContactTab, faq: FAQTab, about: AboutTab,
      products: ProductsTab, "product-features": ProductFeaturesTab,
      pricing: PricingTab,
      themes: ThemesTab, languages: LanguagesTab, "media-lib": MediaTab,
      sliders: SlidersTab, inquiries: InquiriesTab,
      categories: CategoriesTab, posts: PostsTab, pages: PagesTab,
      users: UsersTab,
    };
    const Tab = components[activeTab];
    if (activeTab === "users") return <UsersTab isSuperadmin={isSuperadmin} onRefresh={refreshCurrentUser} />;
    return Tab ? <Tab/> : <ErrorBox message="页面不存在"/>;
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%)" }}>
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-2.5 mr-6 pr-6 border-r border-slate-200">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center shadow-md">
                <Settings size={18} className="text-white"/>
              </div>
              <div>
                <span className="font-bold text-slate-800 text-sm block leading-tight">CloudNest</span>
                <span className="text-[11px] text-slate-400 leading-tight block">管理后台</span>
              </div>
            </div>
            <nav className="flex items-center gap-1">
              {visibleGroups.map(g => (
                <button key={g.id} onClick={() => { setActiveGroup(g.id); if (g.tabs.length > 0) setActiveTab(g.tabs[0].id); }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer border-none ${
                    activeGroup === g.id
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                  }`}>
                  <g.icon size={17}/>
                  <span>{g.label}</span>
                </button>
              ))}
            </nav>
          </div>
          <div className="relative">
            <button onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 transition cursor-pointer border-none bg-transparent">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold shadow">{(currentUser.display_name || currentUser.username || "admin").charAt(0).toUpperCase()}</div>
              <span className="text-sm font-medium text-slate-600 hidden sm:block">{currentUser.display_name || currentUser.username || "管理员"}</span>
              <ChevronDown size={14} className={`text-slate-400 transition ${userMenuOpen ? "rotate-180" : ""}`}/>
            </button>
            {userMenuOpen && (
              <>
                <div className="fixed inset-0 z-0" onClick={() => setUserMenuOpen(false)}/>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-slate-200 shadow-xl z-10 py-1">
                  <button onClick={() => { setUserMenuOpen(false); window.open("/", "_blank"); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2 cursor-pointer border-none bg-transparent">
                    <Globe size={15}/> 访问网站
                  </button>
                  <button onClick={() => { setUserMenuOpen(false); setSelfPwdOpen(true); setSelfPwdForm({ newPassword: "", confirmPassword: "" }); setSelfPwdError(""); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2 cursor-pointer border-none bg-transparent">
                    <Lock size={15}/> 修改密码
                  </button>
                  <hr className="border-slate-100 my-1"/>
                  <button onClick={() => { setUserMenuOpen(false); logout(); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer border-none bg-transparent">
                    <LogOut size={15}/> 退出登录
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Subnav */}
      {currentGroup && currentGroup.tabs.length > 0 && (
        <div className="bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-[1280px] mx-auto px-6 flex items-center gap-1 py-2 overflow-x-auto">
            {currentGroup.tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition cursor-pointer border-none ${
                  activeTab === t.id
                    ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                }`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <main className="flex-1">
        <div className="max-w-[1280px] mx-auto px-6 py-6">
          {renderContent()}
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-400">
        Powered by CloudNest Admin v2.0
      </footer>

      {/* Self-Service Password Change Dialog */}
      {selfPwdOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40" onClick={() => setSelfPwdOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-800 mb-1">修改密码</h3>
            <p className="text-xs text-slate-400 mb-5">当前用户：{currentUser.display_name || currentUser.username}</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">新密码 *</label>
                <input type="password" value={selfPwdForm.newPassword} onChange={e => setSelfPwdForm({ ...selfPwdForm, newPassword: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white outline-none focus:border-indigo-400"
                  placeholder="至少6个字符" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">确认新密码 *</label>
                <input type="password" value={selfPwdForm.confirmPassword} onChange={e => setSelfPwdForm({ ...selfPwdForm, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white outline-none focus:border-indigo-400"
                  placeholder="再次输入新密码" />
              </div>
              {selfPwdError && <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{selfPwdError}</p>}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setSelfPwdOpen(false)} className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm cursor-pointer">取消</button>
              <button onClick={handleSelfChangePassword} className="flex-1 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-xl text-sm font-semibold cursor-pointer border-none">确认修改</button>
            </div>
          </div>
        </div>
      )}
    </div>
 
  );
}

