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
*Disclaimer: This assistant provides general health education only and is not a substitute for professional medical advice, diagnosis, or treatment.*`,
    isEmergency: false,
    followUpQuestions: [
      'What specific symptoms have you observed today?',
      'Would you like to book an appointment with one of our board-certified doctors?',
    ],
  };
}

export interface HealthEducationData {
  overview: string;
  selfCare: string;
  reflectionQuestions: string[];
  doctorWhen: string;
  isEmergency: boolean;
}

export async function generateHealthEducation(reason: string, specialty?: string): Promise<HealthEducationData> {
  const lower = reason.toLowerCase();
  const emergencyKeywords = [
    'chest pain', 'heart attack', 'stroke', 'cant breathe', 'cannot breathe',
    'shortness of breath', 'severe bleeding', 'unconscious', 'anaphylaxis',
    'suicide', 'kill myself', 'overdose', 'facial drooping', 'paralyzed'
  ];

  const isEmergency = emergencyKeywords.some(kw => lower.includes(kw));

  if (isEmergency) {
    return {
      isEmergency: true,
      overview: 'The symptoms described may indicate an acute, urgent clinical event that requires immediate emergency evaluation rather than routine outpatient scheduling.',
      selfCare: 'Remain as calm and still as possible. Seat yourself in an upright, supported position. Unlock your entry doors so emergency responders can access you without delay.',
      reflectionQuestions: [
        'Are you currently accompanied by someone who can provide immediate assistance?',
        'Do symptoms include radiating pressure to the left arm/jaw, or sudden speech or facial numbness?'
      ],
      doctorWhen: 'Call 911 (or 112 internationally) immediately. Do not attempt to drive yourself to an emergency facility if experiencing severe chest pressure, respiratory arrest, or sudden neurological deficits.',
    };
  }

  // Check specific health topics for tailored educational insights
  if (lower.includes('blood pressure') || lower.includes('hypertension') || specialty === 'Cardiology') {
    return {
      isEmergency: false,
      overview: 'Blood pressure reflects the hydrostatic force that circulating blood exerts against arterial walls. Elevated readings may be influenced by multiple physiological factors, including temporary physical stress, caffeine, sodium intake, or vascular resistance changes.',
      selfCare: 'Rest quietly in a seated position for 5 minutes prior to measurements with feet flat. Consider keeping a twice-daily home blood pressure log. Gentle walking, hydration, and reducing dietary sodium may support circulatory wellness.',
      reflectionQuestions: [
        'Over what timeline have you noticed elevated readings or cardiovascular symptoms?',
        'Are you experiencing accompanying symptoms such as morning headaches, visual changes, or palpitations?',
        'Do you take any regular prescription medications or dietary supplements?'
      ],
      doctorWhen: 'Consult a physician if resting home blood pressure consistently exceeds 130/80 mmHg across multiple days. If readings exceed 180/120 mmHg or are accompanied by chest pain, seek emergency medical care immediately.'
    };
  }

  if (lower.includes('headache') || lower.includes('migraine') || specialty === 'Neurology') {
    return {
      isEmergency: false,
      overview: 'Headaches can arise from primary neurological patterns (such as tension or migraine mechanisms) or secondary triggers like dehydration, cervical spine tension, or screen-related eye strain. One possible cause may be muscular contraction of cranial and neck tissues.',
      selfCare: 'Rest in a quiet, dimly lit room. Applying a cool compress to the forehead or a warm compress to the neck may provide comfort. Ensure adequate water intake and practice gentle neck mobility stretches.',
      reflectionQuestions: [
        'How would you describe the sensation—is it throbbing, dull, or a band-like squeezing pressure?',
        'Have you noticed specific triggers such as skipped meals, lack of sleep, or screen exposure?',
        'Are you experiencing sensitivity to light, sound, or nausea?'
      ],
      doctorWhen: 'Professional evaluation is advisable if headaches increase in frequency, severity, or fail to respond to rest. Seek immediate emergency care if a headache strikes with sudden, extreme intensity (thunderclap) or is accompanied by fever, neck stiffness, or confusion.'
    };
  }

  if (lower.includes('fever') || lower.includes('child') || lower.includes('baby') || specialty === 'Pediatrics') {
    return {
      isEmergency: false,
      overview: 'A fever is generally an adaptive physiological immune response to viral or bacterial antigens, in which the hypothalamus raises core body temperature to slow pathogen replication.',
      selfCare: 'Maintain frequent sips of fluids (water, electrolyte solutions, or broths). Dress in light, breathable clothing and rest in a well-ventilated room. Lukewarm sponge baths can offer comfort.',
      reflectionQuestions: [
        'What is the measured temperature, and how many days has it been elevated?',
        'Are there accompanying symptoms such as cough, ear pulling, rash, or reduced urination?',
        'Is the individual maintaining adequate hydration and alertness?'
      ],
      doctorWhen: 'Contact a healthcare provider if a fever lasts longer than 3 days, rises above 103°F (39.4°C) in adults, or occurs in an infant under 3 months of age (which requires same-day emergency assessment).'
    };
  }

  if (lower.includes('rash') || lower.includes('skin') || lower.includes('eczema') || specialty === 'Dermatology') {
    return {
      isEmergency: false,
      overview: 'Cutaneous reactions can stem from immune-mediated allergic contact dermatitis, xerosis (dry skin barrier), viral exanthems, or chronic inflammatory skin conditions. One possible cause may be contact with an irritant or allergen.',
      selfCare: 'Cleanse the area with mild, fragrance-free cleansers. Avoid hot showers and harsh soaps. Apply a hypoallergenic ceramide moisturizer to damp skin to support the barrier.',
      reflectionQuestions: [
        'When did the skin reaction first appear, and has it spread to other areas of the body?',
        'Have you recently introduced new laundry detergents, personal care products, or medications?',
        'Is the skin primarily itchy, burning, blistered, or tender to the touch?'
      ],
      doctorWhen: 'Consult a dermatologist or primary care doctor if the rash is painful, exhibits signs of infection (such as yellow crusting or pus), or does not improve with gentle skincare. Seek immediate emergency care if a rash is accompanied by facial swelling, hives, or breathing difficulty.'
    };
  }

  if (lower.includes('back') || lower.includes('joint') || lower.includes('knee') || lower.includes('shoulder') || specialty === 'Orthopedics') {
    return {
      isEmergency: false,
      overview: 'Musculoskeletal discomfort may originate from ligamentous strain, tendon irritation, muscular spasm, or joint biomechanical imbalance. One possible contributing factor can be prolonged sedentary posture or unconditioned lifting.',
      selfCare: 'Adopt gentle, pain-free mobility movements. Avoid prolonged bed rest, as gentle walking can promote blood flow to healing tissues. An ice pack wrapped in a cloth or mild heat may provide temporary relief.',
      reflectionQuestions: [
        'Did the discomfort begin following a specific lifting, twisting, or athletic movement?',
        'Does the sensation radiate down an arm or leg, or remain localized?',
        'What positions or activities make the discomfort better or worse?'
      ],
      doctorWhen: 'Schedule a medical assessment if joint or spinal discomfort persists beyond a week, restricts normal walking, or causes swelling. Seek immediate emergency attention if back pain is accompanied by loss of bowel/bladder control or progressive numbness in the legs.'
    };
  }

  // General fallback
  return {
    isEmergency: false,
    overview: 'Health symptoms can represent the body’s adaptive response to environmental factors, mild viral infections, fatigue, or underlying physiological imbalances. One possible cause may be everyday physical stress or lifestyle fluctuations.',
    selfCare: 'Prioritize adequate hydration, restorative sleep (7–9 hours for adults), nutritious whole foods, and pacing daily activities. Avoid strenuous exertion while symptoms are actively resolving.',
    reflectionQuestions: [
      'How long have you experienced this concern, and have symptoms worsened over time?',
      'Have you noticed any specific triggers, times of day, or activities that affect the condition?',
      'Are you taking any over-the-counter medications, and have they provided any relief?'
    ],
    doctorWhen: 'A clinical consultation is recommended whenever symptoms persist, disrupt sleep or daily productivity, or cause distress. If any sudden severe signs appear, seek immediate emergency care.'
  };
}

