import api from './client';
import type {
  AuthResponse,
  Cart,
  Order,
  Product,
  ProductFilters,
  ProductsResponse,
  User,
  Address,
} from '@/types';

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  signup: (data: { name: string; email: string; password: string }) =>
    api.post<AuthResponse>('/auth/signup', data),

  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data),

  getMe: () => api.get<{ success: boolean; user: User & { addresses: Address[] } }>('/auth/me'),

  addAddress: (data: Omit<Address, '_id'>) =>
    api.post<{ success: boolean; addresses: Address[] }>('/auth/address', data),
};

// ─── Products ─────────────────────────────────────────────────────────────────
export const productsApi = {
  getAll: (filters: ProductFilters = {}) =>
    api.get<ProductsResponse>('/products', { params: filters }),

  getById: (id: string) =>
    api.get<{ success: boolean; product: Product }>(`/products/${id}`),

  create: (data: Partial<Product>) =>
    api.post<{ success: boolean; product: Product }>('/products', data),

  update: (id: string, data: Partial<Product>) =>
    api.put<{ success: boolean; product: Product }>(`/products/${id}`, data),

  delete: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/products/${id}`),
};

// ─── Cart ─────────────────────────────────────────────────────────────────────
export const cartApi = {
  get: () => api.get<{ success: boolean; cart: Cart }>('/cart'),

  add: (data: { productId: string; quantity: number; size: string }) =>
    api.post<{ success: boolean; cart: Cart }>('/cart', data),

  update: (itemId: string, quantity: number) =>
    api.put<{ success: boolean; cart: Cart }>(`/cart/${itemId}`, { quantity }),

  remove: (itemId: string) =>
    api.delete<{ success: boolean; cart: Cart }>(`/cart/${itemId}`),

  clear: () => api.delete<{ success: boolean; message: string }>('/cart'),
};

// ─── Orders ───────────────────────────────────────────────────────────────────
export const ordersApi = {
  create: (data: { addressId?: string; paymentMethod: string; bulkOrderNote?: string }) =>
    api.post<{ success: boolean; order: Order; message: string }>('/orders', data),

  getMyOrders: () =>
    api.get<{ success: boolean; orders: Order[]; count: number }>('/orders/my-orders'),

  getById: (id: string) =>
    api.get<{ success: boolean; order: Order }>(`/orders/${id}`),

  cancel: (id: string) =>
    api.put<{ success: boolean; order: Order; message: string }>(`/orders/${id}/cancel`),

  // Admin
  getAll: (params?: { status?: string; isBulk?: boolean; page?: number }) =>
    api.get<{ success: boolean; orders: Order[]; total: number }>('/orders', { params }),

  updateStatus: (id: string, data: { orderStatus: string; trackingNumber?: string }) =>
    api.put<{ success: boolean; order: Order }>(`/orders/${id}/status`, data),
};
