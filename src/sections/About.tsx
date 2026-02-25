import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CountUp from '../components/bits/CountUp';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".gsap-anim", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out"
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="relative min-h-screen flex flex-col items-center justify-center bg-zinc-950 px-6 py-24">
      
      <div className="max-w-4xl w-full space-y-12">
        
        {/* --- TOP SECTION: Title & Bio --- */}
        <div className="flex flex-col items-center text-center space-y-6 gsap-anim">
          <div className="relative inline-block">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">About Me</h2>
            <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-20 h-1 bg-cyan-500 rounded-full" />
          </div>

          <div className="text-zinc-400 text-base md:text-lg leading-relaxed max-w-3xl space-y-4">
            <p>
              Hello! I am Kent, a Computer Science student and an aspiring Full-Stack Developer, 
              with technical expertise supported by a five-year background in Multimedia Design. 
              I build applications that connect backend logic with frontend interfaces, having a 
              versatile set of modern technologies and creative tools at my disposal.
            </p>
            <p>
              My current academic focus centers on AI and Computer Vision, alongside coursework 
              in computational modeling and simulations. Always eager to learn emerging technologies, 
              I aim to create functional software backed by clear documentation and scalable systems.
            </p>
          </div>
        </div>

        {/* --- MIDDLE SECTION: Education & Language --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-6 hover:border-cyan-500/30 hover:bg-zinc-900/60 transition-all duration-300 gsap-anim">
            <h3 className="text-lg font-bold text-cyan-400 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" /> Education
            </h3>
            <div className="space-y-1">
              <p className="text-white font-semibold text-base">University of Science and Technology of Southern Philippines</p>
              <p className="text-zinc-500 text-xs">Cagayan de Oro Campus</p>
              <p className="text-zinc-300 mt-2 font-medium text-sm">BS in Computer Science</p>
              <p className="text-zinc-600 text-xs italic">2023 - Present (Anticipated 2027)</p>
            </div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-6 hover:border-cyan-500/30 hover:bg-zinc-900/60 transition-all duration-300 gsap-anim">
            <h3 className="text-lg font-bold text-cyan-400 mb-3 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-cyan-400" /> Languages
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between items-baseline border-b border-white/5 pb-1">
                  <span className="text-white text-sm">English</span>
                  <span className="text-zinc-500 text-xs italic">Fluent</span>
                </div>
                <div className="flex justify-between items-baseline border-b border-white/5 pb-1">
                  <span className="text-white text-sm">Filipino</span>
                  <span className="text-zinc-500 text-xs italic">Fluent</span>
                </div>
              </div>
              <div className="space-y-2">
                 <div className="flex justify-between items-baseline border-b border-white/5 pb-1">
                  <span className="text-white text-sm">Cebuano</span>
                  <span className="text-zinc-500 text-xs italic">Native</span>
                </div>
                <div className="flex justify-between items-baseline border-b border-white/5 pb-1">
                  <span className="text-white text-sm">Korean</span>
                  <span className="text-zinc-500 text-xs italic">Basic</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- BOTTOM SECTION: Stats --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center justify-center hover:bg-zinc-900/50 hover:border-cyan-500/20 transition-all duration-300 group min-h-[140px] gsap-anim">
            <h4 className="text-4xl font-extrabold text-cyan-400 mb-1 group-hover:scale-110 transition-transform duration-300">
              <CountUp from={0} to={2} duration={3} className="count-up-text" />+
            </h4>
            <p className="text-zinc-400 text-sm font-medium">Years Experience</p>
          </div>

          <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center justify-center hover:bg-zinc-900/50 hover:border-cyan-500/20 transition-all duration-300 group min-h-[140px] gsap-anim">
            <h4 className="text-4xl font-extrabold text-cyan-400 mb-1 group-hover:scale-110 transition-transform duration-300">
              <CountUp from={0} to={5} duration={3} className="count-up-text" />+
            </h4>
            <p className="text-zinc-400 text-sm font-medium">Projects Completed</p>
          </div>

          <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center justify-center hover:bg-zinc-900/50 hover:border-cyan-500/20 transition-all duration-300 group min-h-[140px] gsap-anim">
            <h4 className="text-4xl font-extrabold text-cyan-400 mb-1 group-hover:scale-110 transition-transform duration-300">
              <CountUp from={0} to={2} duration={3} className="count-up-text" />+
            </h4>
            <p className="text-zinc-400 text-sm font-medium">Satisfied Clients</p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;