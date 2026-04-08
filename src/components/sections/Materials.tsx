import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { FiLayers, FiMinimize2, FiShield } from 'react-icons/fi';

const MATERIALS = [
  {
    id: 0,
    badge: 'Base Integrity',
    title: 'Premium Aluminium Alloys',
    icon: <FiLayers className="text-[#00288E]" size={16} />,
    color: '#00288E', // More vibrant blue for dark mode
    bgClass: 'from-[#00288E]/30 to-[#00288E]/5 border-[#00288E]/50 shadow-[0_0_40px_rgba(0,40,142,0.2)]',
    desc: 'The structural core of every frame. We strictly utilize hardened 6063-T5 and 6061-T6 architectural grades offering maximum tensile strength with zero rust degradation.',
    specs: [
      { label: 'Wall Thick', value: '1.2 - 2.0 mm' },
      { label: 'Finishes', value: 'Anodized / PVDF' },
      { label: 'Lifespan', value: '25+ Years' },
      { label: 'Standard', value: 'ISI Certified' }
    ]
  },
  {
    id: 1,
    badge: 'Glazing Variant',
    title: 'Toughened & Acoustic Glass',
    icon: <FiMinimize2 className="text-[#C4C5D5]" size={16} />,
    color: '#C4C5D5',
    bgClass: 'from-[#C4C5D5]/30 to-[#C4C5D5]/5 border-[#C4C5D5]/50 shadow-[0_0_40px_rgba(14,165,233,0.2)]',
    desc: 'Thermally tempered units tested to beautifully withstand extreme atmospheric pressure and high-impact conditions.',
    specs: [
      { label: 'Strength', value: '5x > Float' },
      { label: 'Acoustic', value: 'Laminated PVB' },
      { label: 'UV Shield', value: '99% Block' },
      { label: 'Standard', value: 'EN 12150' }
    ]
  },
  {
    id: 2,
    badge: 'Mechanical Load',
    title: 'Marine Grade Hardware',
    icon: <FiShield className="text-[#C4C5D5]" size={16} />,
    color: '#C4C5D5',
    bgClass: 'from-[#C4C5D5]/30 to-[#C4C5D5]/5 border-[#C4C5D5]/50 shadow-[0_0_40px_rgba(196,197,213,0.2)]',
    desc: 'SS 304 structural fittings paired with high-capacity EPDM roller tracking to ensure incredibly smooth long-term operation.',
    specs: [
      { label: 'Material', value: 'SS 304 Grade' },
      { label: 'Rollers', value: '45kg+ Capacity' },
      { label: 'Tracking', value: 'Derlin Embedded' },
      { label: 'Seals', value: 'EPDM Weather' }
    ]
  }
];

