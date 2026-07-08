import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Car, Brain, Lock, Building2, Radio, Video, Check, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SolutionsPage = () => {
  const solutions = [
    {
      icon: Car,
      title: "AI智慧车场解决方案",
      gradient: "from-blue-500 to-cyan-500",
      features: [
        "智能车位识别与导航",
        "无感支付与自动计费",
        "车辆轨迹追踪",
        "数据分析与优化",
      ],
    },
    {
      icon: Brain,
      title: "AI智能体定制开发",
      gradient: "from-purple-500 to-pink-500",
      features: [
        "教育领域智能助教",
        "医疗健康咨询助手",
        "个性化学习路径规划",
        "多模态交互能力",
      ],
    },
    {
      icon: Lock,
      title: "客户端/APP开发",
      gradient: "from-green-500 to-emerald-500",
      features: [
        "苹果、Windows桌面软件",
        "苹果APP、安卓APP开发",
        "小程序、H5",
        "鸿蒙体系应用开发",
      ],
    },
    {
      icon: Building2,
      title: "体育赛事系统解决方案",
      gradient: "from-orange-500 to-red-500",
      features: [
        "体育赛事经营管理",
        "赛事服务与互动模块",
        "安防监控集成",
        "场地网络等关键技术支撑",
        "指挥调度平台",
      ],
    },
    {
      icon: Radio,
      title: "宠物领域AI解决方案",
      gradient: "from-indigo-500 to-blue-500",
      features: [
        "宠物行业APP开发",
        "物联网产品定制",
        "智能设备控制",
        "AI行为分析",
        "健康数据追踪",
      ],
    },
    {
      icon: Video,
      title: "IVM行业视频管理服务",
      gradient: "from-pink-500 to-rose-500",
      features: [
        "智能视频监控",
        "AI行为分析",
        "事件自动预警",
        "云端存储与回放",
      ],
    },
  ];

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
              <span>核心优势</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-5 tracking-tight">
              全方位<span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">解决方案</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium">
              深度融合AI、物联网等前沿技术，为不同行业提供定制化智能解决方案
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {solutions.map((solution, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="glass-card h-full group hover:glow-effect transition-all duration-300 overflow-hidden relative">
                  {/* Top gradient bar */}
                  <div className={`h-1.5 w-full bg-gradient-to-r ${solution.gradient}`} />
                  <CardHeader className="p-6 pb-3">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${solution.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                      style={{ boxShadow: `0 8px 28px rgba(99,102,241,0.25)` }}>
                      <solution.icon size={32} className="text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors">
                      {solution.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-2">
                    <ul className="space-y-3">
                      {solution.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start space-x-3">
                          <div className={`shrink-0 w-5 h-5 rounded-md bg-gradient-to-br ${solution.gradient} flex items-center justify-center mt-0.5`}>
                            <Check size={12} className="text-white" />
                          </div>
                          <span className="text-muted-foreground font-medium text-sm md:text-base">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </section>

      <Footer />
    </div>
  );
};

export default SolutionsPage;
