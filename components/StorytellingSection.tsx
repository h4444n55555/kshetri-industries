import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/* ─────────────────────────────────────────────────────────────
   STORYTELLING SECTION — Horizontal side-scroll
   Replaces the static "About Our Company" block.
   ───────────────────────────────────────────────────────────── */

const NUM_PANELS = 4;

interface PanelData {
  tag: string;
  title: string;
  body: string;
  image?: string;
  imageAlt?: string;
  /** 'left' = image left / text right; 'right' = image right / text left */
  imagePosition?: 'left' | 'right';
}

const PANELS: PanelData[] = [
  {
    tag: 'Our Mission',
    title: 'From Our Soil to Global Success',
    body: 'Kshetri Industries Pvt. Ltd. is on a mission to transform the rich agricultural resources of Northeast India into world-class functional beverages and value-added products — built with precision, rooted in heritage.',
  },
  {
    tag: 'Raw Materials & R&D',
    title: 'Rooted in Northeast India — Formulation & Pilot Processing',
    body: 'We use indigenous rice varieties and regional agricultural resources as the foundation for our products. Every product begins with rigorous formulation, experimentation, and pilot-scale processing, bridging traditional knowledge with modern food science.',
  },
  {
    tag: 'Product Spotlight',
    title: 'Cha-bon — Sweet Rice Energy Drink',
    body: 'A functional beverage concept born from rice — Cha-bon reimagines traditional ingredients as a modern energy drink. Natural, lightly sweet, and rooted in the flavours of Northeast India.',
    image: 'https://raw.githubusercontent.com/h4444n55555/images/refs/heads/main/chabon.png',
    imageAlt: 'Cha-bon sweet rice energy drink',
    imagePosition: 'right',
  },
  {
    tag: 'Product Spotlight',
    title: 'Rice Paper',
    body: 'Derived from rice processing, our rice paper is a versatile, value-added product with applications across food, craft, and packaging — showcasing the untapped potential of Northeast India\'s staple crop.',
    image: 'https://raw.githubusercontent.com/h4444n55555/images/refs/heads/main/rice_paper_about.png',
    imageAlt: 'Rice paper product',
    imagePosition: 'right',
  },
];

/* ── Helpers ── */
const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));

const StorytellingSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<(HTMLDivElement | null)[]>([]);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const panelTextRefs = useRef<(HTMLDivElement | null)[]>([]);
  const panelImgRefs = useRef<(HTMLImageElement | null)[]>([]);

  const rafId = useRef(0);
  const inView = useRef(false);
  /* Lerp state — mirrors founders section for identical smoothness */
  const targetProgress = useRef(0);
  const currentProgressRef = useRef(0);
  const lastRaw = useRef(0);
  const stableFrames = useRef(0);
  const isSnapped = useRef(false);

  /* isMobile  = phone/small touch → swipe carousel
     isWideTouch = iPad/large touch → static layout
     neither    = real desktop      → scroll animation */
  const [isMobile, setIsMobile] = useState(false);
  const [isWideTouch, setIsWideTouch] = useState(false);
  const navigate = useNavigate();

  /* Evenly-spaced snap keyframes for 4 panels */
  const KEYFRAMES = [0, 1 / (NUM_PANELS - 1), 2 / (NUM_PANELS - 1), 1];
  const nearestKeyframe = useCallback((v: number) =>
    KEYFRAMES.reduce((a, b) => (Math.abs(b - v) < Math.abs(a - v) ? b : a)), []);

  useEffect(() => {
    const check = () => {
      const touch = navigator.maxTouchPoints > 0;
      const wide = window.innerWidth >= 900;
      setIsMobile(touch && !wide);
      setIsWideTouch(touch && wide);
    };
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  /* Direct DOM update — called every rAF tick, zero React re-renders */
  const updateDOM = useCallback((progress: number) => {
    const translateX = progress * (NUM_PANELS - 1) * 100;
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(-${translateX}vw, 0, 0)`;
    }

    for (let idx = 0; idx < NUM_PANELS; idx++) {
      const panelCenter = idx / (NUM_PANELS - 1);
      const distance = Math.abs(progress - panelCenter);
      const halfWidth = (1 / (NUM_PANELS - 1)) * 0.6;
      const visibility = clamp(1 - distance / halfWidth);
      const imageLeft = PANELS[idx].imagePosition === 'left';
      const parallax = (1 - visibility) * (imageLeft ? -4 : 4);
      const textFade = clamp(visibility * 1.8);
      const textShift = (1 - clamp(visibility * 1.5)) * 40;

      const textEl = panelTextRefs.current[idx];
      if (textEl) {
        textEl.style.opacity = String(textFade);
        textEl.style.transform = `translateX(${imageLeft ? textShift : -textShift}px)`;
      }

      const imgEl = panelImgRefs.current[idx];
      if (imgEl) {
        imgEl.style.transform = `translate3d(${parallax}%, 0, 0) scale(1.05)`;
      }

      const dot = dotsRef.current[idx];
      if (dot) {
        const active = Math.abs(progress - panelCenter) < (1 / (NUM_PANELS - 1)) * 0.55;
        dot.style.width = active ? '28px' : '8px';
        dot.style.background = active ? '#2B052E' : '#2B052E30';
      }
    }

    if (scrollHintRef.current) {
      scrollHintRef.current.style.opacity = progress < 0.04 ? '1' : '0';
    }
  }, []);

  const snapToNearest = useCallback(() => {}, []); // unused — kept for dep-list safety

  useEffect(() => {
    if (isMobile || isWideTouch) return;

    const tick = () => {
      if (inView.current && containerRef.current) {
        const el = containerRef.current;
        const scrollable = el.offsetHeight - window.innerHeight;
        if (scrollable > 0) {
          const raw = clamp((window.scrollY - el.offsetTop) / scrollable);
          const scrollDelta = raw - lastRaw.current;

          if (isSnapped.current) {
            const snappedAt = targetProgress.current;
            const crossedForward = scrollDelta > 0 && raw > snappedAt + 0.015;
            const crossedBackward = scrollDelta < 0 && raw < snappedAt - 0.015;
            if (crossedForward || crossedBackward) {
              isSnapped.current = false;
              stableFrames.current = 0;
              targetProgress.current = raw;
            }
          } else if (Math.abs(scrollDelta) > 0.003) {
            targetProgress.current = raw;
            stableFrames.current = 0;
          } else {
            stableFrames.current++;
            if (stableFrames.current >= 6) {
              targetProgress.current = nearestKeyframe(raw);
              isSnapped.current = true;
            }
          }

          lastRaw.current = raw;
        }
      }

      /* Lerp toward target — same 0.15 easing as founders section */
      const diff = targetProgress.current - currentProgressRef.current;
      if (Math.abs(diff) > 0.0003) {
        currentProgressRef.current += diff * 0.15;
        updateDOM(currentProgressRef.current);
      }

      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);

    const observer = new IntersectionObserver(
      ([entry]) => { inView.current = entry.isIntersecting; },
      { threshold: 0 }
    );
    if (containerRef.current) observer.observe(containerRef.current);

    updateDOM(0);

    return () => {
      cancelAnimationFrame(rafId.current);
      observer.disconnect();
    };
  }, [isMobile, isWideTouch, updateDOM, nearestKeyframe]);

  /* ─── MOBILE: Swipeable horizontal carousel ─── */
  if (isMobile) {
    return <MobileCarousel navigate={navigate} />;
  }

  /* ─── WIDE TOUCH (iPad desktop mode): Static vertical layout ─── */
  if (isWideTouch) {
    return (
      <section id="about" className="bg-background-light py-16 px-6 md:px-12 space-y-0">
        {PANELS.map((panel, idx) => {
          const hasImage = !!panel.image;
          if (!hasImage) {
            return (
              <div key={idx} className="py-16 flex items-center justify-center text-center">
                <div className="max-w-2xl">
                  <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: '#7B4B11' }}>{panel.tag}</p>
                  <h2 className="text-4xl font-black tracking-tight leading-[1.05] mb-5" style={{ color: '#2B052E' }}>{panel.title}</h2>
                  <p className="text-base font-medium leading-relaxed" style={{ color: '#6B5E5E' }}>{panel.body}</p>
                </div>
              </div>
            );
          }
          return (
            <div key={idx} className="flex flex-row items-stretch" style={{ minHeight: '60vw', maxHeight: '520px' }}>
              {/* Text left */}
              <div className="w-1/2 flex items-center justify-end pr-10 pl-4 py-10">
                <div className="max-w-md">
                  <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: '#7B4B11' }}>{panel.tag}</p>
                  <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-[1.08] mb-4" style={{ color: '#2B052E' }}>{panel.title}</h2>
                  <p className="text-base font-medium leading-relaxed mb-6" style={{ color: '#6B5E5E' }}>{panel.body}</p>
                  {(idx === 2 || idx === 3) && (
                    <button
                      onClick={() => navigate(idx === 2 ? '/products#cha-bon' : '/products#rice-paper')}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-full shadow-lg text-sm uppercase tracking-widest"
                    >View Product</button>
                  )}
                </div>
              </div>
              {/* Image right */}
              <div className="w-1/2 relative overflow-hidden" style={{ background: '#E8E0D8' }}>
                <img src={panel.image} alt={panel.imageAlt || ''} className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: 'top center' }} />
              </div>
            </div>
          );
        })}
      </section>
    );
  }

  /* ─── DESKTOP: Horizontal scroll — all animation via direct DOM refs ─── */
  return (
    <div
      id="about"
      ref={containerRef}
      className="relative"
      style={{ height: `${(NUM_PANELS + 0.4) * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-background-light">
        {/* Horizontal track */}
        <div
          ref={trackRef}
          className="flex h-full will-change-transform"
          style={{ width: `${NUM_PANELS * 100}vw` }}
        >
          {PANELS.map((panel, idx) => (
            <DesktopPanel
              key={idx}
              panel={panel}
              index={idx}
              navigate={navigate}
              textRef={(el) => { panelTextRefs.current[idx] = el; }}
              imgRef={(el) => { panelImgRefs.current[idx] = el; }}
            />
          ))}
        </div>

        {/* Progress dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
          {PANELS.map((_, idx) => (
            <div
              key={idx}
              ref={(el) => { dotsRef.current[idx] = el; }}
              className="rounded-full"
              style={{ width: 8, height: 8, background: '#2B052E30', transition: 'width 0.4s ease, background 0.4s ease' }}
            />
          ))}
        </div>

        {/* Scroll hint */}
        <div
          ref={scrollHintRef}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 pointer-events-none"
          style={{ transition: 'opacity 0.7s ease' }}
        >
          <span className="text-[10px] uppercase tracking-[0.25em] font-bold" style={{ color: '#6B5E5E80' }}>
            Scroll to explore
          </span>
          <div className="w-px h-8" style={{ background: 'linear-gradient(to bottom, #6B5E5E50, transparent)' }} />
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   DESKTOP PANEL
   ═══════════════════════════════════════════════════════════ */
interface DesktopPanelProps {
  panel: PanelData;
  index: number;
  navigate: ReturnType<typeof useNavigate>;
  textRef: (el: HTMLDivElement | null) => void;
  imgRef: (el: HTMLImageElement | null) => void;
}

const DesktopPanel: React.FC<DesktopPanelProps> = ({ panel, index, navigate, textRef, imgRef }) => {
  const hasImage = !!panel.image;
  const imageLeft = panel.imagePosition === 'left';

  /* ── Full-width intro panel (no image) ── */
  if (!hasImage) {
    return (
      <div className="flex-shrink-0 w-screen h-full flex items-center justify-center px-12 bg-background-light">
        <div
          ref={textRef}
          className="max-w-2xl text-center"
          style={{ opacity: 0 }}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-5" style={{ color: '#7B4B11' }}>
            {panel.tag}
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05]" style={{ color: '#2B052E' }}>
            {panel.title}
          </h2>
          <p className="text-base md:text-lg font-medium leading-relaxed mt-6 max-w-xl mx-auto" style={{ color: '#6B5E5E' }}>
            {panel.body}
          </p>
        </div>
      </div>
    );
  }

  /* ── Split panel: image + text ── */
  const imageBlock = (
    <div className="w-1/2 h-full relative overflow-hidden flex-shrink-0" style={{ background: '#E8E0D8' }}>
      <img
        ref={imgRef}
        src={panel.image}
        alt={panel.imageAlt || ''}
        className="absolute inset-0 w-full h-full object-cover will-change-transform"
        style={{ objectPosition: 'top center', transform: 'translate3d(0%, 0, 0) scale(1.05)' }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: imageLeft
            ? 'linear-gradient(to left, rgba(238,242,246,0.25) 0%, transparent 30%)'
            : 'linear-gradient(to right, rgba(238,242,246,0.25) 0%, transparent 30%)',
        }}
      />
    </div>
  );

  const textBlock = (
    <div className={`w-1/2 h-full flex items-center ${imageLeft ? 'justify-end' : 'justify-start'} flex-shrink-0`}>
      <div
        ref={textRef}
        className={`max-w-lg ${imageLeft ? 'pl-6 lg:pl-8 pr-16 lg:pr-20' : 'pl-16 lg:pl-20 pr-6 lg:pr-8'}`}
        style={{ opacity: 0 }}
      >
        <p className="text-xs font-bold uppercase tracking-[0.35em] mb-4" style={{ color: '#7B4B11' }}>
          {panel.tag}
        </p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08]" style={{ color: '#2B052E' }}>
          {panel.title}
        </h2>
        <p className="text-lg font-medium leading-relaxed mt-5" style={{ color: '#6B5E5E' }}>
          {panel.body}
        </p>
        {(index === 2 || index === 3) && (
          <button
            onClick={() => navigate(index === 2 ? '/products#cha-bon' : '/products#rice-paper')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-sm uppercase tracking-widest mt-6"
          >
            View Product
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex-shrink-0 w-screen h-full flex">
      {imageLeft ? (<>{imageBlock}{textBlock}</>) : (<>{textBlock}{imageBlock}</>)}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   MOBILE CAROUSEL — fullscreen swipeable panels
   ═══════════════════════════════════════════════════════════ */
const MobileCarousel: React.FC<{ navigate: ReturnType<typeof useNavigate> }> = ({ navigate }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const isHorizontal = useRef<boolean | null>(null);

  const goTo = (idx: number) => {
    setActiveIdx(Math.max(0, Math.min(NUM_PANELS - 1, idx)));
    setDragOffset(0);
    isHorizontal.current = null;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isHorizontal.current = null;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;

    if (isHorizontal.current === null) {
      if (Math.abs(dx) > Math.abs(dy) + 4) {
        isHorizontal.current = true;
      } else if (Math.abs(dy) > Math.abs(dx) + 4) {
        isHorizontal.current = false;
      }
    }

    if (isHorizontal.current) {
      e.preventDefault();
      // Rubber-band at edges
      let offset = dx;
      if ((activeIdx === 0 && dx > 0) || (activeIdx === NUM_PANELS - 1 && dx < 0)) {
        offset = dx * 0.2;
      }
      setDragOffset(offset);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isHorizontal.current && touchStartX.current !== null) {
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      const threshold = window.innerWidth * 0.2;
      if (dx < -threshold) goTo(activeIdx + 1);
      else if (dx > threshold) goTo(activeIdx - 1);
      else goTo(activeIdx);
    }
    setIsDragging(false);
    setDragOffset(0);
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const translateX = -(activeIdx * 100) + (dragOffset / window.innerWidth) * 100;

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-background-light"
      style={{ height: '100svh' }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Track */}
      <div
        className="flex h-full will-change-transform"
        style={{
          width: `${NUM_PANELS * 100}vw`,
          transform: `translate3d(${translateX}vw, 0, 0)`,
          transition: isDragging ? 'none' : 'transform 0.42s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      >
        {PANELS.map((panel, idx) => (
          <MobileSlide key={idx} panel={panel} index={idx} active={activeIdx === idx} navigate={navigate} />
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-20">
        {PANELS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            className="rounded-full transition-all duration-400"
            style={{
              width: activeIdx === idx ? 24 : 7,
              height: 7,
              background: activeIdx === idx ? '#2B052E' : '#2B052E30',
            }}
          />
        ))}
      </div>
    </section>
  );
};

/* ── One slide inside the mobile carousel ── */
const MobileSlide: React.FC<{
  panel: PanelData;
  index: number;
  active: boolean;
  navigate: ReturnType<typeof useNavigate>;
}> = ({ panel, index, active, navigate }) => {
  const hasImage = !!panel.image;

  return (
    <div
      className="flex-shrink-0 w-screen h-full relative bg-background-light flex flex-col overflow-hidden"
    >
      {/* Image — fills top half, 1:1 crop */}
      {hasImage ? (
        <>
          <div className="flex-shrink-0 relative overflow-hidden" style={{ height: '50svh' }}>
            <img
              src={panel.image}
              alt={panel.imageAlt || ''}
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                transform: active ? 'scale(1)' : 'scale(1.06)',
                transition: 'transform 0.7s ease-out',
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(to bottom, transparent 55%, rgba(238,242,246,0.7) 100%)' }}
            />
          </div>
          {/* Text below image */}
          <div
            className="flex-1 flex flex-col justify-center px-7 py-7"
            style={{
              opacity: active ? 1 : 0,
              transform: active ? 'translateY(0)' : 'translateY(18px)',
              transition: 'opacity 0.5s ease-out 0.15s, transform 0.5s ease-out 0.15s',
            }}
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-2" style={{ color: '#7B4B11' }}>
              {panel.tag}
            </p>
            <h2 className="text-2xl font-black tracking-tight leading-[1.1] mb-3" style={{ color: '#2B052E' }}>
              {panel.title}
            </h2>
            <p className="text-sm font-medium leading-relaxed" style={{ color: '#6B5E5E' }}>
              {panel.body}
            </p>
            {(index === 2 || index === 3) && (
              <button
                onClick={() => navigate(index === 2 ? '/products#cha-bon' : '/products#rice-paper')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold rounded-full shadow-lg text-xs uppercase tracking-widest mt-5 w-fit"
              >
                View Product
              </button>
            )}
          </div>
        </>
      ) : (
        /* Text-only slide — centred */
        <div
          className="flex-1 flex items-center justify-center px-8"
          style={{
            opacity: active ? 1 : 0,
            transform: active ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.5s ease-out 0.1s, transform 0.5s ease-out 0.1s',
          }}
        >
          <div className="text-center max-w-xs">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: '#7B4B11' }}>
              {panel.tag}
            </p>
            <h2 className="text-2xl font-black tracking-tight leading-[1.1] mb-4" style={{ color: '#2B052E' }}>
              {panel.title}
            </h2>
            <p className="text-sm font-medium leading-relaxed" style={{ color: '#6B5E5E' }}>
              {panel.body}
            </p>
            {/* Swipe hint */}
            {index === 0 && (
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold mt-8" style={{ color: '#2B052E30' }}>
                ← Swipe to explore →
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StorytellingSection;
