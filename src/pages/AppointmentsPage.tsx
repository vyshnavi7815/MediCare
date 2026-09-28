import React from 'react';
import { Doctor } from '../types';
import { PatientAppointmentJourney } from '../components/PatientAppointmentJourney';

interface AppointmentsPageProps {
  selectedDoctor: Doctor | null;
  setSelectedDoctor: (doctor: Doctor | null) => void;
  setActiveTab: (tab: string) => void;
  onAppointmentCreated?: () => void;
}

export const AppointmentsPage: React.FC<AppointmentsPageProps> = ({
  selectedDoctor,
  setSelectedDoctor,
  setActiveTab,
  onAppointmentCreated,
}) => {
  return (
    <div className="py-2">
      <PatientAppointmentJourney
        initialDoctor={selectedDoctor}
        onReturnToHome={() => {
          setSelectedDoctor(null);
          setActiveTab('appointments');
        }}
        onViewPortal={() => {
          if (onAppointmentCreated) onAppointmentCreated();
          setActiveTab('dashboard');
        }}
      />
    </div>
  );
};
