import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini client (Server-side only)
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim() !== '') {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI with provided key, using fallback engine:', err);
  }
}

// Emergency keywords detector for immediate triage
const EMERGENCY_KEYWORDS = [
  'chest pain',
  'heart attack',
  'stroke',
  'cannot breathe',
  'cant breathe',
  'shortness of breath',
  'severe bleeding',
  'coughing blood',
  'unconscious',
  'anaphylaxis',
  'suicide',
  'kill myself',
  'overdose',
  'severe burn',
  'facial drooping',
  'paralyzed',
  'seizure',
];

function checkEmergency(text: string): boolean {
  const lower = text.toLowerCase();
  return EMERGENCY_KEYWORDS.some((kw) => lower.includes(kw));
}

// Medical Clinical Fallback Knowledge Base for 100% offline/quota resilience
function generateMedicalFallbackResponse(userPrompt: string): {
  reply: string;
  isEmergency: boolean;
  followUpQuestions: string[];
  suggestedAction: string;
} {
  const isEmergency = checkEmergency(userPrompt);
  const lower = userPrompt.toLowerCase();

  if (isEmergency) {
    return {
      isEmergency: true,
      suggestedAction: 'Seek Immediate Emergency Medical Care (Call 911 / 112)',
      followUpQuestions: [
        'Are you or the patient currently with someone who can assist immediately?',
        'Do symptoms include radiating chest pressure, breathing cessation, or sudden speech/facial numbness?',
      ],
      reply: `⚠️ **URGENT MEDICAL ALERT**: Based on the symptoms described in your message, this may indicate a critical or life-threatening situation.

**Immediate Recommended Actions:**
1. **Call 911 (or your local emergency services number 112) immediately.**
2. Do **not** attempt to drive yourself to the emergency department if experiencing severe chest pain, breathing difficulty, or altered consciousness.
3. If with someone, notify them immediately of your exact symptoms.
4. Keep calm, sit or lie in a comfortable upright position, and unlock your front door for emergency medical responders.

*MediCare AI is strictly an educational tool and cannot replace emergency medical services or clinical assessment.*`,
    };
  }

  // Common topic heuristics for robust educational responses
  let overview = '';
  let selfCare = '';
  let doctorWhen = '';
  const followUps: string[] = [];

  if (lower.includes('blood pressure') || lower.includes('hypertension')) {
    overview = `Blood pressure measures the force of circulating blood against arterial walls. Standard adult guidelines categorize normal blood pressure as less than 120/80 mmHg. Elevated blood pressure is typically defined as systolic between 120–129 with a diastolic under 80, while Hypertension Stage 1 begins at 130/80 mmHg (according to American Heart Association standards).`;
    selfCare = `Key lifestyle measures for cardiovascular health include adopting the DASH dietary pattern (low sodium, rich in potassium, whole grains, and leafy greens), engaging in 150 minutes of moderate aerobic exercise weekly, limiting alcohol intake, and managing psychological stress.`;
    doctorWhen = `Consult a physician if routine resting home readings consistently exceed 130/80 mmHg, or immediately if readings spike above 180/120 mmHg accompanied by headache, blurry vision, or chest tightness (hypertensive urgency/crisis).`;
    followUps.push(
      'What specific readings have you recorded over the past week during resting state?',
      'Are you currently prescribed any antihypertensive medications?',
      'Do you experience accompanying dizziness, headaches, or palpitations?'
    );
  } else if (lower.includes('fever') || lower.includes('temperature') || lower.includes('chills')) {
    overview = `A fever is generally defined as an oral body temperature of 100.4°F (38.0°C) or higher. It is a natural biological response by the immune system to fight infections, rather than an illness itself.`;
    selfCare = `Stay well-hydrated with water, electrolyte broths, and herbal teas. Rest in a well-ventilated, comfortable room with light clothing. Lukewarm sponge baths can provide comfort. Over-the-counter antipyretics like acetaminophen or ibuprofen should only be taken according to package directions and after confirming no personal contraindications.`;
    doctorWhen = `Adults should seek medical evaluation if a fever exceeds 103°F (39.4°C), lasts more than 72 hours without reduction, or is accompanied by stiff neck, shortness of breath, confusion, or severe abdominal pain. Infants under 3 months with any temperature above 100.4°F require prompt same-day pediatric evaluation.`;
    followUps.push(
      'What is your current measured temperature and how many days has it been elevated?',
      'Are there other symptoms like cough, sore throat, rash, or burning during urination?',
      'Is the fever occurring in an infant, child, or adult with existing medical conditions?'
    );
  } else if (lower.includes('cough') || lower.includes('cold') || lower.includes('flu') || lower.includes('throat')) {
    overview = `Acute respiratory symptoms such as coughs and sore throats are most frequently caused by self-limiting viral upper respiratory infections (such as rhinovirus or influenza). Most acute viral coughs resolve naturally within 2 to 3 weeks.`;
    selfCare = `Supportive recovery includes adequate rest, regular hydration (warm water with honey for adults and children over 1 year), steam inhalation or room humidifiers, and saline nasal rinses. Avoid tobacco smoke and environmental irritants.`;
    doctorWhen = `Contact a physician if the cough lasts longer than 3 weeks, produces rust-colored or bloody sputum, causes wheezing or shortness of breath, or if you develop high fever and persistent chest pain.`;
    followUps.push(
      'Is the cough dry and tickling, or productive with phlegm/mucus?',
      'Have you noticed any difficulty catching your breath or chest soreness?',
      'Do you have a history of asthma, COPD, or seasonal allergies?'
    );
  } else if (lower.includes('headache') || lower.includes('migraine')) {
    overview = `Headaches are common and vary from primary headache disorders (such as tension-type headaches and migraines) to secondary headaches resulting from sinus pressure, dehydration, or neck strain.`;
    selfCare = `Rest in a quiet, darkened room. Apply a cool compress to the forehead or warm compress to the back of the neck. Ensure adequate hydration, maintain consistent sleep schedules, and take regular screen breaks.`;
    doctorWhen = `Seek immediate emergency care for a sudden, severe "thunderclap" headache, or a headache accompanied by fever, stiff neck, confusion, numbness, or weakness. Consult a doctor for headaches that are steadily increasing in frequency or disrupting daily life.`;
    followUps.push(
      'How would you describe the sensation (throbbing, dull pressure, band-like tightness)?',
      'Are you experiencing sensitivity to light, sound, or nausea?',
      'Did the headache begin gradually or strike with sudden extreme intensity?'
    );
  } else if (lower.includes('allergy') || lower.includes('allergies') || lower.includes('pollen') || lower.includes('sneezing')) {
    overview = `Allergic rhinitis occurs when the immune system overreacts to airborne allergens such as tree/grass pollens, dust mites, mold, or pet dander, releasing histamines that trigger inflammation in the nasal passages and eyes.`;
    selfCare = `Keep windows closed during high pollen counts, use HEPA air purifiers, wash clothes after coming inside from outdoors, and use sterile saline nasal sprays to rinse trapped allergens. Non-sedating antihistamines and nasal corticosteroid sprays are common first-line options.`;
    doctorWhen = `Consult an allergist or ENT physician if symptoms persist despite environmental controls, cause chronic sinus infections, or trigger wheezing and breathing restriction (allergic asthma).`;
    followUps.push(
      'Do your symptoms worsen during specific seasons, outdoors, or around pets?',
      'Do you experience itchy/watery eyes, nasal congestion, or skin rashes?',
      'Have you tried any antihistamines or saline rinses previously?'
    );
  } else {
    overview = `Thank you for reaching out to MediCare AI. Understanding your health signs and knowing how to communicate them effectively is an essential step toward personal wellness.`;
    selfCare = `For general wellness support, prioritize balanced whole-food nutrition, consistent hydration, 7–9 hours of restorative sleep, regular gentle physical activity, and stress management practices.`;
    doctorWhen = `Whenever symptoms persist for more than a few days, interfere with daily function, or cause distress, scheduling an in-person or telehealth consultation with a certified healthcare provider is always the safest course of action.`;
    followUps.push(
      'How long have you noticed these specific symptoms or health questions?',
      'Has anything specific made the symptoms better or worse?',
      'Do you have any relevant chronic medical conditions or take daily medications?'
    );
  }

  const reply = `### 🩺 Educational Health Overview
${overview}

### 💡 General Self-Care & Supportive Measures
${selfCare}

### ❓ Follow-Up Reflection Questions
To prepare for a discussion with your doctor, consider:
${followUps.map((q) => `- ${q}`).join('\n')}

### 👨‍⚕️ When to Consult a Qualified Doctor
${doctorWhen}

---
*Disclaimer: This response is generated for educational and informational purposes only. It does not constitute medical diagnosis, treatment, or formal prescription. Always seek the advice of your physician or other qualified healthcare provider with any questions you may have regarding a medical condition.*`;

  return {
    isEmergency: false,
    suggestedAction: 'Educational Guidance / Routine Physician Consultation',
    followUpQuestions: followUps,
    reply,
  };
}

