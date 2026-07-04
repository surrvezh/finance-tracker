"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency, formatMonth } from "@/lib/utils";

interface IncomeExpenseBarProps {
  data: { month: string; income: number; expenses: number }[];
}

export function IncomeExpenseBar({ data }: IncomeExpenseBarProps) {
  const formatted = data.map((d) => ({ ...d, label: formatMonth(d.month).split(" ")[0] }));

  return (
    <div className="bg-[#141414] rounded-[16px] p-4 border border-zinc-800">
      <p className="text-xs text-zinc-500 font-medium mb-3">Income vs Expenses (6 months)</p>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={formatted} barCategoryGap="30%" barGap={2}>
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip
            formatter={(value, name) => [typeof value === "number" ? formatCurrency(value) : String(value ?? ""), name === "income" ? "Income" : "Expenses"]}
            contentStyle={{ background: "#1a1a1a", border: "1px solid #262626", borderRadius: 12, fontSize: 12 }}
          />
          <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex gap-4 mt-2">
        <span className="flex items-center gap-1.5 text-xs text-zinc-500"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />Income</span>
        <span className="flex items-center gap-1.5 text-xs text-zinc-500"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" />Expenses</span>
      </div>
    </div>
  );
}
