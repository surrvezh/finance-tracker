"use client";

import { useState, useEffect } from "react";
import { SummaryCards } from "@/components/SummaryCards";
import { SpendingDonut } from "@/components/SpendingDonut";
import { IncomeExpenseBar } from "@/components/IncomeExpenseBar";
import { IncomeBreakdownSheet } from "@/components/IncomeBreakdownSheet";
import { BottomNav } from "@/components/BottomNav";
import { MonthPicker } from "@/components/MonthPicker";
import { currentMonth, formatCurrency } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ViewMode = "monthly" | "yearly";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function HomePage() {
  const [mode, setMode] = useState<ViewMode>("monthly");
  const [month, setMonth] = useState(currentMonth());
  const [summary, setSummary] = useState<any>(null);
  const [last6, setLast6] = useState<any[]>([]);
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
        .then(({ data }) => { setSummary(data.summary); setLast6(data.last6); })
        .finally(() => setLoading(false));
    }
  }, [month, mode]);

  useEffect(() => {
    if (mode === "yearly") {
      setLoading(true);
      fetch(`/api/summary/yearly?year=${year}`)
        .then((r) => r.json())
        .then(({ data }) => { setYearlySummary(data.summary); setAllMonths(data.allMonths); })
        .finally(() => setLoading(false));
    }
  }, [year, mode]);

  const currentYear = new Date().getFullYear();
  const activeSummary = mode === "monthly" ? summary : yearlySummary;
  const saveRate = activeSummary?.totalIncome > 0
    ? ((activeSummary.netSaved / activeSummary.totalIncome) * 100).toFixed(1)
    : null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-28">
      <div className="px-5 pt-14 pb-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-zinc-500 font-medium">{getGreeting()}</p>
            <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">Overview</h1>
          </div>
          <div className="flex bg-white/[0.06] rounded-xl p-0.5">
            {(["monthly", "yearly"] as ViewMode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => { setMode(m); setLoading(true); }}
                className={`px-4 py-1.5 rounded-[10px] text-xs font-medium transition-all capitalize ${
                  mode === m ? "bg-white/[0.1] text-white" : "text-zinc-500"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Period picker */}
        <div className="mb-5">
          {mode === "monthly" ? (
            <MonthPicker month={month} onChange={setMonth} />
          ) : (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setYear((y) => String(Number(y) - 1))}
                className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm font-medium text-white min-w-[40px] text-center">{year}</span>
              <button
                type="button"
                onClick={() => setYear((y) => String(Number(y) + 1))}
                disabled={Number(year) >= currentYear}
                className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors disabled:opacity-30"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            <div className="h-28 bg-white/[0.04] rounded-2xl animate-pulse" />
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-white/[0.04] rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : activeSummary ? (
          <div className="space-y-4">

            {/* Hero net-saved card */}
            <div className={`rounded-2xl p-5 border ${
              activeSummary.netSaved >= 0
                ? "bg-gradient-to-br from-emerald-500/[0.12] to-emerald-500/[0.03] border-emerald-500/[0.2]"
                : "bg-gradient-to-br from-red-500/[0.12] to-red-500/[0.03] border-red-500/[0.2]"
            }`}>
              <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider mb-1.5">
                {mode === "monthly" ? "Net Saved" : `Net Saved · ${year}`}
              </p>
              <p className={`text-3xl font-bold tracking-tight ${activeSummary.netSaved < 0 ? "text-red-400" : "text-white"}`}>
                {activeSummary.netSaved < 0 ? "−" : ""}{formatCurrency(Math.abs(activeSummary.netSaved))}
              </p>
              {saveRate !== null && (
                <p className="text-xs text-zinc-500 mt-1.5">{saveRate}% save rate</p>
              )}
            </div>

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
              title={mode === "monthly" ? "Income vs Expenses · 6 months" : `Income vs Expenses · ${year}`}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-16 h-16 rounded-3xl bg-white/[0.04] flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-zinc-500 text-sm">No data for this period yet.</p>
          </div>
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
