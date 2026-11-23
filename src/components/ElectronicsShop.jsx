import { useState, useEffect } from 'react';
import { 
  Star, ArrowUpRight,
  Award, AlertTriangle, Scale, Bookmark, Copy, RefreshCw
} from 'lucide-react';
import { 
  CATEGORIES, BUDGET_RANGES, PURPOSES, 
  getRecommendations, getCheapestStore 
} from '../data/electronics';
import { fetchProducts } from '../services/supabase';
import { evaluateDealIntelligence } from '../services/dealIntelligence';
import { getAffiliateUrl, recordAffiliateClick } from '../services/affiliate';
import ProductDetailModal from './ProductDetailModal';
import CompareModal from './CompareModal';
import Toast from './Toast';
import { playHapticClick, playSuccessChime } from '../utils/audioFeedback';

const STORE_CONFIG = {
  amazon:   { name: 'Amazon',   color: '#EA580C', bg: '#FFF7ED', border: '#FED7AA' },
  flipkart: { name: 'Flipkart', color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
  croma:    { name: 'Croma',    color: '#008738', bg: '#F3FBEF', border: '#CDEEC6' },
};

export default function ElectronicsShop() {
  const [selectedCat, setSelectedCat] = useState(CATEGORIES[0]);
  const [selectedBudget, setSelectedBudget] = useState(BUDGET_RANGES[5]); // 10k - 20k
  const [selectedPurpose, setSelectedPurpose] = useState(null);
  const [sortBy, setSortBy] = useState('rating'); // 'rating' | 'price'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [compareOpen, setCompareOpen] = useState(false);
  const [compareTargetA, setCompareTargetA] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Live Supabase state
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState('supabase');

  const availablePurposes = PURPOSES[selectedCat.id] || [];

  useEffect(() => {
    let isCancelled = false;

    async function loadData() {
      setLoading(true);
      try {
        const res = await fetchProducts({
          categoryId: selectedCat.id,
          budgetRange: selectedBudget,
          purpose: selectedPurpose
        });

        if (!isCancelled) {
          let list = res.products || [];
          if (sortBy === 'price') {
            list = [...list].sort((a, b) => getCheapestStore(a).price - getCheapestStore(b).price);
          } else {
            list = [...list].sort((a, b) => b.rating - a.rating);
          }
          setRecommendations(list);
          setDataSource(res.source);
        }
      } catch (err) {
        console.error('Error in loadData:', err);
        if (!isCancelled) {
          const fallback = getRecommendations(selectedCat.id, selectedBudget, selectedPurpose);
          setRecommendations(fallback);
          setDataSource('local');
        }
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    loadData();

    return () => {
      isCancelled = true;
    };
  }, [selectedCat, selectedBudget, selectedPurpose, sortBy]);

  const copyBookmarklet = () => {
    const code = `javascript:(function(){var t=document.querySelector('#productTitle,.B_NuCI,h1')?.innerText||'';window.open('https://bro-ai.vercel.app/#shop?q='+encodeURIComponent(t.trim().slice(0,50)),'_blank');})();`;
    playSuccessChime();
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(code).then(() => {
        setToastMessage('Bookmarklet copied! Drag or paste it into your browser bookmarks.');
      }).catch(() => {
        setToastMessage('Bookmarklet copied! Drag or paste it into your browser bookmarks.');
      });
    } else {
      setToastMessage('Bookmarklet copied! Drag or paste it into your browser bookmarks.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-5 border-b border-[#EBEBF0]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#b59a50]">
              Verified Indian Hardware Pricing & Deal Intelligence
            </span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              dataSource === 'supabase'
                ? 'bg-[#F3FBEF] text-[#008738] border border-[#008738]/20'
                : 'bg-[#F8F9FA] text-[#666666] border border-[#EBEBF0]'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${dataSource === 'supabase' ? 'bg-[#008738] animate-pulse' : 'bg-gray-400'}`} />
              {dataSource === 'supabase' ? 'Supabase Live' : 'Offline Mode'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#333333]">
            Electronics Catalog & Arbitrage
          </h1>
          <p className="text-xs sm:text-sm text-[#666666] mt-1">
            Compare live retail prices across Amazon, Flipkart, and Croma with algorithmic Fake Discount detection and 1–10 Deal Scores.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {recommendations.length >= 2 && (
            <button
              onClick={() => {
                playHapticClick();
                setCompareTargetA(recommendations[0]);
                setCompareOpen(true);
              }}
              className="px-3.5 py-1.5 bg-white hover:bg-[#F8F9FA] border border-[#EBEBF0] text-[#333333] text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-[#008738]"
            >
              <Scale className="w-3.5 h-3.5 text-[#b59a50]" />
              <span>1v1 Compare</span>
            </button>
          )}

          <div className="flex items-center bg-white border border-[#EBEBF0] rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setSortBy('rating')}
              className={`px-3 py-1 rounded-md transition-colors ${
                sortBy === 'rating' ? 'bg-[#333333] text-white font-medium' : 'text-[#666666]'
              }`}
            >
              Top Rated
            </button>
            <button
              onClick={() => setSortBy('price')}
              className={`px-3 py-1 rounded-md transition-colors ${
                sortBy === 'price' ? 'bg-[#333333] text-white font-medium' : 'text-[#666666]'
              }`}
            >
              Lowest Price
            </button>
          </div>
        </div>
      </div>

      {/* 1-Click Browser Bookmarklet Feature Banner (Zero-Cost Competitive Gap 5) */}
      <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-[#FFFBEB] to-[#F3FBEF] border border-[#B59A50]/30 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-lg bg-white border border-[#B59A50]/40 text-[#856404]">
            <Bookmark className="w-4 h-4 text-[#b59a50]" />
          </span>
          <div>
            <div className="text-xs font-bold text-[#333333] flex items-center gap-2">
              <span>1-Click Browser Bookmarklet</span>
              <span className="text-[10px] font-bold text-[#008738] bg-[#E1F7DE] px-2 py-0.5 rounded-full">Zero Install</span>
            </div>
            <p className="text-[11px] text-[#666666] mt-0.5">
              Browse Amazon or Flipkart? Click your bookmark to instantly reveal 30-day historical floors and fake discounts on BRO AI.
            </p>
          </div>
        </div>

        <button
          onClick={copyBookmarklet}
          className="px-3 py-1.5 bg-white hover:bg-[#FAFAFA] border border-[#EBEBF0] text-[#333333] text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors flex-shrink-0"
        >
          <Copy className="w-3.5 h-3.5 text-[#b59a50]" />
          <span>Copy Bookmarklet</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCat.id === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCat(cat);
                setSelectedPurpose(null);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-[#333333] text-white shadow-sm'
                  : 'bg-white border border-[#EBEBF0] text-[#666666] hover:bg-[#F8F9FA]'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Filters: Budget & Purpose */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        
        {/* Budget */}
        <div className="bg-white rounded-xl p-4 border border-[#EBEBF0] shadow-card">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[#666666]">Budget Range</span>
            <span className="font-semibold text-[#008738] bg-[#F3FBEF] px-2 py-0.5 rounded border border-[#008738]/20">
              {selectedBudget.label}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {BUDGET_RANGES.map((b) => {
              const isSelected = selectedBudget.label === b.label;
              return (
                <button
                  key={b.label}
                  onClick={() => setSelectedBudget(b)}
                  className={`text-xs px-2.5 py-1.5 rounded-md transition-colors ${
                    isSelected
                      ? 'bg-[#333333] text-white font-medium shadow-sm'
                      : 'bg-[#F8F9FA] text-[#666666] hover:bg-[#EBEBF0]'
                  }`}
                >
                  {b.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Purpose */}
        <div className="bg-white rounded-xl p-4 border border-[#EBEBF0] shadow-card">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[#666666]">Primary Use Case</span>
            <span className="font-semibold text-[#333333]">{selectedPurpose || 'All use cases'}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedPurpose(null)}
              className={`text-xs px-2.5 py-1.5 rounded-md transition-colors ${
                selectedPurpose === null
                  ? 'bg-[#333333] text-white font-medium shadow-sm'
                  : 'bg-[#F8F9FA] text-[#666666] hover:bg-[#EBEBF0]'
              }`}
            >
              All
            </button>
            {availablePurposes.map((p) => {
              const isSelected = selectedPurpose === p;
              return (
                <button
                  key={p}
                  onClick={() => setSelectedPurpose(p)}
                  className={`text-xs px-2.5 py-1.5 rounded-md transition-colors ${
                    isSelected
                      ? 'bg-[#333333] text-white font-medium shadow-sm'
                      : 'bg-[#F8F9FA] text-[#666666] hover:bg-[#EBEBF0]'
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Product List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-xl p-12 text-center border border-[#EBEBF0] my-6 shadow-card">
            <RefreshCw className="w-6 h-6 text-[#b59a50] animate-spin mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-[#333333]">Querying Supabase Electronics Catalog...</h3>
            <p className="text-xs text-[#9E9E9E] mt-1">Retrieving latest multi-carrier store prices</p>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center border border-[#EBEBF0] my-6 shadow-card">
            <h3 className="text-base font-serif font-bold text-[#333333] mb-1">No products match this filter</h3>
            <p className="text-xs text-[#9E9E9E] mb-4">Try widening your budget range or selecting all use cases.</p>
            <button
              onClick={() => {
                setSelectedBudget(BUDGET_RANGES[BUDGET_RANGES.length - 1]);
                setSelectedPurpose(null);
              }}
              className="px-4 py-2 bg-[#333333] text-white text-xs font-semibold rounded-lg"
            >
              Reset filters
            </button>
          </div>
        ) : (
          recommendations.map((prod) => {
            const cheapest = getCheapestStore(prod);
            const intel = evaluateDealIntelligence(prod, [], cheapest.price);

            return (
              <div 
                key={prod.id}
                className="bg-white rounded-xl p-5 border border-[#EBEBF0] shadow-card hover:shadow-card-hover transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  
                  {/* Left: Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      {prod.badge && (
                        <span className="text-[10px] font-bold text-[#008738] bg-[#F3FBEF] px-2 py-0.5 rounded-full border border-[#008738]/20">
                          {prod.badge}
                        </span>
                      )}
                      <span className="text-xs font-semibold text-[#333333] flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-[#b59a50] text-[#b59a50]" />
                        {prod.rating}
                      </span>
                      {/* Deal Score */}
                      <span className="text-[10px] font-bold text-[#856404] bg-[#FFF8D9] px-2 py-0.5 rounded-full border border-[#B59A50]/30 flex items-center gap-1">
                        <Award className="w-3 h-3 text-[#b59a50]" />
                        Score: {intel.dealScore}/10 · {intel.scoreTier}
                      </span>
                      {/* Fake Discount Warning */}
                      {intel.isFakeDiscount && (
                        <span className="text-[10px] font-bold text-[#D97706] bg-[#FFFBEB] px-2 py-0.5 rounded-full border border-[#D97706]/30 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-[#D97706]" />
                          Artificial MRP Alert
                        </span>
                      )}
                    </div>

                    <div className="flex items-start justify-between">
                      <h3 
                        onClick={() => setSelectedProduct(prod)}
                        className="text-lg font-serif font-bold text-[#333333] hover:text-[#b59a50] cursor-pointer transition-colors"
                      >
                        {prod.name}
                      </h3>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setCompareTargetA(prod);
                            setCompareOpen(true);
                          }}
                          className="text-[11px] font-semibold text-[#666666] hover:text-[#333333] px-2 py-0.5 rounded bg-[#F8F9FA] border border-[#EBEBF0] transition-colors flex items-center gap-1"
                        >
                          <Scale className="w-3 h-3" />
                          Compare
                        </button>
                        <button
                          onClick={() => setSelectedProduct(prod)}
                          className="text-[11px] font-semibold text-[#b59a50] hover:text-[#856404] px-2 py-0.5 rounded bg-[#FFF8D9] border border-[#B59A50]/30 transition-colors"
                        >
                          30-Day Trends
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-[#666666] mt-0.5">{prod.tagline}</p>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {(prod.specs || []).map((s) => (
                        <span 
                          key={s} 
                          className="text-xs bg-[#F8F9FA] border border-[#EBEBF0] text-[#666666] px-2.5 py-1 rounded"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right: Multi-store prices */}
                  <div className="lg:w-80 flex-shrink-0 bg-[#FAFAFA] rounded-xl p-3.5 border border-[#EBEBF0]">
                    <div className="text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2 flex justify-between">
                      <span>Store Price Match</span>
                      {cheapest && (
                        <span className="text-[#008738] font-bold">Lowest: ₹{cheapest.price?.toLocaleString('en-IN')}</span>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      {prod.price && Object.entries(prod.price).map(([storeKey, price]) => {
                        const store = STORE_CONFIG[storeKey];
                        const isCheapest = cheapest && storeKey === cheapest.store;
                        const cloakedUrl = getAffiliateUrl(storeKey, prod.name, prod[`${storeKey}Url`]);

                        return (
                          <div 
                            key={storeKey}
                            className={`flex items-center justify-between p-2 rounded-lg text-xs transition-colors ${
                              isCheapest 
                                ? 'bg-[#F3FBEF] border border-[#008738]/40 text-[#333333] font-medium' 
                                : 'bg-white border border-[#EBEBF0] text-[#666666]'
                            }`}
                          >
                            <span className="font-medium">{store?.name || storeKey}</span>

                            <div className="flex items-center gap-2 font-mono tabular-nums">
                              <span className={isCheapest ? 'text-[#008738] font-bold text-sm' : 'text-[#333333]'}>
                                ₹{price?.toLocaleString('en-IN')}
                              </span>
                              <a
                                href={cloakedUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => recordAffiliateClick(storeKey, prod.id, prod.name)}
                                className="text-[#9E9E9E] hover:text-[#333333] p-0.5 transition-colors"
                              >
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {cheapest && (
                      <a
                        href={getAffiliateUrl(cheapest.store, prod.name, prod[`${cheapest.store}Url`])}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => recordAffiliateClick(cheapest.store, prod.id, prod.name)}
                        className="mt-3 w-full py-2 bg-[#008738] hover:bg-[#00702e] text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-sm"
                      >
                        Buy on {STORE_CONFIG[cheapest.store]?.name || cheapest.store} (₹{cheapest.price?.toLocaleString('en-IN')})
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

      {/* STITCH GENERATED PRODUCT DETAIL MODAL */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* 1v1 HARDWARE SPEC COMPARE MODAL */}
      {compareOpen && (
        <CompareModal
          products={recommendations}
          initialA={compareTargetA || recommendations[0]}
          initialB={recommendations[1] || recommendations[0]}
          onClose={() => setCompareOpen(false)}
        />
      )}

      {/* TACTILE TOAST NOTIFICATION */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}

    </div>
  );
}
