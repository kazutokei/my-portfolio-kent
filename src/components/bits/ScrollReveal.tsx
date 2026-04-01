import React, { useRef } from "react";
import { motion, MotionValue, useScroll, useTransform } from "framer-motion";

interface ScrollRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const flatten = (children: React.ReactNode): React.ReactNode[] => {
  const result: React.ReactNode[] = [];

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      const element = child as React.ReactElement<{ children?: React.ReactNode }>;
      
      if (element.type === React.Fragment) {
        result.push(...flatten(element.props.children));
      } else if (element.props.children) {
        result.push(React.cloneElement(element, {}));
      } else {
        result.push(element);
      }
    } else {
      const parts = String(child).split(/(\s+)/);
      result.push(
        ...parts.map((part, index) => <React.Fragment key={index}>{part}</React.Fragment>)
      );
    }
  });

  return result.flatMap((child) => (Array.isArray(child) ? child : [child]));
};

function OpacityChild({
  children,
  index,
  progress,
  total,
}: {
  children: React.ReactNode;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, [index / total, (index + 1) / total], [0.2, 1]);

  let className = "";
  if (React.isValidElement(children)) {
    className = (Reflect.get(children, "props") as { className?: string })?.className || "";
  }

  return (
    <motion.span style={{ opacity }} className={`${className} h-fit`}>
      {children}
    </motion.span>
  );
}

export default function ScrollReveal({ children, className = "", ...props }: ScrollRevealProps) {
  const flat = flatten(children);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 40%"],
  });

  return (
    <div {...props} ref={containerRef} className={`relative w-full ${className}`}>
      {/* FIX: Added justify-center and text-center here! */}
      <div className="flex h-fit w-full flex-wrap justify-center text-center whitespace-break-spaces">
        {flat.map((child, index) => (
          <OpacityChild
            progress={scrollYProgress}
            index={index}
            total={flat.length}
            key={index}
          >
            {child}
          </OpacityChild>
        ))}
      </div>
    </div>
  );
}