"use client";

import { useState, useEffect } from "react";
import { SummaryCards } from "@/components/SummaryCards";
import { SpendingDonut } from "@/components/SpendingDonut";
import { IncomeExpenseBar } from "@/components/IncomeExpenseBar";
import { IncomeBreakdownSheet } from "@/components/IncomeBreakdownSheet";
import { BottomNav } from "@/components/BottomNav";
import { MonthPicker } from "@/components/MonthPicker";
import { currentMonth } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ViewMode = "monthly" | "yearly";

export default function HomePage() {
  const [mode, setMode] = useState<ViewMode>("monthly");

  // Monthly state
  const [month, setMonth] = useState(currentMonth());
  const [summary, setSummary] = useState<any>(null);
  const [last6, setLast6] = useState<any[]>([]);

  // Yearly state
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [yearlySummary, setYearlySummary] = useState<any>(null);
  const [allMonths, setAllMonths] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    if (mode === "monthly") {
      setLoading(true);
      fetch(`/api/summary?month=${month}`)
        .then((r) => r.json())
        .then(({ data }) => {
          setSummary(data.summary);
          setLast6(data.last6);
        })
        .finally(() => setLoading(false));
    }
  }, [month, mode]);

  useEffect(() => {
    if (mode === "yearly") {
      setLoading(true);
      fetch(`/api/summary/yearly?year=${year}`)
        .then((r) => r.json())
        .then(({ data }) => {
          setYearlySummary(data.summary);
          setAllMonths(data.allMonths);
        })
        .finally(() => setLoading(false));
    }
  }, [year, mode]);

  const currentYear = new Date().getFullYear();

  const activeSummary = mode === "monthly" ? summary : yearlySummary;

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-24">
      <div className="px-5 pt-12 pb-4">
        {/* Mode Toggle */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex bg-zinc-900 rounded-[10px] p-0.5">
            {(["monthly", "yearly"] as ViewMode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setLoading(true); }}
                className={`px-4 py-1.5 rounded-[8px] text-xs font-medium transition-colors capitalize ${
                  mode === m ? "bg-zinc-700 text-white" : "text-zinc-500"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {mode === "monthly" ? (
            <MonthPicker month={month} onChange={setMonth} />
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setYear((y) => String(Number(y) - 1))}
                className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm font-medium text-white min-w-[40px] text-center">{year}</span>
              <button
                onClick={() => setYear((y) => String(Number(y) + 1))}
                disabled={Number(year) >= currentYear}
                className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-zinc-900 rounded-[16px] animate-pulse" />
            ))}
          </div>
        ) : activeSummary ? (
          <div className="space-y-4">
            <SummaryCards
              totalIncome={activeSummary.totalIncome}
              totalExpenses={activeSummary.totalExpenses}
              netSaved={activeSummary.netSaved}
              totalInvested={activeSummary.totalInvested}
              onIncomeClick={() => setSheetOpen(true)}
            />
            <SpendingDonut data={(activeSummary.expensesByCategory as any[]).map((c: any) => ({
              name: c.name ?? "Unknown",
              color: c.color,
              total: Number(c.total),
            }))} />
            <IncomeExpenseBar
              data={mode === "monthly" ? last6 : allMonths}
              title={mode === "monthly" ? "Income vs Expenses (6 months)" : `Income vs Expenses (${year})`}
            />
          </div>
        ) : (
          <p className="text-zinc-500 text-sm text-center py-12">No data for this period yet.</p>
        )}
      </div>

      <IncomeBreakdownSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        incomeByAccount={activeSummary?.incomeByAccount ?? []}
        incomeBySource={(activeSummary?.incomeBySource as any[] ?? []).map((r: any) => ({
          source: r.source,
          total: Number(r.total),
        }))}
        totalIncome={activeSummary?.totalIncome ?? 0}
      />

      <BottomNav />
    </div>
  );
}
