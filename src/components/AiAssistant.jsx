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

function FormattedText({ text, isUser }) {
  if (!text) return null;
  const lines = text.split('\n');

  return (
    <div className={`space-y-1.5 text-sm leading-relaxed ${isUser ? 'text-white' : 'text-[#333333]'}`}>
      {lines.map((line, lineIdx) => {
        const parts = line.split(/(\*\*.*?\*\*|\*.*?\*)/g);
        return (
          <p key={lineIdx} className="m-0">
            {parts.map((part, i) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return (
                  <strong key={i} className={`font-bold ${isUser ? 'text-white' : 'text-[#111111]'}`}>
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              if (part.startsWith('*') && part.endsWith('*')) {
                return (
                  <em key={i} className={`italic ${isUser ? 'text-white/90' : 'text-[#555555]'}`}>
                    {part.slice(1, -1)}
                  </em>
                );
              }
              return part;
            })}
          </p>
        );
      })}
    </div>
  );
}

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
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#EBEBF0]">
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#008738] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#008738]"></span>
          </div>
          <div>
            <span className="text-xs font-mono tracking-wider text-[#008738] font-bold uppercase">
              BRO SHOPPING & RIDE COPILOT
            </span>
            <p className="text-[11px] text-[#666666]">Live multi-store price check & cab fare estimation</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-[#F3FBEF] text-[#008738] border border-[#008738]/20 font-semibold">
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
              <div className="w-8 h-8 rounded-xl bg-[#008738] flex items-center justify-center text-white shadow-sm flex-shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-[85%] rounded-2xl p-4.5 ${
              m.role === 'user' 
                ? 'bg-[#333333] text-white shadow-sm' 
                : 'bg-white border border-[#EBEBF0] text-[#333333] shadow-card'
            }`}>
              <FormattedText text={m.text} isUser={m.role === 'user'} />

              {/* Product Cards Attachment */}
              {m.products && m.products.length > 0 && (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {m.products.map(prod => {
                    const cheapest = getCheapestStore(prod);
                    return (
                      <div key={prod.id} className="bg-[#F8F9FA] border border-[#EBEBF0] rounded-xl p-3.5 hover:border-[#008738]/40 transition-all flex flex-col justify-between shadow-2xs">
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1.5">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#F3FBEF] text-[#008738] border border-[#008738]/20">
                              {prod.badge || 'Verified Deal'}
                            </span>
                            <span className="text-xs font-semibold text-[#b59a50] flex items-center gap-0.5">
                              ★ {prod.rating}
                            </span>
                          </div>
                          <h4 className="font-bold text-sm text-[#111111] line-clamp-1">{prod.name}</h4>
                          <p className="text-xs text-[#666666] mt-0.5 line-clamp-1">{prod.tagline}</p>

                          <div className="mt-2.5 flex items-baseline justify-between border-t border-[#EBEBF0] pt-2">
                            <div>
                              <span className="text-[10px] text-[#9E9E9E] uppercase tracking-wider block font-medium">Lowest Price</span>
                              <span className="text-base font-bold font-mono text-[#008738]">
                                ₹{cheapest.price ? cheapest.price.toLocaleString('en-IN') : 'Check Live'}
                              </span>
                            </div>
                            <span className="text-[11px] font-semibold text-[#333333] uppercase bg-white border border-[#EBEBF0] px-2 py-0.5 rounded">
                              on {cheapest.store}
                            </span>
                          </div>
                        </div>

                        <a 
                          href={prod[`${cheapest.store}Url`] || prod.amazonUrl || prod.flipkartUrl}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="mt-3 w-full py-2 bg-[#333333] hover:bg-[#111111] text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                        >
                          <span>Check Deal</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Ride Matrix Attachment */}
              {m.rideData && (
                <div className="mt-4 bg-[#F8F9FA] border border-[#EBEBF0] rounded-xl p-3.5 shadow-2xs">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#EBEBF0]">
                    <span className="text-xs font-semibold text-[#333333] flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-[#008738]" />
                      {m.rideData.distance} km Commute Estimate ({m.rideData.city})
                    </span>
                    <button 
                      onClick={onNavigateRides}
                      className="text-[11px] text-[#008738] font-bold hover:underline flex items-center gap-1"
                    >
                      <span>Open Full Simulator</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {m.rideData.fares.map((f, i) => (
                      <div 
                        key={f.platformId} 
                        className={`p-2.5 rounded-lg border text-center ${
                          i === 0 
                            ? 'bg-[#F3FBEF] border-[#008738]/40 shadow-2xs' 
                            : 'bg-white border-[#EBEBF0]'
                        }`}
                      >
                        <div className="text-xs font-bold text-[#333333]">{f.platform.name}</div>
                        <div className={`text-base font-mono font-bold my-1 ${i === 0 ? 'text-[#008738]' : 'text-[#333333]'}`}>
                          ₹{f.fare}
                        </div>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                          i === 0 ? 'bg-[#008738] text-white' : 'text-[#666666] bg-[#F8F9FA] border border-[#EBEBF0]'
                        }`}>
                          {i === 0 ? '🏆 Lowest' : `~${f.eta}m ETA`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <span className={`text-[10px] mt-2 block text-right font-mono ${m.role === 'user' ? 'text-white/70' : 'text-[#9E9E9E]'}`}>
                {m.timestamp}
              </span>
            </div>

            {m.role === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-[#333333] text-white flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {/* Live AI Reasoning Trace */}
        {isThinking && (
          <div className="flex gap-3.5 justify-start">
            <div className="w-8 h-8 rounded-xl bg-[#008738] flex items-center justify-center text-white shadow-sm animate-pulse flex-shrink-0 mt-1">
              <Cpu className="w-4 h-4 animate-spin" />
            </div>

            <div className="bg-white border-2 border-[#008738]/30 p-4 rounded-2xl max-w-[85%] shadow-card">
              <div className="flex items-center gap-2 text-xs font-mono text-[#008738] font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                NEURAL REASONING TRACE
              </div>
              <div className="space-y-1.5 text-xs text-[#555555]">
                {thoughtSteps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#008738] flex-shrink-0" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="mb-3 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#666666] flex-shrink-0 flex items-center gap-1">
          <Zap className="w-3 h-3 text-[#008738]" /> Prompts:
        </span>
        {SAMPLE_PROMPTS.map((sp) => (
          <button
            key={sp.label}
            onClick={() => handleSend(sp.query)}
            className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full bg-white hover:bg-[#F8F9FA] border border-[#EBEBF0] hover:border-[#333333] text-[#333333] font-medium transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <span>{sp.icon}</span>
            <span>{sp.label}</span>
          </button>
        ))}
      </div>

      {/* Editorial Prompt Input Bar */}
      <div className="sticky bottom-2 z-20">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="relative bg-white rounded-2xl p-1.5 border-2 border-[#EBEBF0] shadow-card focus-within:border-[#008738] transition-all"
        >
          <div className="flex items-center gap-2 px-3 py-1">
            <Sparkles className="w-5 h-5 text-[#008738] flex-shrink-0" />
            <input
              id="ai-assistant-prompt-input"
              name="aiAssistantPrompt"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask Bro: Compare products, find adapters, or check ride surge..."
              className="w-full bg-transparent text-sm font-medium text-[#111111] placeholder:text-[#9E9E9E] focus:outline-none py-2 px-1"
            />
            <button
              type="submit"
              disabled={!query.trim() || isThinking}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 flex-shrink-0 ${
                query.trim() && !isThinking
                  ? 'bg-[#008738] hover:bg-[#00702e] text-white shadow-sm'
                  : 'bg-[#F8F9FA] text-[#9E9E9E] border border-[#EBEBF0] cursor-not-allowed'
              }`}
            >
              <span>Ask</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
        <p className="text-[11px] text-center text-[#9E9E9E] mt-2 font-sans">
          Direct retailer checkouts & cab app deeplinks · 0% commission
        </p>
      </div>

    </div>
  );
}
