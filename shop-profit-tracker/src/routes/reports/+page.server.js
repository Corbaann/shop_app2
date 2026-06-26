import { getDb } from '$lib/server/db';
import { error } from '@sveltejs/kit';

export function load({ url }) {
  const db = getDb();
  let month = url.searchParams.get('month');
  if (!month) {
    const now = new Date();
    month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  if (!/^\d{4}-\d{2}$/.test(month)) {
    throw error(400, 'Invalid month format.');
  }

  const summary = db.prepare(`
    SELECT COUNT(*) AS total_sales,
           SUM(quantity * selling_price_at_time) AS total_revenue,
           SUM(quantity * profit_at_time) AS total_profit
    FROM sales WHERE strftime('%Y-%m', sale_date) = ?
  `).get(month);

  const items = db.prepare(`
    SELECT products.name,
           SUM(sales.quantity) AS quantity_sold,
           SUM(sales.quantity * sales.selling_price_at_time) AS revenue,
           SUM(sales.quantity * sales.profit_at_time) AS profit
    FROM sales
    JOIN products ON sales.product_id = products.id
    WHERE strftime('%Y-%m', sales.sale_date) = ?
    GROUP BY products.id
    ORDER BY profit DESC
  `).all(month);

  const availableMonths = db.prepare(`
    SELECT DISTINCT strftime('%Y-%m', sale_date) AS month
    FROM sales ORDER BY month DESC
  `).all().map(r => r.month);

  return {
    month,
    summary: summary || { total_sales: 0, total_revenue: 0, total_profit: 0 },
    items: items || [],
    availableMonths
  };
}