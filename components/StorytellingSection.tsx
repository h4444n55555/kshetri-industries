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
    image: '/static-site/assets/chabon.png',
    imageAlt: 'Cha-bon sweet rice energy drink',
    imagePosition: 'right',
  },
  {
    tag: 'Product Spotlight',
    title: 'Rice Paper',
    body: 'Derived from rice processing, our rice paper is a versatile, value-added product with applications across food, craft, and packaging — showcasing the untapped potential of Northeast India\'s staple crop.',
    image: '/static-site/assets/rice_paper_about.png',
    imageAlt: 'Rice paper product',
    imagePosition: 'right',
  },
];

/* ── Helpers ── */
const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));

const StorytellingSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const rafId = useRef(0);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const isSnapping = useRef(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* Snap to nearest panel on scroll end */
  const snapToNearestPanel = useCallback(() => {
    if (isSnapping.current || !containerRef.current) return;

    const el = containerRef.current;
    const rect = el.getBoundingClientRect();
    const wrapperTop = rect.top + window.scrollY;
    // scrollable = the range over which progress goes 0→1
    const scrollable = el.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return;

    const currentScroll = window.scrollY - wrapperTop;
    // Only snap when inside the active scroll zone (not the relaxation tail)
    const activeScrollable = (el.offsetHeight - window.innerHeight * 1.4);
    if (currentScroll < 0 || currentScroll > activeScrollable + window.innerHeight * 0.5) return;

    const currentProgress = clamp(currentScroll / scrollable);

    // Each panel is centered at progress = i / (NUM_PANELS - 1)
    let nearestPanel = 0;
    let nearestDist = Infinity;
    for (let i = 0; i < NUM_PANELS; i++) {
      const panelProgress = i / (NUM_PANELS - 1);
      const dist = Math.abs(currentProgress - panelProgress);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestPanel = i;
      }
    }

    const targetProgress = nearestPanel / (NUM_PANELS - 1);
    const targetScrollY = wrapperTop + targetProgress * scrollable;

    if (Math.abs(window.scrollY - targetScrollY) > 5) {
      isSnapping.current = true;
      window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
      setTimeout(() => { isSnapping.current = false; }, 700);
    }
  }, []);

  /* Smooth scroll tracking for animations + snap on scroll end */
  useEffect(() => {
    const handleScroll = () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      scrollTimeout.current = setTimeout(() => {
        if (!isMobile) {
          snapToNearestPanel();
        }
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const tick = () => {
      const el = containerRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const wrapperTop = rect.top + window.scrollY;
        const scrollable = el.offsetHeight - window.innerHeight;
        if (scrollable > 0) {
          const raw = clamp((window.scrollY - wrapperTop) / scrollable);
          setProgress(raw);
        }
      }
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId.current);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [isMobile, snapToNearestPanel]);

  /* Per-panel visibility (0–1) for fade animations */
  const panelVisibility = useCallback(
    (idx: number) => {
      const panelCenter = idx / (NUM_PANELS - 1);
      const distance = Math.abs(progress - panelCenter);
      const halfWidth = 1 / (NUM_PANELS - 1) * 0.6;
      return clamp(1 - distance / halfWidth);
    },
    [progress],
  );

  const translateX = progress * (NUM_PANELS - 1) * 100;

  /* ─── MOBILE: Swipeable horizontal carousel ─── */
  if (isMobile) {
    return (
      <MobileCarousel navigate={navigate} />
    );
  }

  /* ─── DESKTOP: Horizontal scroll ─── */
  return (
    <div
      id="about"
      ref={containerRef}
      className="relative scroll-mt-20"
      style={{ height: `${(NUM_PANELS + 0.4) * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-background-light">
        {/* Horizontal track */}
        <div
          className="flex h-full will-change-transform"
          style={{
            width: `${NUM_PANELS * 100}vw`,
            transform: `translate3d(-${translateX}vw, 0, 0)`,
            transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        >
          {PANELS.map((panel, idx) => (
            <DesktopPanel
              key={idx}
              panel={panel}
              index={idx}
              visibility={panelVisibility(idx)}
              navigate={navigate}
            />
          ))}
        </div>

        {/* Progress dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
          {PANELS.map((_, idx) => {
            const panelCenter = idx / (NUM_PANELS - 1);
            const dist = Math.abs(progress - panelCenter);
            const active = dist < 1 / (NUM_PANELS - 1) * 0.55;
            return (
              <div
                key={idx}
                className="transition-all duration-500 rounded-full"
                style={{
                  width: active ? 28 : 8,
                  height: 8,
                  background: active ? '#2B052E' : '#2B052E30',
                }}
              />
            );
          })}
        </div>

        {/* Scroll hint on first panel */}
        <div
          className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 transition-opacity duration-700"
          style={{ opacity: progress < 0.04 ? 1 : 0, pointerEvents: 'none' }}
        >
          <span
            className="text-[10px] uppercase tracking-[0.25em] font-bold"
            style={{ color: '#6B5E5E80' }}
          >
            Scroll to explore
          </span>
          <div
            className="w-px h-8"
            style={{
              background: 'linear-gradient(to bottom, #6B5E5E50, transparent)',
            }}
          />
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
  visibility: number;
  navigate: ReturnType<typeof useNavigate>;
}

const DesktopPanel: React.FC<DesktopPanelProps> = ({ panel, index, visibility, navigate }) => {
  const hasImage = !!panel.image;
  const imageLeft = panel.imagePosition === 'left';

  /* Subtle parallax: image shifts opposite to scroll */
  const parallax = (1 - visibility) * (imageLeft ? -4 : 4);
  const textFade = clamp(visibility * 1.8);
  const textShift = (1 - clamp(visibility * 1.5)) * 40;

  /* ── Full-width intro panel (no image) ── */
  if (!hasImage) {
    return (
      <div
        className="flex-shrink-0 w-screen h-full flex items-center justify-center px-12"
        style={{ background: index === 0 ? '#eef2f6' : '#eef2f6' }}
      >
        <div
          className="max-w-2xl text-center"
          style={{
            opacity: textFade,
            transform: `translateY(${textShift}px)`,
          }}
        >
          <p
            className="text-[10px] font-bold uppercase tracking-[0.35em] mb-5"
            style={{ color: '#7B4B11' }}
          >
            {panel.tag}
          </p>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05]"
            style={{ color: '#2B052E' }}
          >
            {panel.title}
          </h2>
          <p
            className="text-base md:text-lg font-medium leading-relaxed mt-6 max-w-xl mx-auto"
            style={{ color: '#6B5E5E' }}
          >
            {panel.body}
          </p>
        </div>
      </div>
    );
  }

  /* ── Split panel: image + text ── */
  const imageBlock = (
    <div
      className="w-1/2 h-full relative overflow-hidden flex-shrink-0"
      style={{ background: '#E8E0D8' }}
    >
      <img
        src={panel.image}
        alt={panel.imageAlt || ''}
        className="absolute inset-0 w-full h-full object-cover will-change-transform"
        style={{
          objectPosition: 'top center',
          transform: `translate3d(${parallax}%, 0, 0) scale(1.05)`,
          transition: 'transform 0.1s linear',
        }}
      />
      {/* Soft gradient overlay where text meets image */}
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
        className={`max-w-lg ${imageLeft ? 'pl-6 lg:pl-8 pr-16 lg:pr-20' : 'pl-16 lg:pl-20 pr-6 lg:pr-8'}`}
        style={{
          opacity: textFade,
          transform: `translateX(${imageLeft ? textShift : -textShift}px)`,
        }}
      >
        <p
          className="text-xs font-bold uppercase tracking-[0.35em] mb-4"
          style={{ color: '#7B4B11' }}
        >
          {panel.tag}
        </p>
        <h2
          className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08]"
          style={{ color: '#2B052E' }}
        >
          {panel.title}
        </h2>
        <p
          className="text-lg font-medium leading-relaxed mt-5"
          style={{ color: '#6B5E5E' }}
        >
          {panel.body}
        </p>
        {/* Product buttons for Cha-bon (index 2) and Rice Paper (index 3) */}
        {(index === 2 || index === 3) && (
          <button
            onClick={() => {
              if (index === 2) {
                navigate('/products#cha-bon');
              } else {
                navigate('/products#rice-paper');
              }
            }}
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
      {imageLeft ? (
        <>
          {imageBlock}
          {textBlock}
        </>
      ) : (
        <>
          {textBlock}
          {imageBlock}
        </>
      )}
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
