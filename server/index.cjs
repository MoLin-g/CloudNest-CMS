const express = require("express");
const cors = require("cors");
const { initDB, seedDB } = require("./database.cjs");

const db = initDB();
seedDB(db);

const app = express();
const PORT = 3001;
app.use(cors());
app.use(express.json({ limit: "10mb" }));
const path = require("path");
const fs = require("fs");
app.use("/uploads", express.static(path.join(__dirname, "..", "public", "uploads")));

// ========== JSON field parser for DB fields stored as JSON strings ==========
function parseJsonFields(list, fields) {
  list.forEach(function(row) {
    fields.forEach(function(field) {
      if (typeof row[field] === 'string') {
        try { row[field] = JSON.parse(row[field]); } catch(e) { row[field] = []; }
      }
      if (!row[field]) row[field] = [];
    });
  });
}

// ========== Auth + Rate Limit ==========
const loginRateMap = new Map();
app.post("/api/auth/login", (req, res) => {
  const ip = req.ip || "unknown";
  const { username, password } = req.body;
  const entry = loginRateMap.get(ip);
  const now = Date.now();
  if (entry && now - entry.time < 900000 && entry.count >= 5) {
    return res.status(429).json({ success: false, message: "登录尝试过多，15分钟后重试" });
  }
  if (!entry || now - entry.time > 900000) { loginRateMap.set(ip, { count: 1, time: now }); }
  else { entry.count++; }
  const admin = db.prepare("SELECT id, username, display_name, role, permissions, is_active FROM admins WHERE username = ? AND password = ?").get(username, password);
  if (admin) {
    if (admin.is_active === 0) return res.status(403).json({ success: false, message: "账号已被禁用" });
    loginRateMap.delete(ip);
    try { admin.permissions = JSON.parse(admin.permissions || "[]"); } catch(e) { admin.permissions = []; }
    db.prepare("INSERT INTO admin_logs (action, target, detail, ip) VALUES (?,?,?,?)").run("登录", admin.username, "role=" + admin.role, ip);
    return res.json({ success: true, token: "user-" + admin.id, user: admin });
  }
  res.status(401).json({ success: false, message: "用户名或密码错误" });
});

// ========== User Management ==========
// Roles: superadmin (all access), editor (content+products+cms+media), viewer (read-only)

// List all users
app.get("/api/users", function (req, res) {
  try {
    var users = db.prepare("SELECT id, username, display_name, role, permissions, is_active, created_at FROM admins ORDER BY id").all();
    users.forEach(function(u) {
      try { u.permissions = JSON.parse(u.permissions || "[]"); } catch(e) { u.permissions = []; }
    });
    res.json(users);
  } catch(e) { res.json([]); }
});

// Create user
app.post("/api/users", function (req, res) {
  var { username, password, display_name, role, permissions } = req.body;
  if (!username || !password) return res.status(400).json({ message: "用户名和密码不能为空" });
  if (username.length < 3) return res.status(400).json({ message: "用户名至少3个字符" });
  if (password.length < 6) return res.status(400).json({ message: "密码至少6个字符" });
  // Check duplicate
  var existing = db.prepare("SELECT id FROM admins WHERE username = ?").get(username);
  if (existing) return res.status(409).json({ message: "用户名已存在" });
  var perms = JSON.stringify(permissions || []);
  try {
    db.prepare("INSERT INTO admins (username, password, display_name, role, permissions) VALUES (?,?,?,?,?)")
      .run(username, password, display_name || username, role || "editor", perms);
    db.prepare("INSERT INTO admin_logs (action, target, detail) VALUES (?,?,?)").run("创建用户", username, "role=" + (role || "editor"));
    res.json({ success: true });
  } catch(e) { res.status(500).json({ message: e.message }); }
});

// Update user (role, permissions, display_name, is_active)
app.put("/api/users/:id", function (req, res) {
  var id = req.params.id;
  var fields = [];
  var vals = [];
  if (req.body.display_name !== undefined) { fields.push("display_name=?"); vals.push(req.body.display_name); }
  if (req.body.role !== undefined) { fields.push("role=?"); vals.push(req.body.role); }
  if (req.body.permissions !== undefined) { fields.push("permissions=?"); vals.push(JSON.stringify(req.body.permissions)); }
  if (req.body.is_active !== undefined) { fields.push("is_active=?"); vals.push(req.body.is_active); }
  if (!fields.length) return res.json({ success: true });
  vals.push(id);
  try {
    db.prepare("UPDATE admins SET " + fields.join(",") + " WHERE id=?").run(...vals);
    res.json({ success: true });
  } catch(e) { res.status(500).json({ message: e.message }); }
});

