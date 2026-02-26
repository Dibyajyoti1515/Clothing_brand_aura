const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');
const { createError } = require('../middleware/errorMiddleware');

const BULK_ORDER_THRESHOLD = 50; // Units above this trigger "Quote Requested"

// ─── @route  POST /api/orders ─────────────────────────────────────────────────
// ─── @desc   Create order from cart ─────────────────────────────────────────
// ─── @access Private ─────────────────────────────────────────────────────────
const createOrder = async (req, res, next) => {
  try {
    const { addressId, paymentMethod = 'Online', bulkOrderNote } = req.body;

    // ── 1. Resolve Shipping Address ───────────────────────────────────────────
    const user = await User.findById(req.user._id);

    let shippingAddress;
    if (addressId) {
      const saved = user.addresses.id(addressId);
      if (!saved) return next(createError('Address not found.', 404));
      shippingAddress = saved.toObject();
    } else {
      // Fall back to the default address
      shippingAddress = user.addresses.find((a) => a.isDefault);
      if (!shippingAddress) {
        return next(createError('No shipping address provided or set as default.', 400));
      }
    }

    // ── 2. Fetch Cart ─────────────────────────────────────────────────────────
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return next(createError('Your cart is empty.', 400));
    }

    // ── 3. Stock Validation & Order Items Build ───────────────────────────────
    const orderItems = [];
    let totalPrice = 0;
    let totalQuantity = 0;

    for (const item of cart.items) {
      const product = item.product;

      if (!product) {
        return next(createError('A product in your cart no longer exists.', 404));
      }

      if (product.stockQuantity < item.quantity) {
        return next(
          createError(
            `"${product.name}" only has ${product.stockQuantity} units left in stock.`,
            400
          )
        );
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        size: item.size,
        priceAtPurchase: item.priceAtAddition,
      });

      totalPrice += item.priceAtAddition * item.quantity;
      totalQuantity += item.quantity;
    }

    // ── 4. Bulk Order Detection ───────────────────────────────────────────────
    const isBulkOrder = totalQuantity > BULK_ORDER_THRESHOLD;
    const orderStatus = isBulkOrder ? 'Quote Requested' : 'Pending';

    // ── 5. Create Order ───────────────────────────────────────────────────────
    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      totalPrice,
      paymentMethod: isBulkOrder ? 'Bank Transfer' : paymentMethod,
      isBulkOrder,
      bulkOrderNote: isBulkOrder ? bulkOrderNote : undefined,
      orderStatus,
    });

    // ── 6. Deduct Stock (only for non-bulk orders placed immediately) ─────────
    if (!isBulkOrder) {
      for (const item of orderItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stockQuantity: -item.quantity },
        });
      }
    }

    // ── 7. Clear Cart ─────────────────────────────────────────────────────────
    await Cart.findOneAndDelete({ user: req.user._id });

    res.status(201).json({
      success: true,
      message: isBulkOrder
        ? `Bulk order received! Our team will contact you with a quote shortly.`
        : `Order placed successfully!`,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @route  GET /api/orders/my-orders ───────────────────────────────────────
// ─── @access Private ─────────────────────────────────────────────────────────
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('orderItems.product', 'name images')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    next(error);
  }
};

// ─── @route  GET /api/orders/:id ─────────────────────────────────────────────
// ─── @access Private (own order) or Admin ────────────────────────────────────
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'orderItems.product user',
      'name email images'
    );

    if (!order) return next(createError('Order not found.', 404));

    // Ensure user can only see their own orders (unless admin)
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return next(createError('Not authorized to view this order.', 403));
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// ─── @route  GET /api/orders ─────────────────────────────────────────────────
// ─── @desc   Get all orders (admin) ──────────────────────────────────────────
// ─── @access Admin ───────────────────────────────────────────────────────────
const getAllOrders = async (req, res, next) => {
  try {
    const { status, isBulk, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (status) filter.orderStatus = status;
    if (isBulk !== undefined) filter.isBulkOrder = isBulk === 'true';

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Order.countDocuments(filter);

    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @route  PUT /api/orders/:id/status ──────────────────────────────────────
// ─── @desc   Update order status (admin) ─────────────────────────────────────
// ─── @access Admin ───────────────────────────────────────────────────────────
const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, trackingNumber } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) return next(createError('Order not found.', 404));

    order.orderStatus = orderStatus;

    if (trackingNumber) order.trackingNumber = trackingNumber;

    // If admin confirms a bulk order, deduct stock now
    if (order.isBulkOrder && orderStatus === 'Confirmed') {
      for (const item of order.orderItems) {
        const product = await Product.findById(item.product);
        if (!product || product.stockQuantity < item.quantity) {
          return next(createError(`Insufficient stock for "${item.name}".`, 400));
        }
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stockQuantity: -item.quantity },
        });
      }
      order.isPaid = true;
      order.paidAt = new Date();
    }

    if (orderStatus === 'Delivered') {
      order.isPaid = true;
      order.paidAt = order.paidAt || new Date();
    }

    await order.save();

    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// ─── @route  PUT /api/orders/:id/cancel ──────────────────────────────────────
// ─── @desc   Cancel an order (user, if still Pending) ────────────────────────
// ─── @access Private ─────────────────────────────────────────────────────────
const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return next(createError('Order not found.', 404));

    if (order.user.toString() !== req.user._id.toString()) {
      return next(createError('Not authorized.', 403));
    }

    if (!['Pending', 'Quote Requested'].includes(order.orderStatus)) {
      return next(createError(`Cannot cancel an order that is "${order.orderStatus}".`, 400));
    }

    // Restore stock if was a normal (non-bulk) order
    if (!order.isBulkOrder) {
      for (const item of order.orderItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stockQuantity: item.quantity },
        });
      }
    }

    order.orderStatus = 'Cancelled';
    await order.save();

    res.status(200).json({ success: true, message: 'Order cancelled.', order });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
};
