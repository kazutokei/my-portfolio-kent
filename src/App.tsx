import React from 'react';
import PillNav from './components/bits/PillNav';
import Hero from './sections/Hero';
import About from './sections/About';
import Projects from './sections/Projects';

function App() {
  return (
    // Added overflow-x-hidden to prevent horizontal scrollbars during animations
    <main className="bg-zinc-950 min-h-screen text-white selection:bg-cyan-500/30 overflow-x-hidden">
      
      <div className="absolute top-0 left-0 w-full z-50 flex justify-center py-6">
        <PillNav
          logo={
            <>
              kejo.<span className="text-white">works</span>
            </>
          }
          logoAlt="kejo.works logo"
          items={[
            { label: 'Home', href: '#home' },
            { label: 'About', href: '#about' },
            { label: 'Projects', href: '#projects' },
            { label: 'Contact', href: '#contact' }
          ]}
          baseColor="#22d3ee"
          pillColor="#18181b"
          pillTextColor="#a1a1aa"
          hoveredPillTextColor="#000"
          initialLoadAnimation={true}
        />
      </div>

      <Hero />
      <About />
      <Projects />
      
    </main>
  );
}

export default App;