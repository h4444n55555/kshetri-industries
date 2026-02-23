import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GrainLogo from './GrainLogo';

const HeroSection: React.FC = () => {
    const navigate = useNavigate();
    const textDelay = 3800;
    const animDuration = 1800;
    const textRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const [animDone, setAnimDone] = useState(false);
    const [scrollOpacity, setScrollOpacity] = useState(1);

    useEffect(() => {
        const timer = setTimeout(() => setAnimDone(true), textDelay + animDuration);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const onScroll = () => {
            setScrollOpacity(Math.max(0, 1 - window.scrollY / 300));
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Logo tilts toward cursor
    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            if (!logoRef.current) return;
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;
            // How far from center, normalized to -1..1
            const nx = (e.clientX - cx) / cx;
            const ny = (e.clientY - cy) / cy;
            // Max tilt: 8 degrees
            const rotY = nx * 8;
            const rotX = -ny * 8;
            logoRef.current.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
        };
        const onMouseLeave = () => {
            if (logoRef.current) {
                logoRef.current.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
            }
        };
        window.addEventListener('mousemove', onMouseMove, { passive: true });
        document.addEventListener('mouseleave', onMouseLeave);
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseleave', onMouseLeave);
        };
    }, []);

    return (
        <section
            className="relative w-full bg-background-light overflow-hidden"
            style={{ height: '100svh' }}
        >
            {/* Logo — tilts toward cursor */}
            <div
                ref={logoRef}
                className="absolute inset-0 will-change-transform"
                style={{ transition: 'transform 0.15s ease-out' }}
            >
                <GrainLogo className="w-full h-full" />
            </div>

            {/* Company name + slogan */}
            <div
                ref={textRef}
                className="absolute bottom-0 left-0 pb-24 pl-10 md:pl-16 flex flex-col gap-2"
                style={
                    animDone
                        ? { opacity: scrollOpacity, transform: 'translateY(0)', transition: 'opacity 0.15s' }
                        : { opacity: 0, animation: `fadeInUp ${animDuration}ms cubic-bezier(0.16,1,0.3,1) ${textDelay}ms forwards` }
                }
            >
                <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-800 leading-none">
                    Kshetri Industries
                </h1>
                <p className="text-sm md:text-base text-slate-600 font-medium tracking-widest italic">
                    Rooted in Tradition. Built for Today.
                </p>
                <button
                    onClick={() => { navigate('/products'); window.scrollTo(0, 0); }}
                    className="mt-5 text-sm text-slate-500 hover:text-slate-800 transition-colors tracking-wide group cursor-pointer flex items-center gap-2"
                >
                    <span className="w-6 h-px bg-slate-400 group-hover:w-10 group-hover:bg-slate-800 transition-all duration-300"></span>
                    View Products
                </button>
            </div>

            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </section>
    );
};

export default HeroSection;
