import React from 'react';
import PillNav from './components/bits/PillNav';
import Hero from './sections/Hero';
import About from './sections/About';
import Projects from './sections/Projects';
import Galaxy from './components/reactbits/Galaxy'; // Adjust this import path to where your Galaxy component is saved

function App() {
  return (
    <main className="relative bg-zinc-950 min-h-screen text-white selection:bg-cyan-500/30 overflow-x-hidden">
      
      {/* --- GALAXY BACKGROUND --- */}
      {/* Using fixed inset-0 to cover the entire viewport and stay behind the content */}
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

      {/* --- MAIN CONTENT WRAPPER --- */}
      {/* Added relative z-10 so all your sections float above the Galaxy */}
      <div className="relative z-10">
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
      </div>
      
    </main>
  );
}

export default App;