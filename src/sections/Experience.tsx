import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Calendar, MapPin, ChevronRight } from 'lucide-react';

// ==========================================
// EXPERIENCE DATA
// ==========================================

interface ExperienceEntry {
  title: string;
  company: string;
  location?: string;
  date: string;
  type: 'full-time' | 'internship' | 'freelance' | 'contract';
  active: boolean;
  bullets: string[];
}

const experiences: ExperienceEntry[] = [
  {
    title: "Mobile and Web Developer & Quality Assurance Intern",
    company: "CK Children's Publishing and Printing",
    location: "Cagayan de Oro City",
    date: "June 2026 – July 2026",
    type: "internship",
    active: false,
    bullets: [
      "Contributed to the frontend and backend development of educational platforms and organizational web/mobile applications.",
      "Conducted functional, smoke, manual, and cross-platform UI/UX quality assurance testing to identify, document, and report bugs prior to feature releases."
    ]
  },
  {
    title: "Project Manager & Frontend Developer",
    company: "Office of the University Registrar - USTP CDO",
    location: "Cagayan de Oro City",
    date: "2025",
    type: "contract",
    active: false,
    bullets: [
      "Served as project manager for system development initiatives while contributing as a frontend developer to modernize operations."
    ]
  },
  {
    title: "Graphic Designer and Video Editor",
    company: "Independent",
    date: "2023 – Present",
    type: "freelance",
    active: true,
    bullets: [
      "Accepts commissioned projects and freelance work for diverse requirements, managing visual branding and various creative works."
    ]
  }
];

// ==========================================
// TYPE BADGE COMPONENT
// ==========================================

const TypeBadge: React.FC<{ type: ExperienceEntry['type'] }> = ({ type }) => {
  const config = {
    'full-time': { label: 'Full-Time', color: 'cyan', bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20' },
    'internship': { label: 'Internship', color: 'purple', bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
    'freelance': { label: 'Freelance', color: 'emerald', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
    'contract': { label: 'Contract', color: 'amber', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  };

  const c = config[type];

  return (
    <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider ${c.bg} ${c.text} ${c.border} border px-2.5 py-1 rounded-md`}>
      {c.label}
    </span>
  );
};

// ==========================================
// EXPERIENCE CARD
// ==========================================

const ExperienceCard: React.FC<{ entry: ExperienceEntry; index: number }> = ({ entry, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative"
    >
      <div className={`rounded-2xl border transition-all duration-300 group cursor-default ${
        entry.active
          ? 'bg-zinc-900/60 border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.08)]'
          : 'bg-zinc-900/40 border-zinc-800/50 hover:border-cyan-500/20 hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
      }`}>
        <div className="p-5 sm:p-7">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-bold text-white leading-snug group-hover:text-cyan-300 transition-colors duration-300">
                {entry.title}
              </h3>
              <p className="text-sm text-zinc-400 mt-1.5 font-medium">{entry.company}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
              <TypeBadge type={entry.type} />
              {entry.active && (
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2.5 py-1 rounded-md flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  Active
                </span>
              )}
            </div>
          </div>

          {/* Meta Row */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-5">
            <span className="flex items-center gap-1.5 text-xs text-zinc-500">
              <Calendar className="w-3.5 h-3.5" />
              {entry.date}
            </span>
            {entry.location && (
              <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                <MapPin className="w-3.5 h-3.5" />
                {entry.location}
              </span>
            )}
          </div>

          {/* Bullet Points */}
          <ul className="space-y-3">
            {entry.bullets.map((bullet, bIdx) => (
              <li key={bIdx} className="flex gap-3 text-[13px] sm:text-sm text-zinc-300 leading-relaxed">
                <ChevronRight className="w-4 h-4 text-cyan-500/60 flex-shrink-0 mt-0.5" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

// ==========================================
// MAIN EXPERIENCE SECTION
// ==========================================

const Experience: React.FC = () => {
  const titleRef = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { once: true, margin: "-80px" });

  return (
    <section id="experience" className="relative w-full bg-transparent px-6 py-16 md:py-20">
      <div className="max-w-4xl mx-auto flex flex-col items-center">

        {/* TITLE — matches About Me style */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={titleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative inline-block mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">Experience</h2>
          <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-20 h-1.5 bg-cyan-500 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
        </motion.div>

        {/* Experience Cards */}
        <div className="flex flex-col gap-5 sm:gap-6 w-full">
          {experiences.map((entry, idx) => (
            <ExperienceCard key={idx} entry={entry} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