// Change password (no old password required)
app.put("/api/users/:id/password", function (req, res) {
  var id = req.params.id;
  var { newPassword } = req.body;
  if (!newPassword || newPassword.length < 6) return res.status(400).json({ message: "新密码至少6个字符" });
  try {
    db.prepare("UPDATE admins SET password=? WHERE id=?").run(newPassword, id);
    res.json({ success: true });
  } catch(e) { res.status(500).json({ message: e.message }); }
});

// Delete user
app.delete("/api/users/:id", function (req, res) {
  var id = parseInt(req.params.id);
  // Prevent deleting the last superadmin
  var target = db.prepare("SELECT username, role FROM admins WHERE id=?").get(id);
  if (!target) return res.status(404).json({ message: "用户不存在" });
  if (target.role === "superadmin") {
    var superCount = db.prepare("SELECT COUNT(*) as c FROM admins WHERE role='superadmin'").get().c;
    if (superCount <= 1) return res.status(400).json({ message: "不能删除最后一个超级管理员" });
  }
  try {
    db.prepare("DELETE FROM admins WHERE id=?").run(id);
    db.prepare("INSERT INTO admin_logs (action, target, detail) VALUES (?,?,?)").run("删除用户", target.username, "");
    res.json({ success: true });
  } catch(e) { res.status(500).json({ message: e.message }); }
});

// Get current user info (for permission filtering)
app.get("/api/auth/me", function (req, res) {
  // Extract user id from token (Bearer user-{id} in Authorization header, or ?token= query param)
  var userId = null;
  var token = req.query.token || "";
  if (!token) {
    var auth = req.headers.authorization || "";
    token = auth.startsWith("Bearer ") ? auth.slice(7) : auth;
  }
  if (token.startsWith("user-")) userId = parseInt(token.slice(5));
  // Fallback: if no valid token, return first active superadmin (legacy support)
  var admin;
  if (userId) {
    admin = db.prepare("SELECT id, username, display_name, role, permissions FROM admins WHERE id=? AND (is_active IS NULL OR is_active=1)").get(userId);
  }
  if (!admin) {
    admin = db.prepare("SELECT id, username, display_name, role, permissions FROM admins WHERE role='superadmin' AND (is_active IS NULL OR is_active=1) LIMIT 1").get();
  }
  if (admin) {
    try { admin.permissions = JSON.parse(admin.permissions || "[]"); } catch(e) { admin.permissions = []; }
    res.json(admin);
  } else {
    res.status(404).json({ message: "No admin found" });
  }
});

// ========== Stats ==========
app.get("/api/stats", (req, res) => {
  const counts = {};
  try { counts.products = db.prepare("SELECT COUNT(*) as c FROM products").get().c || 0; } catch (e) {}
  try { counts.product_features = db.prepare("SELECT COUNT(*) as c FROM product_features").get().c || 0; } catch (e) {}
  try { counts.pricing_plans = db.prepare("SELECT COUNT(*) as c FROM pricing_plans").get().c || 0; } catch (e) {}
  try { counts.hero_content = db.prepare("SELECT COUNT(*) as c FROM hero_content").get().c || 0; } catch (e) {}
  try { counts.posts = db.prepare("SELECT COUNT(*) as c FROM posts").get().c || 0; } catch (e) {}
  try { counts.pages = db.prepare("SELECT COUNT(*) as c FROM custom_pages").get().c || 0; } catch (e) {}
  res.json(counts);
});

