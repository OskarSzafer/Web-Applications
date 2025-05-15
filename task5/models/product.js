const db = require('./db');

// Finalize purchase as one atomic transaction
const finalizeTransaction = async (cart) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');

      let failed = false;

      const checkAndUpdate = async (index) => {
        if (index >= cart.length) {
          if (failed) {
            db.run('ROLLBACK', () => resolve(false));
          } else {
            db.run('COMMIT', async () => {
              // Cleanup: remove any out-of-stock items
              for (const item of cart) {
                await removeIfOutOfStock(item.id);
              }
              resolve(true);
            });
          }
          return;
        }

        // const sleep = async (ms) => { return new Promise(resolve => setTimeout(resolve, ms)); };
        // await sleep(5000);

        const item = cart[index];
        db.run(
          `UPDATE products SET quantity = quantity - ? WHERE id = ? AND quantity >= ?`,
          [item.quantity, item.id, item.quantity],
          function (err) {
            if (err || this.changes === 0) {
              failed = true;
              // still need to iterate to allow ROLLBACK later
            }
            checkAndUpdate(index + 1);
          }
        );
      };

      checkAndUpdate(0);
    });
  });
};

// Get all products
const getAllProducts = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM products', [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Get product by ID
const getProductById = (id) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// Remove product entirely from DB (optional, for hard deletes)
const removeProduct = (id) => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM products WHERE id = ?', [id], function (err) {
      if (err) reject(err);
      else resolve(this.changes); // returns number of affected rows
    });
  });
};

// Reduce product quantity (used during purchase finalization)
const reduceProductQuantity = (id, quantity) => {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE products SET quantity = quantity - ? WHERE id = ? AND quantity >= ?`,
      [quantity, id, quantity],
      function (err) {
        if (err) reject(err);
        else resolve(this.changes > 0); // true if update was successful
      }
    );
  });
};

// Delete product if quantity is 0 (optional cleanup after finalization)
const removeIfOutOfStock = (id) => {
  return new Promise((resolve, reject) => {
    db.run(
      `DELETE FROM products WHERE id = ? AND quantity <= 0`,
      [id],
      function (err) {
        if (err) reject(err);
        else resolve(this.changes > 0);
      }
    );
  });
};

module.exports = {
  getAllProducts,
  getProductById,
  removeProduct,
  reduceProductQuantity,
  removeIfOutOfStock,
  finalizeTransaction
};
