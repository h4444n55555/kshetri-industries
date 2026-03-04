import React, { useEffect, useRef, useState, useCallback } from 'react';
import HeroSection from '../components/HeroSection';
import StorytellingSection from '../components/StorytellingSection';

/* ─────────────────────────────────────────────────────────────
   BRAND PALETTE — Chak-hao inspired
   ───────────────────────────────────────────────────────────── */
const BRAND = {
  primary: '#2B052E', // deep black-rice purple
  secondary: '#4B1640', // mid purple
  accent: '#7B4B11', // cinnamon brown
  bg: '#FFFFFF', // clean white
  text: '#2B052E', // same as primary for body text
  textMuted: '#6B5E5E', // warm gray
};

/* ─────────────────────────────────────────────────────────────
   FOUNDERS DATA — all factual content preserved exactly
   ───────────────────────────────────────────────────────────── */
const FOUNDER = {
  name: 'Kshetrimayum Tojo Singh',
  label: 'FOUNDER',
  quote: '"NEVER GIVE IN, NEVER GIVE UP."',
  image: 'https://raw.githubusercontent.com/h4444n55555/images/refs/heads/main/tojo_no_bg.png',
  fallback: 'https://raw.githubusercontent.com/h4444n55555/images/refs/heads/main/tojo_no_bg.png',
  bio: [
    { icon: 'business_center', text: 'Founded Kshetri Industries Pvt. Ltd. in 2025 as a structured evolution of six years of hands-on experience in the food and beverage sector.' },
    { icon: 'school', text: 'Holds a Bachelor of Fine Arts (BFA) — approaching product development with creativity and precision.' },
    { icon: 'eco', text: 'Focused on value-added products developed from indigenous agricultural resources of Northeast India.' },
  ],
};

const COFOUNDER = {
  name: 'Nongmaithem Hans',
  label: 'CO-FOUNDER',
  quote: '"THE JOURNEY OF A THOUSAND MILES BEGINS WITH A SINGLE STEP."',
  image: 'https://raw.githubusercontent.com/h4444n55555/images/refs/heads/main/hans_cropped.png',
  fallback: 'https://raw.githubusercontent.com/h4444n55555/images/refs/heads/main/hans_cropped.png',
  bio: [
    { icon: 'engineering', text: 'Currently pursuing a B.Tech in Artificial Intelligence and Data Engineering at IIT Ropar.' },
    { icon: 'code', text: 'Contributes from a technology and systems perspective — building foundations in software systems, data architecture, and machine learning.' },
    { icon: 'hub', text: 'Focused on responsibly integrating structured systems to enhance efficiency, quality monitoring, and long-term scalability.' },
  ],
};

/* ─── Helpers ─── */
const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const remap = (v: number, inLo: number, inHi: number) => clamp((v - inLo) / (inHi - inLo));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* ═══════════════════════════════════════════════════════════
   MOBILE FOUNDERS — vertical swipeable carousel (4 slides)
   ═══════════════════════════════════════════════════════════ */
