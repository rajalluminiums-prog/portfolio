import { motion } from 'framer-motion';
import { FiFacebook, FiInstagram, FiMapPin, FiMail, FiPhone, FiClock, FiArrowUpRight } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import Badge from '../ui/Badge';

export default function Footer() {
  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#1A1C1A] text-[#E9E8E5] overflow-hidden pt-24 pb-8 noise-overlay">
      {/* Decorative Gradient Mesh overlay */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 80% 0%, rgba(0, 40, 142, 0.8) 0%, transparent 40%), radial-gradient(circle at 20% 100%, rgba(30, 64, 175, 0.5) 0%, transparent 50%)'
        }}
      />

      <div className="section-container relative z-10">
        
        {/* Top Editorial Brand Statement */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20 border-b border-[#C4C5D5]/10 pb-12">
          <div className="max-w-2xl">
            <motion.h2 
              className="text-headline md:text-display font-heading font-extrabold tracking-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Precision <br className="hidden md:block"/>
              <span className="text-[#C4C5D5]">Aluminium</span>, Lasting Quality.
            </motion.h2>
            <p className="text-lg text-[#C4C5D5] max-w-md">
              Elevating spaces through architectural-grade fabrications that blend invisible strength with visible elegance.
            </p>
          </div>
          <button 
            className="group w-24 h-24 rounded-full border border-[#C4C5D5]/20 flex flex-col items-center justify-center gap-1 transition-colors hover:bg-white/5 cursor-pointer"
            onClick={() => scrollToHeading('hero')}
          >
            <FiArrowUpRight className="w-6 h-6 text-[#C4C5D5] group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
            <span className="text-xs tracking-wider uppercase">Top</span>
          </button>
        </div>

        {/* Asymmetric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20 mb-20">
          
          {/* Col 1: Brand Info (Spans 4) */}
          <div className="md:col-span-4 lg:col-span-4 flex flex-col items-start">
            <div className="flex items-center gap-3 mb-6">
              <img 
                src="/logo.png" 
                alt="Raj Alluminiums Logo" 
                className="w-12 h-12 rounded-xl object-contain border border-[#C4C5D5]/20 shadow-sm bg-[#FAF9F6] p-0.5"
              />
              <div>
                <p className="font-heading font-bold text-lg leading-tight text-white">Raj Alluminiums</p>
                <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#C4C5D5]">& Door House</p>
              </div>
            </div>
            
            <p className="text-[#C4C5D5] mb-8 pr-4">
              Pioneering modern architectural fabrications since 2001. The trusted choice for architects and visionaries.
            </p>
            
            <div className="flex items-center gap-4">
              {[
                { icon: FiFacebook, link: '#' },
                { icon: FiInstagram, link: '#' },
                { icon: FaWhatsapp, link: 'https://wa.me/918602379396' }
              ].map((social, idx) => {
                const Icon = social.icon;
                return (
                  <a 
                    key={idx} 
                    href={social.link} 
                    target={social.link !== '#' ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full border border-[#C4C5D5]/15 flex items-center justify-center text-[#E9E8E5] transition-all hover:bg-[#00288E] hover:border-transparent"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Col 2: Navigation (Spans 3/2) */}
          <div className="md:col-span-3 lg:col-span-2 flex flex-col">
            <h4 className="font-heading font-bold text-white mb-6 tracking-wide">Directory</h4>
            <div className="flex flex-col gap-4 text-[#C4C5D5]">
              {['Home', 'About Us', 'Portfolio', 'Materials', 'Testimonials', 'Process'].map(item => (
                <a key={item} href={`#${item.toLowerCase().replace(' ', '')}`} className="hover:text-white transition-colors link-underline w-fit">
                  {item}
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 lg:col-span-2 flex flex-col">
            <h4 className="font-heading font-bold text-white mb-6 tracking-wide">Services</h4>
            <div className="flex flex-col gap-4 text-[#C4C5D5]">
              <a href="#services" className="hover:text-white transition-colors w-fit">Architectural Windows</a>
              <a href="#services" className="hover:text-white transition-colors w-fit">Premium Entrances</a>
              <a href="#services" className="hover:text-white transition-colors w-fit">Structural Glazing</a>
              <a href="#services" className="hover:text-white transition-colors w-fit">Custom Partitions</a>
            </div>
          </div>

          {/* Col 3: Contact (Spans 4) */}
          <div className="md:col-span-3 lg:col-span-4 flex flex-col">
            <Badge variant="primary" className="w-fit mb-6 bg-white/5 border border-white/10 text-white font-normal hover:bg-white/10 transition">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Available for new projects
              </span>
            </Badge>
            
            <div className="flex flex-col gap-5 text-[#C4C5D5]">
              <address className="flex items-start gap-4 not-italic">
                <FiMapPin className="w-5 h-5 text-[#C4C5D5] shrink-0 mt-1" />
                <p>187, GNT Market<br />Indore, Madhya Pradesh 452002</p>
              </address>
              <div className="flex items-center gap-4">
                <FiPhone className="w-5 h-5 text-[#C4C5D5] shrink-0" />
                <p>+91 8602379396</p>
              </div>
              <div className="flex items-center gap-4">
                <FiMail className="w-5 h-5 text-[#C4C5D5] shrink-0" />
                <p>rajalluminiums@gmail.com</p>
              </div>
              <div className="flex items-center gap-4 mt-2 pt-4 border-t border-[#C4C5D5]/10">
                <FiClock className="w-5 h-5 text-[#C4C5D5]/50 shrink-0" />
                <p className="text-sm">Mon - Sat: 9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#C4C5D5]/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[#C4C5D5]/60">
          <p>&copy; {new Date().getFullYear()} Raj Alluminiums & Door House. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <p>Designed by <a href="https://www.crewvia.in" className="text-white hover:underline">Crewvia</a></p>
          </div>
        </div>
      </div>
    </footer>
  );
}
