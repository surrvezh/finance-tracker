"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, LogOut } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { signOut } from "next-auth/react";

export default function SettingsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  // inline edit state
  const [newAccountName, setNewAccountName] = useState("");
  const [newAccountDesc, setNewAccountDesc] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addingAccount, setAddingAccount] = useState(false);
  const [addingCategory, setAddingCategory] = useState(false);

  async function load() {
    const [accRes, catRes] = await Promise.all([
      fetch("/api/accounts").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ]);
    setAccounts(accRes.data ?? []);
    setCategories(catRes.data ?? []);
  }

  useEffect(() => { load(); }, []);

  async function addAccount() {
    if (!newAccountName.trim()) return;
    await fetch("/api/accounts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: newAccountName, description: newAccountDesc }) });
    setNewAccountName(""); setNewAccountDesc(""); setAddingAccount(false); load();
  }

  async function deleteAccount(id: string) {
    await fetch(`/api/accounts/${id}`, { method: "DELETE" });
    load();
  }

  async function addCategory() {
    if (!newCategoryName.trim()) return;
    await fetch("/api/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: newCategoryName }) });
    setNewCategoryName(""); setAddingCategory(false); load();
  }

  async function deleteCategory(id: string) {
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    load();
  }

  async function toggleCategoryBudget(cat: any) {
    await fetch(`/api/categories/${cat.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...cat, budget_enabled: cat.budget_enabled ? 0 : 1 }),
    });
    load();
  }

  async function updateCategoryBudget(cat: any, limit: number) {
    await fetch(`/api/categories/${cat.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...cat, budget_limit: limit }),
    });
    load();
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-24 px-5 pt-12">
      <h1 className="text-xl font-semibold mb-6">Settings</h1>

      {/* Accounts */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-zinc-400">Accounts</h2>
          <button onClick={() => setAddingAccount(true)} className="p-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors">
            <Plus size={14} />
          </button>
        </div>
        <div className="bg-[#141414] rounded-[16px] border border-zinc-800 divide-y divide-zinc-800">
          {accounts.map((acc) => (
            <div key={acc.id} className="flex items-center gap-3 px-4 py-3.5">
              <div className="flex-1">
                <p className="text-sm text-white font-medium">{acc.name}</p>
                {acc.description && <p className="text-xs text-zinc-500">{acc.description}</p>}
              </div>
              <button onClick={() => deleteAccount(acc.id)} className="text-zinc-600 hover:text-red-400 transition-colors p-1">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {addingAccount && (
            <div className="px-4 py-3.5 space-y-2">
              <input autoFocus value={newAccountName} onChange={(e) => setNewAccountName(e.target.value)} placeholder="Account name" className="w-full bg-transparent text-white text-sm outline-none placeholder:text-zinc-600" />
              <input value={newAccountDesc} onChange={(e) => setNewAccountDesc(e.target.value)} placeholder="Description (optional)" className="w-full bg-transparent text-zinc-400 text-xs outline-none placeholder:text-zinc-700" />
              <div className="flex gap-2">
                <button onClick={addAccount} className="text-xs bg-violet-600 text-white px-3 py-1.5 rounded-lg">Add</button>
                <button onClick={() => setAddingAccount(false)} className="text-xs text-zinc-500 px-3 py-1.5">Cancel</button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-zinc-400">Expense Categories</h2>
          <button onClick={() => setAddingCategory(true)} className="p-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors">
            <Plus size={14} />
          </button>
        </div>
        <div className="bg-[#141414] rounded-[16px] border border-zinc-800 divide-y divide-zinc-800">
          {categories.map((cat) => (
            <div key={cat.id} className="px-4 py-3.5">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: cat.color ?? "#6366f1" }} />
                <p className="text-sm text-white font-medium flex-1">{cat.name}</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleCategoryBudget(cat)}
                    className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                      cat.budget_enabled ? "bg-violet-600 text-white" : "bg-zinc-800 text-zinc-500"
                    }`}
                  >
                    Budget
                  </button>
                  <button onClick={() => deleteCategory(cat.id)} className="text-zinc-600 hover:text-red-400 transition-colors p-1">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              {cat.budget_enabled ? (
                <div className="mt-2 ml-6">
                  <input
                    type="number"
                    defaultValue={cat.budget_limit ?? ""}
                    onBlur={(e) => updateCategoryBudget(cat, Number(e.target.value))}
                    placeholder="Monthly limit (₹)"
                    className="bg-zinc-800 text-white text-xs px-3 py-1.5 rounded-lg outline-none w-40 placeholder:text-zinc-600"
                  />
                </div>
              ) : null}
            </div>
          ))}
          {addingCategory && (
            <div className="px-4 py-3.5 space-y-2">
              <input autoFocus value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="Category name" className="w-full bg-transparent text-white text-sm outline-none placeholder:text-zinc-600" />
              <div className="flex gap-2">
                <button onClick={addCategory} className="text-xs bg-violet-600 text-white px-3 py-1.5 rounded-lg">Add</button>
                <button onClick={() => setAddingCategory(false)} className="text-xs text-zinc-500 px-3 py-1.5">Cancel</button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Sign out */}
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="w-full flex items-center justify-center gap-2 text-red-400 text-sm font-medium py-4 bg-[#141414] rounded-[16px] border border-zinc-800"
      >
        <LogOut size={16} />
        Sign Out
      </button>

      <BottomNav />
    </div>
  );
}
