import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  Building2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  User,
  Phone,
  Mail,
  FileText,
  Download,
  AlertCircle,
} from 'lucide-react';
import { DOCTORS_DATA } from '../data/doctors';
import { Doctor, Appointment, ConsultationMode } from '../types';
import { createAppointment, getSavedProfile } from '../services/api';

interface AppointmentsPageProps {
  selectedDoctor: Doctor | null;
  setSelectedDoctor: (doctor: Doctor | null) => void;
  setActiveTab: (tab: string) => void;
  onAppointmentCreated: () => void;
}

export const AppointmentsPage: React.FC<AppointmentsPageProps> = ({
  selectedDoctor,
  setSelectedDoctor,
  setActiveTab,
  onAppointmentCreated,
}) => {
  const patientProfile = getSavedProfile();

  // Wizard Steps: 1: Doctor & Mode, 2: Date & Slot, 3: Patient Intake, 4: Confirmed
  const [currentStep, setCurrentStep] = useState<number>(selectedDoctor ? 2 : 1);
  const [activeDoctor, setActiveDoctor] = useState<Doctor>(selectedDoctor || DOCTORS_DATA[0]);
  const [consultationMode, setConsultationMode] = useState<ConsultationMode>('Video Telehealth');
  
  // Date selection (default to tomorrow's date)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState<string>(defaultDateStr);
  const [selectedSlot, setSelectedSlot] = useState<string>('10:00 AM');

  // Intake Form
  const [patientName, setPatientName] = useState(patientProfile.name);
  const [patientEmail, setPatientEmail] = useState(patientProfile.email);
  const [patientPhone, setPatientPhone] = useState(patientProfile.phone);
  const [visitReason, setVisitReason] = useState('');
  const [visitNotes, setVisitNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  const availableSlots = [
    '09:00 AM',
    '09:45 AM',
    '10:30 AM',
    '11:15 AM',
    '01:30 PM',
    '02:15 PM',
    '03:00 PM',
    '04:30 PM',
  ];

  const handleDoctorChange = (docId: string) => {
    const doc = DOCTORS_DATA.find((d) => d.id === docId);
    if (doc) {
      setActiveDoctor(doc);
      setSelectedDoctor(doc);
    }
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !patientEmail.trim() || !visitReason.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await createAppointment({
        patientName,
        patientEmail,
        patientPhone,
        doctorId: activeDoctor.id,
        doctorName: activeDoctor.name,
        specialty: activeDoctor.specialty,
        date: selectedDate,
        time: selectedSlot,
        mode: consultationMode,
        reason: visitReason,
        notes: visitNotes,
      });

      setConfirmedAppointment(created);
      setCurrentStep(4);
      onAppointmentCreated();
    } catch (err) {
      console.error('Failed to create appointment', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadICS = () => {
    if (!confirmedAppointment) return;

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//MediCare AI//Medical Scheduling//EN
BEGIN:VEVENT
SUMMARY:MediCare Consultation with ${confirmedAppointment.doctorName}
DESCRIPTION:${confirmedAppointment.specialty} (${confirmedAppointment.mode}). Reason: ${confirmedAppointment.reason}
DTSTART:${confirmedAppointment.date.replace(/-/g, '')}T090000Z
DURATION:PT45M
STATUS:CONFIRMED
LOCATION:${confirmedAppointment.mode === 'Video Telehealth' ? 'MediCare AI Encrypted Telehealth Room' : activeDoctor.address}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medicare-appointment-${confirmedAppointment.id}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Title */}
      <div className="space-y-1 text-center sm:text-left">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Digital Scheduling</span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Schedule an Appointment</h1>
        <p className="text-sm text-slate-600">
          Book an in-person clinic consultation or an encrypted video telehealth visit with our verified healthcare specialists.
        </p>
      </div>

      {/* Progress Steps Header */}
      {currentStep < 4 && (
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 text-xs font-medium text-slate-500">
          <div className={`flex items-center gap-1.5 ${currentStep >= 1 ? 'text-teal-800 font-bold' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep >= 1 ? 'bg-teal-700 text-white' : 'bg-slate-200 text-slate-600'}`}>
              1
            </span>
            <span>Doctor & Mode</span>
          </div>

          <div className="h-px w-8 sm:w-16 bg-slate-200" />

          <div className={`flex items-center gap-1.5 ${currentStep >= 2 ? 'text-teal-800 font-bold' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep >= 2 ? 'bg-teal-700 text-white' : 'bg-slate-200 text-slate-600'}`}>
              2
            </span>
            <span>Date & Time</span>
          </div>

          <div className="h-px w-8 sm:w-16 bg-slate-200" />

          <div className={`flex items-center gap-1.5 ${currentStep >= 3 ? 'text-teal-800 font-bold' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep >= 3 ? 'bg-teal-700 text-white' : 'bg-slate-200 text-slate-600'}`}>
              3
            </span>
            <span>Intake & Details</span>
          </div>
        </div>
      )}

      {/* STEP 1: Select Doctor & Mode */}
      {currentStep === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-slate-900">Step 1: Choose Your Doctor & Consultation Mode</h2>

          {/* Doctor Selection Dropdown / Cards */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-700">Select Doctor:</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DOCTORS_DATA.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => {
                    setActiveDoctor(doc);
                    setSelectedDoctor(doc);
                  }}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                    activeDoctor.id === doc.id
                      ? 'border-teal-600 bg-teal-50/50 shadow-xs ring-1 ring-teal-500'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <img
                    src={doc.imageUrl}
                    alt={doc.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{doc.name}</h4>
                    <p className="text-[11px] text-teal-700 font-medium">{doc.specialty}</p>
                    <p className="text-[10px] text-slate-500 truncate">{doc.hospital}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mode Selector */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-semibold text-slate-700">Consultation Setting:</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setConsultationMode('Video Telehealth')}
                className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
                  consultationMode === 'Video Telehealth'
                    ? 'border-teal-600 bg-teal-50/50 ring-1 ring-teal-500'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="p-2 rounded-lg bg-teal-100 text-teal-700">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Encrypted Video Telehealth</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Connect from home via secure, high-definition browser consultation room.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setConsultationMode('In-Person Clinic')}
                className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
                  consultationMode === 'In-Person Clinic'
                    ? 'border-teal-600 bg-teal-50/50 ring-1 ring-teal-500'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">In-Person Clinic Visit</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Consult directly at {activeDoctor.hospital} ({activeDoctor.location}).
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <span>Continue to Date & Slot</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Select Date & Time Slot */}
      {currentStep === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Step 2: Choose Date & Time</h2>
            <button
              onClick={() => setCurrentStep(1)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Change Doctor</span>
            </button>
          </div>

          {/* Selected Doctor Summary Card */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
            <img
              src={activeDoctor.imageUrl}
              alt={activeDoctor.name}
              className="w-12 h-12 rounded-xl object-cover"
            />
            <div>
              <h4 className="text-xs font-bold text-slate-900">{activeDoctor.name}</h4>
              <p className="text-[11px] text-teal-700 font-medium">
                {activeDoctor.specialty} · Mode: {consultationMode}
              </p>
              <p className="text-[10px] text-slate-500">{activeDoctor.hospital}</p>
            </div>
          </div>

          {/* Date Picker */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4 text-teal-600" />
              <span>Select Consultation Date:</span>
            </label>
            <input
              type="date"
              value={selectedDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
            />
          </div>

          {/* Time Slot Picker */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-teal-600" />
              <span>Available Appointment Slots for {selectedDate}:</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {availableSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                    selectedSlot === slot
                      ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Back
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <span>Continue to Intake Form</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Patient Intake Form */}
      {currentStep === 3 && (
        <form
          onSubmit={handleSubmitBooking}
          className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Step 3: Patient Information & Visit Reason</h2>
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Change Slot</span>
            </button>
          </div>

          {/* Booking Recap Badge */}
          <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 flex flex-wrap items-center justify-between gap-2">
            <span>
              <strong>{activeDoctor.name}</strong> · {selectedDate} at {selectedSlot}
            </span>
            <span className="font-semibold text-teal-800">{consultationMode}</span>
          </div>

          {/* Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>Patient Full Name *</span>
              </label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>Email Address (For Appointment Confirmation) *</span>
              </label>
              <input
                type="email"
                required
                value={patientEmail}
                onChange={(e) => setPatientEmail(e.target.value)}
                placeholder="patient@example.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>Contact Phone Number</span>
              </label>
              <input
                type="tel"
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                placeholder="+1 (555) 234-5678"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>Primary Reason for Consultation / Symptoms *</span>
              </label>
              <textarea
                required
                rows={3}
                value={visitReason}
                onChange={(e) => setVisitReason(e.target.value)}
                placeholder="Describe your primary symptoms, duration, or reason for this visit (e.g. routine heart check, persistent cough, allergy flare)..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700">
                Additional Notes or Special Accommodations (Optional)
              </label>
              <input
                type="text"
                value={visitNotes}
                onChange={(e) => setVisitNotes(e.target.value)}
                placeholder="E.g. requesting Spanish language support, wheelchair access, recent lab results ready..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <span>
              <strong>Emergency Reminder:</strong> If you are experiencing sudden severe symptoms (e.g. severe chest pain, breathing arrest, stroke signs), do not schedule a routine appointment. Call 911 immediately.
            </span>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-teal-700 hover:bg-teal-800 disabled:bg-slate-300 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors flex items-center gap-2 shadow-xs"
            >
              {isSubmitting ? (
                <span>Confirming Booking...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm & Book Appointment</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* STEP 4: Confirmation Screen */}
      {currentStep === 4 && confirmedAppointment && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-md text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
              Booking Confirmed
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              You are all set, {confirmedAppointment.patientName}!
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Your consultation has been reserved in our system. A confirmation notification has been sent to{' '}
              <strong className="text-slate-800">{confirmedAppointment.patientEmail}</strong>.
            </p>
          </div>

          {/* Details Ticket */}
          <div className="max-w-md mx-auto bg-slate-50 rounded-2xl border border-slate-200 p-5 text-left text-xs space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500">Booking Reference</span>
              <strong className="font-mono text-teal-800 text-sm">{confirmedAppointment.id}</strong>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">Physician:</span>
              <strong className="text-slate-900">{confirmedAppointment.doctorName}</strong>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">Specialty:</span>
              <span className="text-slate-800">{confirmedAppointment.specialty}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">Date & Time:</span>
              <strong className="text-slate-900">
                {confirmedAppointment.date} at {confirmedAppointment.time}
              </strong>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">Setting:</span>
              <span className="font-semibold text-teal-700">{confirmedAppointment.mode}</span>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <span className="text-slate-500 block mb-0.5">Stated Chief Concern:</span>
              <p className="text-slate-700 italic">"{confirmedAppointment.reason}"</p>
            </div>
          </div>

          {/* Post-Booking Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleDownloadICS}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Add to Calendar (.ics)</span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className="w-full sm:w-auto px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <span>View in Patient Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => {
              setCurrentStep(1);
              setConfirmedAppointment(null);
            }}
            className="text-xs text-slate-500 hover:text-slate-800 underline block mx-auto"
          >
            Schedule another appointment
          </button>
        </div>
      )}
    </div>
  );
};
