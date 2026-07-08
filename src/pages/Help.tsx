import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CircleHelp, ChevronDown } from "lucide-react";
import { getFAQ, getSiteSettings, type FaqCategoryData } from "@/lib/api";
import { getIcon } from "@/lib/icon-map";

const FaqItem = ({ q, a }: { q: string; a: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-md bg-white dark:bg-slate-900/60">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left bg-card/50 hover:bg-card/80 transition-colors cursor-pointer border-none"
      >
        <span className="font-semibold text-base text-foreground pr-4">{q}</span>
        <ChevronDown
          size={20}
          className={`text-muted-foreground shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <p className="px-5 pb-5 text-muted-foreground text-sm leading-relaxed whitespace-pre-line font-medium">
          {a}
        </p>
      </div>
    </div>
  );
};

const Help = () => {
  const [categories, setCategories] = useState<FaqCategoryData[]>([]);
  const [telegramLink, setTelegramLink] = useState("https://t.me/CloudNestSupport");

  useEffect(() => {
    getFAQ().then(setCategories).catch(() => {});
    getSiteSettings().then(s => { setTelegramLink(s.telegram_help_link || s.telegram_link || "https://t.me/CloudNestSupport"); }).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-6 border border-primary/[0.12]">
              <CircleHelp size={16} />
              <span>帮助中心</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-5 tracking-tight">
              我们能帮您
              <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent"> 做什么？</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
              以下是常见问题解答。如果仍无法解决您的问题，请随时联系我们的技术支持团队。
            </p>
          </div>

          {categories.length === 0 && (
            <div className="text-center text-muted-foreground py-12">
              正在加载帮助内容...
            </div>
          )}

          <div className="space-y-16">
            {categories.map((category) => {
              const CatIcon = getIcon(category.icon);
              return (
                <section key={category.id}>
                  <div className="flex items-center space-x-3 mb-8">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${category.gradient} shadow-lg`}>
                      <CatIcon size={22} className="text-white" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight">{category.title}</h2>
                  </div>
                  <div className="space-y-3">
                    {(category.questions || []).map((faq) => (
                      <FaqItem key={faq.id} q={faq.question} a={faq.answer} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          {categories.length > 0 && (
            <div className="mt-20 p-10 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 text-center">
              <h3 className="text-2xl font-bold mb-3">还没有找到答案？</h3>
              <p className="text-muted-foreground mb-6 text-base font-medium">我们的技术团队随时准备为您提供帮助</p>
              <button
                onClick={() => window.open(telegramLink, "_blank")}
                className="gradient-primary text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity cursor-pointer border-none inline-flex items-center space-x-2"
              >
                <span>📩</span>
                <span>联系 Telegram 客服</span>
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Help;
