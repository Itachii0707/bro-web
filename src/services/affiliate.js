/**
 * BRO AI Affiliate Monetization & Outbound Link Cloaking Engine
 * Generates monetized outbound affiliate links for Amazon, Flipkart, and Croma.
 * Zero-cost, 100% compliant with Indian affiliate programs.
 */

const AFFILIATE_CONFIG = {
  amazon: {
    tag: 'broai-21',
    searchBase: 'https://www.amazon.in/s',
    directParam: 'tag',
  },
  flipkart: {
    affid: 'broai',
    searchBase: 'https://www.flipkart.com/search',
    directParam: 'affid',
  },
  croma: {
    campaign: 'utm_source=broai&utm_medium=affiliate&utm_campaign=price_comparison',
    searchBase: 'https://www.croma.com/searchB',
  }
};

const TRUSTED_STORE_DOMAINS = [
  'amazon.in',
  'flipkart.com',
  'croma.com',
  'google.com'
];

function isSafeStoreUrl(urlString) {
  try {
    const parsed = new URL(urlString);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return false;
    return TRUSTED_STORE_DOMAINS.some(domain => 
      parsed.hostname === domain || parsed.hostname.endsWith('.' + domain)
    );
  } catch {
    return false;
  }
}

/**
 * Returns a monetized affiliate URL for the given retailer and product.
 * @param {'amazon' | 'flipkart' | 'croma'} storeKey
 * @param {string} productName
 * @param {string} [rawUrl] optional raw URL from database
 * @returns {string} Fully formatted affiliate URL
 */
export function getAffiliateUrl(storeKey, productName, rawUrl = '') {
  const cleanName = (productName || '').trim();
  const config = AFFILIATE_CONFIG[storeKey];

  if (!config) {
    return (rawUrl && isSafeStoreUrl(rawUrl)) ? rawUrl : `https://www.google.com/search?q=${encodeURIComponent(cleanName)}`;
  }

  // If a direct product page URL is already known and passes domain whitelist
  if (rawUrl && isSafeStoreUrl(rawUrl)) {
    try {
      const url = new URL(rawUrl);
      if (storeKey === 'amazon') {
        url.searchParams.set('tag', config.tag);
      } else if (storeKey === 'flipkart') {
        url.searchParams.set('affid', config.affid);
      } else if (storeKey === 'croma') {
        url.searchParams.set('utm_source', 'broai');
        url.searchParams.set('utm_medium', 'affiliate');
      }
      return url.toString();
    } catch {
      // fallback to search if invalid URL
    }
  }

  // Direct keyword deep search with affiliate tag attached
  if (storeKey === 'amazon') {
    return `${config.searchBase}?k=${encodeURIComponent(cleanName)}&tag=${config.tag}`;
  }

  if (storeKey === 'flipkart') {
    return `${config.searchBase}?q=${encodeURIComponent(cleanName)}&affid=${config.affid}`;
  }

  if (storeKey === 'croma') {
    return `${config.searchBase}?q=${encodeURIComponent(cleanName)}&${config.campaign}`;
  }

  return `https://www.google.com/search?q=${encodeURIComponent(cleanName)}`;
}

/**
 * Client-side audit tracking for affiliate outbound clicks
 */
export function recordAffiliateClick(storeKey, productId, productName) {
  try {
    const clickData = {
      store: storeKey,
      productId,
      productName,
      timestamp: new Date().toISOString()
    };
    // Keep last 20 clicks in localStorage for user convenience & zero-cost telemetry
    const history = JSON.parse(localStorage.getItem('bro_affiliate_clicks') || '[]');
    history.unshift(clickData);
    localStorage.setItem('bro_affiliate_clicks', JSON.stringify(history.slice(0, 20)));
    console.info(`[BRO AI Monetization] Outbound redirect to ${storeKey} for: ${productName}`);
  } catch {
    // silently ignore storage errors
  }
}
