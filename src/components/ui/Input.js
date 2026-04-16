import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Check } from 'lucide-react';

const Input = forwardRef(({ 
  label,
  error,
  success,
  helperText,
  icon,
  iconPosition = 'left',
  variant = 'default',
  size = 'md',
  className = '',
  ...props 
}, ref) => {
  const baseClasses = 'w-full rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    default: 'bg-[#0b0c10] border-gray-700 text-white placeholder-gray-400 focus:border-[#007bff] focus:ring-[#007bff]/50',
    filled: 'bg-[#1f1f1f] border-transparent text-white placeholder-gray-400 focus:bg-[#0b0c10] focus:border-[#007bff] focus:ring-[#007bff]/50',
    outline: 'bg-transparent border-gray-600 text-white placeholder-gray-400 focus:border-[#007bff] focus:ring-[#007bff]/50'
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-sm',
    lg: 'px-5 py-4 text-base'
  };

  const getStateClasses = () => {
    if (error) return 'border-red-500 focus:border-red-500 focus:ring-red-500/50';
    if (success) return 'border-green-500 focus:border-green-500 focus:ring-green-500/50';
    return variants[variant];
  };

  const classes = `${baseClasses} ${getStateClasses()} ${sizes[size]} ${icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : ''} ${className}`;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        <motion.input
          ref={ref}
          className={classes}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        {error && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
            <AlertCircle className="w-4 h-4" />
          </div>
        )}
        
        {success && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
            <Check className="w-4 h-4" />
          </div>
        )}
      </div>
      
      {(error || success || helperText) && (
        <motion.p 
          className={`text-xs ${error ? 'text-red-500' : success ? 'text-green-500' : 'text-gray-400'}`}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.2 }}
        >
          {error || success || helperText}
        </motion.p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
