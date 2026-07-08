import { useEffect, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { getSiteSettings } from "@/lib/api";
import Index from "./pages/Index";
import Products from "./pages/Products";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Help from "./pages/Help";
const Admin = lazy(() => import("./pages/Admin"));
import CustomPage from "./pages/CustomPage";
import Posts, { PostDetail } from "./pages/Posts";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function SiteMeta() {
  useEffect(() => {
    getSiteSettings().then((s) => {
      if (s.site_title) document.title = s.site_title;
      if (s.site_description) {
        const desc = document.querySelector('meta[name="description"]');
        if (desc) desc.setAttribute("content", s.site_description);
      }
    }).catch(() => {});
  }, []);
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SiteMeta />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/products" element={<Products />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/help" element={<Help />} />
              <Route path="/admin" element={<Suspense fallback={<div className="flex items-center justify-center h-screen text-muted-foreground">加载中...</div>}><Admin /></Suspense>} />
              <Route path="/posts" element={<Posts />} />
              <Route path="/post/:slug" element={<PostDetail />} />
              <Route path="/page/:slug" element={<CustomPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
