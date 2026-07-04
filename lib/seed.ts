import { getDb } from "./db";

const DEFAULT_ACCOUNTS = [
  { name: "Office Account", description: "Salary income" },
  { name: "Content Account", description: "Brand deals & YouTube" },
];

const DEFAULT_CATEGORIES = [
  { name: "Rent", icon: "home", color: "#6366f1" },
  { name: "Food", icon: "utensils", color: "#f59e0b" },
  { name: "Parents", icon: "heart", color: "#ec4899" },
  { name: "Sister Fees", icon: "graduation-cap", color: "#8b5cf6" },
  { name: "Snacks", icon: "coffee", color: "#f97316" },
  { name: "Travel", icon: "map-pin", color: "#06b6d4" },
  { name: "Content Supplies", icon: "video", color: "#10b981" },
  { name: "Cravings / Impulse Buys", icon: "zap", color: "#ef4444" },
];

export async function seedUserDefaults(userId: string) {
  const db = getDb();

  // Check if already seeded
  const existing = await db.execute({
    sql: `SELECT id FROM accounts WHERE user_id=? LIMIT 1`,
    args: [userId],
  });
  if (existing.rows.length > 0) return;

  // Seed accounts
  for (const acc of DEFAULT_ACCOUNTS) {
    await db.execute({
      sql: `INSERT INTO accounts (id, user_id, name, description) VALUES (?,?,?,?)`,
      args: [crypto.randomUUID(), userId, acc.name, acc.description],
    });
  }

  // Seed categories
  for (const cat of DEFAULT_CATEGORIES) {
    await db.execute({
      sql: `INSERT INTO expense_categories (id, user_id, name, icon, color) VALUES (?,?,?,?,?)`,
      args: [crypto.randomUUID(), userId, cat.name, cat.icon, cat.color],
    });
  }
}
