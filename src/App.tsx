import React from 'react';
import Hero from './sections/Hero';
import About from './sections/About';
import Projects from './sections/Projects';
import Contact from './sections/Contact';
import Galaxy from './components/bits/Galaxy';
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
      
      {/* --- GALAXY BACKGROUND --- */}
      {/* Set z-0 so it stays behind everything */}
      <div className="fixed inset-0 z-0 pointer-events-auto">
        <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
          <Galaxy
            starSpeed={0.5}
            density={1}
            hueShift={140}
            speed={1}
            glowIntensity={0.3}
            saturation={0}
            mouseRepulsion={true}
            repulsionStrength={2}
            twinkleIntensity={0.3}
            rotationSpeed={0.1}
            transparent={true}
          />
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