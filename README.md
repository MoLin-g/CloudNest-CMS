# CloudNest CMS

一个**开箱即用全栈企业官网内容管理系统**，内置企业官网前台（首页、产品、解决方案、文章中心、帮助中心、关于我们、联系我们）和功能完善的 Web 管理后台。所有页面内容可通过后台可视化编辑，无需改代码。

> 技术栈：React 18 + TypeScript + Vite 5 + Tailwind CSS 3 + Shadcn UI + Three.js + Express 5 + SQLite

---

## 这是什么？

一套CloudNest CMS **CMS（Content Management System）** 系统。它不是某个公司的定制网站——你只需替换示例内容和 Logo，就能快速搭建自己的企业官网：

| 分层 | 能力 |
|------|------|
| **前台展示** | 首页 Hero 轮播、产品/服务详情、核心优势、应用场景、解决方案、文章中心（博客 + 案例）、FAQ 帮助中心、关于我们、联系我们（留言表单） |
| **管理后台** | 仪表盘数据面板、20+ 内容实体的可视化增删改查、拖拽排序、图片上传、三级角色权限管控、站点全局设置 |
| **底层引擎** | Express 5 RESTful API、SQLite 数据库（自动建表 + 种子数据）、JWT 鉴权、速率限制、sitemap.xml 自动生成 |

**开箱即用**——克隆仓库 → 安装依赖 → 启动 → 替换后台内容，网站即上线。

---

## 技术栈

### 前端

| 类别 | 技术 |
|------|------|
| 框架 | React 18 + TypeScript |
| 构建 | Vite 5 |
| 样式 | Tailwind CSS 3 + HSL 设计系统（CSS 变量驱动主题） |
| 组件库 | Shadcn UI（42 个组件，基于 Radix UI） |
| 动画 | Framer Motion（页面过渡 + 视口触发 + 悬浮微交互） |
| 3D 背景 | Three.js + React Three Fiber + @react-three/drei |
| 路由 | React Router v6（BrowserRouter） |
| 数据请求 | TanStack Query 5 + fetch |
| 表单 | React Hook Form + Zod 校验 |
| 图表 | Recharts（后台仪表盘统计图表） |
| 图标 | Lucide React |
| 国际化 | i18next + react-i18next（内置中/英翻译） |
| 主题 | next-themes（暗/亮切换，localStorage 持久化） |

### 后端

| 类别 | 技术 |
|------|------|
| 运行时 | Node.js |
| 框架 | Express 5 |
| 数据库 | SQLite（better-sqlite3，同步 API，免安装零配置） |
| 认证 | JWT 令牌 + 登录速率限制（5次/15分钟） |
| 文件上传 | Multer（Base64 图片 → public/uploads） |
| 安全 | CORS、登录锁定、输入校验 |

### 部署

| 方式 | 说明 |
|------|------|
| 单机部署 | 前端 `node serve.cjs`（5173 端口）+ 后端 `node server/index.cjs`（3001 端口） |
| 静态分发 + 独立 API | `npm run build` → 静态文件部署到 CDN/Nginx/Cloudflare Pages，API 服务独立部署 |
| Cloudflare Workers | `npm run deploy`（仅静态 SPA，需 API 单独部署） |

---

## 项目结构

```
├── public/                       # 静态资源（logo、favicon、robots.txt、uploads/）
├── server/
│   ├── index.cjs                 # Express API 服务器（端口 3001）
│   └── database.cjs              # 数据库初始化、迁移与种子数据
├── src/
│   ├── components/
│   │   ├── ui/                   # Shadcn UI 组件（42 个）
│   │   ├── Hero.tsx              # 首页 Hero（多帧轮播）
│   │   ├── Hero3DBackground.tsx   # Three.js 3D 粒子背景
│   │   ├── Navbar.tsx            # 导航栏（多级下拉）
│   │   ├── Footer.tsx            # 页脚
│   │   ├── Features.tsx          # 核心优势卡片
│   │   ├── Solutions.tsx         # 产品/服务卡片
│   │   ├── UseCases.tsx          # 应用场景
│   │   ├── ProductFeatures.tsx   # 产品功能特性
│   │   ├── Slider.tsx            # 图片轮播
│   │   ├── CTA.tsx               # 行动号召
│   │   ├── Pricing.tsx           # 定价方案
│   │   ├── Logo.tsx              # Logo
│   │   └── NavLink.tsx           # 导航链接
│   ├── pages/
│   │   ├── Index.tsx             # 首页（组装所有前台区块）
│   │   ├── Products.tsx          # 产品详情（Tab 切换 + 动态 Section + 定价）
│   │   ├── Solutions.tsx         # 解决方案列表
│   │   ├── About.tsx             # 关于我们
│   │   ├── Contact.tsx           # 联系我们（表单提交）
│   │   ├── Help.tsx              # 帮助中心（FAQ 折叠面板）
│   │   ├── Posts.tsx             # 文章中心（列表 + 详情）
│   │   ├── CustomPage.tsx        # 自定义页面渲染
│   │   ├── Admin.tsx             # 管理后台（懒加载）
│   │   └── NotFound.tsx          # 404
│   ├── contexts/
│   │   ├── ThemeContext.tsx       # 主题上下文
│   │   └── LanguageContext.tsx    # 语言上下文
│   ├── lib/
│   │   ├── api.ts                # API 层（完整 TS 类型定义）
│   │   ├── icon-map.ts           # 图标 → Lucide 映射
│   │   └── utils.ts              # 工具函数
│   ├── hooks/                    # 自定义 Hooks
│   ├── i18n/index.ts             # 多语言配置
│   ├── index.css                 # 全局样式（设计系统）
│   ├── App.tsx                   # 路由入口
│   └── main.tsx                  # 应用入口
├── worker/index.ts               # Cloudflare Worker（SPA fallback）
├── serve.cjs                     # 生产静态服务器（含 /api 代理）
├── vite.config.ts                # Vite 配置
├── tailwind.config.ts            # Tailwind 配置
├── wrangler.toml                 # Cloudflare 部署配置
└── package.json
```

