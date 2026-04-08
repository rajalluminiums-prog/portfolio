import { useRef, useState } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { FiShield, FiMaximize, FiLayers } from 'react-icons/fi';
import SectionHeading from '../ui/SectionHeading';

import portfolioBg1 from '../../assets/hero.png';
import portfolioBg2 from '../../assets/portfolio-window.png';
import portfolioBg3 from '../../assets/portfolio-door.png';

const SERVICES = [
  {
    title: 'Architectural Windows',
    subtitle: 'Unlock Superior Thermal Performance',
    description: 'Use our slimline profiles for residential and commercial spaces to maximize views and simplify aesthetics with acoustic security.',
    features: ['Slimline Profiles', 'Double Glazed'],
    image: portfolioBg2,
    icon: FiMaximize,
    floatingText1: 'Maximum Vision',
    floatingText2: 'Acoustic Rated',
  },
  {
    title: 'Premium Entrances',
    subtitle: 'Make a Statement with Pivot Doors',
    description: 'Transform your entrance with monumental scale. Our pivot and sliding systems combine smooth mechanization with impenetrable security.',
    features: ['Automated Sliders', 'Pivot Systems'],
    image: portfolioBg3,
    icon: FiShield,
    floatingText1: 'Secure Access',
    floatingText2: 'Soft Close',
  },
  {
    title: 'Structural Glazing',
    subtitle: 'Blur the Boundary of Inside & Out',
    description: 'Uninterrupted glass facades engineered without visible framing to maintain absolute structural integrity connecting elements.',
    features: ['Curtain Walls', 'Spider Glazing'],
    image: portfolioBg1,
    icon: FiLayers,
    floatingText1: 'Frameless',
    floatingText2: 'High Tension',
  }
];

