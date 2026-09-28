import React from 'react';
import {
  AlertTriangle,
  PhoneCall,
  Heart,
  Brain,
  ShieldAlert,
  Clock,
  CheckCircle2,
  MapPin,
  ExternalLink,
  Info,
} from 'lucide-react';

interface EmergencyPageProps {
  onBackToHome: () => void;
}

export const EmergencyPage: React.FC<EmergencyPageProps> = ({ onBackToHome }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* High-Visibility Emergency Header */}
      <div className="bg-rose-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border-2 border-rose-800 space-y-4 relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-rose-700 rounded-2xl shrink-0">
            <ShieldAlert className="w-8 h-8 text-white animate-pulse" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-rose-300">
              Immediate Clinical Alert
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Emergency Healthcare Services
            </h1>
          </div>
        </div>

        <p className="text-sm sm:text-base text-rose-100 max-w-3xl leading-relaxed">
          If you or someone in your care is experiencing a life-threatening medical event, <strong>do not wait for an AI response or schedule a routine appointment</strong>. Immediately call your local emergency dispatch or proceed to the nearest hospital emergency department.
        </p>

        {/* Immediate Call Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          <a
            href="tel:911"
            className="p-4 bg-white text-rose-900 rounded-2xl shadow-md hover:bg-rose-50 transition-colors flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-500">Ambulance / Fire / Police</span>
              <PhoneCall className="w-4 h-4 text-rose-600" />
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold block text-rose-700">911</span>
              <span className="text-[11px] text-slate-600">United States & Canada</span>
            </div>
          </a>

          <a
            href="tel:112"
            className="p-4 bg-white text-rose-900 rounded-2xl shadow-md hover:bg-rose-50 transition-colors flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-500">International Emergency</span>
              <PhoneCall className="w-4 h-4 text-rose-600" />
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold block text-rose-700">112</span>
              <span className="text-[11px] text-slate-600">European Union & Global Standard</span>
            </div>
          </a>

          <a
            href="tel:988"
            className="p-4 bg-white text-slate-900 rounded-2xl shadow-md hover:bg-slate-50 transition-colors flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-500">Suicide & Crisis Lifeline</span>
              <PhoneCall className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold block text-indigo-700">988</span>
              <span className="text-[11px] text-slate-600">24/7 Free & Confidential Support</span>
            </div>
          </a>

          <a
            href="tel:18002221222"
            className="p-4 bg-white text-slate-900 rounded-2xl shadow-md hover:bg-slate-50 transition-colors flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-500">Poison Control Center</span>
              <PhoneCall className="w-4 h-4 text-amber-600" />
            </div>
            <div className="mt-3">
              <span className="text-xl font-extrabold block text-amber-700">1-800-222-1222</span>
              <span className="text-[11px] text-slate-600">National Toxic Exposure Help</span>
            </div>
          </a>
        </div>
      </div>

      {/* Critical Red Flag Symptoms Grid */}
      <div className="space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-700">Clinical Recognition</span>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Red Flag Emergency Symptoms</h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Never delay emergency care for the following clinical presentations. Every minute counts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Heart Attack Signs */}
          <div className="bg-white rounded-2xl border border-rose-200 p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5 text-rose-700">
              <div className="p-2 bg-rose-50 rounded-xl">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Signs of Heart Attack (ACS)</h3>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-2 shrink-0" />
                <span><strong>Chest Discomfort:</strong> Pressure, fullness, squeezing, or aching center pain lasting more than a few minutes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-2 shrink-0" />
                <span><strong>Radiation:</strong> Discomfort radiating to one or both arms, back, neck, jaw, or stomach.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-2 shrink-0" />
                <span><strong>Accompanying Signs:</strong> Shortness of breath with or without chest pain, cold sweat, nausea, or lightheadedness.</span>
              </li>
            </ul>
          </div>

          {/* Stroke Signs (F.A.S.T.) */}
          <div className="bg-white rounded-2xl border border-rose-200 p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5 text-teal-800">
              <div className="p-2 bg-teal-50 rounded-xl text-teal-700">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Signs of Stroke (F.A.S.T.)</h3>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <strong className="text-rose-700 shrink-0">F - Face:</strong>
                <span>Does one side of the face droop when smiling?</span>
              </li>
              <li className="flex items-start gap-2">
                <strong className="text-rose-700 shrink-0">A - Arms:</strong>
                <span>Does one arm drift downward when raising both arms?</span>
              </li>
              <li className="flex items-start gap-2">
                <strong className="text-rose-700 shrink-0">S - Speech:</strong>
                <span>Is speech slurred, garbled, or difficult to comprehend?</span>
              </li>
              <li className="flex items-start gap-2">
                <strong className="text-rose-700 shrink-0">T - Time:</strong>
                <span>Time is brain tissue. Call 911 immediately if you notice any of these signs.</span>
              </li>
            </ul>
          </div>

          {/* Severe Respiratory Distress */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-2">
            <h3 className="text-base font-bold text-slate-900">Severe Respiratory Distress</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Inability to complete full sentences without gasping, blueish discoloration around the lips or fingernail beds (cyanosis), severe stridor/wheezing unresponsive to rescue inhalers.
            </p>
          </div>

          {/* Anaphylaxis & Trauma */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-2">
            <h3 className="text-base font-bold text-slate-900">Anaphylaxis & Acute Hemorrhage</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Sudden throat swelling or hives after an insect sting, medication, or food allergen. Administer epinephrine auto-injector if available. For arterial bleeding, apply continuous direct pressure with a clean cloth.
            </p>
          </div>
        </div>
      </div>

      {/* What to Do While Waiting for EMS */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-teal-600" />
          <span>Checklist: While Waiting for Emergency Responders</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-700">
          <div className="p-4 bg-slate-50 rounded-xl space-y-1">
            <strong className="text-slate-900 block font-semibold">1. Remain Calm & Supported</strong>
            <p className="text-slate-600">
              Seat the patient in an upright, comfortable position to ease breathing work. Do not leave the patient unattended.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl space-y-1">
            <strong className="text-slate-900 block font-semibold">2. Clear the Access Path</strong>
            <p className="text-slate-600">
              Unlock the front door, turn on outdoor porch lights, and secure any household pets so paramedics have unobstructed access.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl space-y-1">
            <strong className="text-slate-900 block font-semibold">3. Gather Medications & Chart</strong>
            <p className="text-slate-600">
              Place the patient’s active prescription bottles, known allergy list, and photo ID into a bag for the emergency department doctors.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl space-y-1">
            <strong className="text-slate-900 block font-semibold">4. Do Not Administer Unprescribed Pills</strong>
            <p className="text-slate-600">
              Do not give food, water, or medications unless explicitly instructed by the emergency 911 dispatcher on the phone.
            </p>
          </div>
        </div>
      </div>

      {/* Non-Emergency Navigation */}
      <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
        <span>MediCare AI Safety & Clinical Triage System</span>
        <button
          onClick={onBackToHome}
          className="text-teal-700 font-semibold hover:underline"
        >
          Return to Platform Home →
        </button>
      </div>
    </div>
  );
};
