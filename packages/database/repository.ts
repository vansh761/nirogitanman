import { query } from "./pg";
import bcrypt from "bcryptjs";

// ---------------------------------------------------------------------
// Public site queries
// ---------------------------------------------------------------------

export async function getDoctors() {
  return query<{
    id: string;
    name: string;
    specialization: string;
    experienceYrs: number;
    rating: number;
    consultFee: string;
  }>(`
    SELECT d.id, u.name, d.specialization, d."experienceYrs", d.rating, d."consultFee"
    FROM doctors d
    JOIN users u ON d."userId" = u.id
    WHERE d."isVerified" = true
    ORDER BY d.rating DESC
  `);
}

export async function getPublishedTestimonials() {
  return query<{ id: string; name: string; role: string | null; message: string; rating: number }>(`
    SELECT id, name, role, message, rating FROM testimonials
    WHERE "isPublished" = true
    ORDER BY "createdAt" DESC
  `);
}

export async function getFaqs() {
  return query<{ id: string; question: string; answer: string }>(`
    SELECT id, question, answer FROM faqs ORDER BY "order" ASC
  `);
}

export async function getPublishedBlogs(limit = 3) {
  return query<{ id: string; title: string; slug: string; excerpt: string | null; category: string | null }>(
    `
    SELECT b.id, b.title, b.slug, b.excerpt, c.name AS category
    FROM blogs b
    LEFT JOIN categories c ON b."categoryId" = c.id
    WHERE b.status = 'PUBLISHED'
    ORDER BY b."publishedAt" DESC
    LIMIT $1
  `,
    [limit]
  );
}

export async function getBlogBySlug(slug: string) {
  const rows = await query<{
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    contentMd: string;
    category: string | null;
    author: string;
    publishedAt: string | null;
  }>(
    `
    SELECT b.id, b.title, b.slug, b.excerpt, b."contentMd", c.name AS category,
           u.name AS author, to_char(b."publishedAt", 'Mon DD, YYYY') AS "publishedAt"
    FROM blogs b
    LEFT JOIN categories c ON b."categoryId" = c.id
    JOIN users u ON b."authorId" = u.id
    WHERE b.slug = $1 AND b.status = 'PUBLISHED'
  `,
    [slug]
  );
  return rows[0] ?? null;
}

export async function createAppointment(input: {
  name: string;
  email: string;
  doctorId: string;
  date: string;
  slot: string;
  symptoms: string;
}) {
  const email = input.email.toLowerCase();

  let users = await query<{ id: string }>(`SELECT id FROM users WHERE email = $1`, [email]);
  let userId: string;
  if (users.length === 0) {
    userId = `guest-${Date.now()}`;
    await query(
  `INSERT INTO users
   (id, name, email, role, "createdAt", "updatedAt")
   VALUES ($1, $2, $3, 'FREE_USER', NOW(), NOW())`,
  [userId, input.name, email]
    );
  } else {
    userId = users[0].id;
  }

  let patients = await query<{ id: string }>(`SELECT id FROM patients WHERE "userId" = $1`, [userId]);
  let patientId: string;
  if (patients.length === 0) {
    patientId = `pat-${Date.now()}`;
    await query(`INSERT INTO patients (id, "userId") VALUES ($1, $2)`, [patientId, userId]);
  } else {
    patientId = patients[0].id;
  }

  const id = `apt-${Date.now()}`;
  await query(
    `INSERT INTO appointments (id, "patientId", "doctorId", date, slot, symptoms, status)
     VALUES ($1, $2, $3, $4, $5, $6, 'PENDING')`,
    [id, patientId, input.doctorId, input.date, input.slot, input.symptoms]
  );
  return { id };
}

export async function createContactMessage(input: { name: string; email: string; message: string }) {
  const id = `contact-${Date.now()}`;
  await query(
    `INSERT INTO contact_messages (id, name, email, message) VALUES ($1, $2, $3, $4)`,
    [id, input.name, input.email, input.message]
  );
  return { id };
}

export async function subscribeToNewsletter(email: string) {
  const id = `sub-${Date.now()}`;
  await query(
    `INSERT INTO newsletter_subscribers (id, email) VALUES ($1, $2)
     ON CONFLICT (email) DO NOTHING`,
    [id, email.toLowerCase()]
  );
  return { ok: true };
}

