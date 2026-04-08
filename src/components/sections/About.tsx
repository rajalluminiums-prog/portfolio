import SectionHeading from '../ui/SectionHeading';
import ScrollFillText from '../ui/ScrollFillText';

export default function About() {
  return (
    <section id="about" className="py-32 relative bg-white">
      {/* Subtle top noise border */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C4C5D5]/30 to-transparent" />
      
      <div className="section-container relative z-10 flex flex-col items-center max-w-5xl">
        <SectionHeading 
          badge="OUR STORY" 
          title="Building Reliable Spaces" 
          align="center"
        />
        
        <div className="mt-16 w-full px-4 lg:px-8 max-w-5xl">
           <ScrollFillText 
             text="We believe your home and office deserve the best quality materials. For over 25 years, we have provided premium, long-lasting aluminium doors, windows, and custom partitions to customers across Indore. We don't just build frames; we create spaces you can trust."
             className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold leading-[1.2] tracking-tight text-center"
             baseColor="rgba(196, 197, 213, 0.3)"
             fillColor="#1A1C1A"
           />
        </div>

        {/* Modular Metrics Box */}
        <div className="mt-24 w-full grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="border border-[#C4C5D5]/20 rounded-3xl p-10 flex flex-col items-center justify-center bg-[#FAF9F6] shadow-sm hover:-translate-y-2 transition-transform duration-500">
             <span className="text-4xl md:text-5xl font-heading font-bold text-[#00288E]">25+</span>
             <span className="text-sm font-bold tracking-widest text-[#444653] uppercase mt-2">Years Trusted</span>
           </div>
           <div className="border border-[#C4C5D5]/20 rounded-3xl p-10 flex flex-col items-center justify-center bg-[#FAF9F6] shadow-sm hover:-translate-y-2 transition-transform duration-500">
             <span className="text-4xl md:text-5xl font-heading font-bold text-[#00288E]">1000+</span>
             <span className="text-sm font-bold tracking-widest text-[#444653] uppercase mt-2">Projects Finished</span>
           </div>
           <div className="border border-[#C4C5D5]/20 rounded-3xl p-10 flex flex-col items-center justify-center bg-[#FAF9F6] shadow-sm hover:-translate-y-2 transition-transform duration-500">
             <span className="text-4xl md:text-5xl font-heading font-bold text-[#00288E]">100%</span>
             <span className="text-sm font-bold tracking-widest text-[#444653] uppercase mt-2">Quality Guarantee</span>
           </div>
        </div>

      </div>
    </section>
  );
}
