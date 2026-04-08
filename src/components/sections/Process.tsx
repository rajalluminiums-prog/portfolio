import { useRef } from 'react';
import { motion, useScroll } from 'framer-motion';
import { FiMaximize, FiEdit2, FiSettings, FiCheckCircle } from 'react-icons/fi';
import SectionHeading from '../ui/SectionHeading';

const STEPS = [
  { 
    icon: FiMaximize, 
    number: '01', 
    title: 'Site Measurement', 
    description: 'We visit your site to take highly accurate measurements, ensuring everything aligns perfectly with your space.',
    detail: 'Step 1: Planning'
  },
  { 
    icon: FiEdit2, 
    number: '02', 
    title: 'Custom Design', 
    description: 'Based on your needs, we recommend the best materials and create a custom design that matches your aesthetic and budget.',
    detail: 'Step 2: Selection'
  },
  { 
    icon: FiSettings, 
    number: '03', 
    title: 'Factory Fabrication', 
    description: 'Our expert team cuts, finishes, and assembles your high-quality aluminium frames in our local workshop.',
    detail: 'Step 3: Building'
  },
  { 
    icon: FiCheckCircle, 
    number: '04', 
    title: 'Professional Installation', 
    description: 'We securely and cleanly install your new windows, doors, or partitions directly into your space with guaranteed finishing.',
    detail: 'Step 4: Completion'
  },
];

export default function Process() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // The 'start center' means the animation starts when the top of the container hits the center of the screen
  // The 'end center' means it ends when the bottom of the container hits the center of the screen
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  return (
    <section id="process" className="relative py-24 md:py-32 bg-[#FAF9F6]">
      <SectionHeading 
        badge="METHODOLOGY" 
        title="Our Process" 
        align="center" 
      />
      
      <div 
        ref={containerRef}
        className="relative max-w-5xl mx-auto mt-24 px-4 sm:px-8 pb-10"
      >
        
        {/* The Track Background Line */}
        <div className="absolute left-8 md:left-1/2 top-4 bottom-0 w-[1px] bg-[#C4C5D5]/40 md:-translate-x-1/2" />
        
        {/* The Animated Draw Line (Scroll mapped) */}
        <motion.div 
          className="absolute left-8 md:left-1/2 top-4 bottom-0 w-[2px] bg-[#00288E] md:-translate-x-1/2 origin-top"
          style={{ scaleY: scrollYProgress }}
        />

        {STEPS.map((step, i) => {
          const isEven = i % 2 === 0;

          return (
            <div key={step.number} className={`relative flex flex-col md:flex-row items-center justify-between w-full mb-16 md:mb-32 ${isEven ? 'md:flex-row-reverse' : ''}`}>
              
              {/* Dot mapping directly on the line */}
              <div className="absolute left-5 md:left-1/2 top-0 md:top-1/2 -translate-y-1/2 md:-translate-x-1/2 z-10 flex">
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: false, margin: "-20%" }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-[#C4C5D5] bg-white shadow-md flex items-center justify-center text-[#00288E]"
                >
                   <step.icon size={20} />
                </motion.div>
              </div>

              {/* Spacing half */}
              <div className="hidden md:block w-[45%]" />

              {/* The Modular Card */}
              <motion.div 
                 initial={{ opacity: 0, x: isEven ? 40 : -40 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: false, margin: "-15%" }}
                 transition={{ duration: 0.6, ease: "easeOut" }}
                 className="w-full md:w-[45%] pl-[4.5rem] sm:pl-20 md:pl-0"
              >
                 <div className="relative p-6 px-7 md:p-10 rounded-2xl lg:rounded-3xl border border-[#C4C5D5]/20 bg-[#F4F3F1] shadow-sm hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)] transition-all duration-500 group overflow-hidden">
                    
                    {/* Giant Watermark Number */}
                    <div className="absolute -top-4 -right-2 text-[120px] font-heading font-black text-[#1A1C1A]/[0.02] select-none pointer-events-none group-hover:scale-110 transition-transform duration-700">
                      {step.number}
                    </div>

                    <div className="relative z-10 flex flex-col h-full">
                       <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#00288E] mb-4">
                         {step.detail}
                       </span>
                       
                       <h3 className="text-2xl md:text-3xl font-heading font-bold text-[#1A1C1A] mb-4 leading-tight">
                         {step.title}
                       </h3>
                       
                       <p className="text-[#444653] font-medium leading-relaxed text-sm md:text-base">
                         {step.description}
                       </p>
                    </div>
                 </div>
              </motion.div>

            </div>
          )
        })}

      </div>
    </section>
  );
}
