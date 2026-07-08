import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { getAbout, type AboutData } from "@/lib/api";
import { getIcon } from "@/lib/icon-map";

const FALLBACK: AboutData = {
  id: 1,
  page_title: "关于我们",
  page_subtitle: "致力于为用户提供安全、稳定、高效的云虚拟环境解决方案",
  heading: "公司简介",
  intro_paragraph_1: "CloudNest 是一家专注于云端虚拟化技术的科技公司。",
  intro_paragraph_2: "CloudNest 核心产品覆盖云手机、沙箱环境、应用分身三大领域。",
  values: [
    { icon: "Target", title: "使命", description: "让每个人都能拥有一台安全、稳定的云端设备" },
    { icon: "Users", title: "团队", description: "资深云计算与安全专家团队" },
    { icon: "Globe", title: "覆盖", description: "全球50+节点部署" },
    { icon: "Shield", title: "信赖", description: "10,000+用户选择" },
  ],
};

const About = () => {
  const [about, setAbout] = useState<AboutData | null>(null);

  useEffect(() => {
    getAbout().then((data) => {
      // Server returns array; extract first item
      const aboutData = Array.isArray(data) ? (data[0] || null) : data;
      setAbout(aboutData);
    }).catch(() => setAbout(FALLBACK));
  }, []);

  const a = about || FALLBACK;

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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/[0.08] text-primary text-sm font-semibold mb-5 border border-primary/[0.12] backdrop-blur-sm">
              <Sparkles size={15} />
              <span>关于我们</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-5 tracking-tight">
              {a.page_title ? (
                <>
                  {a.page_title.substring(0, 2)}<span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">{a.page_title.substring(2)}</span>
                </>
              ) : (
                <>关于<span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">我们</span></>
              )}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto font-medium leading-relaxed">
              {a.page_subtitle}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-8 md:p-12 rounded-3xl mb-16"
          >
            <h2 className="text-3xl font-bold mb-6 text-center tracking-tight">{a.heading}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6 font-medium">
              {a.intro_paragraph_1}
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed font-medium">
              {a.intro_paragraph_2}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(a.values || []).map((value, index) => {
              const Icon = getIcon(value.icon);
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                >
                  <Card className="glass-card h-full group hover:glow-effect transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Icon size={32} className="text-primary-foreground" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors tracking-tight">
                        {value.title}
                      </h3>
                      <p className="text-muted-foreground font-medium text-sm md:text-base">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </section>

      <Footer />
    </div>
  );
};

export default About;