---

## 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 1. 克隆并安装

```bash
git clone <repo-url>
cd cloudnest-official-website
npm install
```

### 2. 启动开发环境

```bash
# 终端 1：后端 API 服务（端口 3001）
node server/index.cjs

# 终端 2：前端开发服务器（端口 5174）
npm run dev
```

访问 `http://localhost:5174` 查看前台网站，`/admin` 进入管理后台。

### 3. 生产环境启动

```bash
npm run build                          # 构建前端
node server/index.cjs &                # 后端
node serve.cjs                         # 静态服务器（端口 5173，含 /api 代理）
```

### 4. 管理后台

- 路径 `/admin`，首次启动自动创建管理员账号（种子数据在 `server/database.cjs`）
- 三种角色：**超级管理员** | **编辑** | **查看者**
- 精细化权限：按功能模块（页面内容、产品管理、站点设置、内容运营、媒体库）分一级/二级授权，编辑角色无法操作超管账号

---

## 内容管理能力

后台可管理以下全部内容实体，修改**即时生效**：

| 模块 | 可管理内容 |
|------|-----------|
| 页面内容 | Hero 轮播帧、核心优势、应用场景、CTA 行动号召、关于我们、联系信息 |
| 产品管理 | 产品信息、功能特性、定价方案、产品分类 |
| 站点设置 | 站点名称/描述、SEO 标题、Telegram 链接、全局开关 |
| 内容运营 | 文章/博客、客户案例、FAQ 问答、自定义落地页、图片轮播 |
| 媒体库 | 图片上传、浏览、删除 |
| 用户管理 | 管理员增删改查、角色分配、权限配置、改密 |
| 系统 | 主题切换（暗/亮）、语言切换（中/英）、导航菜单编辑、数据库备份/恢复、操作日志 |

---

## API 接口

全部 RESTful，前缀 `/api`，端口 3001。

### 公开接口（无需登录）

| 端点 | 说明 |
|------|------|
| `GET /api/site-settings` | 站点全局设置 |
| `GET /api/hero` | Hero 内容 |
| `GET /api/products` | 产品列表 |
| `GET /api/features` | 功能特性 |
| `GET /api/usecases` | 应用场景 |
| `GET /api/faq` | FAQ 分组数据 |
| `GET /api/about` | 关于我们 |
| `GET /api/contact-info` | 联系信息 |
| `GET /api/posts` / `/api/posts/:slug` | 文章列表与详情 |
| `GET /api/pages/:slug` | 自定义页面 |
| `GET /api/pricing` | 定价方案 |
| `GET /api/sliders` | 轮播图与条目 |
| `GET /api/nav-menus` | 导航菜单 |
| `POST /api/inquiries` | 提交留言（公开） |

### 管理接口（需 Admin Token）

| 端点 | 说明 |
|------|------|
| `POST /api/auth/login` | 管理员登录 |
| `GET /api/auth/me` | 当前登录用户信息 |
| `GET /api/stats` | 仪表盘统计 |
| `CRUD /api/<entity>` | 对应实体 CRUD（20+ 实体，统一 RESTful 规范） |
| `POST /api/media/upload` | 图片上传 |
| `GET /api/admin-logs` | 操作日志 |
| `GET /POST /api/backup` | 数据库备份/恢复 |

---

## 数据库

SQLite（`server/data.db`），**零配置**，首次启动自动建表并填充种子数据。

约 30 张表，涵盖：`site_settings`、`products`、`hero_content`、`usecases`、`features`、`cta_content`、`faq_categories`、`faq_items`、`admins`、`about_content`、`nav_menus`、`pricing_plans`、`posts`、`custom_pages`、`sliders`、`slider_items`、`media`、`inquiries`、`categories`、`themes`、`languages`、`translations`、`product_features`、`contact_info`、`admin_logs`、`backups`、`redirects`。

---

## 自定义指南

### 替换为你的品牌

1. **Logo 和 Favicon**：替换 `public/logo.png` 和 `public/favicon.ico`
2. **站点标题**：后台「站点设置」修改站点名称和 SEO 标题
3. **首页内容**：后台「页面内容」模块修改 Hero 文案、优势、场景
4. **产品/服务**：后台「产品管理」创建你的产品、特性、定价
5. **颜色主题**：编辑 `src/index.css` 中 `:root` 下的 HSL 变量，或通过后台主题管理切换暗/亮模式
6. **联系方式**：后台「页面内容」→「联系信息」修改电话、邮箱、地址、社交链接

### 扩展内容类型

- 新建数据库表 → `server/database.cjs` 添加迁移
- 添加 API 路由 → `server/index.cjs` 补充路由处理
- 添加前端类型和 API 函数 → `src/lib/api.ts`
- 添加后台管理页面 → `src/pages/Admin.tsx` 新增 Tab
- 添加前台展示页面 → `src/pages/` 新建组件 + `src/App.tsx` 注册路由

---

## NPM 脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动 Vite 开发服务器（5174 端口） |
| `npm run build` | 生产构建 → `dist/` |
| `npm run build:dev` | 开发模式构建 |
| `npm run preview` | 预览生产构建 |
| `npm run lint` | ESLint 代码检查 |
| `npm run deploy` | 构建 + 部署到 Cloudflare Workers |

---

## 许可证

MIT License
