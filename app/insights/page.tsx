"use client";

import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { MonthPicker } from "@/components/MonthPicker";
import { InsightReport } from "@/components/InsightReport";
import { currentMonth } from "@/lib/utils";

export default function InsightsPage() {
  const [month, setMonth] = useState(currentMonth());
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    setLoading(true);
    setReport(null);
    fetch(`/api/insights?month=${month}`)
      .then((r) => r.json())
      .then(({ data }) => setReport(data?.report ?? null))
      .finally(() => setLoading(false));
  }, [month]);

  async function handleGenerate() {
    setGenerating(true);
    const res = await fetch("/api/insights/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ month }),
    });
    const { data } = await res.json();
    setReport(data?.report ?? null);
    setGenerating(false);
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0a0a0a] pb-24">
      <div className="px-5 pt-14 pb-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Insights</h1>
          <div className="flex items-center gap-3">
            <MonthPicker month={month} onChange={setMonth} />
            <button
              type="button"
              onClick={handleGenerate}
              disabled={generating}
              className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} className={`text-zinc-600 dark:text-zinc-300 ${generating ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-16 bg-zinc-200 dark:bg-zinc-900 rounded-2xl animate-pulse" />)}
          </div>
        ) : report ? (
          <div className="bg-white dark:bg-[#141414] rounded-2xl p-5 border border-zinc-200 dark:border-zinc-800">
            <InsightReport report={report} />
          </div>
        ) : (
          <div className="bg-white dark:bg-[#141414] rounded-2xl p-8 border border-zinc-200 dark:border-zinc-800 text-center">
            <p className="text-zinc-500 text-sm mb-4">No insights for this month yet.</p>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={generating}
              className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold px-6 py-3 rounded-2xl transition-colors disabled:opacity-50"
            >
              {generating ? "Generating..." : "Generate Insights"}
            </button>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
