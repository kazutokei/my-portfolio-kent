import React, { useState, useMemo } from 'react';
import { ExternalLink, ArrowRight, Code, Palette, Video, Award, Layers } from 'lucide-react';
import DomeGallery from '../components/bits/DomeGallery'; 

type ProjectType = 'code' | 'graphic' | 'video';
type MainCategory = 'projects' | 'certificates' | 'tech_stack';

interface Project {
  id: number | string;
  type: ProjectType;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  link?: string;
}

// Graphic filenames
const graphicFiles = [
  "all-saints-day", "all-souls-day", "btd_3-days", "btd_collabs", "btd_d-day",
  "ovp-25", "ovp_fb-cover-25",
  "btd_happening-now", "btd_primer", "btd_speaker-host", "human-rights-day",
  "ilead_dp-blast", "ilead_event-primer", "ilead_venue-map", "last-call",
  "ovp-24", "ovp-change", "paugnat_bball", "paugnat_bench", "paugnat_botb",
  "paugnat_botb-front-act", "paugnat_botb-judge", "paugnat_codm", "paugnat_dota2",
  "paugnat_drag", "paugnat_eeyan", "paugnat_esports", "paugnat_euhue",
  "paugnat_kejo-graphix", "paugnat_lourain", "paugnat_media-partners", "paugnat_ml",
  "paugnat_mr", "paugnat_mr-and-ms_gold", "paugnat_mr-and-ms_hn", "paugnat_ms",
  "paugnat_open-mic", "paugnat_panel", "paugnat_phys-sports", "paugnat_pre-teaser",
  "paugnat_safety", "paugnat_singing", "paugnat_tally", "paugnat_tally2",
  "paugnat_teaser", "paugnat_tekken", "paugnat_top5", "paugnat_top5-2",
  "paugnat_valo", "rizal-day", "volunteers-open", "will-you-answer",
  "world-kindness-day", "world-teachers-day", "wow_building-mindsets",
  "wow_campus-jam", "wow_campus-tour", "wow_college-gen", "wow_drag",
  "wow_faith", "wow_freshmen-got", "wow_grand-opening", "wow_journey-card",
  "wow_lakip-and-arcu", "wow_list-of-events", "wow_merchants-map", "wow_orgs-booth",
  "wow_pride-and-spirit", "wow_primer", "wow_speaker", "wow_usg-uss",
  "wow_ustp-map", "[HAPPENING NOW] Hello World 2024", "[UPDATES TEMPLATE] CS3",
  "cbl-cs3", "cs3_cover-photo", "cstem-reveal", "cstem-teaser", "elecom-memo",
  "last-day", "techtalk-happeningnow", "techtalk-speaker", "under-the-cs_primer",
  "voter-turnout"
];

const formatTitle = (filename: string) => {
  return filename
    .replace(/[-_]/g, ' ')
    .replace(/\[|\]/g, '')
    .replace(/\b\w/g, l => l.toUpperCase());
};

// Map graphic files to Project interface
const graphicProjects: Project[] = graphicFiles.map((file, index) => ({
  id: `graphic-${index}`,
  type: 'graphic',
  title: formatTitle(file),
  description: 'Publicity material and brand identity design.',
  imageUrl: `/${encodeURIComponent(file)}.webp`,
  tags: ['Graphic Design', 'Photoshop'],
  link: '#'
}));

