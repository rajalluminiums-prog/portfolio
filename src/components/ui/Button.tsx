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

const VARIANT_CLASSES: Record<string, string> = {
  primary: 'bg-primary text-white border-none shadow-[0_4px_14px_rgba(59,130,246,0.35)]',
  outline: 'bg-transparent text-primary border-2 border-primary shadow-none',
  ghost: 'bg-transparent text-primary border-none shadow-none hover:bg-primary/5',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <motion.button
      className={`inline-flex items-center justify-center font-heading font-semibold cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${SIZE_CLASSES[size]} ${VARIANT_CLASSES[variant]} ${className}`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </motion.button>
  );
}