export async function logAiChatMessage(input: { sessionId: string; role: "user" | "assistant"; content: string }) {
  const id = `chat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  await query(
    `INSERT INTO ai_chats (id, "sessionId", role, content) VALUES ($1, $2, $3, $4)`,
    [id, input.sessionId, input.role, input.content]
  );
  return { id };
}

// ---------------------------------------------------------------------
// Dashboard queries
// ---------------------------------------------------------------------

export async function findUserByEmail(email: string) {
  const rows = await query<{
    id: string;
    name: string;
    email: string;
    passwordHash: string | null;
    role: string;
  }>(`SELECT id, name, email, "passwordHash", role FROM users WHERE email = $1`, [email.toLowerCase()]);
  return rows[0] ?? null;
}

export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

export async function getAppointmentsWithNames() {
  return query<{
    id: string;
    patient: string;
    doctor: string;
    date: string;
    slot: string;
    status: string;
  }>(`
    SELECT a.id, pu.name AS patient, du.name AS doctor,
           to_char(a.date, 'YYYY-MM-DD') AS date, a.slot, a.status
    FROM appointments a
    JOIN patients p ON a."patientId" = p.id
    JOIN users pu ON p."userId" = pu.id
    JOIN doctors d ON a."doctorId" = d.id
    JOIN users du ON d."userId" = du.id
    ORDER BY a.date ASC
  `);
}

export async function getDashboardKpis() {
  const [[patients], [appointmentsThisWeek], [aiChats]] = await Promise.all([
    query<{ count: string }>(`SELECT count(*) FROM patients`),
    query<{ count: string }>(
      `SELECT count(*) FROM appointments WHERE date >= now() - interval '7 days'`
    ),
    query<{ count: string }>(`SELECT count(*) FROM ai_chats`),
  ]);
  return {
    activePatients: Number(patients.count),
    appointmentsThisWeek: Number(appointmentsThisWeek.count),
    aiChats: Number(aiChats.count),
  };
}

export async function getDoctorsForAdmin() {
  return query<{
    id: string;
    name: string;
    specialization: string;
    experienceYrs: number;
    rating: number;
    isVerified: boolean;
  }>(`
    SELECT d.id, u.name, d.specialization, d."experienceYrs", d.rating, d."isVerified"
    FROM doctors d JOIN users u ON d."userId" = u.id
    ORDER BY d.rating DESC
  `);
}

export async function getPatientsForAdmin() {
  return query<{ id: string; name: string; email: string; gender: string | null; phone: string | null }>(`
    SELECT p.id, u.name, u.email, p.gender, p.phone
    FROM patients p JOIN users u ON p."userId" = u.id
    ORDER BY u.name ASC
  `);
}

export async function getUsersForAdmin() {
  return query<{ id: string; name: string; email: string; role: string; isActive: boolean }>(`
    SELECT id, name, email, role, "isActive" FROM users ORDER BY "createdAt" DESC
  `);
}

export async function getBlogsForAdmin() {
  return query<{ id: string; title: string; status: string; category: string | null; publishedAt: string | null }>(`
    SELECT b.id, b.title, b.status, c.name AS category, to_char(b."publishedAt", 'YYYY-MM-DD') AS "publishedAt"
    FROM blogs b LEFT JOIN categories c ON b."categoryId" = c.id
    ORDER BY b."createdAt" DESC
  `);
}

export async function getArticlesForAdmin() {
  return query<{ id: string; title: string; status: string; category: string | null }>(`
    SELECT a.id, a.title, a.status, c.name AS category
    FROM articles a LEFT JOIN categories c ON a."categoryId" = c.id
    ORDER BY a."createdAt" DESC
  `);
}

export async function getCategoriesForAdmin() {
  return query<{ id: string; name: string; slug: string; blogCount: string; articleCount: string }>(`
    SELECT c.id, c.name, c.slug,
      (SELECT count(*) FROM blogs b WHERE b."categoryId" = c.id) AS "blogCount",
      (SELECT count(*) FROM articles a WHERE a."categoryId" = c.id) AS "articleCount"
    FROM categories c
    ORDER BY c.name ASC
  `);
}

export async function getOrdersForAdmin() {
  return query<{ id: string; name: string; amount: string; currency: string; status: string; createdAt: string }>(`
    SELECT p.id, u.name, p.amount, p.currency, p.status, to_char(p."createdAt", 'YYYY-MM-DD') AS "createdAt"
    FROM payments p JOIN users u ON p."userId" = u.id
    ORDER BY p."createdAt" DESC
  `);
}

export async function getSubscriptionsForAdmin() {
  return query<{ id: string; name: string; plan: string; status: string; expiresAt: string | null }>(`
    SELECT s.id, u.name, s.plan, s.status, to_char(s."expiresAt", 'YYYY-MM-DD') AS "expiresAt"
    FROM subscriptions s JOIN users u ON s."userId" = u.id
    ORDER BY s."createdAt" DESC
  `);
}

export async function getAiChatsForAdmin(limit = 50) {
  return query<{ id: string; sessionId: string; role: string; content: string; createdAt: string }>(
    `
    SELECT id, "sessionId", role, content, to_char("createdAt", 'YYYY-MM-DD HH24:MI') AS "createdAt"
    FROM ai_chats
    ORDER BY "createdAt" DESC
    LIMIT $1
  `,
    [limit]
  );
}

export async function getContactMessagesForAdmin() {
  return query<{ id: string; name: string; email: string; message: string; isRead: boolean; createdAt: string }>(`
    SELECT id, name, email, message, "isRead", to_char("createdAt", 'YYYY-MM-DD HH24:MI') AS "createdAt"
    FROM contact_messages
    ORDER BY "createdAt" DESC
  `);
}

export async function getNotificationsForUser(userId: string) {
  return query<{ id: string; type: string; title: string; body: string; isRead: boolean; createdAt: string }>(
    `
    SELECT id, type, title, body, "isRead", to_char("createdAt", 'YYYY-MM-DD HH24:MI') AS "createdAt"
    FROM notifications
    WHERE "userId" = $1
    ORDER BY "createdAt" DESC
  `,
    [userId]
  );
}

export async function markNotificationRead(id: string) {
  await query(`UPDATE notifications SET "isRead" = true WHERE id = $1`, [id]);
  return { ok: true };
}

export async function markAllNotificationsRead(userId: string) {
  await query(`UPDATE notifications SET "isRead" = true WHERE "userId" = $1`, [userId]);
  return { ok: true };
}

export async function getSettings() {
  return query<{ key: string; value: unknown }>(`SELECT key, value FROM settings ORDER BY key ASC`);
}

export async function getPublishedTestimonialsForAdmin() {
  return query<{ id: string; name: string; role: string | null; message: string; rating: number; isPublished: boolean }>(`
    SELECT id, name, role, message, rating, "isPublished" FROM testimonials ORDER BY "createdAt" DESC
  `);
}

export async function getFaqsForAdmin() {
  return query<{ id: string; question: string; answer: string; order: number }>(`
    SELECT id, question, answer, "order" FROM faqs ORDER BY "order" ASC
  `);
}

export async function getAppointmentBillingInfo(appointmentId: string) {
  const rows = await query<{
    appointmentId: string;
    userId: string;
    email: string;
    consultFee: string;
    status: string;
  }>(
    `
    SELECT a.id AS "appointmentId", pu.id AS "userId", pu.email, d."consultFee", a.status
    FROM appointments a
    JOIN patients p ON a."patientId" = p.id
    JOIN users pu ON p."userId" = pu.id
    JOIN doctors d ON a."doctorId" = d.id
    WHERE a.id = $1
  `,
    [appointmentId]
  );
  return rows[0] ?? null;
}

export async function createPendingPayment(input: { userId: string; appointmentId: string; amount: number }) {
  const id = `pay-${Date.now()}`;
  await query(
    `INSERT INTO payments (id, "userId", "appointmentId", amount, currency, status, provider)
     VALUES ($1, $2, $3, $4, 'INR', 'PENDING', 'razorpay')
     ON CONFLICT ("appointmentId") DO UPDATE SET amount = EXCLUDED.amount
     RETURNING id`,
    [id, input.userId, input.appointmentId, input.amount]
  );
  return { id };
}

export async function markPaymentSuccess(input: { appointmentId: string; providerRefId: string }) {
  await query(
    `UPDATE payments SET status = 'SUCCESS', "providerRefId" = $2 WHERE "appointmentId" = $1`,
    [input.appointmentId, input.providerRefId]
  );
  await query(`UPDATE appointments SET status = 'CONFIRMED' WHERE id = $1`, [input.appointmentId]);
  return { ok: true };
}

export async function getPaymentForAppointment(appointmentId: string) {
  const rows = await query<{ id: string; status: string; amount: string }>(
    `SELECT id, status, amount FROM payments WHERE "appointmentId" = $1`,
    [appointmentId]
  );
  return rows[0] ?? null;
}
export async function getAnalyticsSummary() {
  const [[doctors], [patients], [appointments], [aiChats], [blogs], [payments]] = await Promise.all([
    query<{ count: string }>(`SELECT count(*) FROM doctors`),
    query<{ count: string }>(`SELECT count(*) FROM patients`),
    query<{ count: string }>(`SELECT count(*) FROM appointments`),
    query<{ count: string }>(`SELECT count(*) FROM ai_chats`),
    query<{ count: string }>(`SELECT count(*) FROM blogs WHERE status = 'PUBLISHED'`),
    query<{ sum: string | null }>(`SELECT sum(amount)::text FROM payments WHERE status = 'SUCCESS'`),
  ]);
  return {
    doctors: Number(doctors.count),
    patients: Number(patients.count),
    appointments: Number(appointments.count),
    aiChats: Number(aiChats.count),
    publishedBlogs: Number(blogs.count),
    revenue: Number(payments.sum ?? 0),
  };
}
