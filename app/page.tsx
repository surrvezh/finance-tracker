"use client";

import { useState, useEffect } from "react";
import { SummaryCards } from "@/components/SummaryCards";
import { SpendingDonut } from "@/components/SpendingDonut";
import { IncomeExpenseBar } from "@/components/IncomeExpenseBar";
import { BottomNav } from "@/components/BottomNav";
import { MonthPicker } from "@/components/MonthPicker";
import { currentMonth } from "@/lib/utils";
import { BudgetIndicator } from "@/components/BudgetIndicator";

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
            {(() => {
              const budgetCategories = (summary.categories as any[]).filter(
                (c: any) => c.budget_enabled && c.budget_limit
              );
              const overBudget = budgetCategories.filter((c: any) => {
                const spent = (summary.expensesByCategory as any[]).find(
                  (e: any) => e.category_id === c.id
                );
                return spent && Number(spent.total) / Number(c.budget_limit) >= 0.8;
              });
              if (!overBudget.length) return null;
              return (
                <div className="bg-[#141414] rounded-[16px] p-4 border border-zinc-800">
                  <p className="text-xs text-zinc-500 font-medium mb-2">Budget Alerts</p>
                  <div className="space-y-1.5">
                    {overBudget.map((c: any) => {
                      const spent = (summary.expensesByCategory as any[]).find(
                        (e: any) => e.category_id === c.id
                      );
                      return (
                        <div key={c.id} className="flex items-center gap-2 text-xs">
                          <BudgetIndicator spent={Number(spent?.total ?? 0)} limit={Number(c.budget_limit)} />
                          <span className="text-zinc-300">{c.name}</span>
                          <span className="text-zinc-500 ml-auto">
                            ₹{Number(spent?.total ?? 0).toLocaleString("en-IN")} / ₹{Number(c.budget_limit).toLocaleString("en-IN")}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
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
