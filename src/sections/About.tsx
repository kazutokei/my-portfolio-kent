import React from 'react';
import CountUp from '../components/bits/CountUp';
import MagicBento from '../components/bits/MagicBento';
import type { BentoItem } from '../components/bits/MagicBento';
import ScrollReveal from '../components/bits/ScrollReveal';

const About = () => {
  const bentoItems: BentoItem[] = [
    {
      id: 'education',
      className: 'md:col-span-3 flex flex-col',
      content: (
        <>
          <h3 className="text-lg font-bold text-cyan-400 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" /> Education
          </h3>
          <div className="space-y-1">
            <p className="text-white font-semibold text-base">University of Science and Technology of Southern Philippines</p>
            <p className="text-zinc-500 text-xs">Cagayan de Oro Campus</p>
            <p className="text-zinc-300 mt-2 font-medium text-sm">BS in Computer Science</p>
            <p className="text-zinc-600 text-xs italic">2023 - Present (Anticipated 2027)</p>
          </div>
        </>
      )
    },
    {
      id: 'languages',
      className: 'md:col-span-3 flex flex-col',
      content: (
        <>
          <h3 className="text-lg font-bold text-cyan-400 mb-3 flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-cyan-400" /> Languages
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between items-baseline border-b border-zinc-800/50 pb-1">
                <span className="text-white text-sm">English</span>
                <span className="text-zinc-500 text-xs italic">Fluent</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-zinc-800/50 pb-1">
                <span className="text-white text-sm">Filipino</span>
                <span className="text-zinc-500 text-xs italic">Fluent</span>
              </div>
            </div>
            <div className="space-y-2">
               <div className="flex justify-between items-baseline border-b border-zinc-800/50 pb-1">
                <span className="text-white text-sm">Cebuano</span>
                <span className="text-zinc-500 text-xs italic">Native</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-zinc-800/50 pb-1">
                <span className="text-white text-sm">Korean</span>
                <span className="text-zinc-500 text-xs italic">Basic</span>
              </div>
            </div>
          </div>
        </>
      )
    },
    {
      id: 'stat-years',
      className: 'md:col-span-2 flex flex-col items-center justify-center min-h-[140px] text-center',
      content: (
        <>
          <h4 className="text-4xl font-extrabold text-cyan-400 mb-1 group-hover:scale-110 transition-transform duration-300">
            <CountUp from={0} to={2} duration={3} className="count-up-text" />+
          </h4>
          <p className="text-zinc-400 text-sm font-medium">Years Experience</p>
        </>
      )
    },
    {
      id: 'stat-projects',
      className: 'md:col-span-2 flex flex-col items-center justify-center min-h-[140px] text-center',
      content: (
        <>
          <h4 className="text-4xl font-extrabold text-cyan-400 mb-1 group-hover:scale-110 transition-transform duration-300">
            <CountUp from={0} to={5} duration={3} className="count-up-text" />+
          </h4>
          <p className="text-zinc-400 text-sm font-medium">Projects Completed</p>
        </>
      )
    },
    {
      id: 'stat-clients',
      className: 'md:col-span-2 flex flex-col items-center justify-center min-h-[140px] text-center',
      content: (
        <>
          <h4 className="text-4xl font-extrabold text-cyan-400 mb-1 group-hover:scale-110 transition-transform duration-300">
            <CountUp from={0} to={2} duration={3} className="count-up-text" />+
          </h4>
          <p className="text-zinc-400 text-sm font-medium">Satisfied Clients</p>
        </>
      )
    }
  ];

  return (
    <section id="about" className="relative w-full bg-transparent px-6 py-24 md:py-32 overflow-hidden">
      
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        
        {/* --- TITLE --- */}
        <div className="relative inline-block mb-16 md:mb-24">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">About Me</h2>
          <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-20 h-1.5 bg-cyan-500 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
        </div>

        {/* --- CINEMATIC TEXT REVEAL --- */}
        <ScrollReveal className="text-xl md:text-2xl lg:text-3xl font-bold text-zinc-200 leading-[1.6] md:leading-[1.7] mb-24 md:mb-32 max-w-4xl mx-auto">
          {/* Invisible spacer for Indentation */}
          <span className="inline-block w-8 md:w-16" />
          Hello! I am Kent, a Computer Science student and an aspiring Full-Stack Developer, with technical expertise supported by a five-year background in Multimedia Design. I build applications that connect backend logic with frontend interfaces, having a versatile set of modern technologies and creative tools at my disposal.
          
          {/* Invisible spacer forcing the Flex container to break to a new line */}
          <span className="w-full block h-6 md:h-10" />
          
          {/* Invisible spacer for Indentation on paragraph 2 */}
          <span className="inline-block w-8 md:w-16" />
          My current academic focus centers on AI and Computer Vision, alongside coursework in computational modeling and simulations. Always eager to learn emerging technologies, I aim to create functional software backed by clear documentation and scalable systems.
        </ScrollReveal>

        {/* --- MAGIC BENTO GRID --- */}
        <div className="w-full relative z-10">
          <MagicBento 
            items={bentoItems}
            gridClassName="grid gap-5 grid-cols-1 md:grid-cols-6"
            enableStars={true}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={false}
            enableMagnetism={false}
            clickEffect={true}
            spotlightRadius={400}
            particleCount={12}
            glowColor="132, 0, 255" // Cyberpunk Purple
            disableAnimations={false}
          />
        </div>

      </div>
    </section>
  );
};

export default About;