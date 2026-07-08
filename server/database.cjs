const Database = require("better-sqlite3");
const path = require("path");

const DB_PATH = path.join(__dirname, "data.db");

// Initialize database and tables
function initDB() {
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      is_visible INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      subtitle TEXT,
      description TEXT,
      gradient TEXT,
      highlights TEXT,
      features TEXT,
      specs TEXT,
      icon TEXT,
      sort_order INTEGER DEFAULT 0,
      is_visible INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS hero_content (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      badge TEXT,
      badge_subtitle TEXT,
      main_title TEXT,
      subtitle1 TEXT,
      subtitle2 TEXT,
      description TEXT,
      stats TEXT,
      primary_btn_text TEXT DEFAULT '立即免费试用',
      primary_btn_link TEXT DEFAULT '#',
      secondary_btn_text TEXT DEFAULT '加入 Telegram',
      secondary_btn_link TEXT DEFAULT '',
      cta_subtitle TEXT,
      is_visible INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS usecases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      icon TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      gradient TEXT,
      tags TEXT,
      icon_bg TEXT,
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS features (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      icon TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      icon_gradient TEXT,
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS cta_content (
      id INTEGER PRIMARY KEY DEFAULT 1,
      title TEXT,
      subtitle TEXT,
      button_text TEXT,
      secondary_button_text TEXT
    );

    CREATE TABLE IF NOT EXISTS faq_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      gradient TEXT,
      icon TEXT,
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS faq_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER NOT NULL,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      FOREIGN KEY (category_id) REFERENCES faq_categories(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS contact_info (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      icon TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      gradient TEXT,
      sort_order INTEGER DEFAULT 0,
      is_visible INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS about_content (
      id INTEGER PRIMARY KEY DEFAULT 1,
      page_title TEXT,
      page_subtitle TEXT,
      heading TEXT,
      intro_paragraph_1 TEXT,
      intro_paragraph_2 TEXT,
      card_values TEXT
    );

    CREATE TABLE IF NOT EXISTS nav_menus (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      label TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'route',
      target TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      is_visible INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS pricing_plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id TEXT NOT NULL DEFAULT '',
      name TEXT NOT NULL,
      price TEXT NOT NULL,
      period TEXT DEFAULT '/月',
      description TEXT,
      features TEXT DEFAULT '[]',
      highlighted INTEGER DEFAULT 0,
      button_text TEXT DEFAULT '立即购买',
      gradient TEXT,
      sort_order INTEGER DEFAULT 0,
      is_visible INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS product_features (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      icon TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      gradient TEXT,
      category TEXT DEFAULT '通用',
      sort_order INTEGER DEFAULT 0
    );

    -- ===== New tables for ShopAgg feature parity =====

    CREATE TABLE IF NOT EXISTS themes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      tokens TEXT NOT NULL DEFAULT '{}',
      is_default INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS languages (
      code TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      native_name TEXT NOT NULL,
      is_default INTEGER DEFAULT 0,
      is_visible INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS translations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lang_code TEXT NOT NULL,
      key TEXT NOT NULL,
      value TEXT NOT NULL,
      UNIQUE(lang_code, key)
    );

    CREATE TABLE IF NOT EXISTS media (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      original_name TEXT NOT NULL,
      mime_type TEXT,
      size INTEGER DEFAULT 0,
      folder TEXT DEFAULT '/',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      phone TEXT,
      company TEXT,
      message TEXT NOT NULL,
      product_id TEXT,
      status TEXT DEFAULT 'pending',
      notes TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT,
      parent_id INTEGER DEFAULT NULL,
      type TEXT DEFAULT 'product',
      description TEXT,
      sort_order INTEGER DEFAULT 0,
      is_visible INTEGER DEFAULT 1,
      FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS sliders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'active',
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS slider_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slider_id INTEGER NOT NULL,
      image TEXT,
      title TEXT,
      subtitle TEXT,
      link_url TEXT,
      link_text TEXT,
      sort_order INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active',
      FOREIGN KEY (slider_id) REFERENCES sliders(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE,
      cover TEXT,
      summary TEXT,
      content TEXT,
      type TEXT DEFAULT 'post',
      category_id INTEGER,
      status TEXT DEFAULT 'draft',
      is_featured INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS custom_pages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      content TEXT,
      meta_title TEXT,
      meta_description TEXT,
      status TEXT DEFAULT 'draft',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // Phase 1 tables: admin_logs, login_attempts, backups
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      target TEXT NOT NULL,
      detail TEXT,
      ip TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS login_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ip TEXT NOT NULL,
      success INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS backups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      size INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // ===== Migrations: add missing columns if not present =====
  const migrations = [
    ["hero_content", "badge_subtitle", "TEXT"],
    ["usecases", "tags", "TEXT"],
    ["usecases", "icon_bg", "TEXT"],
    ["cta_content", "button_text", "TEXT"],
    ["cta_content", "secondary_button_text", "TEXT"],
    ["faq_categories", "icon", "TEXT"],
    ["site_settings", "is_visible", "INTEGER DEFAULT 1"],
    ["contact_info", "is_visible", "INTEGER DEFAULT 1"],
    ["products", "is_visible", "INTEGER DEFAULT 1"],
    ["features", "icon_gradient", "TEXT"],
    ["hero_content", "is_visible", "INTEGER DEFAULT 1"],
    ["hero_content", "sort_order", "INTEGER DEFAULT 0"],
    ["hero_content", "primary_btn_text", "TEXT DEFAULT '立即免费试用'"],
    ["hero_content", "primary_btn_link", "TEXT DEFAULT '#'"],
    ["hero_content", "secondary_btn_text", "TEXT DEFAULT '加入 Telegram'"],
    ["hero_content", "secondary_btn_link", "TEXT DEFAULT ''"],
    ["hero_content", "cta_subtitle", "TEXT"],
    ["pricing_plans", "product_id", "TEXT NOT NULL DEFAULT ''"],
    // Products: add sections (JSON array) and category_id (FK to categories)
    ["products", "sections", "TEXT DEFAULT '[]'"],
    ["products", "category_id", "INTEGER DEFAULT NULL"],
    // Posts: add meta fields for SEO
    ["posts", "meta_title", "TEXT"],
    ["posts", "meta_description", "TEXT"],
    // Product features: add is_visible for admin toggle
    ["product_features", "is_visible", "INTEGER DEFAULT 1"],
    // Posts: add scheduled_at for scheduled publishing
    ["posts", "scheduled_at", "TEXT"],
    // Redirects table for URL redirect management
  ];
  // Create redirects table if not exists (separate because it needs IF NOT EXISTS)
  db.exec(`CREATE TABLE IF NOT EXISTS redirects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    from_path TEXT NOT NULL,
    to_path TEXT NOT NULL,
    status INTEGER DEFAULT 301,
    created_at TEXT DEFAULT (datetime('now'))
  );`);
  migrations.forEach(([table, column, type]) => {
    try { db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${type};`); }
    catch (e) { /* column already exists */ }
  });

  return db;
}

// Seed data from existing hardcoded content
function seedDB(db) {
  // === Admins table migration (MUST run before count check, so existing DBs also get migrated) ===
  db.prepare("INSERT OR IGNORE INTO admins (username, password) VALUES (?,?)").run("admin", "admin123");
  try { db.prepare("ALTER TABLE admins ADD COLUMN role TEXT DEFAULT 'superadmin'").run(); } catch(e) {}
  try { db.prepare("ALTER TABLE admins ADD COLUMN display_name TEXT DEFAULT ''").run(); } catch(e) {}
  try { db.prepare("ALTER TABLE admins ADD COLUMN permissions TEXT DEFAULT '[]'").run(); } catch(e) {}
  try { db.prepare("ALTER TABLE admins ADD COLUMN created_at TEXT DEFAULT ''").run(); } catch(e) {}
  try { db.prepare("ALTER TABLE admins ADD COLUMN is_active INTEGER DEFAULT 1").run(); } catch(e) {}
  // Set default admin as superadmin
  try { db.prepare("UPDATE admins SET role='superadmin', display_name='超级管理员' WHERE role IS NULL OR role='' OR display_name=''").run(); } catch(e) {}
  // Backfill permissions for existing admins (empty -> ["all"] for superadmin)
  try { db.prepare("UPDATE admins SET permissions='[\"all\"]' WHERE role='superadmin' AND (permissions IS NULL OR permissions='[]' OR permissions='')").run(); } catch(e) {}

  const count = db.prepare("SELECT COUNT(*) as c FROM site_settings").get();
  if (count.c > 0) {
    // Patch: set is_visible=1 for any existing rows where it's NULL (from migration)
    db.prepare("UPDATE site_settings SET is_visible=1 WHERE is_visible IS NULL").run();
    db.prepare("UPDATE contact_info SET is_visible=1 WHERE is_visible IS NULL").run();
    db.prepare("UPDATE products SET is_visible=1 WHERE is_visible IS NULL").run();
    db.prepare("UPDATE hero_content SET is_visible=1 WHERE is_visible IS NULL").run();

    // Patch: add new split site_settings keys for telegram per-location links + footer_description
    const splitKeys = [
      ["telegram_nav_link", "", 1],
      ["telegram_hero_link", "", 1],
      ["telegram_cta_link", "", 1],
      ["telegram_help_link", "", 1],
      ["telegram_products_link", "", 1],
      ["footer_description", "CloudNest 专注云端虚拟化技术，提供云手机、沙箱环境、应用分身三大核心解决方案。", 1],
    ];
    const insSetting = db.prepare("INSERT OR IGNORE INTO site_settings (key, value, is_visible) VALUES (?, ?, ?)");
    splitKeys.forEach(s => insSetting.run(...s));

    // Patch: update seed data for existing databases (missing fields)
    const hs = db.prepare("SELECT badge_subtitle FROM hero_content WHERE id=1").get();
    if (hs && !hs.badge_subtitle) {
      db.prepare("UPDATE hero_content SET badge_subtitle=? WHERE id=1").run("更强大、更全的云手机解决方案");
      db.prepare("UPDATE cta_content SET button_text=?, secondary_button_text=? WHERE id=1").run("立即免费试用", "加入 Telegram");
    }
    // Patch: fill new hero button/link fields for existing databases
    const heroRow = db.prepare("SELECT primary_btn_text FROM hero_content WHERE id=1").get();
    if (heroRow && !heroRow.primary_btn_text) {
      db.prepare(`UPDATE hero_content SET primary_btn_text='立即免费试用', primary_btn_link='/products', secondary_btn_text='加入 Telegram', secondary_btn_link='', cta_subtitle='注册即享 7 天免费试用，无需绑定信用卡' WHERE id=1`).run();
    }
    // Add usecase tags/icon_bg if empty
    const uc = db.prepare("SELECT id,tags FROM usecases WHERE id=1").get();
    if (uc && !uc.tags) {
      const tagMap = {
        1: {tags:["TikTok","Instagram","Facebook"],icon_bg:"bg-violet-500/15"},
        2: {tags:["梦幻西游","原神","王者荣耀"],icon_bg:"bg-blue-500/15"},
        3: {tags:["Amazon","Shopee","独立站"],icon_bg:"bg-pink-500/15"},
        4: {tags:["Facebook","Google","TikTok"],icon_bg:"bg-orange-500/15"},
        5: {tags:["安全","兼容","性能"],icon_bg:"bg-teal-500/15"},
      };
      const upd = db.prepare("UPDATE usecases SET tags=?, icon_bg=? WHERE id=?");
      Object.entries(tagMap).forEach(([id, d]) => upd.run(JSON.stringify(d.tags), d.icon_bg, parseInt(id)));
    }
    // Add feature icon_gradient if empty
    const featRow = db.prepare("SELECT icon_gradient FROM features WHERE id=1").get();
    if (featRow && !featRow.icon_gradient) {
      const gradMap = {
        1: "from-yellow-400 to-orange-500",
        2: "from-cyan-400 to-blue-500",
        3: "from-sky-400 to-indigo-500",
        4: "from-emerald-400 to-teal-500",
        5: "from-violet-400 to-purple-500",
        6: "from-pink-400 to-rose-500",
      };
      const updF = db.prepare("UPDATE features SET icon_gradient=? WHERE id=?");
      Object.entries(gradMap).forEach(([id, g]) => updF.run(g, parseInt(id)));
    }
    // Add faq category icons
    const fc = db.prepare("SELECT id,icon FROM faq_categories WHERE id=1").get();
    if (fc && !fc.icon) {
      const iconMap = {1:"BookOpen",2:"Smartphone",3:"Shield",4:"Copy",5:"AlertCircle"};
      const upd = db.prepare("UPDATE faq_categories SET icon=? WHERE id=?");
      Object.entries(iconMap).forEach(([id, ic]) => upd.run(ic, parseInt(id)));
    }
    // Seed about_content if missing
    const ac = db.prepare("SELECT COUNT(*) as c FROM about_content").get();
    if (ac.c === 0) {
      db.prepare("INSERT INTO about_content (page_title, page_subtitle, heading, intro_paragraph_1, intro_paragraph_2, card_values) VALUES (?,?,?,?,?,?)").run(
        "关于我们",
        "致力于为用户提供安全、稳定、高效的云虚拟环境解决方案",
        "公司简介",
        "CloudNest 是一家专注于云端虚拟化技术的科技公司，致力于为全球用户提供安全、稳定、高效的云手机、沙箱环境和应用分身解决方案。我们的技术团队在云计算、Android虚拟化、网络安全等领域拥有深厚的技术积累和丰富的行业经验。",
        "CloudNest 核心产品覆盖云手机、沙箱环境、应用分身三大领域，广泛应用于社媒运营、游戏多开、跨境电商、广告投放和应用测试等场景。凭借独立IP环境、全球节点部署、无需Root操作等核心技术优势，我们已为全球 10,000+ 用户提供稳定可靠的云端虚拟化服务。",
        JSON.stringify([
          { icon: "Target", title: "使命", description: "让每个人都能拥有一台安全、稳定的云端设备" },
          { icon: "Users", title: "团队", description: "资深云计算与安全专家团队，深耕虚拟化技术领域" },
          { icon: "Globe2", title: "覆盖", description: "全球50+节点部署，服务覆盖100+国家和地区" },
          { icon: "Shield", title: "信赖", description: "10,000+用户选择，99.9%稳定运行保障" },
        ])
      );
    }
    // Seed nav_menus if missing
    const nm = db.prepare("SELECT COUNT(*) as c FROM nav_menus").get();
    if (nm.c === 0) {
      const insNav = db.prepare("INSERT INTO nav_menus (label, type, target, sort_order, is_visible) VALUES (?,?,?,?,?)");
      const menus = [
        ["首页", "route", "/", 1, 1],
        ["产品", "route", "/products", 2, 1],
        ["优势", "scroll", "advantages", 3, 1],
        ["应用场景", "scroll", "usecases", 4, 1],
        ["价格", "scroll", "pricing", 5, 1],
        ["帮助中心", "route", "/help", 6, 1],
      ];
      menus.forEach(m => insNav.run(...m));
    }
    // Seed pricing_plans if missing
    const pp = db.prepare("SELECT COUNT(*) as c FROM pricing_plans").get();
    if (pp.c === 0) {
      const insPlan = db.prepare("INSERT INTO pricing_plans (product_id, name, price, period, description, features, highlighted, button_text, gradient, sort_order, is_visible) VALUES (?,?,?,?,?,?,?,?,?,?,?)");
      const plans = [
        // 云手机
        ["cloudphone", "入门版", "¥99", "/月", "适合个人用户，1台云手机轻松体验云端之力",
          JSON.stringify(["1 台云手机实例","4 核 CPU · 4GB 内存","64GB 存储空间","独立公网 IP","Web 浏览器访问","7×24 小时在线","基础技术支持"]),
          0, "立即试用", "from-slate-500 to-gray-500", 1, 1],
        ["cloudphone", "专业版", "¥299", "/月", "适合专业用户，5台云手机满足多业务需求",
          JSON.stringify(["5 台云手机实例","6 核 CPU · 8GB 内存","128GB 存储空间","独立公网 IP × 5","API 接口调用","自动备份还原","优先技术支持"]),
          1, "立即购买", "from-indigo-500 to-blue-600", 2, 1],
        ["cloudphone", "企业版", "¥999", "/月", "适合大型团队，20台云手机 + 全套管理工具",
          JSON.stringify(["20 台云手机实例","8 核 CPU · 16GB 内存","256GB 存储空间","独立公网 IP × 20","专属 API 接口","批量管理控制台","7×24 小时专属客服","定制化部署方案"]),
          0, "联系我们", "from-purple-500 to-pink-600", 3, 1],
        // 沙箱环境
        ["sandbox", "入门版", "¥149", "/月", "适合安全测试入门，5个沙箱实例独立隔离",
          JSON.stringify(["5 个沙箱实例","系统级完全隔离","秒级重置还原","网络抓包审计","APK 自由安装","基础技术支持"]),
          0, "立即试用", "from-slate-500 to-gray-500", 1, 1],
        ["sandbox", "专业版", "¥399", "/月", "适合安全团队，20个沙箱 + 高级审计工具",
          JSON.stringify(["20 个沙箱实例","模拟设备信息","批量任务管理","API 脚本支持","高级网络监控","优先技术支持"]),
          1, "立即购买", "from-indigo-500 to-blue-600", 2, 1],
        ["sandbox", "企业版", "¥1299", "/月", "适合企业安全部门，无限沙箱 + 全套安全套件",
          JSON.stringify(["100+ 沙箱实例","自定义安全策略","自动化安全扫描","私有化部署可选","专属安全顾问","7×24 小时应急响应"]),
          0, "联系我们", "from-purple-500 to-pink-600", 3, 1],
        // 应用分身
        ["clone", "入门版", "¥79", "/月", "适合个人用户，10个分身轻松管理多账号",
          JSON.stringify(["10 个应用分身","独立设备指纹","独立 IP 地址","支持主流通用应用","基础技术支持"]),
          0, "立即试用", "from-slate-500 to-gray-500", 1, 1],
        ["clone", "专业版", "¥249", "/月", "适合运营团队，50个分身 + 自动化引擎",
          JSON.stringify(["50 个应用分身","智能标签分组","自动化脚本引擎","定时任务支持","批量操作","优先技术支持"]),
          1, "立即购买", "from-indigo-500 to-blue-600", 2, 1],
        ["clone", "企业版", "¥799", "/月", "适合大型运营，无上限分身 + 全套自动化方案",
          JSON.stringify(["无限应用分身","自定义设备指纹","专属 IP 池","高级自动化引擎","API 深度集成","7×24 小时专属客服"]),
          0, "联系我们", "from-purple-500 to-pink-600", 3, 1],
      ];
      plans.forEach(p => insPlan.run(...p));
    } else {
      // Patch: set empty product_id for existing plans that don't have it
      db.prepare("UPDATE pricing_plans SET product_id='cloudphone' WHERE product_id IS NULL OR product_id=''").run();
    }
    // Seed product_features if missing
    const pf = db.prepare("SELECT COUNT(*) as c FROM product_features").get();
    if (pf.c === 0) {
      const insPF = db.prepare("INSERT INTO product_features (icon, title, description, gradient, category, sort_order) VALUES (?,?,?,?,?,?)");
      const pfeatures = [
        ["Zap", "10秒急速启动", "从创建到可用只需 10 秒，无需等待即可获得云端设备", "from-amber-500 to-orange-500", "云手机", 1],
        ["Wifi", "独立公网 IP", "每台云手机独享公网 IP，可选全球多地节点", "from-blue-500 to-cyan-500", "云手机", 2],
        ["MonitorPlay", "Web 远程操控", "浏览器即可远程操控，支持触屏/键盘/文件上传", "from-green-500 to-emerald-500", "云手机", 3],
        ["Shield", "系统级隔离", "沙箱与宿主完全隔离，文件/网络/进程互不影响", "from-purple-500 to-pink-500", "沙箱环境", 4],
        ["RefreshCw", "秒级重置还原", "一键恢复到纯净初始状态，不留任何使用痕迹", "from-cyan-500 to-blue-500", "沙箱环境", 5],
        ["SearchCode", "网络抓包审计", "内置网络监控工具，实时分析应用行为", "from-rose-500 to-red-500", "沙箱环境", 6],
        ["Copy", "无限应用分身", "同一应用支持无上限分身实例，每个独立运行", "from-indigo-500 to-purple-500", "应用分身", 7],
        ["Fingerprint", "独立设备指纹", "每个分身拥有唯一 IMEI/ID/IP，防止平台关联", "from-teal-500 to-cyan-500", "应用分身", 8],
        ["Workflow", "自动化引擎", "定时任务、批量操作、自动回复，提升运营效率", "from-orange-500 to-red-500", "应用分身", 9],
      ];
      pfeatures.forEach(f => insPF.run(...f));
    }
    // Patch: initialize products.sections for existing products (if NULL or empty)
    try {
      const prodCheck = db.prepare("SELECT id, sections FROM products WHERE sections IS NULL OR sections = '' OR sections = '[]'").all();
      if (prodCheck.length > 0) {
        const sectionMap = {
          "cloudphone": [
            { name: "核心亮点", items: [{key:"启动速度",value:"≤10 秒"},{key:"全球节点",value:"50+"},{key:"在线率",value:"99.9%"}] },
            { name: "技术规格", items: [{key:"CPU",value:"4-8 核"},{key:"内存",value:"4-16 GB"},{key:"存储",value:"64-256 GB"},{key:"系统",value:"Android 12+"}] },
          ],
          "sandbox": [
            { name: "核心亮点", items: [{key:"隔离级别",value:"系统级"},{key:"重置速度",value:"≤3 秒"},{key:"并发上限",value:"100+"}] },
            { name: "技术规格", items: [{key:"网络监控",value:"完整支持"},{key:"API",value:"RESTful"},{key:"脚本",value:"Python/Shell"}] },
          ],
          "clone": [
            { name: "核心亮点", items: [{key:"分身上限",value:"无上限"},{key:"设备指纹",value:"独立唯一"},{key:"防关联",value:"100%"}] },
            { name: "技术规格", items: [{key:"自动化",value:"内置引擎"},{key:"批量管理",value:"分组标签"},{key:"适配应用",value:"全通用"}] },
          ],
        };
        const updSections = db.prepare("UPDATE products SET sections=? WHERE id=?");
        prodCheck.forEach(function(p) {
          var s = sectionMap[p.id] || [];
          updSections.run(JSON.stringify(s), p.id);
        });
      }
    } catch(e) { /* sections column might not exist yet */ }
    return;
  }

  // Site Settings
  const settings = db.prepare("INSERT OR REPLACE INTO site_settings (key, value, is_visible) VALUES (?, ?, ?)");
  settings.run("site_name", "CloudNest", 1);
  settings.run("site_title", "CloudNest - 云手机·沙箱·分身 | 云端虚拟化服务平台", 1);
  settings.run("site_description", "CloudNest 专注云端虚拟化技术，提供云手机、沙箱环境、应用分身三大核心解决方案。", 1);
  settings.run("telegram_username", "CloudNestSupport", 1);
  settings.run("telegram_link", "https://t.me/CloudNestSupport", 1);
  settings.run("email", "support@cloudnest.com", 1);
  settings.run("instagram", "@cloudnest_official", 1);
  settings.run("whatsapp", "+1 (555) 123-4567", 1);
  // Telegram 分位置链接（独立于全局 telegram_link，设为空字符串表示默认使用 telegram_link）
  settings.run("telegram_nav_link", "", 1);
  settings.run("telegram_hero_link", "", 1);
  settings.run("telegram_cta_link", "", 1);
  settings.run("telegram_help_link", "", 1);
  settings.run("telegram_products_link", "", 1);
  // 页脚公司简介（独立于 SEO 描述 site_description）
  settings.run("footer_description", "CloudNest 专注云端虚拟化技术，提供云手机、沙箱环境、应用分身三大核心解决方案。", 1);

  // Contact Info
  const insContact = db.prepare("INSERT INTO contact_info (icon, title, content, gradient, sort_order) VALUES (?, ?, ?, ?, ?)");
  const contacts = [
    ["Send", "Telegram", "@CloudNestSupport", "from-blue-500 to-cyan-500", 1],
    ["Mail", "电子邮箱", "support@cloudnest.com", "from-indigo-500 to-purple-500", 2],
    ["Instagram", "Instagram", "@cloudnest_official", "from-pink-500 to-purple-500", 3],
    ["MessageCircle", "WhatsApp", "+1 (555) 123-4567", "from-green-500 to-emerald-500", 4],
  ];
  contacts.forEach(c => insContact.run(...c));

  // Products
  const insProduct = db.prepare("INSERT INTO products (id, title, subtitle, description, gradient, highlights, features, specs, icon, sort_order) VALUES (?,?,?,?,?,?,?,?,?,?)");
  const products = [
    [
      "cloudphone", "云手机", "云端独立 Android 实例，随时随地在线",
      "CloudPhone 为您提供运行在云端的真实 Android 操作系统。无需购买额外硬件，即可拥有独立的手机环境，7×24 小时持续运行，不受本地设备限制。",
      "from-indigo-500 to-blue-500",
      JSON.stringify([{text:"10 秒快速启动"},{text:"全球 50+ 节点"},{text:"7×24 小时在线"}]),
      JSON.stringify([
        {title:"独立系统环境",desc:"每台云手机拥有独立 CPU、内存、存储和操作系统，互不干扰，运行稳定。"},
        {title:"任意 APK 安装",desc:"支持上传和安装任意 Android 应用，无需 Root 权限，自由掌控您的云端设备。"},
        {title:"独立 IP 地址",desc:"每台云手机分配独立公网 IP，地理位置可选，满足多地区业务需求。"},
        {title:"Web 远程操控",desc:"通过浏览器即可远程操控云手机，支持触屏、键盘输入，无需安装客户端。"},
        {title:"自动备份还原",desc:"定时快照备份，随时还原到任意时间点，数据安全无忧。"},
        {title:"弹性扩容",desc:"按需创建或销毁实例，从 1 台到 100 台随时扩展，灵活应对业务增长。"},
      ]),
      JSON.stringify([
        {label:"CPU 核心",value:"4-8 核"},{label:"运行内存",value:"4-16 GB"},{label:"存储空间",value:"64-256 GB"},
        {label:"系统版本",value:"Android 12+"},{label:"网络带宽",value:"100 Mbps+"},{label:"启动速度",value:"≤10 秒"},
      ]),
      "Smartphone", 1,
    ],
    [
      "sandbox", "沙箱环境", "应用隔离运行，安全无痕测试",
      "Sandbox 为您打造完全隔离的虚拟化 Android 环境。所有操作在沙箱内独立完成，不影响宿主设备，适合应用测试、安全审计、敏感操作等场景。",
      "from-purple-500 to-pink-500",
      JSON.stringify([{text:"完全隔离"},{text:"即开即用"},{text:"秒级重置"}]),
      JSON.stringify([
        {title:"完全环境隔离",desc:"沙箱内所有操作与宿主系统完全隔离，文件、网络、进程互不影响，确保安全。"},
        {title:"一键重置还原",desc:"测试完成后一键重置，恢复纯净环境，不留任何痕迹，支持批量重置。"},
        {title:"网络抓包调试",desc:"内置网络监控和抓包工具，实时查看应用网络行为，辅助安全分析。"},
        {title:"模拟设备信息",desc:"可自定义设备型号、IMEI、Android ID 等信息，模拟真实设备环境。"},
        {title:"安全防护检测",desc:"检测应用的 Root 检测、模拟器检测、VPN 检测等行为，评估应用安全性。"},
        {title:"批量任务管理",desc:"支持批量创建沙箱、批量安装应用、批量执行脚本，提升测试效率。"},
      ]),
      JSON.stringify([
        {label:"隔离级别",value:"系统级"},{label:"重置速度",value:"≤3 秒"},{label:"网络监控",value:"完整支持"},
        {label:"API 接口",value:"RESTful"},{label:"脚本支持",value:"Python/Shell"},{label:"并发上限",value:"100+"},
      ]),
      "Shield", 2,
    ],
    [
      "clone", "应用分身", "多账号同时在线，无限多开",
      "AppClone 让您在一台云手机上同时运行多个独立的应用实例。每个分身拥有独立的数据、配置和运行环境，支持主流社交、通讯、电商应用的无限多开。",
      "from-cyan-500 to-teal-500",
      JSON.stringify([{text:"无限多开"},{text:"独立标识"},{text:"防关联"}]),
      JSON.stringify([
        {title:"无限应用多开",desc:"同一应用支持无限个分身实例，每个独立运行，互不干扰，理论上无上限。"},
        {title:"独立设备标识",desc:"每个分身拥有独立的设备指纹、IP 地址、IMEI 等硬件信息，防止平台关联检测。"},
        {title:"智能标签管理",desc:"为不同分身添加自定义标签和分组，批量操作更轻松，适合大规模运营场景。"},
        {title:"自动化脚本支持",desc:"内置自动化引擎，支持定时任务、自动回复、批量操作等自动化流程。"},
        {title:"数据完全隔离",desc:"每个分身的应用数据、缓存、登录态完全独立，杜绝数据混淆风险。"},
        {title:"主流通用适配",desc:"完美适配 WhatsApp、Telegram、Instagram、TikTok、微信、LINE 等主流应用。"},
      ]),
      JSON.stringify([
        {label:"分身数量",value:"无上限"},{label:"设备指纹",value:"独立唯一"},{label:"IP 策略",value:"独立/共享"},
        {label:"自动化",value:"内置引擎"},{label:"批量管理",value:"分组标签"},{label:"适配应用",value:"全通用"},
      ]),
      "Layers", 3,
    ],
  ];
  products.forEach(p => insProduct.run(...p));

  // Hero Content
  const insHero = db.prepare("INSERT INTO hero_content (badge, badge_subtitle, main_title, subtitle1, subtitle2, description, stats, primary_btn_text, primary_btn_link, secondary_btn_text, secondary_btn_link, cta_subtitle) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)");
  insHero.run(
    "全新发布",
    "更强大、更全的云手机解决方案",
    "云手机·",
    "沙箱·",
    "分身",
    "CloudNest 为用户提供云端虚拟化服务，让每一台设备都拥有无限可能。从云手机到沙箱环境，从应用到分身，我们为您打造安全、稳定、高效的云端数字空间。",
    JSON.stringify([
      { value: "10,000+", label: "全球用户" },
      { value: "99.9%", label: "稳定运行" },
      { value: "50+", label: "全球节点" },
    ]),
    "立即免费试用",
    "/products",
    "加入 Telegram",
    "",
    "注册即享 7 天免费试用，无需绑定信用卡"
  );

  // Use Cases
  const insUC = db.prepare("INSERT INTO usecases (icon, title, description, gradient, tags, icon_bg, sort_order) VALUES (?,?,?,?,?,?,?)");
  const usecases = [
    ["Music2", "社媒运营", "管理多个社媒账号，独立IP隔离，避免平台关联封号", "from-violet-500 to-fuchsia-500", JSON.stringify(["TikTok","Instagram","Facebook"]), "bg-violet-500/15", 1],
    ["Gamepad2", "游戏多开", "云端运行游戏，24小时挂机，解放本地设备性能", "from-blue-500 to-cyan-400", JSON.stringify(["梦幻西游","原神","王者荣耀"]), "bg-blue-500/15", 2],
    ["ShoppingBag", "跨境电商", "多店铺多账号运营，独立环境管理，保护店铺安全", "from-pink-500 to-rose-500", JSON.stringify(["Amazon","Shopee","独立站"]), "bg-pink-500/15", 3],
    ["Megaphone", "广告投放", "批量管理广告账户，多环境测试投放效果", "from-orange-500 to-amber-400", JSON.stringify(["Facebook","Google","TikTok"]), "bg-orange-500/15", 4],
    ["TestTube", "应用测试", "在隔离沙箱中测试应用安全性，验证兼容性", "from-teal-400 to-emerald-500", JSON.stringify(["安全","兼容","性能"]), "bg-teal-500/15", 5],
  ];
  usecases.forEach(u => insUC.run(...u));

  // Features
  const insFeat = db.prepare("INSERT INTO features (icon, title, description, icon_gradient, sort_order) VALUES (?,?,?,?,?)");
  const feats = [
    ["Zap", "10秒快速启动", "无需等待，即刻拥有云端设备", "from-yellow-400 to-orange-500", 1],
    ["Globe2", "独立IP环境", "每台设备独享公网IP地址", "from-cyan-400 to-blue-500", 2],
    ["CloudDownload", "全球节点覆盖", "50+全球数据中心部署", "from-sky-400 to-indigo-500", 3],
    ["Shield", "无需Root", "系统级功能免Root使用", "from-emerald-400 to-teal-500", 4],
    ["Smartphone", "APK自由安装", "任意Android应用轻松部署", "from-violet-400 to-purple-500", 5],
    ["Headphones", "专业技术支持", "7×24小时在线客服服务", "from-pink-400 to-rose-500", 6],
  ];
  feats.forEach(f => insFeat.run(...f));

  // CTA
  db.prepare("INSERT INTO cta_content (title, subtitle, button_text, secondary_button_text) VALUES (?,?,?,?)").run(
    "准备好开始了吗？",
    "加入 CloudNest，探索云端虚拟化的无限可能",
    "立即免费试用",
    "加入 Telegram"
  );

  // FAQ Categories
  const insCat = db.prepare("INSERT INTO faq_categories (title, gradient, icon, sort_order) VALUES (?,?,?,?)");
  const cats = [
    ["快速入门", "from-blue-500 to-cyan-500", "BookOpen", 1],
    ["云手机使用", "from-purple-500 to-pink-500", "Smartphone", 2],
    ["沙箱环境", "from-indigo-500 to-purple-500", "Shield", 3],
    ["应用分身", "from-green-500 to-emerald-500", "Copy", 4],
    ["常见问题", "from-orange-500 to-red-500", "AlertCircle", 5],
  ];
  cats.forEach(c => insCat.run(...c));

  // FAQ Items
  const insFaq = db.prepare("INSERT INTO faq_items (category_id, question, answer, sort_order) VALUES (?,?,?,?)");
  const faqs = [
    [1, "CloudNest 是什么？", "CloudNest 是一款云端虚拟化服务平台，为您提供云手机、沙箱环境和应用分身三大核心功能。", 1],
    [1, "如何注册并开始使用？", "访问我们的官网，点击右上角「联系 Telegram」与客服取得联系，我们将为您创建账号并指导您完成首次配置。", 2],
    [1, "支持哪些设备访问？", "云手机通过 Web 浏览器即可访问，支持 Windows、macOS、Linux、iOS 和 Android 等主流平台。", 3],
    [2, "什么是云手机？", "云手机是一台运行在云端服务器的真实 Android 设备。它拥有独立的 CPU、内存、存储和 IP 地址。", 1],
    [2, "云手机的性能如何？", "基础版配备 4 核 CPU / 4GB 内存 / 64GB 存储，高级版可达 8 核 / 8GB / 128GB。开机仅需 10 秒。", 2],
    [2, "可以安装任意 APK 吗？", "是的，云手机支持自由安装 APK 文件。您可以通过文件上传、远程推送或直接下载等方式安装。", 3],
    [2, "云手机的数据安全吗？", "所有云手机实例均运行在独立的沙箱环境中，彼此完全隔离。数据传输全程加密。", 4],
    [3, "什么是沙箱环境？", "沙箱环境是一个完全隔离的虚拟化 Android 运行环境，所有操作都不会影响宿主设备。", 1],
    [3, "沙箱和云手机有什么区别？", "沙箱侧重于安全隔离和应用测试，云手机更接近于完整的日常使用设备。", 2],
    [3, "如何在沙箱中测试应用？", "登录控制台后创建沙箱实例，上传 APK 文件即可在隔离环境中运行和测试。", 3],
    [4, "什么是应用分身？", "应用分身允许您在同一台设备上同时运行多个账号的同一应用，互不干扰。", 1],
    [4, "应用分身会被封号吗？", "每个分身拥有独立的设备标识和 IP 地址，主应用无法检测到分身的存在。", 2],
    [4, "支持哪些应用的分身？", "支持所有 Android 应用，包括 WhatsApp、Telegram、Instagram、TikTok 等主流应用。", 3],
    [5, "如何支付？", "目前我们支持通过 Telegram Bot 进行套餐选购和支付。", 1],
    [5, "不滿意可以退款嗎？", "我们提供 24 小时免费试用期。已购买的套餐如需退款，请在购买后 7 天内联系客服。", 2],
    [5, "遇到问题如何联系技术支持？", "您可以通过 Telegram、邮箱、Instagram 或 WhatsApp 联系我们。", 3],
  ];
  faqs.forEach(f => insFaq.run(...f));

  // About Content
  db.prepare("INSERT INTO about_content (page_title, page_subtitle, heading, intro_paragraph_1, intro_paragraph_2, card_values) VALUES (?,?,?,?,?,?)").run(
    "关于我们",
    "致力于为用户提供安全、稳定、高效的云虚拟环境解决方案",
    "公司简介",
    "CloudNest 是一家专注于云端虚拟化技术的科技公司，致力于为全球用户提供安全、稳定、高效的云手机、沙箱环境和应用分身解决方案。我们的技术团队在云计算、Android虚拟化、网络安全等领域拥有深厚的技术积累和丰富的行业经验。",
    "CloudNest 核心产品覆盖云手机、沙箱环境、应用分身三大领域，广泛应用于社媒运营、游戏多开、跨境电商、广告投放和应用测试等场景。凭借独立IP环境、全球节点部署、无需Root操作等核心技术优势，我们已为全球 10,000+ 用户提供稳定可靠的云端虚拟化服务。",
    JSON.stringify([
      { icon: "Target", title: "使命", description: "让每个人都能拥有一台安全、稳定的云端设备" },
      { icon: "Users", title: "团队", description: "资深云计算与安全专家团队，深耕虚拟化技术领域" },
      { icon: "Globe2", title: "覆盖", description: "全球50+节点部署，服务覆盖100+国家和地区" },
      { icon: "Shield", title: "信赖", description: "10,000+用户选择，99.9%稳定运行保障" },
    ])
  );

  // Nav Menus
  const insNav = db.prepare("INSERT INTO nav_menus (label, type, target, sort_order, is_visible) VALUES (?,?,?,?,?)");
  [
    ["首页", "route", "/", 1, 1],
    ["产品", "route", "/products", 2, 1],
    ["优势", "scroll", "advantages", 3, 1],
    ["应用场景", "scroll", "usecases", 4, 1],
    ["文章中心", "route", "/posts", 5, 1],
    ["帮助中心", "route", "/help", 6, 1],
  ].forEach(m => insNav.run(...m));

  // Pricing Plans (3 per product)
  const insPlan = db.prepare("INSERT INTO pricing_plans (product_id, name, price, period, description, features, highlighted, button_text, gradient, sort_order, is_visible) VALUES (?,?,?,?,?,?,?,?,?,?,?)");
  const plans = [
    // 云手机 pricing
    ["cloudphone", "入门版", "¥99", "/月", "适合个人用户，1台云手机轻松体验云端之力",
      JSON.stringify(["1 台云手机实例","4 核 CPU · 4GB 内存","64GB 存储空间","独立公网 IP","Web 浏览器访问","7×24 小时在线","基础技术支持"]),
      0, "立即试用", "from-slate-500 to-gray-500", 1, 1],
    ["cloudphone", "专业版", "¥299", "/月", "适合专业用户，5台云手机满足多业务需求",
      JSON.stringify(["5 台云手机实例","6 核 CPU · 8GB 内存","128GB 存储空间","独立公网 IP × 5","API 接口调用","自动备份还原","优先技术支持"]),
      1, "立即购买", "from-indigo-500 to-blue-600", 2, 1],
    ["cloudphone", "企业版", "¥999", "/月", "适合大型团队，20台云手机 + 全套管理工具",
      JSON.stringify(["20 台云手机实例","8 核 CPU · 16GB 内存","256GB 存储空间","独立公网 IP × 20","专属 API 接口","批量管理控制台","7×24 小时专属客服","定制化部署方案"]),
      0, "联系我们", "from-purple-500 to-pink-600", 3, 1],
    // 沙箱环境 pricing
    ["sandbox", "入门版", "¥149", "/月", "适合安全测试入门，5个沙箱实例独立隔离",
      JSON.stringify(["5 个沙箱实例","系统级完全隔离","秒级重置还原","网络抓包审计","APK 自由安装","基础技术支持"]),
      0, "立即试用", "from-slate-500 to-gray-500", 1, 1],
    ["sandbox", "专业版", "¥399", "/月", "适合安全团队，20个沙箱 + 高级审计工具",
      JSON.stringify(["20 个沙箱实例","模拟设备信息","批量任务管理","API 脚本支持","高级网络监控","优先技术支持"]),
      1, "立即购买", "from-indigo-500 to-blue-600", 2, 1],
    ["sandbox", "企业版", "¥1299", "/月", "适合企业安全部门，无限沙箱 + 全套安全套件",
      JSON.stringify(["100+ 沙箱实例","自定义安全策略","自动化安全扫描","私有化部署可选","专属安全顾问","7×24 小时应急响应"]),
      0, "联系我们", "from-purple-500 to-pink-600", 3, 1],
    // 应用分身 pricing
    ["clone", "入门版", "¥79", "/月", "适合个人用户，10个分身轻松管理多账号",
      JSON.stringify(["10 个应用分身","独立设备指纹","独立 IP 地址","支持主流通用应用","基础技术支持"]),
      0, "立即试用", "from-slate-500 to-gray-500", 1, 1],
    ["clone", "专业版", "¥249", "/月", "适合运营团队，50个分身 + 自动化引擎",
      JSON.stringify(["50 个应用分身","智能标签分组","自动化脚本引擎","定时任务支持","批量操作","优先技术支持"]),
      1, "立即购买", "from-indigo-500 to-blue-600", 2, 1],
    ["clone", "企业版", "¥799", "/月", "适合大型运营，无上限分身 + 全套自动化方案",
      JSON.stringify(["无限应用分身","自定义设备指纹","专属 IP 池","高级自动化引擎","API 深度集成","7×24 小时专属客服"]),
      0, "联系我们", "from-purple-500 to-pink-600", 3, 1],
  ];
  plans.forEach(p => insPlan.run(...p));

  // Product Features
  const insPF = db.prepare("INSERT INTO product_features (icon, title, description, gradient, category, sort_order) VALUES (?,?,?,?,?,?)");
  const pfeatures = [
    ["Zap", "10秒急速启动", "从创建到可用只需 10 秒，无需等待即可获得云端设备", "from-amber-500 to-orange-500", "云手机", 1],
    ["Wifi", "独立公网 IP", "每台云手机独享公网 IP，可选全球多地节点", "from-blue-500 to-cyan-500", "云手机", 2],
    ["MonitorPlay", "Web 远程操控", "浏览器即可远程操控，支持触屏/键盘/文件上传", "from-green-500 to-emerald-500", "云手机", 3],
    ["Shield", "系统级隔离", "沙箱与宿主完全隔离，文件/网络/进程互不影响", "from-purple-500 to-pink-500", "沙箱环境", 4],
    ["RefreshCw", "秒级重置还原", "一键恢复到纯净初始状态，不留任何使用痕迹", "from-cyan-500 to-blue-500", "沙箱环境", 5],
    ["SearchCode", "网络抓包审计", "内置网络监控工具，实时分析应用行为", "from-rose-500 to-red-500", "沙箱环境", 6],
    ["Copy", "无限应用分身", "同一应用支持无上限分身实例，每个独立运行", "from-indigo-500 to-purple-500", "应用分身", 7],
    ["Fingerprint", "独立设备指纹", "每个分身拥有唯一 IMEI/ID/IP，防止平台关联", "from-teal-500 to-cyan-500", "应用分身", 8],
    ["Workflow", "自动化引擎", "定时任务、批量操作、自动回复，提升运营效率", "from-orange-500 to-red-500", "应用分身", 9],
  ];
  pfeatures.forEach(f => insPF.run(...f));

  // ===== Seed new tables =====

  // Themes
  const tc = db.prepare("SELECT COUNT(*) as c FROM themes").get();
  if (tc.c === 0) {
    const insTheme = db.prepare("INSERT INTO themes (name, tokens, is_default) VALUES (?,?,?)");
    insTheme.run("暗色玻璃态 (默认)", JSON.stringify({
      background: "220 25% 8%",
      foreground: "210 40% 98%",
      card: "220 20% 12%",
      primary: "200 100% 50%",
      secondary: "280 60% 55%",
      accent: "280 60% 55%",
      muted: "220 15% 20%",
      border: "220 15% 25%",
      radius: "1rem",
    }), 1);
    insTheme.run("亮色商务风", JSON.stringify({
      background: "210 40% 98%",
      foreground: "220 25% 10%",
      card: "0 0% 100%",
      primary: "200 90% 40%",
      secondary: "280 50% 45%",
      accent: "280 50% 45%",
      muted: "210 20% 92%",
      border: "210 15% 85%",
      radius: "0.75rem",
    }), 0);
  }

  // Languages
  const lc = db.prepare("SELECT COUNT(*) as c FROM languages").get();
  if (lc.c === 0) {
    const insLang = db.prepare("INSERT INTO languages (code, name, native_name, is_default, is_visible, sort_order) VALUES (?,?,?,?,?,?)");
    insLang.run("zh-CN", "简体中文", "简体中文", 1, 1, 1);
    insLang.run("en-US", "English", "English", 0, 1, 2);
    insLang.run("ja-JP", "Japanese", "日本語", 0, 1, 3);
  }
  // Patch: fix garbled (mojibake) language names from earlier encoding issues
  // Detects replacement chars or missing CJK characters in Chinese language rows
  {
    const langRows = db.prepare("SELECT code, name, native_name FROM languages").all();
    const updLangFix = db.prepare("UPDATE languages SET name=?, native_name=? WHERE code=?");
    const correctLangNames = { "zh-CN": ["简体中文","简体中文"], "en-US": ["English","English"], "ja-JP": ["Japanese","日本語"] };
    langRows.forEach(function(row) {
      var correct = correctLangNames[row.code];
      if (!correct) return;
      var isGarbled = /[\uFFFD]/.test(row.name) || /[\uFFFD]/.test(row.native_name);
      if (row.code === "zh-CN" && !/[\u4e00-\u9fff]/.test(row.name)) isGarbled = true;
      if (isGarbled) updLangFix.run(correct[0], correct[1], row.code);
    });
  }

  // Categories (product categories)
  const cc = db.prepare("SELECT COUNT(*) as c FROM categories").get();
  if (cc.c === 0) {
    const insCat = db.prepare("INSERT INTO categories (name, slug, parent_id, type, sort_order) VALUES (?,?,?,?,?)");
    insCat.run("云手机", "cloud-phone", null, "product", 1);
    insCat.run("沙箱环境", "sandbox", null, "product", 2);
    insCat.run("应用分身", "app-clone", null, "product", 3);
    insCat.run("行业资讯", "industry-news", null, "post", 4);
    insCat.run("产品更新", "product-updates", null, "post", 5);
    insCat.run("技术博客", "tech-blog", null, "post", 6);
  }

  // Default slider
  const sc = db.prepare("SELECT COUNT(*) as c FROM sliders").get();
  if (sc.c === 0) {
    const insSlider = db.prepare("INSERT INTO sliders (name, slug, description, sort_order) VALUES (?,?,?,?)");
    insSlider.run("首页主轮播", "home-hero", "首页顶部轮播图", 1);
  }
}

module.exports = { initDB, seedDB, DB_PATH };
