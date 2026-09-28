/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { EmergencyBanner } from './components/EmergencyBanner';
import { Footer } from './components/Footer';
import { MedicalDisclaimerModal } from './components/MedicalDisclaimerModal';
import { HomePage } from './pages/HomePage';
import { AssistantPage } from './pages/AssistantPage';
import { FindDoctorPage } from './pages/FindDoctorPage';
import { AppointmentsPage } from './pages/AppointmentsPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { DashboardPage } from './pages/DashboardPage';
import { EmergencyPage } from './pages/EmergencyPage';
import { Doctor } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('appointments');
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<Doctor | null>(null);
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);
  const [policyModal, setPolicyModal] = useState<{
    isOpen: boolean;
    type: 'disclaimer' | 'privacy' | 'terms';
  }>({
    isOpen: false,
    type: 'disclaimer',
  });

  const handleOpenEmergency = () => {
    setActiveTab('emergency');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPolicy = (type: 'disclaimer' | 'privacy' | 'terms') => {
    setPolicyModal({ isOpen: true, type });
  };

  const handleSelectDoctorForBooking = (doctor: Doctor) => {
    setSelectedDoctorForBooking(doctor);
    setActiveTab('appointments');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectResource = (resourceId: string) => {
    setSelectedResourceId(resourceId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Urgent Emergency Notification Bar */}
      <EmergencyBanner onOpenEmergency={handleOpenEmergency} />

      {/* Main App Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenEmergency={handleOpenEmergency}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {activeTab === 'appointments' && (
          <AppointmentsPage
            selectedDoctor={selectedDoctorForBooking}
            setSelectedDoctor={setSelectedDoctorForBooking}
            setActiveTab={setActiveTab}
            onAppointmentCreated={() => {
              // Can trigger notifications if needed
            }}
          />
        )}

        {activeTab === 'home' && (
          <HomePage
            setActiveTab={setActiveTab}
            onSelectDoctorForBooking={handleSelectDoctorForBooking}
            onOpenEmergency={handleOpenEmergency}
            onSelectResource={handleSelectResource}
          />
        )}

        {activeTab === 'assistant' && (
          <AssistantPage
            setActiveTab={setActiveTab}
            onOpenEmergency={handleOpenEmergency}
          />
        )}

        {activeTab === 'doctors' && (
          <FindDoctorPage
            onSelectDoctorForBooking={handleSelectDoctorForBooking}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'resources' && (
          <ResourcesPage selectedResourceId={selectedResourceId} />
        )}

        {activeTab === 'dashboard' && (
          <DashboardPage
            setActiveTab={setActiveTab}
            onOpenResource={(resId) => {
              setSelectedResourceId(resId);
              setActiveTab('resources');
            }}
          />
        )}

        {activeTab === 'emergency' && (
          <EmergencyPage onBackToHome={() => setActiveTab('appointments')} />
        )}
      </main>

      {/* Clinical Healthcare Footer */}
      <Footer
        setActiveTab={setActiveTab}
        onOpenPolicy={handleOpenPolicy}
        onOpenEmergency={handleOpenEmergency}
      />

      {/* Full Medical Disclaimer & Governance Modal */}
      <MedicalDisclaimerModal
        isOpen={policyModal.isOpen}
        type={policyModal.type}
        onClose={() => setPolicyModal({ ...policyModal, isOpen: false })}
      />
    </div>
  );
}
