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

    // Set initial states so elements don't flash before the animation starts
    gsap.set(restOfLeftRef.current, { opacity: 0, y: 40 });
    gsap.set(rightColRef.current, { opacity: 0, x: 40 });
    
    const nav = document.getElementById('main-nav');
    if (nav) gsap.set(nav, { opacity: 0, y: -20 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top", 
        end: "+=120%",    
        scrub: 1,         
        pin: true,
        invalidateOnRefresh: true, // Recalculates perfectly if the window is resized
      }
    });

    // 1. Force the Intro Block (Name + Animated Roles) to start perfectly centered and massive
    tl.from(nameWrapperRef.current, {
      x: () => {
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
      scale: 1.6, // Makes it huge in the center of the screen
      ease: "power2.inOut",
      duration: 1
    }, 0);

    // 2. Fade in the Navbar we hid in App.tsx
    if (nav) {
      tl.to(nav, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }, 0.2);
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
      duration: 0.4,
      ease: "power2.out"
    }, 0.4);

  }, { scope: containerRef });

  // Custom gradient to match your uploaded design perfectly
  const gradientColors = ['#a855f7', '#3b82f6', '#22d3ee', '#a855f7'];

  return (
    <section id="home" ref={containerRef} className="relative w-full bg-transparent overflow-hidden">
      
      <div className="min-h-screen flex items-center justify-center px-6 pt-28 pb-12 w-full">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center z-10 relative">
          
          {/* --- LEFT COLUMN: Text Content --- */}
          <div className="space-y-6 flex flex-col items-start w-full relative">
            
            {/* SCROLL-ANIMATED CENTER BLOCK (Your Splash Screen) */}
            <div ref={nameWrapperRef} className="flex flex-col items-center lg:items-start z-20 origin-center relative">
              
              {/* LINE 1: "Hello, I'm Kent" - Scaled down for mobile */}
              <div className="flex flex-row items-baseline gap-x-2 sm:gap-x-4 mb-1 whitespace-nowrap">
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

              {/* LINE 2: "John Chavo" - Scaled down for mobile */}
              <div className="whitespace-nowrap">
                <GradientText
                  colors={gradientColors}
                  animationSpeed={6}
                  showBorder={false}
                  className="text-3xl sm:text-4xl md:text-6xl !font-extrabold tracking-tight leading-[1.1] !block !mx-0"
                >
                  John Chavo
                </GradientText>
              </div>

              {/* Animated Typing Roles - Scaled down text size to fit small screens */}
              <div className="text-sm sm:text-base md:text-xl text-cyan-200/80 font-mono h-[28px] flex items-center pt-1 mt-4 lg:mt-2">
                <span className="mr-3 text-cyan-500">{'>'}</span>
                <TextType
                  text={[
                    "Aspiring Full-Stack Developer",
                    "Aspiring Web & Software Developer",
                    "Graphic Designer",
                    "Video Editor",
                    "UI/UX Enthusiast",
                    "Student Leader",
                  ]}
                  typingSpeed={25}   // Zippy typing speed
                  deletingSpeed={15} // Zippy deleting speed
                  className="text-cyan-400 font-bold"
                  cursorCharacter="_"
                />
              </div>
            </div>

            {/* REST OF CONTENT (Fades in on scroll) */}
            <div ref={restOfLeftRef} className="space-y-6 w-full pt-2 opacity-0">
              
              <p className="text-zinc-400 text-sm sm:text-base md:text-lg max-w-xl leading-relaxed text-center lg:text-left mt-2">
                Computer Science undergraduate bridging Full-Stack Development and Multimedia Design. 
                Dedicated to delivering high-fidelity user experiences through the integration of technical logic and creativity.
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-1">
                <a href="#contact" className="group px-6 py-2.5 bg-cyan-500 text-black font-bold rounded-full flex items-center gap-2 hover:bg-cyan-400 hover:scale-105 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] text-sm md:text-base">
                  Get in Touch
                  <Mail className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                
                {/* Clean, Native New Tab Button */}
                <a 
                  href="/CHAVO_resume.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="px-6 py-2.5 bg-zinc-900 text-white font-semibold rounded-full flex items-center gap-2 hover:bg-zinc-800 border border-zinc-800 transition-all hover:border-zinc-600 text-sm md:text-base"
                >
                  View Resume
                  <ExternalLink className="w-4 h-4" />
                </a>

                <a href="#projects" className="px-6 py-2.5 text-zinc-300 font-semibold rounded-full hover:text-white transition-all flex items-center gap-2 group text-sm md:text-base">
                  View My Work
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-zinc-800/50 w-full mt-6">
                <div className="flex flex-col items-center">
                  <h4 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center">
                    <CountUp from={0} to={2} separator="," direction="up" duration={3} className="count-up-text" />+
                  </h4>
                  <p className="text-zinc-500 text-[10px] sm:text-xs md:text-sm mt-1 text-center">Years Experience</p>
                </div>
                <div className="flex flex-col items-center">
                  <h4 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center">
                    <CountUp from={0} to={5} separator="," direction="up" duration={3} className="count-up-text" />+
                  </h4>
                  <p className="text-zinc-500 text-[10px] sm:text-xs md:text-sm mt-1 text-center">Projects Completed</p>
                </div>
                <div className="flex flex-col items-center">
                  <h4 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center">
                    <CountUp from={0} to={2} separator="," direction="up" duration={3} className="count-up-text" />+
                  </h4>
                  <p className="text-zinc-500 text-[10px] sm:text-xs md:text-sm mt-1 text-center">Satisfied Clients</p>
                </div>
              </div>
            </div>

          </div>

          {/* --- RIGHT COLUMN: Profile Card (Fades in on scroll) --- */}
          <div ref={rightColRef} className="flex justify-center lg:justify-end relative perspective-1000 opacity-0">
            {/* Added max-width constraints for smaller screens to fix aggressive image cropping */}
            <div className="w-full max-w-[280px] sm:max-w-[340px] lg:max-w-[380px] mx-auto lg:mx-0">
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
                 enableMobileTilt={false} // Disabled tilt on mobile to fix the touch-scroll hijack issue
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