export default function Materials() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({ 
    target: containerRef,
    offset: ['start start', 'end end']
  });

  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  // Rotate the wheel from 0 (Dot 0 at top) to 120 (Dot 2 at top)
  const wheelRotation = useTransform(scrollYProgress, [0, 1], [0, 120]);

  // Track discrete index exactly when rotation reaches thresholds
  // Creates a dead-zone where nothing is active so the fade out is extremely smooth
  useMotionValueEvent(wheelRotation, "change", (latest) => {
    if (latest >= 0 && latest <= 20) setActiveIndex(0);
    else if (latest >= 40 && latest <= 80) setActiveIndex(1);
    else if (latest >= 100 && latest <= 120) setActiveIndex(2);
    else setActiveIndex(null);
  });

  const activeMaterial = activeIndex !== null ? MATERIALS[activeIndex] : null;

  return (
    <section 
      id="materials" 
      ref={containerRef} 
      className="relative bg-[#1A1C1A] h-[300vh] selection:bg-[#00288E] selection:text-white"
    >
      {/* Sticky Viewport - Rigid fully-constrained Layout */}
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden flex flex-col justify-between items-center pt-24 pb-0 gap-6">
        
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(#1A1C1A_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
        <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-b from-[#00288E]/10 to-transparent pointer-events-none" />

        {/* 1. Header (Takes minimal required height) */}
        <motion.div 
          className="relative z-20 flex flex-col items-center text-center px-4 shrink-0 mb-4 md:mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="w-10 h-px bg-[#00288E]" />
            <p className="text-[#C4C5D5] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase">Materials & Quality</p>
            <div className="w-10 h-px bg-[#00288E]" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black font-heading text-white tracking-tight leading-[1.1]">
            Uncompromising <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500">Substance.</span>
          </h2>
        </motion.div>

        {/* 2. Content Card Safe Zone (Auto-shrinks/expands to fit nicely) */}
        {/* Enforced min-height so flex-container bounds NEVER jump when AnimatePresence unmounts */}
        <div className="relative z-20 flex-1 w-full max-w-[460px] px-4 flex flex-col items-center justify-center pointer-events-auto min-h-[300px]">
          <AnimatePresence mode="wait">
            {activeMaterial && (
              <motion.div 
                key={activeMaterial.id}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.95, filter: 'blur(10px)' },
                  visible: { 
                    opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
                    transition: { duration: 0.5, ease: "easeOut" as any, staggerChildren: 0.08, delayChildren: 0.1 }
                  },
                  exit: { opacity: 0, y: -20, scale: 0.95, filter: 'blur(10px)', transition: { duration: 0.3 } }
                }}
                /* Outer frame providing the vibrant thick gradient border */
                className={`w-full max-w-[480px] p-[2px] rounded-3xl bg-gradient-to-br shadow-[0_20px_50px_rgba(0,0,0,0.5)] ${activeMaterial.bgClass} relative`}
              >
                {/* Inner architectural Focus-Box */}
                <div className="w-full relative bg-[#0a0f1a] rounded-[22px] p-6 sm:p-7 flex flex-col overflow-hidden">
                  
                  {/* Atmospheric Glow */}
                  <div className="absolute top-0 right-0 w-64 h-64 opacity-20 pointer-events-none blur-[60px]" style={{ backgroundColor: activeMaterial.color }} />
                  
                  {/* Structural Frame Corners */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-white/10 rounded-tl-[22px]" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/10 rounded-tr-[22px]" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-white/10 rounded-bl-[22px]" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-white/10 rounded-br-[22px]" />

                  {/* Shared child variant for staggering */}
                  {(() => {
                    const itemVariant = {
                      hidden: { opacity: 0, y: 10, filter: 'blur(4px)' },
                      visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: "easeOut" as any } },
                      exit: { opacity: 0, filter: 'blur(2px)', transition: { duration: 0.2 } }
                    };

                    return (
                      <>
                        {/* Header: Floating Pill + ID */}
                        <motion.div variants={itemVariant} className="flex items-center justify-between mb-5 relative z-10">
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-md">
                            <span className="w-1.5 h-1.5 rounded-full shadow-[0_0_10px_currentColor] animate-pulse" style={{ backgroundColor: activeMaterial.color, color: activeMaterial.color }} />
                            <span className="text-[9px] font-bold tracking-[0.2em] text-white/90 uppercase">
                              {activeMaterial.badge}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono tracking-widest text-white/30 uppercase">
                            MOD_0{activeMaterial.id + 1}
                          </span>
                        </motion.div>
                        
                        {/* Typography Block */}
                        <motion.div variants={itemVariant} className="relative z-10 mb-6">
                          <h3 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight leading-[1.1] mb-3">
                            {activeMaterial.title}
                          </h3>
                          <p className="text-white/60 text-xs sm:text-[13px] leading-relaxed font-medium">
                            {activeMaterial.desc}
                          </p>
                        </motion.div>

                        {/* Blueprint Specifications Grid */}
                        <div className="relative z-10 mt-auto pt-5 border-t border-white/10 grid grid-cols-2 gap-x-4 gap-y-5">
                          {activeMaterial.specs.map((spec, specIdx) => (
                            <motion.div key={specIdx} variants={itemVariant} className="relative flex flex-col pl-3">
                              {/* Vertical Architect Line */}
                              <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-white/10" />
                              {/* Dynamic Colored Indicator */}
                              <div className="absolute left-0 top-1.5 w-[2px] h-3 shadow-[0_0_8px_currentColor]" style={{ backgroundColor: activeMaterial.color, color: activeMaterial.color }} />
                              
                              <span className="text-white/40 text-[8px] uppercase font-bold tracking-[0.2em] mb-1">
                                {spec.label}
                              </span>
                              <span className="text-white/90 text-xs sm:text-[13px] font-bold tracking-wide">
                                {spec.value}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </>
                    );
                  })()}

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3. The Arc & Rotary Engine (Fixed height safely pushed to bottom) */}
        <div className="relative w-full h-[180px] sm:h-[220px] md:h-[260px] overflow-hidden shrink-0 pointer-events-none flex justify-center">
          
          {/* Target Pointer down to the curve */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-[30px] md:h-[40px] bg-gradient-to-t from-white/70 to-transparent z-10" />
          
          {/* Lock Target at exact apex (30px/40px down based on screen) */}
          <div className="absolute top-[30px] md:top-[40px] left-1/2 -translate-x-1/2 w-6 h-6 border-2 border-white/60 rounded-full bg-[#1A1C1A]/50 -translate-y-[calc(50%+1px)] z-20 flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.2)]">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          </div>

          {/* Genuine SVG rendering for highly visible ultra-crisp line spanning perfectly across the container width mapping to Rotary wheel */}
          <svg className="absolute top-[30px] md:top-[40px] left-1/2 -translate-x-1/2 w-[200vw] sm:w-[120vw] md:w-[1000px] aspect-square overflow-visible opacity-60 z-0" viewBox="0 0 1000 1000">
             <circle cx="500" cy="500" r="499" fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="3 8" />
          </svg>

          {/* The Rotating Engine carrying the dots */}
          <motion.div 
            className="absolute top-[30px] md:top-[40px] left-1/2 -translate-x-1/2 w-[200vw] sm:w-[120vw] md:w-[1000px] aspect-square rounded-full z-10"
            style={{ rotate: wheelRotation }}
          >
            {MATERIALS.map((mat, i) => {
              const angleDesc = i * -60;
              return (
                <div 
                  key={mat.id}
                  className="absolute inset-0 w-full h-full"
                  style={{ transform: `rotate(${angleDesc}deg)` }}
                >
                  {/* Positioned inside a flex wrapper to completely prevent scale/translate bounding box drift */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center">
                    <div 
                       className="w-2 h-2 rounded-sm rotate-45 transition-colors duration-500" 
                       style={{ 
                         backgroundColor: i === activeIndex ? mat.color : 'rgba(255,255,255,0.4)',
                         boxShadow: i === activeIndex ? `0 0 20px 5px ${mat.color}, 0 0 10px 2px #fff` : 'none'
                       }}
                    />
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
