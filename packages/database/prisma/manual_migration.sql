-- Matches packages/database/prisma/schema.prisma exactly.
-- On a machine with normal internet access, prefer `pnpm db:migrate` (Prisma)
-- as the source of truth going forward — this file exists because the build
-- sandbox's egress proxy blocks binaries.prisma.sh, not because Prisma migrate
-- doesn't work in general.

CREATE TYPE "Role" AS ENUM ('GUEST','FREE_USER','PAID_USER','DOCTOR','EDITOR','ADMIN');
CREATE TYPE "AppointmentStatus" AS ENUM ('PENDING','CONFIRMED','COMPLETED','CANCELLED','NO_SHOW');
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE','CANCELLED','EXPIRED','TRIAL');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING','SUCCESS','FAILED','REFUNDED');
CREATE TYPE "PostStatus" AS ENUM ('DRAFT','IN_REVIEW','PUBLISHED','ARCHIVED');
CREATE TYPE "NotificationType" AS ENUM ('APPOINTMENT','SYSTEM','BLOG','PAYMENT','MESSAGE');

CREATE TABLE "users" (
  id text PRIMARY KEY,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  "passwordHash" text,
  "avatarUrl" text,
  role "Role" NOT NULL DEFAULT 'FREE_USER',
  "isActive" boolean NOT NULL DEFAULT true,
  "emailVerified" timestamp,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);
CREATE INDEX ON "users" (role);

CREATE TABLE "doctors" (
  id text PRIMARY KEY,
  "userId" text UNIQUE NOT NULL REFERENCES "users"(id) ON DELETE CASCADE,
  specialization text NOT NULL,
  qualifications text NOT NULL,
  "experienceYrs" int NOT NULL DEFAULT 0,
  bio text,
  "consultFee" numeric(10,2) NOT NULL DEFAULT 0,
  rating double precision NOT NULL DEFAULT 0,
  "isVerified" boolean NOT NULL DEFAULT false,
  availability jsonb,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);
CREATE INDEX ON "doctors" (specialization);

CREATE TABLE "patients" (
  id text PRIMARY KEY,
  "userId" text UNIQUE NOT NULL REFERENCES "users"(id) ON DELETE CASCADE,
  "dateOfBirth" timestamp,
  gender text,
  phone text,
  address text,
  "medicalTags" text[] NOT NULL DEFAULT '{}',
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE "appointments" (
  id text PRIMARY KEY,
  "patientId" text NOT NULL REFERENCES "patients"(id) ON DELETE CASCADE,
  "doctorId" text NOT NULL REFERENCES "doctors"(id) ON DELETE CASCADE,
  date timestamp NOT NULL,
  slot text NOT NULL,
  symptoms text NOT NULL,
  notes text,
  status "AppointmentStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);
CREATE INDEX ON "appointments" ("doctorId", date);
CREATE INDEX ON "appointments" ("patientId");

CREATE TABLE "payments" (
  id text PRIMARY KEY,
  "userId" text NOT NULL REFERENCES "users"(id) ON DELETE CASCADE,
  "appointmentId" text UNIQUE REFERENCES "appointments"(id),
  amount numeric(10,2) NOT NULL,
  currency text NOT NULL DEFAULT 'INR',
  status "PaymentStatus" NOT NULL DEFAULT 'PENDING',
  provider text,
  "providerRefId" text,
  "createdAt" timestamp NOT NULL DEFAULT now()
);
CREATE INDEX ON "payments" ("userId");

CREATE TABLE "subscriptions" (
  id text PRIMARY KEY,
  "userId" text NOT NULL REFERENCES "users"(id) ON DELETE CASCADE,
  plan text NOT NULL,
  status "SubscriptionStatus" NOT NULL DEFAULT 'TRIAL',
  "startedAt" timestamp NOT NULL DEFAULT now(),
  "expiresAt" timestamp,
  "createdAt" timestamp NOT NULL DEFAULT now()
);
CREATE INDEX ON "subscriptions" ("userId");

CREATE TABLE "categories" (
  id text PRIMARY KEY,
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  "createdAt" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE "blogs" (
  id text PRIMARY KEY,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  "contentMd" text NOT NULL,
  "featuredImage" text,
  "categoryId" text REFERENCES "categories"(id),
  tags text[] NOT NULL DEFAULT '{}',
  status "PostStatus" NOT NULL DEFAULT 'DRAFT',
  "authorId" text NOT NULL REFERENCES "users"(id),
  "seoTitle" text,
  "seoDesc" text,
  "publishedAt" timestamp,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);
CREATE INDEX ON "blogs" (status);
CREATE INDEX ON "blogs" ("categoryId");

CREATE TABLE "articles" (
  id text PRIMARY KEY,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  "contentMd" text NOT NULL,
  "featuredImage" text,
  "categoryId" text REFERENCES "categories"(id),
  status "PostStatus" NOT NULL DEFAULT 'DRAFT',
  "authorId" text NOT NULL REFERENCES "users"(id),
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE "testimonials" (
  id text PRIMARY KEY,
  "userId" text REFERENCES "users"(id),
  name text NOT NULL,
  role text,
  message text NOT NULL,
  rating int NOT NULL DEFAULT 5,
  "avatarUrl" text,
  "isPublished" boolean NOT NULL DEFAULT false,
  "createdAt" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE "faqs" (
  id text PRIMARY KEY,
  question text NOT NULL,
  answer text NOT NULL,
  "order" int NOT NULL DEFAULT 0
);

CREATE TABLE "ai_chats" (
  id text PRIMARY KEY,
  "userId" text REFERENCES "users"(id),
  "sessionId" text NOT NULL,
  role text NOT NULL,
  content text NOT NULL,
  model text NOT NULL DEFAULT 'llama-3.3-70b-versatile',
  "createdAt" timestamp NOT NULL DEFAULT now()
);
CREATE INDEX ON "ai_chats" ("sessionId");
CREATE INDEX ON "ai_chats" ("userId");

CREATE TABLE "contact_messages" (
  id text PRIMARY KEY,
  "userId" text REFERENCES "users"(id),
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  "isRead" boolean NOT NULL DEFAULT false,
  "createdAt" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE "notifications" (
  id text PRIMARY KEY,
  "userId" text NOT NULL REFERENCES "users"(id) ON DELETE CASCADE,
  type "NotificationType" NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  "isRead" boolean NOT NULL DEFAULT false,
  "createdAt" timestamp NOT NULL DEFAULT now()
);
CREATE INDEX ON "notifications" ("userId", "isRead");

CREATE TABLE "audit_logs" (
  id text PRIMARY KEY,
  "userId" text REFERENCES "users"(id),
  action text NOT NULL,
  entity text,
  "entityId" text,
  metadata jsonb,
  ip text,
  "createdAt" timestamp NOT NULL DEFAULT now()
);
CREATE INDEX ON "audit_logs" ("userId");

CREATE TABLE "settings" (
  id text PRIMARY KEY,
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL
);

CREATE TABLE "newsletter_subscribers" (
  id text PRIMARY KEY,
  email text UNIQUE NOT NULL,
  "createdAt" timestamp NOT NULL DEFAULT now()
);