// In-memory appointments database seeded with realistic records
interface Appointment {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  mode: 'Video Telehealth' | 'In-Person Clinic';
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  reason: string;
  notes?: string;
  createdAt: string;
}

const appointmentsStore: Appointment[] = [
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
    reason: 'Routine annual cardiovascular risk review and blood pressure checkup.',
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
  },
];

const N8N_CHAT_WEBHOOK_URL = 'https://vyla30.app.n8n.cloud/webhook/25564597-e050-4d8e-8117-62f1a3d07b71/chat';

// POST /api/chat
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, history, sessionId } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message text is required' });
    }

    const isEmergency = checkEmergency(message);

    // 1. Primary Engine: Try calling the user's n8n chatbot webhook
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const n8nRes = await fetch(N8N_CHAT_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatInput: message,
          sessionId: sessionId || 'medicare-user-session',
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (n8nRes.ok) {
        const data = (await n8nRes.json()) as any;
        const reply =
          data?.output ||
          data?.text ||
          data?.message ||
          (typeof data === 'string' ? data : '');

        if (reply && typeof reply === 'string' && reply.trim() !== '') {
          return res.json({
            reply,
            isEmergency,
            engine: 'n8n-medicare-cloud',
          });
        }
      }
    } catch (n8nError: any) {
      console.warn('n8n webhook call failed, falling back to secondary engine:', n8nError?.message || n8nError);
    }

    // 2. Secondary Engine: If Gemini client is active and configured
    if (ai) {
      try {
        const systemInstruction = `You are MediCare AI, a compassionate, accurate, and safety-focused clinical health educator.
Your purpose is to provide clear, accessible, evidence-based health education to help patients understand symptoms, wellness principles, and prepare for productive discussions with their doctors.

STRICT CLINICAL SAFETY RULES:
1. NEVER provide a definitive diagnosis (e.g., do NOT say "You have X". Say "Common possibilities that a doctor evaluates include X, Y...").
2. NEVER prescribe medications or suggest specific drug dosages.
3. If the user mentions any emergency or red-flag symptoms (chest pain, stroke signs like facial drooping or arm weakness, severe shortness of breath, severe blood loss, anaphylaxis, suicidal thoughts), you MUST immediately advise calling 911 / 112 emergency services without delay.
4. Structure your response into clean sections with Markdown:
   - 🩺 **Educational Overview**: Explain the health concepts in simple, reassuring language.
   - 💡 **General Self-Care & Supportive Tips**: Non-pharmacological measures, hydration, rest, lifestyle adjustments.
   - ❓ **Questions to Consider**: 2-3 thoughtful follow-up questions to help the patient reflect on their symptoms before seeing a provider.
   - 👨‍⚕️ **When to See a Healthcare Professional**: Clear signs indicating that in-person evaluation is needed.
5. Conclude with a clear statement that this information is educational and does not replace medical advice.`;

        // Format history for context if available
        let contentsText = message;
        if (history && Array.isArray(history) && history.length > 0) {
          const recentHistory = history
            .slice(-4)
            .map((h: { sender: string; text: string }) => `${h.sender === 'user' ? 'User' : 'Assistant'}: ${h.text}`)
            .join('\n');
          contentsText = `Recent conversation:\n${recentHistory}\n\nCurrent user question:\n${message}`;
        }

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: contentsText,
          config: {
            systemInstruction,
            temperature: 0.3, // Lower temperature for medical accuracy and consistency
          },
        });

        const reply = response.text || '';
        return res.json({
          reply,
          isEmergency,
          engine: 'gemini-2.5-flash',
        });
      } catch (geminiError: any) {
        console.warn('Gemini API call failed, falling back to medical knowledge engine:', geminiError?.message || geminiError);
        // Fall through to fallback
      }
    }

    // Fallback medical response engine
    const fallback = generateMedicalFallbackResponse(message);
    return res.json({
      reply: fallback.reply,
      isEmergency: fallback.isEmergency,
      followUpQuestions: fallback.followUpQuestions,
      suggestedAction: fallback.suggestedAction,
      engine: 'medicare-clinical-fallback',
    });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({
      error: 'An internal error occurred while processing health information.',
      reply: 'An error occurred while analyzing your query. For any immediate health concerns, please consult a medical professional or contact local health services.',
      isEmergency: false,
    });
  }
});