// Static code and video projects
const codeAndVideoProjects: Project[] = [
  {
    id: 1,
    type: 'code',
    title: 'iREQUEST: Online Credential Request System',
    description: 'Developed to assist the Office of the University Registrar at USTP CDO, iREQUEST is a web-based platform designed to transition student credential and document requests from a manual, paper-based process to a streamlined digital system.',
    imageUrl: '/irequest.webp',
    tags: ['JavaScript', 'React', 'Vite', 'Tailwind CSS', 'Python', 'Django'],
    link: '#'
  },
  {
    id: 2,
    type: 'code',
    title: 'LocatR: Student Record Locator System',
    description: 'Designed to transition the USTP CDO Registrar from manual to digital record keeping. Piloted with the CS3B section, it addresses process limitations to improve accuracy, efficiency, and user satisfaction.',
    imageUrl: '/locatr.webp',
    tags: ['Python', 'CustomTkinter', 'SQLite', 'TeX'],
    link: '#'
  },
  {
    id: 3,
    type: 'code',
    title: 'Gift Exchange App',
    description: 'Developed to overcome time and distance constraints among friends, this platform automates holiday gift exchanges with randomized matching, allowing seamless celebrations from anywhere.',
    imageUrl: '/gift-exchange.webp',
    tags: ['JavaScript', 'React', 'HTML', 'CSS'],
    link: '#'
  },
  {
    id: 4,
    type: 'code',
    title: 'AListō',
    description: 'A modern and intuitive to-do list web application designed to help users efficiently organize their tasks, track progress, and boost daily productivity.',
    imageUrl: '/alisto.webp',
    tags: ['TypeScript', 'Tailwind CSS', 'PostgreSQL'],
    link: '#'
  },
  {
    id: 5, 
    type: 'code',
    title: 'Personal Portfolio Website',
    description: 'A modern, high-performance portfolio website built to showcase my career and technical skills. Features smooth animations, a responsive layout, and interactive components.',
    imageUrl: '/portfolio.webp',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'GSAP'],
    link: '#' 
  },
  {
    id: 6,
    type: 'video',
    title: 'Cinematic Travel Vlog',
    description: 'A short-form cinematic travel video showcasing color grading and sound design skills.',
    imageUrl: '/video1.webp',
    tags: ['Premiere Pro', 'After Effects'],
    link: '#'
  }
];

const projectsData: Project[] = [...codeAndVideoProjects, ...graphicProjects];