// ========== Site Settings ==========
app.get("/api/site-settings", (req, res) => {
  const rows = db.prepare("SELECT key, value, is_visible FROM site_settings ORDER BY key").all();
  if (req.query.format === "array") return res.json(rows);
  const obj = {}; rows.forEach(function (r) { obj[r.key] = r.value; });
  res.json(obj);
});
app.put("/api/site-settings/batch", (req, res) => {
  const items = req.body;
  const stmt = db.prepare("INSERT OR REPLACE INTO site_settings (key,value,is_visible) VALUES (?,?,?)");
  items.forEach(function (item) { stmt.run(item.key, item.value, (item.is_visible === undefined ? 1 : item.is_visible)); });
  res.json({ success: true });
});
app.post("/api/site-settings", function (req, res) {
  var item = req.body;
  try {
    db.prepare("INSERT OR REPLACE INTO site_settings (key,value,is_visible) VALUES (?,?,?)").run(item.key, item.value || "", (item.is_visible === undefined ? 1 : item.is_visible));
    res.json({ success: true });
  } catch(e) { res.status(500).json({ message: e.message }); }
});
app.delete("/api/site-settings/:key", function (req, res) {
  try { db.prepare("DELETE FROM site_settings WHERE key=?").run(decodeURIComponent(req.params.key)); res.json({ success: true }); }
  catch(e) { res.status(500).json({ message: e.message }); }
});

// ========== Hero ==========
app.get("/api/hero", (req, res) => {
  const rows = db.prepare("SELECT * FROM hero_content ORDER BY sort_order").all();
  rows.forEach(function (r) { try { r.stats = JSON.parse(r.stats); } catch (e) { r.stats = []; } });
  if (req.query.format === "array") return res.json(rows);
  res.json(rows[0] || {});
});
app.put("/api/hero/batch", (req, res) => {
  const items = req.body;
  const stmt = db.prepare("UPDATE hero_content SET badge=?,badge_subtitle=?,main_title=?,subtitle1=?,subtitle2=?,description=?,stats=?,primary_btn_text=?,primary_btn_link=?,secondary_btn_text=?,secondary_btn_link=?,cta_subtitle=?,hero_image=?,is_visible=? WHERE id=?");
  items.forEach(function (item) {
    stmt.run(item.badge || "", item.badge_subtitle || "", item.main_title || "", item.subtitle1 || "", item.subtitle2 || "", item.description || "", JSON.stringify(item.stats || []), item.primary_btn_text || "", item.primary_btn_link || "", item.secondary_btn_text || "", item.secondary_btn_link || "", item.cta_subtitle || "", item.hero_image || "", item.is_visible || 1, item.id);
  });
  res.json({ success: true });
});
app.post("/api/hero", (req, res) => {
  const item = req.body;
  db.prepare("INSERT INTO hero_content (badge,badge_subtitle,main_title,subtitle1,subtitle2,description,stats,primary_btn_text,primary_btn_link,secondary_btn_text,secondary_btn_link,cta_subtitle,hero_image) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)")
    .run(item.badge || "", item.badge_subtitle || "", item.main_title || "", item.subtitle1 || "", item.subtitle2 || "", item.description || "", JSON.stringify(item.stats || []), item.primary_btn_text || "", item.primary_btn_link || "", item.secondary_btn_text || "", item.secondary_btn_link || "", item.cta_subtitle || "", item.hero_image || "");
  res.json({ success: true });
});
// DELETE single hero
app.delete("/api/hero/:id", function (req, res) {
  try { db.prepare("DELETE FROM hero_content WHERE id=?").run(req.params.id); res.json({ success: true }); }
  catch(e) { res.status(500).json({ message: e.message }); }
});

// ========== Generic CRUD ==========
var crudMap = {
  "contact-info": "contact_info", "usecases": "usecases", "features": "features",
  "cta": "cta_content", "about": "about_content", "nav-menus": "nav_menus",
  "products": "products", "posts": "posts",
  "categories": "categories", "sliders": "sliders", "media": "media",
  "inquiries": "inquiries", "themes": "themes", "languages": "languages", "slider-items": "slider_items", "product-features": "product_features",
  "pricing": "pricing_plans"
};

// Table-specific config: JSON fields (need stringify before save, parse after load) and primary key
var tableJsonFields = {
  about_content: ['card_values'], usecases: ['tags'], themes: ['tokens'],
  products: ['highlights','features','specs','sections'], pricing_plans: ['features']
};
var tablePrimaryKey = {
  languages: 'code'
};
function getPrimaryKey(tableName) { return tablePrimaryKey[tableName] || 'id'; }
// Serialize any object/array values to JSON string before SQLite binding
function serializeJsonFields(item, tableName) {
  var jsonFields = tableJsonFields[tableName] || [];
  var out = {};
  Object.keys(item).forEach(function(k) {
    var v = item[k];
    if (v !== null && v !== undefined && typeof v === 'object') {
      out[k] = JSON.stringify(v);
    } else {
      out[k] = v;
    }
  });
  return out;
}

