import { Appointment, ChatMessage, PatientProfile } from '../types';

const PROFILE_KEY = 'medicare_ai_patient_profile';
const BOOKMARKS_KEY = 'medicare_ai_bookmarked_resources';
const APPOINTMENTS_KEY = 'medicare_ai_appointments';

export const DEFAULT_PATIENT_PROFILE: PatientProfile = {
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  phone: '+1 (555) 234-5678',
  dateOfBirth: '1992-06-14',
  bloodType: 'O Positive (O+)',
  allergies: ['Penicillin', 'Peanuts (Mild)'],
  chronicConditions: ['Mild Asthma (Exercise-induced)'],
  emergencyContactName: 'Robert Doe',
  emergencyContactPhone: '+1 (555) 876-5432',
  emergencyContactRelation: 'Spouse',
};

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'APT-9482',
    patientName: 'Jane Doe',
    patientEmail: 'jane.doe@example.com',
    patientPhone: '+1 (555) 234-5678',
    doctorId: 'doc-1',
    doctorName: 'Dr. Marcus Vance, MD, FACC',
    specialty: 'Cardiology & Preventive Heart Health',
    date: '2026-10-05',
    time: '10:00 AM',
    mode: 'Video Telehealth',
    status: 'Confirmed',
    reason: 'Routine annual cardiovascular risk review and resting blood pressure evaluation.',
    notes: 'Please measure resting blood pressure for 3 consecutive days prior to call.',
    createdAt: '2026-09-27T14:30:00Z',
  },
  {
    id: 'APT-8114',
    patientName: 'Jane Doe',
    patientEmail: 'jane.doe@example.com',
    patientPhone: '+1 (555) 234-5678',
    doctorId: 'doc-4',
    doctorName: 'Dr. Jonathan Hayes, MD, FAAD',
    specialty: 'Dermatology & Cutaneous Health',
    date: '2026-09-15',
    time: '02:30 PM',
    mode: 'In-Person Clinic',
    status: 'Completed',
    reason: 'Biannual skin lesion check and eczema treatment follow-up.',
    notes: 'Skin barrier function improved. Continue gentle hypoallergenic moisturizer.',
    createdAt: '2026-09-01T09:15:00Z',
    clinicalSummary: 'Examined upper extremity dermatosis; lesions resolving satisfactorily. No atypical melanocytic lesions identified on dermoscopy.',
    prescriptionSummary: 'Recommended Ceramide Barrier Cream BID; continue OTC Cetirizine as needed for pruritus.',
  },
];

// Profile storage
export function getSavedProfile(): PatientProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed reading patient profile from storage', e);
  }
  return DEFAULT_PATIENT_PROFILE;
}

export function saveProfile(profile: PatientProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed saving patient profile', e);
  }
}

// Bookmarks storage
export function getSavedBookmarks(): string[] {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed reading bookmarks', e);
  }
  return ['res-1', 'res-3'];
}

export function toggleBookmark(resourceId: string): string[] {
  const current = getSavedBookmarks();
  let updated: string[];
  if (current.includes(resourceId)) {
    updated = current.filter((id) => id !== resourceId);
  } else {
    updated = [...current, resourceId];
  }
  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed updating bookmarks', e);
  }
  return updated;
}

// Appointments API & Storage
export async function fetchAppointments(): Promise<Appointment[]> {
  try {
    const res = await fetch('/api/appointments');
    if (res.ok) {
      const data = await res.json();
      if (data.appointments && Array.isArray(data.appointments)) {
        localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(data.appointments));
        return data.appointments;
      }
    }
  } catch (e) {
    console.warn('Backend /api/appointments unreachable, using local store', e);
  }

  try {
    const local = localStorage.getItem(APPOINTMENTS_KEY);
    if (local) {
      return JSON.parse(local);
    }
  } catch (e) {
    // Ignore
  }

  return INITIAL_APPOINTMENTS;
}

export async function createAppointment(appointment: Omit<Appointment, 'id' | 'createdAt' | 'status'>): Promise<Appointment> {
  const newApt: Appointment = {
    ...appointment,
    id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
    status: 'Confirmed',
    createdAt: new Date().toISOString(),
  };

  try {
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newApt),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.appointment) {
        return data.appointment;
      }
    }
  } catch (e) {
    console.warn('Backend save failed, saving appointment locally', e);
  }

  // Local fallback
  const current = await fetchAppointments();
  const updated = [newApt, ...current];
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(updated));
  return newApt;
}

export async function cancelAppointment(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/appointments/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      return true;
    }
  } catch (e) {
    console.warn('Backend cancel failed, updating locally', e);
  }

  const current = await fetchAppointments();
  const updated = current.map((a) => (a.id === id ? { ...a, status: 'Cancelled' as const } : a));
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(updated));
  return true;
}

// AI Health Assistant API call
export async function sendChatMessage(message: string, history: ChatMessage[]): Promise<{
  reply: string;
  isEmergency: boolean;
  followUpQuestions?: string[];
  suggestedAction?: string;
}> {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        history: history.map((h) => ({ sender: h.sender, text: h.text })),
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        reply: data.reply,
        isEmergency: !!data.isEmergency,
        followUpQuestions: data.followUpQuestions,
        suggestedAction: data.suggestedAction,
      };
    }
  } catch (err) {
    console.warn('Error connecting to /api/chat, triggering client fallback:', err);
  }

  // Client safety fallback in case server was restarting
  return {
    reply: `### 🩺 Educational Health Overview
We are currently operating in high-availability mode. For general symptoms such as mild headache, seasonal congestion, or fatigue, common clinical guidance recommends hydration, quality rest, balanced nutrition, and monitoring for pattern changes.

### ❓ Follow-Up Questions to Consider
- Have these symptoms occurred repeatedly or is this the first episode?
- Do you take any regular prescription medications?

### 👨‍⚕️ When to Consult a Qualified Doctor
Whenever symptoms cause distress, persist beyond 48-72 hours, or worsen, please schedule an appointment with a qualified clinician.

---
*Disclaimer: This assistant provides general health education and is not a substitute for professional medical advice, diagnosis, or treatment.*`,
    isEmergency: false,
    followUpQuestions: [
      'What specific symptoms have you observed today?',
      'Would you like to book an appointment with one of our board-certified doctors?',
    ],
  };
}
