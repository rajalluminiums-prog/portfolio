import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Input({ label, className = '', ...props }: InputProps) {
  return (
    <div className={className}>
      <label className="text-xs font-bold uppercase tracking-wider mb-1.5 block text-text-muted">
        {label}
      </label>
      <input
        className="bg-white text-ink border border-transparent rounded-xl px-4 py-3 text-sm outline-none w-full transition-colors shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] focus:border-primary"
        {...props}
      />
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export function Textarea({ label, className = '', ...props }: TextareaProps) {
  return (
    <div className={className}>
      <label className="text-xs font-bold uppercase tracking-wider mb-1.5 block text-text-muted">
        {label}
      </label>
      <textarea
        className="bg-white text-ink border border-transparent rounded-xl px-4 py-3 text-sm outline-none w-full transition-colors shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] focus:border-primary resize-y"
        {...props}
      />
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];
}

export function Select({ label, options, className = '', ...props }: SelectProps) {
  return (
    <div className={className}>
      <label className="text-xs font-bold uppercase tracking-wider mb-1.5 block text-text-muted">
        {label}
      </label>
      <select
        className="bg-white text-ink border border-transparent rounded-xl px-4 py-3 text-sm outline-none w-full transition-colors shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] focus:border-primary"
        {...props}
      >
        {options.map((opt, i) => (
          <option key={opt} value={i === 0 ? '' : opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
