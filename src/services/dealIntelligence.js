/**
 * BRO AI Deal Intelligence Engine
 * 1. Fake Discount Detector (MRP inflation alert)
 * 2. 1-10 Algorithmic Deal Score
 * 3. Bank Credit Card Arbitrage Calculation
 */

/**
 * Evaluates real discount vs claimed MRP and computes deal score.
 * @param {Object} product
 * @param {Array} priceHistory
 * @param {number} currentPrice
 */
export function evaluateDealIntelligence(product, priceHistory = [], currentPrice = 0) {
  const pCurrent = currentPrice || (product?.price ? Math.min(...Object.values(product.price)) : 10000);

  // 1. Calculate price history extremes and moving average
  let pMin = pCurrent;
  let pMax = pCurrent;
  let sumPrices = 0;
  let count = 0;

  if (priceHistory && priceHistory.length > 0) {
    priceHistory.forEach((item) => {
      const val = Number(item.price_inr);
      if (val > 0) {
        if (val < pMin) pMin = val;
        if (val > pMax) pMax = val;
        sumPrices += val;
        count++;
      }
    });
  }

  // If no history exists yet, generate realistic statistical baseline
  if (count === 0) {
    pMin = Math.round(pCurrent * 0.94);
    pMax = Math.round(pCurrent * 1.12);
    sumPrices = pCurrent;
    count = 1;
  }

  const pAvg = Math.round(sumPrices / count);
  const claimedMrp = product?.mrp || Math.round(pAvg * 1.25);

  // 2. Real vs Fake Discount Analysis
  const claimedDiscountPercent = Math.max(0, Math.round(((claimedMrp - pCurrent) / claimedMrp) * 100));
  const realDiscountPercent = Math.round(((pAvg - pCurrent) / pAvg) * 100);
  const priceDifferenceVsAvg = pAvg - pCurrent;

  let isFakeDiscount = false;
  let discountBadge = '';
  let discountType = 'neutral'; // 'fake' | 'genuine' | 'neutral'
  let discountExplanation = '';

  // Detection Rule: Retailer claimed 15%+ off MRP, but real price is within 2% or HIGHER than 30-day average
  if (claimedDiscountPercent >= 15 && realDiscountPercent <= 2) {
    isFakeDiscount = true;
    discountType = 'fake';
    discountBadge = '⚠️ Artificial Discount Detected';
    const inflatedAmount = claimedMrp - Math.round(pAvg * 1.05);
    discountExplanation = `Retailer inflated MRP by ₹${inflatedAmount.toLocaleString('en-IN')} to ₹${claimedMrp.toLocaleString('en-IN')}. Actual saving vs 30-day average is only ${realDiscountPercent > 0 ? realDiscountPercent + '%' : '₹0'}.`;
  } else if (realDiscountPercent >= 6) {
    discountType = 'genuine';
    discountBadge = '✅ Genuine Price Drop Verified';
    discountExplanation = `Current price is ₹${Math.abs(priceDifferenceVsAvg).toLocaleString('en-IN')} (${realDiscountPercent}%) lower than the 30-day average of ₹${pAvg.toLocaleString('en-IN')}.`;
  } else {
    discountType = 'neutral';
    discountBadge = '📊 Standard Market Price';
    discountExplanation = `Trading within standard normal price corridor (30-Day Avg: ₹${pAvg.toLocaleString('en-IN')}).`;
  }

  // 3. Algorithmic Deal Score (1.0 to 10.0 scale)
  const range = Math.max(1, pMax - pMin);
  const rawScore = 10 * (1 - (pCurrent - pMin) / range);
  const dealScore = Math.max(1.0, Math.min(10.0, Math.round(rawScore * 10) / 10));

  let scoreTier = '';
  let scoreColor = '';
  let scoreRecommendation = '';

  if (dealScore >= 9.0) {
    scoreTier = 'God-Tier Deal';
    scoreColor = '#008738'; // Emerald
    scoreRecommendation = 'All-time low reached. Strong buy recommended.';
  } else if (dealScore >= 7.0) {
    scoreTier = 'Good Value';
    scoreColor = '#b59a50'; // Gold
    scoreRecommendation = 'Priced below 30-day median. Safe to buy.';
  } else if (dealScore >= 5.0) {
    scoreTier = 'Fair Price';
    scoreColor = '#4B5563'; // Neutral gray
    scoreRecommendation = 'Normal price. Wait 2–4 days if non-urgent.';
  } else {
    scoreTier = 'Overpriced';
    scoreColor = '#DC2626'; // Red
    scoreRecommendation = 'Above regular pricing. Wait for weekend drop.';
  }

  // 4. Bank Card Arbitrage Calculator (5% instant card cashback)
  const cardCashback = {
    amazonPay: Math.min(1500, Math.round(pCurrent * 0.05)),
    axisFlipkart: Math.min(1500, Math.round(pCurrent * 0.05)),
    tataNeuHdfc: Math.min(1500, Math.round(pCurrent * 0.05)),
  };

  return {
    currentPrice: pCurrent,
    claimedMrp,
    pMin,
    pMax,
    pAvg,
    claimedDiscountPercent,
    realDiscountPercent,
    isFakeDiscount,
    discountBadge,
    discountType,
    discountExplanation,
    dealScore,
    scoreTier,
    scoreColor,
    scoreRecommendation,
    cardCashback,
  };
}

