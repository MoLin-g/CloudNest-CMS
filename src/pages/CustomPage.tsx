import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Loader, TriangleAlert } from "lucide-react";

type PageData = {
  id: number;
  title: string;
  content: string;
  meta_title?: string;
  meta_description?: string;
};

const CustomPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError("");
    fetch(`/api/pages/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("页面不存在");
        return res.json();
      })
      .then((data) => {
        setPage(data);
        if (data.meta_title) document.title = data.meta_title;
        if (data.meta_description) {
          const desc = document.querySelector('meta[name="description"]');
          if (desc) desc.setAttribute("content", data.meta_description);
        }
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

  if (error || !page) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <TriangleAlert size={40} className="mx-auto mb-4 text-amber-500" />
            <h2 className="text-xl font-bold mb-2">页面未找到</h2>
            <p className="text-muted-foreground mb-4">{error || "该页面不存在或已被删除"}</p>
            <Link to="/" className="text-primary hover:underline inline-flex items-center gap-1">
              <ArrowLeft size={14} /> 返回首页
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
      <section className="pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-4xl">
          <article className="glass-card rounded-3xl p-8 md:p-12">
            <h1 className="text-4xl font-bold mb-8">{page.title}</h1>
            <div
              className="prose prose-lg max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: page.content || "" }}
            />
          </article>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default CustomPage;
