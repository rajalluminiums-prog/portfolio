import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';

const NAV_LINKS = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Materials', href: '#materials' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeHash, setActiveHash] = useState('#hero');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      
      // Simple scroll spy logic
      const sections = NAV_LINKS.map(link => document.querySelector(link.href));
      let current = '#hero';
      for (const section of sections) {
        if (section instanceof HTMLElement) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 100) {
            current = `#${section.id}`;
          }
        }
      }
      setActiveHash(current);
    };
    
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setActiveHash(href);
    setMobileOpen(false);

    const target = document.querySelector(href);
    if (!target) return;

    // Use native lenis scrollTo targeting the DOM element directly
    const lenis = (window as any).lenis;
    if (lenis) {
      lenis.scrollTo(target, { offset: -100, duration: 1.2 });
    } else {
      // Fallback
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  }, []);

  return (
    <div className={`fixed left-0 right-0 z-50 flex justify-center pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${scrolled ? 'top-2 md:top-4' : 'top-6 md:top-8 lg:top-10'}`}>
      <motion.nav
        className="pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          width: scrolled ? '80%' : '100%',
          maxWidth: '1320px',
          borderRadius: scrolled ? '9999px' : '0',
          backgroundColor: scrolled ? 'rgba(250, 249, 246, 0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
          boxShadow: scrolled ? '0 12px 32px rgba(26,28,26,0.06)' : 'none',
          border: scrolled ? '1px solid rgba(196,197,213,0.3)' : '1px solid transparent',
        }}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="px-6 md:px-8 flex items-center justify-between h-16 md:h-[72px]">
          {/* Logo & Separator */}
          <div className="flex items-center gap-4">
            {/* Brand Logo Identity */}
            <a href="#hero" onClick={(e) => handleNavClick(e, '#hero')} className="flex items-center gap-3 group">
              <img 
                src="/logo.png" 
                alt="Raj Alluminiums Logo" 
                className="w-10 h-10 rounded-xl object-contain transition-transform group-hover:scale-105 border border-[#1A1C1A]/10 shadow-sm bg-white"
              />
              <div className="hidden sm:block">
                <p className={`font-heading font-bold text-sm leading-tight transition-colors ${scrolled ? 'text-[#1A1C1A]' : 'text-white'}`}>Raj Alluminiums</p>
                <p className={`text-[9px] font-bold tracking-[0.15em] uppercase transition-colors ${scrolled ? 'text-[#757684]' : 'text-white/70'}`}>& Door House</p>
              </div>
            </a>
            
            {/* Vertical Separator */}
            <div className={`hidden lg:block w-px h-8 transition-colors ${scrolled ? 'bg-[#C4C5D5]' : 'bg-white'} opacity-40 mx-2`} />
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`link-underline px-3 py-2 text-[0.9375rem] font-medium transition-colors ${
                  activeHash === link.href 
                    ? (scrolled ? 'active text-[#00288E]' : 'active text-white') 
                    : (scrolled ? 'text-[#444653] hover:text-[#00288E]' : 'text-white/80 hover:text-white')
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <Button size="sm" className="hidden md:flex">Get Quote</Button>
            <button
              className={`lg:hidden p-2 transition-colors ${scrolled ? 'text-[#1A1C1A]' : 'text-white'}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden flex flex-col items-center justify-center gap-6 pointer-events-auto"
            style={{ backgroundColor: 'rgba(250, 249, 246, 0.98)', backdropFilter: 'blur(24px)' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {NAV_LINKS.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                className="text-2xl font-heading font-bold text-[#1A1C1A]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={(e) => handleNavClick(e, link.href)}
              >
                {link.label}
              </motion.a>
            ))}
            <Button className="mt-4" onClick={() => setMobileOpen(false)}>Get Quote</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
