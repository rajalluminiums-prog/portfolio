import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../ui/GlassCard';
import SectionHeading from '../ui/SectionHeading';
import ReviewSubmission from '../ui/ReviewSubmission';

interface Testimonial { authorName: string; authorRole?: string; content: string; ratingEmoji: string; numericValue?: number; }

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  { authorName: 'Rajesh Sharma', authorRole: 'Homeowner, Jaipur', content: 'Exceptional quality and craftsmanship. The sliding windows they installed transformed our living room. The team was professional, punctual, and the finish is flawless.', ratingEmoji: '🤩', numericValue: 5 },
  { authorName: 'Priya Mehta', authorRole: 'Interior Designer', content: 'As a designer, I need partners who understand aesthetics without compromising functionality. Their minimal profiles are a dream to work with. Highly recommended for modern spaces.', ratingEmoji: '😍', numericValue: 4.8 },
  { authorName: 'Amit Verma', authorRole: 'Architect', content: 'Highly recommend their thermal break windows. The sound insulation is brilliant, and the sleek look completely matches modern architectural needs. Will definitely partner again.', ratingEmoji: '🔥', numericValue: 5 },
  { authorName: 'Sunita Rao', authorRole: 'Homeowner, Delhi', content: 'We upgraded to their premium folding doors for our patio. It feels like an extension of our home now. Incredible service and amazing build quality!', ratingEmoji: '✨', numericValue: 4.9 },
];

const MAX_CONTENT_LENGTH = 160;

export default function Testimonials() {
  const [reviews, setReviews] = useState<Testimonial[]>(FALLBACK_TESTIMONIALS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get('/api/reviews/feed');
        if (response.data.success && response.data.data.length > 0) {
          setReviews(response.data.data);
        }
      } catch (error) {
        console.warn('Failed to fetch real-time reviews, using fallback.');
      }
    };
    fetchReviews();
  }, []);

  const itemsPerPage = 1;
  const totalPages = Math.ceil(reviews.length / itemsPerPage);
  const visibleReview = reviews[currentPage];
  
  const truncatedContent = visibleReview?.content.length > MAX_CONTENT_LENGTH 
    ? visibleReview.content.substring(0, MAX_CONTENT_LENGTH).trim() + '...' 
    : visibleReview?.content;

  const next = useCallback(() => setCurrentPage((c) => (c + 1) % reviews.length), [reviews.length]);
  
  useEffect(() => { 
    if (isHovered) return;
    const t = setInterval(next, 3000); 
    return () => clearInterval(t); 
  }, [next, isHovered]);

  return (
    <section id="testimonials" className="relative" style={{ padding: '5rem 0', backgroundColor: '#FAF9F6' }}>
      <div className="section-container relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Context & Action */}
          <div className="flex flex-col justify-center">
            <SectionHeading 
              align="left" 
              badge="Testimonials" 
              title="What Our Clients Say" 
              subtitle="Hear from homeowners, designers, and builders who trust our work." 
              className="!mb-8"
            />
            
            <div className="mt-8 flex justify-start">
              <div className="relative group cursor-pointer" onClick={() => setIsModalOpen(true)}>
                <div className="absolute -inset-2 bg-gradient-to-r from-[#00288E]/10 via-[#1A1C1A]/5 to-[#00288E]/10 rounded-full blur-md opacity-0 group-hover:opacity-100 transition duration-700" />
                <button 
                  className="relative flex items-center gap-5 bg-white border border-[#C4C5D5]/50 pl-5 pr-8 py-3.5 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.04)] group-hover:shadow-[0_12px_40px_rgba(0,40,142,0.08)] transition-all duration-300 group-hover:-translate-y-1 outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                  aria-label="Share your experience"
                >
                  <div className="w-[104px] flex-shrink-0">
                    <div className="flex -space-x-3 group-hover:space-x-[-0.5rem] transition-all duration-500">
                       <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#FAF9F6] border-2 border-white text-lg z-30 shadow-sm transform group-hover:-rotate-12 transition-transform duration-300" role="img">🤩</div>
                       <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#F4F3F1] border-2 border-white text-lg z-20 shadow-sm transform group-hover:rotate-6 transition-transform duration-300 delay-75" role="img">😍</div>
                       <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#EAE9E5] border-2 border-white text-lg z-10 shadow-sm transform group-hover:scale-110 transition-transform duration-300 delay-150" role="img">😊</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary leading-none mb-1">Your Turn</span>
                    <span className="text-sm font-heading font-extrabold text-ink leading-none group-hover:text-primary transition-colors">Share Your Experience</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Single Showcase Card */}
          <div 
            className="w-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {visibleReview && (
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="w-full"
              >
                <GlassCard variant="strong" className="p-8 md:p-12 text-left shadow-[0_10px_40px_rgba(0,0,0,0.03)] transition-shadow duration-500 bg-white/70 backdrop-blur-md relative overflow-hidden group min-h-[340px] md:min-h-[380px] flex flex-col justify-between">
                  
                  {/* Giant Emoji Watermark */}
                  {visibleReview.ratingEmoji !== '⭐️' && (
                    <div 
                      className="absolute right-[-10%] bottom-[-20%] text-[14rem] md:text-[20rem] leading-none opacity-[0.03] group-hover:opacity-[0.06] select-none pointer-events-none transform -rotate-12 filter grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
                      aria-hidden="true"
                    >
                      {visibleReview.ratingEmoji}
                    </div>
                  )}

                  {/* Header: Avatar, Name, Role, Rating */}
                  <div className="flex items-center gap-5 mb-6 relative z-10">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-ink/5 to-ink/10 flex items-center justify-center font-bold text-ink/60 text-xl shadow-inner flex-shrink-0">
                      {visibleReview.authorName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-heading font-bold text-ink text-lg md:text-xl">{visibleReview.authorName}</p>
                      <p className="text-sm text-text-muted mt-1">
                        {visibleReview.authorRole ? `${visibleReview.authorRole} ` : ''}
                        {visibleReview.authorRole && <span className="mx-2 text-gray-300">|</span>}
                        <span className="font-medium text-primary">{(visibleReview.numericValue || 5).toFixed(1)} ★</span>
                      </p>
                    </div>
                  </div>
                  
                  {/* Quote Mark Decoration */}
                  <span className="absolute top-8 right-8 text-6xl text-primary/5 font-serif leading-none select-none pointer-events-none">"</span>
                  
                  {/* Review Content */}
                  <div className="flex-grow flex items-center">
                    <p className="text-lg md:text-xl leading-relaxed text-ink/90 italic relative z-10 line-clamp-4">"{truncatedContent}"</p>
                  </div>
                  
                </GlassCard>
              </motion.div>
            )}

            {/* Pagination Dots */}
            {totalPages > 1 && (
              <div className="flex justify-start gap-2 mt-8">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${i === currentPage ? 'bg-primary w-8' : 'bg-[#C4C5D5]/50 hover:bg-[#C4C5D5] w-2'}`}
                    aria-label={`Page ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      <ReviewSubmission isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
