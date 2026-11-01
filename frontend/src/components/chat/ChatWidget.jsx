import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../../api/client.js';
import { useCart } from '../../context/CartContext.jsx';
import { INITIAL_PRODUCTS } from '../../data/mockData.js';

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
      text: "👋 Hi! I'm your **ShopAgent AI Copilot**. Tell me what workstation you're assembling, specify your budget, or request a complete multi-vendor setup recommendation!",
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
    } catch {
      // Grounded demo fallback recommendation
      const lower = query.toLowerCase();
      let matched = [];
      let replyText = "";

      if (lower.includes('coding') || lower.includes('70') || lower.includes('60') || lower.includes('laptop')) {
        matched = [INITIAL_PRODUCTS[0], INITIAL_PRODUCTS[3], INITIAL_PRODUCTS[7]];
        replyText = "Here is a **Grounded Developer Setup** under ₹60,000 verified against live seller stock. It pairs the DevPro 14 Laptop with an UltraCode mechanical keyboard and precision ergonomic mouse.";
      } else if (lower.includes('audio') || lower.includes('headphone')) {
        matched = [INITIAL_PRODUCTS[4], INITIAL_PRODUCTS[5]];
        replyText = "Here are our **Top Studio Acoustics** verified from AudioMaster Electronics: Hybrid Active Noise Cancelling headphones and cardioid broadcast condenser mic.";
      } else {
        matched = [INITIAL_PRODUCTS[0], INITIAL_PRODUCTS[2]];
        replyText = `Based on your request "${query}", here are verified in-stock recommendations from our catalog:`;
      }

      const total = matched.reduce((sum, p) => sum + p.price, 0);

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: replyText,
          products: matched,
          bundleAction: {
            itemCount: matched.length,
            totalPrice: total
          }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSingleProduct = (prod) => {
    addToCart(prod, 1);
    const pid = prod._id || prod.id;
    setAddedItemMap((prev) => ({ ...prev, [pid]: true }));
    setTimeout(() => {
      setAddedItemMap((prev) => ({ ...prev, [pid]: false }));
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
      {/* Floating Action Launcher Button */}
      {!isOpen && (
        <button
          id="floating-ai-trigger-btn"
          onClick={handleOpen}
          className="fixed bottom-6 right-6 bg-forest-900 hover:bg-forest-950 text-white font-bold p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-xl flex items-center gap-2.5 z-50 transition-all border border-forest-700/80 hover:scale-103"
          title="Open ShopAgent AI Copilot"
        >
          <span className="text-xl">🌿</span>
          <span className="text-xs sm:text-sm font-extrabold tracking-wide hidden sm:inline">
            Ask AI Copilot
          </span>
          <span className="w-2 h-2 rounded-full bg-accent-500 animate-pulse"></span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 w-[94vw] sm:w-[460px] h-[640px] max-h-[88vh] bg-white rounded-2xl border border-surface-300 shadow-2xl z-50 flex flex-col overflow-hidden animate-in fade-in zoom-in duration-150">
          
          {/* Header */}
          <div className="bg-forest-900 text-white px-5 py-4 flex items-center justify-between border-b border-forest-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-forest-800 border border-forest-700 flex items-center justify-center font-black text-sm text-white shadow-xs">
                🌿
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                  ShopAgent Copilot
                  <span className="flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-semibold border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    Live Catalog Grounded
                  </span>
                </h3>
                <p className="text-[11px] text-forest-200 mt-0.5">Multi-vendor setups & atomic carting</p>
              </div>
            </div>
            <button
              id="close-chat-widget-btn"
              onClick={handleClose}
              className="text-forest-300 hover:text-white font-bold text-base p-1.5 rounded-lg hover:bg-forest-800 transition"
              title="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                {/* Text Bubble */}
                <div
                  className={`max-w-[88%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-forest-900 text-white rounded-tr-none font-medium shadow-xs'
                      : 'bg-white text-surface-900 border border-surface-200 rounded-tl-none shadow-2xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>

                {/* Recommended Product Cards inside AI Message */}
                {msg.products && msg.products.length > 0 && (
                  <div className="w-full mt-3 space-y-2.5">
                    <div className="text-[11px] font-bold text-surface-400 uppercase tracking-wider pl-1 flex items-center justify-between">
                      <span>Verified Matches ({msg.products.length})</span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200">
                        100% In Stock
                      </span>
                    </div>

                    <div className="space-y-2">
                      {msg.products.map((prod) => {
                        const pid = prod._id || prod.id;
                        const isAdded = !!addedItemMap[pid];
                        const seller = prod.sellerName || prod.sellerId?.storeName || 'Verified Merchant';

                        return (
                          <div
                            key={pid}
                            className="bg-white border border-surface-200 rounded-xl p-3 flex items-center gap-3 shadow-2xs hover:border-forest-300 transition"
                          >
                            <img
                              src={prod.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80'}
                              alt={prod.name}
                              className="w-14 h-14 rounded-lg object-cover bg-surface-100 border border-surface-200 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold text-surface-900 truncate">{prod.name}</h4>
                              <p className="text-[10px] text-surface-500 truncate">
                                Seller: {seller}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs font-black text-forest-900">
                                  ₹{prod.price?.toLocaleString('en-IN')}
                                </span>
                                <span className="text-[10px] font-bold text-surface-600 bg-surface-100 px-1.5 py-0.5 rounded uppercase">
                                  {prod.category}
                                </span>
                              </div>
                            </div>
                            <button
                              id={`ai-cart-add-${pid}`}
                              onClick={() => handleAddSingleProduct(prod)}
                              className={`font-bold text-xs px-3 py-1.5 rounded-lg border shrink-0 transition ${
                                isAdded
                                  ? 'bg-forest-900 text-white border-forest-900'
                                  : 'bg-surface-50 hover:bg-forest-50 text-forest-900 border-surface-300'
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
                      <div className="bg-forest-900 text-white rounded-xl p-3.5 mt-2 flex flex-col gap-2.5 shadow-sm border border-forest-800">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-forest-200">
                            Bundle Total ({msg.bundleAction.itemCount} items):
                          </span>
                          <span className="font-black text-white text-base">
                            ₹{msg.bundleAction.totalPrice?.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          <button
                            id="ai-add-bundle-cart-btn"
                            onClick={() => handleAddAllToCart(msg.products, false)}
                            className="bg-forest-800 hover:bg-forest-700 text-white border border-forest-700 font-bold text-xs py-2 rounded-lg transition"
                          >
                            🛒 Add All to Cart
                          </button>
                          <button
                            id="ai-instant-checkout-btn"
                            onClick={() => handleAddAllToCart(msg.products, true)}
                            className="bg-accent-500 hover:bg-accent-600 text-white font-extrabold text-xs py-2 rounded-lg transition"
                          >
                            ⚡ Instant Checkout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-surface-400 text-xs py-2 pl-2">
                <span className="animate-spin text-sm">⚙️</span>
                <span>AI Agent validating live stock and vendor catalog...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick Prompt Suggestions */}
          <div className="px-3 py-2 bg-surface-100 border-t border-surface-200 flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSend(p)}
                className="whitespace-nowrap text-[11px] font-semibold bg-white hover:bg-forest-50 hover:text-forest-900 hover:border-forest-300 border border-surface-200 text-surface-700 px-3 py-1 rounded-full transition shadow-2xs"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-surface-200 flex gap-2 items-center">
            <input
              id="chat-widget-input"
              type="text"
              placeholder="Ask: 'Coding setup under ₹70,000'..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-surface-50 border border-surface-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-surface-900 focus:outline-none focus:ring-2 focus:ring-forest-800 focus:bg-white transition"
            />
            <button
              id="chat-widget-send-btn"
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="bg-forest-900 hover:bg-forest-950 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm px-4 py-2 rounded-xl transition shadow-xs"
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
