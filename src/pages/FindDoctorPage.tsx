import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Calendar,
  Clock,
  Video,
  Building,
  GraduationCap,
  Award,
  Globe,
  X,
  Stethoscope,
  ChevronRight,
} from 'lucide-react';
import { DOCTORS_DATA, SPECIALTIES, LOCATIONS } from '../data/doctors';
import { Doctor } from '../types';

interface FindDoctorPageProps {
  onSelectDoctorForBooking: (doctor: Doctor) => void;
  setActiveTab: (tab: string) => void;
}

export const FindDoctorPage: React.FC<FindDoctorPageProps> = ({
  onSelectDoctorForBooking,
  setActiveTab,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedMode, setSelectedMode] = useState<'All' | 'Video Telehealth' | 'In-Person Clinic'>('All');
  const [selectedDoctorModal, setSelectedDoctorModal] = useState<Doctor | null>(null);

  const filteredDoctors = useMemo(() => {
    return DOCTORS_DATA.filter((doc) => {
      const matchesSearch =
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.hospital.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSpecialty =
        selectedSpecialty === 'All Specialties' || doc.specialty === selectedSpecialty;

      const matchesLocation =
        selectedLocation === 'All Locations' || doc.location === selectedLocation;

      const matchesMode =
        selectedMode === 'All' || doc.consultationModes.includes(selectedMode as any);

      return matchesSearch && matchesSpecialty && matchesLocation && matchesMode;
    });
  }, [searchQuery, selectedSpecialty, selectedLocation, selectedMode]);

  const handleBookNow = (doctor: Doctor) => {
    onSelectDoctorForBooking(doctor);
    setActiveTab('appointments');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Clinical Directory</span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Find a Medical Specialist</h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
          Search board-certified physicians, compare credentials and consultation fees, and schedule an in-person clinic visit or encrypted video telehealth appointment.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Text Search */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by doctor name, condition, clinic..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
            />
          </div>

          {/* Specialty Dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
            >
              {SPECIALTIES.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>

          {/* Location Dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          <div className="md:col-span-2 flex items-center">
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSpecialty('All Specialties');
                setSelectedLocation('All Locations');
                setSelectedMode('All');
              }}
              className="w-full py-2.5 px-3 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-center"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Consultation Mode Segmented Filter */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
            {(['All', 'Video Telehealth', 'In-Person Clinic'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setSelectedMode(mode)}
                className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
                  selectedMode === mode
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {mode === 'All' ? 'All Modes' : mode}
              </button>
            ))}
          </div>

          <div className="text-slate-500">
            Showing <strong className="text-slate-800 font-semibold">{filteredDoctors.length}</strong> available physicians
          </div>
        </div>
      </div>

      {/* Doctors Grid */}
      {filteredDoctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Doctor Headshot & Badges */}
                <div className="relative h-52 w-full bg-slate-100">
                  <img
                    src={doc.imageUrl}
                    alt={doc.name}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-bold text-slate-800 flex items-center gap-1 shadow-xs">
                    <span>★ {doc.rating}</span>
                    <span className="text-slate-400 font-normal">({doc.reviewCount})</span>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded-md">
                    {doc.location}
                  </div>
                </div>

                {/* Doctor Info */}
                <div className="p-5 space-y-3">
                  <div>
                    <span className="text-xs font-semibold text-teal-700 uppercase tracking-wide">
                      {doc.specialty}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">{doc.name}</h3>
                    <p className="text-xs text-slate-500">{doc.title}</p>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{doc.bio}</p>

                  {/* Consultation Modes & Next Slot */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Next Slot:</span>
                      </span>
                      <strong className="text-emerald-700">{doc.nextAvailable}</strong>
                    </div>

                    <div className="flex items-center justify-between text-slate-600">
                      <span className="flex items-center gap-1">
                        <Video className="w-3.5 h-3.5 text-teal-600" />
                        <span>Modes:</span>
                      </span>
                      <span className="text-slate-800 font-medium">
                        {doc.consultationModes.join(' · ')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600 pt-1">
                      <span>Consultation Fee:</span>
                      <strong className="text-slate-900 font-bold text-sm">
                        ${doc.consultationFee}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0 space-y-2">
                <button
                  onClick={() => handleBookNow(doc)}
                  className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Appointment</span>
                </button>

                <button
                  onClick={() => setSelectedDoctorModal(doc)}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                >
                  <span>View Full Profile</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No matching physicians found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search criteria or resetting filters to view all board-certified doctors in our network.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedSpecialty('All Specialties');
              setSelectedLocation('All Locations');
              setSelectedMode('All');
            }}
            className="px-4 py-2 bg-teal-700 text-white text-xs font-semibold rounded-lg"
          >
            Show All Doctors
          </button>
        </div>
      )}

      {/* Doctor Detail Modal */}
      {selectedDoctorModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="relative bg-slate-900 text-white p-6 sm:p-8">
              <button
                onClick={() => setSelectedDoctorModal(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <img
                  src={selectedDoctorModal.imageUrl}
                  alt={selectedDoctorModal.name}
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-teal-500 shrink-0"
                />
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-xs font-bold text-teal-400 uppercase tracking-wide">
                    {selectedDoctorModal.specialty}
                  </span>
                  <h3 className="text-xl font-bold text-white">{selectedDoctorModal.name}</h3>
                  <p className="text-xs text-slate-300">{selectedDoctorModal.title}</p>
                  <p className="text-xs text-slate-400 pt-1">
                    {selectedDoctorModal.hospital} · {selectedDoctorModal.experienceYears} Years Clinical Experience
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm text-slate-600">
              {/* Bio */}
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Clinical Biography</h4>
                <p className="leading-relaxed text-slate-700">{selectedDoctorModal.bio}</p>
              </div>

              {/* Education & Qualifications */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div className="space-y-1.5">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-teal-600" />
                    <span>Education & Fellowships</span>
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {selectedDoctorModal.education.map((edu, idx) => (
                      <li key={idx}>• {edu}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-teal-600" />
                    <span>Board Certifications</span>
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {selectedDoctorModal.boardCertifications.map((cert, idx) => (
                      <li key={idx}>• {cert}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Languages & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 text-xs">
                <div>
                  <span className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                    <Globe className="w-4 h-4 text-teal-600" />
                    <span>Spoken Languages</span>
                  </span>
                  <p className="text-slate-600">{selectedDoctorModal.languages.join(', ')}</p>
                </div>

                <div>
                  <span className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                    <Building className="w-4 h-4 text-teal-600" />
                    <span>Clinic Facility</span>
                  </span>
                  <p className="text-slate-600">{selectedDoctorModal.address}</p>
                </div>
              </div>

              {/* Consultation Details */}
              <div className="p-4 bg-teal-50/80 rounded-2xl border border-teal-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-teal-800 font-medium block">Standard Consultation Fee</span>
                  <strong className="text-xl font-bold text-teal-950">${selectedDoctorModal.consultationFee}</strong>
                </div>
                <div className="text-right">
                  <span className="text-xs text-teal-800 font-medium block">Next Available Slot</span>
                  <strong className="text-sm font-semibold text-emerald-800">{selectedDoctorModal.nextAvailable}</strong>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => setSelectedDoctorModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Close
              </button>

              <button
                onClick={() => {
                  const doc = selectedDoctorModal;
                  setSelectedDoctorModal(null);
                  handleBookNow(doc);
                }}
                className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Book with {selectedDoctorModal.name.split(',')[0]}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