const MobileFounders: React.FC = () => {
  const [activeIdx, setActiveIdx] = React.useState(0);
  const [dragOffset, setDragOffset] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const touchStartX = React.useRef<number | null>(null);
  const touchStartY = React.useRef<number | null>(null);
  const isHorizontal = React.useRef<boolean | null>(null);
  const sectionRef = React.useRef<HTMLElement>(null);
  const activeIdxRef = React.useRef(0);
  const NUM_SLIDES = 4;

  React.useEffect(() => { activeIdxRef.current = activeIdx; }, [activeIdx]);

  React.useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let sx = 0, sy = 0;
    const onStart = (e: TouchEvent) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; };
    const onMove = (e: TouchEvent) => {
      const dx = e.touches[0].clientX - sx;
      const dy = e.touches[0].clientY - sy;
      if (Math.abs(dx) >= Math.abs(dy)) { e.preventDefault(); return; }
      const idx = activeIdxRef.current;
      if (dy > 0 && idx === 0) return;
      if (dy < 0 && idx === NUM_SLIDES - 1) return;
      e.preventDefault();
    };
    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchmove', onMove, { passive: false });
    return () => { el.removeEventListener('touchstart', onStart); el.removeEventListener('touchmove', onMove); };
  }, []);

  const imgFallback = (url: string) => (e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.currentTarget as HTMLImageElement).src = url;
  };

  const goTo = (idx: number) => {
    setActiveIdx(Math.max(0, Math.min(NUM_SLIDES - 1, idx)));
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
      if (Math.abs(dx) > Math.abs(dy) + 4) isHorizontal.current = true;
      else if (Math.abs(dy) > Math.abs(dx) + 4) isHorizontal.current = false;
    }
    if (isHorizontal.current) {
      e.preventDefault();
      let offset = dx;
      if ((activeIdx === 0 && dx > 0) || (activeIdx === NUM_SLIDES - 1 && dx < 0)) offset = dx * 0.18;
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

  const slides = [
    /* 0 — Intro */
    <div key="intro" className="flex-shrink-0 w-screen h-full flex flex-col items-center justify-center px-8 bg-background-light">
      <div className="text-center" style={{ opacity: activeIdx === 0 ? 1 : 0, transform: activeIdx === 0 ? 'translateX(0)' : 'translateX(20px)', transition: 'opacity 0.5s ease-out, transform 0.5s ease-out' }}>
        <p className="text-[10px] font-bold uppercase tracking-[0.35em] mb-4" style={{ color: '#7B4B11' }}>Kshetri Industries Pvt. Ltd.</p>
        <h2 className="text-4xl font-black tracking-tight leading-[0.95] mb-4" style={{ color: '#2B052E' }}>Meet the<br /><span style={{ color: '#4B1640' }}>Founders</span></h2>
        <p className="text-sm font-medium leading-relaxed max-w-xs" style={{ color: '#6B5E5E' }}>The visionaries behind our mission</p>
        <div className="mt-8 flex items-center justify-center" style={{ color: '#2B052E40' }}>
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold">
            Swipe to explore
          </p>
        </div>
      </div>
    </div>,

    /* 1 — Tojo */
    <div key="tojo" className="flex-shrink-0 w-screen h-full flex flex-col overflow-hidden bg-background-light">
      <div className="relative flex-shrink-0 overflow-hidden" style={{ height: '52svh' }}>
        <img src={FOUNDER.image} alt={FOUNDER.name} onError={imgFallback(FOUNDER.fallback)}
          className="absolute inset-0 w-full h-full object-contain object-bottom"
          style={{ transform: activeIdx === 1 ? 'scale(1)' : 'scale(1.06)', transition: 'transform 0.7s ease-out' }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent 55%, rgba(238,242,246,0.75) 100%)' }} />
        <div className="absolute top-5 left-6">
          <p className="text-[9px] font-bold uppercase tracking-[0.35em]" style={{ color: '#7B4B11' }}>Founder</p>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center px-7 py-5 overflow-auto"
        style={{ opacity: activeIdx === 1 ? 1 : 0, transform: activeIdx === 1 ? 'translateX(0)' : 'translateX(18px)', transition: 'opacity 0.5s ease-out 0.15s, transform 0.5s ease-out 0.15s' }}>
        <h3 className="text-xl font-black tracking-tight leading-tight mb-2" style={{ color: '#0F172A' }}>{FOUNDER.name}</h3>
        <blockquote className="text-xs font-medium italic pl-4 py-1 mb-3" style={{ color: '#475569', borderLeft: '2px solid #4F46E5' }}>{FOUNDER.quote}</blockquote>
        <div className="space-y-2">
          {FOUNDER.bio.map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="material-symbols-outlined text-sm shrink-0 mt-0.5" style={{ color: '#4F46E5', fontSize: '16px' }}>{item.icon}</span>
              <p className="text-xs font-medium leading-relaxed" style={{ color: '#475569' }}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>,

    /* 2 — Hans */
    <div key="hans" className="flex-shrink-0 w-screen h-full flex flex-col overflow-hidden bg-background-light">
      <div className="relative flex-shrink-0 overflow-hidden" style={{ height: '52svh' }}>
        <img src={COFOUNDER.image} alt={COFOUNDER.name} onError={imgFallback(COFOUNDER.fallback)}
          className="absolute inset-0 w-full h-full object-contain object-bottom"
          style={{ transform: activeIdx === 2 ? 'scale(1)' : 'scale(1.06)', transition: 'transform 0.7s ease-out' }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent 55%, rgba(238,242,246,0.75) 100%)' }} />
        <div className="absolute top-5 left-6">
          <p className="text-[9px] font-bold uppercase tracking-[0.35em]" style={{ color: '#7B4B11' }}>Co-Founder</p>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center px-7 py-5 overflow-auto"
        style={{ opacity: activeIdx === 2 ? 1 : 0, transform: activeIdx === 2 ? 'translateX(0)' : 'translateX(18px)', transition: 'opacity 0.5s ease-out 0.15s, transform 0.5s ease-out 0.15s' }}>
        <h3 className="text-xl font-black tracking-tight leading-tight mb-2" style={{ color: '#0F172A' }}>{COFOUNDER.name}</h3>
        <blockquote className="text-xs font-medium italic pl-4 py-1 mb-3" style={{ color: '#475569', borderLeft: '2px solid #4F46E5' }}>{COFOUNDER.quote}</blockquote>
        <div className="space-y-2">
          {COFOUNDER.bio.map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="material-symbols-outlined text-sm shrink-0 mt-0.5" style={{ color: '#4F46E5', fontSize: '16px' }}>{item.icon}</span>
              <p className="text-xs font-medium leading-relaxed" style={{ color: '#475569' }}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>,

    /* 3 — Unity */
    <div key="unity" className="flex-shrink-0 w-screen h-full flex flex-col items-center justify-center px-7" style={{ background: 'linear-gradient(145deg, #0F172A 0%, #1A1033 100%)' }}>
      <div style={{ opacity: activeIdx === 3 ? 1 : 0, transform: activeIdx === 3 ? 'translateX(0)' : 'translateX(20px)', transition: 'opacity 0.5s ease-out 0.1s, transform 0.5s ease-out 0.1s' }}>
        <h2 className="text-2xl font-black tracking-tight leading-[1.12] mb-3 text-center" style={{ color: '#F1F5F9' }}>
          Together, we're building the next generation of{' '}
          <span style={{ color: '#A78BFA', fontStyle: 'italic' }}>value-added products.</span>
        </h2>
        <p className="text-sm font-medium leading-relaxed text-center mb-8" style={{ color: '#64748B' }}>Rooted in Northeast India. Designed for global scale.</p>
        <div className="flex justify-center gap-5">
          {[{ person: FOUNDER, href: 'https://www.linkedin.com/in/tojo-kshetrimayum-296a87238/', objFit: 'cover' as const, objPos: 'center 5%' },
            { person: COFOUNDER, href: 'https://www.linkedin.com/in/hans-nongmaithem-88504a320/', objFit: 'contain' as const, objPos: 'center top' }].map(({ person, href, objFit, objPos }) => (
            <div key={person.name} className="flex flex-col items-center gap-2">
              <div className="relative overflow-hidden" style={{ width: 120, height: 160, borderRadius: 12, background: '#F8F6F2', boxShadow: '0 8px 28px rgba(0,0,0,0.35)' }}>
                <img src={person.image} alt={person.name} onError={imgFallback(person.fallback)}
                  className="w-full h-full" style={{ objectFit: objFit, objectPosition: objPos }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(15,23,42,0.65) 0%, transparent 55%)' }} />
              </div>
              <p className="text-[11px] font-bold text-center" style={{ color: '#E2E8F0' }}>{person.name}</p>
              <p className="text-[8px] font-semibold uppercase tracking-[0.25em]" style={{ color: '#7C3AED' }}>{person.label}</p>
              <a href={href} target="_blank" rel="noreferrer"
                className="flex items-center justify-center w-6 h-6 rounded-md" style={{ color: '#64748B', background: 'rgba(255,255,255,0.07)' }}>
                <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>,
  ];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-background-light"
      style={{ height: '100svh' }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Horizontal track */}
      <div
        className="flex flex-row will-change-transform h-full"
        style={{
          width: `${NUM_SLIDES * 100}vw`,
          transform: `translate3d(${translateX}vw, 0, 0)`,
          transition: isDragging ? 'none' : 'transform 0.42s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      >
        {slides}
      </div>
      {/* Bottom dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {slides.map((_, idx) => (
          <button key={idx} onClick={() => goTo(idx)}
            className="rounded-full transition-all duration-400"
            style={{ height: 7, width: activeIdx === idx ? 24 : 7, background: activeIdx === idx ? '#2B052E' : '#2B052E30' }}
          />
        ))}
      </div>
    </section>
  );
};

const HomePage: React.FC = () => {
  const [openAlbum, setOpenAlbum] = useState<number | null>(null);
  const [albumImageIdx, setAlbumImageIdx] = useState(0);

  /* ═══════════════════════════════════════════════════════════
     FOUNDERS — scroll-locked cinematic section
     Pure continuous scroll, no snapping, no interruptions.
     ═══════════════════════════════════════════════════════════ */
  const SCROLL_VH = 1000;
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1280 || navigator.maxTouchPoints > 0);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  const foundersRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  const animFrameId = useRef(0);
  const lastRaw = useRef(0);
  const stableFrames = useRef(0);
  const isSnapped = useRef(false);
  const foundersInView = useRef(false);

  /* Keyframe positions — clean resting points */
  const KEYFRAMES = [0, 0.12, 0.33, 0.44, 0.55, 0.74, 0.88, 1.0];

  const nearestKeyframe = (v: number) =>
    KEYFRAMES.reduce((a, b) => (Math.abs(b - v) < Math.abs(a - v) ? b : a));

  /* ── Animation loop — reads scroll position every frame ── */
  useEffect(() => {
    if (navigator.maxTouchPoints > 0) return; // touch devices use MobileFounders — no rAF needed
    const tick = () => {
      if (foundersInView.current) {
        const el = foundersRef.current;
        if (el) {
          const rect = el.getBoundingClientRect();
          const wrapperTop = rect.top + window.scrollY;
          const scrollable = el.offsetHeight - window.innerHeight;
          if (scrollable > 0) {
            const raw = clamp((window.scrollY - wrapperTop) / scrollable);
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

        const diff = targetProgress.current - currentProgress.current;
        if (Math.abs(diff) > 0.0005) {
          currentProgress.current += diff * 0.15;
          setProgress(currentProgress.current);
        }
      }
      animFrameId.current = requestAnimationFrame(tick);
    };
    animFrameId.current = requestAnimationFrame(tick);

    const observer = new IntersectionObserver(
      ([entry]) => { foundersInView.current = entry.isIntersecting; },
      { threshold: 0 }
    );
    if (foundersRef.current) observer.observe(foundersRef.current);

    return () => {
      cancelAnimationFrame(animFrameId.current);
      observer.disconnect();
    };
  }, []);

  /* ═══════════════════════════════════════════════════════════
     CONTINUOUS PROGRESS MAPPING (0 → 1)
     Each section has a hold zone in the middle for breathing room.
     ═══════════════════════════════════════════════════════════ */
  const p = progress;

  const _fadeIn = (lo: number, hi: number) => remap(p, lo, hi);
  const _fadeOut = (lo: number, hi: number) => 1 - remap(p, lo, hi);
  const _fadeInOut = (a: number, b: number, c: number, d: number) =>
    Math.min(_fadeIn(a, b), _fadeOut(c, d));

  /* ── Opening (0.00 – 0.06) ── */
  const openingOpacity = _fadeOut(0.02, 0.06);

  /* ── Tojo hero (0.06 – 0.22) — nice long hold ── */
  const tojoHeroOpacity = _fadeInOut(0.06, 0.08, 0.18, 0.22);
  /* ── Tojo detail (0.22 – 0.40) — long hold ── */
  const tojoDetailOpacity = _fadeInOut(0.22, 0.25, 0.37, 0.40);
  const tojoPresence = Math.max(tojoHeroOpacity, tojoDetailOpacity) > 0.01 ? 1 : 0;
  const tojoT = remap(p, 0.22, 0.30);
  const tojoTranslateX = lerp(0, 24, tojoT);
  const tojoScale = lerp(1.4, 1.15, tojoT);
  const tojoBioOpacity = remap(p, 0.25, 0.29);

  /* ── Transition (0.42 – 0.46) ── */
  const transitionOpacity = _fadeInOut(0.42, 0.43, 0.45, 0.46);

  /* ── Hans hero (0.46 – 0.62) — nice long hold ── */
  const hansHeroOpacity = _fadeInOut(0.46, 0.48, 0.58, 0.62);
  /* ── Hans detail (0.62 – 0.82) — long hold ── */
  const hansDetailOpacity = _fadeInOut(0.62, 0.65, 0.78, 0.82);
  const hansPresence = Math.max(hansHeroOpacity, hansDetailOpacity) > 0.01 ? 1 : 0;
  const hansT = remap(p, 0.62, 0.70);
  const hansTranslateX = lerp(0, -24, hansT);
  const hansScale = lerp(1.4, 1.15, hansT);
  const hansBioOpacity = remap(p, 0.65, 0.72);

  /* ── Unity (0.84 – 1.00) — snaps to full once reached ── */
  const unityOpacity = _fadeIn(0.84, 0.88) > 0.01 ? 1 : 0;

  /* ── Fallback handler ── */
  const imgFallback = (url: string) => (e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.currentTarget as HTMLImageElement).src = url;
  };




  /* ════════════════════════════════════════════════
     MOBILE — simple reveal component
     ════════════════════════════════════════════════ */
  const MobileReveal: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ children, className = '', delay = 0 }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) { setVisible(true); obs.unobserve(el); }
      }, { threshold: 0.15 });
      obs.observe(el);
      return () => obs.disconnect();
    }, []);
    return (
      <div ref={ref} className={className} style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 0.7s ease-out ${delay}s, transform 0.7s ease-out ${delay}s`,
      }}>{children}</div>
    );
  };

  /* ── Shared bio block renderer — premium editorial typography ── */
  const BioBlock: React.FC<{ person: typeof FOUNDER; opacity: number }> = ({ person }) => (
    <div className="max-w-[480px] space-y-6">
      <p className="text-[11px] font-bold uppercase tracking-[0.4em]" style={{ color: '#7c6f8a' }}>
        {person.label}
      </p>
      <h3 className="text-3xl md:text-4xl font-black leading-[1.1] tracking-tight" style={{ color: '#0F172A' }}>
        {person.name}
      </h3>
      <blockquote
        className="text-base md:text-lg font-medium italic pl-5 py-2"
        style={{
          color: '#475569',
          borderLeft: '3px solid #4F46E5',
        }}
      >
        {person.quote}
      </blockquote>
      <div className="space-y-4 pt-1">
        {person.bio.map((item, i) => (
          <div key={i} className="flex items-start gap-3">
            <span
              className="material-symbols-outlined text-lg mt-0.5 shrink-0"
              style={{ color: '#4F46E5' }}
            >{item.icon}</span>
            <p className="font-medium text-sm" style={{ color: '#475569', lineHeight: '1.85' }}>
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  /* ── Portrait with ambient radial gradient ── */
  const Portrait: React.FC<{
    person: typeof FOUNDER;
    style?: React.CSSProperties;
    className?: string;
  }> = ({ person, style = {}, className = '' }) => (
    <div className={`relative ${className}`} style={style}>
      <img
        alt={person.name}
        src={person.image}
        onError={imgFallback(person.fallback)}
        className="w-full h-full object-contain object-bottom relative"
      />
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <div>
        <HeroSection />
      </div>

      {/* Horizontal Storytelling Section */}
      <StorytellingSection />

      {/* ═══════════════════════════════════════════════════════════
          FOUNDERS — Mobile: swipeable carousel / Desktop: cinematic
          ═══════════════════════════════════════════════════════════ */}
      {isMobile ? <MobileFounders /> : (
        <div
          ref={foundersRef}
          className="relative"
          style={{ height: `${SCROLL_VH}vh` }}
        >
          <div className="sticky top-0 h-screen w-full overflow-hidden bg-background-light">

            {/* ── STAGE 0: Opening ── */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                opacity: openingOpacity,
                transform: `translateY(${(1 - openingOpacity) * -15}px)`,
                transition: 'opacity 0.15s linear, transform 0.15s linear',
                pointerEvents: openingOpacity > 0.1 ? 'auto' : 'none',
              }}
            >
              <div className="text-center max-w-3xl px-6">
                <p className="text-xs font-bold uppercase tracking-[0.3em] mb-6" style={{ color: BRAND.accent }}>
                  Kshetri Industries Pvt. Ltd.
                </p>
                <h2 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95]" style={{ color: BRAND.primary }}>
                  Meet the<br />
                  <span style={{ color: BRAND.secondary }}>Founders</span>
                </h2>
                <p className="mt-6 text-base md:text-lg font-medium max-w-lg mx-auto leading-relaxed" style={{ color: BRAND.textMuted }}>
                  The visionaries behind our mission
                </p>
                <div className="mt-12 flex flex-col items-center gap-2" style={{ color: `${BRAND.textMuted}80` }}>
                  <span className="text-[10px] uppercase tracking-[0.25em] font-bold">Scroll</span>
                  <div className="w-px h-10" style={{ background: `linear-gradient(to bottom, ${BRAND.textMuted}60, transparent)` }} />
                </div>
              </div>
            </div>

            {/* ── STAGES 1-2: Tojo — editorial entry + split detail ── */}
            <div
              className="absolute inset-0"
              style={{
                opacity: tojoPresence,
                pointerEvents: tojoPresence > 0.1 ? 'auto' : 'none',
              }}
            >
              {/* Label — "Founder" — BEHIND image, positioned higher */}
              <div
                className={`absolute inset-0 flex ${isMobile ? 'items-center' : 'items-start'} justify-center`}
                style={{
                  zIndex: 1,
                  paddingTop: isMobile ? 0 : '6vh',
                  paddingBottom: isMobile ? '10vh' : 0,
                  opacity: tojoHeroOpacity * (1 - tojoT),
                  transition: 'opacity 0.7s ease-out',
                }}
              >
                <h2 className="text-[4rem] md:text-[12rem] lg:text-[16rem] font-black tracking-tighter leading-[0.85] text-center select-none" style={{ fontFamily: 'Montserrat, sans-serif', color: 'rgba(15, 23, 42, 0.5)', textShadow: '0 2px 8px rgba(15, 23, 42, 0.08)' }}>
                  Founder
                </h2>
              </div>

              {/* Portrait — touches bottom edge, transforms to split-right (desktop only) */}
              <div
                className="absolute inset-0 flex items-end justify-center"
                style={{ zIndex: 5 }}
              >
                <Portrait
                  person={FOUNDER}
                  className="will-change-transform"
                  style={{
                    width: '100%',
                    height: isMobile ? '50vh' : '82vh',
                    maxHeight: isMobile ? '55vh' : '88vh',
                    transform: isMobile
                      ? `scale(${tojoScale})`
                      : `translateX(${tojoTranslateX}vw) scale(${tojoScale})`,
                    transformOrigin: 'center bottom',
                    transition: 'transform 0.7s ease-out',
                    opacity: isMobile ? (1 - tojoBioOpacity) : 1,
                  }}
                />
              </div>




              {/* Bio — left side on desktop, centered on mobile */}
              <div
                className={isMobile
                  ? "absolute inset-0 flex items-center justify-center px-6"
                  : "absolute left-0 top-0 bottom-0 flex items-center"}
                style={{
                  zIndex: 10,
                  ...(isMobile ? {} : {
                    width: '45%',
                    paddingLeft: 'clamp(3rem, 6vw, 7rem)',
                    paddingRight: 'clamp(1.5rem, 2vw, 3rem)',
                  }),
                  opacity: tojoBioOpacity,
                  transform: `translateY(${(1 - tojoBioOpacity) * 20}px)`,
                  transition: 'opacity 0.7s ease-out, transform 0.7s ease-out',
                  pointerEvents: tojoBioOpacity > 0.1 ? 'auto' : 'none',
                }}
              >
                <BioBlock person={FOUNDER} opacity={tojoBioOpacity} />
              </div>
            </div>

            {/* ── STAGE 3: Transition ── */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                opacity: transitionOpacity,
                transform: `translateY(${(1 - transitionOpacity) * 15}px)`,
                transition: 'opacity 0.15s linear, transform 0.15s linear',
                pointerEvents: transitionOpacity > 0.1 ? 'auto' : 'none',
              }}
            >
              <div className="text-center max-w-2xl px-6">
                <div className="w-16 h-px mx-auto mb-8" style={{ background: `${BRAND.secondary}60` }} />
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight" style={{ color: BRAND.primary }}>
                  Built on Partnership.<br />
                  <span style={{ color: BRAND.secondary }}>
                    Scaled by Innovation.
                  </span>
                </h2>
                <div className="w-16 h-px mx-auto mt-8" style={{ background: `${BRAND.secondary}60` }} />
              </div>
            </div>

            {/* ── STAGES 4-5: Hans — editorial entry + split detail ── */}
            <div
              className="absolute inset-0"
              style={{
                opacity: hansPresence,
                pointerEvents: hansPresence > 0.1 ? 'auto' : 'none',
              }}
            >
              {/* Label — "Co-Founder" — BEHIND image, positioned higher */}
              <div
                className={`absolute inset-0 flex ${isMobile ? 'items-center' : 'items-start'} justify-center`}
                style={{
                  zIndex: 1,
                  paddingTop: isMobile ? 0 : '4vh',
                  paddingBottom: isMobile ? '10vh' : 0,
                  opacity: hansHeroOpacity * (1 - hansT),
                  transition: 'opacity 0.7s ease-out',
                }}
              >
                <h2 className="text-[3rem] md:text-[10rem] lg:text-[14rem] font-black tracking-tighter leading-[0.85] text-center select-none" style={{ fontFamily: 'Montserrat, sans-serif', color: 'rgba(15, 23, 42, 0.5)', textShadow: '0 2px 8px rgba(15, 23, 42, 0.08)' }}>
                  Co-Founder
                </h2>
              </div>

              {/* Portrait — touches bottom edge, transforms to split-left (desktop only) */}
              <div
                className="absolute inset-0 flex items-end justify-center"
                style={{ zIndex: 5 }}
              >
                <Portrait
                  person={COFOUNDER}
                  className="will-change-transform"
                  style={{
                    width: '100%',
                    height: isMobile ? '50vh' : '90vh',
                    maxHeight: isMobile ? '55vh' : '95vh',
                    transform: isMobile
                      ? `scale(${hansScale})`
                      : `translateX(${hansTranslateX}vw) scale(${hansScale})`,
                    transformOrigin: 'center bottom',
                    transition: 'transform 0.7s ease-out',
                    opacity: isMobile ? (1 - hansBioOpacity) : 1,
                  }}
                />
              </div>





              {/* Bio — right side on desktop, centered on mobile */}
              <div
                className={isMobile
                  ? "absolute inset-0 flex items-center justify-center px-6"
                  : "absolute right-0 top-0 bottom-0 flex items-center"}
                style={{
                  zIndex: 10,
                  ...(isMobile ? {} : {
                    width: '45%',
                    paddingRight: 'clamp(3rem, 6vw, 7rem)',
                    paddingLeft: 'clamp(1.5rem, 2vw, 3rem)',
                  }),
                  opacity: hansBioOpacity,
                  transform: `translateY(${(1 - hansBioOpacity) * 20}px)`,
                  transition: 'opacity 0.7s ease-out, transform 0.7s ease-out',
                  pointerEvents: hansBioOpacity > 0.1 ? 'auto' : 'none',
                }}
              >
                <BioBlock person={COFOUNDER} opacity={hansBioOpacity} />
              </div>
            </div>

            {/* ── STAGE 6: Unity — dark founder closing ── */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                opacity: unityOpacity,
                transition: 'opacity 0.15s linear',
                pointerEvents: unityOpacity > 0.1 ? 'auto' : 'none',
                background: 'linear-gradient(145deg, #0F172A 0%, #1A1033 100%)',
              }}
            >
              <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-14 px-8 md:px-12">

                {/* ── LEFT: Message ── */}
                <div className="flex-1 flex flex-col justify-center text-center md:text-left min-w-0">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight leading-[1.12] mb-4" style={{ color: '#F1F5F9' }}>
                    Together, we're building<br className="hidden md:block" /> the next generation of{' '}
                    <span style={{ color: '#A78BFA', fontStyle: 'italic' }}>value-added products.</span>
                  </h2>
                  <p className="text-sm md:text-[15px] font-medium leading-relaxed max-w-md" style={{ color: '#64748B' }}>
                    Rooted in Northeast India.&nbsp; Designed for global scale.
                  </p>
                </div>

                {/* ── RIGHT: Founder cards ── */}
                <div className="flex-shrink-0 flex items-stretch gap-4 md:gap-5">

                  {/* Tojo */}
                  <div className="flex flex-col items-center gap-2.5">
                    <div className="relative overflow-hidden" style={{
                      width: 'clamp(145px, 17vw, 200px)',
                      height: 'clamp(200px, 24vw, 280px)',
                      borderRadius: '16px',
                      background: '#F8F6F2',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.3), 0 2px 12px rgba(0,0,0,0.15)',
                    }}>
                      <img
                        alt={FOUNDER.name}
                        src={FOUNDER.image}
                        onError={imgFallback(FOUNDER.fallback)}
                        className="w-full h-full object-cover"
                        style={{ objectPosition: 'center 5%' }}
                      />
                      <div className="absolute inset-0" style={{
                        background: 'linear-gradient(to top, rgba(15,23,42,0.65) 0%, rgba(15,23,42,0.08) 45%, transparent 100%)',
                      }} />
                    </div>
                    <div className="text-center pt-0.5">
                      <p className="text-[13px] font-bold leading-tight tracking-[-0.01em]" style={{ color: '#E2E8F0' }}>
                        {FOUNDER.name}
                      </p>
                      <p className="text-[8px] font-semibold uppercase tracking-[0.28em] mt-1" style={{ color: '#7C3AED' }}>
                        {FOUNDER.label}
                      </p>
                      <a
                        href="https://www.linkedin.com/in/tojo-kshetrimayum-296a87238/"
                        target="_blank" rel="noreferrer"
                        className="inline-flex items-center justify-center mt-2.5 w-7 h-7 rounded-md transition-all duration-200"
                        style={{ color: '#64748B', background: 'rgba(255,255,255,0.05)' }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#0A66C2'; e.currentTarget.style.transform = 'scale(1.15)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#64748B'; e.currentTarget.style.transform = 'scale(1)'; }}
                        aria-label="LinkedIn"
                      >
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                      </a>
                    </div>
                  </div>

                  {/* Hans */}
                  <div className="flex flex-col items-center gap-2.5">
                    <div className="relative overflow-hidden" style={{
                      width: 'clamp(145px, 17vw, 200px)',
                      height: 'clamp(200px, 24vw, 280px)',
                      borderRadius: '16px',
                      background: '#F8F6F2',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.3), 0 2px 12px rgba(0,0,0,0.15)',
                    }}>
                      <img
                        alt={COFOUNDER.name}
                        src={COFOUNDER.image}
                        onError={imgFallback(COFOUNDER.fallback)}
                        className="w-full h-full object-contain"
                        style={{ objectPosition: 'center top' }}
                      />
                      <div className="absolute inset-0" style={{
                        background: 'linear-gradient(to top, rgba(15,23,42,0.65) 0%, rgba(15,23,42,0.08) 45%, transparent 100%)',
                      }} />
                    </div>
                    <div className="text-center pt-0.5">
                      <p className="text-[13px] font-bold leading-tight tracking-[-0.01em]" style={{ color: '#E2E8F0' }}>
                        {COFOUNDER.name}
                      </p>
                      <p className="text-[8px] font-semibold uppercase tracking-[0.28em] mt-1" style={{ color: '#7C3AED' }}>
                        {COFOUNDER.label}
                      </p>
                      <a
                        href="https://www.linkedin.com/in/hans-nongmaithem-88504a320/"
                        target="_blank" rel="noreferrer"
                        className="inline-flex items-center justify-center mt-2.5 w-7 h-7 rounded-md transition-all duration-200"
                        style={{ color: '#64748B', background: 'rgba(255,255,255,0.05)' }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#0A66C2'; e.currentTarget.style.transform = 'scale(1.15)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#64748B'; e.currentTarget.style.transform = 'scale(1)'; }}
                        aria-label="LinkedIn"
                      >
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                      </a>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>{/* /sticky */}
        </div>
      )}
      {/* ═══════════════════════════════════════════════════════════
         AWARDS & RECOGNITION
         ═══════════════════════════════════════════════════════════ */}
      {(() => {
        const AWARDS = [
          {
            name: 'Emerging Beverage Startup',
            org: 'Northeast Entrepreneurs Meet (NEEM)',
            year: '2026',
            description: 'Kshetri Industries Pvt. Ltd. was recognized at the Northeast Entrepreneurs Meet (NEEM) 2026 with the NEB Award for Emerging Beverage Startup, honoring innovation and growth in the regional startup ecosystem.',
            images: [
              'https://raw.githubusercontent.com/h4444n55555/images/refs/heads/main/NEEM.jpeg',
              'https://raw.githubusercontent.com/h4444n55555/images/refs/heads/main/NEEM%20cert.jpeg',
            ],
          },
        ];

        const active = openAlbum !== null ? AWARDS[openAlbum] : null;
        const currentImg = active ? active.images[albumImageIdx] : '';
        const totalImages = active ? active.images.length : 0;

        return (
          <section className="relative w-full pt-16 md:pt-24 z-10" style={{ background: '#EEF2F6', boxShadow: '0 -10px 40px rgba(0,0,0,0.03)' }}>
            {/* Header */}
            <div className="max-w-5xl mx-auto px-6 md:px-12 mb-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-2" style={{ color: BRAND.accent }}>
                Recognition
              </p>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight leading-snug" style={{ color: BRAND.primary }}>
                Awards & Recognition
              </h2>
              <p className="text-sm font-medium mt-1" style={{ color: '#94A3B8' }}>
                A proud milestone for our team.
              </p>
            </div>

            {/* Grid */}
            <div className="max-w-5xl mx-auto px-6 md:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {AWARDS.map((award, idx) => (
                <button
                  key={idx}
                  onClick={() => { setOpenAlbum(idx); setAlbumImageIdx(0); }}
                  className="group relative overflow-hidden cursor-pointer border-0 p-0 text-left block w-full"
                  style={{
                    borderRadius: '10px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                    background: '#fff',
                  }}
                >
                  {/* Cover image */}
                  <div className="aspect-square w-full overflow-hidden" style={{ borderRadius: '10px 10px 0 0' }}>
                    <img
                      alt={award.name}
                      src={award.images[0]}
                      className="w-full h-full object-cover block transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </div>
                  {/* Card footer */}
                  <div className="px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-[13px] font-bold" style={{ color: BRAND.primary }}>{award.name}</p>
                      <p className="text-[10px] font-medium mt-0.5" style={{ color: '#94A3B8' }}>{award.org} · {award.year}</p>
                    </div>
                    {award.images.length > 1 && (
                      <span className="text-[10px] font-bold px-2 py-1" style={{ color: BRAND.accent, background: 'rgba(123,75,17,0.08)', borderRadius: '6px' }}>
                        +{award.images.length - 1} photo{award.images.length > 2 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Lightbox */}
            {active && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
                style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
                onClick={() => setOpenAlbum(null)}
              >
                <div
                  className="relative flex flex-col md:flex-row w-full max-w-5xl max-h-[90vh] overflow-hidden"
                  style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 24px 80px rgba(0,0,0,0.4)' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Close */}
                  <button
                    className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-200"
                    style={{ background: 'rgba(0,0,0,0.05)', color: '#64748B' }}
                    onClick={() => setOpenAlbum(null)}
                    onMouseEnter={e => (e.currentTarget.style.color = '#0F172A')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#64748B')}
                    aria-label="Close"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>

                  {/* Image viewer */}
                  <div className="flex-1 relative flex items-center justify-center min-h-[250px] md:min-h-0" style={{ background: '#F8FAFC' }}>
                    {/* Prev */}
                    {totalImages > 1 && albumImageIdx > 0 && (
                      <button
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 z-10"
                        style={{ background: 'rgba(255,255,255,0.9)', color: '#475569', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                        onClick={() => setAlbumImageIdx(i => i - 1)}
                        aria-label="Previous"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                      </button>
                    )}
                    {/* Next */}
                    {totalImages > 1 && albumImageIdx < totalImages - 1 && (
                      <button
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 z-10"
                        style={{ background: 'rgba(255,255,255,0.9)', color: '#475569', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                        onClick={() => setAlbumImageIdx(i => i + 1)}
                        aria-label="Next"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                      </button>
                    )}

                    <img
                      alt={`${active.name} - ${albumImageIdx + 1}`}
                      src={currentImg}
                      className="max-w-full max-h-[55vh] md:max-h-[80vh] object-contain p-4"
                    />

                    {/* Image counter */}
                    {totalImages > 1 && (
                      <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] font-bold px-3 py-1 rounded-full" style={{ background: 'rgba(0,0,0,0.06)', color: '#64748B' }}>
                        {albumImageIdx + 1} / {totalImages}
                      </span>
                    )}
                  </div>

                  {/* Details panel */}
                  <div className="w-full md:w-80 flex-shrink-0 p-6 md:p-8 flex flex-col justify-center" style={{ borderTop: '1px solid #F1F5F9', borderLeft: 'none' }}>
                    <style>{`@media (min-width: 768px) { .award-details-border { border-top: none !important; border-left: 1px solid #F1F5F9 !important; } }`}</style>
                    <div className="award-details-border" style={{ borderTop: '1px solid #F1F5F9' }}>
                      <p className="text-[9px] font-bold uppercase tracking-[0.3em] mb-2" style={{ color: BRAND.accent }}>
                        Recognition
                      </p>
                      <h3 className="text-lg font-bold tracking-tight mb-1" style={{ color: BRAND.primary }}>
                        {active.name}
                      </h3>
                      <p className="text-xs font-semibold mb-4" style={{ color: '#94A3B8' }}>
                        {active.org} &middot; {active.year}
                      </p>
                      <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>
                        {active.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        );
      })()}
    </div>
  );
};

export default HomePage;