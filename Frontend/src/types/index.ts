// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface Address {
  _id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  addresses?: Address[];
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  message: string;
}

// ─── Product ──────────────────────────────────────────────────────────────────
export type Category = 'Men' | 'Women' | 'Kids' | 'Accessories' | 'Footwear';
export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'Free Size';

export interface ProductImage {
  url: string;
  altText?: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  subCategory?: string;
  sizes: Size[];
  stockQuantity: number;
  images: ProductImage[];
  isFeatured: boolean;
  discount: number;
  discountedPrice?: number;
  createdAt: string;
}

export interface ProductFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  page?: number;
  limit?: number;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'relevance';
}

export interface ProductsResponse {
  success: boolean;
  total: number;
  page: number;
  pages: number;
  products: Product[];
}

// ─── Cart ─────────────────────────────────────────────────────────────────────
export interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
  size: Size;
  priceAtAddition: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
}

// ─── Order ────────────────────────────────────────────────────────────────────
export type OrderStatus =
  | 'Pending'
  | 'Quote Requested'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export type PaymentMethod = 'COD' | 'Online' | 'Bank Transfer';

export interface OrderItem {
  _id: string;
  product: Product | string;
  name: string;
  quantity: number;
  size: string;
  priceAtPurchase: number;
}

export interface Order {
  _id: string;
  user: User | string;
  orderItems: OrderItem[];
  shippingAddress: Omit<Address, '_id' | 'isDefault'>;
  totalPrice: number;
  isBulkOrder: boolean;
  bulkOrderNote?: string;
  orderStatus: OrderStatus;
  paymentMethod: PaymentMethod;
  isPaid: boolean;
  paidAt?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── API ──────────────────────────────────────────────────────────────────────
export interface ApiError {
  success: false;
  message: string;
}

export interface ApiSuccess<T> {
  success: true;
  data?: T;
  message?: string;
}
