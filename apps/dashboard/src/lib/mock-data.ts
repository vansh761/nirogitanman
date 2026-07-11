// TODO: replace with Prisma aggregate queries once DB is seeded.

export const WEEKLY_CONSULTATIONS = [
  { day: "Mon", consultations: 18, aiChats: 64 },
  { day: "Tue", consultations: 24, aiChats: 71 },
  { day: "Wed", consultations: 21, aiChats: 58 },
  { day: "Thu", consultations: 30, aiChats: 82 },
  { day: "Fri", consultations: 27, aiChats: 90 },
  { day: "Sat", consultations: 34, aiChats: 76 },
  { day: "Sun", consultations: 19, aiChats: 52 },
];

export const KPI_CARDS = [
  { label: "Active patients", value: "2,340", delta: "+4.2%" },
  { label: "Consultations this week", value: "173", delta: "+11%" },
  { label: "Niro AI chats", value: "493", delta: "+8.6%" },
  { label: "MRR", value: "₹4.1L", delta: "+2.1%" },
];

export const APPOINTMENTS = [
  { id: "apt_1", patient: "Rohit Kumar", doctor: "Dr. Anika Rao", date: "2026-07-08", slot: "10:30 AM", status: "PENDING" },
  { id: "apt_2", patient: "Fatima Ali", doctor: "Dr. Meera Nair", date: "2026-07-08", slot: "4:30 PM", status: "CONFIRMED" },
  { id: "apt_3", patient: "Sana Iyer", doctor: "Dr. Vikram Shetty", date: "2026-07-09", slot: "9:00 AM", status: "CONFIRMED" },
  { id: "apt_4", patient: "Devansh Rao", doctor: "Dr. Arjun Das", date: "2026-07-09", slot: "1:00 PM", status: "COMPLETED" },
  { id: "apt_5", patient: "Priya S.", doctor: "Dr. Anika Rao", date: "2026-07-10", slot: "6:00 PM", status: "CANCELLED" },
];
