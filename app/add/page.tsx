"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, TrendingUp, ArrowUpRight, ArrowDownRight, ChevronRight } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import type { TransactionType } from "@/types";

const TYPE_OPTIONS = [
  {
    type: "income" as TransactionType,
    label: "Income",
    desc: "Salary, brand deals, YouTube...",
    icon: ArrowUpRight,
    color: "text-emerald-400",
    gradient: "from-emerald-500/[0.1] to-transparent",
    border: "border-emerald-500/[0.2]",
    iconBg: "bg-emerald-500/[0.15]",
  },
  {
    type: "expense" as TransactionType,
    label: "Expense",
    desc: "Food, shopping, bills...",
    icon: ArrowDownRight,
    color: "text-red-400",
    gradient: "from-red-500/[0.1] to-transparent",
    border: "border-red-500/[0.2]",
    iconBg: "bg-red-500/[0.15]",
  },
  {
    type: "investment" as TransactionType,
    label: "Investment",
    desc: "Mutual funds, stocks, crypto...",
    icon: TrendingUp,
    color: "text-blue-400",
    gradient: "from-blue-500/[0.1] to-transparent",
    border: "border-blue-500/[0.2]",
    iconBg: "bg-blue-500/[0.15]",
  },
];

export default function AddPage() {
  const router = useRouter();
  const [step, setStep] = useState<"type" | "form">("type");
  const [txType, setTxType] = useState<TransactionType>("expense");
  const [accounts, setAccounts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState("");
  const [accountId, setAccountId] = useState("");
  const [source, setSource] = useState("salary");
  const [brandName, setBrandName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [fundName, setFundName] = useState("");

  useEffect(() => {
    Promise.all([fetch("/api/accounts").then((r) => r.json()), fetch("/api/categories").then((r) => r.json())]).then(
      ([acc, cat]) => {
        setAccounts(acc.data ?? []);
        setCategories(cat.data ?? []);
        if (acc.data?.[0]) setAccountId(acc.data[0].id);
        if (cat.data?.[0]) setCategoryId(cat.data[0].id);
      }
    );
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;
    setLoading(true);

    let url = "";
    let body: Record<string, unknown> = {};

    if (txType === "income") {
      url = "/api/income";
      const incomeNote = source === "brand_deal" && brandName.trim()
        ? `${brandName.trim()}${note ? ` — ${note}` : ""}`
        : note;
      body = { account_id: accountId, source, amount: Number(amount), date, note: incomeNote };
    } else if (txType === "expense") {
      url = "/api/expenses";
      body = { account_id: accountId, category_id: categoryId, amount: Number(amount), date, note };
    } else {
      url = "/api/investments";
      body = { fund_name: fundName, amount: Number(amount), date, note };
    }

    await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setLoading(false);
    router.push("/");
  }

  const activeType = TYPE_OPTIONS.find((t) => t.type === txType);

  if (step === "type") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pb-24 px-5 pt-14">
        <h1 className="text-2xl font-bold text-white tracking-tight mb-1">Add Transaction</h1>
        <p className="text-sm text-zinc-500 mb-8">What would you like to record?</p>
        <div className="space-y-3">
          {TYPE_OPTIONS.map(({ type, label, desc, icon: Icon, color, gradient, border, iconBg }) => (
            <button
              key={type}
              type="button"
              onClick={() => { setTxType(type); setStep("form"); }}
              className={`w-full flex items-center gap-4 p-5 rounded-2xl border bg-gradient-to-r ${gradient} ${border} text-left transition-all active:scale-[0.98]`}
            >
              <div className={`p-3 rounded-2xl ${iconBg}`}>
                <Icon size={22} className={color} />
              </div>
              <div className="flex-1">
                <span className="text-white font-semibold text-base block">{label}</span>
                <span className="text-xs text-zinc-500">{desc}</span>
              </div>
              <ChevronRight size={18} className="text-zinc-600" />
            </button>
          ))}
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-24 px-5 pt-14">
      <div className="flex items-center gap-3 mb-8">
        <button type="button" onClick={() => setStep("type")} className="p-2 rounded-full hover:bg-white/[0.07] transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Add {txType}</h1>
          {activeType && <p className="text-xs text-zinc-500">{activeType.desc}</p>}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Amount — hero input */}
        <div className="bg-[#111111] rounded-2xl px-5 pt-4 pb-5 border border-white/[0.07]">
          <label className="text-xs text-zinc-500 font-medium uppercase tracking-wider block mb-3">Amount</label>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-zinc-500">₹</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              required
              inputMode="decimal"
              className="w-full bg-transparent text-4xl font-bold text-white placeholder:text-zinc-700 outline-none tracking-tight"
            />
          </div>
        </div>

        {/* Date */}
        <div className="bg-[#111111] rounded-2xl p-4 border border-white/[0.07]">
          <label className="text-xs text-zinc-500 font-medium uppercase tracking-wider block mb-2">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full bg-transparent text-white outline-none text-sm [color-scheme:dark]"
          />
        </div>

        {/* Income-specific */}
        {txType === "income" && (
          <>
            <div className="bg-[#111111] rounded-2xl p-4 border border-white/[0.07]">
              <label className="text-xs text-zinc-500 font-medium uppercase tracking-wider block mb-2">Source</label>
              <select value={source} onChange={(e) => setSource(e.target.value)} className="w-full bg-transparent text-white outline-none text-sm">
                <option value="salary" className="bg-zinc-900">Salary</option>
                <option value="brand_deal" className="bg-zinc-900">Brand Deal</option>
                <option value="youtube" className="bg-zinc-900">YouTube</option>
                <option value="other" className="bg-zinc-900">Other</option>
              </select>
            </div>
            {source === "brand_deal" && (
              <div className="bg-[#111111] rounded-2xl p-4 border border-white/[0.07]">
                <label className="text-xs text-zinc-500 font-medium uppercase tracking-wider block mb-2">Brand Name</label>
                <input type="text" value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="e.g. boAt, Mamaearth..." className="w-full bg-transparent text-white placeholder:text-zinc-600 outline-none text-sm" />
              </div>
            )}
            <div className="bg-[#111111] rounded-2xl p-4 border border-white/[0.07]">
              <label className="text-xs text-zinc-500 font-medium uppercase tracking-wider block mb-2">Account</label>
              <select value={accountId} onChange={(e) => setAccountId(e.target.value)} className="w-full bg-transparent text-white outline-none text-sm">
                {accounts.map((a) => <option key={a.id} value={a.id} className="bg-zinc-900">{a.name}</option>)}
              </select>
            </div>
          </>
        )}

        {/* Expense-specific */}
        {txType === "expense" && (
          <>
            <div className="bg-[#111111] rounded-2xl p-4 border border-white/[0.07]">
              <label className="text-xs text-zinc-500 font-medium uppercase tracking-wider block mb-2">Category</label>
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full bg-transparent text-white outline-none text-sm">
                {categories.map((c) => <option key={c.id} value={c.id} className="bg-zinc-900">{c.name}</option>)}
              </select>
            </div>
            <div className="bg-[#111111] rounded-2xl p-4 border border-white/[0.07]">
              <label className="text-xs text-zinc-500 font-medium uppercase tracking-wider block mb-2">Account</label>
              <select value={accountId} onChange={(e) => setAccountId(e.target.value)} className="w-full bg-transparent text-white outline-none text-sm">
                {accounts.map((a) => <option key={a.id} value={a.id} className="bg-zinc-900">{a.name}</option>)}
              </select>
            </div>
          </>
        )}

        {/* Investment-specific */}
        {txType === "investment" && (
          <div className="bg-[#111111] rounded-2xl p-4 border border-white/[0.07]">
            <label className="text-xs text-zinc-500 font-medium uppercase tracking-wider block mb-2">Fund / Asset</label>
            <input type="text" value={fundName} onChange={(e) => setFundName(e.target.value)} placeholder="e.g. Nifty 50 Index Fund" required className="w-full bg-transparent text-white placeholder:text-zinc-600 outline-none text-sm" />
          </div>
        )}

        {/* Note */}
        <div className="bg-[#111111] rounded-2xl p-4 border border-white/[0.07]">
          <label className="text-xs text-zinc-500 font-medium uppercase tracking-wider block mb-2">Note (optional)</label>
          <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note..." className="w-full bg-transparent text-white placeholder:text-zinc-600 outline-none text-sm" />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-4 rounded-2xl transition-colors disabled:opacity-50 text-base tracking-tight mt-2"
        >
          {loading ? "Saving..." : "Save Transaction"}
        </button>
      </form>
      <BottomNav />
    </div>
  );
}
