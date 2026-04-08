import { motion } from 'framer-motion';
import SectionHeading from '../ui/SectionHeading';
import ScrollReveal from '../ui/ScrollReveal';
import portSliding from '../../assets/port_sliding_1775633986573.png';
import portFolding from '../../assets/port_folding_1775634050817.png';
import portOffice from '../../assets/port_office_1775634082397.png';
import portCasement from '../../assets/port_casement_1775634121268.png';
import portCurtain from '../../assets/port_curtain_1775634151275.png';
import portCustom from '../../assets/port_custom_1775634174124.png';

interface Project { title: string; type: string; dims: string; image: string; span: string; }

const PROJECTS: Project[] = [
  { title: 'Modern Living Room', type: 'Premium Sliding Windows', dims: 'Clear Ambience', image: portSliding, span: 'md:col-span-2 md:row-span-2' },
  { title: 'Luxury Patio Connect', type: 'Bifold Folding Doors', dims: 'Outdoor Integration', image: portFolding, span: 'md:col-span-1' },
  { title: 'Corporate Boardroom', type: 'Glass & Aluminium Partition', dims: 'Sound Proofed', image: portOffice, span: 'md:col-span-1' },
  { title: 'Minimalist Bedroom', type: 'Casement Window', dims: 'Modern Ventilation', image: portCasement, span: 'md:col-span-1' },
  { title: 'Luxury Double-Story', type: 'Structural Curtain Wall', dims: 'Maximum Light', image: portCurtain, span: 'md:col-span-2' },
  { title: 'Architectural Details', type: 'Custom Decorative Grill', dims: 'Precision Cut', image: portCustom, span: 'md:col-span-1' },
];

export default function Portfolio() {
  return (
    <section id="portfolio" className="relative overflow-hidden" style={{ padding: '5rem 0', backgroundColor: '#F8FAFE' }}>
      <div className="section-container relative z-10">
        <SectionHeading badge="Our Work" title="Projects That Speak" subtitle="A showcase of precision craftsmanship across residential, commercial, and architectural projects." />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[200px] md:auto-rows-[220px]">
          {PROJECTS.map((proj, i) => (
            <ScrollReveal key={proj.title} delay={0} className={proj.span} parallax={i % 2 === 0}>
              <motion.div className="relative group w-full h-full rounded-2xl overflow-hidden cursor-pointer shadow-lg" whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
                <img src={proj.image} alt={proj.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                  <p className="text-white font-heading font-bold text-lg">{proj.title}</p>
                  <p className="text-white/70 text-sm">{proj.type} · {proj.dims}</p>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
