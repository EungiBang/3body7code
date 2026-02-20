import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const Button = ({ children, variant = 'primary', className, onClick, disabled, ...props }) => {
  const baseStyles = "px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-brand-primary text-white hover:bg-blue-600 shadow-lg shadow-blue-500/30",
    secondary: "bg-brand-secondary text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/30",
    outline: "border-2 border-slate-200 text-slate-600 hover:border-brand-primary hover:text-brand-primary bg-transparent",
    ghost: "text-slate-500 hover:bg-slate-100",
    code: "bg-white border-2 hover:shadow-md" 
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={cn(baseStyles, variants[variant], className)}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export const Card = ({ children, className, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("glass-card p-6", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const ProgressBar = ({ progress, total, color = "bg-brand-primary" }) => {
  const percentage = Math.min(100, Math.max(0, (progress / total) * 100));
  
  return (
    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
      <motion.div 
        className={cn("h-full rounded-full transition-all duration-500", color)}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
      />
    </div>
  );
};
