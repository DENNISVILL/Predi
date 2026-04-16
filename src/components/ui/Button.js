import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false,
  icon,
  iconPosition = 'left',
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-[#007bff] to-[#00ff9d] text-white hover:shadow-lg focus:ring-[#007bff]/50',
    secondary: 'bg-[#1f1f1f] text-white border border-gray-700 hover:bg-[#2a2a2a] hover:border-gray-600 focus:ring-gray-500/50',
    ghost: 'text-gray-400 hover:text-white hover:bg-white/10 focus:ring-white/20',
    danger: 'bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white hover:shadow-lg focus:ring-red-500/50',
    success: 'bg-gradient-to-r from-[#10b981] to-[#059669] text-white hover:shadow-lg focus:ring-green-500/50',
    outline: 'border-2 border-[#007bff] text-[#007bff] hover:bg-[#007bff] hover:text-white focus:ring-[#007bff]/50'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
    xl: 'px-8 py-4 text-lg gap-3'
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <motion.button
      className={classes}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {!loading && icon && iconPosition === 'left' && icon}
      {children}
      {!loading && icon && iconPosition === 'right' && icon}
    </motion.button>
  );
};

export default Button;
