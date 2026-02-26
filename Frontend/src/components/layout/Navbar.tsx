import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Search, Menu, X, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { cn, getInitials } from '@/utils';

const NAV_LINKS = [
  { label: 'Men', href: '/products?category=Men' },
  { label: 'Women', href: '/products?category=Women' },
  { label: 'Kids', href: '/products?category=Kids' },
  { label: 'Accessories', href: '/products?category=Accessories' },
  { label: 'Sale', href: '/products?sort=price_asc' },
];

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { cart, toggleCart, fetchCart } = useCartStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchCart();
  }, [isAuthenticated]);

  const cartCount = cart?.totalItems ?? 0;

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled ? 'bg-sand-50/95 backdrop-blur-sm border-b border-sand-200 shadow-sm' : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-1">
              <span className="font-display text-2xl font-semibold tracking-[0.15em] text-ink">AURA</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className={cn(
                    'font-body text-sm tracking-[0.06em] transition-colors duration-150',
                    'text-ink-400 hover:text-ink relative group'
                  )}
                >
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-clay transition-all duration-200 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <Link
                to="/products"
                className="h-9 w-9 flex items-center justify-center text-ink-400 hover:text-ink hover:bg-sand-200 transition-colors"
              >
                <Search size={18} />
              </Link>

              {/* Cart */}
              <button
                onClick={toggleCart}
                className="h-9 w-9 flex items-center justify-center text-ink-400 hover:text-ink hover:bg-sand-200 transition-colors relative"
              >
                <ShoppingBag size={18} />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 bg-clay text-white text-[9px] font-mono font-bold flex items-center justify-center rounded-full">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>

              {/* User */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className="h-9 w-9 flex items-center justify-center bg-ink text-sand-50 text-xs font-mono font-bold hover:bg-ink-500 transition-colors"
                  >
                    {getInitials(user?.name ?? 'U')}
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-11 w-48 bg-white border border-sand-200 shadow-lg animate-scale-in z-50">
                      <div className="px-4 py-3 border-b border-sand-100">
                        <p className="text-xs font-body text-ink-400">Signed in as</p>
                        <p className="text-sm font-body font-medium text-ink truncate">{user?.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          to="/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm font-body text-ink hover:bg-sand-50 transition-colors"
                        >
                          <User size={14} /> My Profile
                        </Link>
                        <Link
                          to="/orders"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm font-body text-ink hover:bg-sand-50 transition-colors"
                        >
                          <ShoppingBag size={14} /> My Orders
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-body text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={14} /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="h-9 w-9 flex items-center justify-center text-ink-400 hover:text-ink hover:bg-sand-200 transition-colors"
                >
                  <User size={18} />
                </Link>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="md:hidden h-9 w-9 flex items-center justify-center text-ink-400 hover:text-ink transition-colors"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-sand-50 border-t border-sand-200 animate-slide-up">
            <nav className="px-6 py-4 flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-body text-base text-ink-400 hover:text-ink transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="font-body text-base text-clay"
                >
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Overlay for user menu */}
      {userMenuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
      )}
    </>
  );
};
