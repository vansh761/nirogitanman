--
-- PostgreSQL database dump
--

\restrict p0QX7Xq5UswrM2t8fS6vc8H7Ag6U8BO2JVEGFsxZ2dY7p0kNo8hANB8P1XJSy8P

-- Dumped from database version 16.14 (Ubuntu 16.14-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.14 (Ubuntu 16.14-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: AppointmentStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AppointmentStatus" AS ENUM (
    'PENDING',
    'CONFIRMED',
    'COMPLETED',
    'CANCELLED',
    'NO_SHOW'
);


ALTER TYPE public."AppointmentStatus" OWNER TO postgres;

--
-- Name: NotificationType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."NotificationType" AS ENUM (
    'APPOINTMENT',
    'SYSTEM',
    'BLOG',
    'PAYMENT',
    'MESSAGE'
);


ALTER TYPE public."NotificationType" OWNER TO postgres;

--
-- Name: PaymentStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PaymentStatus" AS ENUM (
    'PENDING',
    'SUCCESS',
    'FAILED',
    'REFUNDED'
);


ALTER TYPE public."PaymentStatus" OWNER TO postgres;

--
-- Name: PostStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PostStatus" AS ENUM (
    'DRAFT',
    'IN_REVIEW',
    'PUBLISHED',
    'ARCHIVED'
);


ALTER TYPE public."PostStatus" OWNER TO postgres;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'GUEST',
    'FREE_USER',
    'PAID_USER',
    'DOCTOR',
    'EDITOR',
    'ADMIN'
);


ALTER TYPE public."Role" OWNER TO postgres;

--
-- Name: SubscriptionStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."SubscriptionStatus" AS ENUM (
    'ACTIVE',
    'CANCELLED',
    'EXPIRED',
    'TRIAL'
);


