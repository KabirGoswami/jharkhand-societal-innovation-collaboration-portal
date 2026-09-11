import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'accent' | 'danger';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-all cursor-pointer disabled:opacity-50 active:scale-95';

  const variants = {
    primary: 'bg-blue-700 hover:bg-blue-600 text-white',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300',
    success: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    accent: 'bg-purple-700 hover:bg-purple-600 text-white',
    danger: 'bg-red-600 hover:bg-red-500 text-white',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl border border-slate-200 p-5 shadow-xs ${className}`}>
    {children}
  </div>
);

export const SectionHeading: React.FC<{
  children: React.ReactNode;
  subtitle?: string;
  variant?: 'default' | 'editorial' | 'dark';
  className?: string;
}> = ({ children, subtitle, variant = 'default', className = '' }) => {
  const variants = {
    default: 'text-xl font-bold tracking-tight text-slate-900',
    editorial: 'font-editorial-serif italic text-2xl sm:text-3xl font-bold tracking-tight text-white',
    dark: 'text-xl font-bold tracking-tight text-white',
  };

  return (
    <div className={`space-y-1 ${className}`}>
      <h2 className={variants[variant]}>{children}</h2>
      {subtitle && (
        <p className={`text-xs ${variant === 'editorial' ? 'text-stone-400 font-serif italic' : 'text-slate-500'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};
