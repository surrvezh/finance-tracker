"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/lib/utils";

interface SpendingDonutProps {
  data: { name: string; color: string | null; total: number }[];
}

const FALLBACK_COLORS = ["#6366f1", "#f59e0b", "#ec4899", "#8b5cf6", "#06b6d4", "#10b981", "#f97316", "#ef4444"];

export function SpendingDonut({ data }: SpendingDonutProps) {
  if (!data.length) {
    return (
      <div className="bg-[#141414] rounded-[16px] p-4 border border-zinc-800">
        <p className="text-xs text-zinc-500 font-medium mb-3">Spending by Category</p>
        <p className="text-zinc-600 text-sm text-center py-6">No expenses this month</p>
      </div>
    );
  }

  return (
    <div className="bg-[#141414] rounded-[16px] p-4 border border-zinc-800">
      <p className="text-xs text-zinc-500 font-medium mb-3">Spending by Category</p>
      <div className="flex gap-4 items-center">
        <ResponsiveContainer width={120} height={120}>
          <PieChart>
            <Pie data={data} dataKey="total" cx="50%" cy="50%" innerRadius={35} outerRadius={55} strokeWidth={0}>
              {data.map((entry, i) => (
                <Cell key={entry.name} fill={entry.color ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => (typeof value === "number" ? formatCurrency(value) : String(value ?? ""))}
              contentStyle={{ background: "#1a1a1a", border: "1px solid #262626", borderRadius: 12, fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex-1 space-y-1.5 min-w-0">
          {data.slice(0, 5).map((item, i) => (
            <div key={item.name} className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: item.color ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length] }}
              />
              <span className="text-xs text-zinc-400 truncate flex-1">{item.name}</span>
              <span className="text-xs text-white font-medium">{formatCurrency(item.total)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
