"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { Button } from "@/components/ui/button";
import { TiltCard } from "@/components/ui/tilt-card";
import { DOCTORS as MOCK_DOCTORS } from "@/lib/mock-data";

type DoctorItem = {
  id: string;
  name: string;
  specialization: string;
  experienceYrs?: number;
  experience?: number;
  rating: number;
};

export function Doctors({ doctors }: { doctors?: DoctorItem[] }) {
  const list: DoctorItem[] =
    doctors && doctors.length > 0
      ? doctors
      : MOCK_DOCTORS.map((d) => ({ id: d.id, name: d.name, specialization: d.specialization, experience: d.experience, rating: d.rating }));

  return (
    <section id="doctors" className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Meet the doctors" title="Verified Ayurvedic physicians, ready this week" />

        <div className="mt-14 grid sm:grid-cols-2 md:grid-cols-4 gap-5">
          {list.map((doc, i) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
            >
              <TiltCard className="rounded-3xl border border-forest/10 dark:border-mint/10 p-5 bg-white/50 dark:bg-white/5 hover:shadow-xl transition-shadow">
                <div className="h-32 w-full rounded-2xl bg-gradient-to-br from-mint/60 to-sky/30" />
                <h3 className="mt-4 font-display font-semibold text-forest dark:text-mint">{doc.name}</h3>
                <p className="font-utility text-xs text-forest/60 dark:text-mint/60">{doc.specialization}</p>
                <div className="mt-2 flex items-center gap-1 text-saffron">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <span className="font-utility text-xs text-forest/70 dark:text-mint/70">
                    {doc.rating} · {doc.experienceYrs ?? doc.experience} yrs
                  </span>
                </div>
                <a href="#consultation" className="block mt-4">
                  <Button variant="outline" size="sm" className="w-full">Book</Button>
                </a>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
