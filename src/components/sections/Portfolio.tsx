import { motion } from 'framer-motion';
import SectionHeading from '../ui/SectionHeading';
import ScrollReveal from '../ui/ScrollReveal';
import portSliding from '../../assets/port_sliding_1775633986573.png';
import portFolding from '../../assets/port_folding_1775634050817.png';
import portOffice from '../../assets/port_office_1775634082397.png';
import portCasement from '../../assets/port_casement_1775634121268.png';
import portCurtain from '../../assets/port_curtain_1775634151275.png';
import portCustom from '../../assets/port_custom_1775634174124.png';

interface Project { title: string; type: string; dims: string; image: string; span: string; alt: string; }

const PROJECTS: Project[] = [
  { title: 'Modern Living Room', type: 'Premium Sliding Windows', dims: 'Clear Ambience', image: portSliding, span: 'col-span-1 md:col-span-2 lg:col-span-2 row-span-1 md:row-span-2', alt: 'Premium Aluminium Sliding Windows installation for living room in Indore' },
  { title: 'Luxury Patio Connect', type: 'Bifold Folding Doors', dims: 'Outdoor Integration', image: portFolding, span: 'col-span-1 md:col-span-1 lg:col-span-1 row-span-1', alt: 'Aluminium Bifold Folding Doors connecting patio and living space in Indore' },
  { title: 'Corporate Boardroom', type: 'Glass & Aluminium Partition', dims: 'Sound Proofed', image: portOffice, span: 'col-span-1 md:col-span-1 lg:col-span-1 row-span-1', alt: 'Custom Office Cabin and glass aluminium partition work in Indore' },
  { title: 'Minimalist Bedroom', type: 'Casement Window', dims: 'Modern Ventilation', image: portCasement, span: 'col-span-1 md:col-span-1 lg:col-span-1 row-span-1', alt: 'Aluminium openable casement windows for modern bedroom in Indore' },
  { title: 'Luxury Double-Story', type: 'Structural Curtain Wall', dims: 'Maximum Light', image: portCurtain, span: 'col-span-1 md:col-span-1 lg:col-span-2 row-span-1', alt: 'Structural glazing and curtain wall aluminium fabrication project in Indore' },
  { title: 'Architectural Details', type: 'Custom Decorative Grill', dims: 'Precision Cut', image: portCustom, span: 'col-span-1 md:col-span-2 lg:col-span-3 row-span-1', alt: 'Custom decorative aluminium fabrication and partition work in Indore' },
];

export default function Portfolio() {
  return (
    <section id="portfolio" className="relative overflow-hidden py-24 md:py-32 bg-[#F8FAFE] px-4 sm:px-6 md:px-8">
      <div className="max-w-[1400px] mx-auto relative z-10">
        <SectionHeading badge="Our Work" title="Projects That Speak" subtitle="A showcase of precision craftsmanship across residential, commercial, and architectural projects." />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 auto-rows-[280px] md:auto-rows-[300px] lg:auto-rows-[340px] mt-12 md:mt-16">
          {PROJECTS.map((proj) => (
            <ScrollReveal key={proj.title} delay={0} className={`${proj.span} w-full h-full`}>
              <motion.div className="relative group w-full h-full rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-500" whileHover={{ scale: 1.015 }} transition={{ duration: 0.4 }}>
                <img src={proj.image} alt={proj.alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                
                {/* Gradient overlay gets stronger on hover to highlight text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
                
                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                  <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-white font-heading font-extrabold text-xl md:text-2xl lg:text-3xl tracking-tight mb-2 drop-shadow-md">{proj.title}</p>
                    <div className="flex flex-wrap items-center gap-2 md:gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      <span className="bg-white/20 backdrop-blur-md px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs text-white uppercase tracking-widest font-bold border border-white/20">
                        {proj.type}
                      </span>
                      <span className="bg-black/40 backdrop-blur-md px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs text-white uppercase tracking-widest font-bold border border-white/10">
                        {proj.dims}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
