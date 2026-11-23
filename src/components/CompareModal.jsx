import { useState, useRef } from 'react';
import { X, Check, Scale } from 'lucide-react';
import { getAffiliateUrl, recordAffiliateClick } from '../services/affiliate';
import { evaluateDealIntelligence } from '../services/dealIntelligence';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { playHapticClick } from '../utils/audioFeedback';

export default function CompareModal({ products = [], initialA, initialB, onClose }) {
  const modalRef = useRef(null);
  useFocusTrap(modalRef, true, onClose);

  const [prodAId, setProdAId] = useState(initialA?.id || products[0]?.id);
  const [prodBId, setProdBId] = useState(initialB?.id || products[1]?.id || products[0]?.id);

  const prodA = products.find((p) => p.id === prodAId) || initialA || products[0];
  const prodB = products.find((p) => p.id === prodBId) || initialB || products[1] || products[0];

  const minA = prodA?.price ? Math.min(...Object.values(prodA.price)) : 0;
  const minB = prodB?.price ? Math.min(...Object.values(prodB.price)) : 0;

  const intelA = evaluateDealIntelligence(prodA, [], minA);
  const intelB = evaluateDealIntelligence(prodB, [], minB);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150">
      <div 
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label="1v1 Hardware Specification Comparison"
        className="bg-[#FAFAFA] rounded-2xl border border-[#EBEBF0] shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto relative text-[#333333]"
      >
        
        {/* Floating Close Button */}
        <button
          onClick={() => {
            playHapticClick();
            onClose();
          }}
          data-autofocus
          aria-label="Close comparison dialog"
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white border border-[#EBEBF0] flex items-center justify-center text-[#666666] hover:text-[#333333] hover:bg-[#F8F9FA] transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#008738]"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-[#EBEBF0] bg-white rounded-t-2xl">
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-[#FFF8D9] text-[#856404]">
              <Scale className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#b59a50]">
              1v1 Hardware Specification Comparison
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#333333]">
            Side-by-Side Spec & Deal Showdown
          </h2>
          <p className="text-xs text-[#666666] mt-0.5">
            Direct specs comparison and price floor arbitrage between two devices.
          </p>
        </div>

        {/* Comparison Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Product Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Device A */}
            <div className="p-4 bg-white rounded-xl border border-[#EBEBF0] shadow-xs">
              <span className="text-[10px] font-bold text-[#666666] uppercase tracking-wider block mb-1">
                Device 1
              </span>
              <select
                aria-label="Select first device for comparison"
                value={prodAId}
                onChange={(e) => {
                  playHapticClick();
                  setProdAId(e.target.value);
                }}
                className="w-full bg-[#FAFAFA] border border-[#EBEBF0] rounded-lg p-2 text-xs font-semibold text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#008738]"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Floor: ₹{p.price ? Math.min(...Object.values(p.price)).toLocaleString('en-IN') : 'N/A'})
                  </option>
                ))}
              </select>
            </div>

            {/* Device B */}
            <div className="p-4 bg-white rounded-xl border border-[#EBEBF0] shadow-xs">
              <span className="text-[10px] font-bold text-[#666666] uppercase tracking-wider block mb-1">
                Device 2
              </span>
              <select
                aria-label="Select second device for comparison"
                value={prodBId}
                onChange={(e) => {
                  playHapticClick();
                  setProdBId(e.target.value);
                }}
                className="w-full bg-[#FAFAFA] border border-[#EBEBF0] rounded-lg p-2 text-xs font-semibold text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#008738]"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Floor: ₹{p.price ? Math.min(...Object.values(p.price)).toLocaleString('en-IN') : 'N/A'})
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Matrix Breakdown */}
          <div className="bg-white rounded-xl border border-[#EBEBF0] overflow-hidden shadow-xs">
            <div className="grid grid-cols-3 bg-[#F8F9FA] p-3 text-xs font-bold text-[#333333] border-b border-[#EBEBF0]">
              <span>Attribute</span>
              <span>{prodA?.name}</span>
              <span>{prodB?.name}</span>
            </div>

            <div className="divide-y divide-[#EBEBF0] text-xs">
              <div className="grid grid-cols-3 p-3 items-center">
                <span className="text-[#666666] font-medium">Deal Score Index</span>
                <span className="font-bold text-[#008738]">{intelA.dealScore}/10 ({intelA.scoreTier})</span>
                <span className="font-bold text-[#008738]">{intelB.dealScore}/10 ({intelB.scoreTier})</span>
              </div>
              <div className="grid grid-cols-3 p-3 items-center">
                <span className="text-[#666666] font-medium">Price Floor (Lowest)</span>
                <span className="font-mono font-bold text-[#333333]">₹{minA.toLocaleString('en-IN')}</span>
                <span className="font-mono font-bold text-[#333333]">₹{minB.toLocaleString('en-IN')}</span>
              </div>
              <div className="grid grid-cols-3 p-3 items-center">
                <span className="text-[#666666] font-medium">Discount Authenticity</span>
                <span className={intelA.isFakeDiscount ? 'text-[#D97706] font-semibold' : 'text-[#008738]'}>
                  {intelA.discountBadge}
                </span>
                <span className={intelB.isFakeDiscount ? 'text-[#D97706] font-semibold' : 'text-[#008738]'}>
                  {intelB.discountBadge}
                </span>
              </div>
              <div className="grid grid-cols-3 p-3 items-start">
                <span className="text-[#666666] font-medium">Specs List</span>
                <div className="space-y-1">
                  {(prodA?.specs || []).map((s, i) => (
                    <div key={i} className="text-[#333333] flex items-center gap-1">
                      <Check className="w-3 h-3 text-[#008738]" /> {s}
                    </div>
                  ))}
                </div>
                <div className="space-y-1">
                  {(prodB?.specs || []).map((s, i) => (
                    <div key={i} className="text-[#333333] flex items-center gap-1">
                      <Check className="w-3 h-3 text-[#008738]" /> {s}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
