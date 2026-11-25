/**
 * Bank Offer & Dynamic EMI Calculation Matrix Engine
 * Matches Technical Specification Section 5:
 * - Unmanipulated base price aggregation
 * - Instant Credit/Debit Card Full-Swipe discounts
 * - No-Cost EMI principal / tenure breakdown with GST & Processing fee
 * - Standard EMI reducing-balance interest calculation (13%-16% APR)
 * - User Card Wallet Filter (stored locally in IndexedDB / localStorage)
 */

export const POPULAR_BANKS = [
  { id: 'hdfc', name: 'HDFC Bank', cards: ['HDFC Regalia Credit Card', 'HDFC Millennia Credit Card', 'HDFC Infinia Metal'] },
  { id: 'icici', name: 'ICICI Bank', cards: ['Amazon Pay ICICI Card', 'ICICI Coral / Sapphiro Credit Card'] },
  { id: 'sbi', name: 'SBI Card', cards: ['SBI SimplyCLICK Credit Card', 'Cashback SBI Card'] },
  { id: 'axis', name: 'Axis Bank', cards: ['Flipkart Axis Bank Card', 'Axis Ace / Magnus Card'] },
  { id: 'kotak', name: 'Kotak Mahindra', cards: ['Kotak White / League Platinum Card'] },
  { id: 'amex', name: 'American Express', cards: ['Amex Membership Rewards (MRCC)', 'Amex Platinum Travel'] },
  { id: 'onecard', name: 'OneCard', cards: ['OneCard Metal Credit Card'] }
];

export const DEFAULT_USER_CARDS = ['hdfc', 'icici', 'sbi', 'axis'];

const BANK_RULES = [
  {
    bankId: 'hdfc',
    bankName: 'HDFC Bank',
    cardName: 'HDFC Bank Credit Card',
    cardNetwork: 'Visa / RuPay',
    merchant: 'all',
    type: 'CREDIT_CARD',
    fullSwipe: { type: 'FLAT', value: 4000, minCart: 35000, maxCap: 5000 },
    noCostTenures: [3, 6, 9],
    standardApr: 14.5,
    procFee: 199
  },
  {
    bankId: 'icici',
    bankName: 'ICICI Bank',
    cardName: 'Amazon Pay / ICICI Credit Card',
    cardNetwork: 'Visa',
    merchant: 'amazon',
    type: 'CREDIT_CARD',
    fullSwipe: { type: 'PERCENT', value: 5, minCart: 2000, maxCap: 10000 },
    noCostTenures: [3, 6, 12],
    standardApr: 13.5,
    procFee: 199
  },
  {
    bankId: 'icici',
    bankName: 'ICICI Bank',
    cardName: 'ICICI Bank Credit Card',
    cardNetwork: 'Visa / MC',
    merchant: 'all',
    type: 'CREDIT_CARD',
    fullSwipe: { type: 'FLAT', value: 3500, minCart: 30000, maxCap: 4000 },
    noCostTenures: [3, 6, 9],
    standardApr: 14.0,
    procFee: 199
  },
  {
    bankId: 'axis',
    bankName: 'Axis Bank',
    cardName: 'Flipkart Axis Bank Card',
    cardNetwork: 'Mastercard',
    merchant: 'flipkart',
    type: 'CREDIT_CARD',
    fullSwipe: { type: 'PERCENT', value: 5, minCart: 2000, maxCap: 10000 },
    noCostTenures: [3, 6, 12],
    standardApr: 14.0,
    procFee: 199
  },
  {
    bankId: 'axis',
    bankName: 'Axis Bank',
    cardName: 'Axis Bank Credit Card',
    cardNetwork: 'Visa / MC',
    merchant: 'all',
    type: 'CREDIT_CARD',
    fullSwipe: { type: 'FLAT', value: 3000, minCart: 25000, maxCap: 4000 },
    noCostTenures: [3, 6],
    standardApr: 14.0,
    procFee: 199
  },
  {
    bankId: 'sbi',
    bankName: 'SBI Card',
    cardName: 'SBI Credit Card',
    cardNetwork: 'Visa / RuPay',
    merchant: 'all',
    type: 'CREDIT_CARD',
    fullSwipe: { type: 'FLAT', value: 3000, minCart: 25000, maxCap: 4500 },
    noCostTenures: [3, 6, 9],
    standardApr: 14.5,
    procFee: 199
  },
  {
    bankId: 'kotak',
    bankName: 'Kotak Bank',
    cardName: 'Kotak Mahindra Credit Card',
    cardNetwork: 'Visa',
    merchant: 'all',
    type: 'CREDIT_CARD',
    fullSwipe: { type: 'FLAT', value: 2500, minCart: 20000, maxCap: 3000 },
    noCostTenures: [3, 6],
    standardApr: 15.0,
    procFee: 199
  },
  {
    bankId: 'amex',
    bankName: 'American Express',
    cardName: 'Amex Membership Card',
    cardNetwork: 'Amex',
    merchant: 'croma',
    type: 'CREDIT_CARD',
    fullSwipe: { type: 'FLAT', value: 5000, minCart: 50000, maxCap: 6000 },
    noCostTenures: [6, 12],
    standardApr: 15.5,
    procFee: 299
  },
  {
    bankId: 'onecard',
    bankName: 'OneCard',
    cardName: 'OneCard Metal Card',
    cardNetwork: 'Visa',
    merchant: 'all',
    type: 'CREDIT_CARD',
    fullSwipe: { type: 'FLAT', value: 2000, minCart: 15000, maxCap: 2500 },
    noCostTenures: [3, 6],
    standardApr: 13.9,
    procFee: 99
  }
];

