import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getContactInfo, getProducts, type ContactInfoItem, type ProductData } from "@/lib/api";
import { getIcon } from "@/lib/icon-map";
import { contactInfoFallback } from "@/data/contact-info";
import { Send, CircleCheck, TriangleAlert, Loader } from "lucide-react";

const Contact = () => {
  const [contacts, setContacts] = useState<{ icon: string; title: string; content: string; gradient: string; id: number }[]>([]);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", message: "", product_id: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    getContactInfo().then(setContacts).catch(() => {
      setContacts(contactInfoFallback.map((c, i) => ({ id: i + 1, ...c })));
    });
    getProducts().then(setProducts).catch(() => {});
  }, []);

  const updateForm = useCallback((field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setFormError("请填写姓名、邮箱和留言内容");
      return;
    }
    setSubmitting(true);
    setFormError("");
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("提交失败");
      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", company: "", message: "", product_id: "" });
    } catch {
      setFormError("提交失败，请稍后重试或直接通过联系方式咨询");
    } finally {
      setSubmitting(false);
    }
  }, [form]);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="pt-32 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10" />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-5 tracking-tight">
              联系<span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">我们</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto font-medium leading-relaxed">
              有任何问题或需求？欢迎随时与我们取得联系，我们将竭诚为您服务
            </p>
          </motion.div>

          {contacts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {contacts.map((info) => {
                const Icon = typeof info.icon === "string" ? getIcon(info.icon) : getIcon("CircleHelp");
                return (
                  <motion.div
                    key={info.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Card className="glass-card group hover:glow-effect transition-all duration-300">
                      <CardContent className="p-6 text-center">
                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${info.gradient} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                          <Icon size={32} className="text-white" />
                        </div>
                        <h3 className="text-lg font-bold mb-2">{info.title}</h3>
                        <p className="text-muted-foreground font-medium text-sm md:text-base">{info.content}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="glass-card">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-2 text-center tracking-tight">发送留言</h2>
                <p className="text-muted-foreground text-center mb-8 text-sm font-medium">填写以下信息，我们会在 24 小时内回复</p>

                {submitted ? (
                  <div className="text-center py-12">
                    <CircleCheck size={56} className="mx-auto mb-4 text-emerald-500" />
                    <h3 className="text-xl font-bold mb-2">留言已提交</h3>
                    <p className="text-muted-foreground">感谢您的留言，我们会尽快与您联系！</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold mb-1.5">姓名 *</label>
                        <input type="text" value={form.name} onChange={e => updateForm("name", e.target.value)}
                          placeholder="您的姓名" required
                          className="w-full px-4 py-2.5 border border-input rounded-xl text-sm bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1.5">邮箱 *</label>
                        <input type="email" value={form.email} onChange={e => updateForm("email", e.target.value)}
                          placeholder="your@email.com" required
                          className="w-full px-4 py-2.5 border border-input rounded-xl text-sm bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold mb-1.5">电话</label>
                        <input type="tel" value={form.phone} onChange={e => updateForm("phone", e.target.value)}
                          placeholder="您的电话（选填）"
                          className="w-full px-4 py-2.5 border border-input rounded-xl text-sm bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1.5">公司</label>
                        <input type="text" value={form.company} onChange={e => updateForm("company", e.target.value)}
                          placeholder="您的公司（选填）"
                          className="w-full px-4 py-2.5 border border-input rounded-xl text-sm bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition" />
                      </div>
                    </div>

                    {products.length > 0 && (
                      <div>
                        <label className="block text-sm font-semibold mb-1.5">感兴趣的产品</label>
                        <select value={form.product_id} onChange={e => updateForm("product_id", e.target.value)}
                          className="w-full px-4 py-2.5 border border-input rounded-xl text-sm bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition">
                          <option value="">请选择（可选）</option>
                          {products.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-semibold mb-1.5">留言内容 *</label>
                      <textarea value={form.message} onChange={e => updateForm("message", e.target.value)}
                        placeholder="请描述您的需求或问题..." required rows={5}
                        className="w-full px-4 py-2.5 border border-input rounded-xl text-sm bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition resize-vertical" />
                    </div>

                    {formError && (
                      <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-xl">
                        <TriangleAlert size={16} /> {formError}
                      </div>
                    )}

                    <Button type="submit" disabled={submitting} className="w-full gradient-primary text-white hover:opacity-90 h-12 text-base">
                      {submitting ? (
                        <span className="flex items-center gap-2"><Loader size={16} className="animate-spin" /> 提交中...</span>
                      ) : (
                        <span className="flex items-center gap-2"><Send size={16} /> 提交留言</span>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
