// src/routes/reports/+page.server.js
import { getDb } from '$lib/server/db';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export function load({ url }) {
  const db = getDb();

  // Get the month from query parameter or default to current month
  let month = url.searchParams.get('month');
  if (!month) {
    const now = new Date();
    month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  // Validate month format
  if (!/^\d{4}-\d{2}$/.test(month)) {
    throw error(400, 'Invalid month format. Use YYYY-MM.');
  }

  // Monthly summary with COALESCE to prevent null values
  const summary = db.prepare(`
    SELECT
      COALESCE(COUNT(*), 0) AS total_sales,
      COALESCE(SUM(quantity * selling_price_at_time), 0) AS total_revenue,
      COALESCE(SUM(quantity * profit_at_time), 0) AS total_profit
    FROM sales
    WHERE strftime('%Y-%m', sale_date) = ?
  `).get(month);

  // Item‑wise breakdown (also safe because GROUP BY only returns rows if data exists)
  const items = db.prepare(`
    SELECT
      products.name,
      COALESCE(SUM(sales.quantity), 0) AS quantity_sold,
      COALESCE(SUM(sales.quantity * sales.selling_price_at_time), 0) AS revenue,
      COALESCE(SUM(sales.quantity * sales.profit_at_time), 0) AS profit
    FROM sales
    JOIN products ON sales.product_id = products.id
    WHERE strftime('%Y-%m', sales.sale_date) = ?
    GROUP BY products.id
    ORDER BY profit DESC
  `).all(month);

  // Available months list
  const availableMonths = db.prepare(`
    SELECT DISTINCT strftime('%Y-%m', sale_date) AS month
    FROM sales
    ORDER BY month DESC
  `).all().map(r => r.month);

  return {
    month,
    summary,                     // Always safe numbers now
    items,
    availableMonths
  };
}