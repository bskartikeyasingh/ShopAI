import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/common/Footer';
import { ChatWidget } from './components/chat/ChatWidget';
import { Home } from './pages/Home';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { ProductDetail } from './pages/ProductDetail';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { SellerDashboard } from './pages/SellerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { NotFound } from './pages/NotFound';

export default function App() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-surface-50 text-surface-900 font-sans">
            <Navbar onOpenAiChat={() => setChatOpen(true)} />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home onOpenAiChat={() => setChatOpen(true)} />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/seller" element={<SellerDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            <ChatWidget isOpen={chatOpen} onClose={() => setChatOpen(false)} onOpen={() => setChatOpen(true)} />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
