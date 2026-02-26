import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Shield, ChevronRight } from 'lucide-react';

const sections = [
  {
    id: 'information-we-collect',
    title: 'Information We Collect',
    content: `When you interact with AURA, we collect information to provide you with a seamless and personalised experience. This includes information you provide directly — such as your name, email address, shipping address, and payment details when you create an account or place an order.

We also automatically collect certain technical data when you visit our website, including your IP address, browser type, device identifiers, pages visited, and the time and date of your visit. This data helps us understand how people use our platform and improves our service.

If you contact our support team, we retain records of that correspondence. We may also receive information about you from third parties, such as payment processors or social media platforms, if you choose to connect those services.`,
  },
  {
    id: 'how-we-use-information',
    title: 'How We Use Your Information',
    content: `The information we collect is used solely to improve your experience with AURA and to operate our business responsibly. Specifically, we use your data to:

Process and fulfil your orders, including sending confirmation and shipping updates. Maintain and personalise your account, including saved addresses and order history. Respond to your enquiries and provide customer support. Send transactional emails and, where you have consented, marketing communications about new collections, promotions, and events.

We analyse aggregated, anonymised data to understand purchasing trends and improve our product range and website performance. We do not use your data for automated decision-making that would have a significant effect on you.`,
  },
  {
    id: 'data-sharing',
    title: 'Data Sharing & Third Parties',
    content: `AURA does not sell, rent, or trade your personal information to third parties for their marketing purposes. We only share your data with trusted partners who assist us in operating our business, and only to the extent necessary.

These partners include payment processors (such as Razorpay or Stripe) to handle transactions securely, logistics and courier partners to deliver your orders, and cloud infrastructure providers who host our platform. All third parties we work with are contractually bound to protect your data and use it only for the specific purposes we define.

We may disclose your information if required to do so by law, court order, or in response to a valid request by a public authority.`,
  },
  {
    id: 'cookies',
    title: 'Cookies & Tracking',
    content: `We use cookies and similar tracking technologies to enhance your browsing experience, remember your preferences, and understand how visitors use our site. Cookies are small text files stored on your device.

We use essential cookies (required for the website to function), performance cookies (to understand how visitors interact with the site), and functional cookies (to remember your preferences such as currency or size selections). We do not currently use advertising or cross-site tracking cookies.

You can control cookies through your browser settings. Disabling certain cookies may affect the functionality of our website, including the ability to add items to your cart or stay logged in.`,
  },
  {
    id: 'data-security',
    title: 'Data Security & Retention',
    content: `We take the security of your personal information seriously. All data transmitted between your browser and our servers is encrypted using industry-standard TLS (Transport Layer Security). Payment information is handled exclusively by our certified payment processors and is never stored on our own servers.

We retain your personal data for as long as your account is active or as needed to fulfil the purposes outlined in this policy. If you request account deletion, we will remove your personal data within 30 days, except where we are legally required to retain certain records (such as transaction history for tax purposes, which we retain for 7 years).`,
  },
  {
    id: 'your-rights',
    title: 'Your Rights',
    content: `Under applicable data protection law, you have the right to access the personal data we hold about you, correct any inaccurate data, request deletion of your data (the "right to be forgotten"), object to or restrict certain processing of your data, and receive a copy of your data in a portable format.

To exercise any of these rights, please contact us at privacy@aura.in. We will respond to all requests within 30 days. You also have the right to lodge a complaint with your local data protection authority if you believe we have not handled your data appropriately.`,
  },
  {
    id: 'changes',
    title: 'Changes to This Policy',
    content: `We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. When we make significant changes, we will notify you by email (if you have an account with us) and update the "Last Updated" date at the top of this page.

We encourage you to review this policy periodically. Your continued use of the AURA platform after changes are posted constitutes your acceptance of those changes.`,
  },
];

export const PrivacyPolicyPage: React.FC = () => {
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const scrollTo = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <main className="min-h-screen bg-sand-50 pt-20">
      {/* Hero */}
      <div className="bg-ink text-sand-50 py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Shield size={18} className="text-clay-light" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-sand-400">Legal</span>
          </div>
          <h1 className="font-display text-5xl sm:text-6xl text-sand-50 mb-4">Privacy Policy</h1>
          <p className="font-body text-sand-400 max-w-xl leading-relaxed">
            We believe in radical transparency about how we handle your data. This policy explains what we collect, why, and how you can control it.
          </p>
          <p className="font-mono text-xs text-ink-300 mt-6">Last updated: December 2024</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid lg:grid-cols-[240px_1fr] gap-12">

          {/* Sticky TOC */}
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-300 mb-4">Contents</p>
              <nav className="space-y-1">
                {sections.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => scrollTo(s.id)}
                    className="w-full flex items-start gap-2.5 text-left group py-1.5"
                  >
                    <span className="font-mono text-[10px] text-ink-300 mt-0.5 w-4 flex-shrink-0 group-hover:text-clay transition-colors">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="font-body text-xs text-ink-400 group-hover:text-ink transition-colors leading-snug">
                      {s.title}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="space-y-14">
            {sections.map((s, i) => (
              <section
                key={s.id}
                ref={(el) => { sectionRefs.current[s.id] = el; }}
                className="animate-fade-in scroll-mt-28"
              >
                <div className="flex items-baseline gap-4 mb-5">
                  <span className="font-mono text-xs text-clay-light">{String(i + 1).padStart(2, '0')}</span>
                  <h2 className="font-display text-2xl text-ink">{s.title}</h2>
                </div>
                <div className="pl-8 border-l border-sand-300">
                  {s.content.split('\n\n').map((para, j) => (
                    <p key={j} className="font-body text-sm text-ink-400 leading-relaxed mb-4 last:mb-0">
                      {para}
                    </p>
                  ))}
                </div>
              </section>
            ))}

            {/* Contact CTA */}
            <div className="bg-ink p-8 mt-8">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-clay-light mb-3">Questions?</p>
              <h3 className="font-display text-2xl text-sand-50 mb-3">We're here to help</h3>
              <p className="font-body text-sm text-sand-400 mb-5">
                If you have any questions about this Privacy Policy or how we handle your data, please reach out.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 font-body text-sm text-clay-light border-b border-clay-light/40 hover:border-clay-light transition-colors"
              >
                Contact our team <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};