import React from 'react';
import StudyTwinLogo from '../brand/StudyTwinLogo';

export default function LoadingSpinner({ label = 'Initializing Digital Twin...', fullScreen = false }) {
  const spinner = (
    <div className="flex flex-col items-center justify-center space-y-4 p-6">
      <StudyTwinLogo variant="compact" size="lg" animated />
      {label && <p className="text-xs font-semibold text-violet-300 tracking-wider uppercase animate-pulse">{label}</p>}
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