Object.keys(crudMap).forEach(function (apiName) {
  var tableName = crudMap[apiName];
  var pk = getPrimaryKey(tableName);
  app.get("/api/" + apiName, function (req, res) {
    try {
      var sql = "SELECT * FROM " + tableName;
      var params = [];
      var conditions = [];
      // Support ?type= and ?product_id= filters
      if (req.query.type) { conditions.push("type=?"); params.push(req.query.type); }
      if (req.query.product_id) { conditions.push("product_id=?"); params.push(req.query.product_id); }
      if (conditions.length) sql += " WHERE " + conditions.join(" AND ");
      // Try ORDER BY sort_order, fall back to no ordering if column doesn't exist
      try {
        db.prepare("SELECT sort_order FROM " + tableName + " LIMIT 0").get();
        sql += " ORDER BY sort_order";
      } catch(e) { /* table has no sort_order column */ }
      var rows = db.prepare(sql).all(...params);
      if (tableJsonFields[tableName]) parseJsonFields(rows, tableJsonFields[tableName]);
      res.json(rows);
    } catch (e) {
      try { var rows2 = db.prepare("SELECT * FROM " + tableName).all(); if (tableJsonFields[tableName]) parseJsonFields(rows2, tableJsonFields[tableName]); res.json(rows2); } catch (e2) { res.json([]); }
    }
  });
  app.post("/api/" + apiName, function (req, res) {
    var item = serializeJsonFields(req.body, tableName);
    var keys = Object.keys(item);
    var ph = keys.map(function () { return "?"; }).join(",");
    var vals = keys.map(function (k) { return item[k]; });
    try {
      db.prepare("INSERT INTO " + tableName + " (" + keys.join(",") + ") VALUES (" + ph + ")").run(...vals);
      res.json({ success: true });
    } catch(e) { res.status(500).json({ message: e.message }); }
  });
  app.put("/api/" + apiName, function (req, res) {
    var items = req.body;
    if (!Array.isArray(items)) return res.status(400).json({ message: "invalid" });
    var errs = [];
    items.forEach(function (item) {
      item = serializeJsonFields(item, tableName);
      var keys = Object.keys(item).filter(function (k) { return k !== pk; });
      if (!keys.length) return;
      var sets = keys.map(function (k) { return k + "=?"; }).join(",");
      var vals = keys.map(function (k) { return item[k]; });
      vals.push(item[pk]);
      try {
        db.prepare("UPDATE " + tableName + " SET " + sets + " WHERE " + pk + "=?").run(...vals);
      } catch(e) { errs.push(e.message); }
    });
    if (errs.length) return res.status(500).json({ message: errs.join("; ") });
    res.json({ success: true });
  });
  app.delete("/api/" + apiName + "/:id", function (req, res) {
    try { db.prepare("DELETE FROM " + tableName + " WHERE " + pk + "=?").run(req.params.id); res.json({ success: true }); }
    catch(e) { res.status(500).json({ message: e.message }); }
  });
});

// ========== Pages alias (custom_pages) ==========
// Posts by slug (must be before generic CRUD)
app.get("/api/posts/:slug", function (req, res) {
  var post = db.prepare("SELECT * FROM posts WHERE slug = ?").get(req.params.slug);
  if (!post) return res.status(404).json({ message: "Not found" });
  res.json(post);
});
// Pages by slug (must be before generic CRUD)
app.get("/api/pages/:slug", function (req, res) {
  var page = db.prepare("SELECT * FROM custom_pages WHERE slug = ?").get(req.params.slug);
  if (!page) return res.status(404).json({ message: "Not found" });
  res.json(page);
});
// Slider items by slug
app.get("/api/sliders/:slug/items", function (req, res) {
  var slider = db.prepare("SELECT id FROM sliders WHERE slug = ?").get(req.params.slug);
  if (!slider) return res.json([]);
  res.json(db.prepare("SELECT * FROM slider_items WHERE slider_id = ? ORDER BY sort_order").all(slider.id));
});
app.get("/api/pages", function (req, res) { res.json(db.prepare("SELECT * FROM custom_pages ORDER BY id").all()); });
app.post("/api/pages", function (req, res) {
  var item = req.body;
  db.prepare("INSERT INTO custom_pages (title,slug,content,meta_title,meta_description,status) VALUES (?,?,?,?,?,?)").run(item.title || "", item.slug || "", item.content || "", item.meta_title || "", item.meta_description || "", item.status || "draft");
  res.json({ success: true });
});
app.put("/api/pages/:id", function (req, res) {
  var item = req.body;
  // Dynamic update: only set fields that are provided in the request
  var keys = Object.keys(item).filter(function(k) { return k !== "id"; });
  if (!keys.length) return res.json({ success: true });
  var sets = keys.map(function(k) { return k + "=?"; }).join(",");
  var vals = keys.map(function(k) { return item[k]; });
  vals.push(req.params.id);
  try {
    db.prepare("UPDATE custom_pages SET " + sets + " WHERE id=?").run(...vals);
    res.json({ success: true });
  } catch(e) {
    res.status(500).json({ message: e.message });
  }
});
app.delete("/api/pages/:id", function (req, res) { db.prepare("DELETE FROM custom_pages WHERE id=?").run(req.params.id); res.json({ success: true }); });

