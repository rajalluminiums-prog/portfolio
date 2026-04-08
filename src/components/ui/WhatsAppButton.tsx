import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';

export default function WhatsAppButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-4 pointer-events-none">
      
      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white px-4 py-2.5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#C4C5D5]/20 pointer-events-auto"
          >
            <p className="text-[#1A1C1A] font-medium text-sm whitespace-nowrap">
              Chat with an Expert
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button */}
      <motion.a
        href="https://wa.me/918602379396?text=Hi%20Raj%20Alluminiums,%20I%20found%20you%20via%20your%20website%20and%20would%20love%20to%20get%20a%20Quote."
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto relative group flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#1EBE5A] rounded-full shadow-[0_8px_30px_rgba(37,211,102,0.4)] transition-colors duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 1 }}
      >
        {/* Infinite Pulse Ring */}
        <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-20 group-hover:opacity-0 transition-opacity" />
        
        {/* Actual Icon */}
        <FaWhatsapp size={28} className="text-white relative z-10" />
        
      </motion.a>
    </div>
  );
}