export default function Services() {
  const targetRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  // Convert continuous scroll into discrete triggers
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // We add small buffers to prevent flickering
    if (latest < 0.3) {
      setActiveSlide(0);
    } else if (latest >= 0.3 && latest < 0.6) {
      setActiveSlide(1);
    } else if (latest >= 0.6) {
      setActiveSlide(2);
    }
  });

  const activeData = SERVICES[activeSlide];

  return (
    <section ref={targetRef} id="services" className="relative h-[400vh] bg-[#FAF9F6]">
      
      {/* Mobile-only unpinned header that scrolls away naturally to maximize screen real-estate */}
      <div className="md:hidden pt-[100px] pb-6 px-4 w-full flex justify-center">
         <SectionHeading
            badge="OUR EXPERTISE"
            title="What We Build"
            align="center"
          />
      </div>

      {/* Sticky Checkpoint (Using 100svh to prevent mobile URL bar resize shaking) */}
      <div className="sticky top-0 h-[100svh] w-full flex flex-col items-center justify-center p-4 md:px-8 pt-[10vh] sm:pt-[12vh] md:pt-[90px] lg:pt-[110px] pb-[4vh] overflow-hidden">
        
        {/* Dynamic header placement, sitting above naturally (Hidden on Mobile) */}
        <div className="hidden md:flex w-full max-w-[1400px] flex-shrink-0 mb-6 lg:mb-10 text-center flex-col items-center z-10">
          <SectionHeading
            badge="OUR EXPERTISE"
            title="What We Build"
            align="center"
          />
        </div>

        {/* Bento Wrapper inside sticky */}
        <div className="w-full max-w-[1400px] h-full max-h-[600px] md:max-h-[700px] lg:max-h-[800px] grid grid-rows-[40%_minmax(0,1fr)] lg:grid-rows-1 lg:grid-cols-2 gap-3 md:gap-4 lg:gap-8 flex-1 min-h-0 z-10">
          
          {/* Left Panel: Image Side (Fully Isolated Animation) */}
          <div className="relative h-full w-full rounded-2xl lg:rounded-3xl overflow-hidden border border-[#C4C5D5]/20 shadow-sm bg-[#F4F3F1]">
            <AnimatePresence>
              <motion.div 
                key={`image-${activeSlide}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                style={{ willChange: "opacity" }}
                className="absolute inset-0 w-full h-full group"
              >
                <img 
                  src={activeData.image} 
                  alt={`${activeData.title} installations in Indore`} 
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1C1A]/60 via-transparent to-transparent mix-blend-multiply" />

                {/* Floating Decorators matching user specific reference */}
                <div className="absolute inset-0 p-4 md:p-6 lg:p-8 flex flex-col justify-between hidden sm:flex">
                  <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.15, duration: 0.4, ease: "easeOut" }}
                    style={{ willChange: "transform, opacity" }}
                    className="self-end bg-white/90 backdrop-blur-md rounded-xl md:rounded-2xl p-3 md:p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center gap-3 md:gap-4"
                  >
                     <div className="w-8 h-8 md:w-10 md:h-10 bg-[#00288E]/10 text-[#00288E] rounded-full flex items-center justify-center">
                        <activeData.icon size={18} />
                     </div>
                     <div>
                       <p className="text-[9px] md:text-[10px] text-[#444653] font-bold tracking-widest uppercase">Specialty</p>
                       <p className="text-xs md:text-sm font-bold text-[#1A1C1A]">{activeData.floatingText1}</p>
                     </div>
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
                    style={{ willChange: "transform, opacity" }}
                    className="self-start bg-white/90 backdrop-blur-md rounded-2xl px-6 py-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center gap-3 border border-white/50"
                  >
                    <div className="w-2 h-2 rounded-full bg-[#00288E] animate-pulse" />
                    <span className="text-sm font-bold text-[#1A1C1A] tracking-wider">{activeData.floatingText2}</span>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

            {/* Right Panel: Content Side (Static Background) */}
          <div className="relative h-full w-full rounded-2xl lg:rounded-3xl border border-[#C4C5D5]/20 shadow-sm bg-[#FFFFFF] overflow-hidden flex flex-col">
            
            <div className="flex-1 p-6 sm:p-8 lg:p-14 relative flex flex-col justify-start overflow-hidden">
               {/* Pure Text Transition Layer */}
               <AnimatePresence mode="wait">
                 <motion.div
                   key={`content-${activeSlide}`}
                   initial="hidden"
                   animate="visible"
                   exit="exit"
                   variants={{
                     hidden: { opacity: 0 },
                     visible: {
                       opacity: 1,
                       transition: {
                         staggerChildren: 0.1,
                         delayChildren: 0.1,
                       }
                     },
                     exit: {
                       opacity: 0,
                       transition: { duration: 0.2, ease: "easeOut" }
                     }
                   }}
                   style={{ willChange: "opacity" }}
                   className="flex flex-col"
                 >
                    {/* Badge */}
                    <motion.div 
                      variants={{
                        hidden: { opacity: 0, y: 15 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                      }}
                      className="text-xs font-bold text-[#00288E] tracking-widest uppercase flex items-center gap-3 mb-6"
                    >
                      <span className="w-8 h-8 rounded-full border border-[rgba(0,40,142,0.2)] flex items-center justify-center text-[10px]">
                        0{activeSlide + 1}
                      </span>
                      {activeData.title}
                    </motion.div>

                    {/* Architectural Heading Masked Reveal */}
                    <div className="overflow-hidden mb-4 sm:mb-8">
                      <motion.h2 
                        variants={{
                          hidden: { opacity: 0, y: "100%" },
                          visible: { opacity: 1, y: "0%", transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
                        }}
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-heading font-bold text-[#1A1C1A] leading-[1.05] tracking-tight"
                      >
                        {activeData.subtitle}
                      </motion.h2>
                    </div>
                    
                    {/* Description Text */}
                    <motion.p 
                      variants={{
                        hidden: { opacity: 0, x: -10 },
                        visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
                      }}
                      className="text-sm sm:text-base text-[#444653] leading-relaxed font-medium max-w-md"
                    >
                      {activeData.description}
                    </motion.p>
                 </motion.div>
               </AnimatePresence>
            </div>

            {/* Pagination Tracking Element Bottom Right attached locally */}
            <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 flex items-end gap-1 sm:gap-2 font-heading font-bold z-20">
               <span className="text-2xl sm:text-3xl text-[#00288E] leading-none">0{activeSlide + 1}</span>
               <span className="text-lg sm:text-xl text-[#C4C5D5] leading-none">/</span>
               <span className="text-sm sm:text-base text-[#444653]/60 mb-0.5 sm:mb-1 leading-none">0{SERVICES.length}</span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
