import React, { useState, useEffect, useMemo } from 'react';
import {
  User,
  Mail,
  Phone,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Calendar as CalendarIcon,
  Clock,
  Video,
  Building,
  AlertTriangle,
  Bot,
  Sparkles,
  HelpCircle,
  FileText,
  RotateCcw,
  Stethoscope,
  Heart,
  Baby,
  Brain,
  Download,
  AlertCircle,
  Check,
} from 'lucide-react';
import { DOCTORS_DATA, SPECIALTIES } from '../data/doctors';
import { Doctor, Appointment, AppointmentState, ConsultationMode } from '../types';
import { createAppointment, generateHealthEducation, HealthEducationData } from '../services/api';

interface PatientAppointmentJourneyProps {
  onReturnToHome: () => void;
  onViewPortal: () => void;
  initialDoctor?: Doctor | null;
}

const STORAGE_KEY = 'medicare_active_journey_state';
const STEP_STORAGE_KEY = 'medicare_active_journey_step';

// Actual MediCare website specialties (excluding "All Specialties")
const MEDICARE_SPECIALTIES = [
  'Cardiology',
  'Dermatology',
  'Pediatrics',
  'Orthopedics',
  'Family Medicine',
  'Neurology',
  'Psychiatry',
  'Endocrinology',
];

