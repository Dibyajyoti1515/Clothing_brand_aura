import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { ProtectedRoute, GuestRoute } from '@/components/auth/ProtectedRoute';

// Pages
import { HomePage } from '@/pages/HomePage';
import { ProductsPage } from '@/pages/ProductsPage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { LoginPage, SignupPage } from '@/pages/AuthPages';
import { OrdersPage } from '@/pages/OrdersPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { PrivacyPolicyPage } from '@/pages/PrivacyPolicyPage';
import { RefundPolicyPage } from '@/pages/RefundPolicyPage';
import { ContactPage } from '@/pages/ContactPage';
import { ThankYouPage } from '@/pages/ThankYouPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '14px',
            borderRadius: '0',
            border: '1px solid #E8E0D0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
          },
          success: { iconTheme: { primary: '#7A8C72', secondary: '#fff' } },
          error: { iconTheme: { primary: '#C4724A', secondary: '#fff' } },
        }}
      />
      <Navbar />
      <CartDrawer />

      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/refund-policy" element={<RefundPolicyPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/thank-you" element={<ThankYouPage />} />

        {/* Guest only */}
        <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/signup" element={<GuestRoute><SignupPage /></GuestRoute>} />

        {/* Protected */}
        <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
};

export default App;