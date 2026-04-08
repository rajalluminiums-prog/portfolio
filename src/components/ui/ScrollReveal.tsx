import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number; // Kept for API compatibility but not heavily used in scrub
  duration?: number;
  className?: string;
  parallax?: boolean;
}

export default function ScrollReveal({
  children,
  direction = 'up',
  className = '',
  parallax = false,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  // Basic scrub entry (enters as it crosses bottom threshold)
  const { scrollYProgress: entryProgress } = useScroll({
    target: ref,
    offset: ['start 95%', 'start 60%'] // Begins slightly after entering, finishes aggressively fast when top reaches 60% viewport
  });

  // Continuous parallax (scrubs entire time it is in viewport)
  const { scrollYProgress: parallaxProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'] // entire viewport journey
  });

  // Apply premium spring smoothing to the raw scroll values
  // Increased stiffness massively to make sections visually snap to original position faster as requested
  const smoothEntry = useSpring(entryProgress, { stiffness: 300, damping: 30, restDelta: 0.001 });
  const smoothParallax = useSpring(parallaxProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Entry transitions (decreased physical translation distance so it feels faster)
  const yEntry = useTransform(smoothEntry, [0, 1], [direction === 'up' ? 50 : direction === 'down' ? -50 : 0, 0]);
  const xEntry = useTransform(smoothEntry, [0, 1], [direction === 'left' ? 50 : direction === 'right' ? -50 : 0, 0]);
  const opacityEntry = useTransform(smoothEntry, [0, 1], [0, 1]);
  const scaleEntry = useTransform(smoothEntry, [0, 1], [0.97, 1]);
  
  // Parallax transitions
  const yParal = useTransform(smoothParallax, [0, 1], [60, -60]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={parallax ? {
         y: yParal
      } : {
         y: yEntry,
         x: xEntry,
         opacity: opacityEntry,
         scale: scaleEntry
      }}
    >
      {children}
    </motion.div>
  );
}
