import { useState, useEffect, useRef } from 'react';
import { X, Bell, Trash2, ArrowUpRight } from 'lucide-react';
import { PRODUCTS } from '../data/electronics';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { playHapticClick } from '../utils/audioFeedback';

export default function WatchlistDrawer({ isOpen, onClose, onSelectProduct }) {
  const drawerRef = useRef(null);
  useFocusTrap(drawerRef, isOpen, onClose);

  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if (isOpen) {
      try {
        const saved = JSON.parse(localStorage.getItem('bro_active_alerts') || '[]');
        setAlerts(saved);
      } catch {
        setAlerts([]);
      }
    }
  }, [isOpen]);

  const handleRemove = (id) => {
    playHapticClick();
    const updated = alerts.filter(a => a.id !== id);
    setAlerts(updated);
    localStorage.setItem('bro_active_alerts', JSON.stringify(updated));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div 
        ref={drawerRef}
        className="w-full max-w-md bg-white h-full shadow-2xl border-l border-[#EBEBF0] flex flex-col text-[#333333] animate-in slide-in-from-right duration-200"
        role="dialog"
        aria-modal="true"
        aria-label="Active Price Drop Watchlist"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#EBEBF0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#FFF8D9] text-[#856404]">
              <Bell className="w-4 h-4 text-[#b59a50]" />
            </span>
            <div>
              <h3 className="font-serif font-bold text-base text-[#333333]">
                My Price Watchlist
              </h3>
              <span className="text-[10px] text-[#9E9E9E] uppercase tracking-wider font-semibold">
                Autonomous Cloud Alerts ({alerts.length} active)
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              playHapticClick();
              onClose();
            }}
            data-autofocus
            aria-label="Close watchlist drawer"
            className="p-1 rounded-md text-gray-400 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-[#008738]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alerts List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {alerts.length === 0 ? (
            <div className="text-center py-16 px-4">
              <Bell className="w-8 h-8 text-gray-300 mx-auto mb-3" />
              <h4 className="text-sm font-semibold text-[#333333]">No Active Watchdogs</h4>
              <p className="text-xs text-[#9E9E9E] mt-1 max-w-xs mx-auto">
                Click "30-Day Trends" on any gadget and set a target price to monitor automated retailer drops.
              </p>
            </div>
          ) : (
            alerts.map((alert) => {
              const allProducts = Object.values(PRODUCTS).flat();
              const matchedProduct = allProducts.find(p => p.id === alert.productId || p.name === alert.productName);
              const minPrice = matchedProduct?.price ? Math.min(...Object.values(matchedProduct.price)) : alert.currentPrice;

              return (
                <div 
                  key={alert.id}
                  className="p-4 rounded-xl border border-[#EBEBF0] bg-[#FAFAFA] hover:bg-white shadow-xs transition-all space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 
                        onClick={() => {
                          playHapticClick();
                          if (matchedProduct) onSelectProduct(matchedProduct);
                          onClose();
                        }}
                        className="text-xs font-bold text-[#333333] hover:text-[#b59a50] cursor-pointer"
                      >
                        {alert.productName || matchedProduct?.name || 'Tracked Hardware'}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-[#9E9E9E]">
                          Target: ₹{alert.targetPrice?.toLocaleString('en-IN')} · via {alert.channel?.toUpperCase()}
                        </span>
                        {alert.offlineQueued && (
                          <span className="text-[9px] font-bold text-[#D97706] bg-[#FFFBEB] px-1.5 py-0.2 rounded border border-[#D97706]/30">
                            Offline Queued
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemove(alert.id)}
                      aria-label="Remove alert"
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#EBEBF0] text-xs">
                    <div>
                      <span className="text-[10px] text-[#9E9E9E] block">Current Floor</span>
                      <span className="font-mono font-bold text-[#333333]">
                        ₹{minPrice?.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        playHapticClick();
                        if (matchedProduct) onSelectProduct(matchedProduct);
                        onClose();
                      }}
                      className="px-2.5 py-1 bg-[#333333] hover:bg-[#111111] text-white text-[11px] font-semibold rounded-lg flex items-center gap-1 transition-colors focus:outline-none focus:ring-2 focus:ring-[#008738]"
                    >
                      <span>Inspect</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#EBEBF0] bg-[#FAFAFA] text-center">
          <p className="text-[11px] text-[#9E9E9E]">
            Monitored continuously across stores · Instant alert when price drops
          </p>
        </div>
      </div>
    </div>
  );
}
