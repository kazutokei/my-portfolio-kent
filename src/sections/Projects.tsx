import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  ExternalLink, ArrowRight, Code, Palette, Video, Award, Layers, 
  ChevronLeft, Github, Star, Code2, Play, X, Calendar, Building2,
  MonitorSmartphone, Database, Clapperboard, Wrench, Triangle, Feather
} from 'lucide-react';
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
  features?: string[];
  githubUrl?: string;
  liveUrl?: string;
  youtubeId?: string; 
}

interface Certificate {
  id: number;
  title: string;
  issuer: string;
  date: string;
  imageUrl: string;
  pdfUrl?: string; 
}

// Array of graphic design asset filenames
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
  "voter-turnout",
  "ugmad_main-poster", "ugmad_teaser", "ovp-change-branding", "vrkan_what-to-wear",
  "wow_timeline", "wow_cd", "unyon_cover-photo", "scitc-is-giving", "lycanfest_cd3",
  "valo_agent-pick"
];

const formatTitle = (filename: string) => {
  return filename
    .replace(/[-_]/g, ' ')
    .replace(/\[|\]/g, '')
    .replace(/\b\w/g, l => l.toUpperCase());
};

const graphicProjects: Project[] = graphicFiles.map((file, index) => ({
  id: `graphic-${index}`,
  type: 'graphic',
  title: formatTitle(file),
  description: 'Publicity material and brand identity design.',
  imageUrl: `/${encodeURIComponent(file)}.webp`,
  tags: ['Graphic Design', 'Photoshop'],
  link: '#'
}));

// Project data definitions (Code and Video)
const codeAndVideoProjects: Project[] = [
  {
    id: 1,
    type: 'code',
    title: 'iREQUEST: Online Credential Request System',
    description: 'Developed to assist the Office of the University Registrar at USTP CDO, iREQUEST transitions student credential and document requests from a manual process to a streamlined digital system.',
    imageUrl: '/irequest_thumbnail.webp',
    tags: ['React', 'Vite', 'Tailwind CSS', 'Django', 'PostgreSQL', 'Vercel', 'Render'],
    features: [
      'Secure JWT Authentication & Role-based Access',
      'End-to-End Document Request & Clearance Workflow',
      'Admin Dashboard for Payment & File Verification',
      'Real-time Request Status Tracking & Analytics'
    ],
    githubUrl: 'https://github.com/pendonj14/iRequest.git',
    liveUrl: 'https://irequest-nu.vercel.app/',
  },
  {
    id: 2,
    type: 'code',
    title: 'LocatR: Student Record Locator System',
    description: 'Requested by the Office of the University Registrar at USTP CDO, LocatR is a desktop application designed to manage student records, including their ID, name, program, and location.',
    imageUrl: '/locatr_thumbnail.webp',
    tags: ['Python', 'CustomTkinter', 'SQLite', 'QRCode'],
    features: [
      'Academic Dashboard for quick record navigation',
      'Automated QR Code generation for student records',
      'Dynamic search & strict 10-digit ID input validation',
      'Fast local SQLite database queries with DPI Awareness'
    ],
    githubUrl: 'https://github.com/wency01x/StudentRecordLocatorSystem.git',
  },
  {
    id: 3,
    type: 'code',
    title: 'Gift Exchange App',
    description: 'Developed to overcome time and distance constraints among friends, this platform automates holiday gift exchanges with randomized matching, allowing seamless celebrations from anywhere.',
    imageUrl: '/gift-exchange_thumbnail.webp',
    tags: ['JavaScript', 'React', 'HTML', 'CSS', 'Supabase', 'Vercel'],
    features: ['Randomized pairing algorithm', 'Anonymous wishlists', 'Mobile-responsive UI'],
    githubUrl: 'https://github.com/kazutokei/christmas-party.git',
  },
  {
    id: 4,
    type: 'code',
    title: 'AListō: To-Do List App',
    description: 'A modern and intuitive to-do list web application designed to help users efficiently organize their tasks, track progress, and boost daily productivity.',
    imageUrl: '/alisto_thumbnail.webp',
    tags: ['TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Vercel'],
    features: ['Google OAuth & Secure Account Registration', 'Smart Task Filtering (Today, Upcoming, Important)', 'Custom Project Categories & Location Tags'],
    githubUrl: 'https://github.com/B1ns0y/Alisto-main.git',
    liveUrl: 'https://alisto-main.vercel.app',
  },
  {
    id: 5, 
    type: 'code',
    title: 'Personal Portfolio Website',
    description: 'A modern, high-performance portfolio website built to showcase my career and technical skills. Features smooth animations, a responsive layout, and interactive components.',
    imageUrl: '/pf_thumbnail.webp', 
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'GSAP'],
    features: ['Custom 3D WebGL Dome Gallery', 'Scroll-triggered GSAP animations', 'Responsive Bento Grid layout', 'Performance optimized WebP assets'],
    githubUrl: '#',
    liveUrl: '#',
  },
  {
    id: 6,
    type: 'video',
    title: 'Procedures for Disciplinary Actions in Cheating',
    description: 'An informative educational video detailing the procedures and disciplinary actions regarding academic dishonesty.',
    imageUrl: '/section5_thumbnail.webp',
    tags: ['CapCut', 'Video Editing'],
    youtubeId: 'VFzxXJYlf3k'
  },
  {
    id: 7,
    type: 'video',
    title: 'Dialogue as a Way of Life',
    description: 'A cinematic piece exploring the philosophy and practice of dialogue in everyday life.',
    imageUrl: '/dialogue_thumbnail.webp',
    tags: ['Cinematography', 'Premiere Pro', 'Color Grading'],
    youtubeId: 'ynf1EWwnFRY'
  }
];

