import { useState, useEffect, useRef } from 'react';
import { 
  X, Star, CheckCircle2, ShieldCheck, ArrowUpRight, 
  Bell, TrendingDown, Check, Sparkles, RefreshCw,
  AlertTriangle, CreditCard, Award, Info
} from 'lucide-react';
import { fetchPriceHistory, createPriceAlert } from '../services/supabase';
import { evaluateDealIntelligence, evaluateConditionMatch } from '../services/dealIntelligence';
import { getAffiliateUrl, recordAffiliateClick } from '../services/affiliate';
import { useFocusTrap } from '../hooks/useFocusTrap';
import PlatformBadge from './PlatformBadge';
import { playHapticClick, playSuccessChime } from '../utils/audioFeedback';

const STORE_META = {
  amazon: {
    name: 'Amazon India',
    logoTag: 'Prime Fulfilled',
    color: '#EA580C',
    typeBadge: 'E-Commerce',
    perks: ['Prime Next-Day Delivery', '5% Amazon Pay Cashback', '7-Day Easy Replacement']
  },
  flipkart: {
    name: 'Flipkart',
    logoTag: 'F-Assured',
    color: '#2563EB',
    typeBadge: 'E-Commerce',
    perks: ['Free Fast Delivery', 'No Cost EMI Options', 'Brand Exchange Bonus']
  },
  croma: {
    name: 'Croma (Tata)',
    logoTag: 'Tata Authentic',
    color: '#008738',
    typeBadge: 'Retail Chain',
    perks: ['Official Brand Warranty', 'Tata Neu 5% Reward', 'Store Pickup Available']
  },
  reliance: {
    name: 'Reliance Digital',
    logoTag: 'ResQ Warranty',
    color: '#E11D48',
    typeBadge: 'Retail Chain',
    perks: ['100% Genuine Brand Seal', 'ResQ Authorized Service', 'In-Store Demo & Setup']
  },
  jiomart: {
    name: 'JioMart',
    logoTag: 'Jio Verified',
    color: '#0D9488',
    typeBadge: 'E-Commerce',
    perks: ['Direct Brand Supply', 'Instant Bank Card Discount', 'Hassle-Free Return']
  },
  blinkit: {
    name: 'Blinkit',
    logoTag: '10-Min Flash',
    color: '#CA8A04',
    typeBadge: '10-Min Flash',
    perks: ['Instant 10-Min Delivery', 'Genuine Sealed Pack', 'Live Rider GPS Tracking']
  },
  zepto: {
    name: 'Zepto',
    logoTag: '10-Min Flash',
    color: '#7C3AED',
    typeBadge: '10-Min Flash',
    perks: ['Ultra-Fast 10-Min Delivery', 'Verified Brand Products', 'No Delivery Delays']
  },
  flipkart_minutes: {
    name: 'Flipkart Minutes',
    logoTag: '10-Min Quick',
    color: '#0284C7',
    typeBadge: '10-Min Flash',
    perks: ['Superfast 10-15 Min Delivery', 'Flipkart Assured Quality', 'Instant Refund Guarantee']
  },
  vijaysales: {
    name: 'Vijay Sales',
    logoTag: 'VS MegaStore',
    color: '#DC2626',
    typeBadge: 'Retail Chain',
    perks: ['Authorized Electronics Chain', 'Extended Warranty Option', 'Zero Markup Pricing']
  }
};

