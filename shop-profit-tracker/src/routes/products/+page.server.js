import { getDb } from '$lib/server/db';
import { fail } from '@sveltejs/kit';

export function load() {
  const db = getDb();
  const products = db.prepare('SELECT * FROM products ORDER BY name').all();
  return { products };
}

export const actions = {
  add: async ({ request }) => {
    const db = getDb();
    const data = await request.formData();
    const name = data.get('name')?.toString().trim();
    const selling_price = data.get('selling_price')?.toString().trim();
    const cost_price = data.get('cost_price')?.toString().trim();

    if (!name || !selling_price || !cost_price) {
      return fail(400, { error: 'All fields are required.' });
    }

    const selling = parseFloat(selling_price);
    const cost = parseFloat(cost_price);
    if (isNaN(selling) || isNaN(cost) || selling < 0 || cost < 0) {
      return fail(400, { error: 'Prices must be valid non‑negative numbers.' });
    }

    try {
      db.prepare('INSERT INTO products (name, selling_price, cost_price) VALUES (?, ?, ?)').run(name, selling, cost);
    } catch (err) {
      if (err.message.includes('UNIQUE')) {
        return fail(400, { error: `Product "${name}" already exists.` });
      }
      return fail(500, { error: 'Database error.' });
    }

    return { success: true };
  },

  update: async ({ request }) => {
    const db = getDb();
    const data = await request.formData();
    const id = data.get('id')?.toString();
    const name = data.get('name')?.toString().trim();
    const selling_price = data.get('selling_price')?.toString().trim();
    const cost_price = data.get('cost_price')?.toString().trim();

    if (!id || !name || !selling_price || !cost_price) {
      return fail(400, { error: 'All fields are required.' });
    }

    const selling = parseFloat(selling_price);
    const cost = parseFloat(cost_price);
    if (isNaN(selling) || isNaN(cost) || selling < 0 || cost < 0) {
      return fail(400, { error: 'Prices must be valid non‑negative numbers.' });
    }

    try {
      db.prepare('UPDATE products SET name = ?, selling_price = ?, cost_price = ?, updated_at = datetime("now") WHERE id = ?').run(name, selling, cost, id);
    } catch (err) {
      if (err.message.includes('UNIQUE')) {
        return fail(400, { error: `A product named "${name}" already exists.` });
      }
      return fail(500, { error: 'Database error.' });
    }

    return { success: true, updated: name };
  }
};