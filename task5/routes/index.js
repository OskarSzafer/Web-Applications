const express = require('express');
const router = express.Router();
const productModel = require('../models/product');

// Home Page: list products
router.get('/', async (req, res) => {
  const products = await productModel.getAllProducts();
  const message = req.session.message;
  req.session.message = null;
  res.render('index', { products, message });
});

// Add to Cart
router.post('/add-to-cart', async (req, res) => {
  const productId = parseInt(req.body.productId);
  if (!req.session.cart) req.session.cart = [];

  const existing = req.session.cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    const product = await productModel.getProductById(productId);
    if (product) {
      req.session.cart.push({ ...product, quantity: 1 });
    }
  }

  res.redirect('/');
});

// View Cart
router.get('/cart', (req, res) => {
  res.render('cart', { cart: req.session.cart || [] });
});

// Cancel Purchase
router.post('/cancel', (req, res) => {
  req.session.cart = [];
  req.session.message = 'Purchase cancelled.';
  res.redirect('/');
});

// Finalize Purchase
router.post('/finalize', async (req, res) => {
  const cart = req.session.cart || [];

  const success = await productModel.finalizeTransaction(cart);

  if (!success) {
    req.session.cart = [];
    req.session.message = 'Purchase failed: Some items are out of stock. No items were purchased.';
    return res.redirect('/');
  }

  req.session.cart = [];
  req.session.message = 'Purchase successful!';
  res.redirect('/');
});

// router.post('/finalize', async (req, res) => {
//   const cart = req.session.cart || [];
//   const failed = [];

//   for (const item of cart) {
//     const success = await productModel.reduceProductQuantity(item.id, item.quantity);
//     if (!success) {
//       failed.push(item.name);
//     } else {
//       await productModel.removeIfOutOfStock(item.id);
//     }
//   }

//   if (failed.length > 0) {
//     req.session.message = `Purchase failed for: ${failed.join(', ')}. Some items might be out of stock.`;
//     return res.redirect('/cart');
//   }

//   req.session.cart = [];
//   req.session.message = 'Purchase successful!';
//   res.redirect('/');
// });

module.exports = router;
