import React from 'react';
import { X, ShieldAlert, Lock, FileText, CheckCircle2 } from 'lucide-react';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'disclaimer' | 'privacy' | 'terms';
}

export const MedicalDisclaimerModal: React.FC<PolicyModalProps> = ({ isOpen, onClose, type }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${
              type === 'disclaimer' ? 'bg-amber-50 text-amber-700' :
              type === 'privacy' ? 'bg-teal-50 text-teal-700' : 'bg-blue-50 text-blue-700'
            }`}>
              {type === 'disclaimer' && <ShieldAlert className="w-6 h-6" />}
              {type === 'privacy' && <Lock className="w-6 h-6" />}
              {type === 'terms' && <FileText className="w-6 h-6" />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {type === 'disclaimer' && 'Medical Disclaimer & Educational Scope'}
                {type === 'privacy' && 'Patient Privacy & Data Protection Policy'}
                {type === 'terms' && 'Terms of Healthcare Platform Use'}
              </h2>
              <p className="text-xs text-slate-500">MediCare AI Clinical Governance Standards</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-600 leading-relaxed">
          {type === 'disclaimer' && (
            <>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 font-medium">
                <strong>CRITICAL MEDICAL NOTICE:</strong> The MediCare AI assistant provides general educational information only. It is NOT a medical diagnosis system, does not possess a clinical license to practice medicine, and cannot replace the expert judgment of a board-certified physician.
              </div>

              <h3 className="font-bold text-slate-900 text-base">1. No Doctor-Patient Relationship</h3>
              <p>
                Interacting with the MediCare AI Health Assistant, reading health resources, or using online scheduling does not establish a confidential doctor-patient relationship until an appointment is completed and documented by a licensed clinician.
              </p>

              <h3 className="font-bold text-slate-900 text-base">2. Prescription & Medication Safety</h3>
              <p>
                MediCare AI does not prescribe pharmaceuticals, modify prescription dosages, or validate specific drug interactions. Patients must never alter prescribed treatments without direct consultation with their primary care physician.
              </p>

              <h3 className="font-bold text-slate-900 text-base">3. Life-Threatening Emergencies</h3>
              <p>
                If you suspect you or a loved one is having a heart attack, stroke, anaphylactic shock, severe breathing distress, or acute trauma, stop using this digital application immediately and dial <strong>911</strong> or proceed to the nearest emergency department.
              </p>
            </>
          )}

          {type === 'privacy' && (
            <>
              <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl text-teal-900 font-medium">
                <strong>Privacy Commitment:</strong> We adhere to the highest standards of confidentiality, patient privacy, and data protection principles inspired by HIPAA and modern data privacy frameworks.
              </div>

              <h3 className="font-bold text-slate-900 text-base">1. Minimal Data Collection</h3>
              <p>
                MediCare AI collects only the minimal information required to arrange medical appointments and provide educational assistance (e.g. appointment date, preferred doctor, and contact information).
              </p>

              <h3 className="font-bold text-slate-900 text-base">2. Zero Commercial Sharing of Health Data</h3>
              <p>
                We do not sell, rent, or monetize personal health queries or patient profile data to third-party advertisers, data brokers, or commercial insurance underwriters.
              </p>

              <h3 className="font-bold text-slate-900 text-base">3. Client-Side & Local Storage Control</h3>
              <p>
                Your personal preferences, bookmarked health guides, and saved consultation notes are stored locally in your browser session and can be wiped at any time from your Patient Portal settings.
              </p>
            </>
          )}

          {type === 'terms' && (
            <>
              <h3 className="font-bold text-slate-900 text-base">1. Acceptance of Platform Terms</h3>
              <p>
                By using MediCare AI, you agree to comply with our platform terms, medical disclaimers, and community conduct policies.
              </p>

              <h3 className="font-bold text-slate-900 text-base">2. Purpose & Academic Scope</h3>
              <p>
                This application is designed as an accessible, modern healthcare management interface and clinical educational tool, suitable for academic, demonstrative, and healthcare research applications.
              </p>

              <h3 className="font-bold text-slate-900 text-base">3. Appointment Cancellations</h3>
              <p>
                Patients may reschedule or cancel scheduled visits at least 24 hours prior to the scheduled consultation time directly via the Patient Portal.
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            <span>Medically Validated Guidelines (Updated 2026)</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-sm"
          >
            I Understand & Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};
