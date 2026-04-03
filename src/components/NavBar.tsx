import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      // Basic auto-spy logic (optional)
      const sections = ['home', 'about', 'projects', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= 300) {
            setActiveTab(section.charAt(0).toUpperCase() + section.slice(1));
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-6 left-0 w-full z-[100] flex justify-center px-6"
    >
      <div className={`flex items-center gap-1 p-2 rounded-full border transition-all duration-500 ${
        isScrolled 
          ? 'bg-zinc-950/80 backdrop-blur-md border-white/10 shadow-2xl' 
          : 'bg-zinc-900/40 backdrop-blur-sm border-white/5'
      }`}>
        {navLinks.map((link) => {
          const isActive = activeTab === link.name;
          return (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setActiveTab(link.name)}
              className={`relative px-4 py-2 text-sm font-bold transition-all duration-300 rounded-full ${
                isActive ? 'text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {/* This span ensures the text is ALWAYS above the pill background */}
              <span className="relative z-10">{link.name}</span>
              
              {/* This is the MAGIC PILL that moves between links */}
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-white rounded-full z-0"
                  transition={{ type: 'spring', duration: 0.5, bounce: 0.2 }}
                />
              )}
            </a>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default Navbar;