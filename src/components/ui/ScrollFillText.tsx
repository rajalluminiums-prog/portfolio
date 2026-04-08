import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ScrollFillTextProps {
  text: string;
  className?: string;
  baseColor?: string;
  fillColor?: string;
}

export default function ScrollFillText({ 
  text, 
  className = "", 
  baseColor = "rgba(196, 197, 213, 0.4)", // Muted transparent #C4C5D5
  fillColor = "#1A1C1A" 
}: ScrollFillTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 40%"] // Starts filling when 80% down the screen, finishes when hitting 40%
  });

  const words = text.split(" ");

  return (
    <div ref={containerRef} className={`flex flex-wrap ${className}`}>
      {words.map((word, i) => {
        // Calculate the threshold for each word to begin glowing
        const start = i / words.length;
        const end = start + (1 / words.length);
        
        // Transform the color of this specific word based on the overall scroll
        const color = useTransform(
          scrollYProgress,
          [Math.max(0, start - 0.1), Math.min(1, end)], // small overlap and bounded by 1
          [baseColor, fillColor]
        );

        return (
          <motion.span 
            key={i} 
            style={{ color }} 
            className="mr-[0.35em] inline-block"
          >
            {word}
          </motion.span>
        );
      })}
    </div>
  );
}
