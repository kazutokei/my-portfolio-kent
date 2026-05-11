import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  ExternalLink, Palette, Video, Code, Layers,
  ChevronLeft, Github, Star, Code2, Play, X, Calendar, Building2, ArrowRight, ArrowLeft
} from 'lucide-react';
import ImageTrail from '../components/bits/ImageTrail'; 
import { 
  projectsData, 
  certificatesData
} from '../data/portfolioData';
import type { 
  Project
} from '../data/portfolioData';
import CardSwap, { Card } from '../components/bits/CardSwap';
import type { CardSwapHandle } from '../components/bits/CardSwap';
import gsap from 'gsap';

// Helper to provide AVIF fallback
const OptimizedImage = ({ 
  src, 
  alt, 
  className, 
  loading = "lazy", 
  ...props 
}: { 
  src: string; 
  alt: string; 
  className?: string; 
  loading?: "lazy" | "eager"; 
} & React.ImgHTMLAttributes<HTMLImageElement>) => {
  const isLocal = src.startsWith('/');
  const avifSrc = isLocal ? src.replace(/\.(webp|png|jpg|jpeg)$/, '.avif') : src;
  
  return (
    <picture className={className}>
      {isLocal && <source srcSet={avifSrc} type="image/avif" />}
      <img src={src} alt={alt} className={className} loading={loading} {...props} />
    </picture>
  );
};

