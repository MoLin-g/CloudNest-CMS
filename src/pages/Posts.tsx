import { useState, useEffect } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, ArrowLeft, Loader, FileText, Tag, BookOpen, Building2, ChevronRight, FolderOpen } from "lucide-react";
import { motion } from "framer-motion";

type PostData = {
  id: number;
  title: string;
  slug: string;
  cover?: string;
  summary?: string;
  content?: string;
  type: string;
  category_id?: number;
  status: string;
  created_at: string;
  updated_at?: string;
};

type CategoryData = {
  id: number;
  name: string;
  slug: string;
  type: string;
};

// Card gradient by post type
const TYPE_STYLES: Record<string, { gradient: string; iconBg: string; accentColor: string; badge: string; Icon: React.ElementType }> = {
  post: {
    gradient: "from-blue-500 to-indigo-600",
    iconBg: "from-blue-500 to-indigo-600",
    accentColor: "#6366f1",
    badge: "文章",
    Icon: BookOpen,
  },
  case: {
    gradient: "from-emerald-500 to-teal-600",
    iconBg: "from-emerald-500 to-teal-600",
    accentColor: "#10b981",
    badge: "案例",
    Icon: Building2,
  },
};

const Posts = () => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [allPosts, setAllPosts] = useState<PostData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState<string>("all");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    Promise.all([
      fetch("/api/posts").then(r => r.json()),
      fetch("/api/categories?type=post").then(r => r.json()),
    ]).then(([postData, catData]) => {
      const published = (postData || []).filter((p: PostData) => p.status === "published");
      setAllPosts(published);
      setPosts(published);
      setCategories(catData || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let filtered = [...allPosts];
    if (activeType !== "all") {
      filtered = filtered.filter(p => p.type === activeType);
    }
    if (activeCategory !== "all") {
      filtered = filtered.filter(p => p.category_id === parseInt(activeCategory));
    }
    setPosts(filtered);
  }, [activeType, activeCategory, allPosts]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader size={24} className="animate-spin text-primary/60" />
        </div>
        <Footer />
      </div>
    );
  }

  // Resolve category name from id
  const catName = (id: number | undefined) => {
    if (!id) return "";
    const c = categories.find(c => c.id === id);
    return c ? c.name : "";
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="pt-28 pb-20 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] via-transparent to-transparent" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/[0.04] rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-purple-500/[0.03] rounded-full blur-3xl" />

        <div className="container mx-auto px-6 relative z-10 max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/[0.08] text-primary text-sm font-semibold mb-5 border border-primary/[0.12] backdrop-blur-sm">
              <BookOpen size={15} />
              <span>文章中心</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-5 tracking-tight">
              文章<span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">中心</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto font-medium leading-relaxed">
              了解 CloudNest 最新动态、使用指南和客户案例
            </p>
          </motion.div>

          {/* Filter Row 1: Type tabs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center justify-center mb-3"
          >
            <div className="inline-flex gap-1 bg-white/70 dark:bg-slate-900/50 border border-border/60 rounded-2xl p-1.5 shadow-sm backdrop-blur-md">
              {[
                { key: "all", label: "全部" },
                { key: "post", label: "文章" },
                { key: "case", label: "客户案例" },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveType(tab.key)}
                  className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer border-none ${
                    activeType === tab.key
                      ? "bg-gradient-to-r from-primary to-purple-500 text-white shadow-md shadow-primary/25"
                      : "bg-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Filter Row 2: Category pills */}
          {categories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex items-center justify-center gap-2 flex-wrap mb-14"
            >
              <FolderOpen size={14} className="text-muted-foreground/50 mr-1" />
              <button
                onClick={() => setActiveCategory("all")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer border ${
                  activeCategory === "all"
                    ? "bg-primary/10 text-primary border-primary/20"
                    : "bg-slate-100 dark:bg-slate-800 text-muted-foreground border-transparent hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                全部分类
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(String(cat.id))}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer border ${
                    activeCategory === String(cat.id)
                      ? "bg-primary/10 text-primary border-primary/20"
                      : "bg-slate-100 dark:bg-slate-800 text-muted-foreground border-transparent hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </motion.div>
          )}

          {/* Empty state */}
          {posts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <FileText size={28} className="text-muted-foreground/30" />
              </div>
              <p className="text-muted-foreground text-lg font-medium">暂无内容</p>
              <p className="text-muted-foreground/60 text-sm mt-1">试试切换其他分类或类型</p>
            </motion.div>
          ) : (
            /* Post cards grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, i) => {
                const style = TYPE_STYLES[post.type] || TYPE_STYLES.post;
                const IconComponent = style.Icon;

                return (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.45 }}
                  >
                    <Link to={`/post/${post.slug}`} className="block group">
                      <article className="relative h-full rounded-2xl overflow-hidden bg-white dark:bg-slate-900/80 border border-border/50 hover:border-border shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-lg hover:shadow-black/[0.06] transition-all duration-300 flex flex-col">
                        {/* Top accent bar */}
                        <div className={`h-1 w-full bg-gradient-to-r ${style.gradient}`} />

                        {/* Cover image area */}
                        {post.cover ? (
                          <div className="aspect-[16/9] overflow-hidden bg-slate-100 dark:bg-slate-800">
                            <img
                              src={post.cover}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                            />
                          </div>
                        ) : (
                          /* Placeholder gradient when no cover */
                          <div className={`aspect-[16/9] bg-gradient-to-br ${style.gradient} opacity-[0.07] relative`}>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <IconComponent size={32} className={`${style.accentColor.replace("#","text-")} opacity-20`} style={{ color: style.accentColor + "33" }} />
                            </div>
                          </div>
                        )}

                        <div className="flex flex-col p-6 flex-1 min-h-[190px]">
                          {/* Meta row */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                              <span className="inline-flex items-center gap-1 font-medium">
                                <Calendar size={12} className="opacity-70" />
                                {new Date(post.created_at).toLocaleDateString("zh-CN")}
                              </span>
                              {catName(post.category_id) && (
                                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-muted-foreground">
                                  {catName(post.category_id)}
                                </span>
                              )}
                            </div>
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gradient-to-r ${style.gradient} text-white`}>
                              {style.badge}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="text-lg font-bold leading-snug mb-2.5 text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2">
                            {post.title}
                          </h3>

                          {/* Summary */}
                          {post.summary && (
                            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1 font-medium">
                              {post.summary}
                            </p>
                          )}

                          {/* Read more link */}
                          <div className="mt-4 pt-3 border-t border-border/40">
                            <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-1.5 transition-all duration-200">
                              阅读更多 <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                            </span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Posts;

export function PostDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/posts/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("文章不存在");
        return res.json();
      })
      .then((data) => {
        setPost(data);
        document.title = `${data.title} - CloudNest`;
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader size={24} className="animate-spin text-primary/60" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2">文章未找到</h2>
            <p className="text-muted-foreground mb-4">{error || "该文章不存在或已被删除"}</p>
            <Link to="/posts" className="text-primary hover:underline inline-flex items-center gap-1">
              <ArrowLeft size={14} /> 返回文章列表
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <article className="pt-28 pb-20">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-primary/[0.03] to-transparent pointer-events-none" />
        <div className="container mx-auto px-6 max-w-3xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link to="/posts" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group font-medium">
              <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" /> 返回文章列表
            </Link>
          </motion.div>

          {post.cover && (
            <div className="rounded-2xl overflow-hidden mb-8 shadow-lg shadow-black/5 border border-border/30">
              <img src={post.cover} alt={post.title} className="w-full aspect-video object-cover" />
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            {/* Meta */}
            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium">
                <Calendar size={13} />
                {new Date(post.created_at).toLocaleDateString("zh-CN")}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                post.type === "case" ? "bg-gradient-to-r from-emerald-500 to-teal-600" : "bg-gradient-to-r from-blue-500 to-indigo-600"
              }`}>
                {post.type === "case" ? "案例" : "文章"}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-10 leading-tight tracking-tight">{post.title}</h1>

            <div className="rounded-2xl bg-white dark:bg-slate-900/80 border border-border/50 shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-6 md:p-10 lg:p-12">
              <div
                className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl"
                dangerouslySetInnerHTML={{ __html: post.content || "" }}
              />
            </div>
          </motion.div>
        </div>
      </article>
      <Footer />
    </div>
  );
}
