import { createClient, type Client } from "@libsql/client";

let client: Client | null = null;

export function getDb(): Client {
  if (!client) {
    client = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    });
  }
  return client;
}

export async function initDb() {
  const db = getDb();
  await db.batch([
    `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      name TEXT,
      avatar TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      name TEXT NOT NULL,
      description TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS expense_categories (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      name TEXT NOT NULL,
      icon TEXT,
      color TEXT,
      budget_limit REAL,
      budget_enabled INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS income (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      account_id TEXT NOT NULL REFERENCES accounts(id),
      source TEXT NOT NULL,
      amount REAL NOT NULL,
      date TEXT NOT NULL,
      note TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      account_id TEXT NOT NULL REFERENCES accounts(id),
      category_id TEXT NOT NULL REFERENCES expense_categories(id),
      amount REAL NOT NULL,
      date TEXT NOT NULL,
      note TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS investments (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      fund_name TEXT NOT NULL,
      amount REAL NOT NULL,
      date TEXT NOT NULL,
      note TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS ai_insights (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      month TEXT NOT NULL,
      report TEXT NOT NULL,
      generated_at TEXT DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS user_settings (
      user_id TEXT PRIMARY KEY REFERENCES users(id),
      budget_warnings_enabled INTEGER DEFAULT 0
    )`,
  ], "write");
}

// ── Users ──────────────────────────────────────────────────────────────────

export async function upsertUser(id: string, email: string, name: string | null, avatar: string | null) {
  const db = getDb();
  await db.execute({
    sql: `INSERT INTO users (id, email, name, avatar) VALUES (?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET name = excluded.name, avatar = excluded.avatar`,
    args: [id, email, name, avatar],
  });
}

export async function getUserSettings(userId: string) {
  const db = getDb();
  const result = await db.execute({
    sql: `SELECT * FROM user_settings WHERE user_id = ?`,
    args: [userId],
  });
  return result.rows[0] ?? { user_id: userId, budget_warnings_enabled: 0 };
}

export async function updateUserSettings(userId: string, budgetWarningsEnabled: number) {
  const db = getDb();
  await db.execute({
    sql: `INSERT INTO user_settings (user_id, budget_warnings_enabled) VALUES (?, ?)
          ON CONFLICT(user_id) DO UPDATE SET budget_warnings_enabled = excluded.budget_warnings_enabled`,
    args: [userId, budgetWarningsEnabled],
  });
}

// ── Accounts ───────────────────────────────────────────────────────────────

export async function getAccounts(userId: string) {
  const db = getDb();
  const result = await db.execute({
    sql: `SELECT * FROM accounts WHERE user_id = ? ORDER BY created_at ASC`,
    args: [userId],
  });
  return result.rows;
}

export async function createAccount(userId: string, name: string, description: string | null) {
  const db = getDb();
  const id = crypto.randomUUID();
  await db.execute({
    sql: `INSERT INTO accounts (id, user_id, name, description) VALUES (?, ?, ?, ?)`,
    args: [id, userId, name, description],
  });
  return id;
}

export async function updateAccount(id: string, userId: string, name: string, description: string | null) {
  const db = getDb();
  await db.execute({
    sql: `UPDATE accounts SET name = ?, description = ? WHERE id = ? AND user_id = ?`,
    args: [name, description, id, userId],
  });
}

export async function deleteAccount(id: string, userId: string) {
  const db = getDb();
  await db.execute({
    sql: `DELETE FROM accounts WHERE id = ? AND user_id = ?`,
    args: [id, userId],
  });
}

// ── Expense Categories ─────────────────────────────────────────────────────

export async function getCategories(userId: string) {
  const db = getDb();
  const result = await db.execute({
    sql: `SELECT * FROM expense_categories WHERE user_id = ? ORDER BY created_at ASC`,
    args: [userId],
  });
  return result.rows;
}

export async function createCategory(userId: string, name: string, icon: string | null, color: string | null) {
  const db = getDb();
  const id = crypto.randomUUID();
  await db.execute({
    sql: `INSERT INTO expense_categories (id, user_id, name, icon, color) VALUES (?, ?, ?, ?, ?)`,
    args: [id, userId, name, icon, color],
  });
  return id;
}

