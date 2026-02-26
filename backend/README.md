# 👕 Clothing Brand E-commerce API

A production-ready RESTful API for a clothing brand, built with Node.js, Express.js, MongoDB Atlas, and JWT authentication.

---

## 🗂️ Folder Structure

```
clothing-api/
├── config/
│   └── db.js                  # MongoDB Atlas connection
├── controllers/
│   ├── authController.js      # Signup, Login, Address management
│   ├── cartController.js      # Cart CRUD + stock validation
│   ├── orderController.js     # Order creation, bulk order logic
│   └── productController.js   # Products + search & filter
├── middleware/
│   ├── authMiddleware.js      # JWT protect + adminOnly guards
│   └── errorMiddleware.js     # Global error handler
├── models/
│   ├── Cart.js                # Cart with virtual totals
│   ├── Order.js               # Order with bulk order flag
│   ├── Product.js             # Product with text index
│   └── User.js                # User with embedded addresses
├── routes/
│   ├── authRoutes.js
│   ├── cartRoutes.js
│   ├── orderRoutes.js
│   └── productRoutes.js
├── .env.example
├── package.json
└── server.js
```

---

## ⚙️ Setup

```bash
# 1. Install dependencies
npm install

# 2. Create your .env file
cp .env.example .env
# → Fill in your MONGO_URI, JWT_SECRET

# 3. Run the server
npm run dev
```

---

## 🔐 Authentication

All `/cart` and `/order` routes require a `Bearer` token in the `Authorization` header.

```
Authorization: Bearer <your_jwt_token>
```

---

## 📡 API Reference

### Auth
| Method | Endpoint             | Access  | Description              |
|--------|----------------------|---------|--------------------------|
| POST   | `/api/auth/signup`   | Public  | Register a new user      |
| POST   | `/api/auth/login`    | Public  | Login, receive JWT       |
| GET    | `/api/auth/me`       | Private | Get current user profile |
| POST   | `/api/auth/address`  | Private | Add a saved address      |

### Products
| Method | Endpoint              | Access  | Description                    |
|--------|-----------------------|---------|--------------------------------|
| GET    | `/api/products`       | Public  | Search & filter products       |
| GET    | `/api/products/:id`   | Public  | Get single product             |
| POST   | `/api/products`       | Admin   | Create product                 |
| PUT    | `/api/products/:id`   | Admin   | Update product                 |
| DELETE | `/api/products/:id`   | Admin   | Delete product                 |

**Search & Filter Query Params:**
```
/api/products?category=Men&search=linen&minPrice=200&maxPrice=2000&size=L&sort=price_asc&page=1&limit=12
```

### Cart
| Method | Endpoint              | Access  | Description                  |
|--------|-----------------------|---------|------------------------------|
| GET    | `/api/cart`           | Private | View cart                    |
| POST   | `/api/cart`           | Private | Add item (checks stock)      |
| PUT    | `/api/cart/:itemId`   | Private | Update item quantity         |
| DELETE | `/api/cart/:itemId`   | Private | Remove one item              |
| DELETE | `/api/cart`           | Private | Clear entire cart            |

**Add to Cart Body:**
```json
{ "productId": "...", "quantity": 2, "size": "L" }
```

### Orders
| Method | Endpoint                    | Access  | Description                      |
|--------|-----------------------------|---------|----------------------------------|
| POST   | `/api/orders`               | Private | Place order from cart            |
| GET    | `/api/orders/my-orders`     | Private | Get user's order history         |
| GET    | `/api/orders/:id`           | Private | Get single order                 |
| PUT    | `/api/orders/:id/cancel`    | Private | Cancel a pending order           |
| GET    | `/api/orders`               | Admin   | Get all orders (filter by status)|
| PUT    | `/api/orders/:id/status`    | Admin   | Update order status              |

**Place Order Body:**
```json
{
  "addressId": "64abc...",
  "paymentMethod": "Online",
  "bulkOrderNote": "Need custom packaging (optional, for bulk)"
}
```

---

## 📦 Bulk Order Logic

- If the **total quantity** across all cart items **exceeds 50**, the order is automatically flagged as a bulk order.
- Status is set to `"Quote Requested"` instead of `"Pending"`.
- **Stock is NOT deducted** until an admin confirms the order via `PUT /api/orders/:id/status` with `{ "orderStatus": "Confirmed" }`.
- Payment method defaults to `"Bank Transfer"` for bulk orders.

---

## 🔍 MongoDB Atlas Search Index Setup

For fast, Amazon-like search, create a Search Index in Atlas:

1. Go to **Atlas → Your Cluster → Search → Create Search Index**
2. Use the **Visual Editor**, select the `products` collection
3. Add these fields:

```json
{
  "mappings": {
    "dynamic": false,
    "fields": {
      "name": { "type": "string", "analyzer": "lucene.standard" },
      "category": { "type": "string", "analyzer": "lucene.standard" },
      "subCategory": { "type": "string", "analyzer": "lucene.standard" },
      "description": { "type": "string", "analyzer": "lucene.standard" }
    }
  }
}
```

> **Note:** The current implementation uses MongoDB's built-in `$text` index as a fallback, which works without Atlas. For production, upgrade the `getProducts` controller to use the `$search` aggregation stage with the Atlas Search index above.

---

## 🛡️ Order Status Flow

```
[Cart] → POST /orders
           │
           ├─ qty ≤ 50 ──→ "Pending" → "Confirmed" → "Processing" → "Shipped" → "Delivered"
           │
           └─ qty > 50 ──→ "Quote Requested" → (Admin reviews) → "Confirmed" → "Processing" → "Shipped" → "Delivered"

Any stage before "Processing" can be → "Cancelled"
```
