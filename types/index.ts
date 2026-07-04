export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  created_at: string;
}

export interface Account {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface ExpenseCategory {
  id: string;
  user_id: string;
  name: string;
  icon: string | null;
  color: string | null;
  budget_limit: number | null;
  budget_enabled: number; // 0 | 1
  created_at: string;
}

export type IncomeSource = "salary" | "brand_deal" | "youtube" | "other";

export interface Income {
  id: string;
  user_id: string;
  account_id: string;
  source: IncomeSource;
  amount: number;
  date: string; // ISO date "YYYY-MM-DD"
  note: string | null;
  created_at: string;
}

export interface Expense {
  id: string;
  user_id: string;
  account_id: string;
  category_id: string;
  amount: number;
  date: string;
  note: string | null;
  created_at: string;
}

export interface Investment {
  id: string;
  user_id: string;
  fund_name: string;
  amount: number;
  date: string;
  note: string | null;
  created_at: string;
}

export interface AiInsight {
  id: string;
  user_id: string;
  month: string; // "YYYY-MM"
  report: string; // markdown
  generated_at: string;
}

export interface MonthlySummary {
  totalIncome: number;
  totalExpenses: number;
  netSaved: number;
  totalInvested: number;
  expensesByCategory: { category_id: string; name: string; color: string | null; total: number }[];
  incomeBySource: { source: IncomeSource; total: number }[];
}

export type TransactionType = "income" | "expense" | "investment";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string;
  note: string | null;
  label: string;      // category name, source label, or fund name
  account_name: string | null;
  color: string | null;
}