export async function updateCategory(
  id: string,
  userId: string,
  name: string,
  icon: string | null,
  color: string | null,
  budgetLimit: number | null,
  budgetEnabled: number
) {
  const db = getDb();
  await db.execute({
    sql: `UPDATE expense_categories SET name=?, icon=?, color=?, budget_limit=?, budget_enabled=?
          WHERE id=? AND user_id=?`,
    args: [name, icon, color, budgetLimit, budgetEnabled, id, userId],
  });
}

export async function deleteCategory(id: string, userId: string) {
  const db = getDb();
  await db.execute({
    sql: `DELETE FROM expense_categories WHERE id=? AND user_id=?`,
    args: [id, userId],
  });
}

// ── Income ─────────────────────────────────────────────────────────────────

export async function createIncome(
  userId: string, accountId: string, source: string,
  amount: number, date: string, note: string | null
) {
  const db = getDb();
  const id = crypto.randomUUID();
  await db.execute({
    sql: `INSERT INTO income (id, user_id, account_id, source, amount, date, note) VALUES (?,?,?,?,?,?,?)`,
    args: [id, userId, accountId, source, amount, date, note],
  });
  return id;
}

export async function getIncome(userId: string, month: string) {
  const db = getDb();
  const result = await db.execute({
    sql: `SELECT i.*, a.name as account_name FROM income i
          LEFT JOIN accounts a ON i.account_id = a.id
          WHERE i.user_id=? AND i.date LIKE ?
          ORDER BY i.date DESC`,
    args: [userId, `${month}%`],
  });
  return result.rows;
}

export async function updateIncome(
  id: string, userId: string, accountId: string, source: string,
  amount: number, date: string, note: string | null
) {
  const db = getDb();
  await db.execute({
    sql: `UPDATE income SET account_id=?, source=?, amount=?, date=?, note=? WHERE id=? AND user_id=?`,
    args: [accountId, source, amount, date, note, id, userId],
  });
}

export async function deleteIncome(id: string, userId: string) {
  const db = getDb();
  await db.execute({ sql: `DELETE FROM income WHERE id=? AND user_id=?`, args: [id, userId] });
}

// ── Expenses ───────────────────────────────────────────────────────────────

export async function createExpense(
  userId: string, accountId: string, categoryId: string,
  amount: number, date: string, note: string | null
) {
  const db = getDb();
  const id = crypto.randomUUID();
  await db.execute({
    sql: `INSERT INTO expenses (id, user_id, account_id, category_id, amount, date, note) VALUES (?,?,?,?,?,?,?)`,
    args: [id, userId, accountId, categoryId, amount, date, note],
  });
  return id;
}

export async function getExpenses(userId: string, month: string) {
  const db = getDb();
  const result = await db.execute({
    sql: `SELECT e.*, c.name as category_name, c.color as category_color,
                 a.name as account_name
          FROM expenses e
          LEFT JOIN expense_categories c ON e.category_id = c.id
          LEFT JOIN accounts a ON e.account_id = a.id
          WHERE e.user_id=? AND e.date LIKE ?
          ORDER BY e.date DESC`,
    args: [userId, `${month}%`],
  });
  return result.rows;
}

export async function updateExpense(
  id: string, userId: string, accountId: string, categoryId: string,
  amount: number, date: string, note: string | null
) {
  const db = getDb();
  await db.execute({
    sql: `UPDATE expenses SET account_id=?, category_id=?, amount=?, date=?, note=? WHERE id=? AND user_id=?`,
    args: [accountId, categoryId, amount, date, note, id, userId],
  });
}

export async function deleteExpense(id: string, userId: string) {
  const db = getDb();
  await db.execute({ sql: `DELETE FROM expenses WHERE id=? AND user_id=?`, args: [id, userId] });
}

// ── Investments ────────────────────────────────────────────────────────────

export async function createInvestment(
  userId: string, fundName: string, amount: number, date: string, note: string | null
) {
  const db = getDb();
  const id = crypto.randomUUID();
  await db.execute({
    sql: `INSERT INTO investments (id, user_id, fund_name, amount, date, note) VALUES (?,?,?,?,?,?)`,
    args: [id, userId, fundName, amount, date, note],
  });
  return id;
}

