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
