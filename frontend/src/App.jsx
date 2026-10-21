import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { ChatWidget } from './components/chat/ChatWidget';
import { Home } from './pages/Home';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { ProductDetail } from './pages/ProductDetail';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { SellerDashboard } from './pages/SellerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

export default function App() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Navbar onOpenAiChat={() => setChatOpen(true)} />
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
          </Routes>
          <ChatWidget isOpen={chatOpen} onClose={() => setChatOpen(false)} onOpen={() => setChatOpen(true)} />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