export async function getInvestments(userId: string, month: string) {
  const db = getDb();
  const result = await db.execute({
    sql: `SELECT * FROM investments WHERE user_id=? AND date LIKE ? ORDER BY date DESC`,
    args: [userId, `${month}%`],
  });
  return result.rows;
}

export async function updateInvestment(
  id: string, userId: string, fundName: string, amount: number, date: string, note: string | null
) {
  const db = getDb();
  await db.execute({
    sql: `UPDATE investments SET fund_name=?, amount=?, date=?, note=? WHERE id=? AND user_id=?`,
    args: [fundName, amount, date, note, id, userId],
  });
}

export async function deleteInvestment(id: string, userId: string) {
  const db = getDb();
  await db.execute({ sql: `DELETE FROM investments WHERE id=? AND user_id=?`, args: [id, userId] });
}

// ── Summary ────────────────────────────────────────────────────────────────

export async function getMonthlySummary(userId: string, month: string) {
  const db = getDb();

  const [incomeRows, expenseRows, investmentRows, categoryRows] = await Promise.all([
    db.execute({
      sql: `SELECT source, SUM(amount) as total FROM income WHERE user_id=? AND date LIKE ? GROUP BY source`,
      args: [userId, `${month}%`],
    }),
    db.execute({
      sql: `SELECT e.category_id, c.name, c.color, SUM(e.amount) as total
            FROM expenses e LEFT JOIN expense_categories c ON e.category_id=c.id
            WHERE e.user_id=? AND e.date LIKE ? GROUP BY e.category_id`,
      args: [userId, `${month}%`],
    }),
    db.execute({
      sql: `SELECT SUM(amount) as total FROM investments WHERE user_id=? AND date LIKE ?`,
      args: [userId, `${month}%`],
    }),
    db.execute({
      sql: `SELECT * FROM expense_categories WHERE user_id=?`,
      args: [userId],
    }),
  ]);

  const totalIncome = (incomeRows.rows as any[]).reduce((s, r) => s + Number(r.total), 0);
  const totalExpenses = (expenseRows.rows as any[]).reduce((s, r) => s + Number(r.total), 0);
  const totalInvested = Number((investmentRows.rows[0] as any)?.total ?? 0);

  return {
    totalIncome,
    totalExpenses,
    netSaved: totalIncome - totalExpenses - totalInvested,
    totalInvested,
    expensesByCategory: expenseRows.rows,
    incomeBySource: incomeRows.rows,
    categories: categoryRows.rows,
  };
}

export async function getLast6MonthsSummary(userId: string) {
  const db = getDb();
  const months: string[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }
  const results = await Promise.all(
    months.map(async (month) => {
      const [inc, exp] = await Promise.all([
        db.execute({ sql: `SELECT SUM(amount) as total FROM income WHERE user_id=? AND date LIKE ?`, args: [userId, `${month}%`] }),
        db.execute({ sql: `SELECT SUM(amount) as total FROM expenses WHERE user_id=? AND date LIKE ?`, args: [userId, `${month}%`] }),
      ]);
      return {
        month,
        income: Number((inc.rows[0] as any)?.total ?? 0),
        expenses: Number((exp.rows[0] as any)?.total ?? 0),
      };
    })
  );
  return results;
}

// ── AI Insights ────────────────────────────────────────────────────────────

export async function getInsight(userId: string, month: string) {
  const db = getDb();
  const result = await db.execute({
    sql: `SELECT * FROM ai_insights WHERE user_id=? AND month=? ORDER BY generated_at DESC LIMIT 1`,
    args: [userId, month],
  });
  return result.rows[0] ?? null;
}

export async function upsertInsight(userId: string, month: string, report: string) {
  const db = getDb();
  const id = crypto.randomUUID();
  await db.execute({
    sql: `INSERT INTO ai_insights (id, user_id, month, report) VALUES (?,?,?,?)
          ON CONFLICT DO NOTHING`,
    args: [id, userId, month, report],
  });
  // If conflict (month exists), update instead
  await db.execute({
    sql: `UPDATE ai_insights SET report=?, generated_at=datetime('now') WHERE user_id=? AND month=?`,
    args: [report, userId, month],
  });
}
