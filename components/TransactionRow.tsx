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

const TYPE_COLOR: Record<TransactionType, string> = {
  income: "text-emerald-400",
  expense: "text-red-400",
  investment: "text-blue-400",
};

export function TransactionRow({ id, type, label, account_name, amount, date, note, color, onDelete }: TransactionRowProps) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-zinc-800/60 last:border-0">
      <div
        className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
        style={{ background: color ?? (type === "income" ? "#10b981" : type === "investment" ? "#3b82f6" : "#6366f1") }}
      >
        {label.slice(0, 2).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{label}</p>
        <p className="text-xs text-zinc-500">{account_name ? `${account_name} · ` : ""}{date}</p>
        {note && <p className="text-xs text-zinc-600 truncate">{note}</p>}
      </div>
      <div className="flex items-center gap-3">
        <span className={`text-sm font-semibold ${TYPE_COLOR[type]}`}>
          {type === "income" ? "+" : "-"}{formatCurrency(amount)}
        </span>
        <button
          onClick={() => onDelete(id, type)}
          className="p-1.5 text-zinc-600 hover:text-red-400 transition-colors"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