const Projects = () => {
  const [showOtherProjects, setShowOtherProjects] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const infoRef = useRef<HTMLDivElement>(null);
  const cardSwapRef = useRef<CardSwapHandle>(null);

  useEffect(() => {
    if (activeVideo || selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [activeVideo, selectedProject]);

  const codeProjects = projectsData.filter(project => project.type === 'code');
  const videoProjects = projectsData.filter(project => project.type === 'video');

  const graphicImages = useMemo(() => {
    const graphics = projectsData.filter(p => p.type === 'graphic');
    // Use AVIF for the ImageTrail — much smaller files for a buttery smooth trail
    return graphics.map(p => ({ src: p.imageUrl.replace(/\.webp$/, '.avif'), alt: p.title }));
  }, []);

  // Animate the left info panel on project change
  // Animate the left info panel on project change
  const animateToProject = (newIndex: number) => {
    if (!infoRef.current) {
      setActiveIndex(newIndex);
      return;
    }
    gsap.to(infoRef.current, {
      opacity: 0,
      y: 10,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        setActiveIndex(newIndex);
        gsap.fromTo(
          infoRef.current,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
        );
      }
    });
  };

  const currentProject = codeProjects[activeIndex];


  return (
    <>
      <section id="projects" className="relative bg-transparent px-6 py-16 overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-20">

          {/* ── CINEMATIC CODE PROJECTS ── */}
          <div>

            {/* Top strip: PROJECTS heading + counter */}
            <div className="flex items-end justify-between border-b border-zinc-800 pb-4 mb-12">
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white tracking-tight leading-none">
                Projects
              </h2>

            </div>

            {/* Split layout — items-start so both columns start at the same top edge */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-start">

              {/* LEFT — Project info */}
              <div className="flex flex-col justify-between lg:min-h-[420px] pr-0 lg:pr-16 pt-2">
                <div ref={infoRef} className="flex flex-col h-full">
                  <div className="space-y-5">
                    <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-snug">
                      {currentProject.title}
                    </h3>
                    <div className="w-12 h-0.5 bg-cyan-500" />
                    <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
                      {currentProject.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {currentProject.tags.map(tag => (
                        <span
                          key={tag}
                          className="text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full border border-zinc-800 text-zinc-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-3 pt-6 mt-auto">
                    <button
                      onClick={() => setSelectedProject(currentProject)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500 text-black font-bold rounded-lg hover:bg-cyan-400 transition-all text-sm"
                    >
                      View Details <ArrowRight className="w-4 h-4" />
                    </button>
                    {currentProject.githubUrl && (
                      <a
                        href={currentProject.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white font-semibold rounded-lg border border-zinc-800 hover:bg-zinc-800 transition-all text-sm"
                      >
                        <Github className="w-4 h-4" /> Source Code
                      </a>
                    )}
                    {currentProject.liveUrl && (
                      <a
                        href={currentProject.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white font-semibold rounded-lg border border-zinc-800 hover:bg-zinc-800 transition-all text-sm"
                      >
                        <ExternalLink className="w-4 h-4" /> Live Demo
                      </a>
                    )}
                  </div>
                </div>

                {/* Dot nav + arrows */}
                <div className="flex items-center gap-4 pt-8">
                  <button
                    onClick={() => cardSwapRef.current ? cardSwapRef.current.prev() : animateToProject((activeIndex - 1 + codeProjects.length) % codeProjects.length)}
                    className="p-2 rounded-full border border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  <div className="flex gap-2">
                    {codeProjects.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => cardSwapRef.current ? cardSwapRef.current.goTo(i) : animateToProject(i)}
                        className={`rounded-full transition-all duration-300 ${
                          i === activeIndex
                            ? 'w-8 h-2.5 bg-cyan-500'
                            : 'w-2.5 h-2.5 bg-zinc-700 hover:bg-zinc-500'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => cardSwapRef.current ? cardSwapRef.current.next() : animateToProject((activeIndex + 1) % codeProjects.length)}
                    className="p-2 rounded-full border border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white transition-all"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* RIGHT — CardSwap stack */}
              {/* overflow-hidden on mobile clips the drop animation so it doesn't bleed into sections below */}
              <div className="relative h-[260px] lg:h-[480px] w-full overflow-hidden lg:overflow-visible">
                <CardSwap
                  ref={cardSwapRef}
                  width={400}
                  height={260}
                  cardDistance={50}
                  verticalDistance={55}
                  delay={4000}
                  pauseOnHover={true}
                  skewAmount={5}
                  easing="elastic"
                  containerClassName="absolute bottom-0 perspective-[900px] overflow-visible scale-[0.62] origin-bottom right-1/2 translate-x-1/2 -translate-y-2 lg:scale-100 lg:origin-bottom-right lg:right-0 lg:translate-x-0 lg:-translate-y-20"
                  onSwap={(newFrontIdx) => animateToProject(newFrontIdx)}
                  onCardClick={(idx) => cardSwapRef.current?.goTo(idx % codeProjects.length)}
                >
                  {codeProjects.map((project, i) => (
                    <Card
                      key={project.id}
                      customClass="overflow-hidden border-zinc-700/60 shadow-2xl shadow-black/60 cursor-pointer"
                    >
                      <OptimizedImage
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        loading={i === 0 ? 'eager' : 'lazy'}
                      />
                      {/* Overlay label */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-zinc-950/90 to-transparent pt-10 pb-4 px-4">
                        <p className="text-white font-bold text-sm truncate">{project.title}</p>
                      </div>
                    </Card>
                  ))}
                </CardSwap>
              </div>
            </div>
          </div>

          {/* ── OTHER CREATIVE PROJECTS ── */}
          <div className="text-center">
            <button 
              onClick={() => setShowOtherProjects(!showOtherProjects)}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-zinc-900 border border-zinc-800 text-white font-bold hover:bg-zinc-800 hover:border-zinc-700 transition-all duration-300"
            >
              <Palette className="w-5 h-5 text-purple-400" />
              {showOtherProjects ? 'Hide Creative Projects' : 'View Other Creative Projects'}
            </button>
            
            {showOtherProjects && (
              <div className="mt-12 space-y-16 animate-in fade-in slide-in-from-top-4 duration-500 text-left">
                {/* Graphics */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Palette className="w-6 h-6 text-purple-400" /> Graphic Design
                  </h3>
                  <div className="relative w-full h-[500px] md:h-[600px] rounded-[32px] overflow-hidden border border-zinc-800 bg-zinc-950/40">
                    <ImageTrail
                      items={graphicImages.map(img => img.src)}
                    />
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center pointer-events-none z-20">
                      <span className="bg-zinc-900/80 text-zinc-400 text-[10px] md:text-[11px] font-bold uppercase tracking-widest px-4 py-2 rounded-full backdrop-blur-md border border-zinc-700/50 shadow-2xl whitespace-nowrap">
                        Explore trail to reveal graphics
                      </span>
                    </div>
                  </div>
                </div>

                {/* Videos */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Video className="w-6 h-6 text-pink-400" /> Video Production
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {videoProjects.map((project) => (
                      <div 
                        key={project.id} 
                        className="group cursor-pointer bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-cyan-500/50 hover:bg-zinc-800 transition-all duration-300 flex flex-col"
                        onClick={() => {
                          if (project.youtubeId) setActiveVideo(project.youtubeId);
                        }}
                      >
                        <div className="relative aspect-video bg-zinc-800 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/10 to-transparent z-10" />
                          <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
                            <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center text-black shadow-lg shadow-cyan-500/30">
                              <Play className="w-5 h-5 ml-1" fill="currentColor" />
                            </div>
                          </div>
                          <OptimizedImage 
                            src={project.imageUrl} 
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-5 flex flex-col flex-grow">
                          <h4 className="text-lg font-bold text-white mb-2">{project.title}</h4>
                          <p className="text-sm text-zinc-400 mb-4">{project.description}</p>
                          <div className="mt-auto flex items-center text-xs font-semibold text-pink-400">
                            Watch Video <Play className="w-3 h-3 ml-1" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── CERTIFICATES ── */}
          <div className="space-y-10">
            <div className="text-center space-y-3">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Certifications</h2>
              <div className="w-20 h-1 bg-cyan-500 rounded-full mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {certificatesData.map((cert) => (
                <a 
                  key={cert.id} 
                  href={cert.pdfUrl || cert.imageUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group block bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] transition-all duration-300"
                >
                  <div className="relative aspect-[4/3] bg-zinc-950 overflow-hidden p-6 border-b border-zinc-800 flex items-center justify-center">
                   <OptimizedImage 
                      src={cert.imageUrl} 
                      alt={cert.title} 
                      loading="lazy"
                      className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-[1.02] select-none"
                      draggable={false}
                      onContextMenu={(e) => e.preventDefault()}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/50 to-transparent pointer-events-none" />
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors leading-tight">
                      {cert.title}
                    </h3>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-sm text-zinc-400">
                        <Building2 className="w-4 h-4 text-cyan-500/70" />
                        <span>{cert.issuer}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-zinc-400">
                        <Calendar className="w-4 h-4 text-cyan-500/70" />
                        <span>{cert.date}</span>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center text-xs font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform">
                      View Certificate <ExternalLink className="w-3 h-3 ml-1.5" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── PROJECT DETAILS OVERLAY ── */}
      {selectedProject && (
        <div className="fixed inset-0 z-[100] bg-zinc-950 overflow-y-auto animate-in slide-in-from-bottom-12 fade-in duration-500">
          
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="relative min-h-screen max-w-5xl mx-auto px-6 py-12 md:py-24">
            
            <div className="flex items-center gap-3 text-sm text-zinc-400 mb-10">
              <button 
                onClick={() => setSelectedProject(null)}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg hover:text-white hover:border-zinc-600 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Back to Projects
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10">
              <div className="lg:col-span-5 space-y-8">
                <div>
                  <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4 tracking-tight">
                    {selectedProject.title}
                  </h1>
                  <div className="w-16 h-1 bg-cyan-500 rounded-full mb-6" />
                  <p className="text-zinc-400 leading-relaxed text-base md:text-lg">
                    {selectedProject.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 bg-zinc-900/50 border border-zinc-800/80 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                      <Code2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-white">{selectedProject.tags.length}</h4>
                      <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Total Tech</p>
                    </div>
                  </div>
                  <div className="p-5 bg-zinc-900/50 border border-zinc-800/80 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-white">{selectedProject.features?.length || 0}</h4>
                      <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Key Features</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {selectedProject.liveUrl && (
                    <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-8 py-3.5 bg-cyan-500 text-black font-bold rounded-xl hover:bg-cyan-400 hover:scale-105 transition-all text-sm md:text-base cursor-pointer">
                      <ExternalLink className="w-4 h-4" /> Live Demo
                    </a>
                  )}

                  {selectedProject.liveStatus && !selectedProject.liveUrl && (
                    <div className="relative group">
                      <div className="flex items-center gap-2 px-8 py-3.5 bg-zinc-900 text-zinc-500 font-bold rounded-xl border border-zinc-800/80 cursor-not-allowed select-none text-sm md:text-base">
                        <ExternalLink className="w-4 h-4 opacity-50" /> Live Demo
                      </div>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-2 bg-zinc-800 text-white text-xs font-semibold rounded-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-xl border border-zinc-700 flex items-center gap-2 z-50">
                        {selectedProject.liveStatus.includes('Offline') && <span className="w-2 h-2 rounded-full bg-red-500" />}
                        {selectedProject.liveStatus.includes('Desktop') && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                        {selectedProject.liveStatus}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-zinc-800" />
                      </div>
                    </div>
                  )}

                  {selectedProject.githubUrl && (
                    <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-8 py-3.5 bg-zinc-900 text-white font-semibold rounded-xl border border-zinc-800 hover:bg-zinc-800 transition-all text-sm md:text-base shadow-lg shadow-black/20 cursor-pointer">
                      <Github className="w-4 h-4" /> Source Code
                    </a>
                  )}
                </div>

                <div className="pt-8 border-t border-zinc-800/50">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5 flex items-center gap-2">
                    <Code className="w-4 h-4 text-cyan-400" /> Technologies Used
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    {selectedProject.tags.map(tag => (
                      <span key={tag} className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/50" /> {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-8">
                <div className="rounded-[32px] overflow-hidden border border-zinc-800 bg-zinc-900 aspect-[4/3] relative shadow-2xl shadow-black/50">
                  <OptimizedImage 
                    src={selectedProject.imageUrl} 
                    alt={selectedProject.title} 
                    loading="lazy"
                    className="w-full h-full object-cover select-none"
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=='; }}
                  />
                </div>

                {selectedProject.features && selectedProject.features.length > 0 && (
                  <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-[32px] p-8 md:p-10 shadow-2xl shadow-black/30">
                    <h3 className="text-2xl font-bold text-white flex items-center gap-3 mb-8">
                      <Star className="w-6 h-6 text-cyan-400 fill-cyan-400/20" /> Key Features
                    </h3>
                    <ul className="space-y-5">
                      {selectedProject.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-4 text-zinc-300 text-base leading-relaxed">
                          <div className="min-w-8 w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold text-cyan-400 mt-0.5 border border-zinc-700">
                            {idx + 1}
                          </div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── VIDEO LIGHTBOX ── */}
      {activeVideo && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
          <div 
            className="absolute inset-0 bg-zinc-950/90 backdrop-blur-xl cursor-pointer"
            onClick={() => setActiveVideo(null)}
          />
          <button 
            onClick={() => setActiveVideo(null)}
            className="absolute top-4 right-4 md:top-8 md:right-8 text-zinc-400 hover:text-white bg-zinc-900/50 hover:bg-zinc-800 p-3 rounded-full border border-zinc-800 transition-all z-10 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl shadow-cyan-500/10 z-10 border border-zinc-800">
            <iframe 
              width="100%" 
              height="100%" 
              src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0&modestbranding=1`}
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
};

export default Projects;