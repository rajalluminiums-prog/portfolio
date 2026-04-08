import { motion, useScroll, useTransform } from 'framer-motion';
import { FiArrowRight, FiArrowUpRight, FiCheckCircle } from 'react-icons/fi';
import AnimatedCounter from '../ui/AnimatedCounter';
import epicHeroImg from '../../assets/hero-img.png';

export default function Hero() {
  const { scrollY } = useScroll();
  
  // High-performance direct scroll bindings
  const yText = useTransform(scrollY, [0, 800], [0, 250]); // Travels downward
  const opacityText = useTransform(scrollY, [0, 500], [1, 0]); // Fades out smoothly
  const yImg = useTransform(scrollY, [0, 1000], [0, 150]); // Cinematic slight drift

  return (
    <section id="hero" className="relative h-[100dvh] w-full bg-[#FAF9F6] p-2 sm:p-2 md:p-3 lg:p-4 pb-0 flex items-center justify-center overflow-hidden">
      
      {/* 
        The Global Frame: 
        Creates the tight 'gap' on all sides, housing the image.
      */}
      <div className="relative w-full h-full rounded-[1.5rem] md:rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden bg-transparent border border-[#C4C5D5]/20 shadow-[0_20px_50px_rgb(0,0,0,0.05)]">
        
        {/* The Image (acts as full bleed inside gap) */}
        <motion.img 
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
          style={{ y: yImg }}
          src={epicHeroImg} 
          alt="Raj Alluminiums premium sliding window and structural fabrication project located in Indore" 
          loading="eager"
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover origin-top" 
        />
        {/* Deep cinematic gradient tracking top-down for the Navbar and Text visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1C1A]/80 via-[#1A1C1A]/20 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1C1A]/50 via-transparent to-transparent pointer-events-none" />

        {/* Top Left: Monumental Typography */}
        <div className="absolute inset-0 z-10 w-full h-full px-5 md:px-10 lg:px-14 pt-[100px] md:pt-[120px] lg:pt-[140px] pointer-events-none flex flex-col">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ y: yText, opacity: opacityText }}
            className="max-w-3xl pointer-events-auto"
          >
            <h1 className="text-[2.75rem] sm:text-6xl md:text-7xl lg:text-[7rem] font-extrabold font-heading tracking-[-0.03em] text-white leading-[1.03]">
              Architectural <br />
              <span className="text-white/95">Mastery.</span>
            </h1>
            <p className="text-sm md:text-lg text-white/80 max-w-xl mt-6 lg:mt-8 leading-relaxed font-medium">
              The all-in-one partner that simplifies your architectural journey — 
              from custom structural framing to precise frameless execution.
            </p>
            
            <div className="mt-8 lg:mt-12 flex items-center gap-4">
               <a href="#portfolio" className="inline-flex items-center gap-4 sm:gap-6 bg-white text-[#1A1C1A] hover:bg-[#F4F3F1] transition-all duration-500 pl-6 sm:pl-8 pr-1.5 sm:pr-2 py-1.5 sm:py-2 rounded-full font-bold tracking-widest uppercase shadow-2xl text-[10px] sm:text-xs md:text-sm group w-max">
                 <span className="hidden sm:inline">Explore Gallery</span>
                 <span className="sm:hidden">Explore</span>
                 <span className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-[#1A1C1A] text-white flex items-center justify-center transition-all duration-500 group-hover:bg-[#00288E]">
                   <FiArrowRight size={16} className="-rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                 </span>
               </a>
               <div className="hidden sm:flex items-center gap-3 ml-4 bg-white/10 backdrop-blur-md border border-white/10 px-5 py-3 rounded-full">
                  <FiCheckCircle className="text-[#25D366] shrink-0" size={18} />
                  <span className="text-xs text-white uppercase tracking-widest font-bold">Iso 9001 Certified</span>
               </div>
            </div>
          </motion.div>
        </div>

        {/* 
          The Cutout Block (Wireframe requirement: "content section is not on image")
          Sits identically anchored to the bottom right.
        */}
        <div className="absolute bottom-0 right-0 w-[92%] sm:w-[500px] lg:w-[640px] h-auto bg-[#FAF9F6] rounded-tl-[1.5rem] sm:rounded-tl-[2rem] md:rounded-tl-[3.5rem] p-5 sm:p-6 lg:p-12 pointer-events-auto flex flex-col justify-end z-20 overflow-hidden">
          
          {/* subtle background pattern grid for premium printing feel */}
          <div className="absolute inset-0 bg-[radial-gradient(#C4C5D5_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

          {/* Inner Corner Inverse Radius Illusions (CSS Box Shadow Magic) */}
          <div className="hidden md:block absolute -top-10 right-0 w-10 h-10 bg-transparent pointer-events-none" style={{ boxShadow: '15px 15px 0 0 #FAF9F6', borderBottomRightRadius: '2rem' }} />
          <div className="hidden md:block absolute bottom-0 -left-10 w-10 h-10 bg-transparent pointer-events-none" style={{ boxShadow: '15px 15px 0 0 #FAF9F6', borderBottomRightRadius: '2rem' }} />

          {/* Elevated Content directly on Ivory Background */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full flex flex-col gap-8"
          >
             {/* Header part */}
            <div className="flex flex-col sm:flex-row justify-between items-start border-b border-[#1A1C1A]/10 pb-5 sm:pb-6 w-full gap-4 sm:gap-0">
               <div className="flex flex-col gap-1">
                 <p className="text-[#1A1C1A]/50 text-[10px] md:text-xs font-bold tracking-[0.2em] md:tracking-[0.25em] uppercase">Industry Benchmark</p>
                 <h2 className="text-[#1A1C1A] text-lg sm:text-xl lg:text-2xl font-bold font-heading leading-tight">Structural & Aesthetic<br className="hidden sm:block"/> Perfection.</h2>
               </div>
               <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full border-2 border-[#FAF9F6] bg-[#00288E] flex items-center justify-center text-[10px] font-bold text-white z-20 shadow-md">15+</div>
                  <div className="w-10 h-10 rounded-full border-2 border-[#FAF9F6] bg-gray-200 z-10 overflow-hidden shadow-md">
                     <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=100&h=100" />
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-[#FAF9F6] bg-black z-0 flex items-center justify-center shadow-md">
                     <FiArrowRight className="text-white" />
                  </div>
               </div>
            </div>

            {/* Stats Split Grid */}
            <div className="grid grid-cols-2 gap-4 sm:gap-8 w-full">
              
              <div className="flex flex-col gap-1 sm:gap-2 relative">
                <div className="absolute -left-3 sm:-left-4 top-1 bottom-1 w-px bg-gradient-to-b from-[#00288E] to-transparent opacity-50" />
                <div className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-[#1A1C1A] tracking-tighter flex items-center">
                  <AnimatedCounter target={1000} suffix="+" />
                </div>
                <p className="text-[#444653] text-[9px] sm:text-[11px] lg:text-sm font-medium uppercase tracking-wider md:tracking-widest leading-snug">Projects<br className="hidden sm:block"/> Delivered</p>
              </div>
              
              <div className="flex flex-col gap-2 justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full border border-[#1A1C1A]/10 flex items-center justify-center shrink-0 shadow-sm bg-white">
                     <div className="w-2.5 h-2.5 rounded-full bg-[#00288E] animate-pulse" />
                  </div>
                  <p className="text-[11px] lg:text-xs text-[#444653] tracking-wider uppercase font-bold leading-tight">Active<br/>Innovations</p>
                </div>
                
                <a href="#services" className="text-xs font-bold tracking-widest text-[#00288E] hover:text-[#1A1C1A] uppercase flex items-center gap-2 group transition-colors self-start mt-2">
                  View Specs <FiArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>
              </div>

            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
