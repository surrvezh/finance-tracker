"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatMonth, prevMonth } from "@/lib/utils";

interface MonthPickerProps {
  month: string;
  onChange: (month: string) => void;
}

export function MonthPicker({ month, onChange }: MonthPickerProps) {
  function nextMonth(m: string): string {
    const [y, mo] = m.split("-").map(Number);
    const d = new Date(y, mo, 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  }

  const isCurrentMonth = month === (() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  })();

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onChange(prevMonth(month))}
        className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
      >
        <ChevronLeft size={18} />
      </button>
      <span className="text-sm font-medium text-white min-w-[80px] text-center">
        {formatMonth(month)}
      </span>
      <button
        onClick={() => onChange(nextMonth(month))}
        disabled={isCurrentMonth}
        className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
