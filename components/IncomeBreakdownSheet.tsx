"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { formatCurrency } from "@/lib/utils";

interface IncomeBreakdownSheetProps {
  open: boolean;
  onClose: () => void;
  incomeByAccount: { account_name: string; total: number }[];
  incomeBySource: { source: string; total: number }[];
  totalIncome: number;
}

const SOURCE_LABELS: Record<string, string> = {
  salary: "Salary",
  brand_deal: "Brand Deals",
  youtube: "YouTube",
  other: "Other",
};

const SOURCE_COLORS: Record<string, string> = {
  salary: "#10b981",
  brand_deal: "#6366f1",
  youtube: "#f59e0b",
  other: "#71717a",
};

const ACCOUNT_COLORS = ["#8b5cf6", "#06b6d4", "#ec4899", "#f97316"];

export function IncomeBreakdownSheet({
  open,
  onClose,
  incomeByAccount,
  incomeBySource,
  totalIncome,
}: IncomeBreakdownSheetProps) {
  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="bottom" className="bg-[#141414] border-zinc-800 rounded-t-[20px] px-5 pb-8">
        <SheetHeader className="mb-5">
          <SheetTitle className="text-white text-base font-semibold text-left">
            Income Breakdown
          </SheetTitle>
        </SheetHeader>

        <div className="text-xs text-zinc-500 font-medium mb-2">By Account</div>
        <div className="bg-[#1a1a1a] rounded-[12px] divide-y divide-zinc-800 mb-5">
          {incomeByAccount.length === 0 ? (
            <p className="text-zinc-600 text-sm px-4 py-3">No income this period</p>
          ) : (
            incomeByAccount.map((item, i) => (
              <div key={item.account_name} className="flex items-center gap-3 px-4 py-3">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background: ACCOUNT_COLORS[i % ACCOUNT_COLORS.length] }}
                />
                <span className="flex-1 text-sm text-zinc-300">{item.account_name}</span>
                <span className="text-sm font-semibold text-white">{formatCurrency(item.total)}</span>
              </div>
            ))
          )}
        </div>

        <div className="text-xs text-zinc-500 font-medium mb-2">By Source</div>
        <div className="bg-[#1a1a1a] rounded-[12px] divide-y divide-zinc-800">
          {incomeBySource.length === 0 ? (
            <p className="text-zinc-600 text-sm px-4 py-3">No income this period</p>
          ) : (
            incomeBySource.map((item) => (
              <div key={item.source} className="flex items-center gap-3 px-4 py-3">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background: SOURCE_COLORS[item.source] ?? "#71717a" }}
                />
                <span className="flex-1 text-sm text-zinc-300">
                  {SOURCE_LABELS[item.source] ?? item.source}
                </span>
                <span className="text-sm font-semibold text-white">{formatCurrency(item.total)}</span>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-between items-center mt-4 pt-4 border-t border-zinc-800">
          <span className="text-sm text-zinc-400">Total Income</span>
          <span className="text-base font-bold text-emerald-400">{formatCurrency(totalIncome)}</span>
        </div>
      </SheetContent>
    </Sheet>
  );
}
