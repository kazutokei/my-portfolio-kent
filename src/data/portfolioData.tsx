import React from 'react';
import { 
  MonitorSmartphone, Database, Clapperboard, Wrench, Feather, Bot, Brain, FileText, Kanban, Target, Eye, Clock, MessageCircle 
} from 'lucide-react';
import { Vercel } from '@lobehub/icons';


export type ProjectType = 'code' | 'graphic' | 'video';
export type MainCategory = 'projects' | 'certificates' | 'tech_stack';

export interface Project {
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
  liveStatus?: string; 
  youtubeId?: string; 
}

export interface Certificate {
  id: number;
  title: string;
  issuer: string;
  date: string;
  imageUrl: string;
  pdfUrl?: string; 
}

// Helper to format graphic titles from filenames
const formatTitle = (filename: string) => {
  return filename
    .replace(/[-_]/g, ' ')
    .replace(/\[|\]/g, '')
    .replace(/\b\w/g, l => l.toUpperCase());
};

// --- DATA ARRAYS ---

export const graphicFiles = [
  "all-saints-day", "all-souls-day", "btd_3-days", "btd_collabs", "btd_d-day",
  "ovp-25", "ovp_fb-cover-25",
  "btd_happening-now", "btd_primer", "human-rights-day",
  "ilead_dp-blast", "ilead_event-primer", "ilead_venue-map", "last-call",
  "ovp-24", "ovp-change", "paugnat_bball", "paugnat_bench", "paugnat_botb",
  "paugnat_codm", "paugnat_dota2",
  "paugnat_drag", "paugnat_eeyan", "paugnat_esports", "paugnat_euhue",
  "paugnat_kejo-graphix", "paugnat_lourain", "paugnat_ml",
  "paugnat_mr", "paugnat_mr-and-ms_gold", "paugnat_mr-and-ms_hn", "paugnat_ms",
  "paugnat_open-mic", "paugnat_panel", "paugnat_pre-teaser",
  "paugnat_safety", "paugnat_singing",
  "paugnat_teaser", "paugnat_tekken", "paugnat_top5", "paugnat_top5-2",
  "paugnat_valo", "rizal-day", "volunteers-open", "will-you-answer",
  "world-kindness-day",
  "wow_campus-jam", "wow_campus-tour", "wow_drag",
  "wow_journey-card",
  "wow_list-of-events", "wow_merchants-map", "wow_orgs-booth",
  "wow_pride-and-spirit", "wow_primer", "wow_speaker",
  "wow_ustp-map", "[HAPPENING NOW] Hello World 2024",
  "cbl-cs3", "cs3_cover-photo", "cstem-reveal", "cstem-teaser", "elecom-memo",
  "last-day", "techtalk-happeningnow", "techtalk-speaker", "under-the-cs_primer",
  "voter-turnout",
  "ugmad_main-poster", "ugmad_teaser", "ovp-change-branding", "vrkan_what-to-wear",
  "wow_timeline", "wow_cd", "unyon_cover-photo", "scitc-is-giving", "lycanfest_cd3",
  "valo_agent-pick", "usapang-safe_cover", "usapang-safe_main-poster", "usapang-safe_cd"
];

