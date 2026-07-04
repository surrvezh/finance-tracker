import Groq from "groq-sdk";
import { getMonthlySummary } from "./db";
import { prevMonth } from "./utils";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateInsightReport(userId: string, month: string): Promise<string> {
  const prev1 = prevMonth(month);
  const prev2 = prevMonth(prev1);
  const prev3 = prevMonth(prev2);

  const [current, m1, m2, m3] = await Promise.all([
    getMonthlySummary(userId, month),
    getMonthlySummary(userId, prev1),
    getMonthlySummary(userId, prev2),
    getMonthlySummary(userId, prev3),
  ]);

  const formatSummary = (m: typeof current, label: string) => `
**${label}**
- Total Income: ₹${m.totalIncome.toLocaleString("en-IN")}
- Total Expenses: ₹${m.totalExpenses.toLocaleString("en-IN")}
- Net Saved: ₹${m.netSaved.toLocaleString("en-IN")}
- Invested: ₹${m.totalInvested.toLocaleString("en-IN")}
- Expenses by category: ${(m.expensesByCategory as any[]).map((c: any) => `${c.name}: ₹${Number(c.total).toLocaleString("en-IN")}`).join(", ") || "none"}
- Income sources: ${(m.incomeBySource as any[]).map((s: any) => `${s.source}: ₹${Number(s.total).toLocaleString("en-IN")}`).join(", ") || "none"}
`;

  const prompt = `You are a personal finance advisor analyzing spending data for a content creator in India.

Here is their financial data for the past 4 months:

${formatSummary(m3, "3 months ago")}
${formatSummary(m2, "2 months ago")}
${formatSummary(m1, "Last month")}
${formatSummary(current, "This month (current)")}

Please provide:
1. **Key Observations** - What stands out this month vs previous months? Flag any categories where spending increased significantly (>20%).
2. **Saving Rate Trend** - How is their saving rate trending?
3. **Investment Consistency** - Are they investing regularly?
4. **3 Actionable Suggestions** - Specific, practical tips to improve their finances next month.

Keep it concise, friendly, and specific to the numbers. Format in clean markdown with headers.`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.4,
    max_tokens: 800,
  });

  return completion.choices[0]?.message?.content ?? "Could not generate insights at this time.";
}