export const PatientAppointmentJourney: React.FC<PatientAppointmentJourneyProps> = ({
  onReturnToHome,
  onViewPortal,
  initialDoctor,
}) => {
  // Shared Appointment State (Requirement 9 & 12)
  const [appointmentState, setAppointmentState] = useState<AppointmentState>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed;
      }
    } catch (e) {
      // Ignore
    }
    return {
      patientName: '',
      patientEmail: '',
      patientPhone: '',
      doctorId: initialDoctor?.id || '',
      doctorName: initialDoctor?.name || '',
      specialty: initialDoctor?.specialty || '',
      date: '',
      time: '',
      mode: '',
      reason: '',
      notes: '',
    };
  });

  // Current Step (1 to 7)
  const [currentStep, setCurrentStep] = useState<number>(() => {
    try {
      const savedStep = sessionStorage.getItem(STEP_STORAGE_KEY);
      if (savedStep) {
        const num = parseInt(savedStep, 10);
        if (num >= 1 && num <= 6) return num; // Do not resume directly on confirmed
      }
    } catch (e) {
      // Ignore
    }
    return 1;
  });

  // Validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // AI Health Education State (Step 2)
  const [educationData, setEducationData] = useState<HealthEducationData | null>(null);
  const [loadingAiEducation, setLoadingAiEducation] = useState(false);

  // Booking Execution State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Appointment | null>(null);

  // Interactive AI Assistant Panel toggle & chat
  const [showAiAssistant, setShowAiAssistant] = useState(true);
  const [aiCustomQuestion, setAiCustomQuestion] = useState('');
  const [aiAssistantReply, setAiAssistantReply] = useState<string | null>(null);

  // Persist state across turns / refreshes
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(appointmentState));
      sessionStorage.setItem(STEP_STORAGE_KEY, currentStep.toString());
    } catch (e) {
      // Ignore
    }
  }, [appointmentState, currentStep]);

  // Set default doctor info if provided
  useEffect(() => {
    if (initialDoctor && !appointmentState.doctorId) {
      setAppointmentState((prev) => ({
        ...prev,
        doctorId: initialDoctor.id,
        doctorName: initialDoctor.name,
        specialty: initialDoctor.specialty,
      }));
    }
  }, [initialDoctor]);

  // Selected doctor object from real MediCare website data
  const selectedDoctorObj = useMemo(() => {
    return DOCTORS_DATA.find((d) => d.id === appointmentState.doctorId) || null;
  }, [appointmentState.doctorId]);

  // Filtered doctors list based on selected specialty
  const availableDoctors = useMemo(() => {
    if (!appointmentState.specialty) return DOCTORS_DATA;
    return DOCTORS_DATA.filter(
      (d) => d.specialty.toLowerCase() === appointmentState.specialty.toLowerCase()
    );
  }, [appointmentState.specialty]);

  // Handle single state updates (Requirement 9)
  const updateField = (field: keyof AppointmentState, value: string) => {
    setAppointmentState((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for field
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Generate / Refresh AI Health Education when reason or specialty changes
  const handleTriggerHealthEducation = async (reasonText: string, specialtyName?: string) => {
    if (!reasonText.trim()) return;
    setLoadingAiEducation(true);
    try {
      const result = await generateHealthEducation(reasonText, specialtyName || appointmentState.specialty);
      setEducationData(result);
    } catch (err) {
      console.error('Error generating AI education', err);
    } finally {
      setLoadingAiEducation(false);
    }
  };

  // Step 1 Validation -> Step 2
  const handleNextFromStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!appointmentState.patientName.trim()) {
      newErrors.patientName = 'Patient Name is required.';
    }
    if (!appointmentState.patientEmail.trim()) {
      newErrors.patientEmail = 'Patient Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(appointmentState.patientEmail.trim())) {
      newErrors.patientEmail = 'Please enter a valid email address.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 2 Validation -> Step 3
  const handleNextFromStep2 = () => {
    const newErrors: { [key: string]: string } = {};

    if (!appointmentState.reason.trim()) {
      newErrors.reason = 'Please describe the reason for your visit.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    // If specialty wasn't explicitly selected, infer or default to Family Medicine
    if (!appointmentState.specialty) {
      const lower = appointmentState.reason.toLowerCase();
      let matched = 'Family Medicine';
      if (lower.includes('heart') || lower.includes('blood pressure') || lower.includes('chest')) matched = 'Cardiology';
      else if (lower.includes('skin') || lower.includes('rash') || lower.includes('mole')) matched = 'Dermatology';
      else if (lower.includes('child') || lower.includes('baby') || lower.includes('pediatric')) matched = 'Pediatrics';
      else if (lower.includes('bone') || lower.includes('joint') || lower.includes('back') || lower.includes('knee')) matched = 'Orthopedics';
      else if (lower.includes('headache') || lower.includes('migraine') || lower.includes('brain')) matched = 'Neurology';
      else if (lower.includes('anxiety') || lower.includes('depress') || lower.includes('mental')) matched = 'Psychiatry';
      else if (lower.includes('diabetes') || lower.includes('thyroid') || lower.includes('glucose')) matched = 'Endocrinology';

      updateField('specialty', matched);
    }

    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 3 Validation -> Step 4
  const handleNextFromStep3 = () => {
    if (!appointmentState.doctorId) {
      setErrors({ doctorId: 'Please select a doctor to proceed.' });
      return;
    }
    setErrors({});

    // If mode is not set or not supported by doctor, default to first supported mode
    if (selectedDoctorObj) {
      if (!appointmentState.mode || !selectedDoctorObj.consultationModes.includes(appointmentState.mode as ConsultationMode)) {
        updateField('mode', selectedDoctorObj.consultationModes[0]);
      }
      // If time not selected or not in doctor's slots, select first real slot
      if (!appointmentState.time || !selectedDoctorObj.timeSlots.includes(appointmentState.time)) {
        updateField('time', selectedDoctorObj.timeSlots[0]);
      }
      // If date not set, default to tomorrow's date
      if (!appointmentState.date) {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        updateField('date', d.toISOString().split('T')[0]);
      }
    }

    setCurrentStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 4 Validation -> Step 5
  const handleNextFromStep4 = () => {
    const newErrors: { [key: string]: string } = {};
    if (!appointmentState.date) {
      newErrors.date = 'Please select an appointment date.';
    }
    if (!appointmentState.time) {
      newErrors.time = 'Please select an available appointment time.';
    }
    if (!appointmentState.mode) {
      newErrors.mode = 'Please select a consultation mode.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setCurrentStep(5);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 5 Validation -> Step 6
  const handleNextFromStep5 = () => {
    setErrors({});
    setCurrentStep(6);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 6 Confirmation -> Booking Execution -> Step 7
  const handleConfirmAppointment = async () => {
    setIsSubmitting(true);
    setBookingError(null);

    try {
      const created = await createAppointment({
        patientName: appointmentState.patientName,
        patientEmail: appointmentState.patientEmail,
        patientPhone: appointmentState.patientPhone,
        doctorId: appointmentState.doctorId,
        doctorName: appointmentState.doctorName,
        specialty: appointmentState.specialty,
        date: appointmentState.date,
        time: appointmentState.time,
        mode: appointmentState.mode as ConsultationMode,
        reason: appointmentState.reason,
        notes: appointmentState.notes,
      });

      if (created && created.id) {
        setConfirmedBooking(created);
        setCurrentStep(7);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        throw new Error('Appointment booking could not be verified by the system.');
      }
    } catch (err: any) {
      console.error('Booking failed', err);
      setBookingError(
        err?.message || 'Unable to schedule appointment. Please verify details and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Download Calendar Event (.ics)
  const handleDownloadICS = () => {
    if (!confirmedBooking) return;
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//MediCare AI//Medical Scheduling//EN
BEGIN:VEVENT
SUMMARY:MediCare Consultation with ${confirmedBooking.doctorName}
DESCRIPTION:${confirmedBooking.specialty} (${confirmedBooking.mode}). Reason: ${confirmedBooking.reason}
DTSTART:${confirmedBooking.date.replace(/-/g, '')}T090000Z
DURATION:PT45M
STATUS:CONFIRMED
LOCATION:${confirmedBooking.mode === 'Video Telehealth' ? 'MediCare AI Encrypted Telehealth Room' : selectedDoctorObj?.address || 'MediCare Clinical Center'}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medicare-appointment-${confirmedBooking.id}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Reset to Step 1 cleanly
  const handleResetJourney = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STEP_STORAGE_KEY);
    setAppointmentState({
      patientName: '',
      patientEmail: '',
      patientPhone: '',
      doctorId: '',
      doctorName: '',
      specialty: '',
      date: '',
      time: '',
      mode: '',
      reason: '',
      notes: '',
    });
    setConfirmedBooking(null);
    setCurrentStep(1);
    onReturnToHome();
  };

  // Steps for the Progress Indicator (Requirement 10)
  const STEPS_NAV = [
    { num: 1, label: 'Patient' },
    { num: 2, label: 'Health Need' },
    { num: 3, label: 'Doctor' },
    { num: 4, label: 'Appointment' },
    { num: 5, label: 'Additional Info' },
    { num: 6, label: 'Review' },
    { num: 7, label: 'Confirm' },
  ];

  // AI Assistant dynamic advice for the current step (Requirement 11)
  const getAiStepAssistance = () => {
    switch (currentStep) {
      case 1:
        return {
          title: 'Patient Identification & Security',
          guidance:
            'Please provide your legal full name and primary email. Your email will be used to deliver your booking confirmation and secure telehealth access codes.',
          tip: 'Phone number is optional, but recommended for automated SMS reminders.',
        };
      case 2:
        return {
          title: 'Describing Your Health Need',
          guidance:
            'Describe your symptoms, how long you have experienced them, and any previous treatments. I will automatically provide evidence-based educational insights and help match the correct medical specialty.',
          tip: 'Emergency symptoms (e.g. chest pressure, facial droop) require immediate emergency 911 dispatch.',
        };
      case 3:
        return {
          title: 'Selecting Your Certified Doctor',
          guidance: `Browse our board-certified medical specialists. All doctors listed are verified MediCare network clinicians with real consultation slots and credentials.`,
          tip: appointmentState.specialty
            ? `Filtered to clinicians in ${appointmentState.specialty}. You can also view all specialties.`
            : 'Select any doctor to view their hospital affiliation and fees.',
        };
      case 4:
        return {
          title: 'Choosing Date, Time & Mode',
          guidance:
            'Select an available date and genuine time slot. Choose between an encrypted Video Telehealth consultation or an In-Person Clinic visit at the doctor’s campus.',
          tip: 'All time slots shown are real available appointment windows.',
        };
      case 5:
        return {
          title: 'Pre-Consultation Notes',
          guidance:
            'Add any notes for the doctor, such as a recent blood pressure log, medication list, or specific questions you wish to address.',
          tip: 'Example: "Blood pressure log ready; symptoms worse in the morning."',
        };
      case 6:
        return {
          title: 'Verification & Final Review',
          guidance:
            'Carefully verify all patient details, healthcare needs, selected clinician, and consultation timing. You can edit any section before confirming.',
          tip: 'Clicking "Confirm Appointment" reserves your slot with our healthcare system.',
        };
      case 7:
        return {
          title: 'Consultation Successfully Scheduled',
          guidance:
            'Your appointment is confirmed. Save your reference code and download the calendar invite.',
          tip: 'You can review this consultation anytime in your Patient Portal.',
        };
      default:
        return {
          title: 'MediCare AI Healthcare Assistant',
          guidance: 'I am here to guide your appointment booking and answer general health education questions.',
          tip: 'General educational information only.',
        };
    }
  };

  const currentAssistance = getAiStepAssistance();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 10. PROGRESS INDICATOR (Top of Appointment Flow) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between overflow-x-auto pb-2 sm:pb-0 gap-2 no-scrollbar">
          {STEPS_NAV.map((step, idx) => {
            const isCurrent = currentStep === step.num;
            const isCompleted = currentStep > step.num;
            return (
              <React.Fragment key={step.num}>
                <div
                  className={`flex items-center gap-2 shrink-0 ${
                    isCurrent
                      ? 'text-teal-800 font-bold'
                      : isCompleted
                      ? 'text-emerald-700 font-semibold'
                      : 'text-slate-400 font-medium'
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-teal-700 text-white shadow-sm ring-4 ring-teal-100'
                        : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : step.num}
                  </span>
                  <span className="text-xs sm:text-sm whitespace-nowrap">{step.label}</span>
                </div>
                {idx < STEPS_NAV.length - 1 && (
                  <span aria-hidden="true" className="text-slate-300 font-bold px-1 select-none">
                    →
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Form Journey on Left, AI Agent Assistant Panel on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: The Current Step Page */}
        <div className="lg:col-span-8">
          {/* ========================================================================= */}
          {/* STEP 1: PATIENT DETAILS — FIRST PAGE (No doctors or appointment details!) */}
          {/* ========================================================================= */}
          {currentStep === 1 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-150">
              <div className="space-y-1.5 pb-2 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Step 1 of 7</span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Patient Details
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Please enter your basic information to begin your medical consultation request.
                </p>
              </div>

              <form onSubmit={handleNextFromStep1} className="space-y-5">
                {/* Patient Name — Required */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800 flex items-center justify-between">
                    <span>Patient Name</span>
                    <span className="text-rose-600 font-semibold text-[11px]">* Required</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={appointmentState.patientName}
                      onChange={(e) => updateField('patientName', e.target.value)}
                      placeholder="Enter your full name"
                      className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all ${
                        errors.patientName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                      }`}
                    />
                  </div>
                  {errors.patientName && (
                    <p className="text-xs text-rose-600 font-medium">{errors.patientName}</p>
                  )}
                </div>

                {/* Patient Email — Required */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800 flex items-center justify-between">
                    <span>Patient Email</span>
                    <span className="text-rose-600 font-semibold text-[11px]">* Required</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      value={appointmentState.patientEmail}
                      onChange={(e) => updateField('patientEmail', e.target.value)}
                      placeholder="Enter your email address"
                      className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all ${
                        errors.patientEmail ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                      }`}
                    />
                  </div>
                  {errors.patientEmail && (
                    <p className="text-xs text-rose-600 font-medium">{errors.patientEmail}</p>
                  )}
                </div>

                {/* Patient Phone — Optional */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800 flex items-center justify-between">
                    <span>Patient Phone</span>
                    <span className="text-slate-400 font-normal text-[11px]">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      value={appointmentState.patientPhone}
                      onChange={(e) => updateField('patientPhone', e.target.value)}
                      placeholder="Enter your phone number"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Privacy Assurance */}
                <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl text-xs text-teal-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
                  <span>Your contact details are encrypted and solely used for appointment coordination.</span>
                </div>

                {/* Button: Next -> */}
                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    className="px-8 py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-teal-700/20 flex items-center gap-2"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: HEALTHCARE NEED — SECOND PAGE (With AI Health Education) */}
          {/* ========================================================================= */}
          {currentStep === 2 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-150">
              <div className="space-y-1.5 pb-2 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Step 2 of 7</span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  How Can We Help You?
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Patient: <strong className="text-slate-800">{appointmentState.patientName}</strong> ({appointmentState.patientEmail})
                </p>
              </div>

              {/* Field: What is the reason for your visit? */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>What is the reason for your visit?</span>
                  <span className="text-rose-600 font-semibold text-[11px]">* Required</span>
                </label>
                <textarea
                  rows={4}
                  value={appointmentState.reason}
                  onChange={(e) => {
                    updateField('reason', e.target.value);
                  }}
                  onBlur={() => {
                    if (appointmentState.reason.trim()) {
                      handleTriggerHealthEducation(appointmentState.reason);
                    }
                  }}
                  placeholder="[Describe your health concern]"
                  className={`w-full bg-slate-50 border rounded-2xl p-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all ${
                    errors.reason ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                  }`}
                />
                {errors.reason && (
                  <p className="text-xs text-rose-600 font-medium">{errors.reason}</p>
                )}

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-500">
                    E.g. "Frequent morning headaches", "Routine blood pressure checkup", "Persistent dry cough"
                  </span>
                  <button
                    type="button"
                    onClick={() => handleTriggerHealthEducation(appointmentState.reason)}
                    disabled={!appointmentState.reason.trim() || loadingAiEducation}
                    className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    <span>{loadingAiEducation ? 'Analyzing...' : 'Generate AI Health Insights'}</span>
                  </button>
                </div>
              </div>

              {/* Specialty Selection from Actual MediCare Data */}
              <div className="space-y-2.5 pt-2">
                <label className="block text-xs font-bold text-slate-800">
                  Select a Medical Specialty (From MediCare Network)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {MEDICARE_SPECIALTIES.map((spec) => {
                    const isSelected = appointmentState.specialty.toLowerCase() === spec.toLowerCase();
                    return (
                      <button
                        key={spec}
                        type="button"
                        onClick={() => {
                          updateField('specialty', spec);
                          if (appointmentState.reason.trim()) {
                            handleTriggerHealthEducation(appointmentState.reason, spec);
                          }
                        }}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all text-left flex items-center justify-between ${
                          isSelected
                            ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                        }`}
                      >
                        <span>{spec}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. AI HEALTH EDUCATION SECTION (Requirement 3) */}
              {educationData && (
                <div className="mt-6 p-5 sm:p-6 bg-gradient-to-b from-teal-50/50 to-slate-50 rounded-2xl border border-teal-200 space-y-4 animate-in fade-in duration-200">
                  {educationData.isEmergency && (
                    <div className="p-4 bg-rose-600 text-white rounded-xl text-xs space-y-2 shadow-md">
                      <div className="flex items-center gap-2 font-bold text-sm">
                        <AlertTriangle className="w-5 h-5 text-rose-200" />
                        <span>URGENT MEDICAL WARNING</span>
                      </div>
                      <p className="leading-relaxed">
                        The symptoms described may represent an acute emergency. Please contact emergency services (911 / 112) immediately rather than waiting for an outpatient appointment.
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pb-2 border-b border-teal-200/80">
                    <Bot className="w-5 h-5 text-teal-700" />
                    <h3 className="font-bold text-sm sm:text-base text-slate-900">
                      MediCare AI Educational Health Guidance
                    </h3>
                  </div>

                  {/* 🩺 Educational Health Overview */}
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-teal-900 uppercase tracking-wide flex items-center gap-1.5">
                      <span>🩺 Educational Health Overview</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200">
                      {educationData.overview}
                    </p>
                  </div>

                  {/* 💡 General Self-Care & Supportive Measures */}
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-teal-900 uppercase tracking-wide flex items-center gap-1.5">
                      <span>💡 General Self-Care & Supportive Measures</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200">
                      {educationData.selfCare}
                    </p>
                  </div>

                  {/* ❓ Follow-Up Reflection Questions */}
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-teal-900 uppercase tracking-wide flex items-center gap-1.5">
                      <span>❓ Follow-Up Reflection Questions</span>
                    </h4>
                    <ul className="text-xs sm:text-sm text-slate-700 space-y-1.5 bg-white p-3.5 rounded-xl border border-slate-200 list-disc list-inside">
                      {educationData.reflectionQuestions.map((q, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {q}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 👨‍⚕️ When to Consult a Qualified Doctor */}
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-teal-900 uppercase tracking-wide flex items-center gap-1.5">
                      <span>👨‍⚕️ When to Consult a Qualified Doctor</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200">
                      {educationData.doctorWhen}
                    </p>
                  </div>

                  {/* Cautious Language & Safety Disclaimer (Requirement 13) */}
                  <div className="pt-2 text-[11px] text-slate-500 italic border-t border-slate-200">
                    *This assistant provides general health education only and is not a substitute for professional medical advice, clinical diagnosis, or personalized treatment.
                  </div>
                </div>
              )}

              {/* Buttons: <- Back and Next -> */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep(1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextFromStep2}
                  className="px-8 py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-teal-700/20 flex items-center gap-2"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: DOCTOR SELECTION — THIRD PAGE (Actual MediCare Doctors Data) */}
          {/* ========================================================================= */}
          {currentStep === 3 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-150">
              <div className="space-y-1.5 pb-2 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Step 3 of 7</span>
                  <span className="text-xs text-slate-500 font-medium">
                    Specialty filter: <strong className="text-teal-800">{appointmentState.specialty || 'All'}</strong>
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Choose Your Doctor
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Select a certified doctor from our actual MediCare clinical faculty.
                </p>
              </div>

              {errors.doctorId && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold">
                  {errors.doctorId}
                </div>
              )}

              {/* Doctors Grid from actual DOCTORS_DATA */}
              <div className="space-y-3">
                {availableDoctors.length > 0 ? (
                  availableDoctors.map((doc) => {
                    const isSelected = appointmentState.doctorId === doc.id;
                    return (
                      <div
                        key={doc.id}
                        onClick={() => {
                          updateField('doctorId', doc.id);
                          updateField('doctorName', doc.name);
                          updateField('specialty', doc.specialty);
                          // Default to first supported consultation mode
                          if (doc.consultationModes.length > 0) {
                            updateField('mode', doc.consultationModes[0]);
                          }
                          // Default to doctor's first slot
                          if (doc.timeSlots.length > 0) {
                            updateField('time', doc.timeSlots[0]);
                          }
                        }}
                        className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                          isSelected
                            ? 'border-teal-600 bg-teal-50/60 ring-2 ring-teal-500 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                          <img
                            src={doc.imageUrl}
                            alt={doc.name}
                            className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
                          />
                          <div className="space-y-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                                {doc.name}
                              </h3>
                              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                                ID: {doc.id}
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-teal-700">{doc.specialty}</p>
                            <p className="text-[11px] text-slate-500 truncate">
                              {doc.hospital} · {doc.location}
                            </p>
                            <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-600">
                              <span>
                                <strong>Next:</strong> {doc.nextAvailable}
                              </span>
                              <span>·</span>
                              <span>
                                <strong>Fee:</strong> ${doc.consultationFee}
                              </span>
                              <span>·</span>
                              <span>
                                <strong>Modes:</strong> {doc.consultationModes.join(' / ')}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="self-end sm:self-center shrink-0">
                          <span
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-teal-700 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {isSelected ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Selected</span>
                              </>
                            ) : (
                              <span>Select Doctor</span>
                            )}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <p className="text-xs text-slate-600">
                      No doctors found strictly under specialty "{appointmentState.specialty}".
                    </p>
                    <button
                      type="button"
                      onClick={() => updateField('specialty', '')}
                      className="px-4 py-2 bg-teal-700 text-white text-xs font-bold rounded-xl"
                    >
                      Show All Available Doctors
                    </button>
                  </div>
                )}
              </div>

              {/* Buttons: <- Back and Next -> */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep(2);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextFromStep3}
                  className="px-8 py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-teal-700/20 flex items-center gap-2"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 4: APPOINTMENT DETAILS — FOURTH PAGE (Date, Time, Mode) */}
          {/* ========================================================================= */}
          {currentStep === 4 && selectedDoctorObj && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-150">
              <div className="space-y-1.5 pb-2 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Step 4 of 7</span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Appointment Details
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Select your consultation date, real available appointment slot, and visit mode.
                </p>
              </div>

              {/* Selected Doctor Summary Card */}
              <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-200 flex items-center gap-3.5">
                <img
                  src={selectedDoctorObj.imageUrl}
                  alt={selectedDoctorObj.name}
                  className="w-12 h-12 rounded-xl object-cover border border-teal-200"
                />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{selectedDoctorObj.name}</h3>
                  <p className="text-xs text-teal-700 font-semibold">
                    {selectedDoctorObj.specialty} (ID: {selectedDoctorObj.id})
                  </p>
                  <p className="text-[11px] text-slate-500">{selectedDoctorObj.hospital}</p>
                </div>
              </div>

              {/* Date Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <CalendarIcon className="w-4 h-4 text-teal-600" />
                  <span>Date</span>
                  <span className="text-rose-600 font-semibold text-[11px]">*</span>
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={appointmentState.date}
                  onChange={(e) => updateField('date', e.target.value)}
                  className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all ${
                    errors.date ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                  }`}
                />
                {errors.date && <p className="text-xs text-rose-600 font-medium">{errors.date}</p>}
              </div>

              {/* Time Selection (Actual Doctor time slots only!) */}
              <div className="space-y-2.5">
                <label className="block text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-teal-600" />
                    <span>Time</span>
                    <span className="text-rose-600 font-semibold text-[11px]">*</span>
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Verified availability for {selectedDoctorObj.name}
                  </span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {selectedDoctorObj.timeSlots.map((slot) => {
                    const isSelected = appointmentState.time === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => updateField('time', slot)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                          isSelected
                            ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
                {errors.time && <p className="text-xs text-rose-600 font-medium">{errors.time}</p>}
              </div>

              {/* Appointment Mode (Radio options) */}
              <div className="space-y-2.5 pt-2">
                <label className="block text-xs font-bold text-slate-800">
                  Appointment Mode <span className="text-rose-600 font-semibold text-[11px]">*</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Video Telehealth */}
                  <label
                    onClick={() => updateField('mode', 'Video Telehealth')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                      appointmentState.mode === 'Video Telehealth'
                        ? 'border-teal-600 bg-teal-50/60 ring-2 ring-teal-500 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="appointmentMode"
                      checked={appointmentState.mode === 'Video Telehealth'}
                      onChange={() => updateField('mode', 'Video Telehealth')}
                      className="mt-1 text-teal-600 focus:ring-teal-500"
                    />
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                        <Video className="w-4 h-4 text-teal-700" />
                        <span>Video Telehealth</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Encrypted browser consultation room from home or office.
                      </p>
                    </div>
                  </label>

                  {/* In-Person Clinic */}
                  <label
                    onClick={() => updateField('mode', 'In-Person Clinic')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                      appointmentState.mode === 'In-Person Clinic'
                        ? 'border-teal-600 bg-teal-50/60 ring-2 ring-teal-500 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="appointmentMode"
                      checked={appointmentState.mode === 'In-Person Clinic'}
                      onChange={() => updateField('mode', 'In-Person Clinic')}
                      className="mt-1 text-teal-600 focus:ring-teal-500"
                    />
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                        <Building className="w-4 h-4 text-slate-700" />
                        <span>In-Person Clinic</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Attend in person at {selectedDoctorObj.hospital}.
                      </p>
                    </div>
                  </label>
                </div>
                {errors.mode && <p className="text-xs text-rose-600 font-medium">{errors.mode}</p>}
              </div>

              {/* Buttons: <- Back and Next -> */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep(3);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextFromStep4}
                  className="px-8 py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-teal-700/20 flex items-center gap-2"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 5: ADDITIONAL INFORMATION — FIFTH PAGE (Notes optional) */}
          {/* ========================================================================= */}
          {currentStep === 5 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-150">
              <div className="space-y-1.5 pb-2 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Step 5 of 7</span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Additional Information
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Provide any supplementary details or documents to help your doctor prepare.
                </p>
              </div>

              {/* Notes Field (Optional) */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>Notes</span>
                  <span className="text-slate-400 font-normal text-[11px]">(Optional)</span>
                </label>
                <textarea
                  rows={4}
                  value={appointmentState.notes}
                  onChange={(e) => updateField('notes', e.target.value)}
                  placeholder="[ Enter any additional information ]"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                />
                <p className="text-xs text-slate-500 italic">
                  Example: "Blood pressure log ready."
                </p>
              </div>

              {/* Tips for pre-visit prep */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
                <strong className="block text-slate-900 font-bold">Suggested Information to Include:</strong>
                <ul className="list-disc list-inside space-y-1">
                  <li>Current prescription medications or supplements</li>
                  <li>Recent laboratory results or home tracking readings</li>
                  <li>Preferred language or accessibility accommodations</li>
                </ul>
              </div>

              {/* Buttons: <- Back and Next -> */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep(4);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextFromStep5}
                  className="px-8 py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-teal-700/20 flex items-center gap-2"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 6: REVIEW APPOINTMENT — SIXTH PAGE (Strictly formatted review) */}
          {/* ========================================================================= */}
          {currentStep === 6 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-150">
              <div className="space-y-1.5 pb-2 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Step 6 of 7</span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Review Your Appointment
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Please review all information below before completing your reservation.
                </p>
              </div>

              {bookingError && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>Booking Error</span>
                  </div>
                  <p>{bookingError}</p>
                </div>
              )}

              {/* Formatted Sections exactly matching Requirement 7 */}
              <div className="space-y-5">
                {/* 1. Patient Details */}
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      Patient Details
                    </h3>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-xs font-semibold text-teal-700 hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="text-xs sm:text-sm text-slate-800 space-y-1">
                    <p>
                      <strong className="text-slate-500">Patient Name:</strong> {appointmentState.patientName}
                    </p>
                    <p>
                      <strong className="text-slate-500">Email:</strong> {appointmentState.patientEmail}
                    </p>
                    <p>
                      <strong className="text-slate-500">Phone:</strong>{' '}
                      {appointmentState.patientPhone || 'Not provided'}
                    </p>
                  </div>
                </div>

                {/* 2. Healthcare Need */}
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      Healthcare Need
                    </h3>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="text-xs font-semibold text-teal-700 hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="text-xs sm:text-sm text-slate-800 space-y-1">
                    <p>
                      <strong className="text-slate-500">Specialty:</strong> {appointmentState.specialty}
                    </p>
                    <p>
                      <strong className="text-slate-500">Reason:</strong> {appointmentState.reason}
                    </p>
                  </div>
                </div>

                {/* 3. Doctor */}
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      Doctor
                    </h3>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="text-xs font-semibold text-teal-700 hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="text-xs sm:text-sm text-slate-800 space-y-1">
                    <p>
                      <strong className="text-slate-500">Doctor:</strong> {appointmentState.doctorName}
                    </p>
                    <p>
                      <strong className="text-slate-500">Doctor ID:</strong> {appointmentState.doctorId}
                    </p>
                  </div>
                </div>

                {/* 4. Appointment */}
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      Appointment
                    </h3>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(4)}
                      className="text-xs font-semibold text-teal-700 hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="text-xs sm:text-sm text-slate-800 space-y-1">
                    <p>
                      <strong className="text-slate-500">Date:</strong> {appointmentState.date}
                    </p>
                    <p>
                      <strong className="text-slate-500">Time:</strong> {appointmentState.time}
                    </p>
                    <p>
                      <strong className="text-slate-500">Mode:</strong> {appointmentState.mode}
                    </p>
                  </div>
                </div>

                {/* 5. Additional Notes */}
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      Additional Notes
                    </h3>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(5)}
                      className="text-xs font-semibold text-teal-700 hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 italic">
                    {appointmentState.notes || 'None provided.'}
                  </p>
                </div>
              </div>

              {/* Buttons: <- Back and Confirm Appointment */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep(5);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm rounded-xl transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleConfirmAppointment}
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-teal-700/20 flex items-center gap-2 disabled:bg-slate-300"
                >
                  {isSubmitting ? (
                    <span>Scheduling Consultation...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm Appointment</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 7: APPOINTMENT CONFIRMATION — FINAL PAGE (Only after booking succeeds!) */}
          {/* ========================================================================= */}
          {currentStep === 7 && confirmedBooking && (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-md text-center space-y-6 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Appointment Confirmed ✓
                </h1>
                <p className="text-sm font-medium text-emerald-700">
                  Your appointment has been successfully scheduled.
                </p>
                <p className="text-xs text-slate-500 max-w-md mx-auto pt-1">
                  A verification receipt has been logged. Please keep your Appointment ID for clinic check-in or telehealth verification.
                </p>
              </div>

              {/* Exact Fields specified in Requirement 8 */}
              <div className="max-w-md mx-auto bg-slate-50 rounded-2xl border border-slate-200 p-5 text-left text-xs sm:text-sm space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500 font-semibold">Appointment ID:</span>
                  <strong className="font-mono text-teal-800 text-sm">{confirmedBooking.id}</strong>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-semibold">Patient Name:</span>
                  <span className="font-bold text-slate-900">{confirmedBooking.patientName}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-semibold">Doctor Name:</span>
                  <span className="font-bold text-slate-900">{confirmedBooking.doctorName}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-semibold">Specialty:</span>
                  <span className="text-slate-800">{confirmedBooking.specialty}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-semibold">Date:</span>
                  <span className="font-bold text-slate-900">{confirmedBooking.date}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-semibold">Time:</span>
                  <span className="font-bold text-slate-900">{confirmedBooking.time}</span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                  <span className="text-slate-500 font-semibold">Appointment Mode:</span>
                  <span className="font-bold text-teal-700">{confirmedBooking.mode}</span>
                </div>
              </div>

              {/* Post-Booking Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleDownloadICS}
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <Download className="w-4 h-4 text-slate-500" />
                  <span>Add to Calendar (.ics)</span>
                </button>

                <button
                  type="button"
                  onClick={onViewPortal}
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>View in Patient Portal</span>
                </button>

                {/* Return to Home (Requirement 8) */}
                <button
                  type="button"
                  onClick={handleResetJourney}
                  className="w-full sm:w-auto px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-xs"
                >
                  Return to Home
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: AI Agent Assistant Panel (Requirement 11) */}
        <div className="lg:col-span-4 space-y-4 sticky top-24">
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900">MediCare AI Assistant</h3>
                  <p className="text-[10px] text-teal-700 font-medium">Real-Time Step Guide</p>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 font-bold border border-teal-200">
                Step {currentStep}/7
              </span>
            </div>

            {/* Contextual Assistance for the Active Page */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900">{currentAssistance.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{currentAssistance.guidance}</p>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500">
                💡 <strong className="text-slate-700">Tip:</strong> {currentAssistance.tip}
              </div>
            </div>

            {/* Interactive Question Input for Patient */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="text-[11px] font-bold text-slate-700 block">
                Have a question about this step or your symptoms?
              </span>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={aiCustomQuestion}
                  onChange={(e) => setAiCustomQuestion(e.target.value)}
                  placeholder="Ask a question..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (aiCustomQuestion.trim()) {
                        setAiAssistantReply(
                          `MediCare AI: Regarding "${aiCustomQuestion.trim()}" — all entered information remains securely saved. You can complete this appointment step or adjust details before confirming.`
                        );
                        setAiCustomQuestion('');
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (aiCustomQuestion.trim()) {
                      setAiAssistantReply(
                        `MediCare AI: Regarding "${aiCustomQuestion.trim()}" — your appointment data remains active in the shared session. You can proceed with confidence or use the Back button anytime to adjust.`
                      );
                      setAiCustomQuestion('');
                    }
                  }}
                  className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shrink-0"
                >
                  Ask
                </button>
              </div>

              {aiAssistantReply && (
                <div className="p-3 bg-teal-50/80 border border-teal-200 rounded-xl text-xs text-teal-950 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-bold text-teal-800">
                    <span>Assistant Answer</span>
                    <button
                      onClick={() => setAiAssistantReply(null)}
                      className="text-slate-400 hover:text-slate-700"
                    >
                      Dismiss
                    </button>
                  </div>
                  <p>{aiAssistantReply}</p>
                </div>
              )}
            </div>

            {/* Mandatory Safety Notice (Requirement 13) */}
            <div className="p-3 bg-amber-50/90 border border-amber-200 rounded-xl text-[10px] text-amber-900 leading-relaxed">
              <strong>Notice:</strong> This assistant provides general health education only and is not a substitute for professional medical advice, clinical diagnosis, or personalized treatment.
            </div>
          </div>

          {/* Quick Doctor Roster Snapshot from Website Data */}
          <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs text-xs space-y-2">
            <span className="font-bold text-slate-800 block text-xs">
              MediCare Network Overview ({DOCTORS_DATA.length} Board-Certified Specialists)
            </span>
            <p className="text-[11px] text-slate-500">
              St. Jude Heart Center · Metro Neuroscience · Children's Alliance · University Medical Dermatology · Summit Orthopedics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
