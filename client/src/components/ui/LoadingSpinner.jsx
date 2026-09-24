import React from 'react';

export default function LoadingSpinner({ label = 'Loading...', fullScreen = false }) {
  const spinner = (
    <div className="flex flex-col items-center justify-center space-y-3 p-6">
      <div className="relative w-12 h-12">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-500/20 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      {label && <p className="text-xs font-medium text-slate-400 tracking-wide">{label}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
}
