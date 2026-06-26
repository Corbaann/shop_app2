import { getDb } from '$lib/server/db';
import { fail } from '@sveltejs/kit';

export function load() {
  const db = getDb();

  const products = db.prepare('SELECT id, name, selling_price FROM products WHERE is_active = 1 ORDER BY name').all();

  const todaySales = db.prepare(`
    SELECT sales.id, products.name, sales.quantity,
           sales.selling_price_at_time, sales.profit_at_time,
           (sales.quantity * sales.profit_at_time) AS total_profit,
           sales.sale_time
    FROM sales
    JOIN products ON sales.product_id = products.id
    WHERE sales.sale_date = date('now')
    ORDER BY sales.sale_time DESC
  `).all();

  const todayTotalProfit = todaySales.reduce((sum, s) => sum + s.total_profit, 0);

  return { products, todaySales, todayTotalProfit };
}

export const actions = {
  record: async ({ request }) => {
    const db = getDb();
    const data = await request.formData();
    const productId = data.get('product_id');
    const quantity = parseInt(data.get('quantity') || '1', 10);

    if (!productId || isNaN(quantity) || quantity < 1) {
      return fail(400, { error: 'Please select a product and a valid quantity.' });
    }

    const product = db.prepare('SELECT selling_price, cost_price FROM products WHERE id = ?').get(productId);
    if (!product) {
      return fail(400, { error: 'Product not found.' });
    }

    const profitPerUnit = product.selling_price - product.cost_price;
    db.prepare('INSERT INTO sales (product_id, quantity, selling_price_at_time, profit_at_time) VALUES (?, ?, ?, ?)').run(productId, quantity, product.selling_price, profitPerUnit);

    return { success: true };
  }
};