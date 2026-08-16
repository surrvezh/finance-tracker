import { Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { TransactionType } from "@/types";

interface TransactionRowProps {
  id: string;
  type: TransactionType;
  label: string;
  account_name: string | null;
  amount: number;
  date: string;
  note: string | null;
  color: string | null;
  onDelete: (id: string, type: TransactionType) => void;
}

const SIGN: Record<TransactionType, string> = {
  income: "+",
  expense: "-",
  investment: "-",
};

const TYPE_TEXT: Record<TransactionType, string> = {
  income: "text-emerald-400",
  expense: "text-red-400",
  investment: "text-blue-400",
};

export function TransactionRow({ id, type, label, account_name, amount, date, note, color, onDelete }: TransactionRowProps) {
  const initials = label.slice(0, 2).toUpperCase();
  const hex = color ?? (type === "income" ? "#059669" : type === "investment" ? "#2563eb" : "#6366f1");

  return (
    <div className="flex items-center gap-3 py-3.5 border-b border-white/[0.05] last:border-0">
      <div
        className="w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center text-xs font-bold"
        style={{ backgroundColor: `${hex}22`, border: `1px solid ${hex}33`, color: hex }}
      >
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{label}</p>
        <p className="text-xs text-zinc-500 mt-0.5">{account_name ? `${account_name} · ` : ""}{date}</p>
        {note && <p className="text-xs text-zinc-600 truncate mt-0.5">{note}</p>}
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-sm font-bold ${TYPE_TEXT[type]}`}>
          {SIGN[type]}{formatCurrency(amount)}
        </span>
        <button
          onClick={() => onDelete(id, type)}
          className="p-1.5 text-zinc-700 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
