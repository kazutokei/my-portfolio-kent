import React from 'react';
import Hero from './sections/Hero';
import About from './sections/About';
import Projects from './sections/Projects';
import Contact from './sections/Contact';
import Particles from './components/bits/Particles';
import GooeyNav from './components/bits/GooeyNav';

function App() {
  // Navigation items: Ensure href matches the id="name" in each section file
  const navItems = [
    { label: "Home", href: "#" },
    { label: "About", href: "#about" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" }, // This links to <section id="contact">
  ];

  return (
    <main className="relative bg-zinc-950 min-h-screen text-white selection:bg-cyan-500/30 overflow-x-hidden">
      
      {/* --- OGL PARTICLES BACKGROUND --- */}
      {/* Set z-0 so it stays behind everything */}
      <div className="fixed inset-0 z-0">
        <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
          <Particles
            particleColors={["#ffffff", "#06b6d4"]} // White and Cyan to match your theme
            particleCount={250}
            particleSpread={12}
            speed={0.1}
            particleBaseSize={80} // Slightly reduced from 100 for a cleaner deep-space look
            moveParticlesOnHover={true}
            particleHoverFactor={1}
            alphaParticles={true}
            disableRotation={false}
            pixelRatio={typeof window !== 'undefined' ? window.devicePixelRatio : 1}
          />
          {/* Subtle gradient overlay to ensure your text and cards remain readable over the bright particles */}
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/20 via-transparent to-zinc-950/20 pointer-events-none" />
        </div>
      </div>

      {/* --- STICKY NAVIGATION BAR --- */}
      {/* z-50 ensures it floats above all content, fixed top-6 keeps it pinned */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-auto animate-in slide-in-from-top-12 duration-1000">
        <div className="bg-zinc-950/60 backdrop-blur-xl border border-zinc-800/60 rounded-full p-2 shadow-2xl shadow-black/50">
          <GooeyNav
            items={navItems}
            particleCount={15}
            particleDistances={[90, 10]}
            particleR={100}
            initialActiveIndex={0}
            animationTime={600}
            timeVariance={300}
            colors={[1, 2, 3, 1, 2, 3, 1, 4]} // These map to the Cyan/Purple variables we set in GooeyNav.tsx
          />
        </div>
      </div>

      {/* --- MAIN CONTENT WRAPPER --- */}
      {/* relative z-10 puts your content on top of the fixed background */}
      <div className="relative z-10">
        <Hero />
        <About />
        <Projects />
        <Contact />
      </div>
      
    </main>
  );
}

export default App;