export type ConsultationMode = 'Video Telehealth' | 'In-Person Clinic';

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  subSpecialty?: string;
  qualifications: string;
  experienceYears: number;
  hospital: string;
  location: string;
  address: string;
  rating: number;
  reviewCount: number;
  consultationModes: ConsultationMode[];
  consultationFee: number;
  nextAvailable: string;
  availableDays: string[];
  timeSlots: string[];
  bio: string;
  languages: string[];
  education: string[];
  boardCertifications: string[];
  imageUrl: string;
}

export interface Appointment {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  mode: ConsultationMode;
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  reason: string;
  notes?: string;
  createdAt: string;
  clinicalSummary?: string;
  prescriptionSummary?: string;
}

export interface HealthResource {
  id: string;
  title: string;
  slug: string;
  category: 'Preventive Care' | 'Cardiology' | 'Nutrition' | 'Pediatrics' | 'Mental Wellness' | 'Exercise & PT' | 'Chronic Conditions' | 'Neurology';
  summary: string;
  readTime: string;
  publishedDate: string;
  medicallyReviewedBy: string;
  sourceCitations: string[];
  keyTakeaways: string[];
  sections: {
    heading: string;
    content: string;
  }[];
  tags: string[];
  imageUrl: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isEmergency?: boolean;
  followUpQuestions?: string[];
  suggestedAction?: string;
}

export interface PatientProfile {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  bloodType: string;
  allergies: string[];
  chronicConditions: string[];
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
}
