import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = '/tmp/phoneplace.db';
let db: any = null;

export function getDB() {
  if (db) return db;

  const dbExists = fs.existsSync(dbPath);
  db = new Database(dbPath);

  if (!dbExists) {
    initDB();
    seedDB();
  }

  return db;
}

function initDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      parent_id INTEGER
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      price REAL NOT NULL,
      discount INTEGER DEFAULT 0,
      description TEXT,
      specs TEXT,
      brand TEXT,
      stock INTEGER DEFAULT 0,
      rating_avg REAL DEFAULT 0,
      rating_count INTEGER DEFAULT 0,
      category_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS product_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      url TEXT NOT NULL,
      is_primary INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS product_variants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      color TEXT,
      storage TEXT,
      size TEXT,
      sku TEXT UNIQUE,
      stock INTEGER DEFAULT 0,
      price_override REAL
    );

    CREATE TABLE IF NOT EXISTS carts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      session_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS cart_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cart_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      variant_id INTEGER,
      qty INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      status TEXT DEFAULT 'placed',
      total REAL NOT NULL,
      delivery_fee REAL DEFAULT 0,
      address_json TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      variant_id INTEGER,
      qty INTEGER NOT NULL,
      price_at_purchase REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      rating INTEGER NOT NULL,
      comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS addresses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      address_line TEXT NOT NULL,
      city TEXT NOT NULL,
      is_default INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS wishlist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, product_id)
    );

    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
    CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
  `);
}

function seedDB() {
  const bcrypt = require('bcryptjs');
  const passwordHash = bcrypt.hashSync('password123', 10);
  
  db.prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)').run(
    'Admin User', 'admin@phoneplace.com', passwordHash, 'admin'
  );

  const categories = [
    { name: 'Smartphones', slug: 'smartphones', parent_id: null },
    { name: 'Phone Accessories', slug: 'accessories', parent_id: null },
  ];

  categories.forEach(cat => {
    db.prepare('INSERT INTO categories (name, slug, parent_id) VALUES (?, ?, ?)').run(
      cat.name, cat.slug, cat.parent_id
    );
  });

  const products = [
    { title: 'iPhone 15 Pro Max', slug: 'iphone-15-pro-max', price: 185000, discount: 8, brand: 'Apple', stock: 18, rating_avg: 4.9, rating_count: 203, category_id: 1 },
    { title: 'Samsung Galaxy S23 Ultra', slug: 'samsung-s23-ultra', price: 145000, discount: 15, brand: 'Samsung', stock: 25, rating_avg: 4.8, rating_count: 156, category_id: 1 },
    { title: 'Xiaomi Redmi Note 13 Pro', slug: 'xiaomi-redmi-note-13', price: 35000, discount: 18, brand: 'Xiaomi', stock: 55, rating_avg: 4.6, rating_count: 178, category_id: 1 },
  ];

  products.forEach(p => {
    const result = db.prepare('INSERT INTO products (title, slug, price, discount, brand, stock, rating_avg, rating_count, category_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').run(
      p.title, p.slug, p.price, p.discount, p.brand, p.stock, p.rating_avg, p.rating_count, p.category_id
    );
    db.prepare('INSERT INTO product_images (product_id, url, is_primary) VALUES (?, ?, ?)').run(result.lastInsertRowid, `/images/${p.slug}.jpg`, 1);
  });
}

export default getDB();
