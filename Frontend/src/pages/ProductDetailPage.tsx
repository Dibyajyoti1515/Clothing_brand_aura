import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, ChevronRight, Package, Truck } from 'lucide-react';
import { productsApi } from '@/api/services';
import type { Product, Size } from '@/types';
import { Button } from '@/components/ui/Button';
import { ProductCardSkeleton } from '@/components/products/ProductCard';
import { formatPrice, cn } from '@/utils';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const { addItem, openCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    productsApi.getById(id).then((res) => {
      setProduct(res.data.product);
      if (res.data.product.sizes.length === 1) {
        setSelectedSize(res.data.product.sizes[0]);
      }
    }).catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) { toast.error('Please sign in first'); return; }
    if (!selectedSize) { toast.error('Please select a size'); return; }
    if (!product) return;
    setAdding(true);
    try {
      await addItem(product._id, quantity, selectedSize);
      openCart();
      toast.success('Added to cart!');
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? 'Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <main className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <ProductCardSkeleton />
          <div className="space-y-4">
            <div className="h-8 w-2/3 bg-sand-200 animate-pulse" />
            <div className="h-6 w-1/3 bg-sand-200 animate-pulse" />
            <div className="h-24 bg-sand-200 animate-pulse" />
          </div>
        </div>
      </main>
    );
  }

  if (!product) return null;

  const displayPrice = product.discount > 0 ? (product.discountedPrice ?? product.price) : product.price;
  const isBulkEligible = quantity > 50;

  return (
    <main className="pt-20 bg-sand-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 mb-8 font-mono text-xs text-ink-300">
          <Link to="/" className="hover:text-ink transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link to="/products" className="hover:text-ink transition-colors">Products</Link>
          <ChevronRight size={12} />
          <span className="text-ink-400">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-10 xl:gap-16">
          {/* Images */}
          <div className="flex gap-4">
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex flex-col gap-2 w-16">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={cn('w-16 h-20 overflow-hidden border-2 transition-colors', selectedImage === i ? 'border-ink' : 'border-transparent')}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            {/* Main Image */}
            <div className="flex-1 aspect-[3/4] bg-sand-100 overflow-hidden">
              {product.images[selectedImage]?.url ? (
                <img
                  src={product.images[selectedImage].url}
                  alt={product.name}
                  className="w-full h-full object-cover animate-fade-in"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-ink-200">
                  <ShoppingBag size={60} />
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="animate-slide-up">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-clay mb-1">{product.category}</p>
                <h1 className="font-display text-3xl text-ink">{product.name}</h1>
              </div>
              {product.stockQuantity <= 5 && product.stockQuantity > 0 && (
                <span className="font-mono text-[10px] bg-clay/10 text-clay-dark px-2 py-1 whitespace-nowrap">
                  Only {product.stockQuantity} left
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 mt-4">
              <span className="font-display text-2xl text-ink">{formatPrice(displayPrice)}</span>
              {product.discount > 0 && (
                <>
                  <span className="font-body text-sm text-ink-300 line-through">{formatPrice(product.price)}</span>
                  <span className="font-mono text-xs bg-clay text-white px-2 py-0.5">-{product.discount}%</span>
                </>
              )}
            </div>

            <p className="font-body text-sm text-ink-400 leading-relaxed mt-5">{product.description}</p>

            {/* Size Selector */}
            <div className="mt-7">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs uppercase tracking-[0.12em] text-ink-400">Select Size</span>
                <span className="font-mono text-xs text-clay cursor-pointer hover:underline">Size Guide</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s as Size)}
                    className={cn(
                      'h-10 min-w-[2.75rem] px-3 border font-mono text-sm transition-all',
                      selectedSize === s
                        ? 'border-ink bg-ink text-sand-50'
                        : 'border-sand-300 text-ink hover:border-ink',
                      product.stockQuantity === 0 && 'opacity-40 cursor-not-allowed line-through'
                    )}
                    disabled={product.stockQuantity === 0}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mt-6">
              <span className="font-mono text-xs uppercase tracking-[0.12em] text-ink-400 mb-3 block">Quantity</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-sand-300">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="h-10 w-10 flex items-center justify-center text-ink-400 hover:text-ink hover:bg-sand-100 transition-colors font-mono text-lg"
                  >
                    −
                  </button>
                  <span className="h-10 w-12 flex items-center justify-center font-mono text-sm text-ink border-x border-sand-300">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="h-10 w-10 flex items-center justify-center text-ink-400 hover:text-ink hover:bg-sand-100 transition-colors font-mono text-lg"
                  >
                    +
                  </button>
                </div>
                {isBulkEligible && (
                  <span className="font-mono text-xs bg-clay/10 text-clay-dark px-3 py-1.5">
                    ✦ Bulk order — quote will be requested
                  </span>
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 space-y-3">
              <Button
                fullWidth
                size="lg"
                onClick={handleAddToCart}
                loading={adding}
                disabled={product.stockQuantity === 0}
              >
                <ShoppingBag size={18} />
                {product.stockQuantity === 0 ? 'Out of Stock' : isBulkEligible ? 'Request Bulk Quote' : 'Add to Cart'}
              </Button>
            </div>

            {/* Meta */}
            <div className="mt-8 pt-6 border-t border-sand-200 space-y-3">
              <div className="flex items-center gap-2.5 text-ink-400">
                <Truck size={14} />
                <span className="font-body text-xs">Free shipping on orders above ₹1,999</span>
              </div>
              <div className="flex items-center gap-2.5 text-ink-400">
                <Package size={14} />
                <span className="font-body text-xs">SKU: {product._id.slice(-8).toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
