import { motion, type HTMLMotionProps } from 'framer-motion';
import { type ReactNode } from 'react';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  className?: string;
}

const SIZE_CLASSES = {
  sm: 'px-5 py-2.5 text-sm rounded-xl gap-1.5',
  md: 'px-7 py-3.5 text-base rounded-xl gap-2',
  lg: 'px-9 py-4 text-lg rounded-2xl gap-2.5',
};

const VARIANT_STYLES: Record<string, React.CSSProperties> = {
  primary: {
    backgroundColor: '#00288E',
    color: '#FFFFFF',
    border: 'none',
    boxShadow: '0 4px 14px rgba(59, 130, 246, 0.35)',
  },
  outline: {
    backgroundColor: 'transparent',
    color: '#00288E',
    border: '2px solid #00288E',
    boxShadow: 'none',
  },
  ghost: {
    backgroundColor: 'transparent',
    color: '#00288E',
    border: 'none',
    boxShadow: 'none',
  },
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  style,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      className={`inline-flex items-center justify-center font-heading font-semibold cursor-pointer ${SIZE_CLASSES[size]} ${className}`}
      style={{ ...VARIANT_STYLES[variant], ...style }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </motion.button>
  );
}
