import { motion } from 'framer-motion';
import SectionHeading from '../ui/SectionHeading';
import ScrollReveal from '../ui/ScrollReveal';
import { HiOutlineShieldCheck, HiOutlineLightBulb, HiOutlineTruck, HiOutlineUserGroup, HiOutlineCurrencyRupee, HiOutlineBadgeCheck } from 'react-icons/hi';
import { type ReactNode } from 'react';

interface USP { 
  icon: ReactNode; 
  title: string; 
  description: string; 
  bentoClass: string;
  tag: string;
}

const USPS: USP[] = [
  { 
    icon: <HiOutlineShieldCheck className="w-8 h-8" />, 
    title: 'Perfect Fit & Finish', 
    description: 'We ensure highly accurate cuts and perfect framing so every door and window slides smoothly and fits securely without gaps.',
    bentoClass: 'md:col-span-2 md:row-span-2 flex-col justify-between p-8 md:p-12',
    tag: 'QUALITY_CONTROL'
  },
  { 
    icon: <HiOutlineLightBulb className="w-6 h-6" />, 
    title: 'Custom Styles', 
    description: 'Tailored designs made specifically to match the unique look of your home or office.',
    bentoClass: 'md:col-span-1 md:row-span-1 flex-col p-6 md:p-8',
    tag: 'FLEXIBILITY'
  },
  { 
    icon: <HiOutlineTruck className="w-6 h-6" />, 
    title: 'Fast Free Delivery', 
    description: 'Smooth project timelines mean your finished materials are delivered to your site quickly—usually within 7 to 10 days.',
    bentoClass: 'md:col-span-1 md:row-span-1 flex-col p-6 md:p-8',
    tag: 'LOGISTICS'
  },
  { 
    icon: <HiOutlineUserGroup className="w-7 h-7" />, 
    title: 'Expert Team', 
    description: 'Our experienced in-house installation team handles everything cleanly and professionally, leaving no mess behind.',
    bentoClass: 'md:col-span-1 md:row-span-2 flex-col justify-between p-8 md:p-10',
    tag: 'RELIABILITY'
  },
  { 
    icon: <HiOutlineBadgeCheck className="w-6 h-6" />, 
    title: 'Quality Warranty', 
    description: 'We use the best materials available and guarantee our finishes, protecting your investment for the long term.',
    bentoClass: 'md:col-span-2 md:row-span-1 flex-col md:flex-row items-start md:items-center gap-6 p-6 md:p-8',
    tag: 'PROTECTION'
  },
  { 
    icon: <HiOutlineCurrencyRupee className="w-6 h-6" />, 
    title: 'Direct Pricing', 
    description: 'Because we fabricate in-house, you get premium quality aluminium work at highly competitive, direct factory prices.',
    bentoClass: 'md:col-span-2 md:row-span-1 flex-col md:flex-row items-start md:items-center gap-6 p-6 md:p-8',
    tag: 'VALUE'
  },
];

