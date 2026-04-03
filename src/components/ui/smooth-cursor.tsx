import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

// The Official-looking Magic UI Cursor Arrow
const DefaultCursorSVG = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="white"
    stroke="black"
    strokeWidth="1.2"
    strokeLinejoin="round"
    strokeLinecap="round"
    xmlns="http://www.w3.org/2000/svg"
    className="drop-shadow-lg"
  >
    {/* Classic cursor pointer path */}
    <path d="M4 4l7.07 17 2.51-7.39L21 11.07z" />
  </svg>
);

export function SmoothCursor() {
  const [hasMouse, setHasMouse] = useState(true);

  // Raw mouse coordinates
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const rotation = useMotionValue(0); // Tracks the leaning angle

  // Magic UI's default Spring Configuration for that bouncy, fluid feel
  const springConfig = { damping: 45, stiffness: 400, mass: 1 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  
  // A softer spring for the rotation so it doesn't spin wildly
  const rotationSpring = useSpring(rotation, { damping: 30, stiffness: 200, mass: 0.5 });

  useEffect(() => {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) {
      setHasMouse(false);
      return;
    }

    let lastX = -100;
    let lastY = -100;

    const moveCursor = (e: MouseEvent) => {
      // Calculate rotation based on velocity direction
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      
      // Only tilt the cursor if moving fast enough
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        // Subtly lean the cursor into the movement
        rotation.set(angle * 0.15); 
      } else {
        // Return to perfectly upright when stopped
        rotation.set(0);
      }

      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      
      lastX = e.clientX;
      lastY = e.clientY;
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [cursorX, cursorY, rotation]);

  if (!hasMouse) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        rotate: rotationSpring,
        transformOrigin: "top left",
        // Small offset so the absolute tip of the arrow is what actually clicks
        translateX: '-2px',
        translateY: '-2px',
      }}
    >
      <DefaultCursorSVG />
    </motion.div>
  );
}