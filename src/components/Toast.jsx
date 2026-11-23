import { useState, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose, duration = 4000 }) {
  useEffect(() => {
    if (!duration) return;
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-[#008738]" />,
    warning: <AlertTriangle className="w-4 h-4 text-[#D97706]" />,
    info: <Info className="w-4 h-4 text-[#2563EB]" />,
  };

  const borderColors = {
    success: 'border-[#008738]/30 bg-[#F3FBEF] text-[#1F2937]',
    warning: 'border-[#D97706]/30 bg-[#FFFBEB] text-[#92400E]',
    info: 'border-[#2563EB]/30 bg-[#EFF6FF] text-[#1E40AF]',
  };

  return (
    <div className={`fixed bottom-5 right-5 z-[999] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-xs animate-in slide-in-from-bottom-3 duration-200 ${borderColors[type] || borderColors.success}`}>
      {icons[type] || icons.success}
      <span className="text-xs font-semibold">{message}</span>
      <button 
        onClick={onClose} 
        className="ml-2 p-1 rounded-md text-gray-400 hover:text-gray-700 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
