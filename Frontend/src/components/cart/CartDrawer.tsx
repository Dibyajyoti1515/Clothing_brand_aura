import React from 'react';
import { Link } from 'react-router-dom';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/index';
import { formatPrice } from '@/utils';
import toast from 'react-hot-toast';

export const CartDrawer: React.FC = () => {
  const { cart, isOpen, closeCart, updateItem, removeItem, isLoading } = useCartStore();

  const handleUpdateQty = async (itemId: string, newQty: number) => {
    try {
      if (newQty < 1) {
        await removeItem(itemId);
        toast.success('Item removed');
      } else {
        await updateItem(itemId, newQty);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? 'Failed to update cart');
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-[2px] transition-opacity"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-[420px] z-50 bg-sand-50 shadow-2xl flex flex-col
          transition-transform duration-350 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-sand-200">
          <div className="flex items-center gap-3">
            <span className="font-display text-xl text-ink">Your Cart</span>
            {(cart?.totalItems ?? 0) > 0 && (
              <span className="font-mono text-xs bg-ink text-sand-50 px-2 py-0.5">
                {cart?.totalItems} items
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="h-9 w-9 flex items-center justify-center text-ink-400 hover:text-ink hover:bg-sand-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-4 px-6 space-y-5">
          {!cart || cart.items.length === 0 ? (
            <EmptyState
              icon={<ShoppingBag size={48} />}
              title="Your cart is empty"
              description="Add some items to get started"
              action={
                <Button variant="outline" size="sm" onClick={closeCart}>
                  Continue Shopping
                </Button>
              }
            />
          ) : (
            cart.items.map((item) => (
              <div key={item._id} className="flex gap-4 animate-fade-in">
                {/* Product Image */}
                <div className="w-20 h-24 bg-sand-200 flex-shrink-0 overflow-hidden">
                  {item.product.images?.[0]?.url ? (
                    <img
                      src={item.product.images[0].url}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-ink-300">
                      <ShoppingBag size={20} />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="font-body font-medium text-ink text-sm leading-tight truncate">
                    {item.product.name}
                  </p>
                  <p className="font-mono text-xs text-ink-300 mt-0.5">Size: {item.size}</p>
                  <p className="font-body text-sm font-semibold text-ink mt-1">
                    {formatPrice(item.priceAtAddition)}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    {/* Qty controls */}
                    <div className="flex items-center border border-sand-300">
                      <button
                        onClick={() => handleUpdateQty(item._id, item.quantity - 1)}
                        className="h-7 w-7 flex items-center justify-center text-ink-400 hover:text-ink hover:bg-sand-200 transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="h-7 w-8 flex items-center justify-center font-mono text-xs text-ink border-x border-sand-300">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQty(item._id, item.quantity + 1)}
                        className="h-7 w-7 flex items-center justify-center text-ink-400 hover:text-ink hover:bg-sand-200 transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => handleUpdateQty(item._id, 0)}
                      className="text-ink-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart && cart.items.length > 0 && (
          <div className="border-t border-sand-200 px-6 py-5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-mono text-xs uppercase tracking-widest text-ink-400">Subtotal</span>
              <span className="font-display text-xl text-ink">{formatPrice(cart.totalPrice)}</span>
            </div>
            <p className="font-body text-xs text-ink-300">Shipping and taxes calculated at checkout</p>
            <Link to="/checkout" onClick={closeCart}>
              <Button fullWidth size="lg" className="mt-2">
                Proceed to Checkout
              </Button>
            </Link>
            <Button variant="ghost" fullWidth size="sm" onClick={closeCart}>
              Continue Shopping
            </Button>
          </div>
        )}
      </div>
    </>
  );
};
