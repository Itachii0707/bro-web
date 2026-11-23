/**
 * BRO AI Autonomous Price Watchdog Engine
 * Evaluates active price alerts against current retail store prices.
 * Dispatches notifications via Telegram, Discord, or Email webhooks.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Load Environment Variables
function loadEnv() {
  let url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  let key = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  let discordWebhook = process.env.DISCORD_WEBHOOK_URL;
  let telegramToken = process.env.TELEGRAM_BOT_TOKEN;
  let telegramChatId = process.env.TELEGRAM_CHAT_ID;

  if (!url || !key) {
    const envPath = path.join(__dirname, '../.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
          const k = match[1].trim();
          const v = match[2].trim().replace(/^['"]|['"]$/g, '');
          if (k === 'VITE_SUPABASE_URL' && !url) url = v;
          if (k === 'VITE_SUPABASE_ANON_KEY' && !key) key = v;
          if (k === 'DISCORD_WEBHOOK_URL' && !discordWebhook) discordWebhook = v;
          if (k === 'TELEGRAM_BOT_TOKEN' && !telegramToken) telegramToken = v;
          if (k === 'TELEGRAM_CHAT_ID' && !telegramChatId) telegramChatId = v;
        }
      });
    }
  }

  return { url, key, discordWebhook, telegramToken, telegramChatId };
}

const env = loadEnv();
if (!env.url || !env.key) {
  console.error('❌ Missing Supabase credentials.');
  process.exit(1);
}

const supabase = createClient(env.url, env.key);

/**
 * Dispatch notification through available free channels
 */
async function dispatchNotification(alert, product, storePrice) {
  const savings = alert.target_price - storePrice.price;
  const message = `🚨 PRICE DROP ALERT: ${product?.name || alert.product_id}\n`
    + `💰 Current Lowest Price: ₹${storePrice.price.toLocaleString('en-IN')} on ${storePrice.store.toUpperCase()}\n`
    + `🎯 Target Threshold:     ₹${alert.target_price.toLocaleString('en-IN')}\n`
    + `✨ Additional Savings:    ₹${savings.toLocaleString('en-IN')}\n`
    + `🛒 Direct Link:           ${storePrice.url || 'https://bro-ai.vercel.app'}\n`
    + `📲 Alert Delivered via:   ${alert.channel.toUpperCase()} (${alert.contact_info})`;

  console.log('\n----------------------------------------------------');
  console.log(`⚡ DISPATCHING NOTIFICATION FOR ALERT #${alert.id}:`);
  console.log(message);
  console.log('----------------------------------------------------');

  // A. Optional Discord Webhook dispatch
  if (env.discordWebhook) {
    try {
      await fetch(env.discordWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: message,
          username: 'BRO AI Watchdog'
        })
      });
      console.log('✔ Discord webhook delivered.');
    } catch (e) {
      console.warn('Discord webhook failed:', e.message);
    }
  }

  // B. Optional Telegram Bot dispatch
  if (env.telegramToken && env.telegramChatId) {
    try {
      const tgUrl = `https://api.telegram.org/bot${env.telegramToken}/sendMessage`;
      await fetch(tgUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: env.telegramChatId,
          text: message
        })
      });
      console.log('✔ Telegram bot message delivered.');
    } catch (e) {
      console.warn('Telegram dispatch failed:', e.message);
    }
  }

  return true;
}

async function runWatchdog() {
  console.log('====================================================');
  console.log('🐕 BRO AI Autonomous Watchdog Evaluating Alerts...');
  console.log(`🕒 Timestamp: ${new Date().toISOString()}`);
  console.log('====================================================\n');

  // 1. Fetch active alerts from Supabase
  const { data: alerts, error: alertErr } = await supabase
    .from('price_alerts')
    .select('*')
    .eq('is_active', true);

  if (alertErr) {
    console.error('Failed to load active price alerts:', alertErr);
    process.exit(1);
  }

  if (!alerts || alerts.length === 0) {
    console.log('ℹ️ No active price alerts found in public.price_alerts. Watchdog idle.\n');
    return;
  }

  console.log(`🔎 Found ${alerts.length} active price alerts to evaluate.\n`);

  // 2. Fetch products and prices
  const { data: products } = await supabase.from('products').select('id, name');
  const prodMap = {};
  (products || []).forEach(p => { prodMap[p.id] = p; });

  const { data: allPrices } = await supabase.from('product_prices').select('*');
  const pricesByProduct = {};
  (allPrices || []).forEach(pr => {
    if (!pricesByProduct[pr.product_id]) pricesByProduct[pr.product_id] = [];
    pricesByProduct[pr.product_id].push(pr);
  });

  let triggeredCount = 0;

  // 3. Evaluate each active alert
  for (const alert of alerts) {
    const storePrices = pricesByProduct[alert.product_id] || [];
    if (storePrices.length === 0) continue;

    // Find lowest price
    let lowest = storePrices[0];
    for (const pr of storePrices) {
      if (pr.price < lowest.price) lowest = pr;
    }

    const product = prodMap[alert.product_id];

    console.log(`Checking [${product?.name || alert.product_id}]: Current Floor = ₹${lowest.price} vs Target = ₹${alert.target_price}`);

    // If current store floor is at or below user's target price
    if (lowest.price <= alert.target_price) {
      await dispatchNotification(alert, product, lowest);

      // Deactivate alert after successful trigger (or set last_triggered)
      const { error: updateErr } = await supabase
        .from('price_alerts')
        .update({ is_active: false })
        .eq('id', alert.id);

      if (!updateErr) {
        console.log(`✔ Alert #${alert.id} marked fulfilled and deactivated.`);
        triggeredCount++;
      }
    }
  }

  console.log('\n====================================================');
  console.log(`🏁 Watchdog Evaluation Complete!`);
  console.log(`🎯 Active Alerts Evaluated: ${alerts.length}`);
  console.log(`🚨 Price Drop Alerts Fired: ${triggeredCount}`);
  console.log('====================================================\n');
}

runWatchdog().catch(err => {
  console.error('Fatal Watchdog Error:', err);
  process.exit(1);
});
