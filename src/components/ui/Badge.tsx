import { type ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'accent' | 'warm' | 'muted';
  className?: string;
}

const VARIANT_STYLES: Record<string, React.CSSProperties> = {
  primary: { backgroundColor: 'rgba(0,40,142,0.1)', color: '#00288E' },
  accent: { backgroundColor: 'rgba(26,28,26,0.1)', color: '#1A1C1A' },
  outline: { border: '1px solid #C4C5D5', color: '#444653', backgroundColor: 'transparent' },
  muted: { backgroundColor: '#F4F3F1', color: '#444653' },
};

export default function Badge({
  children,
  variant = 'primary',
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold font-heading tracking-wide uppercase ${className}`}
      style={VARIANT_STYLES[variant]}
    >
      {children}
    </span>
  );
}
