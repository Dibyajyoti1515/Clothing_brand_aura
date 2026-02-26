const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { createError } = require('../middleware/errorMiddleware');

// ─── @route  GET /api/cart ────────────────────────────────────────────────────
// ─── @access Private ─────────────────────────────────────────────────────────
const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      'items.product',
      'name images price stockQuantity'
    );

    if (!cart) {
      return res.status(200).json({ success: true, cart: { items: [], totalPrice: 0, totalItems: 0 } });
    }

    res.status(200).json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

// ─── @route  POST /api/cart ───────────────────────────────────────────────────
// ─── @desc   Add item to cart (checks stock first) ───────────────────────────
// ─── @access Private ─────────────────────────────────────────────────────────
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1, size } = req.body;

    if (!productId || !size) {
      return next(createError('Product ID and size are required.', 400));
    }

    // ── Stock Check ───────────────────────────────────────────────────────────
    const product = await Product.findById(productId);
    if (!product) return next(createError('Product not found.', 404));

    if (product.stockQuantity < quantity) {
      return next(
        createError(
          `Insufficient stock. Only ${product.stockQuantity} units available.`,
          400
        )
      );
    }
    // ─────────────────────────────────────────────────────────────────────────

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      // First item — create a new cart
      cart = await Cart.create({
        user: req.user._id,
        items: [{ product: productId, quantity, size, priceAtAddition: product.price }],
      });
    } else {
      // Check if same product+size combo already in cart
      const existingItemIndex = cart.items.findIndex(
        (item) =>
          item.product.toString() === productId && item.size === size
      );

      if (existingItemIndex > -1) {
        // Update quantity, but validate against stock
        const newQty = cart.items[existingItemIndex].quantity + quantity;
        if (product.stockQuantity < newQty) {
          return next(
            createError(
              `Cannot add ${quantity} more. Only ${product.stockQuantity} units in stock.`,
              400
            )
          );
        }
        cart.items[existingItemIndex].quantity = newQty;
      } else {
        // New product/size combo — push to items
        cart.items.push({
          product: productId,
          quantity,
          size,
          priceAtAddition: product.price,
        });
      }

      await cart.save();
    }

    const populatedCart = await cart.populate('items.product', 'name images price stockQuantity');

    res.status(200).json({ success: true, cart: populatedCart });
  } catch (error) {
    next(error);
  }
};

// ─── @route  PUT /api/cart/:itemId ───────────────────────────────────────────
// ─── @desc   Update quantity of a cart item ──────────────────────────────────
// ─── @access Private ─────────────────────────────────────────────────────────
const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return next(createError('Cart not found.', 404));

    const item = cart.items.id(itemId);
    if (!item) return next(createError('Item not found in cart.', 404));

    // Re-check stock before updating
    const product = await Product.findById(item.product);
    if (product.stockQuantity < quantity) {
      return next(createError(`Only ${product.stockQuantity} units available.`, 400));
    }

    if (quantity <= 0) {
      item.deleteOne(); // Remove item if quantity set to 0
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    res.status(200).json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

// ─── @route  DELETE /api/cart/:itemId ────────────────────────────────────────
// ─── @access Private ─────────────────────────────────────────────────────────
const removeFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return next(createError('Cart not found.', 404));

    const item = cart.items.id(req.params.itemId);
    if (!item) return next(createError('Item not found in cart.', 404));

    item.deleteOne();
    await cart.save();

    res.status(200).json({ success: true, message: 'Item removed from cart.', cart });
  } catch (error) {
    next(error);
  }
};

// ─── @route  DELETE /api/cart ─────────────────────────────────────────────────
// ─── @desc   Clear entire cart ───────────────────────────────────────────────
// ─── @access Private ─────────────────────────────────────────────────────────
const clearCart = async (req, res, next) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id });
    res.status(200).json({ success: true, message: 'Cart cleared.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