// Certification data definitions
const certificatesData: Certificate[] = [
  {
    id: 1,
    title: 'Programming for Intermediate Users Using Python',
    issuer: 'Department of Information and Communications Technology',
    date: 'July 18, 2024',
    imageUrl: '/cert_python-intermediate.webp',
  },
  {
    id: 2,
    title: 'SQL (Basic)',
    issuer: 'HackerRank',
    date: '02 Apr, 2026',
    imageUrl: '/sql_basic-certificate.webp',
  }
];

// Technology stack categorizations
const techStackData = [
  {
    title: 'Frontend Development',
    description: 'Building responsive, interactive, and animated user interfaces.',
    icon: MonitorSmartphone,
    items: [
      { name: 'React', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg' },
      { name: 'TypeScript', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg' },
      { name: 'JavaScript', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg' },
      { name: 'Tailwind CSS', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg' },
      { name: 'Vite', iconUrl: '/vite.svg' }, 
      { name: 'HTML5', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg' },
      { name: 'CSS3', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg' }
    ]
  },
  {
    title: 'Backend & Database',
    description: 'Developing server-side logic, APIs, and managing data structures.',
    icon: Database,
    items: [
      { name: 'Python', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg' },
      { name: 'Java', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg' },
      { name: 'C++', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg' },
      { name: 'Django', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/django/django-plain.svg' },
      { name: 'PostgreSQL', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg' },
      { name: 'Supabase', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg' },
      { name: 'SQLite', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sqlite/sqlite-original.svg' }
    ]
  },
  {
    title: 'Multimedia & Design',
    description: 'Crafting brand identities, layout designs, and cinematic videos.',
    icon: Clapperboard,
    items: [
      { name: 'Figma', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg' },
      { name: 'Canva', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/canva/canva-original.svg' },
      { name: 'Photoshop', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/photoshop/photoshop-original.svg' },
      { name: 'Premiere Pro', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/premierepro/premierepro-original.svg' },
      { name: 'DaVinci Resolve', iconUrl: '/davinci.svg' }, 
      { name: 'CapCut', iconUrl: '/capcut.svg' } 
    ]
  },
  {
    title: 'Tools & Utilities',
    description: 'Version control, UI frameworks, and workflow optimization.',
    icon: Wrench,
    items: [
      { name: 'Git', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg' },
      { name: 'GitHub', iconUrl: '/github.svg' },
      { name: 'Vercel', LucideIcon: Triangle },
      { name: 'Tkinter', LucideIcon: Feather }, 
      { name: 'CustomTkinter', iconUrl: '/custom-tkinter.svg' },
      { name: 'LaTeX', iconUrl: '/latex.svg' },
      { name: 'Framer Motion', iconUrl: '/framer-motion.svg' },
      { name: 'GSAP', iconUrl: '/gsap.svg' }
    ]
  }
];

const projectsData: Project[] = [...codeAndVideoProjects, ...graphicProjects];

// MagicTechCard: Interactive bento card for tech stack categories
const MagicTechCard = ({ category }: { category: typeof techStackData[0] }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full bg-zinc-900 border border-zinc-800 rounded-[32px] p-6 md:p-8 overflow-hidden group transition-all duration-500"
    >
      {/* Dynamic spotlight hover effect */}
      <div
        className="pointer-events-none absolute -inset-px rounded-[32px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(34, 211, 238, 0.1), transparent 40%)`,
        }}
      />
      
      {/* Card content wrapper */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-zinc-950/50 border border-zinc-800/50 backdrop-blur-sm flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:text-cyan-300 transition-all duration-500 shadow-lg shadow-black/20">
            <category.icon className="w-5 h-5" />
          </div>
          {/* Category title with hover gradient */}
          <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-cyan-200 transition-all duration-500">
            {category.title}
          </h3>
        </div>
        <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
          {category.description}
        </p>

        {/* Technology item pills */}
        <div className="flex flex-wrap gap-3">
          {category.items.map((tech, i) => (
            <div 
              key={i} 
              className="relative flex items-center gap-2.5 px-4 py-2 bg-zinc-950/40 backdrop-blur-md border border-zinc-800/60 rounded-xl hover:border-cyan-500/30 hover:bg-zinc-900 transition-all duration-300 cursor-default tech-group hover:-translate-y-1 hover:shadow-[0_8px_16px_-6px_rgba(34,211,238,0.15)]"
            >
              {/* Icon rendering with local SVG or Lucide fallback */}
              {tech.iconUrl ? (
                <img src={tech.iconUrl} alt={tech.name} className="w-4 h-4 tech-group-hover:scale-110 transition-transform duration-300 drop-shadow-sm" />
              ) : tech.LucideIcon ? (
                <tech.LucideIcon className="w-4 h-4 text-zinc-400 tech-group-hover:text-cyan-400 transition-colors duration-300" />
              ) : null}
              <span className="text-sm font-semibold text-zinc-300 tech-group-hover:text-white transition-colors duration-300 tracking-wide">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


const Projects = () => {
  const [activeMainTab, setActiveMainTab] = useState<MainCategory>('projects');
  const [activeSubTab, setActiveSubTab] = useState<ProjectType>('code');
  
  // State for fullscreen project details overlay
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  // Lock body scroll when modals or overlays are active
  useEffect(() => {
    if (activeVideo || selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [activeVideo, selectedProject]);

  const filteredProjects = projectsData.filter(project => project.type === activeSubTab);

  const graphicImages = useMemo(() => {
    const graphics = projectsData.filter(p => p.type === 'graphic');
    return graphics.map(p => ({ src: p.imageUrl, alt: p.title }));
  }, []);

  return (
    <>
      <section id="projects" className="relative min-h-screen bg-transparent px-6 pt-24 pb-20">
        <div className="max-w-5xl mx-auto">
          
          {/* Main Grid Overview: Rendered underneath overlays to preserve scroll position */}
          <div className="animate-in fade-in duration-500">
            <div className="text-center mb-10 space-y-3">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Portfolio Showcase</h2>
              <div className="w-20 h-1 bg-cyan-500 rounded-full mx-auto" />
              <p className="text-zinc-400 max-w-2xl mx-auto text-base leading-relaxed pt-2">
                Explore my journey through projects, certifications, and technical expertise. 
                Each milestone reflects my growth as a developer and multimedia artist.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <button onClick={() => setActiveMainTab('projects')} className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all duration-300 font-bold text-sm md:text-base ${activeMainTab === 'projects' ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-105' : 'bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800'}`}><Code className="w-4 h-4" /> Projects</button>
              <button onClick={() => setActiveMainTab('certificates')} className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all duration-300 font-bold text-sm md:text-base ${activeMainTab === 'certificates' ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-105' : 'bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800'}`}><Award className="w-4 h-4" /> Certificates</button>
              <button onClick={() => setActiveMainTab('tech_stack')} className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all duration-300 font-bold text-sm md:text-base ${activeMainTab === 'tech_stack' ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-105' : 'bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800'}`}><Layers className="w-4 h-4" /> Tech Stack</button>
            </div>

            <div className="min-h-[400px]">
              
              {/* Projects Tab Content */}
              {activeMainTab === 'projects' && (
                <>
                  <div className="flex justify-center gap-3 mb-12">
                    <button onClick={() => setActiveSubTab('code')} className={`px-5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 flex items-center gap-2 ${activeSubTab === 'code' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300 border border-zinc-800'}`}><Code className="w-3 h-3" /> Code</button>
                    <button onClick={() => setActiveSubTab('graphic')} className={`px-5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 flex items-center gap-2 ${activeSubTab === 'graphic' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300 border border-zinc-800'}`}><Palette className="w-3 h-3" /> Graphic</button>
                    <button onClick={() => setActiveSubTab('video')} className={`px-5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 flex items-center gap-2 ${activeSubTab === 'video' ? 'bg-pink-500/20 text-pink-400 border border-pink-500/50' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300 border border-zinc-800'}`}><Video className="w-3 h-3" /> Video</button>
                  </div>

                  {activeSubTab === 'graphic' ? (
                    <div className="relative w-full h-[500px] md:h-[600px] rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950/40">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredProjects.map((project) => (
                        <div 
                          key={project.id} 
                          className="group cursor-pointer bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-cyan-500/50 hover:bg-zinc-800 transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)] flex flex-col h-full"
                          onClick={() => {
                            if (project.type === 'video' && project.youtubeId) {
                              setActiveVideo(project.youtubeId);
                            } else if (project.type === 'code') {
                              setSelectedProject(project);
                            }
                          }}
                        >
                          <div className="relative aspect-video bg-zinc-800 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/10 to-transparent z-10" />
                            {project.type === 'video' && (
                              <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
                                <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center text-black shadow-lg shadow-cyan-500/30">
                                  <Play className="w-5 h-5 ml-1" fill="currentColor" />
                                </div>
                              </div>
                            )}
                            <img 
                              src={project.imageUrl} 
                              alt={project.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 select-none"
                              draggable={false}
                              onContextMenu={(e) => e.preventDefault()}
                              onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=='; }}
                            />
                          </div>

                          <div className="p-4 flex flex-col flex-grow">
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              {/* Limit displayed tags to 4 for card preview */}
                              {project.tags.slice(0, 4).map(tag => (
                                <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                                  {tag}
                                </span>
                              ))}
                              {project.tags.length > 4 && (
                                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                                  +{project.tags.length - 4}
                                </span>
                              )}
                            </div>
                            
                            <h3 className="text-base font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors line-clamp-1">{project.title}</h3>
                            
                            <p className="text-zinc-400 text-xs leading-relaxed mb-4 line-clamp-2">
                              {project.description}
                            </p>
                            
                            <div className="mt-auto flex items-center justify-between pt-3 border-t border-zinc-800">
                              {project.type !== 'video' && (
                                <div className="flex items-center gap-2 text-xs font-semibold text-white hover:text-cyan-400 transition-colors">
                                  <ExternalLink className="w-3 h-3" /> View Project
                                </div>
                              )}
                              
                              <div className="ml-auto">
                                {project.type === 'video' ? (
                                  <span className="flex items-center gap-1 text-[10px] font-medium text-cyan-400 group-hover:translate-x-1 transition-all">
                                    Watch Video <Play className="w-2.5 h-2.5" />
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1 text-[10px] font-medium text-zinc-500 hover:text-cyan-400 group-hover:translate-x-1 transition-all">
                                    Details <ArrowRight className="w-2.5 h-2.5" />
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Certificates Tab Content */}
              {activeMainTab === 'certificates' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                  {certificatesData.map((cert) => (
                    <a 
                      key={cert.id} 
                      href={cert.pdfUrl || cert.imageUrl}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group block bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] transition-all duration-300"
                    >
                      <div className="relative aspect-[4/3] bg-zinc-950 overflow-hidden p-6 border-b border-zinc-800 flex items-center justify-center">
                        <img 
                          src={cert.imageUrl} 
                          alt={cert.title} 
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
              )}

              {/* Tech Stack Tab Content */}
              {activeMainTab === 'tech_stack' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                  {techStackData.map((category, idx) => (
                    <MagicTechCard key={idx} category={category} />
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* Project Details Overlay */}
      {selectedProject && (
        <div className="fixed inset-0 z-[100] bg-zinc-950 overflow-y-auto animate-in slide-in-from-bottom-12 fade-in duration-500">
          
          {/* Ambient background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="relative min-h-screen max-w-5xl mx-auto px-6 py-12 md:py-24">
            
            <div className="flex items-center gap-3 text-sm text-zinc-400 mb-10">
              <button 
                onClick={() => setSelectedProject(null)}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg hover:text-white hover:border-zinc-600 transition-colors"
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
                    <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-8 py-3.5 bg-cyan-500 text-black font-bold rounded-xl hover:bg-cyan-400 hover:scale-105 transition-all text-sm md:text-base">
                      <ExternalLink className="w-4 h-4" /> Live Demo
                    </a>
                  )}
                  {selectedProject.githubUrl && (
                    <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-8 py-3.5 bg-zinc-900 text-white font-semibold rounded-xl border border-zinc-800 hover:bg-zinc-800 transition-all text-sm md:text-base shadow-lg shadow-black/20">
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
                      <span key={tag} className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm font-medium shadow-sm shadow-black/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/50" /> {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-8">
                <div className="rounded-[32px] overflow-hidden border border-zinc-800 bg-zinc-900 aspect-[4/3] relative shadow-2xl shadow-black/50">
                  <img 
                    src={selectedProject.imageUrl} 
                    alt={selectedProject.title} 
                    className="w-full h-full object-cover select-none"
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                    onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=='; }}
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

      {/* Video Lightbox Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
          <div 
            className="absolute inset-0 bg-zinc-950/90 backdrop-blur-xl cursor-pointer"
            onClick={() => setActiveVideo(null)}
          />
          <button 
            onClick={() => setActiveVideo(null)}
            className="absolute top-4 right-4 md:top-8 md:right-8 text-zinc-400 hover:text-white bg-zinc-900/50 hover:bg-zinc-800 p-3 rounded-full border border-zinc-800 transition-all z-10"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl shadow-cyan-500/10 z-10 scale-in-95 duration-300 border border-zinc-800">
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