const Projects = () => {
  const [activeMainTab, setActiveMainTab] = useState<MainCategory>('projects');
  const [activeSubTab, setActiveSubTab] = useState<ProjectType>('code');

  const filteredProjects = projectsData.filter(project => project.type === activeSubTab);

  const graphicImages = useMemo(() => {
    const graphics = projectsData.filter(p => p.type === 'graphic');
    return graphics.map(p => ({ src: p.imageUrl, alt: p.title }));
  }, []);

  return (
    <section id="projects" className="relative min-h-screen bg-transparent px-6 pt-24 pb-20">
      <div className="max-w-5xl mx-auto">
        
        <div className="text-center mb-10 space-y-3 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Portfolio Showcase</h2>
          <div className="w-20 h-1 bg-cyan-500 rounded-full mx-auto" />
          <p className="text-zinc-400 max-w-2xl mx-auto text-base leading-relaxed pt-2">
            Explore my journey through projects, certifications, and technical expertise. 
            Each milestone reflects my growth as a developer and multimedia artist.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          <button 
            onClick={() => setActiveMainTab('projects')}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all duration-300 font-bold text-sm md:text-base ${
              activeMainTab === 'projects' 
                ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-105' 
                : 'bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800'
            }`}
          >
            <Code className="w-4 h-4" /> Projects
          </button>
          <button 
            onClick={() => setActiveMainTab('certificates')}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all duration-300 font-bold text-sm md:text-base ${
              activeMainTab === 'certificates' 
                ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-105' 
                : 'bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800'
            }`}
          >
            <Award className="w-4 h-4" /> Certificates
          </button>
          <button 
            onClick={() => setActiveMainTab('tech_stack')}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all duration-300 font-bold text-sm md:text-base ${
              activeMainTab === 'tech_stack' 
                ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-105' 
                : 'bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800'
            }`}
          >
            <Layers className="w-4 h-4" /> Tech Stack
          </button>
        </div>

        {activeMainTab === 'projects' && (
          <div className="flex justify-center gap-3 mb-12 animate-in fade-in zoom-in duration-500 delay-300">
            <button 
              onClick={() => setActiveSubTab('code')}
              className={`px-5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeSubTab === 'code' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300 border border-zinc-800'
              }`}
            >
              <Code className="w-3 h-3" /> Code
            </button>
            <button 
              onClick={() => setActiveSubTab('graphic')}
              className={`px-5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeSubTab === 'graphic' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300 border border-zinc-800'
              }`}
            >
              <Palette className="w-3 h-3" /> Graphic
            </button>
            <button 
              onClick={() => setActiveSubTab('video')}
              className={`px-5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeSubTab === 'video' ? 'bg-pink-500/20 text-pink-400 border border-pink-500/50' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300 border border-zinc-800'
              }`}
            >
              <Video className="w-3 h-3" /> Video
            </button>
          </div>
        )}

        <div className="min-h-[400px]">
          
          {activeMainTab === 'projects' && (
            <>
              {activeSubTab === 'graphic' ? (
                <div className="relative w-full h-[500px] md:h-[600px] rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950/40 animate-in fade-in zoom-in duration-700">
                  {/* 
                    FIX: Removed openedImageWidth / openedImageHeight overrides so the
                    DomeGallery can compute the correct size from the image's natural
                    aspect ratio. The frame is now w-full h-full (no aspect-square),
                    so portrait, landscape, and square pubmats all display correctly.
                  */}
                  <DomeGallery
                    images={graphicImages.length > 0 ? graphicImages : undefined}
                    fit={0.8}
                    minRadius={600}
                    maxVerticalRotationDeg={15}
                    segments={34}
                    dragDampening={2}
                    grayscale={false}
                    overlayBlurColor="transparent"
                    imageBorderRadius="16px"
                    openedImageBorderRadius="16px"
                  />
                  <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none z-10">
                    <span className="bg-zinc-900/80 text-zinc-400 text-xs px-3 py-1.5 rounded-full backdrop-blur-sm border border-zinc-800">
                      Drag to rotate • Click to view
                    </span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                  {filteredProjects.map((project) => (
                    <div key={project.id} className="group cursor-pointer bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-cyan-500/50 hover:bg-zinc-800 transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)] flex flex-col h-full">
                      
                      <div className="relative h-32 bg-zinc-800 overflow-hidden group-hover:opacity-90 transition-opacity">
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent z-10" />
                        <div className="w-full h-full flex items-center justify-center text-zinc-600 font-mono text-xs">
                          [Image: {project.title}]
                        </div>
                      </div>

                      <div className="p-4 flex flex-col flex-grow">
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {project.tags.map(tag => (
                            <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <h3 className="text-base font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors line-clamp-1">{project.title}</h3>
                        
                        <p className="text-zinc-400 text-xs leading-relaxed mb-4 line-clamp-2">
                          {project.description}
                        </p>
                        
                        <div className="mt-auto flex items-center justify-between pt-3 border-t border-zinc-800">
                          <a href={project.link} className="flex items-center gap-2 text-xs font-semibold text-white hover:text-cyan-400 transition-colors">
                            <ExternalLink className="w-3 h-3" /> View Project
                          </a>
                          <button className="flex items-center gap-1 text-[10px] font-medium text-zinc-500 group-hover:translate-x-1 transition-transform">
                            Details <ArrowRight className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {(activeMainTab === 'certificates' || activeMainTab === 'tech_stack') && (
            <div className="text-center py-20 animate-in fade-in zoom-in duration-500">
              {activeMainTab === 'certificates' ? <Award className="w-12 h-12 text-zinc-700 mx-auto mb-4" /> : <Layers className="w-12 h-12 text-zinc-700 mx-auto mb-4" />}
              <h3 className="text-xl font-bold text-white mb-2">{activeMainTab === 'certificates' ? 'Certifications' : 'Tech Stack'} Coming Soon</h3>
              <p className="text-zinc-500 text-sm">This section is currently under development.</p>
            </div>
          )}
          
        </div>
      </div>
    </section>
  );
};

export default Projects;
