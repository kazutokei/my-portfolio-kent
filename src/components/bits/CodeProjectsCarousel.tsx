import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Project } from '../../data/portfolioData';

// Re-using the OptimizedImage logic
const OptimizedImage = ({ src, alt, className, ...props }: { src: string; alt: string; className?: string; [key: string]: unknown }) => {
  const isLocal = src.startsWith('/');
  const avifSrc = isLocal ? src.replace(/\.(webp|png|jpg|jpeg)$/, '.avif') : src;
  
  return (
    <picture className={className}>
      {isLocal && <source srcSet={avifSrc} type="image/avif" />}
      <img src={src} alt={alt} className={className} loading="lazy" {...props} />
    </picture>
  );
};

interface CarouselProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

export const CodeProjectsCarousel: React.FC<CarouselProps> = ({ projects, onProjectClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = React.useCallback(() => setCurrentIndex((prev) => (prev + 1) % projects.length), [projects.length]);
  const prev = React.useCallback(() => setCurrentIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1)), [projects.length]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [next, prev]);

  if (!projects || projects.length === 0) return null;

  return (
    <div className="relative w-full max-w-6xl mx-auto py-4 flex flex-col items-center">
      {/* 3D Carousel Container */}
      <div className="relative w-full h-[480px] md:h-[580px] flex items-center justify-center perspective-[1200px] overflow-hidden sm:overflow-visible">
        <AnimatePresence initial={false} mode="popLayout">
          {projects.map((project, index) => {
            // Determine position relative to current index
            let offset = index - currentIndex;
            // Handle wrap around for seamless loop (optional, keeping it simple with direct index difference for now)
            // But to make it feel like a true infinite carousel visually, we calculate shortest distance:
            const halfLength = Math.floor(projects.length / 2);
            if (offset > halfLength) offset -= projects.length;
            if (offset < -halfLength) offset += projects.length;

            const isActive = offset === 0;
            const isPrev = offset === -1;
            const isNext = offset === 1;

            // Only render adjacent and active cards to keep DOM light and match visual
            if (Math.abs(offset) > 1) return null;

            return (
              <motion.div
                key={project.id}
                onClick={() => {
                  if (isActive) onProjectClick(project);
                  else if (isPrev) prev();
                  else if (isNext) next();
                }}
                drag={isActive ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(e, { offset: dragOffset, velocity }) => {
                  const swipe = dragOffset.x * velocity.x;
                  if (swipe < -5000 || dragOffset.x < -75) next();
                  else if (swipe > 5000 || dragOffset.x > 75) prev();
                }}
                className={`absolute w-[85%] sm:w-[500px] h-[400px] md:h-[480px] rounded-2xl overflow-hidden cursor-pointer ${
                  isActive ? 'shadow-[0_0_50px_rgba(6,182,212,0.3)] z-30' : 'z-10'
                }`}
                initial={{ 
                  opacity: 0, 
                  scale: 0.8, 
                  x: offset > 0 ? '50%' : '-50%',
                  rotateY: offset > 0 ? -15 : 15
                }}
                animate={{
                  opacity: isActive ? 1 : 0.4,
                  scale: isActive ? 1 : 0.85,
                  x: isActive ? '0%' : offset > 0 ? '65%' : '-65%',
                  rotateY: isActive ? 0 : offset > 0 ? -15 : 15,
                  zIndex: isActive ? 30 : 20,
                  filter: isActive ? 'brightness(100%)' : 'brightness(40%)'
                }}
                exit={{ 
                  opacity: 0, 
                  scale: 0.8,
                  x: offset > 0 ? '100%' : '-100%' 
                }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                style={{
                  transformOrigin: isActive ? 'center' : offset > 0 ? 'left center' : 'right center'
                }}
              >
                {/* Card Content matches the reference image */}
                <div className={`w-full h-full bg-zinc-950 flex flex-col border transition-colors duration-300 ${
                  isActive ? 'border-cyan-500/80' : 'border-zinc-800'
                }`}>
                  
                  {/* Image Header */}
                  <div className="relative h-[45%] w-full bg-zinc-900 overflow-hidden border-b border-zinc-800">
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent z-10" />
                    <OptimizedImage 
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      draggable={false}
                    />
                  </div>

                  {/* Body Content */}
                  <div className="p-5 md:p-6 flex flex-col flex-grow relative z-20">
                    <h3 className="text-xl md:text-2xl font-black text-white mb-2 tracking-wide">{project.title}</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3 mb-4 font-medium">
                      {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-auto">
                      {project.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-md text-xs font-semibold text-zinc-300">
                           {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="flex items-center px-2 py-1 text-xs font-bold text-cyan-400">
                          Show
                        </span>
                      )}
                    </div>

                    {/* Bottom Actions */}
                    <div className="flex gap-4 mt-4">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (project.liveUrl) window.open(project.liveUrl, '_blank');
                          else onProjectClick(project);
                        }}
                        className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 font-bold text-sm transition-all ${
                          isActive 
                            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20' 
                            : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
                        }`}
                      >
                        <ExternalLink className="w-4 h-4" /> Live Demo
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (project.githubUrl) window.open(project.githubUrl, '_blank');
                        }}
                        className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 font-bold text-sm transition-all ${
                          isActive 
                            ? 'bg-zinc-900 text-zinc-300 border border-zinc-700 hover:bg-zinc-800' 
                            : 'bg-zinc-900 text-zinc-600 border border-zinc-800'
                        }`}
                      >
                        <Github className="w-4 h-4" /> GitHub
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Glowing Dot Indicator */}
      <div className="mt-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,1)]" />
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-6">
        <button 
          onClick={prev}
          className="px-5 py-2.5 bg-zinc-900/80 border border-zinc-800 rounded-lg text-sm font-bold text-zinc-300 hover:text-cyan-400 hover:border-cyan-500/50 transition-colors flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        
        <div className="text-zinc-500 font-mono text-sm tracking-widest font-bold">
          <span className="text-cyan-400">{currentIndex + 1}</span> / {projects.length}
        </div>

        <button 
          onClick={next}
          className="px-5 py-2.5 bg-zinc-900/80 border border-zinc-800 rounded-lg text-sm font-bold text-zinc-300 hover:text-cyan-400 hover:border-cyan-500/50 transition-colors flex items-center gap-2"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
