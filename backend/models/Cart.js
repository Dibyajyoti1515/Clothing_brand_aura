const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
    default: 1,
  },
  size: {
    type: String,
    required: [true, 'Please select a size'],
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'],
  },
  priceAtAddition: {
    type: Number, // Snapshot of price when added — protects against price changes
    required: true,
  },
});

const CartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // One cart per user
    },
    items: [CartItemSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for total cart value
CartSchema.virtual('totalPrice').get(function () {
  return this.items.reduce(
    (total, item) => total + item.priceAtAddition * item.quantity,
    0
  );
});

// Virtual for total item count
CartSchema.virtual('totalItems').get(function () {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

module.exports = mongoose.model('Cart', CartSchema);
