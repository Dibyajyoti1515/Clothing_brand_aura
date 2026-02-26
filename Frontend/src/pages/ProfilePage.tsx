import React, { useEffect, useState } from 'react';
import { User, MapPin, Package, Plus, Check, Star } from 'lucide-react';
import { authApi } from '@/api/services';
import { useAuthStore } from '@/store/authStore';
import type { Address } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { getInitials } from '@/utils';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

type Tab = 'profile' | 'addresses';

export const ProfilePage: React.FC = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newAddr, setNewAddr] = useState<Partial<Address>>({ country: 'India', isDefault: false });

  useEffect(() => {
    authApi.getMe().then((res) => setAddresses(res.data.user.addresses ?? []));
  }, []);

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await authApi.addAddress(newAddr as Omit<Address, '_id'>);
      setAddresses(res.data.addresses);
      setShowForm(false);
      setNewAddr({ country: 'India', isDefault: false });
      toast.success('Address saved');
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? 'Failed to save address');
    } finally {
      setSaving(false);
    }
  };

  const TABS = [
    { id: 'profile' as Tab, label: 'Profile', icon: <User size={14} /> },
    { id: 'addresses' as Tab, label: 'Addresses', icon: <MapPin size={14} /> },
  ];

  return (
    <main className="min-h-screen bg-sand-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="flex items-center gap-5 mb-10">
          <div className="h-16 w-16 bg-ink flex items-center justify-center">
            <span className="font-display text-xl text-sand-50">{getInitials(user?.name ?? 'U')}</span>
          </div>
          <div>
            <h1 className="font-display text-3xl text-ink">{user?.name}</h1>
            <p className="font-body text-sm text-ink-400">{user?.email}</p>
          </div>
          <Link to="/orders" className="ml-auto hidden sm:flex">
            <Button variant="outline" size="sm">
              <Package size={14} /> View Orders
            </Button>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-sand-200 mb-8">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 font-mono text-xs uppercase tracking-[0.1em] transition-colors border-b-2 -mb-px ${
                activeTab === tab.id
                  ? 'border-ink text-ink'
                  : 'border-transparent text-ink-400 hover:text-ink'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white border border-sand-200 p-6 animate-fade-in">
            <h2 className="font-display text-xl text-ink mb-6">Account Information</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-400 mb-1">Full Name</p>
                <p className="font-body text-sm text-ink">{user?.name}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-400 mb-1">Email</p>
                <p className="font-body text-sm text-ink">{user?.email}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-400 mb-1">Account Type</p>
                <p className="font-body text-sm text-ink capitalize">{user?.role}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-400 mb-1">Member Since</p>
                <p className="font-body text-sm text-ink">2024</p>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-sand-100">
              <div className="flex items-center gap-2 text-sage-dark">
                <Star size={14} fill="currentColor" />
                <span className="font-body text-sm">AURA Member — enjoy free shipping on all orders above ₹1,999</span>
              </div>
            </div>
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === 'addresses' && (
          <div className="animate-fade-in space-y-4">
            {addresses.map((addr) => (
              <div key={addr._id} className="bg-white border border-sand-200 p-5 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-body text-sm font-medium text-ink">{addr.label || 'Address'}</span>
                    {addr.isDefault && (
                      <span className="font-mono text-[9px] bg-sage/10 text-sage-dark px-1.5 py-0.5 flex items-center gap-1">
                        <Check size={8} /> Default
                      </span>
                    )}
                  </div>
                  <p className="font-body text-sm text-ink-400">
                    {addr.street}, {addr.city}
                  </p>
                  <p className="font-body text-sm text-ink-400">
                    {addr.state} {addr.postalCode}, {addr.country}
                  </p>
                </div>
              </div>
            ))}

            {!showForm ? (
              <button
                onClick={() => setShowForm(true)}
                className="w-full h-14 border border-dashed border-sand-300 font-body text-sm text-ink-400 hover:border-ink hover:text-ink transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={14} /> Add New Address
              </button>
            ) : (
              <form onSubmit={handleSaveAddress} className="bg-white border border-sand-200 p-6 space-y-4 animate-fade-in">
                <h3 className="font-display text-lg text-ink">New Address</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Label" placeholder="Home / Office" value={newAddr.label ?? ''} onChange={(e) => setNewAddr({ ...newAddr, label: e.target.value })} />
                  <Input label="Street" placeholder="123 Main St" value={newAddr.street ?? ''} onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="City" value={newAddr.city ?? ''} onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })} required />
                  <Input label="State" value={newAddr.state ?? ''} onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Postal Code" value={newAddr.postalCode ?? ''} onChange={(e) => setNewAddr({ ...newAddr, postalCode: e.target.value })} required />
                  <Input label="Country" value={newAddr.country ?? 'India'} onChange={(e) => setNewAddr({ ...newAddr, country: e.target.value })} required />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newAddr.isDefault ?? false}
                    onChange={(e) => setNewAddr({ ...newAddr, isDefault: e.target.checked })}
                    className="h-4 w-4 border border-sand-300"
                  />
                  <span className="font-body text-sm text-ink-400">Set as default address</span>
                </label>
                <div className="flex gap-3">
                  <Button type="submit" loading={saving} size="sm">Save Address</Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </main>
  );
};
