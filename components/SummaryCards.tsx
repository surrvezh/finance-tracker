import { formatCurrency } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, TrendingUp, PiggyBank } from "lucide-react";

interface SummaryCardsProps {
  totalIncome: number;
  totalExpenses: number;
  netSaved: number;
  totalInvested: number;
}

export function SummaryCards({ totalIncome, totalExpenses, netSaved, totalInvested }: SummaryCardsProps) {
  const cards = [
    { label: "Income", value: totalIncome, icon: ArrowUpRight, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Expenses", value: totalExpenses, icon: ArrowDownRight, color: "text-red-400", bg: "bg-red-400/10" },
    { label: "Saved", value: netSaved, icon: PiggyBank, color: "text-violet-400", bg: "bg-violet-400/10" },
    { label: "Invested", value: totalInvested, icon: TrendingUp, color: "text-blue-400", bg: "bg-blue-400/10" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {cards.map(({ label, value, icon: Icon, color, bg }) => (
        <div key={label} className="bg-[#141414] rounded-[16px] p-4 border border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-500 font-medium">{label}</span>
            <div className={`${bg} rounded-full p-1.5`}>
              <Icon size={14} className={color} />
            </div>
          </div>
          <p className={`text-lg font-semibold ${value < 0 ? "text-red-400" : "text-white"}`}>
            {formatCurrency(value)}
          </p>
        </div>
      ))}
    </div>
  );
}
