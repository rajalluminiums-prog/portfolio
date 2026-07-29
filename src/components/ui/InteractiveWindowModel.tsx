import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useState } from 'react';

interface InteractiveWindowModelProps {
  width?: number; // Representing physical width proportionally
  height?: number; // Representing physical height proportionally
  trackCount?: 2 | 3;
  hasMesh?: boolean;
}

export default function InteractiveWindowModel({ 
  width = 6, 
  height = 5,
  trackCount = 3,
  hasMesh = true
}: InteractiveWindowModelProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Mouse tracking for glare effect
  const mouseX = useMotionValue(300);
  const mouseY = useMotionValue(300);
  const smoothX = useSpring(mouseX, { damping: 30, stiffness: 150 });
  const smoothY = useSpring(mouseY, { damping: 30, stiffness: 150 });

  // Base dimensions
  const ratio = Math.max(0.6, Math.min(1.8, width / height));
  const baseHeight = 500;
  const baseWidth = baseHeight * ratio;

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * (baseWidth + 120); 
    const y = ((e.clientY - rect.top) / rect.height) * (baseHeight + 120);
    mouseX.set(x - 60);
    mouseY.set(y - 60);
  };

  // Panel sizing
  const frameThickness = 24;
  const outerFrameThickness = 32;
  const panelWidth = (baseWidth / 2) + 12 - outerFrameThickness;
  const panelHeight = baseHeight - (outerFrameThickness * 2);

  // Staggered Animation variants
  const leftPanelVariants = {
    closed: { x: outerFrameThickness },
    open: { x: (baseWidth / 2) - outerFrameThickness + 10 }
  };

  const rightPanelVariants = {
    closed: { x: (baseWidth / 2) - 10 },
    open: { x: outerFrameThickness }
  };

  return (
    <div 
      className="w-full h-full min-h-[400px] flex items-center justify-center cursor-pointer relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute top-0 right-0 bg-primary text-white text-[10px] uppercase font-bold px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 tracking-widest z-10 shadow-sm">
        Interactive Preview
      </div>

      <svg 
        viewBox={`-60 -60 ${baseWidth + 120} ${baseHeight + 120}`} 
        className="w-full max-w-[500px] max-h-[400px] drop-shadow-xl transition-all duration-700 group-hover:drop-shadow-[0_20px_40px_rgba(0,0,0,0.1)]"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        onMouseMove={handleMouseMove}
      >
        <defs>
          {/* Static Glass Reflection */}
          <linearGradient id="glassReflection" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="30%" stopColor="rgba(255,255,255,0.05)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.5)" />
            <stop offset="70%" stopColor="rgba(255,255,255,0.05)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.15)" />
          </linearGradient>

          {/* Mouse Glare Blur */}
          <filter id="glareBlur">
            <feGaussianBlur stdDeviation="35" />
          </filter>

          <pattern id="meshPattern" width="3" height="3" patternUnits="userSpaceOnUse">
            <path d="M 3 0 L 0 3 M 0 0 L 3 3" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="0.4" />
          </pattern>

          {/* Frame bevel inner shadows */}
          <filter id="innerBevel">
            <feOffset dx="1" dy="1"/>
            <feGaussianBlur stdDeviation="2" result="offset-blur"/>
            <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
            <feFlood floodColor="black" floodOpacity="0.15" result="color"/>
            <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
            <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
          </filter>
        </defs>

        {/* DIMENSION LINES */}
        <g className="text-ink/40 font-mono text-sm tracking-widest transition-opacity duration-300">
          <line x1="0" y1="-40" x2={baseWidth} y2="-40" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
          <path d={`M 0 -45 L 0 -35`} stroke="currentColor" strokeWidth="2" />
          <path d={`M ${baseWidth} -45 L ${baseWidth} -35`} stroke="currentColor" strokeWidth="2" />
          <rect x={(baseWidth/2) - 40} y="-50" width="80" height="20" fill="#FAFAFA" />
          <text x={baseWidth/2} y="-36" textAnchor="middle" fill="currentColor" fontWeight="bold">{width}' W</text>

          <line x1={baseWidth + 40} y1="0" x2={baseWidth + 40} y2={baseHeight} stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
          <path d={`M ${baseWidth + 35} 0 L ${baseWidth + 45} 0`} stroke="currentColor" strokeWidth="2" />
          <path d={`M ${baseWidth + 35} ${baseHeight} L ${baseWidth + 45} ${baseHeight}`} stroke="currentColor" strokeWidth="2" />
          <rect x={baseWidth + 30} y={(baseHeight/2) - 30} width="20" height="60" fill="#FAFAFA" />
          <text x={baseWidth + 44} y={baseHeight/2} textAnchor="middle" fill="currentColor" fontWeight="bold" transform={`rotate(-90 ${baseWidth + 44} ${baseHeight/2})`}>{height}' H</text>
        </g>

        {/* 1. OUTER FRAME (Powder Coated White) */}
        <rect x="0" y="0" width={baseWidth} height={baseHeight} fill="#F0F0F0" stroke="#E2E2E2" strokeWidth="2" filter="url(#innerBevel)" />
        
        {/* Background / Outdoors */}
        <rect x={outerFrameThickness} y={outerFrameThickness} width={baseWidth - (outerFrameThickness * 2)} height={baseHeight - (outerFrameThickness * 2)} fill="#E8EDF0" />
        
        {/* 3 Track Bottom Frame */}
        <g stroke="#D0D0D0" strokeWidth="1.5">
          <line x1={outerFrameThickness} y1={baseHeight - outerFrameThickness + 6} x2={baseWidth - outerFrameThickness} y2={baseHeight - outerFrameThickness + 6} />
          {trackCount === 3 && <line x1={outerFrameThickness} y1={baseHeight - outerFrameThickness + 14} x2={baseWidth - outerFrameThickness} y2={baseHeight - outerFrameThickness + 14} />}
          <line x1={outerFrameThickness} y1={baseHeight - outerFrameThickness + 22} x2={baseWidth - outerFrameThickness} y2={baseHeight - outerFrameThickness + 22} />
        </g>

        {/* Back-Left Panel (Stationary / Base Glass) */}
        <g transform={`translate(${outerFrameThickness}, ${outerFrameThickness})`}>
          {/* White Frame */}
          <rect x="0" y="0" width={panelWidth} height={panelHeight} fill="#FAFAFA" stroke="#E0E0E0" strokeWidth="1" />
          <rect x="4" y="4" width={panelWidth - 8} height={panelHeight - 8} fill="#F4F4F4" stroke="#E5E5E5" />
          {/* Black Rubber Gasket */}
          <rect x={frameThickness} y={frameThickness} width={panelWidth - (frameThickness*2)} height={panelHeight - (frameThickness*2)} fill="#111" />
          {/* Glass */}
          <rect x={frameThickness + 3} y={frameThickness + 3} width={panelWidth - (frameThickness*2) - 6} height={panelHeight - (frameThickness*2) - 6} fill="#CFDFE8" opacity="0.6" />
        </g>

        {/* Middle-Right Panel (Sliding Glass) */}
        <motion.g
          variants={rightPanelVariants}
          initial="closed"
          animate={isHovered ? "open" : "closed"}
          transition={{ type: "spring", stiffness: 60, damping: 16 }}
        >
          {/* White Frame */}
          <rect y={outerFrameThickness} width={panelWidth} height={panelHeight} fill="#FAFAFA" stroke="#D5D5D5" strokeWidth="1" filter="url(#innerBevel)" />
          {/* Black Rubber Gasket */}
          <rect x={frameThickness} y={outerFrameThickness + frameThickness} width={panelWidth - (frameThickness*2)} height={panelHeight - (frameThickness*2)} fill="#1A1A1A" />
          
          {/* 5mm+12A+5mm double tempered clear glass */}
          <rect x={frameThickness + 3} y={outerFrameThickness + frameThickness + 3} width={panelWidth - (frameThickness*2) - 6} height={panelHeight - (frameThickness*2) - 6} fill="#E1ECEF" opacity="0.8" />
          <rect x={frameThickness + 3} y={outerFrameThickness + frameThickness + 3} width={panelWidth - (frameThickness*2) - 6} height={panelHeight - (frameThickness*2) - 6} fill="url(#glassReflection)" />
          
          {/* Interactive Mouse Glare (Glass) */}
          <clipPath id="rightGlassClip">
             <rect x={frameThickness + 3} y={outerFrameThickness + frameThickness + 3} width={panelWidth - (frameThickness*2) - 6} height={panelHeight - (frameThickness*2) - 6} />
          </clipPath>
          <g clipPath="url(#rightGlassClip)">
            <motion.circle 
              cx={smoothX} 
              cy={smoothY} 
              r="180" 
              fill="white" 
              opacity="0.4" 
              filter="url(#glareBlur)" 
            />
          </g>

          {/* Recessed Handle on right edge */}
          <rect x={panelWidth - 14} y={outerFrameThickness + (panelHeight / 2) - 40} width="8" height="80" fill="#D0D0D0" rx="4" />
          <rect x={panelWidth - 12} y={outerFrameThickness + (panelHeight / 2) - 25} width="4" height="50" fill="#888" rx="2" />
        </motion.g>

        {/* Front-Left Panel (Mesh Leaf) */}
        {hasMesh && (
          <motion.g
            variants={leftPanelVariants}
            initial="closed"
            animate={isHovered ? "open" : "closed"}
            transition={{ type: "spring", stiffness: 60, damping: 16, delay: 0.05 }}
          >
            {/* White Frame */}
            <rect y={outerFrameThickness} width={panelWidth} height={panelHeight} fill="#FAFAFA" stroke="#D0D0D0" strokeWidth="1" filter="url(#innerBevel)" />
            {/* Mesh Background */}
            <rect x={frameThickness} y={outerFrameThickness + frameThickness} width={panelWidth - (frameThickness*2)} height={panelHeight - (frameThickness*2)} fill="#111" opacity="0.3" />
            {/* Mesh Pattern */}
            <rect x={frameThickness} y={outerFrameThickness + frameThickness} width={panelWidth - (frameThickness*2)} height={panelHeight - (frameThickness*2)} fill="url(#meshPattern)" />
            
            {/* Mesh Glare */}
            <clipPath id="leftMeshClip">
               <rect x={frameThickness} y={outerFrameThickness + frameThickness} width={panelWidth - (frameThickness*2)} height={panelHeight - (frameThickness*2)} />
            </clipPath>
            <g clipPath="url(#leftMeshClip)">
              <motion.circle 
                cx={smoothX} 
                cy={smoothY} 
                r="180" 
                fill="white" 
                opacity="0.15" 
                filter="url(#glareBlur)" 
              />
            </g>

            {/* Mesh Leaf Handle (Protruding Stainless Steel) */}
            <path d={`M 14,${outerFrameThickness + (panelHeight / 2) - 40} C 6,${outerFrameThickness + (panelHeight / 2) - 40} 6,${outerFrameThickness + (panelHeight / 2) + 40} 14,${outerFrameThickness + (panelHeight / 2) + 40}`} fill="none" stroke="#C0C0C0" strokeWidth="6" strokeLinecap="round" />
            <rect x="12" y={outerFrameThickness + (panelHeight / 2) - 42} width="6" height="84" fill="#EAEAEA" rx="2" />
          </motion.g>
        )}

      </svg>
    </div>
  );
}
