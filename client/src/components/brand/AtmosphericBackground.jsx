import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * AtmosphericBackground - Moving Ambient Gradient Blobs & Interactive Digital Particles Network
 * Colors: Teal (#18C5C0), Deep Indigo (#22266F), Purple (#6A35B8), Magenta (#9D1985), Hot Pink (#F51F62), Sun Yellow (#FFD447), Orange (#FF8500), Sky Cyan (#4FD7D0)
 */
export default function AtmosphericBackground({ className = '' }) {
  const { isDark } = useTheme();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle nodes configuration
    const particleCount = prefersReducedMotion ? 12 : 35;
    const particles = [];
    const colors = isDark
      ? ['#18C5C0', '#4FD7D0', '#6A35B8', '#9D1985', '#F51F62', '#FFD447']
      : ['#087C9E', '#18C5C0', '#FF8500', '#FFD447', '#F51F62'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * (prefersReducedMotion ? 0.05 : 0.4),
        vy: (Math.random() - 0.5) * (prefersReducedMotion ? 0.05 : 0.4),
        alpha: Math.random() * 0.5 + 0.3
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw particle connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const opacity = (1 - dist / 130) * 0.15;
            ctx.strokeStyle = isDark ? `rgba(79, 215, 208, ${opacity})` : `rgba(8, 124, 158, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Render nodes
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;

        // Move particles
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
      {/* 1. Moving Atmospheric Light Orbs */}
      <div
        className={`absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full blur-[120px] opacity-40 transition-colors duration-1000 ${
          isDark
            ? 'bg-gradient-to-br from-teal-500/30 via-indigo-900/30 to-purple-700/20 animate-[pulse_14s_ease-in-out_infinite]'
            : 'bg-gradient-to-br from-amber-300/40 via-orange-300/30 to-teal-300/20 animate-[pulse_14s_ease-in-out_infinite]'
        }`}
      />

      <div
        className={`absolute top-1/3 -right-32 w-[550px] h-[550px] rounded-full blur-[130px] opacity-35 transition-colors duration-1000 ${
          isDark
            ? 'bg-gradient-to-tr from-fuchsia-600/30 via-pink-500/20 to-amber-500/20 animate-[pulse_18s_ease-in-out_infinite]'
            : 'bg-gradient-to-tr from-pink-400/30 via-amber-300/30 to-cyan-300/20 animate-[pulse_18s_ease-in-out_infinite]'
        }`}
      />

      <div
        className={`absolute -bottom-32 left-1/4 w-[700px] h-[700px] rounded-full blur-[140px] opacity-30 transition-colors duration-1000 ${
          isDark
            ? 'bg-gradient-to-t from-purple-800/25 via-indigo-950/20 to-teal-600/20 animate-[pulse_22s_ease-in-out_infinite]'
            : 'bg-gradient-to-t from-teal-300/30 via-amber-200/40 to-orange-300/20 animate-[pulse_22s_ease-in-out_infinite]'
        }`}
      />

      {/* 2. Interactive Digital Network Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />
    </div>
  );
}