// ========== Pricing with all=1 ==========
app.get("/api/pricing", function (req, res) {
  var rows = db.prepare("SELECT * FROM pricing_plans ORDER BY sort_order").all();
  rows.forEach(function (r) {
    if (typeof r.features === "string") { try { r.features = JSON.parse(r.features); } catch (e) { r.features = []; } }
    else if (!r.features) r.features = [];
  });
  res.json(rows);
});

// ========== FAQ grouped by category ==========
app.get("/api/faq", function (req, res) {
  var cats = db.prepare("SELECT * FROM faq_categories ORDER BY sort_order").all();
  var items = db.prepare("SELECT * FROM faq_items ORDER BY sort_order").all();
  var grouped = cats.map(function (cat) {
    return Object.assign({}, cat, { questions: items.filter(function (q) { return q.category_id === cat.id; }) });
  });
  res.json(grouped);
});
// FAQ category single update
app.put("/api/faq/categories/:id", function (req, res) {
  var item = req.body;
  db.prepare("UPDATE faq_categories SET title=?, icon=?, gradient=?, sort_order=? WHERE id=?")
    .run(item.title || "", item.icon || "BookOpen", item.gradient || "", item.sort_order || 0, req.params.id);
  res.json({ success: true });
});
app.post("/api/faq/categories", function (req, res) {
  var item = req.body;
  try {
    var info = db.prepare("INSERT INTO faq_categories (title, icon, gradient, sort_order) VALUES (?,?,?,?)")
      .run(item.title || "新分类", item.icon || "BookOpen", item.gradient || "from-indigo-500 to-violet-500", item.sort_order || 0);
    res.json({ success: true, id: info.lastInsertRowid });
  } catch(e) { res.status(500).json({ message: e.message }); }
});
app.delete("/api/faq/categories/:id", function (req, res) {
  try {
    db.prepare("DELETE FROM faq_items WHERE category_id=?").run(req.params.id);
    db.prepare("DELETE FROM faq_categories WHERE id=?").run(req.params.id);
    res.json({ success: true });
  } catch(e) { res.status(500).json({ message: e.message }); }
});
// FAQ item CRUD
app.put("/api/faq/items/:id", function (req, res) {
  var item = req.body;
  db.prepare("UPDATE faq_items SET question=?, answer=?, category_id=?, sort_order=? WHERE id=?")
    .run(item.question || "", item.answer || "", item.category_id || 0, item.sort_order || 0, req.params.id);
  res.json({ success: true });
});
app.post("/api/faq/items", function (req, res) {
  var item = req.body;
  db.prepare("INSERT INTO faq_items (category_id, question, answer, sort_order) VALUES (?,?,?,?)")
    .run(item.category_id || 0, item.question || "", item.answer || "", item.sort_order || 0);
  res.json({ success: true });
});
app.delete("/api/faq/items/:id", function (req, res) {
  db.prepare("DELETE FROM faq_items WHERE id=?").run(req.params.id);
  res.json({ success: true });
});

// ========== Product Features ==========
// (All CRUD operations handled by generic CRUD above.
//  The product_features table now has: icon, title, description, gradient, category, sort_order, is_visible)
//  Generic PUT dynamically builds UPDATE from request body keys, which works correctly.

