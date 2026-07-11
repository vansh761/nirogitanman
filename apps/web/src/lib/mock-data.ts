// TODO: replace with Prisma queries against packages/database once seeded.

export const STATS = [
  { label: "Verified Vaidyas", value: "120+" },
  { label: "Consultations booked", value: "8,400+" },
  { label: "Avg. doctor rating", value: "4.8/5" },
  { label: "Cities covered", value: "32" },
];

export const SERVICES = [
  {
    title: "Doctor Consultations",
    description: "Book video or in-clinic sessions with verified Ayurvedic physicians.",
  },
  {
    title: "Niro AI Assistant",
    description: "Instant, educational guidance on diet, yoga, and daily routines.",
  },
  {
    title: "Personalised Diet Plans",
    description: "Dosha-aware meal guidance built around what you already eat.",
  },
  {
    title: "Yoga & Pranayama",
    description: "Guided routines matched to your constitution and goals.",
  },
  {
    title: "Herbal Formulations",
    description: "Classical formulations recommended and monitored by real doctors.",
  },
  {
    title: "Wellness Tracking",
    description: "Track symptoms, routines and consultations in one dashboard.",
  },
];

export const WHY_AYURVEDA = [
  {
    title: "Root-cause, not symptom-chasing",
    description: "Ayurveda looks at digestion, sleep, and daily rhythm as the root of most complaints.",
  },
  {
    title: "Personalised to your constitution",
    description: "Vata, Pitta and Kapha guide food, exercise and lifestyle choices unique to you.",
  },
  {
    title: "5,000 years, still evolving",
    description: "Classical texts, read through a modern clinical lens by licensed doctors.",
  },
];

export const DOCTORS = [
  {
    id: "dr-anika-rao",
    name: "Dr. Anika Rao",
    specialization: "Panchakarma & Detox",
    experience: 12,
    rating: 4.9,
    fee: 499,
    nextSlot: "Today, 4:30 PM",
  },
  {
    id: "dr-vikram-shetty",
    name: "Dr. Vikram Shetty",
    specialization: "Digestive Health",
    experience: 9,
    rating: 4.8,
    fee: 399,
    nextSlot: "Today, 6:00 PM",
  },
  {
    id: "dr-meera-nair",
    name: "Dr. Meera Nair",
    specialization: "Women's Health",
    experience: 15,
    rating: 5.0,
    fee: 599,
    nextSlot: "Tomorrow, 10:00 AM",
  },
  {
    id: "dr-arjun-das",
    name: "Dr. Arjun Das",
    specialization: "Joint & Muscle Care",
    experience: 7,
    rating: 4.7,
    fee: 349,
    nextSlot: "Tomorrow, 11:30 AM",
  },
];

export const TESTIMONIALS = [
  {
    name: "Priya S.",
    role: "Paid member, Bengaluru",
    message: "Niro AI gave me a diet plan in minutes, and my actual consult with Dr. Rao felt like a natural follow-up rather than starting from zero.",
    rating: 5,
  },
  {
    name: "Rohit K.",
    role: "Free user, Pune",
    message: "Booking a slot took under two minutes. The dashboard reminders meant I didn't miss my follow-up.",
    rating: 5,
  },
  {
    name: "Fatima A.",
    role: "Paid member, Hyderabad",
    message: "The yoga routines are matched to my dosha, not generic. Small thing, but it's the difference that keeps me consistent.",
    rating: 4,
  },
];

export const FAQS = [
  {
    question: "Is Niro AI a replacement for a doctor?",
    answer: "No. Niro AI gives educational, general Ayurveda-based guidance. For diagnosis, prescriptions, or anything urgent, book a verified doctor on the platform.",
  },
  {
    question: "How are doctors verified?",
    answer: "Every doctor profile is checked against BAMS/registration credentials before they can accept consultations.",
  },
  {
    question: "Can I use this without paying?",
    answer: "Yes — free accounts get limited Niro AI access and can browse doctors. Paid accounts unlock unlimited AI chats and priority booking slots.",
  },
  {
    question: "What happens after I submit a consultation request?",
    answer: "The chosen doctor confirms your slot; you'll get a notification and it appears in your dashboard under Appointments.",
  },
];

export const BLOG_PREVIEW = [
  {
    title: "Understanding Your Dosha: A Practical Starting Point",
    excerpt: "Vata, Pitta and Kapha explained without the jargon.",
    category: "Fundamentals",
    slug: "understanding-your-dosha",
  },
  {
    title: "Five Dinacharya Habits That Actually Stick",
    excerpt: "Morning routines from classical texts, adapted for a 9-to-6 life.",
    category: "Lifestyle",
    slug: "five-dinacharya-habits",
  },
  {
    title: "Ayurveda and Modern Medicine: Where They Agree",
    excerpt: "A doctor's honest take on where classical and clinical approaches overlap.",
    category: "Perspective",
    slug: "ayurveda-modern-medicine",
  },
];
