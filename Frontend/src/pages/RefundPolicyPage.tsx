import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw, Clock, CheckCircle, XCircle, ChevronRight } from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'Initiate Your Return',
    description: 'Log in to your account, navigate to My Orders, and select the item you wish to return. Fill in the reason for return and submit your request within 15 days of delivery.',
  },
  {
    step: '02',
    title: 'We Review Your Request',
    description: 'Our team reviews your request within 24 hours. You will receive an email confirmation with a prepaid return shipping label once approved.',
  },
  {
    step: '03',
    title: 'Ship the Item Back',
    description: 'Pack the item securely in its original packaging (if available) and attach the provided label. Drop it off at any designated courier partner location.',
  },
  {
    step: '04',
    title: 'Refund Processed',
    description: 'Once we receive and inspect the item (2–3 business days), your refund will be processed to the original payment method within 5–7 business days.',
  },
];

const eligible = [
  'Items in original, unworn condition with all tags attached',
  'Items returned within 15 days of the delivery date',
  'Items that are defective, damaged, or incorrectly shipped',
  'Full-price items purchased directly on aura.in',
];

const notEligible = [
  'Items marked as "Final Sale" or purchased during clearance events',
  'Intimate apparel, swimwear, and accessories (for hygiene reasons)',
  'Items that have been washed, worn, altered, or damaged by the customer',
  'Items returned after the 15-day return window has closed',
  'Bulk orders processed under a "Quote Requested" status',
];

export const RefundPolicyPage: React.FC = () => {
  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

  return (
    <main className="min-h-screen bg-sand-50 pt-20">
      {/* Hero */}
      <div className="bg-ink text-sand-50 py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <RotateCcw size={18} className="text-clay-light" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-sand-400">Policy</span>
          </div>
          <h1 className="font-display text-5xl sm:text-6xl text-sand-50 mb-4">Returns & Refunds</h1>
          <p className="font-body text-sand-400 max-w-xl leading-relaxed">
            We stand behind everything we make. If something isn't right, we'll make it right — quickly and without hassle.
          </p>
          <div className="flex flex-wrap gap-8 mt-8">
            {[
              { icon: <Clock size={16} />, label: '15-Day Window' },
              { icon: <RotateCcw size={16} />, label: 'Free Returns' },
              { icon: <CheckCircle size={16} />, label: '5–7 Day Refunds' },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="text-clay-light">{icon}</span>
                <span className="font-mono text-xs tracking-wider text-sand-300">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-20">

        {/* How It Works */}
        <section>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-clay mb-2">Process</p>
          <h2 className="font-display text-3xl text-ink mb-10">How Returns Work</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {steps.map((s) => (
              <div key={s.step} className="bg-white border border-sand-200 p-6 hover:border-sand-300 transition-colors">
                <span className="font-mono text-3xl text-sand-200 font-bold block mb-4">{s.step}</span>
                <h3 className="font-display text-lg text-ink mb-2">{s.title}</h3>
                <p className="font-body text-sm text-ink-400 leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Eligibility */}
        <section>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-clay mb-2">Eligibility</p>
          <h2 className="font-display text-3xl text-ink mb-10">What Can Be Returned</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Eligible */}
            <div className="bg-sage/5 border border-sage/20 p-6">
              <div className="flex items-center gap-2 mb-5">
                <CheckCircle size={16} className="text-sage-dark" />
                <h3 className="font-mono text-xs uppercase tracking-[0.12em] text-sage-dark">Eligible for Return</h3>
              </div>
              <ul className="space-y-3">
                {eligible.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-sage-dark mt-1.5 flex-shrink-0" />
                    <span className="font-body text-sm text-ink-400 leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Not Eligible */}
            <div className="bg-red-50/60 border border-red-100 p-6">
              <div className="flex items-center gap-2 mb-5">
                <XCircle size={16} className="text-red-500" />
                <h3 className="font-mono text-xs uppercase tracking-[0.12em] text-red-600">Not Eligible for Return</h3>
              </div>
              <ul className="space-y-3">
                {notEligible.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                    <span className="font-body text-sm text-ink-400 leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Refund Details */}
        <section>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-clay mb-2">Timelines</p>
          <h2 className="font-display text-3xl text-ink mb-8">Refund Details</h2>
          <div className="space-y-1">
            {[
              { method: 'Credit / Debit Card', timeline: '5–7 business days', note: 'Refunded to original card' },
              { method: 'UPI / Net Banking', timeline: '3–5 business days', note: 'Refunded to source account' },
              { method: 'Cash on Delivery', timeline: '5–7 business days', note: 'Refunded via NEFT to your bank account' },
              { method: 'AURA Store Credit', timeline: 'Instant', note: 'Applied automatically to your account' },
            ].map((row) => (
              <div key={row.method} className="grid grid-cols-3 gap-4 py-4 border-b border-sand-200 last:border-b-0">
                <span className="font-body text-sm font-medium text-ink">{row.method}</span>
                <span className="font-mono text-sm text-clay">{row.timeline}</span>
                <span className="font-body text-sm text-ink-400">{row.note}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Exchange */}
        <section className="bg-white border border-sand-200 p-8">
          <h2 className="font-display text-2xl text-ink mb-3">Exchanges</h2>
          <p className="font-body text-sm text-ink-400 leading-relaxed mb-4 max-w-xl">
            Need a different size or colour? We process exchanges the same way as returns. Initiate a return for the original item, and once approved, place a new order for the item you want. We'll expedite the processing for exchanges.
          </p>
          <p className="font-body text-sm text-ink-400 leading-relaxed max-w-xl">
            For exchanges due to manufacturing defects or incorrect items shipped, we will cover both the return shipping and the re-delivery at no extra cost to you.
          </p>
        </section>

        {/* CTA */}
        <div className="bg-ink p-8">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-clay-light mb-3">Need Help?</p>
          <h3 className="font-display text-2xl text-sand-50 mb-3">Can't find your answer?</h3>
          <p className="font-body text-sm text-sand-400 mb-5">
            Our support team typically responds within 2 hours on business days.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 font-body text-sm text-clay-light border-b border-clay-light/40 hover:border-clay-light transition-colors"
          >
            Contact Us <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </main>
  );
};