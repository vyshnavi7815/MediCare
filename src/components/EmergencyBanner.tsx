import React from 'react';
import { AlertTriangle, PhoneCall, ArrowRight } from 'lucide-react';

interface EmergencyBannerProps {
  onOpenEmergency: () => void;
}

export const EmergencyBanner: React.FC<EmergencyBannerProps> = ({ onOpenEmergency }) => {
  return (
    <aside aria-label="Emergency Medical Alert" className="bg-rose-900 text-rose-100 text-xs sm:text-sm px-4 py-2 border-b border-rose-800">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <span className="flex h-2 w-2 rounded-full bg-rose-400 animate-ping shrink-0" />
          <AlertTriangle className="w-4 h-4 text-rose-300 shrink-0 hidden sm:inline" />
          <span>
            <strong className="text-white font-semibold">Immediate Emergency Warning:</strong> For chest pain, stroke signs (FAST), severe breathing difficulty, or suicidal thoughts, call{' '}
            <a href="tel:911" className="underline font-bold text-white hover:text-rose-200">
              911
            </a>{' '}
            or visit the nearest ER immediately.
          </span>
        </div>
        <button
          onClick={onOpenEmergency}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-rose-800 hover:bg-rose-700 text-white rounded transition-colors shrink-0"
        >
          <PhoneCall className="w-3.5 h-3.5 text-rose-300" />
          <span>Emergency Protocols</span>
          <ArrowRight className="w-3 h-3 text-rose-300" />
        </button>
      </div>
    </aside>
  );
};
