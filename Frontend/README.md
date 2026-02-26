# 👗 AURA — Clothing Brand Frontend

A production-grade React + TypeScript + Tailwind CSS frontend for the AURA clothing brand e-commerce platform. Crafted with editorial aesthetics, intentional typography, and a refined sand/ink/clay color palette.

---

## 🗂️ Project Structure

```
src/
├── api/
│   ├── client.ts          # Axios instance with JWT interceptors
│   └── services.ts        # All API calls (auth, products, cart, orders)
│
├── components/
│   ├── auth/
│   │   └── ProtectedRoute.tsx  # Route guards (ProtectedRoute, GuestRoute)
│   ├── cart/
│   │   └── CartDrawer.tsx      # Slide-in cart drawer with quantity controls
│   ├── layout/
│   │   ├── Navbar.tsx          # Sticky nav with cart badge, user menu
│   │   └── Footer.tsx          # Footer with links and bulk order CTA
│   ├── products/
│   │   ├── ProductCard.tsx     # Card with hover reveal, quick-add
│   │   └── FiltersPanel.tsx    # Desktop sidebar + mobile drawer filters
│   └── ui/
│       ├── Button.tsx          # Multi-variant button
│       ├── Input.tsx           # Input + Select with labels
│       └── index.ts            # Badge, Skeleton, EmptyState, Divider
│
├── hooks/                 # (placeholder for custom hooks)
│
├── pages/
│   ├── HomePage.tsx           # Hero, category grid, featured products
│   ├── ProductsPage.tsx       # Search + filters + paginated grid
│   ├── ProductDetailPage.tsx  # Gallery, size selector, bulk quantity logic
│   ├── AuthPages.tsx          # Login + Signup (split-screen)
│   ├── CheckoutPage.tsx       # Address, payment, order summary
│   ├── OrdersPage.tsx         # Order history with status tracker
│   └── ProfilePage.tsx        # Account info + address book tabs
│
├── store/
│   ├── authStore.ts      # Zustand auth store (persisted)
│   └── cartStore.ts      # Zustand cart store
│
├── types/
│   └── index.ts          # All TypeScript interfaces
│
├── utils/
│   └── index.ts          # formatPrice, formatDate, cn, getInitials, etc.
│
├── App.tsx               # BrowserRouter + all routes
├── main.tsx              # React DOM entry
└── index.css             # Tailwind directives + global styles
```

---

## 🚀 Setup

```bash
# Install dependencies
npm install

# Start dev server (proxies /api → http://localhost:5000)
npm run dev

# Build for production
npm run build
```

> Make sure the backend from `clothing-api/` is running on port 5000.

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| `ink` | `#0D0D0D` | Primary text, buttons |
| `sand` | `#E8E0D0` | Backgrounds, borders |
| `clay` | `#C4724A` | Accents, badges, CTAs |
| `sage` | `#7A8C72` | Success, confirmed states |
| `font-display` | Playfair Display | Headings, brand |
| `font-body` | DM Sans | Body copy, UI |
| `font-mono` | DM Mono | Labels, metadata, tags |

---

## 📡 API Integration Map

| Page | API Calls |
|------|-----------|
| Home | `GET /products?limit=8` |
| Products | `GET /products?category=&search=&size=&sort=&page=` |
| Product Detail | `GET /products/:id` |
| Login | `POST /auth/login` |
| Signup | `POST /auth/signup` |
| Cart Drawer | `GET /cart`, `POST /cart`, `PUT /cart/:id`, `DELETE /cart/:id` |
| Checkout | `GET /auth/me`, `POST /auth/address`, `POST /orders` |
| Orders | `GET /orders/my-orders`, `PUT /orders/:id/cancel` |
| Profile | `GET /auth/me`, `POST /auth/address` |

---

## ✨ Key Features

**Bulk Order Flow**
When cart quantity exceeds 50 items, the product detail page shows a "Request Bulk Quote" CTA, checkout shows a bulk order warning banner and note field, and the order is submitted as `Quote Requested` with no payment required.

**Cart Drawer**
Slides in from right. Real-time stock validation on quantity change. Price snapshot from time of adding. Virtual total calculated on the fly.

**Smart Routing**
`ProtectedRoute` redirects unauthenticated users to `/login`. `GuestRoute` redirects logged-in users away from auth pages. JWT automatically attached to all requests via Axios interceptor.

**Order Status Tracker**
Visual step progress bar on the orders page. Colour-coded status badges. Cancel button visible only for `Pending` and `Quote Requested` orders.
