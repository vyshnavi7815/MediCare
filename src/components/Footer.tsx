import React from 'react';
import { HeartPulse, PhoneCall, ShieldCheck, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  onOpenPolicy: (type: 'disclaimer' | 'privacy' | 'terms') => void;
  onOpenEmergency: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenPolicy, onOpenEmergency }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 shadow-md">
                <HeartPulse className="w-6 h-6 text-slate-950" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white">MediCare AI</span>
                <span className="block text-xs font-medium text-teal-400">Clinical Intelligence & Telehealth</span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed pr-6">
              Empowering patients with reliable health education, streamlined appointment scheduling, and direct access to board-certified medical specialists.
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-1.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
                <span>450 Healthcare Way, Suite 100, Metro City, CA 90210</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span>support@medicare-ai.health</span>
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Patient Services</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => {
                    setActiveTab('assistant');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-teal-400 transition-colors text-left"
                >
                  AI Health Assistant
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('doctors');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-teal-400 transition-colors text-left"
                >
                  Find a Doctor
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('appointments');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-teal-400 transition-colors text-left"
                >
                  Book Appointment
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('resources');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-teal-400 transition-colors text-left"
                >
                  Health Resources Library
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('dashboard');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-teal-400 transition-colors text-left"
                >
                  Patient Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Clinical Specialties */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Clinical Specialties</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>Cardiology & Heart Health</li>
              <li>Neurology & Cognitive Care</li>
              <li>Pediatrics & Family Medicine</li>
              <li>Dermatology & Cutaneous Care</li>
              <li>Endocrinology & Diabetes</li>
              <li>Orthopedic Surgery & Sports PT</li>
            </ul>
          </div>

          {/* Emergency & Governance */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-rose-400 mb-4 flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-rose-400" />
              <span>Emergency Lines</span>
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-rose-950/60 border border-rose-900/60 rounded-xl text-rose-200">
                <span className="font-bold text-white block text-sm">Call 911 / 112</span>
                <span>For acute chest pain, stroke symptoms, severe breathing distress.</span>
              </div>
              <button
                onClick={onOpenEmergency}
                className="w-full text-center py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
              >
                View Emergency Checklist →
              </button>
            </div>
          </div>
        </div>

        {/* Regulatory & Disclaimer Sub-footer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>© 2026 MediCare AI Systems. All rights reserved. Educational Healthcare Platform.</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => onOpenPolicy('disclaimer')}
              className="hover:text-white underline underline-offset-4 transition-colors"
            >
              Medical Disclaimer
            </button>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <button
              onClick={() => onOpenPolicy('privacy')}
              className="hover:text-white underline underline-offset-4 transition-colors"
            >
              Privacy Policy
            </button>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <button
              onClick={() => onOpenPolicy('terms')}
              className="hover:text-white underline underline-offset-4 transition-colors"
            >
              Terms of Use
            </button>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400 leading-relaxed text-center">
          <strong>Mandatory Notice:</strong> MediCare AI provides healthcare education and digital logistics services. Information provided by the artificial intelligence assistant is not a medical diagnosis, clinical prescription, or emergency medical treatment. Always consult a licensed physician or contact emergency medical personnel for pressing health concerns.
        </div>
      </div>
    </footer>
  );
};
