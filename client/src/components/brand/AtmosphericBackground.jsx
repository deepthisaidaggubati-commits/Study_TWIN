import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * AtmosphericBackground - Moving Student Study Environment + Interactive Parallax & Neural Particles
 * Visual Elements:
 * - Subtle desk silhouette & lamp glow
 * - Floating open book & notebook outlines
 * - Mathematical symbols (\(\sum\), \(\int\), \(\infty\), \(\pi\), \(f(x)\)) & code snippets (`const twin = new AI()`, `O(N log N)`)
 * - Neural network nodes & knowledge graph connections
 * - Theme Adaptation: Digital Sunrise (Light) vs Digital Night (Dark)
 * - Mouse Parallax Response & Reduced Motion compatibility
 */
export default function AtmosphericBackground({ className = '' }) {
  const { isDark } = useTheme();
  const canvasRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const mouseTargetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      mouseTargetRef.current = {
        x: (e.clientX / innerWidth - 0.5) * 30,
        y: (e.clientY / innerHeight - 0.5) * 30
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Dynamic Learning Environment Elements
    const symbols = ['\u2211', '\u222B', '\u221E', '\u03C0', 'f(x)', 'O(N log N)', 'const twin = new AI()', 'git commit', '\u2207 \u00D7 E'];
    const particleCount = prefersReducedMotion ? 15 : 42;
    const particles = [];
    
    const palette = isDark
      ? ['#18C5C0', '#4FD7D0', '#6A35B8', '#9D1985', '#F51F62', '#FFD447']
      : ['#087C9E', '#18C5C0', '#FF8500', '#FFD447', '#F51F62', '#8B5CF6'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2.2 + 1,
        color: palette[Math.floor(Math.random() * palette.length)],
        vx: (Math.random() - 0.5) * (prefersReducedMotion ? 0.05 : 0.4),
        vy: (Math.random() - 0.5) * (prefersReducedMotion ? 0.05 : 0.4),
        alpha: Math.random() * 0.45 + 0.25,
        symbol: i % 4 === 0 ? symbols[Math.floor(Math.random() * symbols.length)] : null,
        fontSize: Math.floor(Math.random() * 8 + 11)
      });
    }

    let currentMouseX = 0;
    let currentMouseY = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth Mouse Interpolation for Parallax
      if (!prefersReducedMotion) {
        currentMouseX += (mouseTargetRef.current.x - currentMouseX) * 0.05;
        currentMouseY += (mouseTargetRef.current.y - currentMouseY) * 0.05;
      }

      // Draw Neural Connections & Knowledge Graph Edges
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x + currentMouseX * 0.3, particles[i].y + currentMouseY * 0.3);
            ctx.lineTo(particles[j].x + currentMouseX * 0.3, particles[j].y + currentMouseY * 0.3);
            const opacity = (1 - dist / 140) * (isDark ? 0.18 : 0.12);
            ctx.strokeStyle = isDark ? `rgba(79, 215, 208, ${opacity})` : `rgba(24, 197, 192, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Render Nodes & Floating Symbols
      particles.forEach(p => {
        const px = p.x + currentMouseX * (p.symbol ? 0.6 : 0.3);
        const py = p.y + currentMouseY * (p.symbol ? 0.6 : 0.3);

        if (p.symbol) {
          ctx.font = `${p.fontSize}px monospace`;
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha * 0.75;
          ctx.fillText(p.symbol, px, py);
        } else {
          ctx.beginPath();
          ctx.arc(px, py, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.shadowBlur = isDark ? 8 : 4;
          ctx.shadowColor = p.color;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
        ctx.globalAlpha = 1.0;

        // Animate positions
        if (!prefersReducedMotion) {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
          if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return (
    <div className={`fixed inset-0 pointer-events-none z-0 overflow-hidden ${className}`}>
      {/* 1. Moving Theme Light Glow Orbs */}
      <div
        className={`absolute -top-40 -left-40 w-[650px] h-[650px] rounded-full blur-[130px] opacity-45 transition-colors duration-1000 ${
          isDark
            ? 'bg-gradient-to-br from-teal-500/30 via-indigo-900/35 to-purple-800/25 animate-[pulse_14s_ease-in-out_infinite]'
            : 'bg-gradient-to-br from-amber-300/50 via-orange-300/40 to-teal-200/30 animate-[pulse_14s_ease-in-out_infinite]'
        }`}
        style={{
          transform: `translate3d(${mouseTargetRef.current.x * 0.5}px, ${mouseTargetRef.current.y * 0.5}px, 0)`
        }}
      />

      <div
        className={`absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full blur-[140px] opacity-40 transition-colors duration-1000 ${
          isDark
            ? 'bg-gradient-to-tr from-fuchsia-600/30 via-pink-600/25 to-amber-500/20 animate-[pulse_18s_ease-in-out_infinite]'
            : 'bg-gradient-to-tr from-pink-300/40 via-amber-200/40 to-cyan-300/30 animate-[pulse_18s_ease-in-out_infinite]'
        }`}
        style={{
          transform: `translate3d(${mouseTargetRef.current.x * -0.6}px, ${mouseTargetRef.current.y * -0.6}px, 0)`
        }}
      />

      <div
        className={`absolute -bottom-40 left-1/3 w-[750px] h-[750px] rounded-full blur-[150px] opacity-35 transition-colors duration-1000 ${
          isDark
            ? 'bg-gradient-to-t from-purple-900/30 via-indigo-950/25 to-teal-500/25 animate-[pulse_22s_ease-in-out_infinite]'
            : 'bg-gradient-to-t from-teal-200/40 via-amber-100/50 to-orange-200/30 animate-[pulse_22s_ease-in-out_infinite]'
        }`}
      />

      {/* 2. Subtle Student Desk & Study Silhouettes Layer */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.035] dark:opacity-[0.06] transition-opacity duration-700"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Subtle Desk & Lamp Silhouette */}
        <path d="M 100 720 L 1100 720 M 150 720 L 150 800 M 1050 720 L 1050 800" stroke="currentColor" strokeWidth="4" />
        {/* Open Books Outlines */}
        <path d="M 280 680 Q 320 660 360 680 Q 400 660 440 680 L 440 715 Q 400 695 360 715 Q 320 695 280 715 Z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M 360 680 L 360 715" stroke="currentColor" strokeWidth="2" />
        {/* Bookshelf Lines */}
        <path d="M 50 150 L 300 150 M 50 250 L 300 250 M 50 350 L 300 350" stroke="currentColor" strokeWidth="2" strokeDasharray="10 15" />
        {/* Laptop Silhouette */}
        <path d="M 750 670 L 850 670 L 870 715 L 730 715 Z M 760 610 L 840 610 L 840 670 L 760 670 Z" fill="none" stroke="currentColor" strokeWidth="2" />
        {/* Desk Lamp Ambient Cone */}
        <path d="M 220 540 L 170 690 L 340 690 Z" fill="currentColor" opacity="0.15" />
        <circle cx="220" cy="540" r="14" fill="currentColor" opacity="0.3" />
      </svg>

      {/* 3. Interactive Canvas for Particles, Connections & Symbols */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
