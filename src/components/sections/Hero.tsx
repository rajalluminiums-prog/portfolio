import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiArrowRight, FiArrowUpRight, FiCheckCircle } from 'react-icons/fi';
import AnimatedCounter from '../ui/AnimatedCounter';
import epicHeroImg from '../../assets/hero-img.png';
import api, { API_BASE_URL } from '../../api';

interface HeroProps {
  isReady?: boolean;
}

export default function Hero({ isReady = true }: HeroProps) {
  const [stats, setStats] = useState({ average: 4.9, total: 437 });

  useEffect(() => {
    api.get('/api/reviews/stats')
      .then(r => { if(r.data.success && r.data.data.total > 0) setStats(r.data.data) })
      .catch(() => {});

    const evtSource = new EventSource(`${API_BASE_URL}/api/reviews/stream`);
    evtSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === 'STATS_UPDATE') {
          setStats(payload.data);
        }
      } catch (e) {}
    };
    return () => evtSource.close();
  }, []);

  const { scrollY } = useScroll();
  
  // High-performance direct scroll bindings
  const yText = useTransform(scrollY, [0, 800], [0, 250]); // Travels downward
  const opacityText = useTransform(scrollY, [0, 500], [1, 0]); // Fades out smoothly
  const yImg = useTransform(scrollY, [0, 1000], [0, 150]); // Cinematic slight drift

  return (
    <section id="hero" className="relative h-[100dvh] min-h-[820px] md:min-h-0 w-full bg-[#FAF9F6] p-2 sm:p-2 md:p-3 lg:p-4 pb-0 flex items-center justify-center overflow-hidden">
      
      {/* 
        The Global Frame: 
        Creates the tight 'gap' on all sides, housing the image.
      */}
      <div className="relative w-full h-full rounded-[1.5rem] md:rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden bg-transparent border border-[#C4C5D5]/20 shadow-[0_20px_50px_rgb(0,0,0,0.05)]">
        
        {/* The Image (acts as full bleed inside gap) */}
        <motion.img 
          initial={{ scale: 1.15 }}
          animate={{ scale: isReady ? 1 : 1.15 }}
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
            animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ y: yText, opacity: opacityText }}
            className="max-w-3xl pointer-events-auto"
          >
            <h1 className="sr-only">
              Top Aluminium Fabricators in Indore | Sliding & Openable Windows (2 Track, 3 Track), Office Doors, Partitions, Office Cabins, & Kitchen Profile Work
            </h1>
            <div aria-hidden="true" className="text-[2.75rem] sm:text-6xl md:text-7xl lg:text-[7rem] font-extrabold font-heading tracking-[-0.03em] text-white leading-[1.03]">
              Architectural <br />
              <span className="text-white/95">Mastery.</span>
            </div>
            <p className="text-sm md:text-lg text-white/80 max-w-xl mt-6 lg:mt-8 leading-relaxed font-medium">
              The all-in-one partner that simplifies your architectural journey — 
              from custom structural framing to precise frameless execution.
            </p>
            
            <div className="mt-6 md:mt-12 flex items-center gap-3 sm:gap-4 flex-wrap sm:flex-nowrap">
               {/* Button 1: Explore Gallery */}
               <a href="#portfolio" className="inline-flex h-[50px] md:h-[60px] items-center gap-4 sm:gap-6 bg-white text-[#1A1C1A] hover:bg-[#F4F3F1] transition-all duration-500 pl-6 sm:pl-8 pr-1.5 md:pr-1.5 rounded-full font-bold tracking-widest uppercase shadow-2xl text-[10px] sm:text-xs md:text-sm group w-max">
                 <span className="hidden sm:inline">Explore Gallery</span>
                 <span className="sm:hidden">Explore</span>
                 <span className="w-9 h-9 md:w-[48px] md:h-[48px] rounded-full bg-[#1A1C1A] text-white flex items-center justify-center transition-all duration-500 group-hover:bg-[#00288E] shrink-0">
                   <FiArrowRight size={18} className="-rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                 </span>
               </a>
               
               {/* Button 2: ISO */}
               <div className="hidden sm:flex h-[50px] md:h-[60px] items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 px-6 rounded-full transition-all hover:bg-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
                  <FiCheckCircle className="text-[#25D366] shrink-0" size={20} />
                  <span className="text-xs md:text-sm text-white uppercase tracking-widest font-bold">ISO 9001 Certified</span>
               </div>
               
               <a 
                 href="#testimonials" 
                 onClick={(e) => {
                   e.preventDefault();
                   const target = document.querySelector('#testimonials');
                   if (!target) return;
                   const lenis = (window as any).lenis;
                   if (lenis) {
                     lenis.scrollTo(target, { offset: -100, duration: 1.2 });
                   } else {
                     window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 100, behavior: 'smooth' });
                   }
                 }}
                 className="hidden xl:flex h-[50px] md:h-[60px] items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 px-6 rounded-full hover:bg-white/20 transition-all cursor-pointer shadow-[0_4px_30px_rgba(0,0,0,0.1)] group"
               >
                  <span className="text-xl md:text-2xl filter drop-shadow-sm group-hover:scale-110 transition-transform duration-300" role="img" aria-label="5 stars rating">🤩</span>
                  <div className="flex flex-col justify-center">
                    <span className="text-[10px] md:text-xs text-white uppercase tracking-widest font-bold leading-tight">{stats.average.toFixed(1)} / 5 Average</span>
                    <span className="text-[8px] md:text-[9px] text-white/70 uppercase tracking-widest leading-tight">
                      <AnimatedCounter target={stats.total >= 50 ? Math.floor(stats.total / 50) * 50 : stats.total} />+ Verified Clients
                    </span>
                  </div>
               </a>
            </div>

            {/* Mobile Scroll Indicator (Moved here for clean flow without absolute overlap) */}
            <div className="sm:hidden mt-8 flex items-center gap-2 pointer-events-none opacity-90 bg-white/10 backdrop-blur-lg px-4 py-2 rounded-full border border-white/20 w-max shadow-lg">
               <span className="text-[9px] text-white font-bold tracking-widest uppercase">Scroll Down</span>
               <motion.div animate={{ y: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-white font-bold">↓</motion.div>
            </div>
          </motion.div>
        </div>

        {/* Desktop Vertical Scroll Indicator */}
        <div className="absolute bottom-6 left-6 z-20 flex flex-col items-center gap-2 pointer-events-none opacity-80 hidden sm:flex">
          <span className="text-[10px] text-[#1A1C1A] font-bold tracking-widest uppercase rotate-180" style={{ writingMode: 'vertical-rl' }}>Scroll</span>
          <div className="w-px h-12 bg-black/20 overflow-hidden relative">
            <motion.div 
              className="absolute top-0 left-0 w-full h-1/2 bg-[#00288E]"
              animate={{ y: [0, 50, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* 
          The Cutout Block / Mobile Bottom Sheet
        */}
        <div className="absolute bottom-0 inset-x-0 sm:inset-x-auto sm:right-0 w-full sm:w-[500px] lg:w-[640px] h-auto bg-[#FAF9F6] rounded-t-[2rem] sm:rounded-t-none sm:rounded-tl-[2rem] md:rounded-tl-[3.5rem] p-5 pb-20 sm:p-6 sm:pb-6 lg:p-12 pointer-events-auto flex flex-col justify-end z-20 overflow-hidden shadow-[0_-10px_40px_rgba(0,0,0,0.1)] sm:shadow-[-10px_-10px_30px_rgba(0,0,0,0.02)]">
          
          {/* subtle background pattern grid for premium printing feel */}
          <div className="absolute inset-0 bg-[radial-gradient(#C4C5D5_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

          {/* Inner Corner Inverse Radius Illusions (CSS Box Shadow Magic) */}
          <div className="hidden md:block absolute -top-10 right-0 w-10 h-10 bg-transparent pointer-events-none" style={{ boxShadow: '15px 15px 0 0 #FAF9F6', borderBottomRightRadius: '2rem' }} />
          <div className="hidden md:block absolute bottom-0 -left-10 w-10 h-10 bg-transparent pointer-events-none" style={{ boxShadow: '15px 15px 0 0 #FAF9F6', borderBottomRightRadius: '2rem' }} />

          {/* Elevated Content directly on Ivory Background */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
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
                     <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=100&h=100" alt="Verified customer of Raj Alluminiums in Indore" />
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
                  <AnimatedCounter target={100} suffix="K+" />
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
