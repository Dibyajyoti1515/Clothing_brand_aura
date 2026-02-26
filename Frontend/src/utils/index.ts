import { clsx, type ClassValue } from 'clsx';

export const cn = (...inputs: ClassValue[]) => clsx(inputs);

export const formatPrice = (amount: number): string =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

export const formatDate = (dateStr: string): string =>
  new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(dateStr));

export const getOrderStatusColor = (status: string): string => {
  const map: Record<string, string> = {
    'Pending': 'bg-sand-200 text-ink-500',
    'Quote Requested': 'bg-clay/10 text-clay-dark',
    'Confirmed': 'bg-sage/10 text-sage-dark',
    'Processing': 'bg-blue-50 text-blue-700',
    'Shipped': 'bg-purple-50 text-purple-700',
    'Delivered': 'bg-green-50 text-green-700',
    'Cancelled': 'bg-red-50 text-red-600',
  };
  return map[status] ?? 'bg-sand-100 text-ink-400';
};

export const getInitials = (name: string): string =>
  name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

export const truncate = (str: string, len: number): string =>
  str.length > len ? str.slice(0, len) + '…' : str;
