import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Package, Truck, RotateCcw, Headphones } from 'lucide-react';
import { productsApi } from '@/api/services';
import type { Product } from '@/types';
import { ProductCard, ProductCardSkeleton } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/Button';

const CATEGORIES = [
  { label: 'Men', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80', href: '/products?category=Men' },
  { label: 'Women', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&q=80', href: '/products?category=Women' },
  { label: 'Kids', image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600&q=80', href: '/products?category=Kids' },
  { label: 'Accessories', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80', href: '/products?category=Accessories' },
];

const PERKS = [
  { icon: <Truck size={20} />, label: 'Free Shipping', sub: 'On orders above ₹1,999' },
  { icon: <RotateCcw size={20} />, label: 'Easy Returns', sub: '15-day hassle-free returns' },
  { icon: <Package size={20} />, label: 'Bulk Orders', sub: 'Custom quotes for 50+ units' },
  { icon: <Headphones size={20} />, label: '24/7 Support', sub: 'Always here to help' },
];

export const HomePage: React.FC = () => {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsApi.getAll({ limit: 8, sort: 'newest' }).then((res) => {
      setFeatured(res.data.products);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <main>
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center overflow-hidden bg-ink">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1800&q=85)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/60 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8">
          <div className="max-w-2xl animate-slide-up">
            <p className="font-mono text-xs tracking-[0.25em] uppercase text-clay-light mb-4">New Collection 2024</p>
            <h1 className="font-display text-5xl sm:text-7xl font-normal text-sand-50 leading-[1.05] mb-6">
              Wear What<br />
              <em className="text-sand-300">Moves</em> You
            </h1>
            <p className="font-body text-base text-sand-300 leading-relaxed mb-10 max-w-md">
              Contemporary clothing designed for the everyday individual — quality that speaks without shouting.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products">
                <Button size="lg" className="bg-sand-50 text-ink hover:bg-sand-200">
                  Shop Now <ArrowRight size={16} />
                </Button>
              </Link>
              <Link to="/products?category=Men">
                <Button size="lg" variant="outline" className="border-sand-400 text-sand-200 hover:bg-sand-200/10 hover:border-sand-200">
                  Explore Men
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Perks Bar ─────────────────────────────────────────────────── */}
      <section className="bg-sand-200 border-y border-sand-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-sand-300">
            {PERKS.map(({ icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3 px-6 py-4">
                <span className="text-clay flex-shrink-0">{icon}</span>
                <div>
                  <p className="font-body text-sm font-semibold text-ink">{label}</p>
                  <p className="font-body text-xs text-ink-400">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category Grid ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-clay mb-1">Explore</p>
            <h2 className="font-display text-3xl text-ink">Shop by Category</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {CATEGORIES.map(({ label, image, href }, i) => (
            <Link key={label} to={href} className="group relative overflow-hidden aspect-[3/4] bg-sand-200">
              <img
                src={image}
                alt={label}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="font-display text-xl text-sand-50">{label}</h3>
                <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="font-body text-xs text-sand-300">Shop now</span>
                  <ArrowRight size={12} className="text-sand-300" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-clay mb-1">Curated</p>
            <h2 className="font-display text-3xl text-ink">Latest Arrivals</h2>
          </div>
          <Link to="/products" className="hidden sm:flex items-center gap-1.5 font-body text-sm text-ink-400 hover:text-clay transition-colors">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : featured.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)
          }
        </div>

        {!loading && (
          <div className="flex justify-center mt-12">
            <Link to="/products">
              <Button variant="outline" size="lg">
                View All Products <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        )}
      </section>

      {/* ── Bulk Order CTA ─────────────────────────────────────────────── */}
      <section className="bg-ink mx-4 sm:mx-6 mb-16 max-w-7xl lg:mx-auto">
        <div className="px-8 py-14 md:py-20 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="font-mono text-xs tracking-[0.2em] uppercase text-clay-light mb-3">For Businesses</p>
            <h2 className="font-display text-3xl text-sand-50 mb-3">Bulk Orders & Custom Quotes</h2>
            <p className="font-body text-sand-400 max-w-md leading-relaxed">
              Order 50+ units and get a personalised quote with priority processing, custom packaging, and dedicated account support.
            </p>
          </div>
          <Link to="/products" className="flex-shrink-0">
            <Button size="lg" className="bg-clay hover:bg-clay-dark text-white whitespace-nowrap">
              Request a Quote <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
};
