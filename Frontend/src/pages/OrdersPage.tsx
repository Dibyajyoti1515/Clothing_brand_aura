import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, X } from 'lucide-react';
import { ordersApi } from '@/api/services';
import type { Order } from '@/types';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/index';
import { formatPrice, formatDate, getOrderStatusColor, cn } from '@/utils';
import toast from 'react-hot-toast';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    ordersApi.getMyOrders().then((res) => setOrders(res.data.orders)).finally(() => setLoading(false));
  }, []);

  const handleCancel = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    setCancellingId(orderId);
    try {
      const res = await ordersApi.cancel(orderId);
      setOrders((prev) => prev.map((o) => (o._id === orderId ? res.data.order : o)));
      toast.success('Order cancelled');
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? 'Failed to cancel order');
    } finally {
      setCancellingId(null);
    }
  };

  const statusSteps = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];

  return (
    <main className="min-h-screen bg-sand-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-clay mb-1">Account</p>
          <h1 className="font-display text-4xl text-ink">My Orders</h1>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white h-40 animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <EmptyState
            icon={<Package size={48} />}
            title="No orders yet"
            description="Start shopping to see your orders here"
            action={<Link to="/products"><Button>Start Shopping</Button></Link>}
          />
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const isCancellable = ['Pending', 'Quote Requested'].includes(order.orderStatus);
              const isSpecialStatus = ['Quote Requested', 'Cancelled'].includes(order.orderStatus);
              const currentStep = statusSteps.indexOf(order.orderStatus);

              return (
                <div key={order._id} className="bg-white border border-sand-200 animate-fade-in">
                  {/* Order Header */}
                  <div className="px-6 py-4 border-b border-sand-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-ink-300">Order ID</p>
                        <p className="font-mono text-xs text-ink">#{order._id.slice(-8).toUpperCase()}</p>
                      </div>
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-ink-300">Date</p>
                        <p className="font-body text-xs text-ink">{formatDate(order.createdAt)}</p>
                      </div>
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-ink-300">Total</p>
                        <p className="font-body text-sm font-semibold text-ink">{formatPrice(order.totalPrice)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {order.isBulkOrder && (
                        <span className="font-mono text-[10px] uppercase tracking-wider bg-clay/10 text-clay-dark px-2 py-0.5">
                          Bulk
                        </span>
                      )}
                      <span className={cn('font-mono text-[10px] uppercase tracking-wider px-2.5 py-1', getOrderStatusColor(order.orderStatus))}>
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="px-6 py-4 space-y-3">
                    {order.orderItems.slice(0, 2).map((item) => (
                      <div key={item._id} className="flex items-center gap-3">
                        <div className="h-12 w-10 bg-sand-100 flex-shrink-0 overflow-hidden">
                          {typeof item.product !== 'string' && item.product.images?.[0]?.url ? (
                            <img src={item.product.images[0].url} alt={item.name} className="w-full h-full object-cover" />
                          ) : null}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-body text-sm text-ink truncate">{item.name}</p>
                          <p className="font-mono text-xs text-ink-300">
                            Size {item.size} · Qty {item.quantity} · {formatPrice(item.priceAtPurchase)}
                          </p>
                        </div>
                      </div>
                    ))}
                    {order.orderItems.length > 2 && (
                      <p className="font-mono text-xs text-ink-400">+{order.orderItems.length - 2} more items</p>
                    )}
                  </div>

                  {/* Progress Bar (normal orders only) */}
                  {!isSpecialStatus && (
                    <div className="px-6 py-4 border-t border-sand-100">
                      <div className="flex items-center">
                        {statusSteps.map((step, i) => (
                          <React.Fragment key={step}>
                            <div className="flex flex-col items-center gap-1">
                              <div className={cn(
                                'h-2 w-2 rounded-full transition-colors',
                                i <= currentStep ? 'bg-sage' : 'bg-sand-300'
                              )} />
                              <span className="font-mono text-[8px] uppercase tracking-wide text-ink-300 hidden sm:block">
                                {step}
                              </span>
                            </div>
                            {i < statusSteps.length - 1 && (
                              <div className={cn('flex-1 h-px mx-1', i < currentStep ? 'bg-sage' : 'bg-sand-200')} />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  {isCancellable && (
                    <div className="px-6 py-3 border-t border-sand-100 flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCancel(order._id)}
                        loading={cancellingId === order._id}
                        className="text-red-500 hover:bg-red-50 hover:text-red-600"
                      >
                        <X size={14} /> Cancel Order
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};
