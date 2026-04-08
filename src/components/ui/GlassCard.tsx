import { motion, type HTMLMotionProps } from 'framer-motion';
import { type ReactNode } from 'react';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  variant?: 'default' | 'strong' | 'subtle';
  hover?: boolean;
  className?: string;
}

const VARIANT_STYLES: Record<string, React.CSSProperties> = {
  default: {
    background: 'rgba(255, 255, 255, 0.65)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.45)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
    borderRadius: '1.25rem',
  },
  strong: {
    background: 'rgba(255, 255, 255, 0.88)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(255, 255, 255, 0.55)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
    borderRadius: '1.25rem',
  },
  subtle: {
    background: 'rgba(255, 255, 255, 0.40)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.30)',
    borderRadius: '1.25rem',
  },
};

export default function GlassCard({
  children,
  variant = 'default',
  hover = true,
  className = '',
  style,
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      className={className}
      style={{ ...VARIANT_STYLES[variant], ...style }}
      whileHover={hover ? {
        y: -4,
        boxShadow: '0 16px 48px rgba(0, 0, 0, 0.12)',
        transition: { duration: 0.3 },
      } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
}
