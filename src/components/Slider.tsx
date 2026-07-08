import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

type SlideItem = {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  link_url: string;
  link_text: string;
  sort_order: number;
};

type SliderData = {
  id: number;
  name: string;
  slug: string;
  items: SlideItem[];
};

const Slider = () => {
  const [sliders, setSliders] = useState<SliderData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeSlider, setActiveSlider] = useState<SliderData | null>(null);

  useEffect(() => {
    fetch("/api/sliders")
      .then(r => r.json())
      .then(async (sliderList: any[]) => {
        if (!sliderList || sliderList.length === 0) return;
        // Load items for each slider
        const withItems = await Promise.all(
          sliderList.map(async (s: any) => {
            try {
              const items = await fetch(`/api/slider-items?slider_id=${s.id}`).then(r => r.json());
              return { ...s, items: items || [] };
            } catch {
              return { ...s, items: [] };
            }
          })
        );
        setSliders(withItems);
        const active = withItems.find((s: SliderData) => s.items.length > 0) || null;
        setActiveSlider(active);
      })
      .catch(() => {});
  }, []);

  const next = useCallback(() => {
    if (!activeSlider || activeSlider.items.length === 0) return;
    setCurrentIndex(prev => (prev + 1) % activeSlider.items.length);
  }, [activeSlider]);

  const prev = useCallback(() => {
    if (!activeSlider || activeSlider.items.length === 0) return;
    setCurrentIndex(prev => (prev - 1 + activeSlider.items.length) % activeSlider.items.length);
  }, [activeSlider]);

  // Auto-advance every 5s
  useEffect(() => {
    if (!activeSlider || activeSlider.items.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [activeSlider, next]);

  if (!activeSlider || activeSlider.items.length === 0) return null;

  const currentItem = activeSlider.items[currentIndex];

  return (
    <section className="relative overflow-hidden py-8">
      <div className="container mx-auto px-6">
        {/* Slider Groups (only show if multiple) */}
        {sliders.filter(s => s.items.length > 0).length > 1 && (
          <div className="flex justify-center gap-3 mb-6">
            {sliders.filter(s => s.items.length > 0).map(s => (
              <button
                key={s.id}
                onClick={() => { setActiveSlider(s); setCurrentIndex(0); }}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition cursor-pointer border-none ${
                  activeSlider.id === s.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground hover:bg-surface-hover"
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        )}

        {/* Carousel */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[21/9] max-w-5xl mx-auto group">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentItem.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <img
                src={currentItem.image.startsWith("http") ? currentItem.image : `/uploads/${currentItem.image}`}
                alt={currentItem.title || ""}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {(currentItem.title || currentItem.subtitle || currentItem.link_url) && (
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                  {currentItem.title && (
                    <h3 className="text-2xl md:text-4xl font-bold text-white mb-2">{currentItem.title}</h3>
                  )}
                  {currentItem.subtitle && (
                    <p className="text-white/80 text-sm md:text-lg mb-4 max-w-xl">{currentItem.subtitle}</p>
                  )}
                  {currentItem.link_url && (
                    <a
                      href={currentItem.link_url}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-white/20 backdrop-blur-sm text-white rounded-xl text-sm font-semibold hover:bg-white/30 transition border border-white/20"
                    >
                      {currentItem.link_text || "了解更多"}
                    </a>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation arrows */}
          {activeSlider.items.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer border-none hover:bg-white/30"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer border-none hover:bg-white/30"
              >
                <ChevronRight size={20} />
              </button>

              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {activeSlider.items.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-2 h-2 rounded-full transition cursor-pointer border-none ${
                      i === currentIndex ? "bg-white scale-125" : "bg-white/40 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Slider;
