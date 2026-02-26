const Product = require('../models/Product');
const { createError } = require('../middleware/errorMiddleware');

// ─── @route  GET /api/products ────────────────────────────────────────────────
// ─── @desc   Get all products with search & filtering ────────────────────────
// ─── @access Public ──────────────────────────────────────────────────────────
// Example: /api/products?category=Men&search=linen&minPrice=200&maxPrice=2000&size=L&page=1
const getProducts = async (req, res, next) => {
  try {
    const { category, search, minPrice, maxPrice, size, page = 1, limit = 12, sort } = req.query;

    const query = {};

    // Category filter
    if (category) query.category = category;

    // Size filter
    if (size) query.sizes = { $in: [size] };

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Text search (uses the text index on name, description, subCategory)
    if (search) {
      query.$text = { $search: search };
    }

    // Sorting
    let sortOption = {};
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };
    else if (sort === 'relevance' && search) sortOption = { score: { $meta: 'textScore' } };
    else sortOption = { createdAt: -1 }; // Default: newest first

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);

    const products = await Product.find(
      query,
      search ? { score: { $meta: 'textScore' } } : {}
    )
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      products,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @route  GET /api/products/:id ───────────────────────────────────────────
// ─── @access Public ──────────────────────────────────────────────────────────
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return next(createError('Product not found.', 404));
    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// ─── @route  POST /api/products ──────────────────────────────────────────────
// ─── @access Admin ───────────────────────────────────────────────────────────
const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// ─── @route  PUT /api/products/:id ───────────────────────────────────────────
// ─── @access Admin ───────────────────────────────────────────────────────────
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return next(createError('Product not found.', 404));
    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// ─── @route  DELETE /api/products/:id ────────────────────────────────────────
// ─── @access Admin ───────────────────────────────────────────────────────────
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return next(createError('Product not found.', 404));
    res.status(200).json({ success: true, message: 'Product deleted.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
