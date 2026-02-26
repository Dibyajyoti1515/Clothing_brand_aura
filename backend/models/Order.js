const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: { type: String, required: true }, // Snapshot in case product is deleted
  quantity: { type: Number, required: true, min: 1 },
  size: { type: String, required: true },
  priceAtPurchase: { type: Number, required: true },
});

const ShippingAddressSchema = new mongoose.Schema({
  label: String,
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
});

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderItems: [OrderItemSchema],
    shippingAddress: {
      type: ShippingAddressSchema,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    // ─── Bulk Order Logic ──────────────────────────────────────────
    isBulkOrder: {
      type: Boolean,
      default: false,
    },
    bulkOrderNote: {
      type: String, // Optional note from the customer for the quote
    },
    // ──────────────────────────────────────────────────────────────
    orderStatus: {
      type: String,
      enum: [
        'Pending',       // Normal order placed, awaiting payment
        'Quote Requested', // Bulk order > 50 units, awaiting admin review
        'Confirmed',     // Payment confirmed / quote accepted
        'Processing',    // Being packed
        'Shipped',       // Dispatched
        'Delivered',     // Received by customer
        'Cancelled',     // Cancelled
      ],
      default: 'Pending',
    },
    paymentMethod: {
      type: String,
      enum: ['COD', 'Online', 'Bank Transfer'],
      default: 'Online',
    },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    trackingNumber: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
