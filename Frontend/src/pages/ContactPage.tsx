import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Package, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/utils';
import toast from 'react-hot-toast';

const TOPICS = [
  { id: 'order', label: 'Order Issue', icon: <Package size={14} /> },
  { id: 'return', label: 'Return / Refund', icon: <Package size={14} /> },
  { id: 'product', label: 'Product Query', icon: <MessageSquare size={14} /> },
  { id: 'bulk', label: 'Bulk Order', icon: <Package size={14} /> },
  { id: 'other', label: 'Something Else', icon: <MessageSquare size={14} /> },
];

const CONTACT_CARDS = [
  {
    icon: <Mail size={20} />,
    label: 'Email Us',
    value: 'hello@aura.in',
    sub: 'We reply within 2 business hours',
    href: 'mailto:hello@aura.in',
  },
  {
    icon: <Phone size={20} />,
    label: 'Call Us',
    value: '+91 98765 43210',
    sub: 'Mon – Sat, 10am – 7pm IST',
    href: 'tel:+919876543210',
  },
  {
    icon: <MapPin size={20} />,
    label: 'Visit Us',
    value: '14, Linking Road, Bandra West',
    sub: 'Mumbai, Maharashtra 400050',
    href: '#',
  },
  {
    icon: <Clock size={20} />,
    label: 'Support Hours',
    value: 'Mon – Sat: 10am – 7pm',
    sub: 'Sunday: 11am – 4pm IST',
    href: null,
  },
];

export const ContactPage: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', topic: '', message: '', orderNumber: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.topic) { toast.error('Please select a topic'); return; }
    setSubmitting(true);
    // Simulate API call — wire to your backend when ready
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-sand-50 pt-20">
      {/* Hero */}
      <div className="bg-ink text-sand-50 py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Headphones size={18} className="text-clay-light" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-sand-400">Support</span>
          </div>
          <h1 className="font-display text-5xl sm:text-6xl text-sand-50 mb-4">Contact Us</h1>
          <p className="font-body text-sand-400 max-w-lg leading-relaxed">
            A real person will read your message and get back to you. No bots, no automated replies.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid lg:grid-cols-[1fr_380px] gap-12">

          {/* ── Form ──────────────────────────────────────────────────── */}
          <div>
            {submitted ? (
              // Success state
              <div className="bg-white border border-sand-200 p-10 text-center animate-scale-in">
                <div className="h-14 w-14 bg-sage/10 flex items-center justify-center mx-auto mb-5">
                  <Send size={22} className="text-sage-dark" />
                </div>
                <h2 className="font-display text-3xl text-ink mb-3">Message Sent!</h2>
                <p className="font-body text-sm text-ink-400 max-w-sm mx-auto leading-relaxed mb-2">
                  Thanks for reaching out, <strong className="text-ink">{form.name}</strong>.
                  We'll reply to <strong className="text-ink">{form.email}</strong> within 2 business hours.
                </p>
                <p className="font-mono text-xs text-ink-300 mb-8">Reference: #{Date.now().toString().slice(-8)}</p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', topic: '', message: '', orderNumber: '' }); }}
                  className="font-body text-sm text-clay hover:text-clay-dark transition-colors border-b border-clay/40 hover:border-clay"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-7 animate-fade-in">
                <div className="grid sm:grid-cols-2 gap-5">
                  <Input
                    label="Your Name"
                    type="text"
                    placeholder="Priya Sharma"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="priya@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>

                {/* Topic Selector */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-[0.12em] text-ink-400 mb-3">
                    What's this about?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {TOPICS.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setForm({ ...form, topic: t.id })}
                        className={cn(
                          'flex items-center gap-2 h-9 px-4 border font-body text-sm transition-all',
                          form.topic === t.id
                            ? 'bg-ink text-sand-50 border-ink'
                            : 'border-sand-300 text-ink-400 hover:border-ink hover:text-ink'
                        )}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Order number — show if topic is order or return */}
                {(form.topic === 'order' || form.topic === 'return') && (
                  <Input
                    label="Order Number (optional)"
                    type="text"
                    placeholder="e.g. #AB12CD34"
                    value={form.orderNumber}
                    onChange={(e) => setForm({ ...form, orderNumber: e.target.value })}
                    className="animate-slide-up"
                  />
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase tracking-[0.12em] text-ink-400">
                    Message
                  </label>
                  <textarea
                    placeholder="Describe your question or issue in as much detail as possible…"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                    rows={6}
                    className="w-full border border-sand-300 bg-sand-50 px-4 py-3 font-body text-sm focus:outline-none focus:border-ink text-ink placeholder:text-ink-300 resize-none transition-colors"
                  />
                </div>

                <Button type="submit" size="lg" loading={submitting} className="w-full sm:w-auto">
                  <Send size={16} /> Send Message
                </Button>

                <p className="font-mono text-xs text-ink-300">
                  We respond within 2 hours on business days. For urgent issues, call us directly.
                </p>
              </form>
            )}
          </div>

          {/* ── Sidebar ───────────────────────────────────────────────── */}
          <aside className="space-y-4">
            {CONTACT_CARDS.map(({ icon, label, value, sub, href }) => (
              <div key={label} className="bg-white border border-sand-200 p-5 group hover:border-sand-300 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="h-9 w-9 bg-sand-100 flex items-center justify-center text-clay flex-shrink-0 group-hover:bg-clay group-hover:text-white transition-colors">
                    {icon}
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-300 mb-0.5">{label}</p>
                    {href && href !== '#' ? (
                      <a href={href} className="font-body text-sm font-medium text-ink hover:text-clay transition-colors">
                        {value}
                      </a>
                    ) : (
                      <p className="font-body text-sm font-medium text-ink">{value}</p>
                    )}
                    <p className="font-body text-xs text-ink-400 mt-0.5">{sub}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* FAQ prompt */}
            <div className="bg-ink p-5 mt-2">
              <p className="font-body text-sm text-sand-300 leading-relaxed">
                Looking for quick answers? Browse our{' '}
                <span className="text-clay-light border-b border-clay-light/40 cursor-pointer hover:border-clay-light transition-colors">
                  FAQ section
                </span>{' '}
                for sizing, shipping, and order help.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};