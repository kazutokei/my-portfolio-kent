import React from 'react';
import { AnimatedTechStack } from '../components/bits/AnimatedTechStack';

const TechStack = () => {
  return (
    <section id="skills" className="relative bg-transparent px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="text-center space-y-3 mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Tech Stack</h2>
          <div className="w-20 h-1 bg-cyan-500 rounded-full mx-auto" />
        </div>
        
        <AnimatedTechStack />
      </div>
    </section>
  );
};

export default TechStack;
