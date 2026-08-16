"use client";

import { useState, useEffect } from "react";
import { BottomNav } from "@/components/BottomNav";
import { MonthPicker } from "@/components/MonthPicker";
import { TransactionRow } from "@/components/TransactionRow";
import { currentMonth } from "@/lib/utils";
import type { TransactionType } from "@/types";

type Filter = "all" | TransactionType;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "income", label: "Income" },
  { value: "expense", label: "Expenses" },
  { value: "investment", label: "Investments" },
];

export default function HistoryPage() {
  const [month, setMonth] = useState(currentMonth());
  const [filter, setFilter] = useState<Filter>("all");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadTransactions() {
    setLoading(true);
    const [incRes, expRes, invRes] = await Promise.all([
      fetch(`/api/income?month=${month}`).then((r) => r.json()),
      fetch(`/api/expenses?month=${month}`).then((r) => r.json()),
      fetch(`/api/investments?month=${month}`).then((r) => r.json()),
    ]);

    const SOURCE_LABEL: Record<string, string> = { salary: "Salary", brand_deal: "Brand Deal", youtube: "YouTube", other: "Other" };

    const income = (incRes.data ?? []).map((i: any) => ({
      ...i, type: "income", label: SOURCE_LABEL[i.source as string] ?? i.source, color: "#10b981",
    }));
    const expenses = (expRes.data ?? []).map((e: any) => ({
      ...e, type: "expense", label: e.category_name ?? "Expense", color: e.category_color,
    }));
    const investments = (invRes.data ?? []).map((inv: any) => ({
      ...inv, type: "investment", label: inv.fund_name, color: "#3b82f6", account_name: null,
    }));

    const all = [...income, ...expenses, ...investments].sort((a, b) => b.date.localeCompare(a.date));
    setTransactions(all);
    setLoading(false);
  }

  useEffect(() => { loadTransactions(); }, [month]);

  async function handleDelete(id: string, type: TransactionType) {
    const urlMap = { income: `/api/income/${id}`, expense: `/api/expenses/${id}`, investment: `/api/investments/${id}` };
    await fetch(urlMap[type], { method: "DELETE" });
    loadTransactions();
  }

  const filtered = filter === "all" ? transactions : transactions.filter((t) => t.type === filter);

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-24">
      <div className="px-5 pt-14 pb-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white tracking-tight">History</h1>
          <MonthPicker month={month} onChange={setMonth} />
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1 no-scrollbar">
          {FILTERS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                filter === value
                  ? "bg-violet-600 text-white"
                  : "bg-white/[0.06] text-zinc-400 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-white/[0.04] rounded-2xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-16 h-16 rounded-3xl bg-white/[0.04] flex items-center justify-center">
              <span className="text-2xl">🧾</span>
            </div>
            <p className="text-zinc-500 text-sm">No transactions found.</p>
          </div>
        ) : (
          <div className="bg-[#111111] rounded-2xl px-4 border border-white/[0.07]">
            {filtered.map((t) => (
              <TransactionRow key={`${t.type}-${t.id}`} {...t} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
