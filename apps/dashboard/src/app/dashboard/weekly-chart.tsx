"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { WEEKLY_CONSULTATIONS } from "@/lib/mock-data";

export function WeeklyChart() {
  return (
    <div className="rounded-2xl border border-forest/10 dark:border-mint/10 bg-canvas dark:bg-canvas-dark p-5">
      <p className="font-display font-semibold text-forest dark:text-mint mb-1">Consultations vs Niro AI chats</p>
      <p className="font-utility text-xs text-forest/50 dark:text-mint/50 mb-4">
        Illustrative weekly trend — swap for a real GROUP BY query once you have more than a few days of data.
      </p>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={WEEKLY_CONSULTATIONS}>
            <CartesianGrid strokeDasharray="3 3" stroke="#0B3B2E1A" />
            <XAxis dataKey="day" stroke="#0B3B2E80" fontSize={12} />
            <YAxis stroke="#0B3B2E80" fontSize={12} />
            <Tooltip />
            <Line type="monotone" dataKey="consultations" stroke="#128A5D" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="aiChats" stroke="#4E8FBF" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
