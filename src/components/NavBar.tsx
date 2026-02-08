import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Detect scroll to toggle background styles
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home', active: true },
    { name: 'About', href: '#about', active: false },
    { name: 'Projects', href: '#projects', active: false },
    { name: 'Contact', href: '#contact', active: false },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-zinc-950/80 backdrop-blur-md border-b border-white/5 py-4'
          : 'bg-transparent py-6'
      }`}
    >
      {/* ✅ FIXED: Updated max-width to align with Hero content */}
      <div className="max-w-7xl w-full mx-auto px-6 flex items-center justify-between">
        
        {/* LOGO */}
        <a href="#home" className="text-2xl font-bold tracking-tight text-cyan-400">
          kejo.works
        </a>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`relative text-sm font-medium transition-colors hover:text-cyan-400 ${
                link.active ? 'text-cyan-400' : 'text-zinc-300'
              }`}
            >
              {link.name}
              
              {/* Active Indicator Line */}
              {link.active && (
                <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-cyan-400 rounded-full" />
              )}
            </a>
          ))}
        </div>

        {/* MOBILE MENU PLACEHOLDER */}
        <div className="md:hidden">
          {/* You can add a hamburger icon button here later */}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;