export const codeAndVideoProjects: Project[] = [
  {
    id: 1,
    type: 'code',
    title: 'iREQUEST: Online Credential Request System',
    description: 'A client project developed for the Office of the University Registrar at USTP CDO. It transitions student credential and document requests from a manual process to a streamlined digital system.',
    imageUrl: '/irequest_thumbnail.webp',
    tags: ['React', 'Vite', 'Tailwind CSS', 'Django', 'PostgreSQL', 'Vercel', 'Render'],
    features: [
      'Secure JWT Authentication & Role-based Access',
      'End-to-End Document Request & Clearance Workflow',
      'Admin Dashboard for Payment & File Verification',
      'Real-time Request Status Tracking & Analytics'
    ],
    githubUrl: 'https://github.com/pendonj14/iRequest.git',
    liveStatus: 'Offline (Client Project)',
  },
  {
    id: 2,
    type: 'code',
    title: 'LocatR: Student Record Locator System',
    description: 'A desktop application requested by the Office of the University Registrar at USTP CDO as a client project to efficiently manage student records, including ID, name, program, and location.',
    imageUrl: '/locatr_thumbnail.webp',
    tags: ['Python', 'CustomTkinter', 'SQLite', 'QRCode'],
    features: [
      'Academic Dashboard for quick record navigation',
      'Automated QR Code generation for student records',
      'Dynamic search & strict 10-digit ID input validation',
      'Fast local SQLite database queries with DPI Awareness'
    ],
    githubUrl: 'https://github.com/wency01x/StudentRecordLocatorSystem.git',
    liveStatus: 'Offline (Desktop Client)',
  },
  {
    id: 3,
    type: 'code',
    title: 'Gift Exchange App',
    description: 'Developed to overcome time and distance constraints among friends, this platform automates holiday gift exchanges with randomized matching, allowing seamless celebrations from anywhere.',
    imageUrl: '/gift-exchange_thumbnail.webp',
    tags: ['JavaScript', 'React', 'Tailwind CSS', 'Supabase', 'Vercel'],
    features: ['Randomized pairing algorithm', 'Anonymous wishlists', 'Mobile-responsive UI'],
    githubUrl: 'https://github.com/kazutokei/christmas-party.git',
    liveUrl: 'https://christmas-party-woad.vercel.app',
    liveStatus: 'Live',
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
    liveStatus: 'Offline', 
  },
  {
    id: 5,
    type: 'code',
    title: 'Autonomous Vacuum Cleaner Robot',
    description: 'A senior high school research project featuring an autonomous cleaning robot built with Arduino. Engineered with custom circuitry, dual-sensor obstacle detection, and a high-RPM suction system.',
    imageUrl: '/vacuum_thumbnail.webp', 
    tags: ['Arduino', 'C++', 'Robotics', 'Hardware', 'Circuit Design'],
    features: [
      'Dual-sensor obstacle detection using Ultrasonic (HC-SR04) and IR sensors',
      'High-powered suction system utilizing a 100,000 RPM 3-phase brushless motor',
      'Differential steering and brush control via L298N motor drivers',
      'Custom power distribution with LM2596 buck converters and Li-Po batteries'
    ],
    liveStatus: 'Offline (Academic Project)', 
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

export const certificatesData: Certificate[] = [
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

export const techStackData = [
  {
    title: 'Frontend Development',
    description: 'Building responsive, interactive, and animated user interfaces.',
    icon: MonitorSmartphone,
    items: [
      { name: 'React', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg' },
      { name: 'TypeScript', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg' },
      { name: 'JavaScript', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg' },
      { name: 'Tailwind CSS', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg' },
      { name: 'Vite', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitejs/vitejs-original.svg' }, 
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
      { name: 'Django', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/django/django-plain.svg' },
      { name: 'PostgreSQL', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg' },
      { name: 'Supabase', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg' },
      { name: 'SQLite', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sqlite/sqlite-original.svg' }
    ]
  },
  {
    title: 'Visual Design & Video',
    description: 'Crafting brand identities, layout designs, and cinematic videos.',
    icon: Clapperboard,
    items: [
      { name: 'Figma', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg' },
      { name: 'Canva', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/canva/canva-original.svg' },
      { name: 'Photoshop', iconUrl: '/Adobe_Photoshop_CC_icon.svg.png' },
      { name: 'Premiere Pro', iconUrl: '/Adobe_Premiere_Pro_CC_icon.svg.png' },
      { name: 'DaVinci Resolve', iconUrl: '/DaVinci_Resolve_17_logo.svg.png' }, 
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
      { name: 'Vercel', LucideIcon: (props: { className?: string }) => <Vercel.Avatar size={32} {...props} /> },
      { name: 'Tkinter', LucideIcon: Feather }, 
      { name: 'CustomTkinter', iconUrl: '/custom-tkinter.svg' },
      { name: 'LaTeX', iconUrl: '/latex.svg' },
      { name: 'Framer Motion', iconUrl: '/framer-motion.svg' },
      { name: 'GSAP', iconUrl: '/GSAP_2023.webp' }
    ]
  },
  {
    title: 'AI Tools',
    description: 'Leveraging artificial intelligence for coding, debugging, and productivity.',
    icon: Bot,
    items: [
      { name: 'Gemini', iconUrl: 'https://logo-teka.com/wp-content/uploads/2026/02/gemini-icon-logo.svg' },
      { name: 'Claude', iconUrl: '/claude.svg' }
    ]
  },
  {
    title: 'Soft Skills',
    description: 'Core competencies for effective collaboration, planning, and execution.',
    icon: Brain,
    items: [
      { name: 'Document and Research Writing', LucideIcon: FileText },
      { name: 'Project Management', LucideIcon: Kanban },
      { name: 'Strategic Planning', LucideIcon: Target },
      { name: 'Attention to Detail', LucideIcon: Eye },
      { name: 'Time Management', LucideIcon: Clock },
      { name: 'Effective Communication', LucideIcon: MessageCircle }
    ]
  }
];

// Combine everything into the final projects array
export const projectsData: Project[] = [
  ...codeAndVideoProjects,
  ...graphicFiles.map((file, index) => ({
    id: `graphic-${index}`,
    type: 'graphic' as ProjectType,
    title: formatTitle(file),
    description: 'Publicity material and brand identity design.',
    imageUrl: `/${encodeURIComponent(file)}.webp`,
    tags: ['Graphic Design', 'Photoshop'],
    link: '#'
  }))
];
