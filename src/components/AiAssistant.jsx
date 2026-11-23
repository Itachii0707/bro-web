import { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, ArrowRight, Bot, User, CheckCircle2, 
  ExternalLink, Zap, Compass, Car, ShoppingBag, 
  ChevronRight, RefreshCw, Cpu, ShieldCheck
} from 'lucide-react';
import { PRODUCTS, getRecommendations, getCheapestStore, searchProducts, createDynamicProduct } from '../data/electronics';
import { calculateFares, RIDE_TYPES } from '../data/rides';

const SAMPLE_PROMPTS = [
  { icon: '⚡', label: 'Fast GaN charger under ₹2000', query: 'fast charger under 2000' },
  { icon: '📱', label: 'Best camera phone ₹20k - ₹40k', query: 'camera phone under 40000' },
  { icon: '🚗', label: 'Ride from Koramangala to Airport', query: 'ride to airport from koramangala' },
  { icon: '🎧', label: 'Best ANC earbuds for college', query: 'anc earbuds for college under 3000' },
  { icon: '💻', label: 'Laptop for programming under ₹45k', query: 'programming laptop under 45000' },
];

export default function AiAssistant({ onSelectCategory, onNavigateRides, initialPrompt, onClearInitialPrompt }) {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'init-1',
      role: 'assistant',
      text: "Hey! I'm **BRO AI**, your smart price and city transit copilot. Ask me anything like *'Find a durable braided cable under ₹500'* or *'Cheapest ride to Bangalore Airport'*. What are we finding today?",
      timestamp: 'Just now',
    }
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const [thoughtSteps, setThoughtSteps] = useState([]);
  const chatEndRef = useRef(null);
  const lastHandledPromptRef = useRef(null);

  useEffect(() => {
    if (initialPrompt && initialPrompt.trim() && lastHandledPromptRef.current !== initialPrompt) {
      lastHandledPromptRef.current = initialPrompt;
      handleSend(initialPrompt);
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
  }, [initialPrompt]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking, thoughtSteps]);

  const handleSend = (textToSend) => {
    const prompt = (textToSend || query).trim();
    if (!prompt) return;

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setIsThinking(true);
    setThoughtSteps([]);

    // Simulated multi-step AI reasoning trace
    const steps = [
      "Parsing semantic intent and constraint bounds...",
      "Cross-referencing live pricing indices across Amazon, Flipkart & Croma...",
      "Evaluating price-to-spec Pareto optimality curve...",
      "Synthesizing optimal recommendation card..."
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setThoughtSteps(prev => [...prev, step]);
      }, (idx + 1) * 350);
    });

    setTimeout(() => {
      generateAiResponse(prompt);
      setIsThinking(false);
    }, 1800);
  };

  const generateAiResponse = (userPrompt) => {
    const lower = userPrompt.toLowerCase();
    
    // Check if it's a ride query
    if (lower.includes('ride') || lower.includes('uber') || lower.includes('rapido') || lower.includes('cab') || lower.includes('airport') || lower.includes('traffic')) {
      const distance = lower.includes('airport') ? 35 : (lower.includes('whitefield') ? 18 : 12);
      const fares = calculateFares('Bangalore', 'sedan', distance);
      const best = fares[0];

      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: `I've analyzed the real-time mobility grid for Bangalore. For an estimated **${distance} km** commute, **${best.platform.name}** is currently your most economical carrier, saving you ₹${fares[fares.length - 1].fare - best.fare} compared to the highest quote.`,
        rideData: {
          distance,
          fares,
          city: 'Bangalore',
          rideType: 'Sedan / Go'
        },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
      return;
    }

    // Check if user specifically asked for a specific model or gadget name
    const catalogMatches = searchProducts(userPrompt);
    if (catalogMatches.length > 0) {
      const topPicks = catalogMatches.slice(0, 3);
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: `Here is the verified hardware intelligence for **"${userPrompt}"** with real-time multi-carrier store pricing across Amazon, Flipkart, and Croma:`,
        products: topPicks,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
      return;
    }

    // Check if query is about a known gadget brand or phone query (e.g. "iqoo 15", "realme", "iphone 17")
    const gadgetKeywords = ['phone', 'mobile', 'iqoo', 'pixel', 'samsung', 'apple', 'iphone', 'oneplus', 'xiaomi', 'redmi', 'realme', 'vivo', 'oppo', 'poco', 'laptop', 'macbook', 'charger', 'buds', 'watch'];
    const isGadgetQuery = gadgetKeywords.some(k => lower.includes(k));

    if (isGadgetQuery) {
      const exactMatches = searchProducts(userPrompt);
      const dynamicProd = createDynamicProduct(userPrompt);
      const productsToShow = exactMatches.length > 0 
        ? exactMatches.slice(0, 3) 
        : [dynamicProd, ...searchProducts(lower.split(' ')[0]).slice(0, 2)];

      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: `Here is the verified hardware intelligence and multi-store pricing for **"${userPrompt}"** across Amazon, Flipkart, and Croma:`,
        products: productsToShow,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
      return;
    }

    // Otherwise treat as constraint-based electronics category search
    let targetCategory = 'smartphone';
    let budgetMax = 50000;
    let budgetMin = 0;
    let purpose = null;

    if (lower.includes('charger') || lower.includes('gan') || lower.includes('adapter')) {
      targetCategory = 'charger';
      budgetMax = 3000;
    } else if (lower.includes('cable') || lower.includes('wire')) {
      targetCategory = 'cable';
      budgetMax = 600;
    } else if (lower.includes('earbud') || lower.includes('tws') || lower.includes('headphone') || lower.includes('anc')) {
      targetCategory = lower.includes('headphone') ? 'headphone' : 'tws';
      budgetMax = 5000;
    } else if (lower.includes('laptop') || lower.includes('macbook') || lower.includes('coding')) {
      targetCategory = 'laptop';
      budgetMax = 60000;
      purpose = 'Programming / Dev';
    } else if (lower.includes('watch') || lower.includes('smartwatch')) {
      targetCategory = 'smartwatch';
      budgetMax = 30000;
    } else if (lower.includes('powerbank') || lower.includes('battery')) {
      targetCategory = 'powerbank';
      budgetMax = 4000;
    } else if (lower.includes('tv') || lower.includes('television')) {
      targetCategory = 'tv';
      budgetMax = 35000;
    } else if (lower.includes('ssd') || lower.includes('hard disk') || lower.includes('drive')) {
      targetCategory = 'harddisk';
      budgetMax = 8000;
    }

    if (lower.includes('2000')) budgetMax = 2000;
    if (lower.includes('3000')) budgetMax = 3000;
    if (lower.includes('40000') || lower.includes('40k')) budgetMax = 40000;
    if (lower.includes('45000') || lower.includes('45k')) budgetMax = 45000;
    if (lower.includes('10000') || lower.includes('10k')) budgetMax = 10000;

    const matchedProducts = getRecommendations(targetCategory, { min: budgetMin, max: budgetMax }, purpose);
    const topPicks = matchedProducts.length > 0 ? matchedProducts.slice(0, 2) : (PRODUCTS[targetCategory] || []).slice(0, 2);

    const aiMsg = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      text: `Based on your preferences (Target: **${targetCategory.toUpperCase()}**, Budget ceiling: **₹${budgetMax.toLocaleString('en-IN')}**), here are the top-rated recommendations with verified live retailer prices:`,
      products: topPicks,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, aiMsg]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col min-h-[calc(100vh-140px)]">
      
      {/* Top AI Status Banner */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E676] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00B140]"></span>
          </div>
          <div>
            <span className="text-xs font-mono tracking-wider text-emerald-400 font-semibold uppercase">
              BRO SHOPPING & RIDE COPILOT
            </span>
            <p className="text-[11px] text-slate-400">Live multi-store price check & cab fare estimation</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-white/5 text-slate-300 border border-white/10">
            Real-Time Verified
          </span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 space-y-6 mb-6">
        {messages.map((m) => (
          <div 
            key={m.id} 
            className={`flex gap-3.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.role === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00B140] to-emerald-700 flex items-center justify-center text-white shadow-lg shadow-emerald-950/50 flex-shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-[85%] rounded-2xl p-4.5 ${
              m.role === 'user' 
                ? 'bg-emerald-600/20 border border-emerald-500/30 text-white shadow-md' 
                : 'ai-glass-card text-slate-200 shadow-xl'
            }`}>
              <div className="prose prose-invert prose-sm text-[14px] leading-relaxed">
                {m.text}
              </div>

              {/* Product Cards Attachment */}
              {m.products && m.products.length > 0 && (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {m.products.map(prod => {
                    const cheapest = getCheapestStore(prod);
                    return (
                      <div key={prod.id} className="bg-black/40 border border-white/10 rounded-xl p-3.5 hover:border-emerald-500/40 transition-all flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1.5">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              {prod.badge}
                            </span>
                            <span className="text-xs font-semibold text-amber-400 flex items-center gap-0.5">
                              ★ {prod.rating}
                            </span>
                          </div>
                          <h4 className="font-bold text-sm text-white line-clamp-1">{prod.name}</h4>
                          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{prod.tagline}</p>

                          <div className="mt-2.5 flex items-baseline justify-between border-t border-white/5 pt-2">
                            <div>
                              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Lowest Price</span>
                              <span className="text-base font-black text-emerald-400">
                                ₹{cheapest.price.toLocaleString('en-IN')}
                              </span>
                            </div>
                            <span className="text-[11px] font-semibold text-slate-300 capitalize bg-white/5 px-2 py-0.5 rounded">
                              on {cheapest.store}
                            </span>
                          </div>
                        </div>

                        <a 
                          href={prod[`${cheapest.store}Url`]}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="mt-3 w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                        >
                          Check Deal <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Ride Matrix Attachment */}
              {m.rideData && (
                <div className="mt-4 bg-black/40 border border-white/10 rounded-xl p-3.5">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
                    <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-emerald-400" />
                      {m.rideData.distance} km Commute Estimate ({m.rideData.city})
                    </span>
                    <button 
                      onClick={onNavigateRides}
                      className="text-[11px] text-emerald-400 font-semibold hover:underline flex items-center gap-1"
                    >
                      Open Full Simulator <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {m.rideData.fares.map((f, i) => (
                      <div 
                        key={f.platformId} 
                        className={`p-2.5 rounded-lg border text-center ${
                          i === 0 
                            ? 'bg-emerald-950/30 border-emerald-500/50' 
                            : 'bg-white/5 border-white/5'
                        }`}
                      >
                        <div className="text-xs font-bold text-slate-200">{f.platform.name}</div>
                        <div className={`text-base font-black my-1 ${i === 0 ? 'text-emerald-400' : 'text-slate-100'}`}>
                          ₹{f.fare}
                        </div>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                          i === 0 ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400'
                        }`}>
                          {i === 0 ? '🏆 Lowest' : `~${f.eta}m ETA`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <span className="text-[10px] text-slate-500 mt-2 block text-right font-mono">
                {m.timestamp}
              </span>
            </div>

            {m.role === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-slate-300 flex-shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {/* Live AI Reasoning Trace */}
        {isThinking && (
          <div className="flex gap-3.5 justify-start">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00B140] to-emerald-700 flex items-center justify-center text-white shadow-lg animate-pulse flex-shrink-0 mt-1">
              <Cpu className="w-4 h-4 animate-spin" />
            </div>

            <div className="ai-glass-card p-4 rounded-2xl max-w-[85%] border-emerald-500/30">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                NEURAL REASONING TRACE
              </div>
              <div className="space-y-1.5 font-mono text-[12px] text-slate-400">
                {thoughtSteps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-emerald-300/80">
                    <span className="text-emerald-500">›</span> {step}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="mb-3 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <span className="text-[11px] font-mono text-slate-500 uppercase flex-shrink-0 flex items-center gap-1">
          <Zap className="w-3 h-3 text-emerald-400" /> Prompts:
        </span>
        {SAMPLE_PROMPTS.map((sp) => (
          <button
            key={sp.label}
            onClick={() => handleSend(sp.query)}
            className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full bg-white/5 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/40 text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
          >
            <span>{sp.icon}</span>
            <span>{sp.label}</span>
          </button>
        ))}
      </div>

      {/* Futuristic Prompt Input Bar */}
      <div className="sticky bottom-2 z-20">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="relative ai-glass rounded-2xl p-1.5 border border-white/15 shadow-2xl focus-within:border-emerald-500/60 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all"
        >
          <div className="flex items-center gap-2 px-3 py-1">
            <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse flex-shrink-0" />
            <input
              id="ai-assistant-prompt-input"
              name="aiAssistantPrompt"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask Bro: Compare products, find adapters, or check ride surge..."
              className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none py-2"
            />
            <button
              type="submit"
              disabled={!query.trim() || isThinking}
              className={`p-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                query.trim() && !isThinking
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/30'
                  : 'bg-white/5 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>Ask</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
        <p className="text-[11px] text-center text-slate-500 mt-2 font-sans">
          Direct retailer checkouts & cab app deeplinks · 0% commission
        </p>
      </div>

    </div>
  );
}
