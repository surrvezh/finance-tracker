"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, LogOut } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { ThemeToggle } from "@/components/theme-toggle";
import { signOut } from "next-auth/react";

export default function SettingsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
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

  const sectionHeader = "text-xs font-semibold text-zinc-500 uppercase tracking-wider";
  const listCard = "bg-white dark:bg-[#111111] rounded-2xl border border-zinc-200 dark:border-white/[0.07] divide-y divide-zinc-100 dark:divide-white/[0.05] overflow-hidden";
  const deleteBtn = "text-zinc-300 dark:text-zinc-700 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10";

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0a0a0a] pb-24 px-5 pt-14">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight mb-8">Settings</h1>

      {/* Appearance */}
      <section className="mb-6">
        <p className={`${sectionHeader} mb-3 px-1`}>Appearance</p>
        <div className="bg-white dark:bg-[#111111] rounded-2xl border border-zinc-200 dark:border-white/[0.07] p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-white">Theme</p>
            <p className="text-xs text-zinc-500 mt-0.5">Auto follows your system setting</p>
          </div>
          <ThemeToggle />
        </div>
      </section>

      {/* Accounts */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className={sectionHeader}>Accounts</h2>
          <button type="button" onClick={() => setAddingAccount(true)} className="flex items-center gap-1.5 text-xs text-violet-600 dark:text-violet-400 font-medium">
            <Plus size={14} />Add
          </button>
        </div>
        <div className={listCard}>
          {accounts.map((acc) => (
            <div key={acc.id} className="flex items-center gap-3 px-4 py-4">
              <div className="flex-1">
                <p className="text-sm text-zinc-900 dark:text-white font-semibold">{acc.name}</p>
                {acc.description && <p className="text-xs text-zinc-500 mt-0.5">{acc.description}</p>}
              </div>
              <button type="button" onClick={() => deleteAccount(acc.id)} className={deleteBtn}><Trash2 size={14} /></button>
            </div>
          ))}
          {addingAccount && (
            <div className="px-4 py-4 space-y-2 bg-zinc-50 dark:bg-white/[0.03]">
              <input autoFocus value={newAccountName} onChange={(e) => setNewAccountName(e.target.value)} placeholder="Account name" className="w-full bg-transparent text-zinc-900 dark:text-white text-sm outline-none placeholder:text-zinc-400" />
              <input value={newAccountDesc} onChange={(e) => setNewAccountDesc(e.target.value)} placeholder="Description (optional)" className="w-full bg-transparent text-zinc-500 text-xs outline-none placeholder:text-zinc-400" />
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={addAccount} className="text-xs bg-violet-600 text-white px-4 py-2 rounded-xl font-medium">Add</button>
                <button type="button" onClick={() => setAddingAccount(false)} className="text-xs text-zinc-500 px-3 py-2">Cancel</button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className={sectionHeader}>Expense Categories</h2>
          <button type="button" onClick={() => setAddingCategory(true)} className="flex items-center gap-1.5 text-xs text-violet-600 dark:text-violet-400 font-medium">
            <Plus size={14} />Add
          </button>
        </div>
        <div className={listCard}>
          {categories.map((cat) => (
            <div key={cat.id} className="px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: cat.color ?? "#6366f1" }} />
                <p className="text-sm text-zinc-900 dark:text-white font-semibold flex-1">{cat.name}</p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleCategoryBudget(cat)}
                    className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all ${
                      cat.budget_enabled ? "bg-violet-600 text-white" : "bg-zinc-100 dark:bg-white/[0.07] text-zinc-500"
                    }`}
                  >
                    Budget
                  </button>
                  <button type="button" onClick={() => deleteCategory(cat.id)} className={deleteBtn}><Trash2 size={14} /></button>
                </div>
              </div>
              {cat.budget_enabled ? (
                <div className="mt-3 ml-6">
                  <input
                    type="number"
                    defaultValue={cat.budget_limit ?? ""}
                    onBlur={(e) => updateCategoryBudget(cat, Number(e.target.value))}
                    placeholder="Monthly limit (₹)"
                    className="bg-zinc-100 dark:bg-white/[0.07] text-zinc-900 dark:text-white text-xs px-3 py-2 rounded-xl outline-none w-44 placeholder:text-zinc-400"
                  />
                </div>
              ) : null}
            </div>
          ))}
          {addingCategory && (
            <div className="px-4 py-4 space-y-2 bg-zinc-50 dark:bg-white/[0.03]">
              <input autoFocus value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="Category name" className="w-full bg-transparent text-zinc-900 dark:text-white text-sm outline-none placeholder:text-zinc-400" />
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={addCategory} className="text-xs bg-violet-600 text-white px-4 py-2 rounded-xl font-medium">Add</button>
                <button type="button" onClick={() => setAddingCategory(false)} className="text-xs text-zinc-500 px-3 py-2">Cancel</button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Sign out */}
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="w-full flex items-center justify-center gap-2 text-red-600 dark:text-red-400 text-sm font-semibold py-4 bg-red-50 dark:bg-red-500/[0.07] rounded-2xl border border-red-200 dark:border-red-500/[0.15] transition-colors hover:bg-red-100 dark:hover:bg-red-500/[0.12]"
      >
        <LogOut size={16} />
        Sign Out
      </button>

      <BottomNav />
    </div>
  );
}
