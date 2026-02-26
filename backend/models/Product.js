const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      index: true, // Atlas Search Index candidate
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Men', 'Women', 'Kids', 'Accessories', 'Footwear'],
      index: true, // Atlas Search Index candidate
    },
    subCategory: {
      type: String, // e.g., T-Shirts, Jeans, Kurtas, Dresses
      trim: true,
    },
    sizes: {
      type: [String],
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'],
      required: [true, 'At least one size is required'],
    },
    stockQuantity: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    images: [
      {
        url: { type: String, required: true },
        altText: { type: String },
      },
    ],
    isFeatured: { type: Boolean, default: false },
    discount: { type: Number, default: 0, min: 0, max: 100 }, // percentage
  },
  { timestamps: true }
);

// Virtual for discounted price
ProductSchema.virtual('discountedPrice').get(function () {
  return this.price - (this.price * this.discount) / 100;
});

// Compound text index for search (fallback if Atlas Search is not configured)
ProductSchema.index({ name: 'text', description: 'text', subCategory: 'text' });

module.exports = mongoose.model('Product', ProductSchema);
