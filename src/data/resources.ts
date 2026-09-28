import { HealthResource } from '../types';

export const HEALTH_RESOURCES: HealthResource[] = [
  {
    id: 'res-1',
    title: 'Understanding Blood Pressure: Clinical Guidelines, Silent Signals, and Daily Habits',
    slug: 'understanding-blood-pressure-guidelines',
    category: 'Cardiology',
    summary: 'A comprehensive, evidence-based breakdown of blood pressure stages, accurate home monitoring techniques, and sustainable cardioprotective lifestyle interventions.',
    readTime: '6 min read',
    publishedDate: 'March 2026',
    medicallyReviewedBy: 'Dr. Marcus Vance, MD, FACC',
    sourceCitations: [
      'American Heart Association (AHA/ACC Hypertension Clinical Practice Guidelines)',
      'World Health Organization (WHO) Global Report on Hypertension',
      'National Heart, Lung, and Blood Institute (NHLBI) DASH Diet Trials',
    ],
    keyTakeaways: [
      'A normal resting reading is under 120/80 mmHg; Stage 1 hypertension begins at 130/80 mmHg.',
      'High blood pressure is termed "the silent killer" because symptoms rarely appear until vascular damage occurs.',
      'Proper measurement technique requires 5 minutes of quiet seated rest with back supported and cuff at heart level.',
      'Consistent reduction in sodium (<2,300 mg/day) and 150 minutes of aerobic exercise lower systolic pressure by 5–8 mmHg.',
    ],
    sections: [
      {
        heading: 'What Do the Numbers Mean?',
        content: `Blood pressure is recorded as two numbers: systolic pressure (the top number, reflecting arterial force when the ventricles contract) and diastolic pressure (the bottom number, representing arterial pressure when the heart rests between beats). Clinical guidelines define normal as systolic < 120 and diastolic < 80 mmHg. Persistent elevations stiffen arterial walls, accelerating plaque build-up and increasing stroke risks.`,
      },
      {
        heading: 'The Protocol for Accurate Home Measurement',
        content: `Many patients encounter "white-coat hypertension" in clinics. To monitor accurately at home: avoid caffeine, exercise, and smoking for 30 minutes prior. Sit quietly with your feet flat on the floor for 5 minutes. Use a clinically validated upper-arm cuff rather than a wrist monitor. Record readings twice daily (morning and evening) for 7 consecutive days before your medical appointment.`,
      },
      {
        heading: 'Evidence-Based Dietary & Lifestyle Adaptations',
        content: `The Dietary Approaches to Stop Hypertension (DASH) eating pattern consistently proves effective in clinical trials. It emphasizes potassium-rich leafy greens, berries, whole grains, nuts, and lean proteins while restricting saturated fats, refined sugars, and high-sodium processed foods. Combined with moderate physical activity, stress-reduction techniques, and adequate sleep, patients often achieve meaningful blood pressure control.`,
      },
    ],
    tags: ['Hypertension', 'Heart Health', 'Preventive Care', 'DASH Diet'],
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'res-2',
    title: 'Pediatric Fever Management: What Every Caregiver Needs to Know',
    slug: 'pediatric-fever-management-guide',
    category: 'Pediatrics',
    summary: 'Learn how to interpret fever in children, recognize urgent red flags, provide safe comfort care, and know precisely when to consult a pediatrician.',
    readTime: '5 min read',
    publishedDate: 'February 2026',
    medicallyReviewedBy: 'Dr. Priya Patel, MD, FAAP',
    sourceCitations: [
      'American Academy of Pediatrics (AAP) Clinical Report on Fever and Antipyretic Use in Children',
      'Centers for Disease Control and Prevention (CDC) Pediatric Guidelines',
      'The Cochrane Database of Systematic Reviews: Paracetamol and Ibuprofen for Fever in Children',
    ],
    keyTakeaways: [
      'A true fever in children is clinically defined as a rectal or oral temperature of 100.4°F (38.0°C) or higher.',
      'Fever is an immune defense mechanism, not an illness; behavior and hydration matter more than the exact number.',
      'Infants under 3 months with a temperature of 100.4°F or higher require same-day emergency evaluation.',
      'Never give aspirin to children or adolescents due to the risk of Reye syndrome.',
    ],
    sections: [
      {
        heading: 'Understanding the Role of Fever',
        content: `A fever is your child’s immune system responding to a viral or bacterial encounter. White blood cells release pyrogens that signal the hypothalamus to raise body temperature, which slows pathogen replication. In most cases, a fever does not cause harm or brain damage. The goal of management is not to achieve a normal temperature, but to keep the child comfortable and hydrated.`,
      },
      {
        heading: 'Critical Warning Signs: When to Seek Immediate Care',
        content: `Seek emergency care if a child: is under 3 months old with any fever; is unusually lethargic or difficult to awaken; shows difficulty breathing or persistent grunting; has a stiff neck or refuses to bend their chin to their chest; develops an unexplained purple or dark red rash; or has a fever lasting more than 3 to 4 days without signs of improvement.`,
      },
      {
        heading: 'Safe Home Care and Hydration',
        content: `Dress your child in light, breathable layers. Keep room temperatures comfortable (68°F–72°F). Offer frequent small sips of oral electrolyte solutions, breast milk, or water. If the child is irritable, consult your pediatrician for weight-based dosing of acetaminophen or ibuprofen. Never alternate medications without explicit medical instructions.`,
      },
    ],
    tags: ['Pediatrics', 'Fever', 'Child Care', 'Emergency Signs'],
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'res-3',
    title: 'The Science of Restorative Sleep: Circadian Rhythms and Cognitive Longevity',
    slug: 'science-of-restorative-sleep-hygiene',
    category: 'Mental Wellness',
    summary: 'Explore the biological architecture of deep sleep and REM cycles, how chronobiology affects emotional regulation, and non-pharmacological habits for restorative rest.',
    readTime: '7 min read',
    publishedDate: 'January 2026',
    medicallyReviewedBy: 'Dr. Elena Rostova, MD, PhD',
    sourceCitations: [
      'National Sleep Foundation Sleep Duration Recommendations',
      'NIH National Institute of Neurological Disorders and Stroke (Brain Basics: Understanding Sleep)',
      'The Lancet Neurology: Sleep and Glymphatic Clearance Mechanisms',
    ],
    keyTakeaways: [
      'Adults require 7 to 9 hours of uninterrupted sleep for adequate glymphatic neuro-toxin clearance.',
      'Morning sunlight exposure within 30 minutes of waking anchors the master circadian pacemaker in the brain.',
      'Screen blue light suppresses melatonin release by up to 50%, delaying sleep onset by an average of 90 minutes.',
      'Chronic sleep deficits are tied to heightened cardiovascular risk, immune suppression, and metabolic disruption.',
    ],
    sections: [
      {
        heading: 'The Glymphatic Brain Wash',
        content: `During non-REM slow-wave sleep, interstitial space between brain cells expands by up to 60%, allowing cerebrospinal fluid to flush out metabolic waste, including beta-amyloid and tau proteins. Disruptions in deep sleep directly impede this nightly waste clearance, contributing to daytime brain fog and long-term neurocognitive vulnerability.`,
      },
      {
        heading: 'Anchor Your Circadian Clock',
        content: `Your circadian rhythm depends heavily on environmental cues (zeitgebers). Exposure to 10–15 minutes of outdoor sunlight in the morning triggers a surge in cortisol and sets a biological timer for melatonin synthesis roughly 14 hours later. Maintain a consistent bedtime and wake-up time, even on weekends, to stabilize your internal clock.`,
      },
      {
        heading: 'Optimizing the Sleep Sanctuary',
        content: `Keep the bedroom cool (ideal ambient range is 65°F to 68°F / 18°C to 20°C), dark, and quiet. Remove screens and bright LEDs. Avoid heavy meals and caffeine within 6 hours of sleep. If you find yourself awake for longer than 20 minutes in bed, get up and read in low light until sleepiness returns to avoid conditioned insomnia.`,
      },
    ],
    tags: ['Sleep Medicine', 'Mental Health', 'Circadian Biology', 'Brain Health'],
    imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'res-4',
    title: 'Managing Type 2 Diabetes: Blood Glucose Target Ranges and Nutritional Foundations',
    slug: 'managing-type-2-diabetes-nutritional-foundations',
    category: 'Chronic Conditions',
    summary: 'A clear guide to HbA1c testing, continuous glucose tracking, balanced plate methods, and practical daily steps to maintain steady metabolic health.',
    readTime: '7 min read',
    publishedDate: 'March 2026',
    medicallyReviewedBy: 'Dr. Rachel Gomez, MD, FACE',
    sourceCitations: [
      'American Diabetes Association (ADA) Standards of Care in Diabetes 2026',
      'Endocrine Society Clinical Practice Guidelines',
      'New England Journal of Medicine (NEJM) Long-term Glycemic Control Outcomes',
    ],
    keyTakeaways: [
      'Target fasting glucose for most non-pregnant adults with diabetes is 80–130 mg/dL, and post-meal is <180 mg/dL.',
      'An HbA1c test measures the percentage of hemoglobin coated with sugar over the preceding 90 days (target typically <7.0%).',
      'The Diabetes Plate Method: half the plate non-starchy vegetables, one-quarter lean protein, one-quarter complex carbohydrates.',
      'Even a 15-minute brisk walk immediately following meals enhances insulin sensitivity and blunts glucose spikes.',
    ],
    sections: [
      {
        heading: 'Demystifying Glucose Metrics',
        content: `Managing diabetes requires familiarity with fasting blood glucose, postprandial (after-meal) readings, and HbA1c. While single fingerstick checks offer immediate snapshots, the HbA1c reflects average glycemia over the lifespan of red blood cells. Modern continuous glucose monitors (CGMs) provide Time-in-Range (TIR) metrics, targeting >70% of readings between 70–180 mg/dL.`,
      },
      {
        heading: 'Nutritional Architecture: The Plate Method',
        content: `Rigid, ultra-restrictive diets often fail over time. The American Diabetes Association recommends the visual plate framework: Fill 50% of your 9-inch plate with non-starchy vegetables (spinach, broccoli, zucchini, bell peppers); 25% with high-quality protein (wild salmon, skinless poultry, tofu, lentils); and 25% with high-fiber carbohydrates (quinoa, sweet potatoes, legumes). Fiber delays gastric emptying, smoothing post-meal glucose curves.`,
      },
      {
        heading: 'Preventing Hypoglycemia & Long-Term Complications',
        content: `Know the warning signs of hypoglycemia (low blood sugar <70 mg/dL): shakiness, sweating, palpitations, confusion. Treat using the 15-15 rule: consume 15 grams of fast-acting carbohydrate (e.g., 4 oz juice or 3-4 glucose tablets), recheck in 15 minutes. Regular annual eye exams, foot checks, and kidney filtration tests (eGFR, urine albumin) are foundational components of comprehensive care.`,
      },
    ],
    tags: ['Diabetes', 'Endocrinology', 'Nutrition', 'HbA1c'],
    imageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'res-5',
    title: 'Headache Classification: Tension, Migraine, or Red-Flag Secondary Symptoms?',
    slug: 'headache-classification-and-red-flags',
    category: 'Neurology',
    summary: 'Understand the clinical distinctions between tension headaches, cluster patterns, migraines, and the critical SNOOP criteria for emergency secondary headaches.',
    readTime: '6 min read',
    publishedDate: 'January 2026',
    medicallyReviewedBy: 'Dr. Elena Rostova, MD, PhD',
    sourceCitations: [
      'The International Classification of Headache Disorders, 3rd edition (ICHD-3)',
      'American Headache Society Guidelines on Acute and Preventive Treatment',
      'BMJ Clinical Review: Assessing Acute Severe Headache in Primary Care',
    ],
    keyTakeaways: [
      'Tension headaches present as a dull, bilateral band-like squeezing pressure without nausea or vomiting.',
      'Migraines are usually unilateral, throbbing, moderate-to-severe, worsened by movement, and accompanied by photophobia.',
      'The "SNOOP" mnemonic highlights red flags: Systemic symptoms, Neurological deficits, Onset sudden, Older age, Pattern change.',
      'A sudden, maximum-intensity "thunderclap" headache demands immediate emergency neurological evaluation.',
    ],
    sections: [
      {
        heading: 'Primary vs. Secondary Headaches',
        content: `Over 90% of headaches are primary—meaning the headache itself is the primary condition, not caused by an underlying structural disease. Tension headaches and migraines predominate. Secondary headaches, however, are symptoms of another medical issue ranging from medication overuse, cervical spine strain, to subarachnoid hemorrhage or intracranial pressure changes.`,
      },
      {
        heading: 'The SNOOP Red Flag Checklist',
        content: `Physicians evaluate secondary headaches using the SNOOP mnemonic: S (Systemic signs like fever, weight loss, or cancer history); N (Neurologic deficits like weakness, numbness, speech changes); O (Onset sudden, peaking within seconds to minutes); O (Older age, onset after 50 years); P (Pattern change, previous headache pattern suddenly altering). Any positive SNOOP indicator warrants urgent medical imaging and workup.`,
      },
      {
        heading: 'First-Line Strategies for Migraine Prevention',
        content: `For diagnosed migraine sufferers, tracking triggers in a headache diary (sleep deficits, skipped meals, hormonal fluctuations, aged cheeses, artificial sweeteners) proves vital. Non-pharmacological interventions with strong empirical backing include magnesium glycinate, coenzyme Q10, consistent hydration, and cognitive behavioral biofeedback techniques.`,
      },
    ],
    tags: ['Headache', 'Migraine', 'Neurology', 'Emergency Red Flags'],
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'res-6',
    title: 'The Anti-Inflammatory Kitchen: Science-Backed Nutritional Habits',
    slug: 'anti-inflammatory-diet-science-backed-habits',
    category: 'Nutrition',
    summary: 'Demystifying systemic inflammation, gut microbiome diversity, polyphenol-rich foods, and practical meal preparations supported by peer-reviewed clinical nutrition.',
    readTime: '6 min read',
    publishedDate: 'March 2026',
    medicallyReviewedBy: 'Dr. Sarah Al-Mansoor, MD',
    sourceCitations: [
      'Harvard T.H. Chan School of Public Health: Foods that fight inflammation',
      'Cell Host & Microbe: High-fiber diet and microbiota-accessible carbohydrate outcomes',
      'The American Journal of Clinical Nutrition: Mediterranean Diet and biomarkers of systemic inflammation',
    ],
    keyTakeaways: [
      'Chronic low-grade inflammation is an underlying driver of atherosclerosis, diabetes, and joint degeneration.',
      'Omega-3 fatty acids (EPA/DHA) down-regulate pro-inflammatory cytokines and eicosanoid cascades.',
      'Aim for 30+ different plant varieties weekly to foster a resilient, short-chain fatty acid-producing microbiome.',
      'Ultra-processed foods with high refined seed oils and added sugars promote intestinal permeability and inflammatory flares.',
    ],
    sections: [
      {
        heading: 'Acute vs. Chronic Inflammation',
        content: `Acute inflammation is an essential, life-saving healing response to infection or tissue injury. In contrast, chronic systemic inflammation smolders silently for years, continually stressing the vascular endothelium, joint synovium, and metabolic organs. Measuring high-sensitivity C-reactive protein (hs-CRP) provides clinicians with an objective marker of systemic inflammatory burden.`,
      },
      {
        heading: 'The Power of Polyphenols and Fatty Acids',
        content: `Cold-water fatty fish (salmon, sardines, mackerel) deliver potent EPA and DHA omega-3s that actively synthesize specialized pro-resolving mediators (SPMs). Pair these with extra virgin olive oil (rich in oleocanthal, an enzyme inhibitor mimicking ibuprofen's mechanism), cruciferous vegetables (sulforaphane), wild berries (anthocyanins), and turmeric (curcumin enhanced with black pepper piperine).`,
      },
      {
        heading: 'Actionable Steps for Your Grocery Cart',
        content: `Focus on the perimeter of the supermarket. Fill your cart with colorful seasonal produce, sprouted legumes, fermented foods (unsweetened Greek yogurt, kefir, kimchi), and raw walnuts. Replace refined seed oils with cold-pressed olive or avocado oil, and replace sugar-sweetened beverages with green tea rich in epigallocatechin gallate (EGCG).`,
      },
    ],
    tags: ['Nutrition', 'Anti-Inflammatory', 'Gut Health', 'Lifestyle Medicine'],
    imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'res-7',
    title: 'Core Stability and Spine Biomechanics: Preventing Chronic Lower Back Strain',
    slug: 'core-stability-spine-biomechanics-lower-back',
    category: 'Exercise & PT',
    summary: 'A physical medicine overview of lumbar spine anatomy, the McGill Big Three core stabilizers, ergonomic workstation design, and safe movement patterns.',
    readTime: '5 min read',
    publishedDate: 'February 2026',
    medicallyReviewedBy: 'Dr. David Chen, MD, FAAOS',
    sourceCitations: [
      'American College of Sports Medicine (ACSM) Exercise Guidelines for Musculoskeletal Health',
      'Spine Journal: Biomechanical Evaluation of Core Stability Exercises',
      'Mayo Clinic Proceedings: Diagnosis and Treatment of Low Back Pain',
    ],
    keyTakeaways: [
      'Lower back pain is the leading global cause of physical disability; over 80% of adults experience an episode.',
      'True core stability relies on 360-degree muscular bracing (transverse abdominis, quadratus lumborum, multifidus), not just "six-pack" flexors.',
      'The McGill Big Three exercises (Curl-Up, Bird Dog, Side Bridge) strengthen stabilizers with minimal spinal compression.',
      'Seek emergency assessment for back pain accompanied by urinary incontinence or progressive leg numbness (Cauda Equina).',
    ],
    sections: [
      {
        heading: 'Spine Mechanics: Why Sit-Ups Can Harm the Lumbar Discs',
        content: `Traditional repetitive trunk flexion (crunches and sit-ups) exerts massive compressive and shear loads onto the lumbar intervertebral discs, often accelerating posterior disc bulges. The core's primary functional role in bipedal locomotion is not spinal flexion, but rather anti-rotation, anti-extension, and force transmission between hips and shoulders.`,
      },
      {
        heading: 'The McGill Big 3 Stabilization Protocol',
        content: `Renowned spine biomechanist Dr. Stuart McGill developed three specific exercises designed to recruit deep stabilization muscles while sparing spinal discs: 1) The Modified Curl-Up (hand under lumbar spine, one leg bent); 2) The Side Bridge (elbow below shoulder, neutral torso alignment); 3) The Bird-Dog (opposite arm and leg extension with neutral pelvis). Hold positions for 8–10 seconds with steady diaphragmatic breathing.`,
      },
      {
        heading: 'Ergonomics and the Hip Hinge',
        content: `When lifting objects—even light ones from the floor—bend at the acetabulofemoral (hip) joints rather than rounding the lumbar spine. If working at a desk, position your monitor so the top third aligns with eye level, keep your elbows at 90 degrees, and set an alarm to stand and walk for 2 minutes every hour.`,
      },
    ],
    tags: ['Physical Therapy', 'Orthopedics', 'Spine Health', 'Ergonomics'],
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'res-8',
    title: 'Recognizing Anxiety and Somatic Manifestations: Clinical Pathways to Care',
    slug: 'recognizing-anxiety-somatic-manifestations',
    category: 'Mental Wellness',
    summary: 'Differentiating physiological panic from physical cardiac events, understanding autonomic nervous system deregulation, and evidence-based clinical therapies.',
    readTime: '6 min read',
    publishedDate: 'March 2026',
    medicallyReviewedBy: 'Dr. Amara Okafor, MD, FAPA',
    sourceCitations: [
      'American Psychiatric Association Diagnostic and Statistical Manual of Mental Disorders (DSM-5-TR)',
      'National Institute of Mental Health (NIMH): Anxiety Disorders Overview',
      'Journal of the American Medical Association (JAMA) Psychiatry: Mindfulness-Based Stress Reduction vs Escitalopram',
    ],
    keyTakeaways: [
      'Anxiety commonly produces real physical symptoms: palpitations, chest tightness, air hunger, GI distress, and dizziness.',
      'A panic attack typically peaks within 10 minutes and subsides within 30 minutes, triggered by hyperactive amygdala signaling.',
      'Physiological sighs (two quick nasal inhales followed by a prolonged mouth exhale) immediately activate the parasympathetic brake.',
      'Cognitive Behavioral Therapy (CBT) and SSRIs/SNRIs are first-line, evidence-based treatments for generalized anxiety.',
    ],
    sections: [
      {
        heading: 'The Mind-Body Sympathetic Cascade',
        content: `When the brain perceives psychological threat, the autonomic nervous system triggers a rapid release of adrenaline and cortisol. Blood is shunted away from the digestive tract toward large skeletal muscles, breathing accelerates (often resulting in hypocapnic respiratory alkalosis that causes tingling fingers and lightheadedness), and heart rate quickens. Understanding this biological cascade helps demystify frightening physical sensations.`,
      },
      {
        heading: 'Emergency Rules: Ruling Out Cardiac Causes First',
        content: `Because severe panic symptoms (chest discomfort, shortness of breath, sweating) can closely mimic acute coronary syndrome, any new or unexplained chest pain must first undergo clinical evaluation by an emergency physician. Once cardiac pathology is safely ruled out, patients can confidently focus on anxiety management therapies without recurring emergency visits.`,
      },
      {
        heading: 'Physiological Interventions and Clinical Care',
        content: `Neuroscience research highlights the 'physiological sigh'—a double inhale through the nose to re-inflate collapsed alveoli, followed by a slow, vocalized oral exhale—as the fastest conscious method to down-regulate sympathetic tone. Ongoing treatment involves CBT to reframe catastrophic thoughts, exposure therapy for panic triggers, and guidance from a licensed psychiatrist or therapist.`,
      },
    ],
    tags: ['Psychiatry', 'Mental Health', 'Anxiety', 'Panic Attacks'],
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800',
  },
];

export const RESOURCE_CATEGORIES = [
  'All',
  'Cardiology',
  'Pediatrics',
  'Mental Wellness',
  'Chronic Conditions',
  'Neurology',
  'Nutrition',
  'Exercise & PT',
];
