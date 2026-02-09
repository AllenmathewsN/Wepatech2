const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

const db = new Database(path.join(__dirname, '..', 'phoneplace.db'));

function initDB() {
  db.exec(`
    DROP TABLE IF EXISTS wishlist;
    DROP TABLE IF EXISTS addresses;
    DROP TABLE IF EXISTS reviews;
    DROP TABLE IF EXISTS order_items;
    DROP TABLE IF EXISTS orders;
    DROP TABLE IF EXISTS cart_items;
    DROP TABLE IF EXISTS carts;
    DROP TABLE IF EXISTS product_variants;
    DROP TABLE IF EXISTS product_images;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS categories;
    DROP TABLE IF EXISTS users;

    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      parent_id INTEGER,
      FOREIGN KEY (parent_id) REFERENCES categories(id)
    );

    CREATE TABLE products (
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
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );

    CREATE TABLE product_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      url TEXT NOT NULL,
      is_primary INTEGER DEFAULT 0,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE product_variants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      color TEXT,
      storage TEXT,
      size TEXT,
      sku TEXT UNIQUE,
      stock INTEGER DEFAULT 0,
      price_override REAL,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE carts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      session_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE cart_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cart_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      variant_id INTEGER,
      qty INTEGER DEFAULT 1,
      FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id),
      FOREIGN KEY (variant_id) REFERENCES product_variants(id)
    );

    CREATE TABLE orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      status TEXT DEFAULT 'placed',
      total REAL NOT NULL,
      delivery_fee REAL DEFAULT 0,
      address_json TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      variant_id INTEGER,
      qty INTEGER NOT NULL,
      price_at_purchase REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id),
      FOREIGN KEY (variant_id) REFERENCES product_variants(id)
    );

    CREATE TABLE reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      rating INTEGER NOT NULL,
      comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE addresses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      address_line TEXT NOT NULL,
      city TEXT NOT NULL,
      is_default INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE wishlist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      UNIQUE(user_id, product_id)
    );

    CREATE INDEX idx_products_category ON products(category_id);
    CREATE INDEX idx_products_slug ON products(slug);
    CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);
    CREATE INDEX idx_orders_user ON orders(user_id);
  `);
}

