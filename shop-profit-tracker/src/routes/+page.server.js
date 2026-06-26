import { getDb } from '$lib/server/db';

export function load() {
  const db = getDb();
  const todayTotalProfit = db.prepare(`
    SELECT COALESCE(SUM(quantity * profit_at_time), 0) AS total
    FROM sales WHERE sale_date = date('now')
  `).get().total;

  return { todayTotalProfit };
}