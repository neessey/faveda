import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { toast } = useStore();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-[#2C4A32] shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-700 shrink-0" />,
    info: <Info className="w-5 h-5 text-[#5E6E60] shrink-0" />,
  };

  const borderColors = {
    success: 'border-[#2C4A32]/30 bg-[#F4EFE6]',
    error: 'border-red-300 bg-red-50 text-red-900',
    info: 'border-[#E5DFD3] bg-[#FBF9F5] text-[#1A261D]',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${borderColors[toast.type]}`}
      >
        {icons[toast.type]}
        <p className="text-sm font-medium text-[#1A261D]">{toast.message}</p>
      </div>
    </div>
  );
};
