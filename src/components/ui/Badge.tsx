import { type ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'accent' | 'warm' | 'muted';
  className?: string;
}

const VARIANT_CLASSES: Record<string, string> = {
  primary: 'bg-primary/10 text-primary',
  accent: 'bg-ink/10 text-ink',
  outline: 'border border-muted text-text-muted bg-transparent',
  muted: 'bg-[#F4F3F1] text-text-muted',
};

export default function Badge({
  children,
  variant = 'primary',
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold font-heading tracking-wide uppercase ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
