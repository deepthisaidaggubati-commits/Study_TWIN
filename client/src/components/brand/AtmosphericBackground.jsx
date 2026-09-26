import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * AtmosphericBackground - Green -> Lime -> Yellow Moving Learning Environment
 * Visual Elements:
 * - Subtle desk silhouette & desk lamp glow
 * - Floating open book & notebook outlines
 * - Mathematical symbols (\(\sum\), \(\int\), \(\infty\), \(\pi\), \(f(x)\)) & code snippets (`const twin = new AI()`, `O(N log N)`)
 * - Neural network nodes & knowledge graph connections (Green, Lime, Yellow)
 * - Mouse Parallax Response & Reduced Motion compatibility
 */
export default function AtmosphericBackground({ className = '' }) {
  const { isDark } = useTheme();
  const canvasRef = useRef(null);
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

    // Green -> Lime -> Yellow Learning Environment Palette
    const symbols = ['\u2211', '\u222B', '\u221E', '\u03C0', 'f(x)', 'O(N log N)', 'const twin = new AI()', 'git commit', '\u2207 \u00D7 E'];
    const particleCount = prefersReducedMotion ? 15 : 45;
    const particles = [];

    const palette = isDark
      ? ['#168F3B', '#36A852', '#63C63D', '#8ED13F', '#B7E51D', '#D5F51C', '#FFD900']
      : ['#0B7A32', '#168F3B', '#36A852', '#63C63D', '#8ED13F', '#B7E51D', '#FFC400'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2.2 + 1,
        color: palette[Math.floor(Math.random() * palette.length)],
        vx: (Math.random() - 0.5) * (prefersReducedMotion ? 0.05 : 0.4),
        vy: (Math.random() - 0.5) * (prefersReducedMotion ? 0.05 : 0.4),
        alpha: Math.random() * 0.45 + 0.3,
        symbol: i % 4 === 0 ? symbols[Math.floor(Math.random() * symbols.length)] : null,
        fontSize: Math.floor(Math.random() * 8 + 11)
      });
    }

    let currentMouseX = 0;
    let currentMouseY = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!prefersReducedMotion) {
        currentMouseX += (mouseTargetRef.current.x - currentMouseX) * 0.05;
        currentMouseY += (mouseTargetRef.current.y - currentMouseY) * 0.05;
      }

      // Draw Green -> Lime Neural Connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x + currentMouseX * 0.3, particles[i].y + currentMouseY * 0.3);
            ctx.lineTo(particles[j].x + currentMouseX * 0.3, particles[j].y + currentMouseY * 0.3);
            const opacity = (1 - dist / 140) * (isDark ? 0.22 : 0.15);
            ctx.strokeStyle = `rgba(99, 198, 61, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Render Green, Lime & Yellow Nodes / Symbols
      particles.forEach(p => {
        const px = p.x + currentMouseX * (p.symbol ? 0.6 : 0.3);
        const py = p.y + currentMouseY * (p.symbol ? 0.6 : 0.3);

        if (p.symbol) {
          ctx.font = `${p.fontSize}px monospace`;
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha * 0.8;
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
      {/* 1. Green -> Lime -> Yellow Theme Light Glow Orbs */}
      <div
        className={`absolute -top-40 -left-40 w-[650px] h-[650px] rounded-full blur-[130px] opacity-45 transition-colors duration-1000 ${
          isDark
            ? 'bg-gradient-to-br from-[#0B7A32]/35 via-[#36A852]/25 to-[#B7E51D]/20 animate-[pulse_14s_ease-in-out_infinite]'
            : 'bg-gradient-to-br from-[#8ED13F]/40 via-[#B7E51D]/35 to-[#FFD900]/30 animate-[pulse_14s_ease-in-out_infinite]'
        }`}
        style={{
          transform: `translate3d(${mouseTargetRef.current.x * 0.5}px, ${mouseTargetRef.current.y * 0.5}px, 0)`
        }}
      />

      <div
        className={`absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full blur-[140px] opacity-40 transition-colors duration-1000 ${
          isDark
            ? 'bg-gradient-to-tr from-[#63C63D]/30 via-[#B7E51D]/25 to-[#FFD900]/20 animate-[pulse_18s_ease-in-out_infinite]'
            : 'bg-gradient-to-tr from-[#B7E51D]/40 via-[#FFD900]/35 to-[#FFEA3A]/30 animate-[pulse_18s_ease-in-out_infinite]'
        }`}
        style={{
          transform: `translate3d(${mouseTargetRef.current.x * -0.6}px, ${mouseTargetRef.current.y * -0.6}px, 0)`
        }}
      />

      <div
        className={`absolute -bottom-40 left-1/3 w-[750px] h-[750px] rounded-full blur-[150px] opacity-35 transition-colors duration-1000 ${
          isDark
            ? 'bg-gradient-to-t from-[#0B7A32]/30 via-[#168F3B]/25 to-[#8ED13F]/20 animate-[pulse_22s_ease-in-out_infinite]'
            : 'bg-gradient-to-t from-[#63C63D]/30 via-[#B7E51D]/40 to-[#FFD900]/25 animate-[pulse_22s_ease-in-out_infinite]'
        }`}
      />

      {/* 2. Student Study Desk & Learning Environment Silhouettes */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.04] dark:opacity-[0.07] transition-opacity duration-700"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <path d="M 100 720 L 1100 720 M 150 720 L 150 800 M 1050 720 L 1050 800" stroke="#63C63D" strokeWidth="4" />
        <path d="M 280 680 Q 320 660 360 680 Q 400 660 440 680 L 440 715 Q 400 695 360 715 Q 320 695 280 715 Z" fill="none" stroke="#B7E51D" strokeWidth="2" />
        <path d="M 360 680 L 360 715" stroke="#B7E51D" strokeWidth="2" />
        <path d="M 50 150 L 300 150 M 50 250 L 300 250 M 50 350 L 300 350" stroke="#63C63D" strokeWidth="2" strokeDasharray="10 15" />
        <path d="M 750 670 L 850 670 L 870 715 L 730 715 Z M 760 610 L 840 610 L 840 670 L 760 670 Z" fill="none" stroke="#FFD900" strokeWidth="2" />
        <path d="M 220 540 L 170 690 L 340 690 Z" fill="#B7E51D" opacity="0.15" />
        <circle cx="220" cy="540" r="14" fill="#FFD900" opacity="0.4" />
      </svg>

      {/* 3. Green, Lime & Yellow Particles Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
