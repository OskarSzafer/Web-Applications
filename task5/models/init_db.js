// node models/init_db.js

const db = require('./db');

db.serialize(() => {
  // Drop existing table
  db.run(`DROP TABLE IF EXISTS products`, (err) => {
    if (err) {
      console.error('Error dropping table', err);
    } else {
      console.log('Existing table dropped');
    }
  });

  // Create table
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    image TEXT,
    description TEXT,
    quantity INTEGER DEFAULT 1,
    price REAL NOT NULL
  )`, (err) => {
    if (err) {
      console.error('Error creating table', err);
    } else {
      console.log('Table created successfully');
  
      const stmt = db.prepare(`
        INSERT INTO products (name, image, description, quantity, price) VALUES (?, ?, ?, ?, ?)
      `);
  
      const products = [
        [
          'Laptop',
          'https://a.allegroimg.com/original/11e206/fb5bfceb4988babe30dd4b7906a1/Laptop-HP-17-i5-13-GEN-16GB-512GB-SSD-Intel-Xe-FullHD-Win-11-Srebrny',
          'A powerful laptop',
          5,
          1299.99
        ],
        [
          'Smartphone',
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
          'Latest smartphone model',
          10,
          899.49
        ],
        [
          'Headphones',
          'https://funtech.pl/pol_pl_Wireless-headphones-Beats-Solo-4-Matte-Black-22064_3.jpg',
          'Noise-cancelling headphones',
          7,
          199.95
        ],
        [
          'Camera',
          'https://cdn11.bigcommerce.com/s-r16b86mn51/images/stencil/original/products/9141/24542/10557_leica_m6_black_front_lens__65896.1666230047.jpg?c=2&imbypass=on&imbypass=on',
          'DSLR camera for photography',
          3,
          649.00
        ],
        [
          'Gaming Mouse',
          'https://www.proshop.pl/Images/1600x1200/3192194_7cf90b7fd615.png',
          'High-precision gaming mouse',
          8,
          59.99
        ],
        [
          'Gaming Mouse',
          'https://www.proshop.pl/Images/1600x1200/3192194_7cf90b7fd615.png',
          'High-precision gaming mouse',
          8,
          59.99
        ],
        [
          'Gaming Mouse',
          'https://www.proshop.pl/Images/1600x1200/3192194_7cf90b7fd615.png',
          'High-precision gaming mouse',
          8,
          59.99
        ]
      ];
  
      for (const [name, image, description, quantity, price] of products) {
        stmt.run(name, image, description, quantity, price);
      }
  
      stmt.finalize((err) => {
        if (err) {
          console.error('Error finalizing insert statement', err);
        } else {
          console.log('Initial products inserted');
  
          db.all('SELECT * FROM products', [], (err, rows) => {
            if (err) {
              console.error('Error fetching products', err);
            } else {
              console.log('Current products in database:');
              console.table(rows);
            }
          });
        }
      });
    }
  });
});
