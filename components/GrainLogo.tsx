import React, { useEffect, useRef } from 'react';

interface GrainLogoProps { className?: string; }

const MOUSE_RADIUS = 50;
const MOUSE_FORCE = 4;
const SPAWN_BAND = 60;   // half-height of the edge launch window
const MAX_DELAY = 1400; // ms — stagger window
const DURATION = 2200; // ms — time for each particle to travel its path

// Module-level flag: persists across navigations, resets on page refresh
let logoHasAnimated = false;

// Quadratic bezier interpolation
function qbez(p0: number, p1: number, p2: number, t: number) {
    const u = 1 - t;
    return u * u * p0 + 2 * u * t * p1 + t * t * p2;
}

interface Particle {
    // bezier control points
    sx: number; sy: number; // start (edge)
    cx: number; cy: number; // control (centroid area)
    homeX: number; homeY: number;
    edgeAlpha: number;
    spawnAt: number;
    // per-particle lateral wave for river feel (applied ON TOP of bezier path)
    waveFreq: number;
    waveMag: number;
    wavePhase: number;
    // mouse-kick velocity (post-arrival only)
    vx: number; vy: number;
    // current drawn position (may differ from bezier when mouse kicks)
    x: number; y: number;
    alpha: number;
    done: boolean;
    arrivedAt: number; // timestamp when t reached 1
}

