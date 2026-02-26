import React from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import type { ProductFilters } from '@/types';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils';

interface FiltersPanelProps {
  filters: ProductFilters;
  onChange: (filters: ProductFilters) => void;
  onClear: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const CATEGORIES = ['Men', 'Women', 'Kids', 'Accessories', 'Footwear'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

export const FiltersPanel: React.FC<FiltersPanelProps> = ({
  filters,
  onChange,
  onClear,
  mobileOpen,
  onMobileClose,
}) => {
  const activeCount = [filters.category, filters.size, filters.minPrice, filters.maxPrice, filters.sort].filter(Boolean).length;

  const content = (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-ink-400" />
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-ink">Filters</span>
          {activeCount > 0 && (
            <span className="font-mono text-[10px] bg-clay text-white px-1.5 py-0.5">{activeCount}</span>
          )}
        </div>
        {activeCount > 0 && (
          <button onClick={onClear} className="font-mono text-[10px] uppercase tracking-wide text-clay hover:text-clay-dark transition-colors">
            Clear all
          </button>
        )}
      </div>

      {/* Sort */}
      <div>
        <h3 className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-400 mb-3">Sort By</h3>
        <div className="space-y-2">
          {SORT_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
              <div
                className={cn(
                  'h-3.5 w-3.5 border transition-colors',
                  filters.sort === opt.value ? 'border-ink bg-ink' : 'border-sand-300 group-hover:border-ink-300'
                )}
                onClick={() => onChange({ ...filters, sort: opt.value as ProductFilters['sort'] })}
              />
              <span className="font-body text-sm text-ink-400 group-hover:text-ink transition-colors">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <h3 className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-400 mb-3">Category</h3>
        <div className="space-y-2">
          {CATEGORIES.map((cat) => (
            <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
              <div
                className={cn(
                  'h-3.5 w-3.5 border transition-colors',
                  filters.category === cat ? 'border-ink bg-ink' : 'border-sand-300 group-hover:border-ink-300'
                )}
                onClick={() => onChange({ ...filters, category: filters.category === cat ? undefined : cat })}
              />
              <span className="font-body text-sm text-ink-400 group-hover:text-ink transition-colors">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Size */}
      <div>
        <h3 className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-400 mb-3">Size</h3>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => onChange({ ...filters, size: filters.size === s ? undefined : s })}
              className={cn(
                'h-8 min-w-[2rem] px-2 border font-mono text-xs transition-colors',
                filters.size === s
                  ? 'border-ink bg-ink text-sand-50'
                  : 'border-sand-300 text-ink-400 hover:border-ink hover:text-ink'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-400 mb-3">Price Range</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice ?? ''}
            onChange={(e) => onChange({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })}
            className="w-full h-9 border border-sand-300 bg-sand-50 px-3 font-body text-sm focus:outline-none focus:border-ink text-ink placeholder:text-ink-300"
          />
          <span className="font-mono text-xs text-ink-300">—</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice ?? ''}
            onChange={(e) => onChange({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })}
            className="w-full h-9 border border-sand-300 bg-sand-50 px-3 font-body text-sm focus:outline-none focus:border-ink text-ink placeholder:text-ink-300"
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:block w-52 flex-shrink-0 pt-2">{content}</aside>

      {/* Mobile Drawer */}
      {mobileOpen && <div className="fixed inset-0 z-50 bg-ink/30" onClick={onMobileClose} />}
      <div
        className={cn(
          'fixed left-0 top-0 h-full w-72 z-50 bg-sand-50 shadow-xl p-6 lg:hidden overflow-y-auto',
          'transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <button onClick={onMobileClose} className="absolute top-4 right-4 text-ink-400 hover:text-ink">
          <X size={18} />
        </button>
        {content}
      </div>
    </>
  );
};
