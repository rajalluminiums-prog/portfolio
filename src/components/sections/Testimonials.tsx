import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../ui/GlassCard';
import SectionHeading from '../ui/SectionHeading';
import ScrollReveal from '../ui/ScrollReveal';

interface Testimonial { name: string; role: string; text: string; rating: number; }

const TESTIMONIALS: Testimonial[] = [
  { name: 'Rajesh Sharma', role: 'Homeowner, Jaipur', text: 'Exceptional quality and craftsmanship. The sliding windows they installed transformed our living room. The team was professional, punctual, and the finish is flawless.', rating: 5 },
  { name: 'Priya Mehta', role: 'Interior Designer', text: 'I recommend Raj Alluminiums for all my projects. Their custom fabrication capabilities are outstanding, and they always deliver on time with perfect precision.', rating: 5 },
  { name: 'Anil Gupta', role: 'Builder & Developer', text: 'We have been working with Raj Alluminiums for 8+ years across 50+ projects. Consistent quality, competitive pricing, and reliable after-sales support.', rating: 5 },
  { name: 'Sunita Joshi', role: 'Homeowner, Jodhpur', text: 'The glass partitions they installed in our office are stunning. Beautiful design, soundproof, and installed within a week. Highly recommend their services.', rating: 5 },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const next = useCallback(() => setCurrent((c) => (c + 1) % TESTIMONIALS.length), []);
  useEffect(() => { const t = setInterval(next, 5000); return () => clearInterval(t); }, [next]);

  return (
    <section className="relative overflow-hidden" style={{ padding: '5rem 0', backgroundColor: '#FAF9F6' }}>
      <div className="section-container relative z-10">
        <SectionHeading badge="Testimonials" title="What Our Clients Say" subtitle="Hear from homeowners, designers, and builders who trust our work." />
        
        <ScrollReveal parallax={true} className="max-w-3xl mx-auto relative min-h-[260px]">
          <AnimatePresence mode="wait">
            <motion.div key={current} initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }}>
              <GlassCard variant="strong" className="p-8 md:p-10 text-center shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
                <div className="flex justify-center gap-1 mb-5">
                  {Array.from({ length: TESTIMONIALS[current].rating }).map((_, i) => (
                    <svg key={i} className="w-5 h-5" style={{ color: '#00288E' }} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-base md:text-lg leading-relaxed italic" style={{ color: '#475569' }}>"{TESTIMONIALS[current].text}"</p>
                <div className="mt-6">
                  <p className="font-heading font-bold" style={{ color: '#1A1C1A' }}>{TESTIMONIALS[current].name}</p>
                  <p className="text-sm" style={{ color: '#94A3B8' }}>{TESTIMONIALS[current].role}</p>
                </div>
              </GlassCard>
            </motion.div>
          </AnimatePresence>
          <div className="flex justify-center gap-2 mt-6">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="h-2.5 rounded-full transition-all cursor-pointer"
                style={{ backgroundColor: i === current ? '#00288E' : '#CBD5E1', width: i === current ? '2rem' : '0.625rem' }}
                aria-label={`Testimonial ${i + 1}`}
              />
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
