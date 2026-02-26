import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart } from 'lucide-react';
import type { Product } from '@/types';
import { formatPrice, cn } from '@/utils';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const [hovered, setHovered] = useState(false);
  const [adding, setAdding] = useState(false);
  const { addItem, openCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please sign in to add items to cart');
      return;
    }
    if (product.sizes.length > 1) {
      // Navigate to product page for size selection
      return;
    }
    setAdding(true);
    try {
      await addItem(product._id, 1, product.sizes[0]);
      openCart();
      toast.success('Added to cart!');
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? 'Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  const displayPrice = product.discount > 0 ? product.discountedPrice ?? product.price : product.price;

  return (
    <div
      className="group animate-fade-in"
      style={{ animationDelay: `${index * 60}ms` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link to={`/products/${product._id}`} className="block">
        {/* Image */}
        <div className="relative overflow-hidden bg-sand-100 aspect-[3/4]">
          {product.images?.[0]?.url ? (
            <>
              <img
                src={product.images[0].url}
                alt={product.name}
                className={cn(
                  'w-full h-full object-cover transition-transform duration-500',
                  hovered ? 'scale-105' : 'scale-100'
                )}
              />
              {product.images?.[1]?.url && (
                <img
                  src={product.images[1].url}
                  alt={product.name}
                  className={cn(
                    'absolute inset-0 w-full h-full object-cover transition-opacity duration-500',
                    hovered ? 'opacity-100' : 'opacity-0'
                  )}
                />
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-ink-200">
              <ShoppingBag size={40} />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.discount > 0 && (
              <span className="bg-clay text-white font-mono text-[10px] tracking-wider px-2 py-0.5">
                -{product.discount}%
              </span>
            )}
            {product.stockQuantity === 0 && (
              <span className="bg-ink text-sand-200 font-mono text-[10px] tracking-wider px-2 py-0.5">
                SOLD OUT
              </span>
            )}
            {product.isFeatured && (
              <span className="bg-sage text-white font-mono text-[10px] tracking-wider px-2 py-0.5">
                FEATURED
              </span>
            )}
          </div>

          {/* Wishlist */}
          <button className="absolute top-3 right-3 h-8 w-8 flex items-center justify-center bg-white/80 backdrop-blur-sm text-ink-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
            <Heart size={14} />
          </button>

          {/* Quick Add */}
          <div
            className={cn(
              'absolute bottom-0 left-0 right-0 bg-ink text-sand-50 py-3 flex items-center justify-center gap-2',
              'font-body text-xs tracking-[0.08em] uppercase cursor-pointer',
              'transition-transform duration-300',
              hovered ? 'translate-y-0' : 'translate-y-full'
            )}
            onClick={handleQuickAdd}
          >
            {adding ? (
              <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <ShoppingBag size={12} />
            )}
            {product.sizes.length > 1 ? 'Select Size' : 'Quick Add'}
          </div>
        </div>

        {/* Info */}
        <div className="pt-3 pb-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-300">{product.category}</p>
          <h3 className="font-body font-medium text-sm text-ink mt-0.5 leading-snug">{product.name}</h3>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="font-body text-sm font-semibold text-ink">{formatPrice(displayPrice)}</span>
            {product.discount > 0 && (
              <span className="font-body text-xs text-ink-300 line-through">{formatPrice(product.price)}</span>
            )}
          </div>
          {/* Available sizes */}
          <div className="flex gap-1 mt-2">
            {product.sizes.slice(0, 5).map((s) => (
              <span key={s} className="font-mono text-[9px] text-ink-300 border border-sand-300 px-1 py-0.5">
                {s}
              </span>
            ))}
            {product.sizes.length > 5 && (
              <span className="font-mono text-[9px] text-ink-300">+{product.sizes.length - 5}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

// Skeleton loader version
export const ProductCardSkeleton: React.FC = () => (
  <div>
    <div className="aspect-[3/4] bg-gradient-to-r from-sand-200 via-sand-100 to-sand-200 bg-[length:200%_100%] animate-shimmer" />
    <div className="pt-3 space-y-2">
      <div className="h-3 w-16 bg-sand-200 animate-pulse" />
      <div className="h-4 w-3/4 bg-sand-200 animate-pulse" />
      <div className="h-4 w-1/3 bg-sand-200 animate-pulse" />
    </div>
  </div>
);
