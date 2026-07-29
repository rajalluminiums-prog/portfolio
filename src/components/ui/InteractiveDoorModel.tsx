import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useState } from 'react';

interface InteractiveDoorModelProps {
  width?: number; 
  height?: number; 
  doorType?: 'Sliding' | 'Openable' | string;
}

export default function InteractiveDoorModel({ 
  width = 3, 
  height = 7,
  doorType = 'Openable'
}: InteractiveDoorModelProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Mouse tracking for glare effect
  const mouseX = useMotionValue(150);
  const mouseY = useMotionValue(250);
  const smoothX = useSpring(mouseX, { damping: 30, stiffness: 150 });
  const smoothY = useSpring(mouseY, { damping: 30, stiffness: 150 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  // Dynamic sizing based on dimensions!
  // Normal door is usually ~3x7 (ratio 0.42)
  const safeWidth = Math.max(1, width);
  const safeHeight = Math.max(1, height);
  const ratio = Math.max(0.35, Math.min(1.2, safeWidth / safeHeight));
  
  const containerHeight = 440;
  const containerWidth = containerHeight * ratio;
  
  const DimensionOverlay = () => (
    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-20" style={{ transform: 'translateZ(50px)' }}>
      <g className="text-ink/40 font-mono text-sm tracking-widest transition-opacity duration-300">
        <line x1="0" y1="-30" x2="100%" y2="-30" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
        <path d={`M 0 -35 L 0 -25`} stroke="currentColor" strokeWidth="2" />
        <path d={`M 100% -35 L 100% -25`} stroke="currentColor" strokeWidth="2" />
        <rect x="50%" y="-40" width="80" height="20" fill="#FAFAFA" transform="translate(-40, 0)" />
        <text x="50%" y="-26" textAnchor="middle" fill="currentColor" fontWeight="bold">{width}' W</text>

        <line x1="100%" y1="0" x2="100%" y2="100%" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" transform="translate(30, 0)" />
        <path d={`M 25 0 L 35 0`} stroke="currentColor" strokeWidth="2" transform="translate(100%, 0)" />
        <path d={`M 25 100% L 35 100%`} stroke="currentColor" strokeWidth="2" transform="translate(100%, 0)" />
        <rect x="100%" y="50%" width="20" height="60" fill="#FAFAFA" transform="translate(20, -30)" />
        <text x="100%" y="50%" textAnchor="middle" fill="currentColor" fontWeight="bold" transform="translate(34, 0) rotate(-90) translate(-50%, -100%)" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>{height}' H</text>
      </g>
    </svg>
  );

  return (
    <div 
      className="w-full h-full min-h-[500px] flex items-center justify-center cursor-pointer relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      <div className="absolute top-0 right-0 bg-primary text-white text-[10px] uppercase font-bold px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 tracking-widest z-30 shadow-sm">
        Interactive Preview
      </div>

      {/* True 3D Perspective Container */}
      <div 
        className="relative transition-all duration-500 ease-in-out"
        style={{ 
          width: containerWidth, 
          height: containerHeight,
          perspective: '1200px', // Perfect 3D vanishing point
          transformStyle: 'preserve-3d'
        }}
      >
        <DimensionOverlay />

        {doorType === 'Openable' ? (
          <>
            {/* OUTER FRAME */}
            <div className="absolute inset-0 bg-[#E8EDF0] border-[24px] border-[#B0B5B9] shadow-[inset_0_0_10px_rgba(0,0,0,0.1),0_20px_40px_rgba(0,0,0,0.1)] transition-shadow duration-700">
              <div className="absolute inset-0 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.5),inset_-2px_-2px_4px_rgba(0,0,0,0.2)] pointer-events-none"></div>
            </div>

            {/* DARK ROOM BACKGROUND (Shows when door opens inward) */}
            <div className="absolute top-[24px] bottom-[24px] left-[24px] right-[24px] bg-[#1a1c1d] shadow-[inset_0_10px_30px_rgba(0,0,0,0.8)] z-0">
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            </div>

            {/* SWINGING DOOR PANEL (True 3D HTML Node) */}
            <motion.div
              className="absolute top-[24px] bottom-[24px] left-[24px] right-[24px] bg-[#B5B9BD] flex flex-col shadow-lg border border-[#90959A] z-10"
              style={{ 
                transformOrigin: "right center", // Hinges on the right!
                transformStyle: "preserve-3d" 
              }}
              initial={{ rotateY: 0 }}
              animate={{ rotateY: isHovered ? 65 : 0 }} // POSITIVE rotation swings the left side INWARD (into the background)
              transition={{ type: "spring", stiffness: 45, damping: 14 }}
            >
              {/* Bevel for the door panel */}
              <div className="absolute inset-0 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4),inset_-1px_-1px_2px_rgba(0,0,0,0.2)] pointer-events-none z-10"></div>

              {/* Top Glass Section */}
              <div className="flex-[0.55] m-[16px] mb-[8px] bg-[#E1ECEF] border-[4px] border-[#111] relative overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.1)]">
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/5 to-white/20 pointer-events-none"></div>
                <motion.div
                  className="absolute w-[200px] h-[200px] bg-white/40 rounded-full blur-2xl pointer-events-none"
                  style={{ x: smoothX, y: smoothY, translateX: '-50%', translateY: '-50%' }}
                />
              </div>

              {/* Solid Bottom Section */}
              <div className="flex-[0.45] m-[16px] mt-[8px] bg-[#525458] border-[4px] border-[#4A4C4F] shadow-inner relative">
                <div className="absolute inset-2 border border-[#404245] shadow-[inset_1px_1px_0_rgba(255,255,255,0.1)]"></div>
              </div>

              {/* Silver Lever Handle */}
              <div className="absolute left-[12px] top-1/2 -translate-y-1/2 w-[8px] h-[60px] bg-gradient-to-r from-[#E2E8F0] to-[#94A3B8] rounded-sm shadow-md border border-[#94A3B8]/50 z-20">
                <div className="absolute top-[20px] left-0 w-[24px] h-[8px] bg-gradient-to-b from-[#E2E8F0] to-[#94A3B8] rounded-r-full shadow-sm origin-left transform -translate-x-[4px]"></div>
              </div>
            </motion.div>
          </>
        ) : (
          <>
            {/* SLIDING DOOR */}
            {/* OUTER FRAME */}
            <div className="absolute inset-0 bg-[#E8EDF0] border-[24px] border-[#D1D5DB] shadow-[inset_0_0_10px_rgba(0,0,0,0.1),0_20px_40px_rgba(0,0,0,0.1)] transition-shadow duration-700">
              <div className="absolute inset-0 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.5),inset_-2px_-2px_4px_rgba(0,0,0,0.2)] pointer-events-none"></div>
              {/* Tracks */}
              <div className="absolute bottom-0 left-0 right-0 h-[16px] border-t border-[#9CA3AF] opacity-50 flex flex-col justify-evenly">
                <div className="w-full h-[1px] bg-[#9CA3AF]"></div>
                <div className="w-full h-[1px] bg-[#9CA3AF]"></div>
              </div>
            </div>

            {/* Right Fixed Panel (Back) */}
            <div className="absolute top-[24px] bottom-[24px] right-[24px] left-[50%] bg-[#E5E7EB] border border-[#9CA3AF] shadow-inner p-[16px]">
               <div className="w-full h-full bg-[#E1ECEF] border-[4px] border-[#111] relative overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.1)]">
                 <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/5 to-white/10 pointer-events-none"></div>
               </div>
            </div>

            {/* Left Sliding Panel (Front) */}
            <motion.div
              className="absolute top-[24px] bottom-[24px] left-[24px] w-[50%] bg-[#E5E7EB] border border-[#9CA3AF] shadow-lg p-[16px] z-10"
              initial={{ x: 0 }}
              animate={{ x: isHovered ? (containerWidth / 2) - 24 : 0 }}
              transition={{ type: "spring", stiffness: 50, damping: 15 }}
            >
              <div className="w-full h-full bg-[#E1ECEF] border-[4px] border-[#111] relative overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.1)]">
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/5 to-white/20 pointer-events-none"></div>
                <motion.div
                  className="absolute w-[200px] h-[200px] bg-white/40 rounded-full blur-2xl pointer-events-none"
                  style={{ x: smoothX, y: smoothY, translateX: '-50%', translateY: '-50%' }}
                />
              </div>

              {/* Vertical Smart Lock / Handle */}
              <div className="absolute left-[8px] top-1/2 -translate-y-1/2 w-[12px] h-[120px] bg-[#111] rounded-sm shadow-md">
                <div className="absolute right-[2px] top-1/2 -translate-y-1/2 w-[4px] h-[40px] bg-[#333] rounded-sm"></div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
