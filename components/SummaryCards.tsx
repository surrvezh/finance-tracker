import { formatCurrency } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, TrendingUp, PiggyBank, type LucideIcon } from "lucide-react";

interface SummaryCardsProps {
  totalIncome: number;
  totalExpenses: number;
  netSaved: number;
  totalInvested: number;
  onIncomeClick?: () => void;
}

interface CardProps {
  label: string;
  value: number;
  Icon: LucideIcon;
  valueColor: string;
  gradient: string;
  border: string;
  iconBg: string;
  iconColor: string;
  onClick?: () => void;
}

function Card({ label, value, Icon, valueColor, gradient, border, iconBg, iconColor, onClick }: CardProps) {
  const inner = (
    <>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider">{label}</span>
        <div className={`${iconBg} rounded-xl p-1.5`}>
          <Icon size={13} className={iconColor} />
        </div>
      </div>
      <p className={`text-xl font-bold tracking-tight ${value < 0 ? "text-red-400" : valueColor}`}>
        {formatCurrency(Math.abs(value))}
      </p>
      {value < 0 && label === "Saved" && (
        <p className="text-[10px] text-red-500/60 mt-0.5">Overspent</p>
      )}
      {onClick && (
        <p className="text-[10px] text-zinc-600 mt-1.5">Tap for breakdown →</p>
      )}
    </>
  );

  const base = `bg-gradient-to-br ${gradient} rounded-2xl p-4 border ${border}`;

  if (onClick) {
    return (
      <button onClick={onClick} className={`${base} text-left w-full active:scale-[0.97] transition-all duration-150`}>
        {inner}
      </button>
    );
  }

  return <div className={base}>{inner}</div>;
}

export function SummaryCards({ totalIncome, totalExpenses, netSaved, totalInvested, onIncomeClick }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Card
        label="Income"
        value={totalIncome}
        Icon={ArrowUpRight}
        valueColor="text-emerald-400"
        gradient="from-emerald-500/[0.12] to-emerald-500/[0.03]"
        border="border-emerald-500/[0.15]"
        iconBg="bg-emerald-500/[0.15]"
        iconColor="text-emerald-400"
        onClick={onIncomeClick}
      />
      <Card
        label="Expenses"
        value={totalExpenses}
        Icon={ArrowDownRight}
        valueColor="text-red-400"
        gradient="from-red-500/[0.12] to-red-500/[0.03]"
        border="border-red-500/[0.15]"
        iconBg="bg-red-500/[0.15]"
        iconColor="text-red-400"
      />
      <Card
        label="Saved"
        value={netSaved}
        Icon={PiggyBank}
        valueColor="text-violet-400"
        gradient="from-violet-500/[0.12] to-violet-500/[0.03]"
        border="border-violet-500/[0.15]"
        iconBg="bg-violet-500/[0.15]"
        iconColor="text-violet-400"
      />
      <Card
        label="Invested"
        value={totalInvested}
        Icon={TrendingUp}
        valueColor="text-blue-400"
        gradient="from-blue-500/[0.12] to-blue-500/[0.03]"
        border="border-blue-500/[0.15]"
        iconBg="bg-blue-500/[0.15]"
        iconColor="text-blue-400"
      />
    </div>
  );
}
