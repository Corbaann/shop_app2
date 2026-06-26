import Database from 'better-sqlite3';

let db;

function getDb() {
  if (!db) {
    db = new Database('shop-profit.db');
    db.pragma('journal_mode = WAL');
    db.exec(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        selling_price REAL NOT NULL,
        cost_price REAL NOT NULL,
        profit_per_unit REAL GENERATED ALWAYS AS (selling_price - cost_price) STORED,
        is_active BOOLEAN DEFAULT 1,
        updated_at TEXT DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS sales (
        id INTEGER PRIMARY KEY,
        product_id INTEGER REFERENCES products(id),
        quantity INTEGER NOT NULL DEFAULT 1,
        selling_price_at_time REAL NOT NULL,
        profit_at_time REAL NOT NULL,
        sale_date TEXT NOT NULL DEFAULT (date('now')),
        sale_time TEXT NOT NULL DEFAULT (time('now')),
        FOREIGN KEY (product_id) REFERENCES products(id)
      );
      CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(sale_date);
    `);
  }
  return db;
}

export { getDb };