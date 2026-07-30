import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import SectionHeading from '../ui/SectionHeading';
import api from '../../api';

interface Project {
  _id: string;
  title: string;
  category: string;
  type: string;
  dims: string;
  imageUrl: string;
  altText: string;
  gridSpan: string;
}

export default function Portfolio() {
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  const fetchProjects = async (category: string) => {
    setLoading(true);
    try {
      const res = await api.get(`/api/gallery?category=${category}&limit=1000`);
      if (res.data.success) {
        setAllProjects(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load gallery', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(activeCategory);
  }, [activeCategory]);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  // Template engine: 1 large, 1 tall, 2 wide, 2 standard (6 items per page)
  const pages = useMemo(() => {
    const buckets: Record<string, Project[]> = { large: [], tall: [], wide: [], standard: [] };
    allProjects.forEach(p => {
      if (buckets[p.gridSpan]) buckets[p.gridSpan].push(p);
      else buckets['standard'].push(p);
    });

    const resultPages: Project[][] = [];
    while (buckets.large.length > 0 || buckets.tall.length > 0 || buckets.wide.length > 0 || buckets.standard.length > 0) {
      const page: Project[] = [];
      const popItems = (bucketName: string, count: number) => {
        for (let i = 0; i < count; i++) {
          if (buckets[bucketName].length > 0) page.push(buckets[bucketName].shift()!);
          else if (buckets['standard'].length > 0) page.push(buckets['standard'].shift()!);
          else if (buckets['wide'].length > 0) page.push(buckets['wide'].shift()!);
          else if (buckets['tall'].length > 0) page.push(buckets['tall'].shift()!);
          else if (buckets['large'].length > 0) page.push(buckets['large'].shift()!);
        }
      };
      
      popItems('large', 1);
      popItems('tall', 1);
      popItems('wide', 2);
      popItems('standard', 2);
      
      if (page.length > 0) resultPages.push(page);
    }
    return resultPages;
  }, [allProjects]);

  const currentProjects = pages.length > 0 ? pages[currentPage - 1] || [] : [];
  const totalPages = Math.max(1, pages.length);

  const getGridSpanClasses = (span: string) => {
    switch (span) {
      case 'wide': return 'col-span-1 md:col-span-2 row-span-1';
      case 'tall': return 'col-span-1 row-span-2';
      case 'large': return 'col-span-1 md:col-span-2 lg:col-span-2 row-span-2';
      case 'standard': 
      default:
        return 'col-span-1 row-span-1';
    }
  };

  const CATEGORIES = ['All', 'Windows', 'Doors', 'Partitions', 'Sliders', 'Profiles', 'Tuffan', 'Custom'];

  return (
    <section id="portfolio" className="relative overflow-hidden py-24 md:py-32 bg-[#F8FAFE] px-4 sm:px-6 md:px-8">
      <div className="max-w-[1400px] mx-auto relative z-10">
        <SectionHeading badge="Our Work" title="Projects That Speak" subtitle="A showcase of precision craftsmanship across residential, commercial, and architectural projects." />
        
        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mt-12 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`cursor-pointer px-5 py-2 md:px-6 md:py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${activeCategory === cat ? 'bg-ink text-white shadow-md' : 'bg-white text-ink/70 hover:bg-ink/5 hover:text-ink shadow-sm'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dynamic Bento Grid */}
        <div className="min-h-[600px] relative">
          {loading && allProjects.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 auto-rows-[280px] md:auto-rows-[300px] lg:auto-rows-[340px] grid-flow-row-dense">
              {['col-span-1 md:col-span-2 lg:col-span-2 row-span-2', 'col-span-1 row-span-2', 'col-span-1 md:col-span-2 row-span-1', 'col-span-1 row-span-1', 'col-span-1 row-span-1', 'col-span-1 md:col-span-2 row-span-1'].map((spanClass, i) => (
                <div key={i} className={`relative w-full h-full rounded-2xl md:rounded-3xl overflow-hidden bg-ink/5 animate-pulse ${spanClass}`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/10 to-transparent" />
                  <div className="absolute bottom-6 md:bottom-8 left-6 md:left-8 right-6 md:right-8">
                    <div className="h-6 md:h-8 bg-ink/10 rounded-md w-2/3 mb-4" />
                    <div className="flex gap-2">
                      <div className="h-6 w-20 bg-ink/10 rounded-full" />
                      <div className="h-6 w-24 bg-ink/10 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {currentProjects.length === 0 ? (
                <div className="text-center py-20 text-ink/50">
                  <p className="text-lg">No projects found in this category.</p>
                </div>
              ) : (
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 auto-rows-[280px] md:auto-rows-[300px] lg:auto-rows-[340px] grid-flow-row-dense" style={{ gridAutoFlow: 'row dense' }}>
                  <AnimatePresence mode="popLayout">
                    {currentProjects.map((proj) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
                        key={proj._id} 
                        className={`relative group w-full h-full rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-shadow ${getGridSpanClasses(proj.gridSpan)}`}
                      >
                        <motion.div className="w-full h-full" whileHover={{ scale: 1.015 }} transition={{ duration: 0.4 }}>
                          <img src={proj.imageUrl} alt={proj.altText} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 bg-ink/5" loading="lazy" />
                          
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
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-16">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-3 rounded-full bg-white text-ink shadow-sm hover:shadow-md disabled:opacity-50 transition-all"
            >
              <FiChevronLeft />
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${currentPage === i + 1 ? 'w-8 bg-primary' : 'bg-ink/20 hover:bg-ink/40'}`}
                />
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-3 rounded-full bg-white text-ink shadow-sm hover:shadow-md disabled:opacity-50 transition-all"
            >
              <FiChevronRight />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
