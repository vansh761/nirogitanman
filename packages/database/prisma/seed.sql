-- Demo seed data. Password for all seeded login users is: password123

INSERT INTO "users" (id, name, email, "passwordHash", role) VALUES
('admin-1', 'Admin', 'admin@nirotanman.com', '$2b$10$785z/FIYFZXe8NkNHmZxN.j1h7AHO3Rlbn5Z.OankP8VWmIXkklzC', 'ADMIN'),
('editor-1', 'Editor', 'editor@nirogitanman.com', '$2b$10$785z/FIYFZXe8NkNHmZxN.j1h7AHO3Rlbn5Z.OankP8VWmIXkklzC', 'EDITOR'),
('user-doc-1', 'Dr. Anika Rao', 'doctor@nirotanman.com', '$2b$10$785z/FIYFZXe8NkNHmZxN.j1h7AHO3Rlbn5Z.OankP8VWmIXkklzC', 'DOCTOR'),
('user-doc-2', 'Dr. Vikram Shetty', 'vikram@nirotanman.com', '$2b$10$785z/FIYFZXe8NkNHmZxN.j1h7AHO3Rlbn5Z.OankP8VWmIXkklzC', 'DOCTOR'),
('user-doc-3', 'Dr. Meera Nair', 'meera@nirotanman.com', '$2b$10$785z/FIYFZXe8NkNHmZxN.j1h7AHO3Rlbn5Z.OankP8VWmIXkklzC', 'DOCTOR'),
('user-doc-4', 'Dr. Arjun Das', 'arjun@nirotanman.com', '$2b$10$785z/FIYFZXe8NkNHmZxN.j1h7AHO3Rlbn5Z.OankP8VWmIXkklzC', 'DOCTOR'),
('paid-1', 'Priya S.', 'paid@nirotanman.com', '$2b$10$785z/FIYFZXe8NkNHmZxN.j1h7AHO3Rlbn5Z.OankP8VWmIXkklzC', 'PAID_USER'),
('user-pat-1', 'Rohit Kumar', 'rohit@example.com', '$2b$10$785z/FIYFZXe8NkNHmZxN.j1h7AHO3Rlbn5Z.OankP8VWmIXkklzC', 'FREE_USER'),
('user-pat-2', 'Fatima Ali', 'fatima@example.com', '$2b$10$785z/FIYFZXe8NkNHmZxN.j1h7AHO3Rlbn5Z.OankP8VWmIXkklzC', 'PAID_USER'),
('user-pat-3', 'Sana Iyer', 'sana@example.com', '$2b$10$785z/FIYFZXe8NkNHmZxN.j1h7AHO3Rlbn5Z.OankP8VWmIXkklzC', 'FREE_USER'),
('user-pat-4', 'Devansh Rao', 'devansh@example.com', '$2b$10$785z/FIYFZXe8NkNHmZxN.j1h7AHO3Rlbn5Z.OankP8VWmIXkklzC', 'PAID_USER');

INSERT INTO "doctors" (id, "userId", specialization, qualifications, "experienceYrs", bio, "consultFee", rating, "isVerified") VALUES
('doc-1', 'user-doc-1', 'Panchakarma & Detox', 'BAMS, MD (Ayurveda)', 12, 'Specialist in classical detox therapies.', 499, 4.9, true),
('doc-2', 'user-doc-2', 'Digestive Health', 'BAMS', 9, 'Focused on Agni (digestive fire) restoration.', 399, 4.8, true),
('doc-3', 'user-doc-3', 'Women''s Health', 'BAMS, MD (Prasuti Tantra)', 15, 'Womens wellness across life stages.', 599, 5.0, true),
('doc-4', 'user-doc-4', 'Joint & Muscle Care', 'BAMS', 7, 'Joint pain and mobility specialist.', 349, 4.7, true);

INSERT INTO "patients" (id, "userId", gender, phone, "medicalTags") VALUES
('pat-1', 'user-pat-1', 'male', '+91-9000000001', '{}'),
('pat-2', 'user-pat-2', 'female', '+91-9000000002', '{"acidity"}'),
('pat-3', 'user-pat-3', 'female', '+91-9000000003', '{}'),
('pat-4', 'user-pat-4', 'male', '+91-9000000004', '{"joint pain"}');

INSERT INTO "appointments" (id, "patientId", "doctorId", date, slot, symptoms, status) VALUES
('apt-1', 'pat-1', 'doc-1', now() + interval '1 day', '10:30 AM', 'Trouble sleeping for two weeks.', 'PENDING'),
('apt-2', 'pat-2', 'doc-3', now() + interval '1 day', '4:30 PM', 'Mild acidity after meals.', 'CONFIRMED'),
('apt-3', 'pat-3', 'doc-2', now() + interval '2 days', '9:00 AM', 'General wellness check-in.', 'CONFIRMED'),
('apt-4', 'pat-4', 'doc-4', now() + interval '2 days', '1:00 PM', 'Knee stiffness in the morning.', 'COMPLETED'),
('apt-5', 'pat-2', 'doc-1', now() + interval '3 days', '6:00 PM', 'Follow-up on detox plan.', 'CANCELLED');

INSERT INTO "categories" (id, name, slug) VALUES
('cat-1', 'Fundamentals', 'fundamentals'),
('cat-2', 'Lifestyle', 'lifestyle'),
('cat-3', 'Perspective', 'perspective');

