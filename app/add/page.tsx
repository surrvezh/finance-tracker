"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import type { TransactionType } from "@/types";

const TYPE_OPTIONS: { type: TransactionType; label: string; icon: typeof ArrowUpRight; color: string; bg: string }[] = [
  { type: "income", label: "Income", icon: ArrowUpRight, color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20" },
  { type: "expense", label: "Expense", icon: ArrowDownRight, color: "text-red-400", bg: "bg-red-400/10 border-red-400/20" },
  { type: "investment", label: "Investment", icon: TrendingUp, color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20" },
];

export default function AddPage() {
  const router = useRouter();
  const [step, setStep] = useState<"type" | "form">("type");
  const [txType, setTxType] = useState<TransactionType>("expense");
  const [accounts, setAccounts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Form state
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
    let body: any = {};

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

  if (step === "type") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pb-24 px-5 pt-12">
        <h1 className="text-xl font-semibold mb-8">Add Transaction</h1>
        <div className="space-y-3">
          {TYPE_OPTIONS.map(({ type, label, icon: Icon, color, bg }) => (
            <button
              key={type}
              onClick={() => { setTxType(type); setStep("form"); }}
              className={`w-full flex items-center gap-4 p-5 rounded-[16px] border ${bg} text-left transition-all active:scale-98`}
            >
              <div className={`p-2.5 rounded-xl bg-zinc-900`}>
                <Icon size={22} className={color} />
              </div>
              <span className="text-white font-medium text-lg">{label}</span>
            </button>
          ))}
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-24 px-5 pt-12">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => setStep("type")} className="p-2 rounded-full hover:bg-zinc-800 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-semibold capitalize">Add {txType}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount */}
        <div className="bg-[#141414] rounded-[16px] p-5 border border-zinc-800">
          <label className="text-xs text-zinc-500 font-medium block mb-2">Amount (₹)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            required
            className="w-full bg-transparent text-3xl font-semibold text-white placeholder:text-zinc-700 outline-none"
          />
        </div>

        {/* Date */}
        <div className="bg-[#141414] rounded-[16px] p-4 border border-zinc-800">
          <label className="text-xs text-zinc-500 font-medium block mb-2">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full bg-transparent text-white outline-none text-sm [color-scheme:dark]"
          />
        </div>

        {/* Type-specific fields */}
        {txType === "income" && (
          <>
            <div className="bg-[#141414] rounded-[16px] p-4 border border-zinc-800">
              <label className="text-xs text-zinc-500 font-medium block mb-2">Source</label>
              <select value={source} onChange={(e) => setSource(e.target.value)} className="w-full bg-transparent text-white outline-none text-sm">
                <option value="salary" className="bg-zinc-900">Salary</option>
                <option value="brand_deal" className="bg-zinc-900">Brand Deal</option>
                <option value="youtube" className="bg-zinc-900">YouTube</option>
                <option value="other" className="bg-zinc-900">Other</option>
              </select>
            </div>
            {source === "brand_deal" && (
              <div className="bg-[#141414] rounded-[16px] p-4 border border-zinc-800">
                <label className="text-xs text-zinc-500 font-medium block mb-2">Brand Name</label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="e.g. boAt, Mamaearth..."
                  className="w-full bg-transparent text-white placeholder:text-zinc-600 outline-none text-sm"
                />
              </div>
            )}
            <div className="bg-[#141414] rounded-[16px] p-4 border border-zinc-800">
              <label className="text-xs text-zinc-500 font-medium block mb-2">Account</label>
              <select value={accountId} onChange={(e) => setAccountId(e.target.value)} className="w-full bg-transparent text-white outline-none text-sm">
                {accounts.map((a) => <option key={a.id} value={a.id} className="bg-zinc-900">{a.name}</option>)}
              </select>
            </div>
          </>
        )}

        {txType === "expense" && (
          <>
            <div className="bg-[#141414] rounded-[16px] p-4 border border-zinc-800">
              <label className="text-xs text-zinc-500 font-medium block mb-2">Category</label>
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full bg-transparent text-white outline-none text-sm">
                {categories.map((c) => <option key={c.id} value={c.id} className="bg-zinc-900">{c.name}</option>)}
              </select>
            </div>
            <div className="bg-[#141414] rounded-[16px] p-4 border border-zinc-800">
              <label className="text-xs text-zinc-500 font-medium block mb-2">Account</label>
              <select value={accountId} onChange={(e) => setAccountId(e.target.value)} className="w-full bg-transparent text-white outline-none text-sm">
                {accounts.map((a) => <option key={a.id} value={a.id} className="bg-zinc-900">{a.name}</option>)}
              </select>
            </div>
          </>
        )}

        {txType === "investment" && (
          <div className="bg-[#141414] rounded-[16px] p-4 border border-zinc-800">
            <label className="text-xs text-zinc-500 font-medium block mb-2">Fund / Asset Name</label>
            <input
              type="text"
              value={fundName}
              onChange={(e) => setFundName(e.target.value)}
              placeholder="e.g. Nifty 50 Index Fund"
              required
              className="w-full bg-transparent text-white placeholder:text-zinc-600 outline-none text-sm"
            />
          </div>
        )}

        {/* Note */}
        <div className="bg-[#141414] rounded-[16px] p-4 border border-zinc-800">
          <label className="text-xs text-zinc-500 font-medium block mb-2">Note (optional)</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note..."
            className="w-full bg-transparent text-white placeholder:text-zinc-600 outline-none text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold py-4 rounded-[16px] transition-colors disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
      <BottomNav />
    </div>
  );
}