// GET /api/appointments
app.get('/api/appointments', (_req: Request, res: Response) => {
  res.json({ appointments: appointmentsStore });
});

// POST /api/appointments
app.post('/api/appointments', (req: Request, res: Response) => {
  try {
    const { patientName, patientEmail, patientPhone, doctorId, doctorName, specialty, date, time, mode, reason, notes } = req.body;

    if (!patientName || !doctorName || !date || !time) {
      return res.status(400).json({ error: 'Missing required appointment fields' });
    }

    const newAppointment: Appointment = {
      id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName,
      patientEmail: patientEmail || 'patient@example.com',
      patientPhone: patientPhone || '',
      doctorId: doctorId || 'doc-1',
      doctorName,
      specialty: specialty || 'General Healthcare',
      date,
      time,
      mode: mode === 'Video Telehealth' ? 'Video Telehealth' : 'In-Person Clinic',
      status: 'Confirmed',
      reason: reason || 'General medical consultation',
      notes: notes || '',
      createdAt: new Date().toISOString(),
    };

    appointmentsStore.unshift(newAppointment);
    res.status(201).json({ success: true, appointment: newAppointment });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create appointment' });
  }
});

// DELETE /api/appointments/:id
app.delete('/api/appointments/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = appointmentsStore.findIndex((a) => a.id === id);
  if (index !== -1) {
    appointmentsStore[index].status = 'Cancelled';
    res.json({ success: true, message: 'Appointment cancelled', appointment: appointmentsStore[index] });
  } else {
    res.status(404).json({ error: 'Appointment not found' });
  }
});

// Start Express server and mount Vite middleware in development
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`MediCare AI Server running on http://localhost:${PORT}`);
  });
}

startServer();
