import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProfileCard from '../components/bits/ProfileCard';
import TextType from '../components/bits/TextType';
import Shuffle from '../components/bits/Shuffle';
import GradientText from '../components/bits/GradientText';
import CountUp from '../components/bits/CountUp';
import { ArrowRight, Download, Mail } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create a timeline for the hero section
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        }
      });

      // Animate elements with the class 'gsap-anim' sequentially
      tl.from(".gsap-anim", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out"
      });

      // Animate the profile card separately
      tl.from(".gsap-card", {
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: "back.out(1.5)"
      }, "-=0.6");

    }, sectionRef);

    return () => ctx.revert(); // Cleanup on unmount
  }, []);

  return (
    <section id="home" ref={sectionRef} className="relative min-h-screen flex items-center justify-center bg-zinc-950 px-6 pt-28 pb-12 overflow-hidden">
      
      <div className="absolute top-[-10%] left-[-20%] w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center z-10">
        
        {/* --- LEFT COLUMN: Text Content --- */}
        <div className="space-y-6">
          
          <div className="flex flex-col items-start gap-1 gsap-anim">
            <div className="flex flex-row flex-wrap items-baseline gap-x-3">
              <Shuffle
                tag="h1"
                text="Hi, I am"
                className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1]"
                shuffleDirection="right"
                duration={0.35}
                animationMode="evenodd"
                shuffleTimes={1}
                ease="power3.out"
                stagger={0.03}
                threshold={0.1}
                triggerOnce={true}
                triggerOnHover={true}
                respectReducedMotion={true}
                loop={false}
                loopDelay={0}
              />
              <GradientText
                colors={['#22d3ee', '#6366f1', '#a855f7', '#22d3ee']}
                animationSpeed={6}
                showBorder={false}
                className="text-4xl md:text-6xl !font-extrabold tracking-tight leading-[1.1] !block !mx-0"
              >
                Kent
              </GradientText>
            </div>

            <GradientText
              colors={['#22d3ee', '#6366f1', '#a855f7', '#22d3ee']}
              animationSpeed={6}
              showBorder={false}
              className="text-4xl md:text-6xl !font-extrabold tracking-tight leading-[1.1] !block !mx-0"
            >
              John Chavo
            </GradientText>
          </div>

          <div className="text-lg md:text-xl text-cyan-200/80 font-mono h-[28px] flex items-center pt-1 gsap-anim">
            <span className="mr-3 text-cyan-500">{'>'}</span>
            <TextType
              text={[
                "Aspiring Web and Software Developer",
                "Full-Stack Engineer",
                "Graphic Designer",
                "Video Editor",
                "UI/UX Enthusiast"
              ]}
              typingSpeed={80}
              deletingSpeed={40}
              className="text-cyan-400 font-bold"
              cursorCharacter="_"
            />
          </div>

          <p className="text-zinc-400 text-base md:text-lg max-w-xl leading-relaxed gsap-anim">
            Computer Science undergraduate bridging Full-Stack Development and Multimedia Design. 
            Dedicated to delivering high-fidelity user experiences through the integration of technical logic and creativity.
          </p>

          <div className="flex flex-wrap gap-3 pt-1 gsap-anim">
            <a href="#contact" className="group px-6 py-2.5 bg-cyan-500 text-black font-bold rounded-full flex items-center gap-2 hover:bg-cyan-400 hover:scale-105 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] text-sm md:text-base">
              Get in Touch
              <Mail className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="/resume.pdf" className="px-6 py-2.5 bg-zinc-900 text-white font-semibold rounded-full flex items-center gap-2 hover:bg-zinc-800 border border-zinc-800 transition-all hover:border-zinc-600 text-sm md:text-base">
              Download CV
              <Download className="w-4 h-4" />
            </a>
            <a href="#projects" className="px-6 py-2.5 text-zinc-300 font-semibold rounded-full hover:text-white transition-all flex items-center gap-2 group text-sm md:text-base">
              View My Work
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-zinc-800/50 w-full mt-6 gsap-anim">
            <div className="flex flex-col items-center">
              <h4 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center">
                <CountUp from={0} to={2} separator="," direction="up" duration={3} className="count-up-text" />+
              </h4>
              <p className="text-zinc-500 text-xs md:text-sm mt-1 text-center">Years Experience</p>
            </div>
            <div className="flex flex-col items-center">
              <h4 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center">
                <CountUp from={0} to={5} separator="," direction="up" duration={3} className="count-up-text" />+
              </h4>
              <p className="text-zinc-500 text-xs md:text-sm mt-1 text-center">Projects Completed</p>
            </div>
            <div className="flex flex-col items-center">
              <h4 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center">
                <CountUp from={0} to={2} separator="," direction="up" duration={3} className="count-up-text" />+
              </h4>
              <p className="text-zinc-500 text-xs md:text-sm mt-1 text-center">Satisfied Clients</p>
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN: Profile Card --- */}
        <div className="flex justify-center lg:justify-end relative perspective-1000 gsap-card">
          <div className="w-full max-w-[380px]">
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
                enableMobileTilt={true}
                onContactClick={() => console.log('Contact clicked')}
                behindGlowEnabled={true} 
                behindGlowColor="rgba(125, 190, 255, 0.67)"
                innerGradient="linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)"
             />
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;