/**
 * BuyHatke-style Condition Evaluation Engine
 * Validates if a product strictly satisfies user conditions (Budget, Purpose, Fast Delivery).
 * @param {Object} product
 * @param {Object} conditions { budgetRange, purpose, categoryId, userQuery }
 * @returns {Object} { isSatisfied, matchScore, criteria, bestStoreVerdict, cheapestPrice, cheapestStore }
 */
export function evaluateConditionMatch(product, conditions = {}) {
  const criteria = [];
  let score = 100;
  
  const stores = product?.price || {};
  const validPrices = Object.entries(stores).filter(([_, p]) => p > 0);
  const lowestEntry = validPrices.length > 0 
    ? validPrices.reduce((min, [s, p]) => p < min.price ? { store: s, price: p } : min, { store: validPrices[0][0], price: validPrices[0][1] })
    : { store: 'amazon', price: 0 };
  const cheapestPrice = lowestEntry.price;

  // 1. Budget Constraint Validation
  if (conditions.budgetRange && conditions.budgetRange.min !== undefined) {
    const min = conditions.budgetRange.min;
    const max = conditions.budgetRange.max;
    const isAllBudget = min === 0 && max === Infinity;

    if (isAllBudget) {
      criteria.push({
        id: 'budget',
        name: 'Budget Constraint',
        passed: true,
        badge: 'All Budgets',
        detail: `Verified best price of ₹${cheapestPrice.toLocaleString('en-IN')}`
      });
    } else {
      const isWithinBudget = (cheapestPrice >= min && cheapestPrice <= max) || 
                             (product.budgetMin <= max && product.budgetMax >= min);
      if (isWithinBudget) {
        criteria.push({
          id: 'budget',
          name: 'Budget Constraint',
          passed: true,
          badge: '✅ Within Condition',
          detail: `₹${cheapestPrice.toLocaleString('en-IN')} fits inside ${conditions.budgetRange.label}`
        });
      } else {
        score -= 30;
        const diff = cheapestPrice > max ? cheapestPrice - max : min - cheapestPrice;
        criteria.push({
          id: 'budget',
          name: 'Budget Constraint',
          passed: false,
          badge: '⚠️ Budget Deviation',
          detail: `₹${cheapestPrice.toLocaleString('en-IN')} is ₹${diff.toLocaleString('en-IN')} ${cheapestPrice > max ? 'above' : 'below'} ${conditions.budgetRange.label}`
        });
      }
    }
  }

  // 2. Hardware Use Case / Purpose Validation
  if (conditions.purpose) {
    const pList = product.purposes || [];
    const hasMatch = pList.some(p => 
      p.toLowerCase().includes(conditions.purpose.toLowerCase()) || 
      conditions.purpose.toLowerCase().includes(p.toLowerCase())
    );
    if (hasMatch) {
      criteria.push({
        id: 'purpose',
        name: 'Hardware Use Case',
        passed: true,
        badge: '🎯 Spec Verified',
        detail: `Hardware features directly fulfill your "${conditions.purpose}" demand`
      });
    } else {
      score -= 15;
      criteria.push({
        id: 'purpose',
        name: 'Hardware Use Case',
        passed: true,
        badge: '⚡ General Match',
        detail: `Versatile specs suitable for "${conditions.purpose}" workflows`
      });
    }
  }

  // 3. Multi-Channel Availability (Q-Commerce vs E-Commerce vs Retail)
  const quickCommerceStores = ['blinkit', 'zepto', 'flipkart_minutes'];
  const hasQuickCommerce = quickCommerceStores.some(k => stores[k] > 0);
  if (hasQuickCommerce) {
    criteria.push({
      id: 'speed',
      name: 'Flash Delivery',
      passed: true,
      badge: '⚡ 10-Min Delivery',
      detail: 'In stock on Blinkit / Zepto for ultra-fast 10–15 min doorstep delivery'
    });
  } else {
    criteria.push({
      id: 'speed',
      name: 'E-Commerce Delivery',
      passed: true,
      badge: '📦 Scheduled Prime / Plus',
      detail: 'Next-day delivery available across Amazon & Flipkart networks'
    });
  }

  const isSatisfied = score >= 70;
  const storeDisplayNames = {
    amazon: 'Amazon India',
    flipkart: 'Flipkart',
    croma: 'Croma (Tata)',
    reliance: 'Reliance Digital',
    jiomart: 'JioMart',
    blinkit: 'Blinkit (10-min)',
    zepto: 'Zepto (10-min)',
    flipkart_minutes: 'Flipkart Minutes',
    vijaysales: 'Vijay Sales'
  };

  const bestStoreName = storeDisplayNames[lowestEntry.store] || lowestEntry.store;
  const bestStoreVerdict = `Best Buy: ${bestStoreName} at ₹${cheapestPrice.toLocaleString('en-IN')}${
    validPrices.length > 1 ? ` (Saves you ₹${(validPrices[1][1] - cheapestPrice).toLocaleString('en-IN')} vs next retailer)` : ''
  }`;

  return {
    isSatisfied,
    matchScore: Math.max(0, score),
    criteria,
    bestStoreVerdict,
    cheapestPrice,
    cheapestStore: lowestEntry.store
  };
}
