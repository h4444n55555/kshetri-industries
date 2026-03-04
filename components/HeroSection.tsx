import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GrainLogo from './GrainLogo';
import { ShadowOverlay } from './ShadowOverlay';

// Module-level flag: persists across navigations, resets on page refresh
let heroHasAnimated = false;

const HeroSection: React.FC = () => {
    const navigate = useNavigate();
    const textDelay = 3800;
    const animDuration = 1800;
    const textRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const [animDone, setAnimDone] = useState(heroHasAnimated);

    useEffect(() => {
        if (heroHasAnimated) {
            setAnimDone(true);
            return;
        }
        const timer = setTimeout(() => {
            setAnimDone(true);
            heroHasAnimated = true;
        }, textDelay + animDuration);
        return () => clearTimeout(timer);
    }, []);

    // Scroll opacity logic removed so text never fades

    const [logoFormed, setLogoFormed] = useState(heroHasAnimated);

    useEffect(() => {
        if (heroHasAnimated) {
            setLogoFormed(true);
            return;
        }
        // Logo particles finish at MAX_DELAY(1400) + DURATION(2200) = 3600ms
        const timer = setTimeout(() => setLogoFormed(true), 3600);
        return () => clearTimeout(timer);
    }, []);

    // Logo tilts toward cursor — only after logo has formed
    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            if (!logoRef.current || !logoFormed) return;
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;
            const nx = (e.clientX - cx) / cx;
            const ny = (e.clientY - cy) / cy;
            const rotY = nx * 14;
            const rotX = -ny * 14;
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
    }, [logoFormed]);

    return (
        <section
            className="relative w-full bg-background-light overflow-hidden"
            style={{ height: '100svh' }}
        >
            {/* Shadow overlay background — ethereal ambient effect */}
            <div className="absolute inset-0 z-0">
                <ShadowOverlay
                    color="rgba(140, 155, 180, 0.7)"
                    animation={{ scale: 40, speed: 15 }}
                    noise={{ opacity: 0.15, scale: 1.5 }}
                />
            </div>


            {/* Logo — tilts toward cursor */}
            <div
                ref={logoRef}
                className="absolute inset-0 will-change-transform z-[1]"
                style={{ transition: 'transform 0.15s ease-out' }}
            >
                <GrainLogo className="w-full h-full" />
            </div>

            {/* Company name + slogan */}
            <div
                ref={textRef}
                className="absolute bottom-0 left-0 pb-8 pl-6 md:pb-12 md:pl-16 flex flex-col gap-2 pr-4"
                style={
                    animDone
                        ? { opacity: 1, transform: 'translateY(0)' }
                        : { opacity: 0, animation: `fadeInUp ${animDuration}ms cubic-bezier(0.16,1,0.3,1) ${textDelay}ms forwards` }
                }
            >
                <h1 className="text-4xl md:text-8xl font-black tracking-tight text-slate-900 leading-none drop-shadow-sm">
                    Kshetri Industries
                </h1>
                <p className="text-sm md:text-xl text-slate-700 font-bold tracking-widest italic mt-2 drop-shadow-sm">
                    Rooted in Tradition. Built for Today.
                </p>
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
