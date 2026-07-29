import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Start shutter close + unmount sequence at 2.5s
    const t1 = setTimeout(() => {
      setIsClosing(true);
      onComplete(); // Fire early so Hero starts animating under the shutter
    }, 2500);

    return () => clearTimeout(t1);
  }, [onComplete]);

  // Easing curves for cinematic premium feel
  const forgeEase = [0.76, 0, 0.24, 1] as const;
  const flyThroughEase = [0.9, 0, 0.1, 1] as const;

  return (
    <div className="fixed inset-0 z-[10000] pointer-events-none overflow-hidden">
      
      {/* Left Sliding Door (with central interlock frame) */}
      <motion.div 
        className="absolute top-0 left-0 w-1/2 h-full bg-[#FAF9F6] border-r border-[#1A1C1A]/10"
        initial={{ x: 0 }}
        animate={isClosing ? { x: '-100%' } : { x: 0 }}
        transition={{ duration: 1.2, ease: forgeEase }}
      />
      
      {/* Right Sliding Door (with central interlock frame) */}
      <motion.div 
        className="absolute top-0 right-0 w-1/2 h-full bg-[#FAF9F6] border-l border-[#1A1C1A]/10"
        initial={{ x: 0 }}
        animate={isClosing ? { x: '100%' } : { x: 0 }}
        transition={{ duration: 1.2, ease: forgeEase }}
      />

      {/* Central Content Wrapper (Flies towards camera on exit) */}
      <motion.div 
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
        initial={{ scale: 1, opacity: 1 }}
        animate={isClosing ? { scale: 3, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 1.0, ease: flyThroughEase }}
      >
        {/* Glass Sheen Glint (Sweeps diagonally across the 'doors' before they open) */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-transparent skew-x-[30deg] z-10 w-[200%] h-full pointer-events-none"
          initial={{ x: '-150%' }}
          animate={{ x: '150%' }}
          transition={{ duration: 1.4, delay: 1.0, ease: "easeInOut" }}
        />

        {/* The Forge Reveal Logo (Clip Path Wipe) */}
        <motion.div 
          className="relative w-32 h-32 sm:w-40 sm:h-40 mb-8 z-20"
          initial={{ clipPath: 'inset(100% 0 0 0)' }}
          animate={{ clipPath: 'inset(0% 0 0 0)' }}
          transition={{ duration: 1.4, ease: forgeEase, delay: 0.2 }}
        >
          <img src="/logo.png" alt="Raj Aluminiums Logo" className="w-full h-full object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.05)]" />
        </motion.div>

        {/* Mask-Up Typography */}
        <div className="overflow-hidden py-1 z-20">
          <motion.h1 
            className="text-[#1A1C1A] font-heading font-bold text-xl sm:text-2xl tracking-[0.2em] uppercase leading-none"
            initial={{ y: '150%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{ duration: 0.8, ease: forgeEase, delay: 0.6 }}
          >
            Raj Aluminiums
          </motion.h1>
        </div>
        
        <div className="overflow-hidden mt-1 py-1 z-20">
          <motion.p 
            className="text-[#444653] font-bold text-[10px] sm:text-xs tracking-[0.3em] uppercase leading-none"
            initial={{ y: '150%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{ duration: 0.8, ease: forgeEase, delay: 0.7 }}
          >
            & Door House
          </motion.p>
        </div>
      </motion.div>
      
    </div>
  );
}
