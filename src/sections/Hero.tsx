import React from 'react';
import ProfileCard from '../components/bits/ProfileCard';
import TextType from '../components/bits/TextType';
import Shuffle from '../components/bits/Shuffle';
import GradientText from '../components/bits/GradientText';
import CountUp from '../components/bits/CountUp';
import { ArrowRight, Download, Mail } from 'lucide-react';

const Hero = () => {
  return (
    // Reduced padding: pt-28 pb-12
    <section id="home" className="relative min-h-screen flex items-center justify-center bg-transparent px-6 pt-28 pb-12 overflow-hidden">
      
      {/* Reduced max-width and gap */}
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center z-10">
        
        {/* --- LEFT COLUMN: Text Content --- */}
        {/* Reduced space-y */}
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          
          {/* HEADLINE BLOCK */}
          <div className="flex flex-col items-start gap-1">
            
            {/* LINE 1: "Hi, I am" + "Kent" */}
            <div className="flex flex-row flex-wrap items-baseline gap-x-3">
              <Shuffle
                tag="h1"
                text="Hi, I am"
                className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1]"
                shuffleDirection="right"
                duration={0.35}
                animationMode="evenodd"
                shuffleTimes={1}
                ease="power3.out"
                stagger={0.03}
                threshold={0.1}
                triggerOnce={true}
                triggerOnHover={true}
                respectReducedMotion={true}
                loop={false}
                loopDelay={0}
              />
              
              <GradientText
                colors={['#22d3ee', '#6366f1', '#a855f7', '#22d3ee']}
                animationSpeed={6}
                showBorder={false}
                className="text-4xl md:text-6xl !font-extrabold tracking-tight leading-[1.1] !block !mx-0"
              >
                Kent
              </GradientText>
            </div>

            {/* LINE 2: "John Chavo" */}
            <GradientText
              colors={['#22d3ee', '#6366f1', '#a855f7', '#22d3ee']}
              animationSpeed={6}
              showBorder={false}
              className="text-4xl md:text-6xl !font-extrabold tracking-tight leading-[1.1] !block !mx-0"
            >
              John Chavo
            </GradientText>
          </div>

          {/* Typewriter Effect */}
          <div className="text-lg md:text-xl text-cyan-200/80 font-mono h-[28px] flex items-center pt-1">
            <span className="mr-3 text-cyan-500">{'>'}</span>
            <TextType
              text={[
                "Aspiring Web and Software Developer",
                "Full-Stack Engineer",
                "Graphic Designer",
                "Video Editor",
                "UI/UX Enthusiast"
              ]}
              typingSpeed={80}
              deletingSpeed={40}
              className="text-cyan-400 font-bold"
              cursorCharacter="_"
            />
          </div>

          <p className="text-zinc-400 text-base md:text-lg max-w-xl leading-relaxed">
            Computer Science undergraduate bridging Full-Stack Development and Multimedia Design. 
            Dedicated to delivering high-fidelity user experiences through the integration of technical logic and creativity.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 pt-1">
            <a href="#contact" className="group px-6 py-2.5 bg-cyan-500 text-black font-bold rounded-full flex items-center gap-2 hover:bg-cyan-400 hover:scale-105 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] text-sm md:text-base">
              Get in Touch
              <Mail className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="/resume.pdf" className="px-6 py-2.5 bg-zinc-900 text-white font-semibold rounded-full flex items-center gap-2 hover:bg-zinc-800 border border-zinc-800 transition-all hover:border-zinc-600 text-sm md:text-base">
              Download CV
              <Download className="w-4 h-4" />
            </a>
            <a href="#projects" className="px-6 py-2.5 text-zinc-300 font-semibold rounded-full hover:text-white transition-all flex items-center gap-2 group text-sm md:text-base">
              View My Work
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-zinc-800/50 w-full mt-6">
            <div className="flex flex-col items-center">
              <h4 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center">
                <CountUp from={0} to={2} separator="," direction="up" duration={3} className="count-up-text" />+
              </h4>
              <p className="text-zinc-500 text-xs md:text-sm mt-1 text-center">Years Experience</p>
            </div>
            <div className="flex flex-col items-center">
              <h4 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center">
                <CountUp from={0} to={5} separator="," direction="up" duration={3} className="count-up-text" />+
              </h4>
              <p className="text-zinc-500 text-xs md:text-sm mt-1 text-center">Projects Completed</p>
            </div>
            <div className="flex flex-col items-center">
              <h4 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center">
                <CountUp from={0} to={2} separator="," direction="up" duration={3} className="count-up-text" />+
              </h4>
              <p className="text-zinc-500 text-xs md:text-sm mt-1 text-center">Satisfied Clients</p>
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN: Profile Card --- */}
        <div className="flex justify-center lg:justify-end relative perspective-1000">
          <div className="w-full max-w-[380px] animate-in fade-in zoom-in duration-1000 delay-300">
             <ProfileCard
                name="Kent John J. Chavo"
                title="Aspiring Full-Stack Developer"
                handle="kentjohn03"
                status="Available for Work"
                contactText="Contact Me"
                avatarUrl="/me.webp"
                miniAvatarUrl="/me.webp"
                showUserInfo={true}
                enableTilt={true}
                enableMobileTilt={true}
                onContactClick={() => console.log('Contact clicked')}
                behindGlowEnabled={true} 
                behindGlowColor="rgba(125, 190, 255, 0.67)"
                innerGradient="linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)"
             />
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;