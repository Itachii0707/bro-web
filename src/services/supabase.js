import { createClient } from '@supabase/supabase-js';
import { getRecommendations } from '../data/electronics';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Fetch products from Supabase with relational store prices, falling back to static catalog if offline.
 */
export async function fetchProducts({ categoryId, budgetRange, purpose } = {}) {
  if (!supabase) {
    return {
      products: getRecommendations(categoryId, budgetRange, purpose),
      source: 'local'
    };
  }

  try {
    let query = supabase
      .from('products')
      .select(`
        id, name, category, tagline, rating, badge, specs, purposes, budget_min, budget_max,
        product_prices (store, price, url, is_available, last_checked)
      `);

    if (categoryId) {
      query = query.eq('category', categoryId);
    }
    if (budgetRange) {
      if (budgetRange.max !== undefined && budgetRange.max !== Infinity) {
        query = query.lte('budget_min', budgetRange.max);
      }
      if (budgetRange.min !== undefined) {
        query = query.gte('budget_max', budgetRange.min);
      }
    }
    if (purpose) {
      query = query.contains('purposes', [purpose]);
    }

    const { data, error } = await query;
    if (error) throw error;

    if (!data || data.length === 0) {
      // If no exact match or empty table, use local recommendations
      const fallback = getRecommendations(categoryId, budgetRange, purpose);
      return { products: fallback, source: 'local' };
    }

    const formatted = data.map(p => {
      const prices = {};
      let amazonUrl = `https://www.amazon.in/s?k=${encodeURIComponent(p.name)}`;
      let flipkartUrl = `https://www.flipkart.com/search?q=${encodeURIComponent(p.name)}`;
      let cromaUrl = `https://www.croma.com/searchB?q=${encodeURIComponent(p.name)}`;

      (p.product_prices || []).forEach(pr => {
        prices[pr.store] = pr.price;
        if (pr.store === 'amazon' && pr.url) amazonUrl = pr.url;
        if (pr.store === 'flipkart' && pr.url) flipkartUrl = pr.url;
        if (pr.store === 'croma' && pr.url) cromaUrl = pr.url;
      });

      let parsedSpecs = [];
      if (Array.isArray(p.specs)) {
        parsedSpecs = p.specs;
      } else if (typeof p.specs === 'string') {
        try { parsedSpecs = JSON.parse(p.specs); } catch { parsedSpecs = []; }
      }

      return {
        id: p.id,
        name: p.name,
        category: p.category,
        tagline: p.tagline,
        rating: Number(p.rating),
        badge: p.badge,
        specs: parsedSpecs,
        purposes: p.purposes || [],
        budgetMin: p.budget_min,
        budgetMax: p.budget_max,
        price: prices,
        amazonUrl,
        flipkartUrl,
        cromaUrl,
      };
    });

    return { products: formatted, source: 'supabase' };
  } catch (err) {
    console.warn('Supabase fetch failed, falling back to local dataset:', err);
    return {
      products: getRecommendations(categoryId, budgetRange, purpose),
      source: 'local'
    };
  }
}

/**
 * Fetch 30-day and long-term price history for a given product
 */
export async function fetchPriceHistory(productId) {
  if (!supabase) return [];

  try {
    const { data: rawHistory, error: rawError } = await supabase
      .from('price_history')
      .select('*')
      .eq('product_id', productId)
      .order('recorded_at', { ascending: true });

    if (rawError) throw rawError;

    // Seamlessly merge with compacted daily historical summaries if present
    try {
      const { data: dailyHistory } = await supabase
        .from('price_history_daily')
        .select('*')
        .eq('product_id', productId)
        .order('day_date', { ascending: true });

      if (dailyHistory && dailyHistory.length > 0) {
        const formattedDaily = dailyHistory.map(d => ({
          product_id: d.product_id,
          store: d.store,
          price: Number(d.price_close || d.price_avg),
          recorded_at: d.day_date
        }));
        return [...formattedDaily, ...(rawHistory || [])];
      }
    } catch {}

    return rawHistory || [];
  } catch (err) {
    console.warn('Error fetching price history:', err);
    return [];
  }
}

/**
 * Create a price drop alert in Supabase
 */
export async function createPriceAlert({ productId, targetPrice, channel = 'whatsapp', contactInfo = '' }) {
  if (!supabase) {
    return { success: true, offline: true };
  }

  try {
    const { data, error } = await supabase
      .from('price_alerts')
      .insert([{
        product_id: productId,
        target_price: targetPrice,
        channel,
        contact_info: contactInfo || 'anonymous_user',
        is_active: true
      }]);

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('Error creating price alert in Supabase:', err);
    return { success: false, error };
  }
}

/**
 * Log a ride search and comparison into Supabase
 */
export async function logRideSearch({ city, origin, destination, distanceKm, durationMinutes, selectedCarrier, fare }) {
  if (!supabase) return { success: false };

  try {
    const { data, error } = await supabase
      .from('ride_searches')
      .insert([{
        city,
        origin,
        destination,
        distance_km: distanceKm,
        duration_minutes: durationMinutes,
        selected_carrier: selectedCarrier,
        fare
      }]);

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.warn('Error logging ride search to Supabase:', err);
    return { success: false, error };
  }
}