export default function WhyChooseUs() {
  return (
    <section id="advantages" className="relative overflow-hidden bg-[#FAF9F6] py-24 md:py-32 selection:bg-[#00288E] selection:text-white">
      
      {/* Background Architectural Blueprint Traces */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden mix-blend-multiply opacity-20">
         <div className="absolute top-0 left-[20%] w-[1px] h-full bg-gradient-to-b from-transparent via-[#C4C5D5] to-transparent" />
         <div className="absolute top-0 right-[20%] w-[1px] h-full bg-gradient-to-b from-transparent via-[#C4C5D5] to-transparent" />
         <div className="absolute top-[30%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C4C5D5] to-transparent" />
         <div className="absolute top-[70%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C4C5D5] to-transparent" />
      </div>

      <div className="section-container relative z-10 max-w-[1400px] mx-auto px-4 md:px-8">
        
        {/* Header Block */}
        <div className="mb-16 md:mb-24 text-center md:text-left flex flex-col md:flex-row items-center md:items-end justify-between gap-8">
           <div className="max-w-2xl">
             <SectionHeading 
               badge="Advantage" 
               title="Uncompromising Standards" 
               subtitle="What firmly establishes Raj Alluminiums above industry equilibrium — absolute precision, radical deployment speed, and guaranteed structural reliance." 
               align="left"
             />
           </div>
           <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex md:flex w-20 h-20 md:w-24 md:h-24 rounded-full border border-[#00288E]/20 text-[#00288E] items-center justify-center font-bold font-mono tracking-widest text-[10px] md:text-xs relative mt-4 md:mt-0 shadow-sm"
           >
              <div className="absolute inset-2 border border-dashed border-[#00288E]/40 rounded-full animate-[spin_10s_linear_infinite]" />
              EST.2001
           </motion.div>
        </div>

        {/* CSS Asymmetric Bento Grid Array */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:auto-rows-[minmax(220px,auto)] gap-4 md:gap-6">
          
          {USPS.map((usp, i) => {
             const isLargeOrWide = usp.bentoClass.includes('span-2');

             return (
              <ScrollReveal 
                 key={usp.title} 
                 delay={i * 0.1} 
                 className={`group relative bg-white border border-[#C4C5D5]/40 rounded-3xl overflow-hidden hover:shadow-[0_20px_60px_rgba(0,40,142,0.06)] transition-all duration-300 flex ${usp.bentoClass}`}
              >
                {/* Internal UI Decorative Angles */}
                <div className="absolute top-0 right-0 w-12 h-12 border-l border-b border-[#C4C5D5]/30 bg-[#FAF9F6] rounded-bl-3xl translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                <div className="absolute bottom-0 left-0 w-12 h-12 border-r border-t border-[#C4C5D5]/30 bg-[#FAF9F6] rounded-tr-3xl -translate-x-4 translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500 ease-out" />

                {/* Massive Index Watermark (Only visible clearly on hover) */}
                <div className="absolute bottom-[-10%] right-[-5%] text-[120px] leading-none font-black font-heading text-[#00288E]/[0.02] group-hover:text-[#00288E]/[0.06] transition-colors duration-500 pointer-events-none select-none z-0 tracking-tighter">
                  0{i + 1}
                </div>

                <div className="relative z-10 flex flex-col justify-start h-full w-full">
                  
                  {/* Top Header / Icon Area */}
                  <div className={`flex ${isLargeOrWide && !usp.bentoClass.includes('flex-row') ? 'items-start justify-between w-full mb-8' : 'w-full mb-5'} ${usp.bentoClass.includes('flex-row') && 'w-auto mb-0'}`}>
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#F4F3F1] to-white border border-[#C4C5D5]/50 shadow-[inset_0_2px_10px_rgba(255,255,255,1)] text-[#00288E] group-hover:scale-110 group-hover:bg-[#00288E] group-hover:text-white transition-all duration-500">
                      {usp.icon}
                    </div>

                    {isLargeOrWide && !usp.bentoClass.includes('flex-row') && (
                       <div className="px-3 py-1 bg-[#F4F3F1] border border-[#C4C5D5]/60 rounded-full text-[10px] font-bold tracking-[0.2em] text-[#444653] uppercase">
                          {usp.tag}
                       </div>
                    )}
                  </div>
                  
                  {/* Content Typography */}
                  <div className={`${usp.bentoClass.includes('flex-row') ? 'flex-1' : ''}`}>
                    <h3 className={`${isLargeOrWide && !usp.bentoClass.includes('flex-row') ? 'text-2xl md:text-3xl' : 'text-xl'} font-black font-heading text-[#1A1C1A] mb-3 group-hover:text-[#00288E] transition-colors duration-300 tracking-tight leading-[1.1]`}>
                      {usp.title}
                    </h3>
                    <p className={`text-[#444653] leading-relaxed ${isLargeOrWide && !usp.bentoClass.includes('flex-row') ? 'text-base max-w-sm' : 'text-sm'}`}>
                      {usp.description}
                    </p>
                  </div>

                </div>
              </ScrollReveal>
             );
          })}

        </div>
      </div>
    </section>
  );
}
