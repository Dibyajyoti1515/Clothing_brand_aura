import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Grid3X3, Grid2X2 } from 'lucide-react';
import { productsApi } from '@/api/services';
import type { Product, ProductFilters } from '@/types';
import { ProductCard, ProductCardSkeleton } from '@/components/products/ProductCard';
import { FiltersPanel } from '@/components/products/FiltersPanel';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/index';
import { cn } from '@/utils';

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [grid, setGrid] = useState<'4' | '3'>('4');
  const [mobileFilters, setMobileFilters] = useState(false);
  const [search, setSearch] = useState(searchParams.get('search') ?? '');

  const [filters, setFilters] = useState<ProductFilters>({
    category: searchParams.get('category') ?? undefined,
    sort: (searchParams.get('sort') as ProductFilters['sort']) ?? 'newest',
  });

  const fetchProducts = useCallback(async (f: ProductFilters, p: number) => {
    setLoading(true);
    try {
      const res = await productsApi.getAll({ ...f, page: p, limit: 12 });
      setProducts(res.data.products);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(filters, page);
  }, [filters, page]);

  const handleFilterChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleFilterChange({ ...filters, search: search || undefined });
  };

  const handleClear = () => {
    setFilters({ sort: 'newest' });
    setSearch('');
    setPage(1);
    setSearchParams({});
  };

  return (
    <main className="min-h-screen bg-sand-50 pt-20">
      {/* Page Header */}
      <div className="border-b border-sand-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <h1 className="font-display text-4xl text-ink">
            {filters.category ? `${filters.category}'s Collection` : 'All Products'}
          </h1>
          <p className="font-mono text-xs text-ink-300 mt-2 tracking-widest uppercase">
            {loading ? '...' : `${total} items`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-8">
          <form onSubmit={handleSearch} className="flex-1 max-w-sm flex">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products…"
                className="w-full h-10 pl-9 pr-4 border border-sand-300 bg-white font-body text-sm focus:outline-none focus:border-ink text-ink placeholder:text-ink-300"
              />
            </div>
            <button type="submit" className="h-10 px-4 bg-ink text-sand-50 font-body text-sm hover:bg-ink-500 transition-colors">
              Search
            </button>
          </form>

          <button
            onClick={() => setMobileFilters(true)}
            className="lg:hidden h-10 w-10 flex items-center justify-center border border-sand-300 text-ink-400 hover:text-ink hover:border-ink transition-colors"
          >
            <SlidersHorizontal size={16} />
          </button>

          <div className="ml-auto hidden sm:flex items-center gap-1 border border-sand-300">
            <button
              onClick={() => setGrid('4')}
              className={cn('h-9 w-9 flex items-center justify-center transition-colors', grid === '4' ? 'bg-ink text-sand-50' : 'text-ink-400 hover:text-ink')}
            >
              <Grid3X3 size={14} />
            </button>
            <button
              onClick={() => setGrid('3')}
              className={cn('h-9 w-9 flex items-center justify-center transition-colors', grid === '3' ? 'bg-ink text-sand-50' : 'text-ink-400 hover:text-ink')}
            >
              <Grid2X2 size={14} />
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters */}
          <FiltersPanel
            filters={filters}
            onChange={handleFilterChange}
            onClear={handleClear}
            mobileOpen={mobileFilters}
            onMobileClose={() => setMobileFilters(false)}
          />

          {/* Grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className={cn('grid gap-x-4 gap-y-8', grid === '4' ? 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3')}>
                {Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <EmptyState
                icon={<Search size={40} />}
                title="No products found"
                description="Try adjusting your filters or search term"
                action={<Button variant="outline" onClick={handleClear}>Clear filters</Button>}
              />
            ) : (
              <>
                <div className={cn('grid gap-x-4 gap-y-8', grid === '4' ? 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3')}>
                  {products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={cn(
                          'h-9 w-9 font-mono text-sm transition-colors',
                          p === page ? 'bg-ink text-sand-50' : 'border border-sand-300 text-ink-400 hover:border-ink hover:text-ink'
                        )}
                      >
                        {p}
                      </button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(pages, p + 1))}
                      disabled={page === pages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
