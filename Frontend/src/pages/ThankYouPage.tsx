import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Home, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils';

const STEPS = [
  { label: 'Order Placed', sub: 'We received your order', done: true },
  { label: 'Processing', sub: 'We\'re preparing your items', done: false },
  { label: 'Shipped', sub: 'On its way to you', done: false },
  { label: 'Delivered', sub: 'Enjoy your AURA pieces!', done: false },
];

const TIPS = [
  'You will receive a confirmation email shortly with your order details.',
  'Track your order anytime from My Orders in your account.',
  'Our team is available if you need to make any changes within 1 hour of placing the order.',
];

export const ThankYouPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [tickVisible, setTickVisible] = useState(false);

  // Grab order info passed via router state, or show generic confirmation
  const order = location.state?.order;
  const isBulk = order?.isBulkOrder;

  useEffect(() => {
    window.scrollTo({ top: 0 });
    // Stagger the entrance animations
    const t1 = setTimeout(() => setVisible(true), 100);
    const t2 = setTimeout(() => setTickVisible(true), 300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <main className="min-h-screen bg-sand-50 pt-20 flex flex-col">
      <div className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-xl">

          {/* Success mark */}
          <div
            className={cn(
              'flex flex-col items-center text-center mb-10 transition-all duration-700',
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            )}
          >
            {/* Animated circle + check */}
            <div className="relative mb-8">
              <div
                className={cn(
                  'h-24 w-24 rounded-full border-2 transition-all duration-500',
                  tickVisible ? 'border-sage bg-sage/5' : 'border-sand-300 bg-transparent'
                )}
              />
              <div
                className={cn(
                  'absolute inset-0 flex items-center justify-center transition-all duration-500',
                  tickVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                )}
              >
                <CheckCircle size={36} className="text-sage-dark" />
              </div>
              {/* Radiating rings */}
              {tickVisible && (
                <>
                  <div className="absolute inset-0 rounded-full border border-sage/20 animate-ping" style={{ animationDuration: '2s' }} />
                  <div className="absolute -inset-3 rounded-full border border-sage/10 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.3s' }} />
                </>
              )}
            </div>

            {isBulk ? (
              <>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-clay mb-3">Bulk Order Received</span>
                <h1 className="font-display text-4xl sm:text-5xl text-ink mb-4 leading-tight">
                  Quote<br />Requested!
                </h1>
                <p className="font-body text-sm text-ink-400 max-w-sm leading-relaxed">
                  Your bulk order has been received. Our team will review it and contact you within <strong className="text-ink">24 hours</strong> with a personalised quote.
                </p>
              </>
            ) : (
              <>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-sage-dark mb-3">Order Confirmed</span>
                <h1 className="font-display text-4xl sm:text-5xl text-ink mb-4 leading-tight">
                  Thank You<br />for Shopping!
                </h1>
                <p className="font-body text-sm text-ink-400 max-w-sm leading-relaxed">
                  Your order has been placed and is being prepared. A confirmation email is on its way to you.
                </p>
              </>
            )}

            {order?._id && (
              <div className="mt-5 px-5 py-2.5 bg-white border border-sand-200 inline-flex items-center gap-3">
                <span className="font-mono text-xs text-ink-400 uppercase tracking-wider">Order ID</span>
                <span className="font-mono text-sm text-ink font-bold">
                  #{order._id.slice(-8).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Order Progress (for non-bulk) */}
          {!isBulk && (
            <div
              className={cn(
                'bg-white border border-sand-200 p-6 mb-6 transition-all duration-700 delay-200',
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              )}
            >
              <div className="flex items-center gap-2 mb-6">
                <Package size={14} className="text-clay" />
                <p className="font-mono text-xs uppercase tracking-[0.12em] text-ink-400">Order Progress</p>
              </div>
              <div className="flex items-start">
                {STEPS.map((step, i) => (
                  <React.Fragment key={step.label}>
                    <div className="flex flex-col items-center flex-1">
                      <div className={cn(
                        'h-3 w-3 rounded-full border-2 transition-colors mb-2',
                        i === 0 ? 'border-sage bg-sage' : 'border-sand-300 bg-white'
                      )} />
                      <p className={cn('font-mono text-[9px] uppercase tracking-wide text-center leading-tight', i === 0 ? 'text-sage-dark' : 'text-ink-300')}>
                        {step.label}
                      </p>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={cn('flex-1 h-px mt-1.5', i === 0 ? 'bg-sage/30' : 'bg-sand-200')} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          <div
            className={cn(
              'bg-white border border-sand-200 p-6 mb-6 transition-all duration-700 delay-300',
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            )}
          >
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-ink-400 mb-4">What's Next</p>
            <ul className="space-y-3">
              {(isBulk ? [
                'Our team will review your order and prepare a personalised quote.',
                'You\'ll receive an email within 24 hours with pricing and payment details.',
                'Once you approve the quote, we\'ll begin production and confirm a delivery timeline.',
              ] : TIPS).map((tip, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="font-mono text-xs text-clay font-bold mt-0.5 flex-shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-body text-sm text-ink-400 leading-snug">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div
            className={cn(
              'flex flex-col sm:flex-row gap-3 transition-all duration-700 delay-500',
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            )}
          >
            <Link to="/orders" className="flex-1">
              <Button variant="outline" fullWidth size="lg">
                <Package size={16} /> View My Orders
              </Button>
            </Link>
            <Link to="/products" className="flex-1">
              <Button fullWidth size="lg">
                <ShoppingBag size={16} /> Continue Shopping
              </Button>
            </Link>
          </div>

          <div
            className={cn(
              'text-center mt-6 transition-all duration-700 delay-[600ms]',
              visible ? 'opacity-100' : 'opacity-0'
            )}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 font-body text-xs text-ink-400 hover:text-clay transition-colors"
            >
              <Home size={12} /> Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};