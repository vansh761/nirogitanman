"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, Loader2 } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { Button } from "@/components/ui/button";
import { DOCTORS as MOCK_DOCTORS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { PaymentStep } from "./payment-step";

const SLOTS = ["9:00 AM", "10:30 AM", "1:00 PM", "4:30 PM", "6:00 PM"];
const DATES = ["Today", "Tomorrow", "In 2 days"];

type DoctorItem = {
  id: string;
  name: string;
  specialization: string;
  experienceYrs?: number;
  experience?: number;
  consultFee?: string;
  fee?: number;
  nextSlot?: string;
};

export function Consultation({ doctors }: { doctors?: DoctorItem[] }) {
  const DOCTORS: DoctorItem[] = doctors && doctors.length > 0 ? doctors : MOCK_DOCTORS;
  const [step, setStep] = useState(0);
  const [doctorId, setDoctorId] = useState(DOCTORS[0].id);
  const [date, setDate] = useState(DATES[0]);
  const [slot, setSlot] = useState(SLOTS[0]);
  const [symptoms, setSymptoms] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [appointmentId, setAppointmentId] = useState<string | null>(null);

  const [error, setError] = useState("");

  const steps = ["Doctor", "Date & slot", "Symptoms"];

  async function submit() {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorId, date, slot, symptoms, name, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Could not submit request");
      setAppointmentId(data.id);
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  function bookAnother() {
    setStep(0);
    setDoctorId(DOCTORS[0].id);
    setDate(DATES[0]);
    setSlot(SLOTS[0]);
    setSymptoms("");
    setName("");
    setEmail("");
    setDone(false);
    setAppointmentId(null);
    setError("");
  }

  if (done) {
    return (
      <section id="consultation" className="px-4 py-24">
        <div className="mx-auto max-w-xl">
          <div className="text-center rounded-3xl border border-emerald/20 bg-emerald/5 p-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald text-white">
              <Check className="h-7 w-7" />
            </div>
            <h3 className="mt-5 font-display text-2xl font-semibold text-forest dark:text-mint">
              Request sent
            </h3>
            <p className="mt-2 font-body text-forest/70 dark:text-mint/70">
              {DOCTORS.find((d) => d.id === doctorId)?.name} will confirm your {date.toLowerCase()} slot at {slot}. You&apos;ll see it under Appointments in your dashboard.
            </p>
          </div>
          {appointmentId && (
            <PaymentStep
              appointmentId={appointmentId}
              doctorName={DOCTORS.find((d) => d.id === doctorId)?.name ?? "your doctor"}
              patientName={name}
              patientEmail={email}
            />
          )}
          <button
            onClick={bookAnother}
            className="mt-6 w-full text-center font-utility text-sm text-forest/60 dark:text-mint/60 hover:text-emerald transition-colors"
          >
            Book another consultation
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="consultation" className="px-4 py-24">
      <div className="mx-auto max-w-3xl">
        <SectionHeading eyebrow="Book a consultation" title="Three steps. No phone calls." />

        <div className="mt-10 flex items-center justify-center gap-2 font-utility text-xs">
          {steps.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full",
                  i <= step ? "bg-emerald text-white" : "bg-forest/10 text-forest/50 dark:bg-mint/10 dark:text-mint/50"
                )}
              >
                {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span className={i <= step ? "text-forest dark:text-mint" : "text-forest/40 dark:text-mint/40"}>{label}</span>
              {i < steps.length - 1 && <ChevronRight className="h-3 w-3 text-forest/30 dark:text-mint/30" />}
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-3xl border border-forest/10 dark:border-mint/10 bg-white/50 dark:bg-white/5 p-8">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="doctor" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid sm:grid-cols-2 gap-3">
                {DOCTORS.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => setDoctorId(doc.id)}
                    className={cn(
                      "text-left rounded-2xl border p-4 transition-colors",
                      doctorId === doc.id
                        ? "border-emerald bg-emerald/5"
                        : "border-forest/10 dark:border-mint/10 hover:border-forest/25"
                    )}
                  >
                    <p className="font-display font-semibold text-forest dark:text-mint">{doc.name}</p>
                    <p className="font-utility text-xs text-forest/60 dark:text-mint/60">{doc.specialization} · {doc.experienceYrs ?? doc.experience} yrs</p>
                    <p className="mt-1 font-utility text-xs text-emerald">₹{doc.consultFee ?? doc.fee}{doc.nextSlot ? ` · next: ${doc.nextSlot}` : ""}</p>
                  </button>
                ))}
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="slot" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <p className="font-utility text-xs uppercase tracking-wide text-forest/50 dark:text-mint/50 mb-2">Date</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {DATES.map((d) => (
                    <button key={d} onClick={() => setDate(d)} className={cn("rounded-full px-4 py-2 text-sm font-utility", date === d ? "bg-emerald text-white" : "bg-forest/5 dark:bg-mint/10 text-forest dark:text-mint")}>
                      {d}
                    </button>
                  ))}
                </div>
                <p className="font-utility text-xs uppercase tracking-wide text-forest/50 dark:text-mint/50 mb-2">Time slot</p>
                <div className="flex flex-wrap gap-2">
                  {SLOTS.map((s) => (
                    <button key={s} onClick={() => setSlot(s)} className={cn("rounded-full px-4 py-2 text-sm font-utility", slot === s ? "bg-emerald text-white" : "bg-forest/5 dark:bg-mint/10 text-forest dark:text-mint")}>
                      {s}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="symptoms" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="grid sm:grid-cols-2 gap-3 mb-4">
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="rounded-xl border border-forest/10 dark:border-mint/10 bg-canvas dark:bg-canvas-dark px-4 py-3 text-sm font-body outline-none focus-visible:ring-2 focus-visible:ring-emerald"
                  />
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="rounded-xl border border-forest/10 dark:border-mint/10 bg-canvas dark:bg-canvas-dark px-4 py-3 text-sm font-body outline-none focus-visible:ring-2 focus-visible:ring-emerald"
                  />
                </div>
                <label className="font-utility text-xs uppercase tracking-wide text-forest/50 dark:text-mint/50">
                  Describe what you&apos;re experiencing
                </label>
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  rows={5}
                  placeholder="E.g. Trouble sleeping for the past 2 weeks, mild acidity after meals..."
                  className="mt-2 w-full rounded-2xl border border-forest/10 dark:border-mint/10 bg-canvas dark:bg-canvas-dark p-4 text-sm font-body outline-none focus-visible:ring-2 focus-visible:ring-emerald"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {error && <p className="mt-4 font-utility text-xs text-red-500">{error}</p>}

          <div className="mt-8 flex justify-between">
            <Button
              variant="outline"
              size="md"
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
            >
              Back
            </Button>
            {step < 2 ? (
              <Button variant="primary" size="md" onClick={() => setStep((s) => Math.min(2, s + 1))}>
                Continue
              </Button>
            ) : (
              <Button variant="primary" size="md" disabled={!symptoms.trim() || !name.trim() || !email.trim() || submitting} onClick={submit}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit request"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
