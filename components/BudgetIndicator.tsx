interface BudgetIndicatorProps {
  spent: number;
  limit: number;
}

export function BudgetIndicator({ spent, limit }: BudgetIndicatorProps) {
  const pct = limit > 0 ? (spent / limit) * 100 : 0;
  if (pct < 80) return null;
  const color = pct >= 100 ? "bg-red-500" : "bg-amber-500";
  return <span className={`inline-block w-2 h-2 rounded-full ${color} ml-1`} />;
}