ALTER TYPE public."SubscriptionStatus" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ai_chats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ai_chats (
    id text NOT NULL,
    "userId" text,
    "sessionId" text NOT NULL,
    role text NOT NULL,
    content text NOT NULL,
    model text DEFAULT 'llama-3.3-70b-versatile'::text NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.ai_chats OWNER TO postgres;

--
-- Name: appointments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.appointments (
    id text NOT NULL,
    "patientId" text NOT NULL,
    "doctorId" text NOT NULL,
    date timestamp without time zone NOT NULL,
    slot text NOT NULL,
    symptoms text NOT NULL,
    notes text,
    status public."AppointmentStatus" DEFAULT 'PENDING'::public."AppointmentStatus" NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.appointments OWNER TO postgres;

--
-- Name: articles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.articles (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    "contentMd" text NOT NULL,
    "featuredImage" text,
    "categoryId" text,
    status public."PostStatus" DEFAULT 'DRAFT'::public."PostStatus" NOT NULL,
    "authorId" text NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.articles OWNER TO postgres;

--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_logs (
    id text NOT NULL,
    "userId" text,
    action text NOT NULL,
    entity text,
    "entityId" text,
    metadata jsonb,
    ip text,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.audit_logs OWNER TO postgres;

--
-- Name: blogs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.blogs (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    excerpt text,
    "contentMd" text NOT NULL,
    "featuredImage" text,
    "categoryId" text,
    tags text[] DEFAULT '{}'::text[] NOT NULL,
    status public."PostStatus" DEFAULT 'DRAFT'::public."PostStatus" NOT NULL,
    "authorId" text NOT NULL,
    "seoTitle" text,
    "seoDesc" text,
    "publishedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.blogs OWNER TO postgres;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: contact_messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contact_messages (
    id text NOT NULL,
    "userId" text,
    name text NOT NULL,
    email text NOT NULL,
    subject text,
    message text NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.contact_messages OWNER TO postgres;

--
-- Name: doctors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.doctors (
    id text NOT NULL,
    "userId" text NOT NULL,
    specialization text NOT NULL,
    qualifications text NOT NULL,
    "experienceYrs" integer DEFAULT 0 NOT NULL,
    bio text,
    "consultFee" numeric(10,2) DEFAULT 0 NOT NULL,
    rating double precision DEFAULT 0 NOT NULL,
    "isVerified" boolean DEFAULT false NOT NULL,
    availability jsonb,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.doctors OWNER TO postgres;

--
-- Name: faqs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.faqs (
    id text NOT NULL,
    question text NOT NULL,
    answer text NOT NULL,
    "order" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.faqs OWNER TO postgres;

--
-- Name: newsletter_subscribers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.newsletter_subscribers (
    id text NOT NULL,
    email text NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.newsletter_subscribers OWNER TO postgres;

--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id text NOT NULL,
    "userId" text NOT NULL,
    type public."NotificationType" NOT NULL,
    title text NOT NULL,
    body text NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: patients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.patients (
    id text NOT NULL,
    "userId" text NOT NULL,
    "dateOfBirth" timestamp without time zone,
    gender text,
    phone text,
    address text,
    "medicalTags" text[] DEFAULT '{}'::text[] NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.patients OWNER TO postgres;

--
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id text NOT NULL,
    "userId" text NOT NULL,
    "appointmentId" text,
    amount numeric(10,2) NOT NULL,
    currency text DEFAULT 'INR'::text NOT NULL,
    status public."PaymentStatus" DEFAULT 'PENDING'::public."PaymentStatus" NOT NULL,
    provider text,
    "providerRefId" text,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- Name: settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.settings (
    id text NOT NULL,
    key text NOT NULL,
    value jsonb NOT NULL
);


ALTER TABLE public.settings OWNER TO postgres;

--
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subscriptions (
    id text NOT NULL,
    "userId" text NOT NULL,
    plan text NOT NULL,
    status public."SubscriptionStatus" DEFAULT 'TRIAL'::public."SubscriptionStatus" NOT NULL,
    "startedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "expiresAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.subscriptions OWNER TO postgres;

--
-- Name: testimonials; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.testimonials (
    id text NOT NULL,
    "userId" text,
    name text NOT NULL,
    role text,
    message text NOT NULL,
    rating integer DEFAULT 5 NOT NULL,
    "avatarUrl" text,
    "isPublished" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.testimonials OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    "passwordHash" text,
    "avatarUrl" text,
    role public."Role" DEFAULT 'FREE_USER'::public."Role" NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "emailVerified" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: ai_chats; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ai_chats (id, "userId", "sessionId", role, content, model, "createdAt") FROM stdin;
chat-1783490484920-ywd5kk	\N	test-session-verify	user	One sentence: what is dinacharya?	llama-3.3-70b-versatile	2026-07-08 06:01:24.962448
\.


--
-- Data for Name: appointments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.appointments (id, "patientId", "doctorId", date, slot, symptoms, notes, status, "createdAt", "updatedAt") FROM stdin;
apt-1	pat-1	doc-1	2026-07-08 16:58:29.151369	10:30 AM	Trouble sleeping for two weeks.	\N	PENDING	2026-07-07 16:58:29.151369	2026-07-07 16:58:29.151369
apt-2	pat-2	doc-3	2026-07-08 16:58:29.151369	4:30 PM	Mild acidity after meals.	\N	CONFIRMED	2026-07-07 16:58:29.151369	2026-07-07 16:58:29.151369
apt-3	pat-3	doc-2	2026-07-09 16:58:29.151369	9:00 AM	General wellness check-in.	\N	CONFIRMED	2026-07-07 16:58:29.151369	2026-07-07 16:58:29.151369
apt-4	pat-4	doc-4	2026-07-09 16:58:29.151369	1:00 PM	Knee stiffness in the morning.	\N	COMPLETED	2026-07-07 16:58:29.151369	2026-07-07 16:58:29.151369
apt-5	pat-2	doc-1	2026-07-10 16:58:29.151369	6:00 PM	Follow-up on detox plan.	\N	CANCELLED	2026-07-07 16:58:29.151369	2026-07-07 16:58:29.151369
apt-1783487400075	pat-1783487400073	doc-2	2026-07-09 05:10:00.045	9:00 AM	Testing the booking flow end to end.	\N	PENDING	2026-07-08 05:10:00.075689	2026-07-08 05:10:00.075689
apt-1783570204621	pat-1783570204618	doc-3	2026-07-10 04:10:04.519	11:00 AM	Testing payment flow.	\N	CONFIRMED	2026-07-09 04:10:04.62193	2026-07-09 04:10:04.62193
\.


--
-- Data for Name: articles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.articles (id, title, slug, "contentMd", "featuredImage", "categoryId", status, "authorId", "createdAt", "updatedAt") FROM stdin;
art-1	Quick Guide: Triphala for Digestion	triphala-quick-guide	# Triphala\\n\\nContent...	\N	cat-1	PUBLISHED	editor-1	2026-07-08 05:51:06.131877	2026-07-08 05:51:06.131877
art-2	Seasonal Eating for Monsoon	seasonal-eating-monsoon	# Monsoon Diet\\n\\nContent...	\N	cat-2	DRAFT	editor-1	2026-07-08 05:51:06.131877	2026-07-08 05:51:06.131877
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_logs (id, "userId", action, entity, "entityId", metadata, ip, "createdAt") FROM stdin;
\.


--
-- Data for Name: blogs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.blogs (id, title, slug, excerpt, "contentMd", "featuredImage", "categoryId", tags, status, "authorId", "seoTitle", "seoDesc", "publishedAt", "createdAt", "updatedAt") FROM stdin;
blog-1	Understanding Your Dosha: A Practical Starting Point	understanding-your-dosha	Vata, Pitta, Kapha explained without the jargon.	# Understanding Your Dosha\n\nAyurveda groups the body's functional patterns into three doshas: Vata, Pitta, and Kapha. Everyone has all three, usually with one or two more dominant than the rest.\n\n## Vata — Movement\n\nVata governs movement: breathing, circulation, nerve impulses, and elimination. When balanced, Vata shows up as creativity and quick thinking. Out of balance, it shows up as anxiety, dry skin, and irregular digestion.\n\n## Pitta — Transformation\n\nPitta governs metabolism and transformation — digestion, body temperature, and how you process information. Balanced Pitta is sharp and focused. Out of balance, it shows up as irritability, acidity, and inflammation.\n\n## Kapha — Structure\n\nKapha governs structure and lubrication — bones, muscles, joints, and immunity. Balanced Kapha is calm and steady. Out of balance, it shows up as sluggishness, weight gain, and congestion.\n\n## A practical starting point\n\nYou do not need a lab test to start. Notice your default patterns: Do you run cold or warm? Do you gain weight easily or struggle to keep it on? Is your digestion fast, sharp, or slow? Those answers point toward your dominant dosha — and a doctor on this platform can confirm it and build a plan around it.	\N	cat-1	{dosha,basics}	PUBLISHED	editor-1	\N	\N	2026-07-02 16:58:29.155154	2026-07-07 16:58:29.155154	2026-07-07 16:58:29.155154
blog-2	Five Dinacharya Habits That Actually Stick	five-dinacharya-habits	Morning routines adapted for a 9-to-6 life.	# Five Dinacharya Habits That Actually Stick\n\nDinacharya means "daily routine" in Sanskrit. Classical texts describe an elaborate morning ritual — most of it is impractical for a modern work schedule. These five habits capture most of the benefit in under twenty minutes.\n\n## 1. Wake before sunrise, consistently\n\nNot for mysticism — for a stable circadian rhythm. Waking within the same 30-minute window every day, weekdays and weekends, does more for energy levels than any supplement.\n\n## 2. Scrape your tongue before you drink anything\n\nA short tongue-scraping ritual clears overnight bacterial buildup and, anecdotally, reduces the urge to reach for coffee immediately on waking.\n\n## 3. Warm water before food\n\nA glass of warm (not hot) water on an empty stomach gently kick-starts digestion before the first meal.\n\n## 4. Move before you sit at a screen\n\nFive to ten minutes of stretching or a short walk outdoors, before opening a laptop, measurably changes how the rest of the day feels — this is the one habit most patients report sticking with longest.\n\n## 5. Eat your largest meal at midday\n\nDigestive capacity (Agni) is considered strongest around midday. A lighter dinner, eaten earlier in the evening, is one of the simplest changes with an outsized effect on sleep quality.	\N	cat-2	{routine}	PUBLISHED	editor-1	\N	\N	2026-07-05 16:58:29.155154	2026-07-07 16:58:29.155154	2026-07-07 16:58:29.155154
blog-3	Ayurveda and Modern Medicine: Where They Agree	ayurveda-modern-medicine	A doctors honest take on the overlap.	# Ayurveda and Modern Medicine: Where They Agree\n\nIt is easy to frame Ayurveda and modern clinical medicine as opposites. In practice, a good Ayurvedic doctor and a good physician agree on more than you would expect.\n\n## Diet and inflammation\n\nModern nutrition research increasingly points to the same conclusions Ayurveda reached centuries ago: minimize ultra-processed food, eat on a consistent schedule, and pay attention to how specific foods affect your individual digestion.\n\n## Sleep as a foundation, not an afterthought\n\nBoth traditions treat sleep as foundational to nearly every other health outcome, not a separate wellness category. Dinacharya's emphasis on a consistent sleep-wake cycle mirrors what sleep medicine recommends today.\n\n## Where they genuinely differ\n\nAyurveda does not replace diagnostics, surgery, or acute emergency care. If you are experiencing chest pain, sudden severe symptoms, or anything urgent, that is a call for a physician and possibly emergency services — not a wellness routine. This platform's doctors will tell you exactly that when it applies, rather than overpromising what Ayurveda can do.\n\n## The honest middle ground\n\nUse Ayurveda for what it is good at: daily routine, diet, stress patterns, and chronic lifestyle-driven complaints. Use modern medicine for diagnostics, acute care, and anything urgent. The best outcomes usually come from combining both, not picking a side.	\N	cat-3	{perspective}	DRAFT	editor-1	\N	\N	\N	2026-07-07 16:58:29.155154	2026-07-07 16:58:29.155154
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name, slug, "createdAt") FROM stdin;
cat-1	Fundamentals	fundamentals	2026-07-07 16:58:29.153924
cat-2	Lifestyle	lifestyle	2026-07-07 16:58:29.153924
cat-3	Perspective	perspective	2026-07-07 16:58:29.153924
\.


--
-- Data for Name: contact_messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contact_messages (id, "userId", name, email, subject, message, "isRead", "createdAt") FROM stdin;
contact-1783487400102	\N	Test User	testuser@example.com	\N	Just checking the contact form works.	f	2026-07-08 05:10:00.102691
contact-1783571165956	\N	Spammer	spam@example.com	\N	test message here	f	2026-07-09 04:26:05.982659
contact-1783571166131	\N	Spammer	spam@example.com	\N	test message here	f	2026-07-09 04:26:06.13171
contact-1783571166145	\N	Spammer	spam@example.com	\N	test message here	f	2026-07-09 04:26:06.145919
contact-1783571166160	\N	Spammer	spam@example.com	\N	test message here	f	2026-07-09 04:26:06.161337
contact-1783571166173	\N	Spammer	spam@example.com	\N	test message here	f	2026-07-09 04:26:06.173902
\.


--
-- Data for Name: doctors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.doctors (id, "userId", specialization, qualifications, "experienceYrs", bio, "consultFee", rating, "isVerified", availability, "createdAt", "updatedAt") FROM stdin;
doc-1	user-doc-1	Panchakarma & Detox	BAMS, MD (Ayurveda)	12	Specialist in classical detox therapies.	499.00	4.9	t	\N	2026-07-07 16:58:29.147453	2026-07-07 16:58:29.147453
doc-2	user-doc-2	Digestive Health	BAMS	9	Focused on Agni (digestive fire) restoration.	399.00	4.8	t	\N	2026-07-07 16:58:29.147453	2026-07-07 16:58:29.147453
doc-3	user-doc-3	Women's Health	BAMS, MD (Prasuti Tantra)	15	Womens wellness across life stages.	599.00	5	t	\N	2026-07-07 16:58:29.147453	2026-07-07 16:58:29.147453
doc-4	user-doc-4	Joint & Muscle Care	BAMS	7	Joint pain and mobility specialist.	349.00	4.7	t	\N	2026-07-07 16:58:29.147453	2026-07-07 16:58:29.147453
\.


--
-- Data for Name: faqs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.faqs (id, question, answer, "order") FROM stdin;
faq-1	Is Niro AI a replacement for a doctor?	No. It gives educational guidance only; book a doctor for anything urgent.	1
faq-2	How are doctors verified?	Every profile is checked against BAMS/registration credentials.	2
faq-3	Can I use this without paying?	Yes, free accounts get limited AI access and can browse doctors.	3
\.


--
-- Data for Name: newsletter_subscribers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.newsletter_subscribers (id, email, "createdAt") FROM stdin;
sub-1783487400122	newsletter-test@example.com	2026-07-08 05:10:00.122319
sub-1783571188422	validation-test@example.com	2026-07-09 04:26:28.440824
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, "userId", type, title, body, "isRead", "createdAt") FROM stdin;
notif-2	admin-1	APPOINTMENT	New appointment request	Rohit Kumar requested a slot with Dr. Anika Rao.	f	2026-07-08 05:58:43.263972
notif-3	user-doc-1	APPOINTMENT	New appointment request	A patient requested a consultation.	f	2026-07-08 05:58:43.263972
notif-1	admin-1	SYSTEM	Welcome to Niro Ayurveda	Your admin dashboard is ready.	t	2026-07-08 05:58:43.263972
\.


--
-- Data for Name: patients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.patients (id, "userId", "dateOfBirth", gender, phone, address, "medicalTags", "createdAt", "updatedAt") FROM stdin;
pat-1	user-pat-1	\N	male	+91-9000000001	\N	{}	2026-07-07 16:58:29.149769	2026-07-07 16:58:29.149769
pat-2	user-pat-2	\N	female	+91-9000000002	\N	{acidity}	2026-07-07 16:58:29.149769	2026-07-07 16:58:29.149769
pat-3	user-pat-3	\N	female	+91-9000000003	\N	{}	2026-07-07 16:58:29.149769	2026-07-07 16:58:29.149769
pat-4	user-pat-4	\N	male	+91-9000000004	\N	{"joint pain"}	2026-07-07 16:58:29.149769	2026-07-07 16:58:29.149769
pat-1783487400073	guest-1783487400070	\N	\N	\N	\N	{}	2026-07-08 05:10:00.073369	2026-07-08 05:10:00.073369
pat-1783570204618	guest-1783570204540	\N	\N	\N	\N	{}	2026-07-09 04:10:04.618876	2026-07-09 04:10:04.618876
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (id, "userId", "appointmentId", amount, currency, status, provider, "providerRefId", "createdAt") FROM stdin;
pay-1	user-pat-2	apt-2	599.00	INR	SUCCESS	razorpay	\N	2026-07-08 05:51:06.153409
pay-2	user-pat-4	apt-4	349.00	INR	SUCCESS	razorpay	\N	2026-07-08 05:51:06.153409
pay-1783570204651	guest-1783570204540	apt-1783570204621	599.00	INR	SUCCESS	razorpay	demo_1783570204675	2026-07-09 04:10:04.65157
\.


--
-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.settings (id, key, value) FROM stdin;
set-1	site_name	"Niro Ayurveda"
set-2	support_email	"editor@nirogitanman.com"
set-3	maintenance_mode	false
\.


--
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subscriptions (id, "userId", plan, status, "startedAt", "expiresAt", "createdAt") FROM stdin;
sub-1	paid-1	paid_monthly	ACTIVE	2026-07-08 05:51:06.160065	2026-07-28 05:51:06.160065	2026-07-08 05:51:06.160065
sub-2	user-pat-2	paid_yearly	ACTIVE	2026-07-08 05:51:06.160065	2027-05-04 05:51:06.160065	2026-07-08 05:51:06.160065
sub-3	user-pat-1	free	TRIAL	2026-07-08 05:51:06.160065	\N	2026-07-08 05:51:06.160065
\.


--
-- Data for Name: testimonials; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.testimonials (id, "userId", name, role, message, rating, "avatarUrl", "isPublished", "createdAt") FROM stdin;
test-1	paid-1	Priya S.	Paid member, Bengaluru	Niro AI gave me a diet plan in minutes, and my consult felt like a natural follow-up.	5	\N	t	2026-07-07 16:58:29.157048
test-2	user-pat-1	Rohit K.	Free user, Pune	Booking a slot took under two minutes.	5	\N	t	2026-07-07 16:58:29.157048
test-3	user-pat-2	Fatima A.	Paid member, Hyderabad	The yoga routines are matched to my dosha, not generic.	4	\N	t	2026-07-07 16:58:29.157048
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, "passwordHash", "avatarUrl", role, "isActive", "emailVerified", "createdAt", "updatedAt") FROM stdin;
admin-1	Admin	admin@nirotanman.com	$2b$10$785z/FIYFZXe8NkNHmZxN.j1h7AHO3Rlbn5Z.OankP8VWmIXkklzC	\N	ADMIN	t	\N	2026-07-07 16:58:29.138858	2026-07-07 16:58:29.138858
editor-1	Editor	editor@nirogitanman.com	$2b$10$785z/FIYFZXe8NkNHmZxN.j1h7AHO3Rlbn5Z.OankP8VWmIXkklzC	\N	EDITOR	t	\N	2026-07-07 16:58:29.138858	2026-07-07 16:58:29.138858
user-doc-1	Dr. Anika Rao	doctor@nirotanman.com	$2b$10$785z/FIYFZXe8NkNHmZxN.j1h7AHO3Rlbn5Z.OankP8VWmIXkklzC	\N	DOCTOR	t	\N	2026-07-07 16:58:29.138858	2026-07-07 16:58:29.138858
user-doc-2	Dr. Vikram Shetty	vikram@nirotanman.com	$2b$10$785z/FIYFZXe8NkNHmZxN.j1h7AHO3Rlbn5Z.OankP8VWmIXkklzC	\N	DOCTOR	t	\N	2026-07-07 16:58:29.138858	2026-07-07 16:58:29.138858
user-doc-3	Dr. Meera Nair	meera@nirotanman.com	$2b$10$785z/FIYFZXe8NkNHmZxN.j1h7AHO3Rlbn5Z.OankP8VWmIXkklzC	\N	DOCTOR	t	\N	2026-07-07 16:58:29.138858	2026-07-07 16:58:29.138858
user-doc-4	Dr. Arjun Das	arjun@nirotanman.com	$2b$10$785z/FIYFZXe8NkNHmZxN.j1h7AHO3Rlbn5Z.OankP8VWmIXkklzC	\N	DOCTOR	t	\N	2026-07-07 16:58:29.138858	2026-07-07 16:58:29.138858
paid-1	Priya S.	paid@nirotanman.com	$2b$10$785z/FIYFZXe8NkNHmZxN.j1h7AHO3Rlbn5Z.OankP8VWmIXkklzC	\N	PAID_USER	t	\N	2026-07-07 16:58:29.138858	2026-07-07 16:58:29.138858
user-pat-1	Rohit Kumar	rohit@example.com	$2b$10$785z/FIYFZXe8NkNHmZxN.j1h7AHO3Rlbn5Z.OankP8VWmIXkklzC	\N	FREE_USER	t	\N	2026-07-07 16:58:29.138858	2026-07-07 16:58:29.138858
user-pat-2	Fatima Ali	fatima@example.com	$2b$10$785z/FIYFZXe8NkNHmZxN.j1h7AHO3Rlbn5Z.OankP8VWmIXkklzC	\N	PAID_USER	t	\N	2026-07-07 16:58:29.138858	2026-07-07 16:58:29.138858
user-pat-3	Sana Iyer	sana@example.com	$2b$10$785z/FIYFZXe8NkNHmZxN.j1h7AHO3Rlbn5Z.OankP8VWmIXkklzC	\N	FREE_USER	t	\N	2026-07-07 16:58:29.138858	2026-07-07 16:58:29.138858
user-pat-4	Devansh Rao	devansh@example.com	$2b$10$785z/FIYFZXe8NkNHmZxN.j1h7AHO3Rlbn5Z.OankP8VWmIXkklzC	\N	PAID_USER	t	\N	2026-07-07 16:58:29.138858	2026-07-07 16:58:29.138858
guest-1783487400070	Test User	testuser@example.com	\N	\N	FREE_USER	t	\N	2026-07-08 05:10:00.070442	2026-07-08 05:10:00.070442
guest-1783570204540	Payment Tester	paytest@example.com	\N	\N	FREE_USER	t	\N	2026-07-09 04:10:04.540651	2026-07-09 04:10:04.540651
\.


--
-- Name: ai_chats ai_chats_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ai_chats
    ADD CONSTRAINT ai_chats_pkey PRIMARY KEY (id);


--
-- Name: appointments appointments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_pkey PRIMARY KEY (id);


--
-- Name: articles articles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.articles
    ADD CONSTRAINT articles_pkey PRIMARY KEY (id);


--
-- Name: articles articles_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.articles
    ADD CONSTRAINT articles_slug_key UNIQUE (slug);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: blogs blogs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blogs
    ADD CONSTRAINT blogs_pkey PRIMARY KEY (id);


--
-- Name: blogs blogs_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blogs
    ADD CONSTRAINT blogs_slug_key UNIQUE (slug);


--
-- Name: categories categories_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key UNIQUE (name);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: categories categories_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_slug_key UNIQUE (slug);


--
-- Name: contact_messages contact_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_messages
    ADD CONSTRAINT contact_messages_pkey PRIMARY KEY (id);


--
-- Name: doctors doctors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT doctors_pkey PRIMARY KEY (id);


--
-- Name: doctors doctors_userId_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT "doctors_userId_key" UNIQUE ("userId");


--
-- Name: faqs faqs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faqs
    ADD CONSTRAINT faqs_pkey PRIMARY KEY (id);


--
-- Name: newsletter_subscribers newsletter_subscribers_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.newsletter_subscribers
    ADD CONSTRAINT newsletter_subscribers_email_key UNIQUE (email);


--
-- Name: newsletter_subscribers newsletter_subscribers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.newsletter_subscribers
    ADD CONSTRAINT newsletter_subscribers_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: patients patients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_pkey PRIMARY KEY (id);


--
-- Name: patients patients_userId_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT "patients_userId_key" UNIQUE ("userId");


--
-- Name: payments payments_appointmentId_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_appointmentId_key" UNIQUE ("appointmentId");


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: settings settings_key_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_key_key UNIQUE (key);


--
-- Name: settings settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (id);


--
-- Name: subscriptions subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_pkey PRIMARY KEY (id);


--
-- Name: testimonials testimonials_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.testimonials
    ADD CONSTRAINT testimonials_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: ai_chats_sessionId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ai_chats_sessionId_idx" ON public.ai_chats USING btree ("sessionId");


--
-- Name: ai_chats_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ai_chats_userId_idx" ON public.ai_chats USING btree ("userId");


--
-- Name: appointments_doctorId_date_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "appointments_doctorId_date_idx" ON public.appointments USING btree ("doctorId", date);


--
-- Name: appointments_patientId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "appointments_patientId_idx" ON public.appointments USING btree ("patientId");


--
-- Name: audit_logs_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "audit_logs_userId_idx" ON public.audit_logs USING btree ("userId");


--
-- Name: blogs_categoryId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "blogs_categoryId_idx" ON public.blogs USING btree ("categoryId");


--
-- Name: blogs_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX blogs_status_idx ON public.blogs USING btree (status);


--
-- Name: doctors_specialization_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX doctors_specialization_idx ON public.doctors USING btree (specialization);


--
-- Name: notifications_userId_isRead_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "notifications_userId_isRead_idx" ON public.notifications USING btree ("userId", "isRead");


--
-- Name: payments_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "payments_userId_idx" ON public.payments USING btree ("userId");


--
-- Name: subscriptions_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "subscriptions_userId_idx" ON public.subscriptions USING btree ("userId");


--
-- Name: users_role_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX users_role_idx ON public.users USING btree (role);


--
-- Name: ai_chats ai_chats_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ai_chats
    ADD CONSTRAINT "ai_chats_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: appointments appointments_doctorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT "appointments_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES public.doctors(id) ON DELETE CASCADE;


--
-- Name: appointments appointments_patientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT "appointments_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES public.patients(id) ON DELETE CASCADE;


--
-- Name: articles articles_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.articles
    ADD CONSTRAINT "articles_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public.users(id);


--
-- Name: articles articles_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.articles
    ADD CONSTRAINT "articles_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public.categories(id);


--
-- Name: audit_logs audit_logs_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: blogs blogs_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blogs
    ADD CONSTRAINT "blogs_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public.users(id);


--
-- Name: blogs blogs_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blogs
    ADD CONSTRAINT "blogs_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public.categories(id);


--
-- Name: contact_messages contact_messages_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_messages
    ADD CONSTRAINT "contact_messages_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: doctors doctors_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT "doctors_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: notifications notifications_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: patients patients_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT "patients_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: payments payments_appointmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES public.appointments(id);


--
-- Name: payments payments_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT "payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: subscriptions subscriptions_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT "subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: testimonials testimonials_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.testimonials
    ADD CONSTRAINT "testimonials_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

\unrestrict p0QX7Xq5UswrM2t8fS6vc8H7Ag6U8BO2JVEGFsxZ2dY7p0kNo8hANB8P1XJSy8P

