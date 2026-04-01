import React from 'react';
import Hero from './sections/Hero';
import About from './sections/About';
import Projects from './sections/Projects';
import Galaxy from './components/bits/Galaxy';

function App() {
  return (
    <main className="relative bg-zinc-950 min-h-screen text-white selection:bg-cyan-500/30 overflow-x-hidden">
      
      {/* --- GALAXY BACKGROUND --- */}
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
      <div className="relative z-10">
        <Hero />
        <About />
        <Projects />
      </div>
      
    </main>
  );
}

export default App;