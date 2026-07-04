"use client";

import { useState, useEffect } from "react";
import { SummaryCards } from "@/components/SummaryCards";
import { SpendingDonut } from "@/components/SpendingDonut";
import { IncomeExpenseBar } from "@/components/IncomeExpenseBar";
import { BottomNav } from "@/components/BottomNav";
import { MonthPicker } from "@/components/MonthPicker";
import { currentMonth } from "@/lib/utils";

export default function HomePage() {
  const [month, setMonth] = useState(currentMonth());
  const [summary, setSummary] = useState<any>(null);
  const [last6, setLast6] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/summary?month=${month}`)
      .then((r) => r.json())
      .then(({ data }) => {
        setSummary(data.summary);
        setLast6(data.last6);
      })
      .finally(() => setLoading(false));
  }, [month]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-24">
      <div className="px-5 pt-12 pb-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold">Overview</h1>
          <MonthPicker month={month} onChange={setMonth} />
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-zinc-900 rounded-[16px] animate-pulse" />
            ))}
          </div>
        ) : summary ? (
          <div className="space-y-4">
            <SummaryCards
              totalIncome={summary.totalIncome}
              totalExpenses={summary.totalExpenses}
              netSaved={summary.netSaved}
              totalInvested={summary.totalInvested}
            />
            <SpendingDonut data={(summary.expensesByCategory as any[]).map((c: any) => ({
              name: c.name ?? "Unknown",
              color: c.color,
              total: Number(c.total),
            }))} />
            <IncomeExpenseBar data={last6} />
          </div>
        ) : (
          <p className="text-zinc-500 text-sm text-center py-12">No data for this month yet.</p>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
