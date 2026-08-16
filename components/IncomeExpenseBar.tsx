"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { formatCurrency, formatMonth } from "@/lib/utils";

interface IncomeExpenseBarProps {
  data: { month: string; income: number; expenses: number }[];
  title?: string;
}

export function IncomeExpenseBar({ data, title }: IncomeExpenseBarProps) {
  const formatted = data.map((d) => ({ ...d, label: formatMonth(d.month).split(" ")[0] }));
  const isScrollable = data.length > 6;
  const chartWidth = isScrollable ? Math.max(data.length * 56, 320) : undefined;

  return (
    <div className="bg-[#111111] rounded-2xl p-5 border border-white/[0.07]">
      <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-4">
        {title ?? "Income vs Expenses"}
      </p>
      <div className={isScrollable ? "overflow-x-auto no-scrollbar" : undefined}>
        <div style={isScrollable ? { width: chartWidth } : undefined}>
          <BarChart
            width={isScrollable ? chartWidth : undefined}
            height={150}
            data={formatted}
            barCategoryGap="30%"
            barGap={3}
          >
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#52525b" }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip
              formatter={(value, name) => [
                typeof value === "number" ? formatCurrency(value) : String(value ?? ""),
                name === "income" ? "Income" : "Expenses",
              ]}
              contentStyle={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, fontSize: 12 }}
              cursor={{ fill: "rgba(255,255,255,0.03)" }}
            />
            <Bar dataKey="income" fill="#10b981" radius={[5, 5, 0, 0]} />
            <Bar dataKey="expenses" fill="#ef4444" radius={[5, 5, 0, 0]} />
          </BarChart>
        </div>
      </div>
      <div className="flex gap-5 mt-2">
        <span className="flex items-center gap-1.5 text-xs text-zinc-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />Income
        </span>
        <span className="flex items-center gap-1.5 text-xs text-zinc-500">
          <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />Expenses
        </span>
      </div>
    </div>
  );
}
