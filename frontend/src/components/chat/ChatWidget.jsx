import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../../api/client.js';
import { useCart } from '../../context/CartContext.jsx';

export const ChatWidget = ({ isOpen: propIsOpen, onClose: propOnClose, onOpen: propOnOpen }) => {
  const [localOpen, setLocalOpen] = useState(false);
  const isOpen = propIsOpen !== undefined ? propIsOpen : localOpen;

  const handleOpen = () => {
    if (propOnOpen) propOnOpen();
    setLocalOpen(true);
  };

  const handleClose = () => {
    if (propOnClose) propOnClose();
    setLocalOpen(false);
  };

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [addedItemMap, setAddedItemMap] = useState({});
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "👋 Hi! I'm your **ShopAgent AI Copilot**. Tell me what you're looking for, set a budget, or ask for a complete setup recommendation!",
      products: [],
      bundleAction: null
    }
  ]);

  const { addToCart } = useCart();
  const navigate = useNavigate();
  const chatBottomRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    "💻 Coding setup under ₹70,000",
    "🎧 Best headphones & accessories",
    "⚡ Student budget combo",
    "🚀 Budget Coding Setup (<₹60k)"
  ];

  const handleSend = async (messageText) => {
    const query = messageText || input;
    if (!query || !query.trim() || loading) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: 'user', text: query }]);
    setInput('');
    setLoading(true);

    try {
      const response = await apiRequest('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message: query })
      });

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: response.reply,
          products: response.products || [],
          bundleAction: response.bundleAction || null
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `⚠️ ${err.message || 'Unable to connect with AI agent. Please try again.'}`,
          products: [],
          bundleAction: null
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSingleProduct = (prod) => {
    addToCart(prod, 1);
    setAddedItemMap((prev) => ({ ...prev, [prod._id || prod.id]: true }));
    setTimeout(() => {
      setAddedItemMap((prev) => ({ ...prev, [prod._id || prod.id]: false }));
    }, 2000);
  };

  const handleAddAllToCart = (products, directCheckout = false) => {
    if (!products || products.length === 0) return;

    products.forEach((prod) => {
      addToCart(prod, 1);
    });

    if (directCheckout) {
      handleClose();
      navigate('/checkout');
    }
  };

  return (
    <>
      {/* Floating Action Launcher Button (Always visible on bottom-right) */}
      {!isOpen && (
        <button
          id="floating-ai-trigger-btn"
          onClick={handleOpen}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl flex items-center gap-2 z-50 transition-all transform hover:scale-105 active:scale-95"
          title="Open ShopAgent AI Copilot"
        >
          <span className="text-xl">🤖</span>
          <span className="text-sm font-extrabold tracking-wide hidden sm:inline">Ask AI Copilot</span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 w-[94vw] sm:w-[460px] h-[640px] max-h-[88vh] bg-white rounded-3xl border border-slate-200 shadow-2xl z-50 flex flex-col overflow-hidden animate-in fade-in zoom-in duration-150">
          
          {/* Header */}
          <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-orange-500 flex items-center justify-center font-black text-sm text-white shadow-md">
                AI
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                  ShopAgent Copilot
                  <span className="flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-semibold border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Live Catalog Grounded
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Multi-vendor recommendations & instant carting</p>
              </div>
            </div>
            <button
              id="close-chat-widget-btn"
              onClick={handleClose}
              className="text-slate-400 hover:text-white font-bold text-lg p-1.5 rounded-lg hover:bg-slate-800 transition"
              title="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/60">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                {/* Text Bubble */}
                <div
                  className={`max-w-[90%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-orange-500 text-white rounded-tr-none font-medium shadow-sm'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>

                {/* Recommended Product Cards inside AI Message */}
                {msg.products && msg.products.length > 0 && (
                  <div className="w-full mt-3 space-y-2.5">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1 flex items-center justify-between">
                      <span>Matched Listings ({msg.products.length})</span>
                      <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-semibold">100% In Stock</span>
                    </div>

                    <div className="space-y-2">
                      {msg.products.map((prod) => {
                        const pid = prod._id || prod.id;
                        const isAdded = !!addedItemMap[pid];

                        return (
                          <div
                            key={pid}
                            className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 shadow-xs hover:border-orange-300 transition"
                          >
                            <img
                              src={prod.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200'}
                              alt={prod.name}
                              className="w-14 h-14 rounded-lg object-cover bg-slate-100 border border-slate-100 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold text-slate-900 truncate">{prod.name}</h4>
                              <p className="text-[10px] text-slate-400 truncate">
                                Seller: {prod.sellerName || 'Verified Merchant'}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs font-black text-orange-600">
                                  ₹{prod.price?.toLocaleString('en-IN')}
                                </span>
                                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded uppercase">
                                  {prod.category}
                                </span>
                              </div>
                            </div>
                            <button
                              id={`ai-cart-add-${pid}`}
                              onClick={() => handleAddSingleProduct(prod)}
                              className={`font-bold text-xs px-3 py-1.5 rounded-lg border shrink-0 transition ${
                                isAdded
                                  ? 'bg-emerald-500 text-white border-emerald-500'
                                  : 'bg-orange-50 hover:bg-orange-100 text-orange-600 border-orange-200'
                              }`}
                            >
                              {isAdded ? '✓ Added' : '+ Cart'}
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {/* Multi-Product Bundle Actions */}
                    {msg.bundleAction && (
                      <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-3.5 mt-2 flex flex-col gap-2.5 shadow-xs">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-extrabold text-slate-800">
                            Bundle Total ({msg.bundleAction.itemCount} items):
                          </span>
                          <span className="font-black text-orange-600 text-base">
                            ₹{msg.bundleAction.totalPrice?.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          <button
                            id="ai-add-bundle-cart-btn"
                            onClick={() => handleAddAllToCart(msg.products, false)}
                            className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs py-2.5 rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
                          >
                            <span>🛒</span>
                            <span>Add All to Cart</span>
                          </button>
                          <button
                            id="ai-instant-checkout-btn"
                            onClick={() => handleAddAllToCart(msg.products, true)}
                            className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs py-2.5 rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
                          >
                            <span>⚡</span>
                            <span>Instant Checkout</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs py-2 pl-2">
                <span className="animate-spin text-sm">⚙️</span>
                <span>AI Agents evaluating multi-vendor catalog & live stock...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick Prompt Suggestions */}
          <div className="px-3 py-2 bg-slate-100 border-t border-slate-200 flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSend(p)}
                className="whitespace-nowrap text-[11px] font-semibold bg-white hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300 border border-slate-200 text-slate-700 px-3 py-1 rounded-full transition shadow-2xs"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-slate-200 flex gap-2 items-center">
            <input
              id="chat-widget-input"
              type="text"
              placeholder="Ask: 'Coding setup under ₹70,000'..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition"
            />
            <button
              id="chat-widget-send-btn"
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition shadow-sm"
            >
              Ask
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
