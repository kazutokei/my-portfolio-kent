import React, { useRef } from 'react';
import { motion, useScroll } from 'framer-motion';
import { techStackData } from '../../data/portfolioData';

export const AnimatedTechStack = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  return (
    <div ref={containerRef} className="relative w-full max-w-6xl mx-auto py-12 flex flex-col gap-20">
      
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[800px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Center scroll progress line (visible on md+) */}
      <div className="hidden md:block absolute left-1/3 top-0 bottom-0 w-px bg-zinc-800/30 -translate-x-1/2 overflow-hidden z-0">
        <motion.div 
          className="absolute top-0 left-0 w-full bg-white origin-top shadow-[0_0_10px_rgba(255,255,255,0.3)]"
          style={{ height: "100%", scaleY: scrollYProgress }}
        />
      </div>

      {techStackData.map((category, index) => {
        const titleParts = category.title.split(' ');
        const firstWord = titleParts[0];
        const restOfTitle = titleParts.slice(1).join(' ');

        return (
          <motion.div 
            key={index} 
            initial="hidden"
            whileInView="visible"
            viewport={{ margin: "-150px", once: false }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.1
                }
              }
            }}
            className="relative flex flex-col md:flex-row gap-12 md:gap-0 items-start z-10"
          >
            
            {/* Left side: Category Title */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, x: -40 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
              }}
              className="md:w-1/3 md:pr-16 flex flex-col gap-4 text-left md:text-right relative"
            >
              {/* Category Icon for Mobile */}
              <div className="md:hidden w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-2">
                <category.icon className="w-6 h-6 text-cyan-400" />
              </div>
              
              <h3 className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-cyan-500 tracking-tighter uppercase leading-tight pr-2">
                {firstWord} <br /> {restOfTitle}
              </h3>
              <p className="text-zinc-500 text-sm font-medium leading-relaxed mt-2 md:mt-0">
                {category.description}
              </p>
            </motion.div>
 
            {/* Center Node dot (visible on md+) */}
            <div className="hidden md:flex absolute left-1/3 top-8 -translate-x-1/2 w-8 h-8 items-center justify-center">
              <motion.div 
                variants={{
                  hidden: { scale: 0 },
                  visible: { scale: 1, transition: { type: "spring", stiffness: 300, damping: 15 } }
                }}
                className="w-4 h-4 rounded-full bg-zinc-950 border-2 border-white shadow-[0_0_15px_rgba(255,255,255,0.4)] z-20"
              />
            </div>

            {/* Right side: Tech Items */}
            <div className="md:w-2/3 md:pl-20 flex flex-wrap gap-4 md:gap-5 mt-2 md:mt-4">
              {category.items.map((tech) => (
                <motion.div
                  key={tech.name}
                  variants={{
                    hidden: { opacity: 0, scale: 0.8, x: 20 },
                    visible: { 
                      opacity: 1, 
                      scale: 1, 
                      x: 0, 
                      transition: { duration: 0.5, ease: "backOut" } 
                    }
                  }}
                  whileHover={{ y: -5, scale: 1.05 }}
                  className="group flex items-center gap-3 px-5 py-3 md:px-6 md:py-4 rounded-2xl bg-zinc-900/40 backdrop-blur-sm border border-zinc-800 hover:border-cyan-500/50 hover:bg-zinc-800/80 hover:shadow-[0_10px_30px_-10px_rgba(6,182,212,0.2)] transition-all duration-300"
                >
                  {tech.iconUrl ? (
                    <img src={tech.iconUrl} alt={tech.name} className="w-7 h-7 md:w-8 md:h-8 object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-md" />
                  ) : tech.LucideIcon ? (
                    <tech.LucideIcon className="w-7 h-7 md:w-8 md:h-8 text-zinc-400 group-hover:text-cyan-400 transition-colors duration-300" />
                  ) : null}
                  <span className="text-zinc-300 font-bold text-sm md:text-base group-hover:text-white transition-colors duration-300 tracking-wide">
                    {tech.name}
                  </span>
                </motion.div>
              ))}
            </div>

          </motion.div>
        );
      })}
    </div>
  );
};
