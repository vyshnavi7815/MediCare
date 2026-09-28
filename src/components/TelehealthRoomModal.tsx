import React, { useState, useEffect } from 'react';
import { X, Mic, MicOff, Video, VideoOff, MessageSquare, Shield, Users, Clock, PhoneOff } from 'lucide-react';
import { Appointment } from '../types';

interface TelehealthRoomModalProps {
  isOpen: boolean;
  appointment: Appointment | null;
  onClose: () => void;
}

export const TelehealthRoomModal: React.FC<TelehealthRoomModalProps> = ({
  isOpen,
  appointment,
  onClose,
}) => {
  const [micActive, setMicActive] = useState(true);
  const [videoActive, setVideoActive] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [activeTab, setActiveTab] = useState<'video' | 'notes'>('video');
  const [doctorJoined, setDoctorJoined] = useState(false);

  useEffect(() => {
    let timer: any;
    if (isOpen) {
      setCallDuration(0);
      setDoctorJoined(false);

      // Simulate doctor joining after 3 seconds
      const joinTimer = setTimeout(() => {
        setDoctorJoined(true);
      }, 3000);

      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);

      return () => {
        clearInterval(timer);
        clearTimeout(joinTimer);
      };
    }
  }, [isOpen]);

  if (!isOpen || !appointment) return null;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="bg-slate-900 text-white rounded-2xl max-w-5xl w-full h-[90vh] max-h-[800px] flex flex-col shadow-2xl border border-slate-800 overflow-hidden">
        {/* Top Telehealth Bar */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white text-sm sm:text-base">
                  Encrypted Telehealth Consultation Room
                </h3>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800 font-mono">
                  HIPAA-Compliant
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {appointment.doctorName} · {appointment.specialty}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>{formatDuration(callDuration)}</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Area */}
        <div className="flex-1 relative bg-slate-950 p-4 grid grid-cols-1 md:grid-cols-4 gap-4 overflow-hidden">
          {/* Main Video Screen (Doctor or Waiting room) */}
          <div className="md:col-span-3 relative rounded-xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
            {doctorJoined ? (
              <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950 p-6 text-center">
                <div className="relative mb-4">
                  <div className="w-28 h-28 rounded-full border-4 border-teal-500/40 p-1 shadow-lg overflow-hidden bg-slate-800 flex items-center justify-center">
                    <Users className="w-14 h-14 text-teal-400" />
                  </div>
                  <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900" />
                </div>
                <h4 className="text-lg font-bold text-white">{appointment.doctorName}</h4>
                <p className="text-sm text-teal-400 font-medium">{appointment.specialty}</p>
                <p className="text-xs text-slate-400 mt-2 max-w-sm">
                  Audio & video streams connected. Doctor is reviewing your intake questionnaire and medical history.
                </p>

                {/* Subtitle simulation */}
                <div className="absolute bottom-6 left-6 right-6 bg-slate-950/80 backdrop-blur-xs border border-slate-800 rounded-xl p-3 text-xs text-slate-300">
                  <span className="font-semibold text-teal-300">{appointment.doctorName}:</span> "Hello {appointment.patientName}, welcome to our video consultation. I have your chart open. How are your symptoms progressing today?"
                </div>
              </div>
            ) : (
              <div className="text-center p-8 space-y-3">
                <div className="inline-block p-4 rounded-full bg-teal-950/60 border border-teal-800/80 text-teal-400 animate-spin">
                  <Users className="w-8 h-8" />
                </div>
                <h4 className="text-base font-semibold text-white">Connecting to Physician...</h4>
                <p className="text-xs text-slate-400 max-w-md">
                  Please hold while Dr. {appointment.doctorName.split(' ')[1] || 'Physician'} finishes preparing your patient chart. Your video and microphone tests were verified.
                </p>
              </div>
            )}

            {/* Patient Self-View Picture-in-Picture */}
            <div className="absolute top-4 right-4 w-36 sm:w-48 h-24 sm:h-32 rounded-lg overflow-hidden bg-slate-800 border-2 border-slate-700 shadow-xl flex items-center justify-center">
              {videoActive ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-850 p-2 text-center">
                  <div className="w-10 h-10 rounded-full bg-teal-800 flex items-center justify-center text-white font-bold text-sm mb-1">
                    {appointment.patientName.charAt(0)}
                  </div>
                  <span className="text-[11px] font-medium text-slate-300 truncate w-full">
                    {appointment.patientName} (You)
                  </span>
                </div>
              ) : (
                <div className="text-center p-2">
                  <VideoOff className="w-6 h-6 text-slate-500 mx-auto mb-1" />
                  <span className="text-[10px] text-slate-400">Camera Off</span>
                </div>
              )}
              <div className="absolute bottom-1 left-2 flex items-center gap-1 text-[9px] bg-slate-950/70 px-1.5 py-0.5 rounded text-slate-300 font-mono">
                {micActive ? <Mic className="w-2.5 h-2.5 text-emerald-400" /> : <MicOff className="w-2.5 h-2.5 text-rose-400" />}
                <span>HD</span>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Clinical Chart Summary & Notes */}
          <div className="md:col-span-1 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col overflow-hidden">
            <div className="flex border-b border-slate-850 pb-2 mb-3 gap-2">
              <button
                onClick={() => setActiveTab('video')}
                className={`flex-1 text-xs font-semibold py-1.5 rounded transition-colors ${
                  activeTab === 'video' ? 'bg-slate-800 text-teal-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                Visit Details
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`flex-1 text-xs font-semibold py-1.5 rounded transition-colors ${
                  activeTab === 'notes' ? 'bg-slate-800 text-teal-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                In-Call Notes
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 text-xs text-slate-300">
              {activeTab === 'video' ? (
                <>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 space-y-1">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Scheduled Reason</span>
                    <p className="text-slate-200">{appointment.reason || 'General Health Consultation'}</p>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 space-y-1">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Appointment ID</span>
                    <p className="font-mono text-teal-300">{appointment.id}</p>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 space-y-1">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Prep Guidelines</span>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-400 text-[11px]">
                      <li>Keep recent test results handy</li>
                      <li>Have current medication bottles ready</li>
                      <li>Sit in a well-lit, quiet room</li>
                    </ul>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <p className="text-[11px] text-slate-400">
                    You can jot down quick notes during this call. They will remain saved on your device.
                  </p>
                  <textarea
                    rows={8}
                    placeholder="Write doctor recommendations, medication instructions, or follow-up dates here..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>
              )}
            </div>

            <div className="mt-auto pt-3 border-t border-slate-850 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-teal-400" /> 256-bit Encrypted
              </span>
              <span>1080p @ 30fps</span>
            </div>
          </div>
        </div>

        {/* Bottom Control Dock */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-center gap-4">
          <button
            onClick={() => setMicActive(!micActive)}
            className={`p-3.5 rounded-full font-medium transition-colors ${
              micActive ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-rose-600 text-white hover:bg-rose-700'
            }`}
            title={micActive ? 'Mute Microphone' : 'Unmute Microphone'}
          >
            {micActive ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setVideoActive(!videoActive)}
            className={`p-3.5 rounded-full font-medium transition-colors ${
              videoActive ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-rose-600 text-white hover:bg-rose-700'
            }`}
            title={videoActive ? 'Turn Off Camera' : 'Turn On Camera'}
          >
            {videoActive ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setActiveTab(activeTab === 'notes' ? 'video' : 'notes')}
            className={`p-3.5 rounded-full font-medium transition-colors ${
              activeTab === 'notes' ? 'bg-teal-600 text-white' : 'bg-slate-800 text-white hover:bg-slate-700'
            }`}
            title="Toggle Visit Notes"
          >
            <MessageSquare className="w-5 h-5" />
          </button>

          <button
            onClick={onClose}
            className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-900/30 transition-all"
          >
            <PhoneOff className="w-5 h-5" />
            <span>End Consultation</span>
          </button>
        </div>
      </div>
    </div>
  );
};
