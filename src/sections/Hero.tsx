import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import ProfileCard from '../components/bits/ProfileCard';
import TextType from '../components/bits/TextType';
import GradientText from '../components/bits/GradientText';
import CountUp from '../components/bits/CountUp';
import { ArrowRight, ExternalLink, Mail } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const nameWrapperRef = useRef<HTMLDivElement>(null);
  const restOfLeftRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!nameWrapperRef.current || !containerRef.current) return;

    const isMobile = window.innerWidth < 768;

    // Set initial states
    gsap.set(restOfLeftRef.current, { opacity: 0, y: 40 });
    gsap.set(rightColRef.current, { opacity: 0, x: isMobile ? 0 : 40, y: isMobile ? 40 : 0 });
    
    const nav = document.getElementById('main-nav');
    if (nav) {
      gsap.set(nav, { opacity: 0, y: -20, pointerEvents: "none" });
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top", 
        end: "+=120%",    
        scrub: 1,         
        pin: true,
        invalidateOnRefresh: true, 
      }
    });

    // 1. Force the Intro Block to start centered. 
    tl.from(nameWrapperRef.current, {
      x: () => {
        if (isMobile) return 0; 
        const el = nameWrapperRef.current;
        if (!el) return 0;
        const rect = el.getBoundingClientRect();
        return (window.innerWidth / 2) - (rect.left + rect.width / 2);
      },
      y: () => {
        const el = nameWrapperRef.current;
        if (!el) return 0;
        const rect = el.getBoundingClientRect();
        return (window.innerHeight / 2) - (rect.top + rect.height / 2);
      },
      scale: isMobile ? 1 : 1.6, 
      ease: "power2.inOut",
      duration: 1
    }, 0);

    // 2. Fade in the Navbar we hid in App.tsx
    if (nav) {
      tl.to(nav, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out", pointerEvents: "auto" }, 0.2);
    }

    // 3. Fade in the Bio, Buttons, and Stats
    tl.to(restOfLeftRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: "power2.out"
    }, 0.3); 

    // 4. Fade in the Profile Card
    tl.to(rightColRef.current, {
      opacity: 1,
      x: 0,
      y: 0,
      duration: 0.4,
      ease: "power2.out"
    }, 0.4);

  }, { scope: containerRef });

  const gradientColors = ['#a855f7', '#3b82f6', '#22d3ee', '#a855f7'];

  return (
    <section id="home" ref={containerRef} className="relative w-full bg-transparent">
      
      <div className="flex items-center justify-center px-4 sm:px-6 pt-20 pb-8 w-full">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center z-10 relative">
          
          {/* --- LEFT COLUMN: Text Content --- */}
          <div className="space-y-6 flex flex-col items-center lg:items-start w-full relative">
            
            {/* SCROLL-ANIMATED CENTER BLOCK */}
            <div ref={nameWrapperRef} className="flex flex-col items-center lg:items-start z-20 origin-center relative w-full max-w-full">
              
              {/* LINE 1: "Hello, I'm Kent" */}
              <div className="flex flex-row items-baseline justify-center lg:justify-start gap-x-2 sm:gap-x-4 mb-1 w-full">
                <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
                  Hello, I'm
                </h2>
                <GradientText
                  colors={gradientColors}
                  animationSpeed={6}
                  showBorder={false}
                  className="text-3xl sm:text-4xl md:text-6xl !font-extrabold tracking-tight leading-[1.1] !block !mx-0"
                >
                  Kent
                </GradientText>
              </div>

              {/* LINE 2: "John Chavo" */}
              <div className="w-full flex justify-center lg:justify-start">
                <GradientText
                  colors={gradientColors}
                  animationSpeed={6}
                  showBorder={false}
                  className="text-3xl sm:text-4xl md:text-6xl !font-extrabold tracking-tight leading-[1.1] !block !mx-0"
                >
                  John Chavo
                </GradientText>
              </div>

              {/* Animated Typing Roles */}
              <div className="text-[10px] xs:text-[11px] sm:text-sm md:text-xl text-cyan-200/80 font-mono h-auto min-h-[28px] flex items-center justify-center lg:justify-start pt-1 mt-4 lg:mt-2 w-full overflow-hidden">
                <span className="mr-1.5 sm:mr-3 text-cyan-500">{'>'}</span>
                <TextType
                  text={[
                    "Aspiring Full-Stack Developer",
                    "Aspiring Web & Software Dev", 
                    "Graphic Designer",
                    "Video Editor",
                    "UI/UX Enthusiast"
                  ]}
                  typingSpeed={25}   
                  deletingSpeed={15} 
                  className="text-cyan-400 font-bold whitespace-nowrap"
                  cursorCharacter="_"
                />
              </div>
            </div>

            {/* REST OF CONTENT */}
            <div ref={restOfLeftRef} className="space-y-6 w-full pt-2 opacity-0 flex flex-col items-center lg:items-start">
              
              {/* REVISED HERO DESCRIPTION */}
              <p className="text-zinc-400 text-sm sm:text-base md:text-lg max-w-xl leading-relaxed text-center lg:text-left mt-2 px-2 lg:px-0">
                Computer Science undergraduate bridging full-stack technologies and visual design. Dedicated to delivering impactful digital solutions through the integration of technical logic, clean interfaces, and creative resourcefulness.
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-1">
                <a href="#contact" className="group px-6 py-2.5 bg-cyan-500 text-black font-bold rounded-full flex items-center gap-2 hover:bg-cyan-400 hover:scale-105 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] text-sm md:text-base">
                  Get in Touch
                  <Mail className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                
                <a 
                  href="/Kent-Chavo_Resume.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="px-6 py-2.5 bg-zinc-900 text-white font-semibold rounded-full flex items-center gap-2 hover:bg-zinc-800 border border-zinc-800 transition-all hover:border-zinc-600 text-sm md:text-base"
                >
                  View Resume
                  <ExternalLink className="w-4 h-4" />
                </a>

                <a href="#projects" className="px-6 py-2.5 text-zinc-300 font-semibold rounded-full hover:text-white transition-all flex items-center gap-2 group text-sm md:text-base hidden sm:flex">
                  View My Work
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-6 border-t border-zinc-800/50 w-full max-w-lg mt-6">
                <div className="flex flex-col items-center">
                  <h4 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center">
                    <CountUp from={0} to={2} separator="," direction="up" duration={3} className="count-up-text" />+
                  </h4>
                  <p className="text-zinc-500 text-[10px] sm:text-xs md:text-sm mt-1 text-center">Years Exp.</p>
                </div>
                <div className="flex flex-col items-center">
                  <h4 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center">
                    <CountUp from={0} to={5} separator="," direction="up" duration={3} className="count-up-text" />+
                  </h4>
                  <p className="text-zinc-500 text-[10px] sm:text-xs md:text-sm mt-1 text-center">Projects</p>
                </div>
                <div className="flex flex-col items-center">
                  <h4 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center">
                    <CountUp from={0} to={2} separator="," direction="up" duration={3} className="count-up-text" />+
                  </h4>
                  <p className="text-zinc-500 text-[10px] sm:text-xs md:text-sm mt-1 text-center">Clients</p>
                </div>
              </div>
            </div>

          </div>

          {/* --- RIGHT COLUMN: Profile Card --- */}
          <div ref={rightColRef} className="w-full flex justify-center lg:justify-end relative perspective-1000 opacity-0 mt-0 sm:mt-8 lg:mt-0">
            <div className="flex justify-center w-full transform scale-[0.85] xs:scale-[0.90] sm:scale-[0.95] md:scale-100 origin-top">
               <ProfileCard
                 name="Kent John J. Chavo"
                 title="Aspiring Full-Stack Developer"
                 handle="kentjohn03"
                 status="Available for Work"
                 contactText="Contact Me"
                 avatarUrl="/me.webp"
                 miniAvatarUrl="/me.webp"
                 showUserInfo={true}
                 enableTilt={true}
                 enableMobileTilt={false} 
                 onContactClick={() => {
                   document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                 }}
                 behindGlowEnabled={true} 
                 behindGlowColor="rgba(125, 190, 255, 0.67)"
                 innerGradient="linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)"
               />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;