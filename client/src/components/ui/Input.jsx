import React from 'react';

export default function Input({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder = '',
  error = '',
  required = false,
  className = '',
  icon: Icon,
  ...props
}) {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="block text-xs font-bold text-slate-300 dark:text-slate-300 light:text-slate-700 uppercase tracking-wider">
          {label} {required && <span className="text-rose-400">*</span>}
        </label>
      )}
      <div className="relative rounded-xl shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-400 light:text-slate-500">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full glass-input border ${
            error ? 'border-rose-500/80 focus:ring-rose-500' : 'border-emerald-500/30 focus:border-emerald-400 focus:ring-lime-400/30'
          } rounded-xl ${Icon ? 'pl-10' : 'px-4'} py-2.5 text-sm text-slate-100 dark:text-white light:text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-200 ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-rose-400 mt-1 font-medium">{error}</p>}
    </div>
  );
}