async function seed() {
  console.log('Seeding database...');
  
  initDB();

  const passwordHash = await bcrypt.hash('password123', 10);
  
  db.prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)').run(
    'Admin User', 'admin@phoneplace.com', passwordHash, 'admin'
  );
  
  db.prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)').run(
    'John Doe', 'john@example.com', passwordHash, 'user'
  );

  const categories = [
    { name: 'Smartphones', slug: 'smartphones', parent_id: null },
    { name: 'Phone Accessories', slug: 'accessories', parent_id: null },
    { name: 'Chargers & Cables', slug: 'chargers-cables', parent_id: 2 },
    { name: 'Earphones & Headsets', slug: 'earphones', parent_id: 2 },
    { name: 'Power Banks', slug: 'power-banks', parent_id: 2 },
    { name: 'Phone Cases', slug: 'phone-cases', parent_id: 2 },
  ];

  categories.forEach(cat => {
    db.prepare('INSERT INTO categories (name, slug, parent_id) VALUES (?, ?, ?)').run(
      cat.name, cat.slug, cat.parent_id
    );
  });

  const products = [
    {
      title: 'Samsung Galaxy S23 Ultra 5G',
      slug: 'samsung-galaxy-s23-ultra-5g',
      price: 145000,
      discount: 15,
      description: 'Premium flagship with 200MP camera, S Pen, and powerful performance',
      specs: JSON.stringify({
        display: '6.8" Dynamic AMOLED 2X',
        processor: 'Snapdragon 8 Gen 2',
        ram: '12GB',
        storage: '256GB',
        camera: '200MP + 12MP + 10MP + 10MP',
        battery: '5000mAh'
      }),
      brand: 'Samsung',
      stock: 25,
      rating_avg: 4.8,
      rating_count: 156,
      category_id: 1
    },
    {
      title: 'iPhone 15 Pro Max',
      slug: 'iphone-15-pro-max',
      price: 185000,
      discount: 8,
      description: 'Latest iPhone with titanium design, A17 Pro chip, and advanced camera system',
      specs: JSON.stringify({
        display: '6.7" Super Retina XDR',
        processor: 'A17 Pro',
        ram: '8GB',
        storage: '256GB',
        camera: '48MP + 12MP + 12MP',
        battery: '4422mAh'
      }),
      brand: 'Apple',
      stock: 18,
      rating_avg: 4.9,
      rating_count: 203,
      category_id: 1
    },
    {
      title: 'Tecno Phantom X2 Pro',
      slug: 'tecno-phantom-x2-pro',
      price: 52000,
      discount: 20,
      description: 'Affordable flagship with retractable portrait lens and premium design',
      specs: JSON.stringify({
        display: '6.8" AMOLED',
        processor: 'MediaTek Dimensity 9000',
        ram: '12GB',
        storage: '256GB',
        camera: '64MP + 13MP + 50MP',
        battery: '5160mAh'
      }),
      brand: 'Tecno',
      stock: 45,
      rating_avg: 4.5,
      rating_count: 89,
      category_id: 1
    },
    {
      title: 'Infinix Note 30 Pro',
      slug: 'infinix-note-30-pro',
      price: 28500,
      discount: 12,
      description: 'Budget-friendly with 108MP camera and fast charging',
      specs: JSON.stringify({
        display: '6.78" AMOLED',
        processor: 'MediaTek Helio G99',
        ram: '8GB',
        storage: '256GB',
        camera: '108MP + 2MP + 2MP',
        battery: '5000mAh'
      }),
      brand: 'Infinix',
      stock: 60,
      rating_avg: 4.3,
      rating_count: 124,
      category_id: 1
    },
    {
      title: 'Xiaomi Redmi Note 13 Pro',
      slug: 'xiaomi-redmi-note-13-pro',
      price: 35000,
      discount: 18,
      description: 'Mid-range powerhouse with excellent camera and display',
      specs: JSON.stringify({
        display: '6.67" AMOLED',
        processor: 'Snapdragon 7s Gen 2',
        ram: '8GB',
        storage: '256GB',
        camera: '200MP + 8MP + 2MP',
        battery: '5100mAh'
      }),
      brand: 'Xiaomi',
      stock: 55,
      rating_avg: 4.6,
      rating_count: 178,
      category_id: 1
    },
    {
      title: 'Samsung Galaxy A54 5G',
      slug: 'samsung-galaxy-a54-5g',
      price: 42000,
      discount: 10,
      description: 'Mid-range Samsung with premium features and 5G connectivity',
      specs: JSON.stringify({
        display: '6.4" Super AMOLED',
        processor: 'Exynos 1380',
        ram: '8GB',
        storage: '256GB',
        camera: '50MP + 12MP + 5MP',
        battery: '5000mAh'
      }),
      brand: 'Samsung',
      stock: 40,
      rating_avg: 4.5,
      rating_count: 142,
      category_id: 1
    },
    {
      title: 'iPhone 14',
      slug: 'iphone-14',
      price: 115000,
      discount: 15,
      description: 'Previous generation iPhone with excellent performance',
      specs: JSON.stringify({
        display: '6.1" Super Retina XDR',
        processor: 'A15 Bionic',
        ram: '6GB',
        storage: '128GB',
        camera: '12MP + 12MP',
        battery: '3279mAh'
      }),
      brand: 'Apple',
      stock: 30,
      rating_avg: 4.7,
      rating_count: 267,
      category_id: 1
    },
    {
      title: 'Tecno Camon 20 Pro',
      slug: 'tecno-camon-20-pro',
      price: 32000,
      discount: 22,
      description: 'Camera-focused phone with excellent value',
      specs: JSON.stringify({
        display: '6.67" AMOLED',
        processor: 'MediaTek Helio G99',
        ram: '8GB',
        storage: '256GB',
        camera: '64MP + 2MP + 2MP',
        battery: '5000mAh'
      }),
      brand: 'Tecno',
      stock: 50,
      rating_avg: 4.4,
      rating_count: 95,
      category_id: 1
    },
    {
      title: 'Infinix Zero 30 5G',
      slug: 'infinix-zero-30-5g',
      price: 38000,
      discount: 16,
      description: '5G smartphone with curved display and fast charging',
      specs: JSON.stringify({
        display: '6.78" AMOLED',
        processor: 'MediaTek Dimensity 8020',
        ram: '12GB',
        storage: '256GB',
        camera: '108MP + 13MP + 2MP',
        battery: '5000mAh'
      }),
      brand: 'Infinix',
      stock: 35,
      rating_avg: 4.5,
      rating_count: 76,
      category_id: 1
    },
    {
      title: 'Nokia G42 5G',
      slug: 'nokia-g42-5g',
      price: 24000,
      discount: 8,
      description: 'Reliable Nokia with 5G and clean Android experience',
      specs: JSON.stringify({
        display: '6.56" IPS LCD',
        processor: 'Snapdragon 480+',
        ram: '6GB',
        storage: '128GB',
        camera: '50MP + 2MP + 2MP',
        battery: '5000mAh'
      }),
      brand: 'Nokia',
      stock: 42,
      rating_avg: 4.2,
      rating_count: 58,
      category_id: 1
    }
  ];

  products.forEach(product => {
    const result = db.prepare(`
      INSERT INTO products (title, slug, price, discount, description, specs, brand, stock, rating_avg, rating_count, category_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      product.title, product.slug, product.price, product.discount, product.description,
      product.specs, product.brand, product.stock, product.rating_avg, product.rating_count, product.category_id
    );

    const productId = result.lastInsertRowid;
    
    db.prepare('INSERT INTO product_images (product_id, url, is_primary) VALUES (?, ?, ?)').run(
      productId, `/images/products/${product.slug}-1.jpg`, 1
    );
    db.prepare('INSERT INTO product_images (product_id, url, is_primary) VALUES (?, ?, ?)').run(
      productId, `/images/products/${product.slug}-2.jpg`, 0
    );
    db.prepare('INSERT INTO product_images (product_id, url, is_primary) VALUES (?, ?, ?)').run(
      productId, `/images/products/${product.slug}-3.jpg`, 0
    );
  });

  const accessories = [
    {
      title: 'Samsung 25W Fast Charger',
      slug: 'samsung-25w-fast-charger',
      price: 1800,
      discount: 10,
      description: 'Original Samsung fast charger with USB-C cable',
      brand: 'Samsung',
      stock: 100,
      rating_avg: 4.6,
      rating_count: 234,
      category_id: 3
    },
    {
      title: 'Anker PowerPort III 20W',
      slug: 'anker-powerport-iii-20w',
      price: 2200,
      discount: 15,
      description: 'Compact fast charger for iPhone and Android',
      brand: 'Anker',
      stock: 85,
      rating_avg: 4.8,
      rating_count: 312,
      category_id: 3
    },
    {
      title: 'USB-C to Lightning Cable 2m',
      slug: 'usb-c-lightning-cable-2m',
      price: 1200,
      discount: 5,
      description: 'Durable braided cable for fast charging',
      brand: 'Generic',
      stock: 150,
      rating_avg: 4.3,
      rating_count: 189,
      category_id: 3
    },
    {
      title: 'Samsung Galaxy Buds2 Pro',
      slug: 'samsung-galaxy-buds2-pro',
      price: 18500,
      discount: 20,
      description: 'Premium wireless earbuds with ANC',
      brand: 'Samsung',
      stock: 45,
      rating_avg: 4.7,
      rating_count: 156,
      category_id: 4
    },
    {
      title: 'Apple AirPods Pro 2nd Gen',
      slug: 'apple-airpods-pro-2',
      price: 32000,
      discount: 8,
      description: 'Industry-leading ANC and spatial audio',
      brand: 'Apple',
      stock: 30,
      rating_avg: 4.9,
      rating_count: 423,
      category_id: 4
    },
    {
      title: 'Oraimo FreePods 3',
      slug: 'oraimo-freepods-3',
      price: 4500,
      discount: 25,
      description: 'Affordable TWS earbuds with good sound quality',
      brand: 'Oraimo',
      stock: 120,
      rating_avg: 4.4,
      rating_count: 267,
      category_id: 4
    },
    {
      title: 'JBL Tune 510BT Wireless Headphones',
      slug: 'jbl-tune-510bt',
      price: 5800,
      discount: 18,
      description: 'On-ear wireless headphones with JBL Pure Bass',
      brand: 'JBL',
      stock: 65,
      rating_avg: 4.5,
      rating_count: 198,
      category_id: 4
    },
    {
      title: 'Anker PowerCore 20000mAh',
      slug: 'anker-powercore-20000',
      price: 5500,
      discount: 12,
      description: 'High-capacity power bank with fast charging',
      brand: 'Anker',
      stock: 75,
      rating_avg: 4.7,
      rating_count: 345,
      category_id: 5
    },
    {
      title: 'Xiaomi 10000mAh Power Bank',
      slug: 'xiaomi-10000mah-power-bank',
      price: 2800,
      discount: 15,
      description: 'Compact and portable power bank',
      brand: 'Xiaomi',
      stock: 95,
      rating_avg: 4.6,
      rating_count: 289,
      category_id: 5
    },
    {
      title: 'Oraimo 27000mAh Power Bank',
      slug: 'oraimo-27000mah-power-bank',
      price: 6200,
      discount: 20,
      description: 'Ultra high capacity for multiple charges',
      brand: 'Oraimo',
      stock: 55,
      rating_avg: 4.5,
      rating_count: 167,
      category_id: 5
    },
    {
      title: 'Spigen Tough Armor Case - iPhone 15',
      slug: 'spigen-tough-armor-iphone-15',
      price: 2500,
      discount: 10,
      description: 'Military-grade protection with kickstand',
      brand: 'Spigen',
      stock: 80,
      rating_avg: 4.8,
      rating_count: 234,
      category_id: 6
    },
    {
      title: 'OtterBox Defender - Samsung S23',
      slug: 'otterbox-defender-samsung-s23',
      price: 3200,
      discount: 15,
      description: 'Ultimate protection for your Samsung',
      brand: 'OtterBox',
      stock: 60,
      rating_avg: 4.7,
      rating_count: 178,
      category_id: 6
    },
    {
      title: 'Clear Silicone Case - Universal',
      slug: 'clear-silicone-case-universal',
      price: 800,
      discount: 5,
      description: 'Transparent soft case for various models',
      brand: 'Generic',
      stock: 200,
      rating_avg: 4.2,
      rating_count: 456,
      category_id: 6
    }
  ];

  accessories.forEach(product => {
    const result = db.prepare(`
      INSERT INTO products (title, slug, price, discount, description, brand, stock, rating_avg, rating_count, category_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      product.title, product.slug, product.price, product.discount, product.description,
      product.brand, product.stock, product.rating_avg, product.rating_count, product.category_id
    );

    const productId = result.lastInsertRowid;
    
    db.prepare('INSERT INTO product_images (product_id, url, is_primary) VALUES (?, ?, ?)').run(
      productId, `/images/products/${product.slug}.jpg`, 1
    );
  });

  console.log('Database seeded successfully!');
  console.log('Admin: admin@phoneplace.com / password123');
  console.log('User: john@example.com / password123');
}

seed().catch(console.error);
