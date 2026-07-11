"use client";

import { useState } from "react";
import { CreditCard, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function PaymentStep({
  appointmentId,
  doctorName,
  patientName,
  patientEmail,
}: {
  appointmentId: string;
  doctorName: string;
  patientName: string;
  patientEmail: string;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "paid" | "error">("idle");
  const [amount, setAmount] = useState<number | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  const [error, setError] = useState("");

  async function handlePay() {
    setStatus("loading");
    setError("");
    try {
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId }),
      });
      const order = await orderRes.json();
      if (!orderRes.ok) throw new Error(order?.error || "Could not start payment");
      setAmount(order.amount);

      if (order.demo) {
        // No live Razorpay credentials configured on the server — simulate
        // the gateway round-trip so the flow is still fully demoable.
        setDemoMode(true);
        await new Promise((r) => setTimeout(r, 1100));
        const verifyRes = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ appointmentId, demo: true }),
        });
        if (!verifyRes.ok) throw new Error("Could not confirm payment");
        setStatus("paid");
        return;
      }

      const loaded = await loadRazorpayScript();
      if (!loaded || !window.Razorpay) throw new Error("Could not load payment gateway");

      const rzp = new window.Razorpay({
        key: order.keyId,
        order_id: order.orderId,
        amount: Math.round(order.amount * 100),
        currency: order.currency,
        name: "Niro Ayurveda",
        description: `Consultation with ${doctorName}`,
        prefill: { name: patientName, email: patientEmail },
        theme: { color: "#128A5D" },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          const verifyRes = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ appointmentId, ...response }),
          });
          if (verifyRes.ok) setStatus("paid");
          else setStatus("error");
        },
        modal: { ondismiss: () => setStatus("idle") },
      });
      rzp.open();
      setStatus("idle");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Something went wrong");
    }
  }

  if (status === "paid") {
    return (
      <div className="mt-6 rounded-2xl border border-emerald/20 bg-emerald/5 p-5 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald text-white shrink-0">
          <Check className="h-4 w-4" />
        </div>
        <div>
          <p className="font-display font-semibold text-sm text-forest dark:text-mint">Payment confirmed</p>
          <p className="font-utility text-xs text-forest/60 dark:text-mint/60">
            {demoMode ? "Demo payment" : "Payment"} of ₹{amount} received — your appointment is now confirmed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-2xl border border-forest/10 dark:border-mint/10 bg-white/50 dark:bg-white/5 p-5">
      <div className="flex items-center gap-2 mb-1">
        <CreditCard className="h-4 w-4 text-emerald" />
        <p className="font-display font-semibold text-sm text-forest dark:text-mint">Pay consultation fee</p>
      </div>
      <p className="font-utility text-xs text-forest/60 dark:text-mint/60 mb-4">
        Secures your slot with {doctorName}. Powered by Razorpay.
      </p>
      <Button variant="primary" size="md" onClick={handlePay} disabled={status === "loading"}>
        {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Pay now"}
      </Button>
      {error && <p className="mt-2 font-utility text-xs text-red-500">{error}</p>}
    </div>
  );
}
