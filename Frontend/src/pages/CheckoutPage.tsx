import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, MapPin, CreditCard, AlertTriangle } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { authApi, ordersApi } from '@/api/services';
import type { Address } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { formatPrice, cn } from '@/utils';
import toast from 'react-hot-toast';

const PAYMENT_METHODS = [
  { value: 'Online', label: 'Online Payment' },
  { value: 'COD', label: 'Cash on Delivery' },
  { value: 'Bank Transfer', label: 'Bank Transfer' },
];

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState('Online');
  const [bulkNote, setBulkNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [addingAddress, setAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState<Partial<Address>>({});
  const [showAddressForm, setShowAddressForm] = useState(false);

  const totalItems = cart?.totalItems ?? 0;
  const isBulk = totalItems > 50;

  useEffect(() => {
    authApi.getMe().then((res) => {
      setAddresses(res.data.user.addresses ?? []);
      const def = res.data.user.addresses?.find((a: Address) => a.isDefault);
      if (def) setSelectedAddressId(def._id);
    });
  }, []);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingAddress(true);
    try {
      const res = await authApi.addAddress({ ...newAddress as Omit<Address, '_id'>, isDefault: addresses.length === 0 });
      setAddresses(res.data.addresses);
      const added = res.data.addresses[res.data.addresses.length - 1];
      setSelectedAddressId(added._id);
      setShowAddressForm(false);
      setNewAddress({});
      toast.success('Address added');
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? 'Failed to add address');
    } finally {
      setAddingAddress(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) { toast.error('Please select a shipping address'); return; }
    setLoading(true);
    try {
      const res = await ordersApi.create({ addressId: selectedAddressId, paymentMethod, bulkOrderNote: isBulk ? bulkNote : undefined });
      await clearCart();
      toast.success(res.data.message);
      navigate('/orders');
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    navigate('/');
    return null;
  }

  return (
    <main className="min-h-screen bg-sand-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="font-display text-4xl text-ink mb-10">Checkout</h1>

        {isBulk && (
          <div className="bg-clay/10 border border-clay/20 px-5 py-4 flex items-start gap-3 mb-8 animate-fade-in">
            <AlertTriangle size={18} className="text-clay flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-body text-sm font-medium text-clay-dark">Bulk Order Detected</p>
              <p className="font-body text-xs text-clay-dark/80 mt-0.5">
                Your cart has {totalItems} items (over 50). This will be processed as a bulk order with status "Quote Requested". Our team will contact you with pricing.
              </p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Left */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Address */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={16} className="text-clay" />
                <h2 className="font-mono text-xs uppercase tracking-[0.14em] text-ink">Shipping Address</h2>
              </div>

              <div className="space-y-3">
                {addresses.map((addr) => (
                  <label
                    key={addr._id}
                    className={cn(
                      'flex items-start gap-3 p-4 border cursor-pointer transition-colors',
                      selectedAddressId === addr._id ? 'border-ink bg-white' : 'border-sand-200 hover:border-sand-300'
                    )}
                  >
                    <div
                      className={cn('mt-0.5 h-4 w-4 border-2 flex-shrink-0 flex items-center justify-center transition-colors', selectedAddressId === addr._id ? 'border-ink bg-ink' : 'border-sand-300')}
                      onClick={() => setSelectedAddressId(addr._id)}
                    >
                      {selectedAddressId === addr._id && <Check size={10} className="text-white" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-body text-sm font-medium text-ink">{addr.label}</span>
                        {addr.isDefault && <span className="font-mono text-[9px] bg-sage/10 text-sage-dark px-1.5 py-0.5">Default</span>}
                      </div>
                      <p className="font-body text-xs text-ink-400 mt-0.5">
                        {addr.street}, {addr.city}, {addr.state} {addr.postalCode}, {addr.country}
                      </p>
                    </div>
                  </label>
                ))}

                <button
                  onClick={() => setShowAddressForm((v) => !v)}
                  className="w-full h-12 border border-dashed border-sand-300 font-body text-sm text-ink-400 hover:border-ink hover:text-ink transition-colors"
                >
                  + Add new address
                </button>

                {showAddressForm && (
                  <form onSubmit={handleAddAddress} className="border border-sand-200 p-5 space-y-4 animate-fade-in bg-white">
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Label" placeholder="Home / Office" value={newAddress.label ?? ''} onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })} />
                      <Input label="Street" placeholder="123 Main St" value={newAddress.street ?? ''} onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="City" placeholder="Mumbai" value={newAddress.city ?? ''} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} required />
                      <Input label="State" placeholder="Maharashtra" value={newAddress.state ?? ''} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Postal Code" placeholder="400001" value={newAddress.postalCode ?? ''} onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })} required />
                      <Input label="Country" placeholder="India" value={newAddress.country ?? 'India'} onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })} required />
                    </div>
                    <div className="flex gap-3">
                      <Button type="submit" loading={addingAddress} size="sm">Save Address</Button>
                      <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddressForm(false)}>Cancel</Button>
                    </div>
                  </form>
                )}
              </div>
            </section>

            {/* Payment */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <CreditCard size={16} className="text-clay" />
                <h2 className="font-mono text-xs uppercase tracking-[0.14em] text-ink">Payment Method</h2>
              </div>
              <div className="space-y-2">
                {PAYMENT_METHODS.map(({ value, label }) => (
                  <label
                    key={value}
                    className={cn(
                      'flex items-center gap-3 p-4 border cursor-pointer transition-colors',
                      paymentMethod === value ? 'border-ink bg-white' : 'border-sand-200 hover:border-sand-300'
                    )}
                  >
                    <div
                      className={cn('h-4 w-4 border-2 flex-shrink-0 flex items-center justify-center', paymentMethod === value ? 'border-ink bg-ink' : 'border-sand-300')}
                      onClick={() => setPaymentMethod(value)}
                    >
                      {paymentMethod === value && <Check size={10} className="text-white" />}
                    </div>
                    <span className="font-body text-sm text-ink">{label}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* Bulk note */}
            {isBulk && (
              <section>
                <h2 className="font-mono text-xs uppercase tracking-[0.14em] text-ink mb-3">Bulk Order Note</h2>
                <textarea
                  value={bulkNote}
                  onChange={(e) => setBulkNote(e.target.value)}
                  placeholder="Custom packaging requirements, delivery notes, or any other instructions…"
                  className="w-full h-28 border border-sand-300 bg-sand-50 px-4 py-3 font-body text-sm focus:outline-none focus:border-ink text-ink placeholder:text-ink-300 resize-none"
                />
              </section>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-sand-200 p-6 sticky top-24">
              <h2 className="font-mono text-xs uppercase tracking-[0.14em] text-ink mb-5">Order Summary</h2>
              <div className="space-y-3 mb-5">
                {cart.items.map((item) => (
                  <div key={item._id} className="flex items-center gap-3">
                    <div className="h-12 w-10 bg-sand-100 flex-shrink-0 overflow-hidden">
                      {item.product.images?.[0]?.url && (
                        <img src={item.product.images[0].url} alt={item.product.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-xs text-ink truncate">{item.product.name}</p>
                      <p className="font-mono text-[10px] text-ink-300">S:{item.size} × {item.quantity}</p>
                    </div>
                    <span className="font-body text-sm text-ink">{formatPrice(item.priceAtAddition * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-sand-200 pt-4 space-y-2">
                <div className="flex justify-between font-body text-sm text-ink-400">
                  <span>Subtotal</span>
                  <span>{formatPrice(cart.totalPrice)}</span>
                </div>
                <div className="flex justify-between font-body text-sm text-ink-400">
                  <span>Shipping</span>
                  <span className="text-sage-dark">{cart.totalPrice >= 1999 ? 'Free' : formatPrice(99)}</span>
                </div>
                <div className="flex justify-between font-display text-lg text-ink pt-2 border-t border-sand-100">
                  <span>Total</span>
                  <span>{formatPrice(cart.totalPrice + (cart.totalPrice >= 1999 ? 0 : 99))}</span>
                </div>
              </div>
              <Button fullWidth size="lg" onClick={handlePlaceOrder} loading={loading} className="mt-6">
                {isBulk ? 'Submit for Quote' : 'Place Order'}
              </Button>
              <p className="font-mono text-[10px] text-ink-300 text-center mt-3">
                {isBulk ? 'No payment required — quote will be sent' : 'Secure & encrypted checkout'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
