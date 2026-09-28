import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Video,
  Building,
  User,
  Shield,
  Bookmark,
  CheckCircle2,
  XCircle,
  FileText,
  AlertTriangle,
  ArrowRight,
  Save,
  Phone,
  Heart,
  Activity,
  Plus,
  Trash2,
} from 'lucide-react';
import { Appointment, PatientProfile, HealthResource } from '../types';
import {
  fetchAppointments,
  cancelAppointment,
  getSavedProfile,
  saveProfile,
  getSavedBookmarks,
  toggleBookmark,
} from '../services/api';
import { HEALTH_RESOURCES } from '../data/resources';
import { TelehealthRoomModal } from '../components/TelehealthRoomModal';

interface DashboardPageProps {
  setActiveTab: (tab: string) => void;
  onOpenResource: (resourceId: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ setActiveTab, onOpenResource }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingApts, setLoadingApts] = useState(true);
  const [profile, setProfile] = useState<PatientProfile>(getSavedProfile());
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(getSavedBookmarks());
  const [activeTab, setActiveTabLocal] = useState<'upcoming' | 'history' | 'saved' | 'profile'>('upcoming');
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);
  const [activeTelehealthApt, setActiveTelehealthApt] = useState<Appointment | null>(null);

  // New allergy/condition inputs
  const [newAllergy, setNewAllergy] = useState('');
  const [newCondition, setNewCondition] = useState('');

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    setLoadingApts(true);
    const data = await fetchAppointments();
    setAppointments(data);
    setLoadingApts(false);
  };

  const handleCancel = async (id: string) => {
    if (window.confirm('Are you sure you want to cancel this scheduled appointment?')) {
      await cancelAppointment(id);
      await loadAppointments();
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    saveProfile(profile);
    setProfileSaveSuccess(true);
    setTimeout(() => setProfileSaveSuccess(false), 3000);
  };

  const handleAddAllergy = () => {
    if (newAllergy.trim() && !profile.allergies.includes(newAllergy.trim())) {
      const updated = { ...profile, allergies: [...profile.allergies, newAllergy.trim()] };
      setProfile(updated);
      saveProfile(updated);
      setNewAllergy('');
    }
  };

  const handleRemoveAllergy = (item: string) => {
    const updated = { ...profile, allergies: profile.allergies.filter((a) => a !== item) };
    setProfile(updated);
    saveProfile(updated);
  };

  const handleAddCondition = () => {
    if (newCondition.trim() && !profile.chronicConditions.includes(newCondition.trim())) {
      const updated = { ...profile, chronicConditions: [...profile.chronicConditions, newCondition.trim()] };
      setProfile(updated);
      saveProfile(updated);
      setNewCondition('');
    }
  };

  const handleRemoveCondition = (item: string) => {
    const updated = { ...profile, chronicConditions: profile.chronicConditions.filter((c) => c !== item) };
    setProfile(updated);
    saveProfile(updated);
  };

  const handleRemoveBookmark = (id: string) => {
    const updated = toggleBookmark(id);
    setBookmarkedIds(updated);
  };

  const upcomingAppointments = appointments.filter((a) => a.status === 'Confirmed');
  const pastAppointments = appointments.filter((a) => a.status !== 'Confirmed');
  const bookmarkedResources = HEALTH_RESOURCES.filter((r) => bookmarkedIds.includes(r.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Patient Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-700 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold shadow-md shadow-teal-700/20">
            {profile.name.charAt(0) || 'P'}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900">{profile.name}</h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 font-semibold">
                Patient Member
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {profile.email} · Phone: {profile.phone}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-slate-600 font-medium">Blood Type:</span>
              <strong className="text-slate-900 font-semibold">{profile.bloodType}</strong>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-slate-600 font-medium">Emergency Contact:</span>
              <strong className="text-slate-900 font-semibold">
                {profile.emergencyContactName} ({profile.emergencyContactPhone})
              </strong>
            </div>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('appointments')}
          className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors flex items-center gap-2 shadow-xs shrink-0"
        >
          <Calendar className="w-4 h-4" />
          <span>Book New Consultation</span>
        </button>
      </div>

      {/* Quick Stat Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 block mb-1">Upcoming Visits</span>
          <strong className="text-2xl font-bold text-slate-900">{upcomingAppointments.length}</strong>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 block mb-1">Completed Consultations</span>
          <strong className="text-2xl font-bold text-slate-900">
            {appointments.filter((a) => a.status === 'Completed').length}
          </strong>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 block mb-1">Saved Health Guides</span>
          <strong className="text-2xl font-bold text-slate-900">{bookmarkedResources.length}</strong>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 block mb-1">Documented Allergies</span>
          <strong className="text-2xl font-bold text-amber-700">{profile.allergies.length}</strong>
        </div>
      </div>

      {/* Dashboard Sub-navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTabLocal('upcoming')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'upcoming'
              ? 'text-teal-800 border-b-2 border-teal-700'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Upcoming Visits ({upcomingAppointments.length})
        </button>

        <button
          onClick={() => setActiveTabLocal('history')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'history'
              ? 'text-teal-800 border-b-2 border-teal-700'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Previous Consultations ({pastAppointments.length})
        </button>

        <button
          onClick={() => setActiveTabLocal('saved')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'saved'
              ? 'text-teal-800 border-b-2 border-teal-700'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Saved Resources ({bookmarkedResources.length})
        </button>

        <button
          onClick={() => setActiveTabLocal('profile')}
          className={`pb-3 relative transition-colors ${
            activeTab === 'profile'
              ? 'text-teal-800 border-b-2 border-teal-700'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Health Profile & Allergies
        </button>
      </div>

      {/* TAB 1: Upcoming Appointments */}
      {activeTab === 'upcoming' && (
        <div className="space-y-4">
          {upcomingAppointments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="font-mono text-xs font-semibold text-teal-800">{apt.id}</span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Confirmed</span>
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900">{apt.doctorName}</h3>
                      <p className="text-xs text-teal-700 font-medium">{apt.specialty}</p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                        <Calendar className="w-3.5 h-3.5 text-teal-600" />
                        <span>
                          {apt.date} at {apt.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {apt.mode === 'Video Telehealth' ? (
                          <Video className="w-3.5 h-3.5 text-teal-600" />
                        ) : (
                          <Building className="w-3.5 h-3.5 text-slate-600" />
                        )}
                        <span>{apt.mode}</span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-600">
                      <strong className="text-slate-800">Visit Reason:</strong> {apt.reason}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    {apt.mode === 'Video Telehealth' ? (
                      <button
                        onClick={() => setActiveTelehealthApt(apt)}
                        className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                      >
                        <Video className="w-4 h-4" />
                        <span>Join Video Room</span>
                      </button>
                    ) : (
                      <span className="text-xs text-slate-500 font-medium">In-person clinic check-in</span>
                    )}

                    <button
                      onClick={() => handleCancel(apt.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      Cancel Visit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <Calendar className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No upcoming appointments scheduled</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Need to discuss symptoms or schedule an annual checkup? Book with our board-certified physicians anytime.
              </p>
              <button
                onClick={() => setActiveTab('appointments')}
                className="px-5 py-2.5 bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-xs"
              >
                Schedule Appointment
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Previous Consultations History */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {pastAppointments.length > 0 ? (
            <div className="space-y-4">
              {pastAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <div>
                      <span className="font-mono text-xs font-semibold text-slate-400">{apt.id}</span>
                      <h3 className="text-base font-bold text-slate-900">{apt.doctorName}</h3>
                      <p className="text-xs text-teal-700 font-medium">{apt.specialty}</p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          apt.status === 'Completed'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {apt.status}
                      </span>
                      <p className="text-xs text-slate-500 mt-1">
                        {apt.date} · {apt.mode}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs space-y-2">
                    <p className="text-slate-700">
                      <strong>Chief Complaint:</strong> {apt.reason}
                    </p>

                    {apt.clinicalSummary && (
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                        <strong className="block text-slate-900 font-semibold">Doctor's Clinical Summary:</strong>
                        <p className="text-slate-700">{apt.clinicalSummary}</p>
                      </div>
                    )}

                    {apt.prescriptionSummary && (
                      <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-200 space-y-1">
                        <strong className="block text-teal-900 font-semibold">Physician Prescribed Regimen:</strong>
                        <p className="text-slate-700">{apt.prescriptionSummary}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-2">
              <FileText className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No previous consultations recorded</h3>
              <p className="text-xs text-slate-500">Completed visit summaries and physician notes will appear here.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Saved Resources */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          {bookmarkedResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookmarkedResources.map((res) => (
                <div
                  key={res.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-semibold text-teal-700">{res.category}</span>
                      <span>{res.readTime}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">{res.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2">{res.summary}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => onOpenResource(res.id)}
                      className="text-teal-700 font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>Read Guide</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleRemoveBookmark(res.id)}
                      className="text-rose-600 hover:text-rose-700 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <Bookmark className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No saved health guides yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore our evidence-based medical articles and bookmark topics for quick reference.
              </p>
              <button
                onClick={() => setActiveTab('resources')}
                className="px-5 py-2 bg-teal-700 text-white font-semibold text-xs rounded-xl"
              >
                Browse Health Library
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Health Profile Settings & Allergies */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Personal Health Profile</h2>
              <p className="text-xs text-slate-500">
                Keep critical allergy information and emergency contacts up to date.
              </p>
            </div>
            {profileSaveSuccess && (
              <span className="text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg flex items-center gap-1 animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" /> Profile Updated
              </span>
            )}
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Phone</label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">Blood Type</label>
                <select
                  value={profile.bloodType}
                  onChange={(e) => setProfile({ ...profile, bloodType: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="O Positive (O+)">O Positive (O+)</option>
                  <option value="O Negative (O-)">O Negative (O-)</option>
                  <option value="A Positive (A+)">A Positive (A+)</option>
                  <option value="A Negative (A-)">A Negative (A-)</option>
                  <option value="B Positive (B+)">B Positive (B+)</option>
                  <option value="B Negative (B-)">B Negative (B-)</option>
                  <option value="AB Positive (AB+)">AB Positive (AB+)</option>
                  <option value="AB Negative (AB-)">AB Negative (AB-)</option>
                </select>
              </div>
            </div>

            {/* Documented Allergies */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>Known Allergies & Sensitivities:</span>
                <span className="text-amber-700 text-[11px] font-normal">
                  Shared with attending physician prior to appointments
                </span>
              </label>

              <div className="flex flex-wrap gap-2">
                {profile.allergies.map((allergy, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-xs font-medium"
                  >
                    <span>{allergy}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAllergy(allergy)}
                      className="text-amber-700 hover:text-amber-950"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-1 max-w-sm">
                <input
                  type="text"
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  placeholder="E.g. Latex, Sulfa drugs, Shellfish..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  type="button"
                  onClick={handleAddAllergy}
                  className="px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-700"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Chronic Conditions */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-700">
                Chronic Health Considerations:
              </label>

              <div className="flex flex-wrap gap-2">
                {profile.chronicConditions.map((cond, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-50 text-teal-900 border border-teal-200 text-xs font-medium"
                  >
                    <span>{cond}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCondition(cond)}
                      className="text-teal-700 hover:text-teal-950"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-1 max-w-sm">
                <input
                  type="text"
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  placeholder="E.g. Asthma, Hypertension, Type 2 Diabetes..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  type="button"
                  onClick={handleAddCondition}
                  className="px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-700"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Designated Emergency Contact
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-600">Contact Name</label>
                  <input
                    type="text"
                    value={profile.emergencyContactName}
                    onChange={(e) => setProfile({ ...profile, emergencyContactName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-600">Relationship</label>
                  <input
                    type="text"
                    value={profile.emergencyContactRelation}
                    onChange={(e) => setProfile({ ...profile, emergencyContactRelation: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-600">Contact Phone</label>
                  <input
                    type="tel"
                    value={profile.emergencyContactPhone}
                    onChange={(e) => setProfile({ ...profile, emergencyContactPhone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Telehealth Room Modal */}
      <TelehealthRoomModal
        isOpen={!!activeTelehealthApt}
        appointment={activeTelehealthApt}
        onClose={() => setActiveTelehealthApt(null)}
      />
    </div>
  );
};