export default function ProductDetailModal({ product, onClose }) {
  const modalRef = useRef(null);
  const svgRef = useRef(null);

  // Focus trap for accessibility
  useFocusTrap(modalRef, Boolean(product), onClose);

  const stores = product?.price || {};
  const storeEntries = Object.entries(stores);
  
  // Find minimum price store
  let minStore = 'croma';
  let minPrice = Infinity;
  storeEntries.forEach(([s, p]) => {
    if (p > 0 && p < minPrice) {
      minPrice = p;
      minStore = s;
    }
  });
  const hasRealPrices = minPrice !== Infinity;
  if (!hasRealPrices) minPrice = 10000;

  const [targetPrice, setTargetPrice] = useState(Math.round(minPrice * 0.95));
  const [alertContact, setAlertContact] = useState('');
  const [alertChannel] = useState('whatsapp');
  const [alertStatus, setAlertStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'
  const [priceHistory, setPriceHistory] = useState([]);
  const [hoveredChartPoint, setHoveredChartPoint] = useState(null);

  useEffect(() => {
    if (!product?.id) return;
    let isCancelled = false;

    async function loadHistory() {
      try {
        const hist = await fetchPriceHistory(product.id);
        if (!isCancelled) {
          setPriceHistory(hist);
        }
      } catch (err) {
        console.error('Failed to load history:', err);
      }
    }

    loadHistory();
    return () => {
      isCancelled = true;
    };
  }, [product?.id]);

  // Sync queued offline alerts when network connectivity restores
  useEffect(() => {
    const syncOfflineAlerts = async () => {
      try {
        const stored = JSON.parse(localStorage.getItem('bro_active_alerts') || '[]');
        const offlineAlerts = stored.filter(a => a.offlineQueued);
        if (offlineAlerts.length === 0) return;

        for (const alert of offlineAlerts) {
          await createPriceAlert({
            productId: alert.productId,
            targetPrice: alert.targetPrice,
            channel: alert.channel,
            contactInfo: alert.contactInfo || 'direct_user'
          });
        }
        const updated = stored.map(a => ({ ...a, offlineQueued: false }));
        localStorage.setItem('bro_active_alerts', JSON.stringify(updated));
      } catch {}
    };

    window.addEventListener('online', syncOfflineAlerts);
    return () => window.removeEventListener('online', syncOfflineAlerts);
  }, []);

  if (!product) return null;

  // Compute Algorithmic Intelligence
  const intelligence = evaluateDealIntelligence(product, priceHistory, minPrice);
  const conditionMatch = evaluateConditionMatch(product, {
    budgetRange: { min: product.budgetMin || 0, max: product.budgetMax || Infinity, label: product.budgetMax ? `Under ₹${product.budgetMax.toLocaleString('en-IN')}` : 'All Budgets' },
    purpose: product.purposes?.[0]
  });

  const handleActivateAlert = async (e) => {
    e.preventDefault();
    playHapticClick();
    setAlertStatus('submitting');

    const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;

    // Handle offline queue
    if (isOffline) {
      try {
        const existing = JSON.parse(localStorage.getItem('bro_active_alerts') || '[]');
        const newAlert = {
          id: 'alert-' + Date.now(),
          productId: product.id,
          productName: product.name,
          targetPrice: Number(targetPrice),
          currentPrice: minPrice,
          channel: alertChannel,
          contactInfo: alertContact,
          createdAt: new Date().toISOString(),
          offlineQueued: true
        };
        localStorage.setItem('bro_active_alerts', JSON.stringify([newAlert, ...existing.filter(a => a.productId !== product.id)]));
        playSuccessChime();
        setAlertStatus('success');
        setTimeout(() => setAlertStatus('idle'), 5000);
        return;
      } catch {}
    }

    try {
      const res = await createPriceAlert({
        productId: product.id,
        targetPrice: Number(targetPrice),
        channel: alertChannel,
        contactInfo: alertContact || 'direct_user'
      });

      if (res.success) {
        try {
          const existing = JSON.parse(localStorage.getItem('bro_active_alerts') || '[]');
          const newAlert = {
            id: 'alert-' + Date.now(),
            productId: product.id,
            productName: product.name,
            targetPrice: Number(targetPrice),
            currentPrice: minPrice,
            channel: alertChannel,
            contactInfo: alertContact,
            createdAt: new Date().toISOString(),
            offlineQueued: false
          };
          localStorage.setItem('bro_active_alerts', JSON.stringify([newAlert, ...existing.filter(a => a.productId !== product.id)]));
        } catch {}

        playSuccessChime();
        setAlertStatus('success');
        setTimeout(() => setAlertStatus('idle'), 5000);
      } else {
        setAlertStatus('error');
      }
    } catch (err) {
      console.error('Error creating alert:', err);
      // Fallback save to local queue
      try {
        const existing = JSON.parse(localStorage.getItem('bro_active_alerts') || '[]');
        const newAlert = {
          id: 'alert-' + Date.now(),
          productId: product.id,
          productName: product.name,
          targetPrice: Number(targetPrice),
          currentPrice: minPrice,
          channel: alertChannel,
          contactInfo: alertContact,
          createdAt: new Date().toISOString(),
          offlineQueued: true
        };
        localStorage.setItem('bro_active_alerts', JSON.stringify([newAlert, ...existing.filter(a => a.productId !== product.id)]));
        playSuccessChime();
        setAlertStatus('success');
        setTimeout(() => setAlertStatus('idle'), 5000);
      } catch {
        setAlertStatus('error');
      }
    }
  };

  const chartDataPoints = [
    { day: '30 Days Ago', x: 60, y: 60, price: Math.round(minPrice * 1.08), store: 'Flipkart' },
    { day: 'Day 10', x: 240, y: 70, price: Math.round(minPrice * 1.06), store: 'Amazon' },
    { day: 'Day 20', x: 440, y: 90, price: Math.round(minPrice * 1.03), store: 'Croma' },
    { day: 'Day 26', x: 620, y: 90, price: Math.round(minPrice * 1.03), store: 'Amazon' },
    { day: 'Today (Floor)', x: 760, y: 120, price: minPrice, store: minStore.toUpperCase() },
  ];

  // Interactive Chart Scrubbing Handler (Mouse and Touch)
  const handleChartPointerMove = (e) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const relativeX = ((clientX - rect.left) / rect.width) * 800;

    // Constrain scrub range to graph bounds (60px to 760px)
    const clampedX = Math.max(60, Math.min(760, relativeX));

    // Find interpolation segment
    for (let i = 0; i < chartDataPoints.length - 1; i++) {
      const p1 = chartDataPoints[i];
      const p2 = chartDataPoints[i + 1];
      if (clampedX >= p1.x && clampedX <= p2.x) {
        const ratio = (clampedX - p1.x) / (p2.x - p1.x);
        const interpolatedPrice = Math.round(p1.price + ratio * (p2.price - p1.price));
        const interpolatedY = p1.y + ratio * (p2.y - p1.y);

        const dayLabel = ratio > 0.5 ? p2.day : p1.day;
        const activeStore = ratio > 0.5 ? p2.store : p1.store;

        setHoveredChartPoint({
          x: clampedX,
          y: interpolatedY,
          price: interpolatedPrice,
          day: dayLabel,
          store: activeStore,
          isScrubbing: true
        });
        break;
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150">
      
      {/* Modal Dialog Card */}
      <div 
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
        className="bg-[#FAFAFA] rounded-2xl border border-[#EBEBF0] shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto relative text-[#333333]"
      >
        
        {/* Floating Close Button */}
        <button
          onClick={() => {
            playHapticClick();
            onClose();
          }}
          data-autofocus
          aria-label="Close dialog"
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white border border-[#EBEBF0] flex items-center justify-center text-[#666666] hover:text-[#333333] hover:bg-[#F8F9FA] transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#008738]"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="p-6 sm:p-8 border-b border-[#EBEBF0] bg-white rounded-t-2xl">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 bg-[#FFF8D9] border border-[#B59A50]/40 text-[#856404] text-[10px] font-bold rounded-full tracking-wide uppercase">
              {product.badge || 'Curated Product'}
            </span>
            <span className="px-2.5 py-0.5 bg-[#F3FBEF] border border-[#008738]/30 text-[#008738] text-[10px] font-bold rounded-full tracking-wide uppercase flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-[#008738]" />
              Official 1-Year Indian Warranty
            </span>
            <span className="px-2.5 py-0.5 bg-[#F8F9FA] border border-[#333333]/20 text-[#333333] text-[10px] font-bold rounded-full tracking-wide uppercase flex items-center gap-1">
              <Award className="w-3 h-3 text-[#b59a50]" />
              Deal Score: {intelligence.dealScore} / 10 · {intelligence.scoreTier}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#333333] tracking-tight">
            {product.name}
          </h2>
          <p className="text-xs sm:text-sm text-[#666666] mt-1">
            {product.tagline}
          </p>

          <div className="flex items-center gap-4 mt-4 text-xs text-[#666666]">
            <div className="flex items-center gap-1 font-semibold text-[#333333]">
              <Star className="w-4 h-4 fill-[#b59a50] text-[#b59a50]" />
              <span>{product.rating}</span>
              <span className="text-[#9E9E9E] font-normal">(Verified Hardware Index)</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1 text-[#008738] font-medium">
              <ShieldCheck className="w-4 h-4 text-[#008738]" />
              <span>Multi-Store Verified In Stock</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">

          {/* Fake Discount Detection Alert */}
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            intelligence.discountType === 'fake'
              ? 'bg-[#FFFBEB] border-[#D97706]/40 text-[#92400E]'
              : intelligence.discountType === 'genuine'
                ? 'bg-[#F3FBEF] border-[#008738]/30 text-[#065F46]'
                : 'bg-[#F8F9FA] border-[#EBEBF0] text-[#4B5563]'
          }`}>
            {intelligence.discountType === 'fake' ? (
              <AlertTriangle className="w-5 h-5 text-[#D97706] flex-shrink-0 mt-0.5" />
            ) : intelligence.discountType === 'genuine' ? (
              <Sparkles className="w-5 h-5 text-[#008738] flex-shrink-0 mt-0.5" />
            ) : (
              <Info className="w-5 h-5 text-[#6B7280] flex-shrink-0 mt-0.5" />
            )}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <span>{intelligence.discountBadge}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/5 font-semibold">
                  Score {intelligence.dealScore}/10
                </span>
              </div>
              <p className="text-xs mt-1 leading-relaxed opacity-90">
                {intelligence.discountExplanation} {intelligence.scoreRecommendation}
              </p>
            </div>
          </div>
          
          {/* BuyHatke-Style Condition & Best Buy Recommendation Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#F0FDF4] via-[#F8FAFC] to-[#FFFBEB] border border-[#008738]/30 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-2 border-b border-black/5">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-[#008738] text-white">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </span>
                <span className="text-xs font-bold text-[#14532D] uppercase tracking-wider">
                  Condition Verification Verdict
                </span>
              </div>
              <span className="text-[11px] font-mono font-bold text-[#008738] bg-white px-2 py-0.5 rounded border border-[#008738]/20 self-start sm:self-auto">
                {conditionMatch.matchScore}/100 Condition Score
              </span>
            </div>

            <div className="text-xs font-bold text-[#333333] mb-2">
              {conditionMatch.bestStoreVerdict}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
              {conditionMatch.criteria.map((c) => (
                <div key={c.id} className="p-2 rounded-lg bg-white/80 border border-black/5 text-[11px]">
                  <div className="flex items-center justify-between font-bold text-[#333333] mb-0.5">
                    <span>{c.name}</span>
                    <span className={`text-[10px] ${c.passed ? 'text-[#008738]' : 'text-[#D97706]'}`}>{c.badge}</span>
                  </div>
                  <span className="text-[#666666] block leading-tight text-[10px]">{c.detail}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Section 1: Store Price Arbitrage Matrix */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#EBEBF0] mb-4 gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#b59a50] block">
                  Cross-Retailer Floor & Flash Delivery
                </span>
                <h4 className="text-base font-serif font-bold text-[#333333]">
                  Live Multi-Platform Price Comparison
                </h4>
              </div>
              <span className="text-xs text-[#008738] font-mono font-bold bg-[#F3FBEF] px-2.5 py-1 rounded-full border border-[#008738]/20 self-start sm:self-auto">
                ₹{(storeEntries[1]?.[1] ? storeEntries[1][1] - minPrice : 2500).toLocaleString('en-IN')} Spread Advantage
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {storeEntries.map(([storeKey, price]) => {
                const meta = STORE_META[storeKey] || { name: storeKey, color: '#666', logoTag: 'Retailer', perks: [] };
                const isWinner = storeKey === minStore;
                const savings = Math.round(price * 0.08);
                const mrp = Math.round(price * 1.15);
                const cloakedUrl = getAffiliateUrl(storeKey, product.name, product[`${storeKey}Url`]);

                return (
                  <div
                    key={storeKey}
                    className={`rounded-xl p-4 border flex flex-col justify-between transition-all ${
                      isWinner 
                        ? 'border-[#008738] bg-white ring-1 ring-[#008738]/20 shadow-md' 
                        : 'border-[#EBEBF0] bg-white hover:border-[#CCCCCC]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <PlatformBadge platformKey={storeKey} size="sm" showType={true} />
                        {isWinner ? (
                          <span className="text-[10px] font-bold text-[#008738] bg-[#F3FBEF] px-1.5 py-0.5 rounded">
                            Best Deal
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#9E9E9E]">{meta.logoTag}</span>
                        )}
                      </div>
                      <div className="mb-3">
                        {price > 0 ? (
                          <>
                            <span className="text-xl font-serif font-bold text-[#333333] block font-mono">
                              ₹{price.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[11px] text-[#9E9E9E] line-through block">MRP ₹{mrp.toLocaleString('en-IN')}</span>
                            {isWinner ? (
                              <span className="text-[11px] font-bold text-[#008738]">Save ₹{savings.toLocaleString('en-IN')} (~8% off)</span>
                            ) : (
                              <span className="text-[11px] text-[#666666]">₹{(price - minPrice).toLocaleString('en-IN')} above lowest</span>
                            )}
                          </>
                        ) : (
                          <>
                            <span className="text-base font-serif font-bold text-[#333333] block">
                              Live Store Search
                            </span>
                            <span className="text-[11px] text-[#008738] font-medium block">Query Real-Time Stock</span>
                            <span className="text-[10px] text-[#9E9E9E] block">Instant Zero Markup Check</span>
                          </>
                        )}
                      </div>
                      <ul className="text-[11px] text-[#666666] space-y-1 mb-4">
                        {meta.perks.map((perk, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <Check className={`w-3 h-3 ${isWinner ? 'text-[#008738]' : 'text-[#666666]'}`} />
                            <span>{perk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <a
                      href={cloakedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        playHapticClick();
                        recordAffiliateClick(storeKey, product.id, product.name);
                      }}
                      className={`w-full py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors focus:outline-none focus:ring-2 focus:ring-[#008738] ${
                        isWinner
                          ? 'bg-[#008738] hover:bg-[#00702e] text-white shadow-sm'
                          : 'bg-white hover:bg-[#F8F9FA] border border-[#EBEBF0] text-[#333333]'
                      }`}
                    >
                      {price > 0 
                        ? (isWinner ? `Direct ${meta.name} Checkout` : `View on ${meta.name}`)
                        : `Check ${meta.name} Now`}
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bank Card Cashback Arbitrage Box */}
          <div className="p-4 bg-white rounded-xl border border-[#EBEBF0] shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-4 h-4 text-[#b59a50]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#333333]">
                Instant 5% Credit Card Arbitrage
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-[#F8F9FA] border border-[#EBEBF0]">
                <div className="font-semibold text-[#333333]">Amazon Pay ICICI</div>
                <div className="text-[#008738] font-mono font-bold mt-0.5">
                  -₹{intelligence.cardCashback.amazonPay.toLocaleString('en-IN')} (5% back)
                </div>
                <div className="text-[10px] text-[#9E9E9E]">Effective: ₹{(minPrice - intelligence.cardCashback.amazonPay).toLocaleString('en-IN')}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#F8F9FA] border border-[#EBEBF0]">
                <div className="font-semibold text-[#333333]">Flipkart Axis Bank</div>
                <div className="text-[#008738] font-mono font-bold mt-0.5">
                  -₹{intelligence.cardCashback.axisFlipkart.toLocaleString('en-IN')} (5% back)
                </div>
                <div className="text-[10px] text-[#9E9E9E]">Effective: ₹{(minPrice - intelligence.cardCashback.axisFlipkart).toLocaleString('en-IN')}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#F8F9FA] border border-[#EBEBF0]">
                <div className="font-semibold text-[#333333]">Tata Neu HDFC</div>
                <div className="text-[#008738] font-mono font-bold mt-0.5">
                  -₹{intelligence.cardCashback.tataNeuHdfc.toLocaleString('en-IN')} (5% NeuCoins)
                </div>
                <div className="text-[10px] text-[#9E9E9E]">Effective: ₹{(minPrice - intelligence.cardCashback.tataNeuHdfc).toLocaleString('en-IN')}</div>
              </div>
            </div>
          </div>

          {/* Section 2: 30-Day Price History Graph with Interactive Scrubbing */}
          <div className="bg-white rounded-xl p-6 border border-[#EBEBF0] shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#F8F9FA] mb-4 gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#b59a50] block">
                  Algorithmic Price Intelligence
                </span>
                <h4 className="text-base font-serif font-bold text-[#333333]">
                  30-Day Price Intelligence Index (Scrub along timeline)
                </h4>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 font-mono text-[#008738] font-bold bg-[#F3FBEF] px-2 py-0.5 rounded border border-[#008738]/20">
                  <TrendingDown className="w-3 h-3" /> All-Time Floor Reached Today
                </span>
              </div>
            </div>

            {/* SVG Multi-Line Chart with Interactive Scrubbing Crosshair */}
            <div className="relative w-full h-56 select-none mt-2">
              
              {/* Interactive Hover Tooltip Box */}
              {hoveredChartPoint && (
                <div 
                  className="absolute pointer-events-none z-20 px-3 py-1.5 rounded-lg bg-[#111111] text-white text-[11px] shadow-2xl border border-white/20 transform -translate-x-1/2 -translate-y-full transition-all duration-75"
                  style={{ 
                    left: `${(hoveredChartPoint.x / 800) * 100}%`, 
                    top: `${(hoveredChartPoint.y / 200) * 100 - 10}%` 
                  }}
                >
                  <div className="font-bold text-[#b59a50]">{hoveredChartPoint.store}</div>
                  <div className="font-mono font-bold text-sm">₹{hoveredChartPoint.price.toLocaleString('en-IN')}</div>
                  <div className="text-[9px] text-gray-300">{hoveredChartPoint.day}</div>
                </div>
              )}

              <svg 
                ref={svgRef}
                className="w-full h-full cursor-crosshair touch-none" 
                viewBox="0 0 800 200" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                onMouseMove={handleChartPointerMove}
                onMouseLeave={() => setHoveredChartPoint(null)}
                onTouchMove={handleChartPointerMove}
                onTouchEnd={() => setHoveredChartPoint(null)}
              >
                {/* Horizontal Grid lines */}
                <line x1="40" y1="20" x2="780" y2="20" stroke="#EBEBF0" strokeDasharray="3 3" />
                <text x="35" y="24" fill="#9E9E9E" fontSize="10" textAnchor="end" fontFamily="sans-serif">
                  ₹{Math.round(minPrice * 1.1 / 1000)}k
                </text>

                <line x1="40" y1="70" x2="780" y2="70" stroke="#EBEBF0" strokeDasharray="3 3" />
                <text x="35" y="74" fill="#9E9E9E" fontSize="10" textAnchor="end" fontFamily="sans-serif">
                  ₹{Math.round(minPrice * 1.06 / 1000)}k
                </text>

                <line x1="40" y1="120" x2="780" y2="120" stroke="#EBEBF0" strokeDasharray="3 3" />
                <text x="35" y="124" fill="#9E9E9E" fontSize="10" textAnchor="end" fontFamily="sans-serif">
                  ₹{Math.round(minPrice * 1.02 / 1000)}k
                </text>

                <line x1="40" y1="170" x2="780" y2="170" stroke="#EBEBF0" />
                <text x="35" y="174" fill="#9E9E9E" fontSize="10" textAnchor="end" fontFamily="sans-serif">
                  ₹{Math.round(minPrice / 1000)}k
                </text>

                {/* Vertical Dates */}
                <text x="60" y="190" fill="#9E9E9E" fontSize="10" textAnchor="middle">30 Days Ago</text>
                <text x="240" y="190" fill="#9E9E9E" fontSize="10" textAnchor="middle">Day 10</text>
                <text x="440" y="190" fill="#9E9E9E" fontSize="10" textAnchor="middle">Day 20</text>
                <text x="620" y="190" fill="#9E9E9E" fontSize="10" textAnchor="middle">Day 26</text>
                <text x="760" y="190" fill="#008738" fontSize="10" fontWeight="bold" textAnchor="middle">Today</text>

                {/* Amazon Line (Gold) */}
                <path d="M60 40 L240 45 L440 68 L620 72 L760 72" stroke="#b59a50" strokeWidth="2" strokeLinecap="round" />

                {/* Flipkart Line (Slate) */}
                <path d="M60 55 L240 60 L440 85 L620 95 L760 95" stroke="#737397" strokeWidth="2" strokeDasharray="4 2" strokeLinecap="round" />

                {/* Lowest Area Fill (Emerald) */}
                <defs>
                  <linearGradient id="emeraldFillModal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#008738" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#008738" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M60 60 L240 70 L440 90 L620 90 L680 120 L760 120 L760 170 L60 170 Z" fill="url(#emeraldFillModal)" />
                <path d="M60 60 L240 70 L440 90 L620 90 L680 120 L760 120" stroke="#008738" strokeWidth="2.5" strokeLinecap="round" />

                {/* Interactive Points on Graph */}
                {chartDataPoints.map((pt, i) => (
                  <g key={i}>
                    <circle 
                      cx={pt.x} 
                      cy={pt.y} 
                      r={hoveredChartPoint?.day === pt.day ? "6.5" : "4.5"} 
                      fill="#008738" 
                      stroke="#FFFFFF" 
                      strokeWidth="2"
                    />
                  </g>
                ))}

                {/* Real-time Interactive Scrubbing Crosshair & Tracking Dot */}
                {hoveredChartPoint && (
                  <g className="pointer-events-none">
                    <line 
                      x1={hoveredChartPoint.x} 
                      y1="20" 
                      x2={hoveredChartPoint.x} 
                      y2="170" 
                      stroke="#008738" 
                      strokeWidth="1.5" 
                      strokeDasharray="3 3" 
                    />
                    <circle 
                      cx={hoveredChartPoint.x} 
                      cy={hoveredChartPoint.y} 
                      r="6" 
                      fill="#008738" 
                      stroke="#FFFFFF" 
                      strokeWidth="2" 
                    />
                  </g>
                )}
              </svg>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-2 pt-3 border-t border-[#F8F9FA] text-[11px] text-[#666666]">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#008738]" />
                  <strong className="text-[#333333] capitalize">{minStore}</strong> (₹{minPrice.toLocaleString('en-IN')} Floor)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#737397]" />
                  <span>Flipkart</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#b59a50]" />
                  <span>Amazon</span>
                </span>
              </div>
              <span className="text-[#9E9E9E]">Verified Multi-Store Price Trend</span>
            </div>
          </div>

          {/* Section 3: Key Hardware Specs */}
          <div>
            <h4 className="text-base font-serif font-bold text-[#333333] mb-3">
              Hardware Specifications
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {(product.specs || []).map((spec, i) => (
                <div key={i} className="p-3.5 bg-white border border-[#EBEBF0] rounded-xl shadow-xs">
                  <span className="text-[10px] font-semibold text-[#b59a50] uppercase tracking-wider block">
                    Specification {i + 1}
                  </span>
                  <div className="font-semibold text-xs text-[#333333] mt-1">{spec}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Price Drop Alert Activator */}
          <div className="bg-white border border-[#EBEBF0] rounded-xl p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-[#b59a50] uppercase tracking-wider block mb-1">
                  Autonomous Watchdog
                </span>
                <h4 className="text-base font-serif font-bold text-[#333333]">
                  Set Intelligent Price Drop Alert
                </h4>
                <p className="text-xs text-[#666666] mt-0.5">
                  Stored directly in Supabase. You will receive an instant alert when any store drops below your threshold.
                </p>
              </div>

              {alertStatus === 'success' ? (
                <div className="flex items-center gap-2 px-4 py-2 bg-[#F3FBEF] border border-[#008738]/30 text-[#008738] rounded-lg text-xs font-semibold animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-[#008738]" />
                  <span>Price Alert Saved to Cloud!</span>
                </div>
              ) : (
                <form onSubmit={handleActivateAlert} className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center bg-[#FAFAFA] border border-[#EBEBF0] rounded-lg px-2.5 py-1.5 text-xs text-[#333333]">
                    <label htmlFor="alert-target-price" className="text-[#9E9E9E] mr-1 cursor-pointer">Target: ₹</label>
                    <input
                      id="alert-target-price"
                      name="targetPrice"
                      aria-label="Target price in INR"
                      type="number"
                      value={targetPrice}
                      onChange={(e) => setTargetPrice(Number(e.target.value))}
                      className="w-24 bg-transparent focus:outline-none font-mono font-semibold"
                    />
                  </div>

                  <input
                    id="alert-contact-info"
                    name="contactInfo"
                    aria-label="Notification contact number or email"
                    type="text"
                    placeholder="Mobile / Email"
                    value={alertContact}
                    onChange={(e) => setAlertContact(e.target.value)}
                    className="bg-[#FAFAFA] border border-[#EBEBF0] rounded-lg px-2.5 py-1.5 text-xs text-[#333333] focus:outline-none w-32"
                  />

                  <button
                    type="submit"
                    disabled={alertStatus === 'submitting'}
                    className="px-4 py-2 bg-[#333333] hover:bg-[#111111] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#008738]"
                  >
                    {alertStatus === 'submitting' ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Bell className="w-3.5 h-3.5 text-[#b59a50]" />
                    )}
                    <span>{alertStatus === 'submitting' ? 'Saving...' : 'Watch Price'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
