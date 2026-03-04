import React, { useState, useEffect, useRef, useCallback } from 'react';

interface ProductInfo {
    name: string;
    image: string;
    description: string;
    overlay: string;
    accent: string;
}

const ProductsPage: React.FC = () => {

    const [selectedProduct, setSelectedProduct] = useState<ProductInfo | null>(null);
    const [showRicePaperPopup, setShowRicePaperPopup] = useState(false);

    const nutritionData = [
        ['Energy', '39.82 kcal'],
        ['Total Carbohydrates', '9.82 g'],
        ['Sugar', '8.99 g'],
        ['Protein', '0.12 g'],
        ['Total Lipid', '0.01 g'],
        ['Total Fat', '0.05 g'],
        ['Fiber', '0.01 g'],
        ['Taurine', '400 mg'],
        ['Caffeine', '32 mg']
    ];

    const products: ProductInfo[] = [
        {
            name: 'Chak-hao Natural Flavour',
            image: 'https://raw.githubusercontent.com/h4444n55555/images/refs/heads/main/chak.jpeg',
            description: 'Brewed from Manipur\'s ancient Chak-hao black rice — a grain revered for centuries. Rich, subtly sweet, and naturally energising. No shortcuts. No synthetics. Just heritage in every sip.',
            overlay: 'bg-purple-900/10',
            accent: '#2B052E',
        },
        {
            name: 'Chak-hao with Cinnamon',
            image: 'https://raw.githubusercontent.com/h4444n55555/images/refs/heads/main/cinn.jpeg',
            description: 'The same storied Chak-hao black rice, layered with hand-selected Ceylon cinnamon. Warm, aromatic, and grounded — a flavour built on tradition, sharpened for today.',
            overlay: 'bg-orange-900/10',
            accent: '#4B1640',
        },
        {
            name: 'Angouba Flavour',
            image: 'https://raw.githubusercontent.com/h4444n55555/images/refs/heads/main/white.jpeg',
            description: 'Made from Chak-hao Angouba — Manipur\'s prized sweet white rice, known for its clean finish and delicate aroma. Light, crisp energy rooted in one of the region\'s most celebrated grains.',
            overlay: 'bg-yellow-100/20',
            accent: '#7B4B11',
        },
    ];

    const DRINK_COUNT = products.length; // 3
    const HEADER_BUFFER_VH = 40; // extra scroll room at top for header hide/reveal sequence
    const TAIL_BUFFER_VH = 20;   // extra scroll room at bottom so sticky holds past last product
    const SCROLL_VH = DRINK_COUNT * 100 + HEADER_BUFFER_VH + TAIL_BUFFER_VH;

    /* ── State ── */
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [activeIdx, setActiveIdx] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [insideShowcase, setInsideShowcase] = useState(false);
    const snapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isSnapping = useRef(false);
    const lastScrollY = useRef(0);
    const scrollDir = useRef<'down' | 'up'>('down');

    /* ── Mobile carousel state ── */
    const [mobileIdx, setMobileIdx] = useState(0);
    const [swipeOffset, setSwipeOffset] = useState(0);
    const touchStartRef = useRef<{ x: number; y: number } | null>(null);
    const isSwipingH = useRef<boolean | null>(null);

    const goToMobile = useCallback((idx: number) => {
        setMobileIdx(Math.max(0, Math.min(DRINK_COUNT - 1, idx)));
        setSwipeOffset(0);
        isSwipingH.current = null;
    }, [DRINK_COUNT]);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 1280 || window.matchMedia('(pointer: coarse)').matches);
        check();
        window.addEventListener('resize', check, { passive: true });
        return () => window.removeEventListener('resize', check);
    }, []);

    /* Hide header while inside the showcase section */
    useEffect(() => {
        if (insideShowcase) {
            document.documentElement.setAttribute('data-hide-header', '');
        } else {
            document.documentElement.removeAttribute('data-hide-header');
        }
        return () => document.documentElement.removeAttribute('data-hide-header');
    }, [insideShowcase]);

    /* Snap to nearest panel after user stops scrolling (only in product zone) */
    const snapToPanel = useCallback(() => {
        const el = wrapperRef.current;
        if (!el || isMobile || isSnapping.current) return;
        const rect = el.getBoundingClientRect();
        const scrollable = el.offsetHeight - window.innerHeight;
        if (scrollable <= 0) return;
        const rawOffset = Math.max(0, -rect.top);
        const bufferPx = window.innerHeight * (HEADER_BUFFER_VH / 100);
        const tailPx = window.innerHeight * (TAIL_BUFFER_VH / 100);
        // Don't snap in the header buffer zone or tail zone
        if (rawOffset < bufferPx) return;
        if (rawOffset > scrollable - tailPx) return;
        const productScrollable = scrollable - bufferPx - tailPx;
        if (productScrollable <= 0) return;
        const productRaw = Math.min(1, (rawOffset - bufferPx) / productScrollable);
        // Round in the direction the user was scrolling
        const continuous = productRaw * (DRINK_COUNT - 1);
        const panelIdx = scrollDir.current === 'down'
            ? Math.min(DRINK_COUNT - 1, Math.ceil(continuous))
            : Math.max(0, Math.floor(continuous));
        const targetProgress = panelIdx / (DRINK_COUNT - 1);
        if (Math.abs(productRaw - targetProgress) < 0.02) return;
        const wrapperTop = rect.top + window.scrollY;
        const targetScrollY = wrapperTop + bufferPx + targetProgress * productScrollable;
        isSnapping.current = true;
        window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
        setTimeout(() => { isSnapping.current = false; }, 700);
    }, [isMobile, DRINK_COUNT, HEADER_BUFFER_VH, TAIL_BUFFER_VH]);

    /* RAF scroll → progress */
    const rafId = useRef(0);
    const handleScroll = useCallback(() => {
        cancelAnimationFrame(rafId.current);
        rafId.current = requestAnimationFrame(() => {
            const el = wrapperRef.current;
            if (!el || isMobile) return;
            const rect = el.getBoundingClientRect();
            const scrollable = el.offsetHeight - window.innerHeight;
            if (scrollable <= 0) return;

            // Track scroll direction
            const currentY = window.scrollY;
            if (currentY > lastScrollY.current + 2) scrollDir.current = 'down';
            else if (currentY < lastScrollY.current - 2) scrollDir.current = 'up';
            lastScrollY.current = currentY;

            const rawOffset = Math.max(0, -rect.top); // pixels scrolled into wrapper
            const bufferPx = window.innerHeight * (HEADER_BUFFER_VH / 100);
            const tailPx = window.innerHeight * (TAIL_BUFFER_VH / 100);
            const productScrollable = scrollable - bufferPx - tailPx;

            // Product progress starts AFTER the buffer zone, clamped at 1 during tail
            let productProgress = 0;
            if (rawOffset > bufferPx && productScrollable > 0) {
                productProgress = Math.min(1, (rawOffset - bufferPx) / productScrollable);
            }
            setProgress(productProgress);
            setActiveIdx(Math.min(DRINK_COUNT - 1, Math.round(productProgress * (DRINK_COUNT - 1))));

            // Sticky is active when wrapper fills viewport
            const stickyActive = rect.top <= 0 && rect.bottom >= window.innerHeight;

            // Header hides once we've scrolled ~35% into the buffer zone
            const pastHeaderThreshold = rawOffset > bufferPx * 0.35;
            setInsideShowcase(stickyActive && pastHeaderThreshold);

            // Disable CSS smooth scrolling during showcase (prevents double-smooth conflicts)
            if (stickyActive) {
                document.documentElement.style.scrollBehavior = 'auto';
            } else {
                document.documentElement.style.scrollBehavior = '';
            }

            // Debounced snap: only in the product zone (not header buffer or tail)
            const inProductZone = stickyActive && rawOffset >= bufferPx && rawOffset <= scrollable - tailPx;
            if (inProductZone && !isSnapping.current) {
                if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
                snapTimerRef.current = setTimeout(snapToPanel, 400);
            }
        });
    }, [isMobile, DRINK_COUNT, HEADER_BUFFER_VH, TAIL_BUFFER_VH, snapToPanel]);

    useEffect(() => {
        if (isMobile) return;
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => {
            window.removeEventListener('scroll', handleScroll);
            cancelAnimationFrame(rafId.current);
            if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
            document.documentElement.style.scrollBehavior = '';
        };
    }, [handleScroll, isMobile]);

    /* Per-product text opacity: fade in near center, fade out at edges */
    const getTextOpacity = (idx: number) => {
        const segStart = idx / DRINK_COUNT;
        const segEnd = (idx + 1) / DRINK_COUNT;
        const segMid = (segStart + segEnd) / 2;
        const half = (segEnd - segStart) / 2;
        const fadeZone = half * 0.35;
        if (idx === 0 && progress <= segMid) return 1;
        if (idx === DRINK_COUNT - 1 && progress >= segMid) return 1;
        if (progress < segStart + fadeZone) return Math.max(0, (progress - segStart) / fadeZone);
        if (progress > segEnd - fadeZone) return Math.max(0, (segEnd - progress) / fadeZone);
        return 1;
    };

    /* Interpolate accent color for the left block */
    const lerpColor = (a: string, b: string, t: number) => {
        const parse = (hex: string) => {
            const h = hex.replace('#', '');
            return [parseInt(h.substring(0, 2), 16), parseInt(h.substring(2, 4), 16), parseInt(h.substring(4, 6), 16)];
        };
        const ca = parse(a), cb = parse(b);
        const r = Math.round(ca[0] + (cb[0] - ca[0]) * t);
        const g = Math.round(ca[1] + (cb[1] - ca[1]) * t);
        const bl = Math.round(ca[2] + (cb[2] - ca[2]) * t);
        return `rgb(${r},${g},${bl})`;
    };

    const getAccentBg = () => {
        const exact = progress * DRINK_COUNT;
        const lo = Math.min(DRINK_COUNT - 1, Math.floor(exact));
        const hi = Math.min(DRINK_COUNT - 1, lo + 1);
        const t = exact - lo;
        return lerpColor(products[lo].accent, products[hi].accent, t);
    };

    /* Subtle parallax on image */
    const getImgParallax = (idx: number) => {
        const segMid = (idx + 0.5) / DRINK_COUNT;
        const dist = (progress - segMid) * DRINK_COUNT; // -1 → 1
        return dist * 24; // ±24px
    };

    const drinkChips = [
        { icon: 'bolt', label: 'Taurine', value: '400 mg' },
        { icon: 'coffee', label: 'Caffeine', value: '32 mg' },
        { icon: 'local_fire_department', label: 'Energy', value: '39.82 kcal' },
    ];

    return (
        <div className="flex flex-col">

            {/* ═══════════════════ DESKTOP: Cha-bon horizontal showcase ═══════════════════ */}
            {!isMobile && (
                <div
                    id="cha-bon"
                    ref={wrapperRef}
                    className="relative scroll-mt-20"
                    style={{ height: `${SCROLL_VH}vh` }}
                >
                    {/* Sticky viewport — pinned for the duration of the wrapper */}
                    <div className="sticky top-0 h-screen w-full overflow-hidden flex">

                        {/* ──── Left half: accent color block + fading text ──── */}
                        <div
                            className="w-1/2 h-full relative flex items-center transition-colors duration-700 ease-out"
                            style={{ backgroundColor: getAccentBg() }}
                        >
                            {/* Subtle grain / noise overlay for premium feel */}
                            <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'1\'/%3E%3C/svg%3E")', backgroundSize: '128px 128px' }} />

                            {/* Stacked text layers — only the active one is visible */}
                            {products.map((product, idx) => (
                                <div
                                    key={idx}
                                    className="absolute inset-0 flex flex-col justify-center pl-14 lg:pl-20 xl:pl-28 pr-10 pt-[112px]"
                                    style={{
                                        opacity: getTextOpacity(idx),
                                        transition: 'opacity 0.5s cubic-bezier(0.4,0,0.2,1)',
                                        pointerEvents: idx === activeIdx ? 'auto' : 'none',
                                    }}
                                >
                                    {/* Badge */}
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur-sm rounded-full mb-5 w-fit border border-white/20">
                                        
                                        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/90">Cha-bon Series</span>
                                    </div>

                                    <h2 className="text-4xl md:text-5xl lg:text-[3.4rem] font-black text-white tracking-tight leading-[1.08] mb-4 drop-shadow-sm">
                                        {product.name}
                                    </h2>

                                    <p className="text-white/80 text-base lg:text-lg leading-relaxed max-w-md mb-7">
                                        {product.description}
                                    </p>

                                    {/* Chips */}
                                    <div className="flex flex-wrap gap-2.5 mb-8">
                                        {drinkChips.map((chip) => (
                                            <div
                                                key={chip.label}
                                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15"
                                            >
                                                <span className="material-symbols-outlined text-white/80 text-sm">{chip.icon}</span>
                                                <span className="text-xs font-bold text-white">{chip.value}</span>
                                                <span className="text-[10px] text-white/60 uppercase tracking-wider">{chip.label}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* CTA */}
                                    <button
                                        onClick={() => setSelectedProduct(product)}
                                        className="inline-flex items-center px-6 py-3 bg-white text-slate-800 font-bold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-sm uppercase tracking-widest w-fit"
                                    >
                    
                                        Learn More
                                    </button>

                                    {/* Progress dots */}
                                    <div className="flex items-center gap-2 mt-auto pb-10">
                                        {products.map((_, j) => (
                                            <span
                                                key={j}
                                                className="block rounded-full transition-all duration-500"
                                                style={{
                                                    width: j === activeIdx ? 28 : 8,
                                                    height: 8,
                                                    backgroundColor: j === activeIdx ? '#ffffff' : 'rgba(255,255,255,0.3)',
                                                }}
                                            />
                                        ))}
                                        <span className="text-[11px] text-white/60 font-bold tabular-nums ml-1">
                                            {String(activeIdx + 1).padStart(2, '0')}&thinsp;/&thinsp;{String(DRINK_COUNT).padStart(2, '0')}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ──── Right half: horizontally-scrolling product images ──── */}
                        <div className="w-1/2 h-full relative bg-background-light overflow-hidden">
                            <div
                                className="flex h-full will-change-transform"
                                style={{
                                    width: `${DRINK_COUNT * 100}%`,
                                    transform: `translateX(-${progress * (DRINK_COUNT - 1) * (100 / DRINK_COUNT)}%)`,
                                    transition: 'transform 0.45s cubic-bezier(0.22,1,0.36,1)',
                                }}
                            >
                                {products.map((product, idx) => (
                                    <div
                                        key={idx}
                                        className="flex-shrink-0 h-full flex items-center justify-center relative"
                                        style={{ width: `${100 / DRINK_COUNT}%` }}
                                    >
                                        {/* Ambient glow */}
                                        <div
                                            className="absolute w-[55%] aspect-square rounded-full blur-[100px] opacity-[0.18] pointer-events-none"
                                            style={{ backgroundColor: product.accent }}
                                        />
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="relative max-h-[70vh] w-auto object-contain rounded-3xl shadow-2xl drop-shadow-lg"
                                            style={{
                                                transform: `translateY(${getImgParallax(idx)}px)`,
                                                transition: 'transform 0.4s cubic-bezier(0.22,1,0.36,1)',
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════════════════ MOBILE: Cha-bon swipeable carousel ═══════════════════ */}
            {isMobile && (
                    <section
                        id="cha-bon"
                        className="relative overflow-hidden scroll-mt-20"
                        style={{ height: '100svh' }}
                        onTouchStart={(e) => {
                            touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
                            isSwipingH.current = null;
                        }}
                        onTouchMove={(e) => {
                            if (!touchStartRef.current) return;
                            const dx = e.touches[0].clientX - touchStartRef.current.x;
                            const dy = e.touches[0].clientY - touchStartRef.current.y;

                            if (isSwipingH.current === null) {
                                if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
                                    isSwipingH.current = Math.abs(dx) > Math.abs(dy);
                                }
                            }

                            if (isSwipingH.current) {
                                setSwipeOffset(dx);
                            }
                        }}
                        onTouchEnd={() => {
                            if (isSwipingH.current && Math.abs(swipeOffset) > 50) {
                                goToMobile(swipeOffset < 0 ? mobileIdx + 1 : mobileIdx - 1);
                            } else {
                                setSwipeOffset(0);
                            }
                            touchStartRef.current = null;
                            isSwipingH.current = null;
                        }}
                    >
                        {/* Full accent background */}
                        <div
                            className="absolute inset-0 transition-colors duration-500 ease-out"
                            style={{ backgroundColor: products[mobileIdx].accent }}
                        />

                        {/* Noise texture overlay */}
                        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'1\'/%3E%3C/svg%3E")', backgroundSize: '128px 128px' }} />

                        {/* Content — vertically centered card layout */}
                        <div className="relative z-10 h-full flex flex-col pt-28 px-5 pb-6">
                            {/* Badge + dots top bar */}
                            <div className="flex items-center justify-between mb-3">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-sm rounded-full border border-white/20">
                                    <span className="text-[9px] font-black uppercase tracking-[0.18em] text-white/90">Cha-bon Series</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    {products.map((_, j) => (
                                        <span
                                            key={j}
                                            className="block rounded-full transition-all duration-400"
                                            style={{
                                                width: j === mobileIdx ? 20 : 6,
                                                height: 6,
                                                backgroundColor: j === mobileIdx ? '#fff' : 'rgba(255,255,255,0.3)',
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Product image — centered, swipeable */}
                            <div className="flex-1 relative overflow-hidden min-h-0">
                                <div
                                    className="flex h-full will-change-transform"
                                    style={{
                                        width: `${DRINK_COUNT * 100}%`,
                                        transform: `translateX(calc(-${mobileIdx * (100 / DRINK_COUNT)}% + ${swipeOffset}px))`,
                                        transition: swipeOffset !== 0 ? 'none' : 'transform 0.4s cubic-bezier(0.22,1,0.36,1)',
                                    }}
                                >
                                    {products.map((product, idx) => (
                                        <div
                                            key={idx}
                                            className="flex-shrink-0 h-full flex items-center justify-center relative"
                                            style={{ width: `${100 / DRINK_COUNT}%` }}
                                        >
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="relative max-h-full max-w-full w-auto object-contain drop-shadow-2xl"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Text area below image */}
                            <div className="pt-5 space-y-2.5">
                                <h2 className="text-[1.6rem] font-black text-white tracking-tight leading-[1.1]">
                                    {products[mobileIdx].name}
                                </h2>

                                <p className="text-white/70 text-[13px] leading-relaxed line-clamp-3">
                                    {products[mobileIdx].description}
                                </p>

                                {/* Chips row */}
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    {drinkChips.map((chip) => (
                                        <div key={chip.label} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 text-[10px]">
                                            <span className="material-symbols-outlined text-white/70" style={{ fontSize: '12px' }}>{chip.icon}</span>
                                            <span className="font-bold text-white">{chip.value}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* CTA + swipe hint */}
                                <div className="flex items-center justify-between pt-2">
                                    <button
                                        onClick={() => setSelectedProduct(products[mobileIdx])}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-slate-800 font-bold rounded-full shadow-lg text-xs uppercase tracking-widest"
                                    >
                                        Learn More
                                    </button>
                                    <span className="text-[10px] text-white/40 italic">← Swipe →</span>
                                </div>
                            </div>
                        </div>
                    </section>
            )}

            {/* ═══════════════════ Rice Paper — separate section below ═══════════════════ */}
            <section id="rice-paper" className="min-h-[100svh] flex flex-col md:flex-row bg-background-light relative overflow-hidden scroll-mt-20">
                {/* Left: Info */}
                <div className="w-full md:w-[45%] flex flex-col justify-center px-6 md:px-14 lg:px-20 pt-20 pb-8 md:py-0 relative z-10 order-2 md:order-1">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-background-light shadow-clay-inset rounded-full mb-5 w-fit">
                        <span className="material-symbols-outlined text-primary text-sm">layers</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">Rice Paper</span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] font-black text-slate-800 tracking-tight leading-[1.08] mb-4">
                        Artisan<br />Rice Paper.
                    </h2>

                    <p className="text-text-muted text-base md:text-lg leading-relaxed max-w-md mb-7">
                        Crafted from <span className="text-slate-800 font-bold">Chak-hao Angouba</span> (sweet white rice), a glutinous variety known as the "pride of Manipuri people" for its exceptional taste, aroma, and traditional medicinal uses.
                    </p>

                    <div className="flex flex-wrap gap-2.5 mb-8">
                        {[
                            { icon: 'eco', label: 'Eco-Friendly', sub: '100 % Biodegradable' },
                            { icon: 'diamond', label: 'Premium', sub: 'No Additives' },
                            { icon: 'health_and_safety', label: 'Gluten-Free', sub: 'Allergen Safe' },
                        ].map((item) => (
                            <div key={item.label} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-background-light shadow-clay-sm border border-slate-200/40">
                                <span className="material-symbols-outlined text-primary text-sm">{item.icon}</span>
                                <div className="leading-tight">
                                    <span className="text-xs font-bold text-slate-700 block">{item.label}</span>
                                    <span className="text-[10px] text-text-muted">{item.sub}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => setShowRicePaperPopup(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-sm uppercase tracking-widest w-fit"
                    >
                        
                        Learn More
                    </button>
                </div>

                {/* Right: Image */}
                <div className="w-full md:w-[55%] flex items-center justify-center relative order-1 md:order-2 min-h-[34svh] md:min-h-0 pt-20 md:pt-0">
                    <div className="absolute w-[55%] aspect-square rounded-full blur-[120px] opacity-[0.12] bg-amber-700 pointer-events-none" />
                    <img
                        src="https://raw.githubusercontent.com/h4444n55555/images/refs/heads/main/rice.jpeg"
                        alt="Premium Rice Paper"
                        className="relative max-h-[30svh] md:max-h-[72svh] w-auto object-contain rounded-3xl shadow-2xl drop-shadow-lg transition-transform duration-700 hover:scale-[1.03]"
                    />
                </div>
            </section>

            {/* --- Product Detail Popup Modal --- */}
            {selectedProduct && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn"
                    onClick={() => setSelectedProduct(null)}
                >
                    <div
                        className="bg-white rounded-lg w-[min(92vw,420px)] h-[85vh] overflow-y-auto border border-amber-200 relative animate-scaleIn shadow-xl scrollbar-hide"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedProduct(null)}
                            className="absolute top-3 right-3 h-8 w-8 rounded-full bg-amber-100 border border-amber-300 shadow flex items-center justify-center text-amber-800 hover:bg-amber-200 transition-colors z-10"
                        >
                            <span className="material-symbols-outlined text-lg">close</span>
                        </button>

                        {/* Two Column Grid: Nutrition + Manufacturer */}
                        <div className="grid grid-cols-2 gap-0 p-4 pt-3">
                            {/* Left: Nutrition Facts */}
                            <div className="pr-3 border-r border-amber-200">
                                <h3 className="text-amber-50 text-xs font-bold py-1.5 px-2 mb-3 text-center uppercase tracking-wider rounded-sm" style={{ backgroundColor: selectedProduct.accent }}>
                                    Nutrition Facts
                                </h3>
                                <div className="text-xs text-slate-800">
                                    <p className="font-bold mb-1">Per 100 g</p>
                                    <table className="w-full text-[11px]">
                                        <tbody>
                                            <tr className="border-b border-amber-100"><td className="py-1 text-slate-700">Energy</td><td className="py-1 font-bold text-right">39.82 kcal</td></tr>
                                            <tr className="border-b border-amber-100"><td className="py-1 text-slate-700">Fiber</td><td className="py-1 font-bold text-right">0.01 g</td></tr>
                                            <tr className="border-b border-amber-100"><td className="py-1 text-slate-700">Sugar</td><td className="py-1 font-bold text-right">8.99 g</td></tr>
                                            <tr className="border-b border-amber-100"><td className="py-1 text-slate-700">Total Carbs</td><td className="py-1 font-bold text-right">9.82 g</td></tr>
                                            <tr className="border-b border-amber-100"><td className="py-1 text-slate-700">Protein</td><td className="py-1 font-bold text-right">0.12 g</td></tr>
                                            <tr className="border-b border-amber-100"><td className="py-1 text-slate-700">Total Lipid</td><td className="py-1 font-bold text-right">0.01 g</td></tr>
                                            <tr className="border-b border-amber-100"><td className="py-1 text-slate-700">Total Fat</td><td className="py-1 font-bold text-right">0.05 g</td></tr>
                                            <tr className="border-b border-amber-100"><td className="py-1 text-slate-700">Taurine</td><td className="py-1 font-bold text-right">400 mg</td></tr>
                                            <tr><td className="py-1 text-slate-700">Caffeine</td><td className="py-1 font-bold text-right">32 mg</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Right: Manufacturer & FSSAI Info */}
                            <div className="pl-3">
                                <h3 className="text-amber-50 text-xs font-bold py-1.5 px-2 mb-3 text-center uppercase tracking-wider rounded-sm" style={{ backgroundColor: selectedProduct.accent }}>
                                    Manufacturer Details
                                </h3>
                                <div className="text-[11px] text-slate-800 space-y-2">
                                    {/* FSSAI Logo */}
                                    <div className="flex justify-center py-1">
                                        <a
                                            href="https://www.fssai.gov.in/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:opacity-75 transition-opacity"
                                        >
                                            <img
                                                src="https://upload.wikimedia.org/wikipedia/en/e/e2/FSSAI_logo.png"
                                                alt="FSSAI Logo"
                                                className="h-9"
                                            />
                                        </a>
                                    </div>

                                    <div className="space-y-1 text-[10px]">
                                        <p><span className="font-bold">Company:</span> Kshetri Industries Pvt. Ltd.</p>
                                        <p><span className="font-bold">Address:</span> Kongba Bazar, near Bank of Baroda, Imphal East, Manipur — 795005</p>
                                        <p><span className="font-bold">FSSAI Lic:</span> 21624002000327</p>
                                    </div>

                                    <div className="pt-1 border-t border-amber-200 text-[10px]">
                                        <p className="font-bold mb-0.5">Emails:</p>
                                        <p>ktsingh27@gmail.com</p>
                                        <p>tojokshetrimayum@gmail.com</p>
                                        <p><span className="font-bold">Website:</span> www.kshetriindustries.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pricing & Important Information - Full Width */}
                        <div className="px-4 pb-4">
                            <div className="mb-3">
                                <h3 className="text-amber-50 text-xs font-bold py-1.5 px-2 mb-2 text-center uppercase tracking-wider rounded-sm" style={{ backgroundColor: selectedProduct.accent }}>
                                    Pricing & Dates
                                </h3>
                                <div className="text-[11px] text-slate-800 space-y-0.5">
                                    <p><span className="font-bold">MRP:</span> ₹150.00</p>
                                    <p><span className="font-bold">Mfg Date:</span> 18/02/2026</p>
                                    <p><span className="font-bold">Expiry:</span> 6 months from Mfg. date</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-amber-50 text-xs font-bold py-1.5 px-2 mb-2 text-center uppercase tracking-wider rounded-sm" style={{ backgroundColor: selectedProduct.accent }}>
                                    Warnings / Instructions
                                </h3>
                                <ul className="text-[11px] text-slate-800 space-y-1 list-disc pl-4">
                                    <li>Do not buy if seal is broken or tampered</li>
                                    <li>Store in a cool, dry place</li>
                                    <li>Refrigerate after opening</li>
                                    <li>Not recommended for children, pregnant or lactating women</li>
                                    <li>Rice extract sediments may be present</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- Rice Paper Detail Popup Modal --- */}
            {showRicePaperPopup && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn"
                    onClick={() => setShowRicePaperPopup(false)}
                >
                    <div
                        className="bg-white rounded-lg w-[min(92vw,420px)] h-[85vh] overflow-y-auto border border-amber-200 relative animate-scaleIn shadow-xl scrollbar-hide"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setShowRicePaperPopup(false)}
                            className="absolute top-3 right-3 h-8 w-8 rounded-full bg-amber-100 border border-amber-300 shadow flex items-center justify-center text-amber-800 hover:bg-amber-200 transition-colors z-10"
                        >
                            <span className="material-symbols-outlined text-lg">close</span>
                        </button>

                        {/* Two Column Grid: Product Info + Manufacturer */}
                        <div className="grid grid-cols-2 gap-0 p-4 pt-3">
                            {/* Left: Product Highlights */}
                            <div className="pr-3 border-r border-amber-200">
                                <h3 className="text-amber-50 text-xs font-bold py-1.5 px-2 mb-3 text-center uppercase tracking-wider rounded-sm" style={{ backgroundColor: '#7B4B11' }}>
                                    Product Highlights
                                </h3>
                                <div className="text-[11px] text-slate-800 space-y-2">
                                    {[
                                        { icon: 'eco', color: '#16a34a', label: 'Eco-Friendly', desc: '100% biodegradable, carbon-neutral process' },
                                        { icon: 'diamond', color: '#d97706', label: 'Premium Quality', desc: 'Durable, versatile, no artificial additives' },
                                        { icon: 'health_and_safety', color: '#dc2626', label: 'Gluten-Free', desc: 'Naturally allergen-friendly' },
                                        { icon: 'temple_buddhist', color: '#7c3aed', label: 'Authentic', desc: 'Taste of Asia in every bite' },
                                        { icon: 'inventory_2', color: '#2563eb', label: 'B2B Ready', desc: 'Transparent bulk packaging available' },
                                    ].map(({ icon, color, label, desc }) => (
                                        <div key={label} className="flex items-start gap-1.5">
                                            <span className="material-symbols-outlined shrink-0 mt-0.5" style={{ fontSize: '13px', color }}>{icon}</span>
                                            <div>
                                                <p className="font-bold text-slate-800">{label}</p>
                                                <p className="text-[10px] text-slate-500">{desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right: Manufacturer & Company Info */}
                            <div className="pl-3">
                                <h3 className="text-amber-50 text-xs font-bold py-1.5 px-2 mb-3 text-center uppercase tracking-wider rounded-sm" style={{ backgroundColor: '#7B4B11' }}>
                                    Manufacturer Details
                                </h3>
                                <div className="text-[11px] text-slate-800 space-y-2">
                                    <div className="space-y-1 text-[10px]">
                                        <p><span className="font-bold">Company:</span> Kshetri Industries Pvt. Ltd.</p>
                                        <p><span className="font-bold">Address:</span> Kongba Bazar, near Bank of Baroda, Imphal East, Manipur — 795005</p>
                                    </div>
                                    <div className="pt-1 border-t border-amber-200 text-[10px]">
                                        <p className="font-bold mb-0.5">Emails:</p>
                                        <p>ktsingh27@gmail.com</p>
                                        <p>tojokshetrimayum@gmail.com</p>
                                        <p><span className="font-bold">Website:</span> www.kshetriindustries.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Packaging & Warnings - Full Width */}
                        <div className="px-4 pb-4">
                            <div className="mb-3">
                                <h3 className="text-amber-50 text-xs font-bold py-1.5 px-2 mb-2 text-center uppercase tracking-wider rounded-sm" style={{ backgroundColor: '#7B4B11' }}>
                                    Packaging & Origin
                                </h3>
                                <div className="text-[11px] text-slate-800 space-y-0.5">
                                    <p><span className="font-bold">Origin:</span> Northeast India (Manipur)</p>
                                    <p><span className="font-bold">Packaging:</span> Transparent (B2B bulk)</p>
                                    <p><span className="font-bold">Form:</span> Sheets / Roll (as specified)</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-amber-50 text-xs font-bold py-1.5 px-2 mb-2 text-center uppercase tracking-wider rounded-sm" style={{ backgroundColor: '#7B4B11' }}>
                                    Storage / Handling
                                </h3>
                                <ul className="text-[11px] text-slate-800 space-y-1 list-disc pl-4">
                                    <li>Store in a cool, dry place away from direct sunlight</li>
                                    <li>Keep packaging sealed until use</li>
                                    <li>Do not expose to moisture before use</li>
                                    <li>Handle with clean, dry hands</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsPage;