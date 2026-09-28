import React from 'react';
import {
  Calendar,
  BookOpen,
  Bot,
  ShieldCheck,
  Stethoscope,
  Video,
  Activity,
  Heart,
  Baby,
  Brain,
  ArrowRight,
  PhoneCall,
  Clock,
  Sparkles,
} from 'lucide-react';
import { DOCTORS_DATA } from '../data/doctors';
import { HEALTH_RESOURCES } from '../data/resources';
import { Doctor } from '../types';

interface HomePageProps {
  setActiveTab: (tab: string) => void;
  onSelectDoctorForBooking: (doctor: Doctor) => void;
  onOpenEmergency: () => void;
  onSelectResource: (resourceId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  setActiveTab,
  onSelectDoctorForBooking,
  onOpenEmergency,
  onSelectResource,
}) => {
  const featuredDoctors = DOCTORS_DATA.slice(0, 3);
  const featuredResources = HEALTH_RESOURCES.slice(0, 3);

  const clinicalServices = [
    {
      icon: Stethoscope,
      title: 'Primary & Preventive Care',
      desc: 'Annual wellness evaluations, cardiovascular assessments, and comprehensive preventative health screenings.',
      badge: 'In-Person & Virtual',
    },
    {
      icon: Video,
      title: 'Encrypted Telehealth Consultations',
      desc: 'Connect with certified physicians from anywhere with high-definition, HIPAA-compliant video appointments.',
      badge: '24/7 Availability',
    },
    {
      icon: Heart,
      title: 'Cardiology & Heart Health',
      desc: 'Expert lipidology, blood pressure management, and personalized cardiovascular risk prevention protocols.',
      badge: 'Specialized Care',
    },
    {
      icon: Baby,
      title: 'Pediatrics & Family Medicine',
      desc: 'Compassionate pediatric checkups, developmental tracking, and gentle family-centered health support.',
      badge: 'All Ages',
    },
    {
      icon: Brain,
      title: 'Neurology & Cognitive Wellness',
      desc: 'Evidence-based diagnosis and ongoing care for migraines, vestibular conditions, and neuro-longevity.',
      badge: 'Advanced Diagnostics',
    },
    {
      icon: Activity,
      title: 'Chronic Disease Management',
      desc: 'Individualized tracking plans for diabetes, hypertension, asthma, and thyroid metabolic conditions.',
      badge: 'Proactive Monitoring',
    },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:py-24 bg-gradient-to-b from-teal-50/60 via-slate-50 to-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-100/80 text-teal-900 border border-teal-200/80 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-teal-700" />
                <span>Evidence-Based · Clinical Governance · Certified Network</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Your Health,{' '}
                <span className="bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
                  Smarter and Simpler
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                MediCare AI brings together compassionate board-certified doctors, instant educational health intelligence, and seamless appointment booking—giving you clarity, confidence, and peace of mind at every step.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={() => setActiveTab('appointments')}
                  className="w-full sm:w-auto px-6 py-3.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm sm:text-base rounded-xl shadow-md shadow-teal-700/20 hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Book Appointment</span>
                </button>

                <button
                  onClick={() => setActiveTab('resources')}
                  className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm sm:text-base rounded-xl border border-slate-300 shadow-xs hover:border-slate-400 transition-all flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-5 h-5 text-slate-500" />
                  <span>Explore Health Information</span>
                </button>
              </div>

              {/* AI Health Assistant Prompt Callout */}
              <div className="pt-4">
                <div
                  onClick={() => setActiveTab('assistant')}
                  className="inline-flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3.5 sm:px-4 bg-white/90 border border-teal-200/90 rounded-2xl shadow-xs hover:border-teal-400 hover:shadow-md cursor-pointer transition-all max-w-xl text-left"
                >
                  <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-teal-800 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                      Try our AI Health Assistant
                    </span>
                    <p className="text-xs text-slate-500 truncate">
                      Have a general symptom question? Get evidence-based educational insights in plain language.
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-teal-700 flex items-center gap-1 self-end sm:self-center">
                    Ask now <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* Safety Footnote */}
              <p className="text-xs text-slate-400">
                *The AI assistant provides general educational information and does not replace the diagnosis or judgment of a qualified physician.
              </p>
            </div>

            {/* Right Hero Visual / Interactive Snapshot */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md bg-white rounded-3xl p-6 shadow-xl border border-slate-200/80">
                {/* Visual Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold">
                      DR
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Dr. Marcus Vance, MD</h4>
                      <p className="text-xs text-teal-700 font-medium">Cardiology Specialist · St. Jude Center</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Available Today
                  </span>
                </div>

                {/* Patient Case Preview */}
                <div className="py-4 space-y-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                    <div className="flex items-center justify-between text-slate-500">
                      <span>Next Open Consultation</span>
                      <span className="font-semibold text-slate-700">Today, 2:30 PM</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500">
                      <span>Consultation Modes</span>
                      <span className="font-semibold text-slate-700">Video Telehealth & Clinic</span>
                    </div>
                  </div>

                  <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-100 text-xs text-teal-900 space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold text-teal-800">
                      <Bot className="w-3.5 h-3.5 text-teal-600" />
                      <span>Pre-Visit Symptom Summary Ready</span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      "Patient recorded 3-day morning blood pressure log averaging 124/82. Chief complaint: Mild evening fatigue."
                    </p>
                  </div>
                </div>

                {/* Quick Booking Action on Hero Card */}
                <button
                  onClick={() => {
                    onSelectDoctorForBooking(featuredDoctors[0]);
                    setActiveTab('appointments');
                  }}
                  className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book with Dr. Vance Now</span>
                </button>

                {/* Trust Metrics Pill */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-around text-center text-xs text-slate-500">
                  <div>
                    <span className="font-bold text-slate-900 block text-sm">4.9/5.0</span>
                    <span>Patient Rating</span>
                  </div>
                  <div className="h-6 w-px bg-slate-200" />
                  <div>
                    <span className="font-bold text-slate-900 block text-sm">100%</span>
                    <span>Board Certified</span>
                  </div>
                  <div className="h-6 w-px bg-slate-200" />
                  <div>
                    <span className="font-bold text-slate-900 block text-sm">&lt; 15 min</span>
                    <span>Avg Wait Time</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Notice Highlight Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-rose-50 via-rose-100/50 to-orange-50 border border-rose-200 rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-rose-600 text-white rounded-xl shrink-0">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-rose-950">
                Experiencing Acute or Life-Threatening Symptoms?
              </h3>
              <p className="text-xs sm:text-sm text-rose-800 max-w-2xl mt-0.5">
                Red flags include severe chest pain radiating to the jaw/arm, sudden face/arm numbness (Stroke FAST), or extreme shortness of breath. Do not wait for AI responses—call emergency services immediately.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
            <a
              href="tel:911"
              className="flex-1 sm:flex-initial px-5 py-2.5 bg-rose-700 hover:bg-rose-800 text-white font-bold text-sm rounded-xl transition-colors shadow-sm text-center"
            >
              Call 911 Now
            </a>
            <button
              onClick={onOpenEmergency}
              className="px-4 py-2.5 bg-white hover:bg-rose-50 text-rose-800 font-semibold text-sm rounded-xl border border-rose-300 transition-colors"
            >
              Emergency Protocols →
            </button>
          </div>
        </div>
      </section>

      {/* Comprehensive Healthcare Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Clinical Excellence</span>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Key Healthcare Services</h2>
          <p className="text-sm sm:text-base text-slate-600">
            From routine checkups to virtual telehealth and chronic disease oversight, we offer seamless medical pathways tailored to your family's needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clinicalServices.map((svc, idx) => {
            const Icon = svc.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-teal-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-medium text-slate-500">{svc.badge}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{svc.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{svc.desc}</p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setActiveTab('appointments')}
                    className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
                  >
                    <span>Schedule visit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Doctors Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Certified Specialists</span>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Meet Our Physicians</h2>
            <p className="text-sm text-slate-600 mt-1">
              Experienced, board-certified clinicians dedicated to personalized, compassionate care.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('doctors')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:text-teal-800"
          >
            <span>View All Doctors ({DOCTORS_DATA.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full bg-slate-100">
                  <img
                    src={doc.imageUrl}
                    alt={doc.name}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-bold text-slate-800 flex items-center gap-1 shadow-xs">
                    <span>★ {doc.rating}</span>
                    <span className="text-slate-400 font-normal">({doc.reviewCount})</span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <span className="text-xs font-semibold text-teal-700">{doc.specialty}</span>
                    <h3 className="text-lg font-bold text-slate-900">{doc.name}</h3>
                    <p className="text-xs text-slate-500">{doc.hospital}</p>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{doc.bio}</p>

                  <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <strong className="text-slate-700">Next:</strong> {doc.nextAvailable}
                    </span>
                    <span className="font-semibold text-slate-900">${doc.consultationFee}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => {
                    onSelectDoctorForBooking(doc);
                    setActiveTab('appointments');
                  }}
                  className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Appointment</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Evidence-Based Health Resources Highlight */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Health Education</span>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Evidence-Based Health Guides</h2>
              <p className="text-sm text-slate-600 mt-1">
                Peer-reviewed medical articles referencing CDC, WHO, and American Heart Association standards.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('resources')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:text-teal-800"
            >
              <span>Browse All Guides</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredResources.map((res) => (
              <div
                key={res.id}
                onClick={() => {
                  onSelectResource(res.id);
                  setActiveTab('resources');
                }}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-teal-300 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-teal-700">{res.category}</span>
                    <span>{res.readTime}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 hover:text-teal-700 transition-colors line-clamp-2">
                    {res.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {res.summary}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="truncate max-w-[200px]">By {res.medicallyReviewedBy}</span>
                  <span className="font-semibold text-teal-700">Read Article →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety & Clinical Transparency Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-teal-400 text-xs font-semibold border border-slate-700">
              <ShieldCheck className="w-4 h-4" />
              <span>Patient Safety Guarantee</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Clinically Guarded, Humanly Delivered
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              MediCare AI is built to educate and simplify access, not replace clinical judgment. All medical protocols are authored in accordance with peer-reviewed literature. No AI diagnosis is ever delivered without professional physician consultation.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={() => setActiveTab('assistant')}
                className="px-5 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm rounded-xl transition-colors"
              >
                Chat with Health Assistant
              </button>
              <button
                onClick={() => setActiveTab('doctors')}
                className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm rounded-xl transition-colors"
              >
                Find Qualified Doctor
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