const GrainLogo: React.FC<GrainLogoProps> = ({ className }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const stateRef = useRef<{
        particles: Particle[];
        mouse: { x: number; y: number };
        animId: number;
        ready: boolean;
    }>({ particles: [], mouse: { x: -9999, y: -9999 }, animId: 0, ready: false });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true })!;

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = '/logo.svg';

        img.onload = () => {
            const offC = document.createElement('canvas');
            const offX = offC.getContext('2d', { willReadFrequently: true })!;

            const targetH = Math.round(canvas.height * 0.65);
            const aspect = (img.naturalWidth || img.width) / (img.naturalHeight || img.height);
            const targetW = Math.round(targetH * aspect);
            const topPad = Math.round(canvas.height * 0.15);

            offC.width = targetW; offC.height = targetH;
            offX.fillStyle = '#ffffff';
            offX.fillRect(0, 0, targetW, targetH);
            offX.drawImage(img, 0, 0, targetW, targetH);

            const pxData = offX.getImageData(0, 0, targetW, targetH).data;
            const logoPixels: { x: number; y: number; edgeAlpha: number }[] = [];

            for (let py = 0; py < targetH; py++) {
                for (let px = 0; px < targetW; px++) {
                    const i = (py * targetW + px) * 4;
                    const b = (pxData[i] + pxData[i + 1] + pxData[i + 2]) / 3;
                    if (b < 220) {
                        logoPixels.push({
                            x: (canvas.width - targetW) / 2 + px,
                            y: topPad + py,
                            edgeAlpha: Math.pow(1 - b / 220, 0.6),
                        });
                    }
                }
            }
            if (!logoPixels.length) return;

            // Logo centroid — bezier control point (pull path through here)
            let sumX = 0, sumY = 0;
            for (const lp of logoPixels) { sumX += lp.x; sumY += lp.y; }
            const gcx = sumX / logoPixels.length;
            const gcy = sumY / logoPixels.length;

            const now = performance.now();
            const midY = canvas.height / 2;
            const skipAnim = logoHasAnimated;
            const particles: Particle[] = logoPixels.map((lp) => {
                if (skipAnim) {
                    // Already animated before — show logo instantly
                    return {
                        sx: lp.x, sy: lp.y,
                        cx: lp.x, cy: lp.y,
                        homeX: lp.x, homeY: lp.y,
                        edgeAlpha: lp.edgeAlpha,
                        spawnAt: 0,
                        waveFreq: 0, waveMag: 0, wavePhase: 0,
                        vx: 0, vy: 0,
                        x: lp.x, y: lp.y,
                        alpha: 1,
                        done: true,
                        arrivedAt: now,
                    };
                }

                const fromLeft = Math.random() < 0.5;
                const delay = Math.random() * MAX_DELAY;

                const sx = fromLeft ? -5 : canvas.width + 5;
                const sy = midY + (Math.random() - 0.5) * SPAWN_BAND * 2;

                const mx = (sx + gcx) / 2 + (Math.random() - 0.5) * 80;
                const my = (sy + gcy) / 2 + (Math.random() - 0.5) * 80;

                return {
                    sx, sy,
                    cx: mx, cy: my,
                    homeX: lp.x, homeY: lp.y,
                    edgeAlpha: lp.edgeAlpha,
                    spawnAt: now + delay,
                    waveFreq: 0.002 + Math.random() * 0.004,
                    waveMag: 3 + Math.random() * 10,
                    wavePhase: Math.random() * Math.PI * 2,
                    vx: 0, vy: 0,
                    x: sx, y: sy,
                    alpha: 0,
                    done: false,
                    arrivedAt: 0,
                };
            });

            if (!skipAnim) {
                // Shuffle so multi-sine stagger isn't scanline-sequential
                for (let i = particles.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [particles[i], particles[j]] = [particles[j], particles[i]];
                }
                // Mark animation as played after particles finish
                setTimeout(() => { logoHasAnimated = true; }, MAX_DELAY + DURATION + 200);
            }

            stateRef.current.particles = particles;
            stateRef.current.ready = true;
        };

        const onMouseMove = (e: MouseEvent) => {
            const r = canvas.getBoundingClientRect();
            stateRef.current.mouse.x = (e.clientX - r.left) * (canvas.width / r.width);
            stateRef.current.mouse.y = (e.clientY - r.top) * (canvas.height / r.height);
        };
        const onMouseLeave = () => { stateRef.current.mouse.x = -9999; stateRef.current.mouse.y = -9999; };
        const onTouchMove = (e: TouchEvent) => {
            const r = canvas.getBoundingClientRect();
            const t = e.touches[0];
            stateRef.current.mouse.x = (t.clientX - r.left) * (canvas.width / r.width);
            stateRef.current.mouse.y = (t.clientY - r.top) * (canvas.height / r.height);
        };
        window.addEventListener('mousemove', onMouseMove);
        canvas.addEventListener('mouseleave', onMouseLeave);
        canvas.addEventListener('touchmove', onTouchMove, { passive: true });

        const isTouch = navigator.maxTouchPoints > 0;
        let mouseActiveTimeout = 0;

        const drawFrame = (now: number) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (!stateRef.current.ready) return;

            const { particles } = stateRef.current;
            ctx.fillStyle = '#000000';

            for (const p of particles) {
                if (now < p.spawnAt) continue;

                p.alpha = Math.min(p.alpha + 0.06, 1);

                if (!p.done) {
                    const t = Math.min((now - p.spawnAt) / DURATION, 1);
                    const te = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
                    const bx = qbez(p.sx, p.cx, p.homeX, te);
                    const by = qbez(p.sy, p.cy, p.homeY, te);
                    const fadeOut = 1 - te;
                    const wave = Math.sin(now * p.waveFreq + p.wavePhase) * p.waveMag * fadeOut;
                    const dtx = p.homeX - p.sx; const dty = p.homeY - p.sy;
                    const dl = Math.hypot(dtx, dty) || 1;
                    p.x = bx + (-dty / dl) * wave;
                    p.y = by + (dtx / dl) * wave;
                    if (t >= 1) { p.x = p.homeX; p.y = p.homeY; p.done = true; p.arrivedAt = now; }
                } else {
                    p.x = p.homeX;
                    p.y = p.homeY;
                }

                ctx.globalAlpha = p.alpha * p.edgeAlpha;
                ctx.fillRect(Math.round(p.x), Math.round(p.y), 1, 1);
            }

            ctx.globalAlpha = 1;
        };

        const render = (now: number) => {
            drawFrame(now);
            // Stop the loop once all particles have settled
            const allDone = stateRef.current.ready &&
                stateRef.current.particles.every(p => p.done && p.alpha >= 1);
            if (allDone) {
                stateRef.current.animId = 0;
                return; // rAF stops — static canvas from here
            }
            stateRef.current.animId = requestAnimationFrame(render);
        };

        // Mouse tracking restarts the loop briefly for interactive effect
        const restartLoop = () => {
            if (isTouch) return; // no mouse on touch devices
            if (!stateRef.current.animId) {
                const loop = (now: number) => {
                    drawFrame(now);
                    stateRef.current.animId = requestAnimationFrame(loop);
                };
                stateRef.current.animId = requestAnimationFrame(loop);
            }
            clearTimeout(mouseActiveTimeout);
            mouseActiveTimeout = window.setTimeout(() => {
                cancelAnimationFrame(stateRef.current.animId);
                stateRef.current.animId = 0;
                // Render one last static frame
                drawFrame(performance.now());
            }, 300) as unknown as number;
        };

        const origMouseMove = onMouseMove;
        window.removeEventListener('mousemove', onMouseMove);
        const mouseMovePlus = (e: MouseEvent) => { origMouseMove(e); restartLoop(); };
        window.addEventListener('mousemove', mouseMovePlus);

        stateRef.current.animId = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(stateRef.current.animId);
            clearTimeout(mouseActiveTimeout);
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', mouseMovePlus);
            canvas.removeEventListener('mouseleave', onMouseLeave);
            canvas.removeEventListener('touchmove', onTouchMove);
        };
    }, []);

    return <canvas ref={canvasRef} className={`w-full h-full block ${className ?? ''}`} />;
};

export default GrainLogo;