/**
 * Calculates reducing-balance monthly EMI
 * Formula: E = P * r * (1 + r)^n / ((1 + r)^n - 1)
 */
function calculateMonthlyEmi(principal, annualRate, tenureMonths) {
  if (tenureMonths <= 0 || principal <= 0) return 0;
  const monthlyRate = annualRate / (12 * 100);
  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  return Math.round((principal * monthlyRate * factor) / (factor - 1));
}

/**
 * Computes all available bank offers, net effective swipe prices, and EMI matrices
 * for a given product base price and merchant list.
 */
export function calculateBankOfferMatrix({
  basePrice,
  merchants = ['amazon', 'flipkart', 'croma', 'reliance', 'apple_store'],
  activeUserCards = DEFAULT_USER_CARDS,
  paymentModeFilter = 'ALL', // 'ALL' | 'FULL_SWIPE' | 'NO_COST_EMI' | 'STANDARD_EMI'
  tenureFilter = null // 3 | 6 | 9 | 12 | 24
}) {
  if (!basePrice || basePrice <= 0) return [];

  const matrix = [];

  merchants.forEach((merchant) => {
    BANK_RULES.forEach((rule, ruleIdx) => {
      // Check user wallet card filter
      const isCardInWallet = activeUserCards.includes(rule.bankId);

      // Check merchant applicability
      if (rule.merchant !== 'all' && rule.merchant !== merchant) return;

      // 1. FULL SWIPE OFFER
      if (rule.fullSwipe && (paymentModeFilter === 'ALL' || paymentModeFilter === 'FULL_SWIPE')) {
        let discount = 0;
        if (basePrice >= rule.fullSwipe.minCart) {
          if (rule.fullSwipe.type === 'FLAT') {
            discount = Math.min(rule.fullSwipe.value, rule.fullSwipe.maxCap);
          } else {
            discount = Math.min(Math.round(basePrice * (rule.fullSwipe.value / 100)), rule.fullSwipe.maxCap);
          }
        }

        if (discount > 0) {
          const netLanded = basePrice - discount;
          matrix.push({
            id: `${merchant}-${rule.bankId}-${ruleIdx}-fullswipe`,
            merchant,
            bankId: rule.bankId,
            bankName: rule.bankName,
            cardName: rule.cardName,
            cardNetwork: rule.cardNetwork || 'Visa / MC',
            isUserCard: isCardInWallet,
            mode: 'FULL_SWIPE',
            transactionMode: 'FULL_SWIPE',
            modeLabel: 'Full Swipe Instant Discount',
            tenure: 1,
            tenureMonths: 1,
            basePrice,
            instantDiscount: discount,
            discountAmount: discount,
            monthlyEmi: 0,
            totalInterest: 0,
            hiddenFees: 0, // No hidden fees on full swipe
            netLandedPrice: netLanded,
            badge: `Save ₹${discount.toLocaleString('en-IN')}`,
            highlight: false
          });
        }
      }

      // 2. NO-COST EMI OFFERS
      if (rule.noCostTenures && (paymentModeFilter === 'ALL' || paymentModeFilter === 'NO_COST_EMI')) {
        rule.noCostTenures.forEach((tenure) => {
          if (tenureFilter && tenureFilter !== tenure) return;

          // In No-Cost EMI in India, the bank gives an upfront discount equal to the interest component,
          // but charges processing fee (usually ₹199) + 18% GST on processing fee.
          const discount = Math.round(basePrice * 0.04); // upfront interest subsidy discount
          const financedPrincipal = basePrice - discount;
          const monthlyEmi = Math.round(financedPrincipal / tenure);
          const gstOnProc = Math.round(rule.procFee * 0.18);
          const hiddenFees = rule.procFee + gstOnProc;
          const netLanded = (monthlyEmi * tenure) + hiddenFees;

          matrix.push({
            id: `${merchant}-${rule.bankId}-${ruleIdx}-nocost-${tenure}`,
            merchant,
            bankId: rule.bankId,
            bankName: rule.bankName,
            cardName: rule.cardName,
            cardNetwork: rule.cardNetwork || 'Visa / MC',
            isUserCard: isCardInWallet,
            mode: 'NO_COST_EMI',
            transactionMode: 'NO_COST_EMI',
            modeLabel: `No-Cost EMI (${tenure} Months)`,
            tenure: tenure,
            tenureMonths: tenure,
            basePrice,
            instantDiscount: discount,
            discountAmount: discount,
            monthlyEmi,
            totalInterest: 0, // subsidized by merchant/brand
            hiddenFees,
            netLandedPrice: netLanded,
            badge: `₹${monthlyEmi.toLocaleString('en-IN')}/mo (0% Interest)`,
            highlight: false
          });
        });
      }

      // 3. STANDARD EMI OFFERS (13% - 15% APR)
      if (paymentModeFilter === 'ALL' || paymentModeFilter === 'STANDARD_EMI') {
        const stdTenures = [6, 12, 18, 24];
        stdTenures.forEach((tenure) => {
          if (tenureFilter && tenureFilter !== tenure) return;

          const monthlyEmi = calculateMonthlyEmi(basePrice, rule.standardApr, tenure);
          const totalPaid = monthlyEmi * tenure;
          const totalInterest = totalPaid - basePrice;
          const gstOnProc = Math.round(rule.procFee * 0.18);
          const hiddenFees = rule.procFee + gstOnProc;
          const netLanded = totalPaid + hiddenFees;

          matrix.push({
            id: `${merchant}-${rule.bankId}-${ruleIdx}-standard-${tenure}`,
            merchant,
            bankId: rule.bankId,
            bankName: rule.bankName,
            cardName: rule.cardName,
            cardNetwork: rule.cardNetwork || 'Visa / MC',
            isUserCard: isCardInWallet,
            mode: 'STANDARD_EMI',
            transactionMode: 'STANDARD_EMI',
            modeLabel: `Standard EMI (${tenure}M @ ${rule.standardApr}%)`,
            tenure: tenure,
            tenureMonths: tenure,
            basePrice,
            instantDiscount: 0,
            discountAmount: 0,
            monthlyEmi,
            totalInterest,
            hiddenFees,
            netLandedPrice: netLanded,
            badge: `₹${monthlyEmi.toLocaleString('en-IN')}/mo`,
            highlight: false
          });
        });
      }
    });
  });

  // Sort by lowest Net Landed Price first
  const sorted = matrix.sort((a, b) => a.netLandedPrice - b.netLandedPrice);

  // Mark the #1 lowest deal
  if (sorted.length > 0) {
    sorted[0].highlight = true;
  }

  return sorted;
}
