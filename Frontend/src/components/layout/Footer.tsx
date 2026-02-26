import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Instagram, Twitter } from 'lucide-react';

const SHOP_LINKS = [
  { label: 'Men', href: '/products?category=Men' },
  { label: 'Women', href: '/products?category=Women' },
  { label: 'Kids', href: '/products?category=Kids' },
  { label: 'Accessories', href: '/products?category=Accessories' },
  { label: 'Footwear', href: '/products?category=Footwear' },
  { label: 'Sale', href: '/products?sort=price_asc' },
];

const HELP_LINKS = [
  { label: 'Contact Us', href: '/contact' },
  { label: 'Returns & Refunds', href: '/refund-policy' },
  { label: 'Size Guide', href: '/contact' },
  { label: 'Track Order', href: '/orders' },
  { label: 'FAQs', href: '/contact' },
];

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Refund Policy', href: '/refund-policy' },
  { label: 'Terms of Service', href: '/privacy-policy' },
  { label: 'Cookie Policy', href: '/privacy-policy' },
];

export const Footer: React.FC = () => (
  <footer className="bg-ink text-sand-200 mt-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-10">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-14">

        <div className="col-span-2 md:col-span-4 lg:col-span-1">
          <Link to="/"><span className="font-display text-3xl font-semibold tracking-[0.15em] text-sand-50">AURA</span></Link>
          <p className="font-body text-sm text-sand-400 mt-3 leading-relaxed max-w-[220px]">Contemporary clothing for the conscious individual.</p>
          <div className="mt-5 space-y-2">
            <a href="mailto:hello@aura.in" className="flex items-center gap-2 text-sand-400 hover:text-sand-200 transition-colors group">
              <Mail size={12} className="text-clay-light" /><span className="font-mono text-xs">hello@aura.in</span>
            </a>
            <a href="tel:+919876543210" className="flex items-center gap-2 text-sand-400 hover:text-sand-200 transition-colors group">
              <Phone size={12} className="text-clay-light" /><span className="font-mono text-xs">+91 98765 43210</span>
            </a>
          </div>
          <div className="flex gap-3 mt-5">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="h-8 w-8 flex items-center justify-center border border-ink-500 text-sand-400 hover:border-sand-400 hover:text-sand-200 transition-colors"><Instagram size={14} /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="h-8 w-8 flex items-center justify-center border border-ink-500 text-sand-400 hover:border-sand-400 hover:text-sand-200 transition-colors"><Twitter size={14} /></a>
          </div>
        </div>

        <div>
          <h4 className="font-mono text-[10px] tracking-[0.18em] uppercase text-sand-500 mb-5">Shop</h4>
          <ul className="space-y-2.5">{SHOP_LINKS.map(({ label, href }) => (<li key={label}><Link to={href} className="font-body text-sm text-sand-400 hover:text-sand-100 transition-colors">{label}</Link></li>))}</ul>
        </div>

        <div>
          <h4 className="font-mono text-[10px] tracking-[0.18em] uppercase text-sand-500 mb-5">Help</h4>
          <ul className="space-y-2.5">{HELP_LINKS.map(({ label, href }) => (<li key={label}><Link to={href} className="font-body text-sm text-sand-400 hover:text-sand-100 transition-colors">{label}</Link></li>))}</ul>
        </div>

        <div>
          <h4 className="font-mono text-[10px] tracking-[0.18em] uppercase text-sand-500 mb-5">Legal</h4>
          <ul className="space-y-2.5">{LEGAL_LINKS.map(({ label, href }) => (<li key={label}><Link to={href} className="font-body text-sm text-sand-400 hover:text-sand-100 transition-colors">{label}</Link></li>))}</ul>
        </div>

        <div className="col-span-2 md:col-span-1">
          <h4 className="font-mono text-[10px] tracking-[0.18em] uppercase text-sand-500 mb-5">Bulk Orders</h4>
          <p className="font-body text-sm text-sand-400 leading-relaxed mb-4">Order 50+ units and get a personalised quote with priority processing and dedicated support.</p>
          <Link to="/contact" className="inline-flex items-center gap-1.5 font-body text-sm text-clay-light border-b border-clay-light/30 hover:border-clay-light transition-colors pb-0.5">Request a quote →</Link>
        </div>
      </div>

      <div className="border-t border-ink-600 pt-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-ink-400 tracking-wide">© {new Date().getFullYear()} AURA. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            {LEGAL_LINKS.map(({ label, href }, i) => (
              <React.Fragment key={label}>
                <Link to={href} className="font-mono text-[10px] uppercase tracking-widest text-ink-400 hover:text-sand-300 transition-colors">{label}</Link>
                {i < LEGAL_LINKS.length - 1 && <span className="text-ink-600 text-xs">·</span>}
              </React.Fragment>
            ))}
          </div>
          <p className="font-mono text-xs text-ink-500">Crafted with intention.</p>
        </div>
      </div>
    </div>
  </footer>
);