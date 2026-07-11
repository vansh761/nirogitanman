import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { Stats } from "@/components/sections/stats";
import { WhyAyurveda } from "@/components/sections/why-ayurveda";
import { Services } from "@/components/sections/services";
import { Consultation } from "@/components/sections/consultation";
import { AIAssistantShowcase } from "@/components/sections/ai-assistant-showcase";
import { Doctors } from "@/components/sections/doctors";
import { Testimonials } from "@/components/sections/testimonials";
import { FAQ } from "@/components/sections/faq";
import { BlogPreview } from "@/components/sections/blog-preview";
import { Newsletter } from "@/components/sections/newsletter";
import { Contact } from "@/components/sections/contact";
import { NiroAIWidget } from "@/components/ai/niro-ai-widget";
import { getDoctors, getPublishedTestimonials, getFaqs, getPublishedBlogs } from "database";

export const revalidate = 60;

export default async function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: "Niro Ayurveda",
    description:
      "Book verified Ayurvedic doctors and get AI-guided wellness plans for diet, yoga and lifestyle.",
    medicalSpecialty: "Ayurvedic Medicine",
    url: "https://nirotanman.example.com",
  };

  // Graceful degradation: if Postgres isn't reachable (e.g. DATABASE_URL not
  // configured yet), each section quietly falls back to its own mock data.
  const [doctors, testimonials, faqs, blogs] = await Promise.allSettled([
    getDoctors(),
    getPublishedTestimonials(),
    getFaqs(),
    getPublishedBlogs(3),
  ]);

  return (
    <main className="relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <Hero />
      <Stats />
      <WhyAyurveda />
      <Services />
      <Consultation doctors={doctors.status === "fulfilled" ? doctors.value : undefined} />
      <AIAssistantShowcase />
      <Doctors doctors={doctors.status === "fulfilled" ? doctors.value : undefined} />
      <Testimonials testimonials={testimonials.status === "fulfilled" ? testimonials.value : undefined} />
      <FAQ faqs={faqs.status === "fulfilled" ? faqs.value : undefined} />
      <BlogPreview posts={blogs.status === "fulfilled" ? blogs.value : undefined} />
      <Newsletter />
      <Contact />
      <Footer />
      <NiroAIWidget />
    </main>
  );
}
