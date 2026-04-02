import React, { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { GraduationCap, Globe, Calendar } from 'lucide-react';
import ScrollReveal from '../components/bits/ScrollReveal';

// ==========================================
// MAGIC BENTO ENGINE
// ==========================================

export interface BentoItem {
  id?: string | number;
  className?: string;
  content: React.ReactNode;
}

export interface BentoProps {
  items: BentoItem[];
  gridClassName?: string;
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  disableAnimations?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  enableTilt?: boolean;
  glowColor?: string;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}

const DEFAULT_PARTICLE_COUNT = 12;
const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = '6, 182, 212'; // Cyan glow
const MOBILE_BREAKPOINT = 768;

const createParticleElement = (x: number, y: number, color: string = DEFAULT_GLOW_COLOR): HTMLDivElement => {
  const el = document.createElement('div');
  el.className = 'particle';
  el.style.cssText = `
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 6px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `;
  return el;
};

const calculateSpotlightValues = (radius: number) => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75
});

const updateCardGlowProperties = (card: HTMLElement, mouseX: number, mouseY: number, glow: number, radius: number) => {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;

  card.style.setProperty('--glow-x', `${relativeX}%`);
  card.style.setProperty('--glow-y', `${relativeY}%`);
  card.style.setProperty('--glow-intensity', glow.toString());
  card.style.setProperty('--glow-radius', `${radius}px`);
};

const ParticleCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  disableAnimations?: boolean;
  style?: React.CSSProperties;
  particleCount?: number;
  glowColor?: string;
  enableTilt?: boolean;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}> = ({
  children,
  className = '',
  disableAnimations = false,
  style,
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = DEFAULT_GLOW_COLOR,
  enableTilt = true,
  clickEffect = false,
  enableMagnetism = false
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const isHoveredRef = useRef(false);
  const memoizedParticles = useRef<HTMLDivElement[]>([]);
  const particlesInitialized = useRef(false);
  const magnetismAnimationRef = useRef<gsap.core.Tween | null>(null);

  const initializeParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return;

    const { width, height } = cardRef.current.getBoundingClientRect();
    memoizedParticles.current = Array.from({ length: particleCount }, () =>
      createParticleElement(Math.random() * width, Math.random() * height, glowColor)
    );
    particlesInitialized.current = true;
  }, [particleCount, glowColor]);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    magnetismAnimationRef.current?.kill();

    particlesRef.current.forEach(particle => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'back.in(1.7)',
        onComplete: () => {
          particle.parentNode?.removeChild(particle);
        }
      });
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;

    if (!particlesInitialized.current) {
      initializeParticles();
    }

    memoizedParticles.current.forEach((particle, index) => {
      const timeoutId = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;

        const clone = particle.cloneNode(true) as HTMLDivElement;
        cardRef.current.appendChild(clone);
        particlesRef.current.push(clone);

        gsap.fromTo(clone, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' });

        gsap.to(clone, {
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 100,
          rotation: Math.random() * 360,
          duration: 2 + Math.random() * 2,
          ease: 'none',
          repeat: -1,
          yoyo: true
        });

        gsap.to(clone, {
          opacity: 0.3,
          duration: 1.5,
          ease: 'power2.inOut',
          repeat: -1,
          yoyo: true
        });
      }, index * 100);

      timeoutsRef.current.push(timeoutId);
    });
  }, [initializeParticles]);

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return;

    const element = cardRef.current;

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      animateParticles();

      if (enableTilt) {
        gsap.to(element, {
          rotateX: 5,
          rotateY: 5,
          duration: 0.3,
          ease: 'power2.out',
          transformPerspective: 1000
        });
      }
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      clearAllParticles();

      if (enableTilt) {
        gsap.to(element, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }

      if (enableMagnetism) {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!enableTilt && !enableMagnetism) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      if (enableTilt) {
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        gsap.to(element, {
          rotateX,
          rotateY,
          duration: 0.1,
          ease: 'power2.out',
          transformPerspective: 1000
        });
      }

      if (enableMagnetism) {
        const magnetX = (x - centerX) * 0.05;
        const magnetY = (y - centerY) * 0.05;

        magnetismAnimationRef.current = gsap.to(element, {
          x: magnetX,
          y: magnetY,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (!clickEffect) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height)
      );

      const ripple = document.createElement('div');
      ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 1000;
      `;

      element.appendChild(ripple);

      gsap.fromTo(
        ripple,
        {
          scale: 0,
          opacity: 1
        },
        {
          scale: 1,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          onComplete: () => ripple.remove()
        }
      );
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('click', handleClick);

    return () => {
      isHoveredRef.current = false;
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('click', handleClick);
      clearAllParticles();
    };
  }, [animateParticles, clearAllParticles, disableAnimations, enableTilt, enableMagnetism, clickEffect, glowColor]);

  return (
    <div
      ref={cardRef}
      className={`${className} relative overflow-hidden`}
      style={{ ...style, position: 'relative', overflow: 'hidden' }}
    >
      {children}
    </div>
  );
};

const GlobalSpotlight: React.FC<{
  gridRef: React.RefObject<HTMLDivElement | null>;
  disableAnimations?: boolean;
  enabled?: boolean;
  spotlightRadius?: number;
  glowColor?: string;
}> = ({
  gridRef,
  disableAnimations = false,
  enabled = true,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  glowColor = DEFAULT_GLOW_COLOR
}) => {
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  const isInsideSection = useRef(false);

  useEffect(() => {
    if (disableAnimations || !gridRef?.current || !enabled) return;

    const spotlight = document.createElement('div');
    spotlight.className = 'global-spotlight';
    spotlight.style.cssText = `
      position: fixed;
      width: 800px;
      height: 800px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(${glowColor}, 0.15) 0%,
        rgba(${glowColor}, 0.08) 15%,
        rgba(${glowColor}, 0.04) 25%,
        rgba(${glowColor}, 0.02) 40%,
        rgba(${glowColor}, 0.01) 65%,
        transparent 70%
      );
      z-index: 200;
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
    `;
    document.body.appendChild(spotlight);
    spotlightRef.current = spotlight;

    const handleMouseMove = (e: MouseEvent) => {
      if (!spotlightRef.current || !gridRef.current) return;

      const section = gridRef.current.closest('.bento-section');
      const rect = section?.getBoundingClientRect();
      const mouseInside =
        rect && e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;

      isInsideSection.current = mouseInside || false;
      const cards = gridRef.current.querySelectorAll('.card');

      if (!mouseInside) {
        gsap.to(spotlightRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
        cards.forEach(card => {
          (card as HTMLElement).style.setProperty('--glow-intensity', '0');
        });
        return;
      }

      const { proximity, fadeDistance } = calculateSpotlightValues(spotlightRadius);
      let minDistance = Infinity;

      cards.forEach(card => {
        const cardElement = card as HTMLElement;
        const cardRect = cardElement.getBoundingClientRect();
        const centerX = cardRect.left + cardRect.width / 2;
        const centerY = cardRect.top + cardRect.height / 2;
        const distance =
          Math.hypot(e.clientX - centerX, e.clientY - centerY) - Math.max(cardRect.width, cardRect.height) / 2;
        const effectiveDistance = Math.max(0, distance);

        minDistance = Math.min(minDistance, effectiveDistance);

        let glowIntensity = 0;
        if (effectiveDistance <= proximity) {
          glowIntensity = 1;
        } else if (effectiveDistance <= fadeDistance) {
          glowIntensity = (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
        }

        updateCardGlowProperties(cardElement, e.clientX, e.clientY, glowIntensity, spotlightRadius);
      });

      gsap.to(spotlightRef.current, {
        left: e.clientX,
        top: e.clientY,
        duration: 0.1,
        ease: 'power2.out'
      });

      const targetOpacity =
        minDistance <= proximity
          ? 0.8
          : minDistance <= fadeDistance
            ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.8
            : 0;

      gsap.to(spotlightRef.current, {
        opacity: targetOpacity,
        duration: targetOpacity > 0 ? 0.2 : 0.5,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      isInsideSection.current = false;
      gridRef.current?.querySelectorAll('.card').forEach(card => {
        (card as HTMLElement).style.setProperty('--glow-intensity', '0');
      });
      if (spotlightRef.current) {
        gsap.to(spotlightRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      spotlightRef.current?.parentNode?.removeChild(spotlightRef.current);
    };
  }, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor]);

  return null;
};

const BentoCardGrid: React.FC<{
  children: React.ReactNode;
  gridRef?: React.RefObject<HTMLDivElement | null>;
}> = ({ children, gridRef }) => (
  <div
    className="bento-section w-full max-w-5xl mx-auto select-none relative"
    ref={gridRef}
  >
    {children}
  </div>
);

const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

const MagicBento: React.FC<BentoProps> = ({
  items,
  gridClassName = "grid grid-cols-1 md:grid-cols-6 gap-5",
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  particleCount = DEFAULT_PARTICLE_COUNT,
  enableTilt = false,
  glowColor = DEFAULT_GLOW_COLOR,
  clickEffect = true,
  enableMagnetism = true
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = disableAnimations || isMobile;

  return (
    <>
      <style>
        {`
          .bento-section {
            --glow-x: 50%;
            --glow-y: 50%;
            --glow-intensity: 0;
            --glow-radius: 200px;
            --glow-color: ${glowColor};
            --border-color: rgba(63, 63, 70, 0.4); 
            --background-dark: #18181b; 
          }
          
          .card--border-glow::after {
            content: '';
            position: absolute;
            inset: 0;
            padding: 2px;
            background: radial-gradient(var(--glow-radius) circle at var(--glow-x) var(--glow-y),
                rgba(${glowColor}, calc(var(--glow-intensity) * 0.8)) 0%,
                rgba(${glowColor}, calc(var(--glow-intensity) * 0.4)) 30%,
                transparent 60%);
            border-radius: inherit;
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            mask-composite: exclude;
            pointer-events: none;
            opacity: 1;
            transition: opacity 0.3s ease;
            z-index: 1;
          }
          
          .card--border-glow:hover::after {
            opacity: 1;
          }
          
          .card--border-glow:hover {
            box-shadow: 0 4px 20px rgba(6, 182, 212, 0.1), 0 0 30px rgba(${glowColor}, 0.2);
          }
          
          .particle::before {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: rgba(${glowColor}, 0.2);
            border-radius: 50%;
            z-index: -1;
          }
          
          /* Custom Spotify Equalizer Animation */
          @keyframes equalize {
            0% { height: 4px; }
            50% { height: 16px; }
            100% { height: 4px; }
          }
          .eq-bar {
            width: 4px;
            background-color: #1DB954; /* Spotify Green */
            border-radius: 2px;
            animation: equalize 1s ease-in-out infinite;
          }
          .eq-bar:nth-child(1) { animation-delay: 0.0s; }
          .eq-bar:nth-child(2) { animation-delay: 0.3s; }
          .eq-bar:nth-child(3) { animation-delay: 0.6s; }
          .eq-bar:nth-child(4) { animation-delay: 0.4s; }

          /* Vinyl Spin Animation (Always running now!) */
          @keyframes slowSpin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .vinyl-spin {
            animation: slowSpin 6s linear infinite;
          }
        `}
      </style>

      {enableSpotlight && (
        <GlobalSpotlight
          gridRef={gridRef}
          disableAnimations={shouldDisableAnimations}
          enabled={enableSpotlight}
          spotlightRadius={spotlightRadius}
          glowColor={glowColor}
        />
      )}

      <BentoCardGrid gridRef={gridRef}>
        <div className={gridClassName}>
          {items.map((item, index) => {
            const baseClassName = `group card relative overflow-hidden rounded-[32px] border border-solid font-light transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)] ${
              enableBorderGlow ? 'card--border-glow' : ''
            } ${item.className || ''}`;

            const cardStyle = {
              backgroundColor: 'rgba(24, 24, 27, 0.8)',
              borderColor: 'rgba(63, 63, 70, 0.5)',
              '--glow-x': '50%',
              '--glow-y': '50%',
              '--glow-intensity': '0',
              '--glow-radius': '200px'
            } as React.CSSProperties;

            if (enableStars) {
              return (
                <ParticleCard
                  key={item.id || index}
                  className={baseClassName}
                  style={cardStyle}
                  disableAnimations={shouldDisableAnimations}
                  particleCount={particleCount}
                  glowColor={glowColor}
                  enableTilt={enableTilt}
                  clickEffect={clickEffect}
                  enableMagnetism={enableMagnetism}
                >
                  {item.content}
                </ParticleCard>
              );
            }

            return (
              <div
                key={item.id || index}
                className={baseClassName}
                style={cardStyle}
              >
                {item.content}
              </div>
            );
          })}
        </div>
      </BentoCardGrid>
    </>
  );
};

// ==========================================
// THE CUSTOM "VINYL PILL" SPOTIFY COMPONENT
// ==========================================
const SpotifyOnRepeat = () => {
  const songTitle = "Sagada";
  const artist = "Cup of Joe";
  const albumCoverUrl = "/sagada.webp"; 
  const spotifyLink = "https://open.spotify.com/track/2wh4fGevm9QWeZtUXEJYCp?si=80f66d61a9714458";

  return (
    <div className="w-full flex justify-center mt-12 mb-4 relative z-20">
      <a 
        href={spotifyLink}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center p-2 pr-6 sm:pr-8 bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/60 rounded-full hover:bg-zinc-900/80 transition-all duration-500 hover:border-[#1DB954]/40 hover:shadow-[0_0_40px_rgba(29,185,84,0.15)] max-w-2xl w-[95%] sm:w-auto"
      >
        {/* Spinning Vinyl Cover */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-full p-1 bg-gradient-to-br from-zinc-800 to-zinc-950 shadow-[0_8px_20px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_20px_rgba(29,185,84,0.3)] transition-all duration-500 z-10">
          <div className="w-full h-full rounded-full overflow-hidden relative vinyl-spin">
            <img 
              src={albumCoverUrl} 
              alt={songTitle} 
              className="w-full h-full object-cover" 
              onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=='; }}
            />
            {/* Vinyl Center Hole */}
            <div className="absolute inset-0 m-auto w-3 h-3 sm:w-4 sm:h-4 bg-zinc-950 rounded-full border border-zinc-800 shadow-inner" />
          </div>
        </div>

        {/* Song Info */}
        <div className="ml-4 sm:ml-5 flex flex-col justify-center py-2 flex-grow min-w-[150px] sm:min-w-[200px]">
          <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[#1DB954] font-bold mb-1 flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
            On Repeat
          </p>
          <h4 className="text-base sm:text-xl font-bold text-white leading-tight group-hover:text-[#1DB954] transition-colors truncate pr-2 sm:pr-4">
            {songTitle}
          </h4>
          <p className="text-xs sm:text-sm text-zinc-400 truncate pr-2 sm:pr-4">{artist}</p>
        </div>

        {/* Equalizer */}
        <div className="absolute right-5 sm:right-6 top-1/2 -translate-y-1/2 flex items-end gap-1 h-5 sm:h-6 opacity-60 group-hover:opacity-100 transition-opacity">
          <div className="eq-bar" />
          <div className="eq-bar" />
          <div className="eq-bar" />
          <div className="eq-bar" />
        </div>
      </a>
    </div>
  );
};


// ==========================================
// ABOUT ME COMPONENT DATA
// ==========================================

const About = () => {
  const bentoItems: BentoItem[] = [
    // 1. EDUCATION CARD
    {
      id: 'education',
      className: 'lg:col-span-4 p-8',
      content: (
        <div className="flex flex-col h-full z-10 relative">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white">Education</h3>
          </div>

          {/* Timeline Container */}
          <div className="relative ml-4 mt-2 flex flex-col gap-10">
            {/* Timeline Vertical Line */}
            <div className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-zinc-800" />

            {/* USTP Timeline Node */}
            <div className="relative flex gap-6">
              {/* Timeline Dot */}
              <div className="relative z-10 flex flex-col items-center justify-start mt-2">
                <div className="w-8 h-8 rounded-full bg-zinc-950 flex items-center justify-center border-2 border-zinc-800">
                  <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                </div>
              </div>

              {/* Content Box */}
              <div className="flex-1 bg-zinc-900/50 border border-zinc-800/60 rounded-2xl p-5 hover:border-cyan-500/30 transition-colors group">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex gap-4 items-start">
                    <div className="w-14 h-14 bg-white rounded-xl p-1.5 flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-300">
                      <img 
                        src="/ustp.webp" 
                        alt="USTP" 
                        className="w-full h-full object-contain" 
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} 
                      />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white leading-snug">Bachelor of Science in<br className="hidden sm:block"/>Computer Science</h4>
                      <p className="text-sm text-zinc-300 mt-1">University of Science and Technology of Southern Philippines</p>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Tertiary</span>
                        <span className="text-[10px] font-bold text-zinc-600 tracking-wider uppercase">•</span>
                        <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Cagayan de Oro Campus</span>
                      </div>
                    </div>
                  </div>
                  <span className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-lg border border-cyan-500/20 h-fit">
                    <Calendar className="w-3.5 h-3.5"/> 2023 - Present
                  </span>
                </div>
              </div>
            </div>

            {/* Liceo Timeline Node */}
            <div className="relative flex gap-6">
              {/* Timeline Dot */}
              <div className="relative z-10 flex flex-col items-center justify-start mt-2">
                <div className="w-8 h-8 rounded-full bg-zinc-950 flex items-center justify-center border-2 border-zinc-800">
                  <div className="w-3 h-3 rounded-full bg-zinc-600" />
                </div>
              </div>

              {/* Content Box */}
              <div className="flex-1 bg-zinc-900/30 border border-zinc-800/60 rounded-2xl p-5 hover:border-zinc-500/50 transition-colors group">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex gap-4 items-start">
                    <div className="w-14 h-14 bg-white rounded-xl p-1.5 flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-300">
                      <img 
                        src="/ldcu.webp" 
                        alt="Liceo" 
                        className="w-full h-full object-contain" 
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} 
                      />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white leading-snug">Science, Technology,<br className="hidden sm:block"/>Engineering, and Mathematics</h4>
                      <p className="text-sm text-zinc-400 mt-1">Liceo de Cagayan University</p>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Senior High School</span>
                        <span className="text-[10px] font-bold text-zinc-600 tracking-wider uppercase">•</span>
                        <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Main Campus</span>
                      </div>
                    </div>
                  </div>
                  <span className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold text-zinc-400 bg-zinc-800/50 px-3 py-1.5 rounded-lg border border-zinc-700/50 h-fit">
                    <Calendar className="w-3.5 h-3.5"/> 2021 - 2023
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )
    },
    // 2. LANGUAGES CARD
    {
      id: 'languages',
      className: 'lg:col-span-2 p-8',
      content: (
        <div className="flex flex-col h-full z-10 relative">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white">Languages</h3>
          </div>

          <div className="space-y-2 flex-grow flex flex-col justify-center">
            <div className="flex justify-between items-center border-b border-zinc-800/50 pb-3">
              <span className="text-zinc-200 font-medium text-lg">English</span>
              <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-md tracking-wider uppercase">Fluent</span>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-800/50 py-3">
              <span className="text-zinc-200 font-medium text-lg">Filipino</span>
              <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-md tracking-wider uppercase">Fluent</span>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-800/50 py-3">
              <span className="text-zinc-200 font-medium text-lg">Cebuano</span>
              <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-3 py-1 rounded-md tracking-wider uppercase">Native</span>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-800/50 py-3">
              <span className="text-zinc-200 font-medium text-lg">Korean</span>
              <span className="text-xs font-bold text-zinc-400 bg-zinc-800 px-3 py-1 rounded-md tracking-wider uppercase">Basic</span>
            </div>
            <div className="flex justify-between items-center pt-3">
              <span className="text-zinc-200 font-medium text-lg">Japanese</span>
              <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-md tracking-wider uppercase">Learning</span>
            </div>
          </div>
        </div>
      )
    },
    // 3. STATS CARDS
    {
      id: 'stat1',
      className: 'lg:col-span-2 p-6',
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center py-6 z-10 relative">
          <h2 className="text-5xl font-black text-cyan-400 mb-3 drop-shadow-[0_0_15px_rgba(6,182,212,0.4)] group-hover:scale-110 transition-transform duration-300">
            2+
          </h2>
          <p className="text-sm text-zinc-400 font-semibold tracking-wider uppercase">Years Experience</p>
        </div>
      )
    },
    {
      id: 'stat2',
      className: 'lg:col-span-2 p-6',
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center py-6 z-10 relative">
          <h2 className="text-5xl font-black text-cyan-400 mb-3 drop-shadow-[0_0_15px_rgba(6,182,212,0.4)] group-hover:scale-110 transition-transform duration-300">
            5+
          </h2>
          <p className="text-sm text-zinc-400 font-semibold tracking-wider uppercase">Projects Completed</p>
        </div>
      )
    },
    {
      id: 'stat3',
      className: 'lg:col-span-2 p-6',
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center py-6 z-10 relative">
          <h2 className="text-5xl font-black text-cyan-400 mb-3 drop-shadow-[0_0_15px_rgba(6,182,212,0.4)] group-hover:scale-110 transition-transform duration-300">
            2+
          </h2>
          <p className="text-sm text-zinc-400 font-semibold tracking-wider uppercase">Satisfied Clients</p>
        </div>
      )
    }
  ];

  return (
    <section id="about" className="relative w-full bg-transparent px-6 py-24 md:py-32">
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        
        {/* --- TITLE --- */}
        <div className="relative inline-block mb-16 md:mb-24">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">About Me</h2>
          <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-20 h-1.5 bg-cyan-500 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
        </div>

        {/* --- CINEMATIC TEXT REVEAL --- */}
        <div className="mb-24 md:mb-32 max-w-4xl mx-auto">
          <ScrollReveal className="text-base md:text-lg lg:text-xl font-medium text-white text-center leading-[1.7] md:leading-[1.7]">
            {`Hello! I am Kent, a Computer Science student and an aspiring Full-Stack Developer, with technical expertise supported by a five-year background in Multimedia Design. I build applications that connect backend logic with frontend interfaces, having a versatile set of modern technologies and creative tools at my disposal.\n\nMy current academic focus centers on AI and Computer Vision, alongside coursework in computational modeling and simulations. Always eager to learn emerging technologies, I aim to create functional software backed by clear documentation and scalable systems.`}
          </ScrollReveal>
        </div>

        {/* The Magic Bento Component */}
        <div className="w-full animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-150">
          <MagicBento
            items={bentoItems}
            gridClassName="grid grid-cols-1 lg:grid-cols-6 gap-6"
            glowColor="6, 182, 212"
            enableTilt={false} 
          />
        </div>

        {/* The Custom Floating Vinyl Player */}
        <div className="w-full animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
          <SpotifyOnRepeat />
        </div>

      </div>
    </section>
  );
};

export default About;