INSERT INTO "blogs" (id, title, slug, excerpt, "contentMd", "categoryId", tags, status, "authorId", "publishedAt") VALUES
('blog-1', 'Understanding Your Dosha: A Practical Starting Point', 'understanding-your-dosha', 'Vata, Pitta, Kapha explained without the jargon.', '# Understanding Your Dosha

Ayurveda groups the body''s functional patterns into three doshas: Vata, Pitta, and Kapha. Everyone has all three, usually with one or two more dominant than the rest.

## Vata — Movement

Vata governs movement: breathing, circulation, nerve impulses, and elimination. When balanced, Vata shows up as creativity and quick thinking. Out of balance, it shows up as anxiety, dry skin, and irregular digestion.

## Pitta — Transformation

Pitta governs metabolism and transformation — digestion, body temperature, and how you process information. Balanced Pitta is sharp and focused. Out of balance, it shows up as irritability, acidity, and inflammation.

## Kapha — Structure

Kapha governs structure and lubrication — bones, muscles, joints, and immunity. Balanced Kapha is calm and steady. Out of balance, it shows up as sluggishness, weight gain, and congestion.

## A practical starting point

You do not need a lab test to start. Notice your default patterns: Do you run cold or warm? Do you gain weight easily or struggle to keep it on? Is your digestion fast, sharp, or slow? Those answers point toward your dominant dosha — and a doctor on this platform can confirm it and build a plan around it.', 'cat-1', '{"dosha","basics"}', 'PUBLISHED', 'editor-1', now() - interval '5 days'),
('blog-2', 'Five Dinacharya Habits That Actually Stick', 'five-dinacharya-habits', 'Morning routines adapted for a 9-to-6 life.', '# Five Dinacharya Habits That Actually Stick

Dinacharya means "daily routine" in Sanskrit. Classical texts describe an elaborate morning ritual — most of it is impractical for a modern work schedule. These five habits capture most of the benefit in under twenty minutes.

## 1. Wake before sunrise, consistently

Not for mysticism — for a stable circadian rhythm. Waking within the same 30-minute window every day, weekdays and weekends, does more for energy levels than any supplement.

## 2. Scrape your tongue before you drink anything

A short tongue-scraping ritual clears overnight bacterial buildup and, anecdotally, reduces the urge to reach for coffee immediately on waking.

## 3. Warm water before food

A glass of warm (not hot) water on an empty stomach gently kick-starts digestion before the first meal.

## 4. Move before you sit at a screen

Five to ten minutes of stretching or a short walk outdoors, before opening a laptop, measurably changes how the rest of the day feels — this is the one habit most patients report sticking with longest.

## 5. Eat your largest meal at midday

Digestive capacity (Agni) is considered strongest around midday. A lighter dinner, eaten earlier in the evening, is one of the simplest changes with an outsized effect on sleep quality.', 'cat-2', '{"routine"}', 'PUBLISHED', 'editor-1', now() - interval '2 days'),
('blog-3', 'Ayurveda and Modern Medicine: Where They Agree', 'ayurveda-modern-medicine', 'A doctor''s honest take on the overlap.', '# Ayurveda and Modern Medicine: Where They Agree

It is easy to frame Ayurveda and modern clinical medicine as opposites. In practice, a good Ayurvedic doctor and a good physician agree on more than you would expect.

## Diet and inflammation

Modern nutrition research increasingly points to the same conclusions Ayurveda reached centuries ago: minimize ultra-processed food, eat on a consistent schedule, and pay attention to how specific foods affect your individual digestion.

## Sleep as a foundation, not an afterthought

Both traditions treat sleep as foundational to nearly every other health outcome, not a separate wellness category. Dinacharya''s emphasis on a consistent sleep-wake cycle mirrors what sleep medicine recommends today.

## Where they genuinely differ

Ayurveda does not replace diagnostics, surgery, or acute emergency care. If you are experiencing chest pain, sudden severe symptoms, or anything urgent, that is a call for a physician and possibly emergency services — not a wellness routine. This platform''s doctors will tell you exactly that when it applies, rather than overpromising what Ayurveda can do.

## The honest middle ground

Use Ayurveda for what it is good at: daily routine, diet, stress patterns, and chronic lifestyle-driven complaints. Use modern medicine for diagnostics, acute care, and anything urgent. The best outcomes usually come from combining both, not picking a side.', 'cat-3', '{"perspective"}', 'DRAFT', 'editor-1', NULL);

INSERT INTO "testimonials" (id, "userId", name, role, message, rating, "isPublished") VALUES
('test-1', 'paid-1', 'Priya S.', 'Paid member, Bengaluru', 'Niro AI gave me a diet plan in minutes, and my consult felt like a natural follow-up.', 5, true),
('test-2', 'user-pat-1', 'Rohit K.', 'Free user, Pune', 'Booking a slot took under two minutes.', 5, true),
('test-3', 'user-pat-2', 'Fatima A.', 'Paid member, Hyderabad', 'The yoga routines are matched to my dosha, not generic.', 4, true);

INSERT INTO "faqs" (id, question, answer, "order") VALUES
('faq-1', 'Is Niro AI a replacement for a doctor?', 'No. It gives educational guidance only; book a doctor for anything urgent.', 1),
('faq-2', 'How are doctors verified?', 'Every profile is checked against BAMS/registration credentials.', 2),
('faq-3', 'Can I use this without paying?', 'Yes, free accounts get limited AI access and can browse doctors.', 3);
