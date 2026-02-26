const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { createError } = require('../middleware/errorMiddleware');

// ─── Generate JWT ─────────────────────────────────────────────────────────────
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// ─── @route  POST /api/auth/signup ───────────────────────────────────────────
// ─── @access Public ──────────────────────────────────────────────────────────
const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(createError('Email is already registered.', 400));
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── @route  POST /api/auth/login ────────────────────────────────────────────
// ─── @access Public ──────────────────────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(createError('Please provide email and password.', 400));
    }

    // Explicitly select password since it's excluded by default
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return next(createError('Invalid email or password.', 401));
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── @route  GET /api/auth/me ─────────────────────────────────────────────────
// ─── @access Private ─────────────────────────────────────────────────────────
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// ─── @route  POST /api/auth/address ──────────────────────────────────────────
// ─── @access Private ─────────────────────────────────────────────────────────
const addAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const { label, street, city, state, postalCode, country, isDefault } = req.body;

    // If new address is default, unset all others
    if (isDefault) {
      user.addresses.forEach((addr) => (addr.isDefault = false));
    }

    user.addresses.push({ label, street, city, state, postalCode, country, isDefault });
    await user.save();

    res.status(201).json({ success: true, addresses: user.addresses });
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, login, getMe, addAddress };