// ========== Media Upload ==========
app.post("/api/media/upload", function (req, res) {
  var item = req.body;
  if (!item.filename || !item.data) return res.status(400).json({ message: "filename and data are required" });
  try {
    var uploadsDir = path.join(__dirname, "..", "public", "uploads");
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
    // Generate unique filename to avoid collisions
    var ext = path.extname(item.filename) || "";
    var basename = path.basename(item.filename, ext).replace(/[^a-zA-Z0-9-_]/g, "_");
    var filename = basename + "-" + Date.now() + ext;
    var filepath = path.join(uploadsDir, filename);
    // Write base64 data to file
    var buffer = Buffer.from(item.data, "base64");
    fs.writeFileSync(filepath, buffer);
    // Insert media record
    db.prepare("INSERT INTO media (filename, original_name, mime_type, size, folder) VALUES (?,?,?,?,?)")
      .run(filename, item.filename, item.mime_type || "application/octet-stream", buffer.length, item.folder || "/");
    res.json({ success: true, filename: filename, url: "/uploads/" + filename });
  } catch(e) { res.status(500).json({ message: e.message }); }
});

// ========== Phase 1: Admin Logs ==========
app.get("/api/admin-logs", function (req, res) {
  var limit = parseInt(req.query.limit) || 50;
  res.json(db.prepare("SELECT * FROM admin_logs ORDER BY created_at DESC LIMIT ?").all(limit));
});

// ========== Phase 1: Backup ==========
var backupDir = path.join(__dirname, "..", "backups");
if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
app.post("/api/backup", function (req, res) {
  var ts = new Date().toISOString().replace(/[:.]/g, "-");
  var filename = "cloudnest-" + ts + ".db";
  var dest = path.join(backupDir, filename);
  var src = path.join(__dirname, "data.db");
  db.pragma("wal_checkpoint(TRUNCATE)");
  fs.copyFileSync(src, dest);
  var stats = fs.statSync(dest);
  db.prepare("INSERT INTO backups (filename,size) VALUES (?,?)").run(filename, stats.size);
  res.json({ success: true, filename: filename, size: stats.size });
});
app.get("/api/backup", function (req, res) { res.json(db.prepare("SELECT * FROM backups ORDER BY created_at DESC LIMIT 20").all()); });

// ========== Phase 3: Redirects ==========
app.get("/api/redirects", function (req, res) { res.json(db.prepare("SELECT * FROM redirects ORDER BY created_at DESC").all()); });
app.post("/api/redirects", function (req, res) {
  var b = req.body;
  db.prepare("INSERT INTO redirects (from_path, to_path) VALUES (?,?)").run(b.from_path, b.to_path);
  res.json({ success: true });
});

// ========== Phase 5: Scheduled ==========
function publishScheduled() {
  try { db.prepare("UPDATE posts SET status='published' WHERE status='scheduled' AND scheduled_at <= datetime('now')").run(); } catch (e) {}
}
publishScheduled(); setInterval(publishScheduled, 60000);
app.get("/api/scheduled", function (req, res) {
  var items = [];
  try { items = items.concat(db.prepare("SELECT id,title,type,scheduled_at FROM posts WHERE status='scheduled'").all()); } catch (e) {}
  res.json(items);
});

// ========== Sitemap ==========
app.get("/sitemap.xml", function (req, res) {
  var host = req.headers.host || "localhost:5173";
  var origin = "http://" + host;
  res.header("Content-Type", "application/xml");
  var parts = [];
  parts.push("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
  parts.push("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">");
  ["", "/products", "/posts", "/contact", "/help", "/about"].forEach(function (p) {
    parts.push("  <url><loc>" + origin + p + "</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>");
  });
  try {
    db.prepare("SELECT slug FROM custom_pages WHERE status='published'").all().forEach(function (p) {
      parts.push("  <url><loc>" + origin + "/page/" + p.slug + "</loc><priority>0.5</priority></url>");
    });
  } catch (e) {}
  try {
    db.prepare("SELECT slug FROM posts WHERE status='published'").all().forEach(function (p) {
      parts.push("  <url><loc>" + origin + "/post/" + p.slug + "</loc><priority>0.6</priority></url>");
    });
  } catch (e) {}
  parts.push("</urlset>");
  res.send(parts.join("\n"));
});

// ========== Start ==========
app.listen(PORT, function () { console.log("CloudNest API running on http://localhost:" + PORT); });
