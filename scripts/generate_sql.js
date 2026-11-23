import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import PRODUCTS from electronics.js
const electronicsPath = path.join(__dirname, '../src/data/electronics.js');
const electronicsContent = fs.readFileSync(electronicsPath, 'utf8');

// We can dynamically evaluate the PRODUCTS object
// To do this cleanly, let's create a temporary module or extract PRODUCTS
import('../src/data/electronics.js').then(({ PRODUCTS }) => {
  let sql = `-- Seed script for BRO AI Products and Prices\n`;

  const escapeStr = (str) => {
    if (str === null || str === undefined) return 'NULL';
    return `'${String(str).replace(/'/g, "''")}'`;
  };

  const productRows = [];
  const priceRows = [];
  const historyRows = [];

  for (const [category, products] of Object.entries(PRODUCTS)) {
    for (const p of products) {
      const specsJson = escapeStr(JSON.stringify(p.specs || []));
      const purposesArr = (p.purposes || []).map(purp => `"${purp.replace(/"/g, '\\"')}"`).join(',');
      const budgetMax = p.budgetMax === Infinity || !p.budgetMax ? 9999999 : p.budgetMax;
      const budgetMin = p.budgetMin || 0;

      productRows.push(`(
        ${escapeStr(p.id)},
        ${escapeStr(p.name)},
        ${escapeStr(category)},
        ${escapeStr(p.tagline)},
        ${p.rating || 4.0},
        ${escapeStr(p.badge || '')},
        ${specsJson}::jsonb,
        ARRAY[${(p.purposes || []).map(escapeStr).join(',')}],
        ${budgetMin},
        ${budgetMax}
      )`);

      // Prices
      if (p.price) {
        if (p.price.amazon) {
          priceRows.push(`(${escapeStr(p.id)}, 'amazon', ${p.price.amazon}, ${escapeStr(p.amazonUrl || '')}, true, NOW())`);
        }
        if (p.price.flipkart) {
          priceRows.push(`(${escapeStr(p.id)}, 'flipkart', ${p.price.flipkart}, ${escapeStr(p.flipkartUrl || '')}, true, NOW())`);
        }
        if (p.price.croma) {
          priceRows.push(`(${escapeStr(p.id)}, 'croma', ${p.price.croma}, ${escapeStr(p.cromaUrl || '')}, true, NOW())`);
        }
      }

      // 30-day realistic price history for key products (generate 5-6 points over last 30 days)
      const basePrice = (p.price && (p.price.flipkart || p.price.amazon)) || 10000;
      const days = [30, 24, 18, 12, 6, 1];
      const variance = [1.08, 1.05, 1.02, 1.06, 1.01, 1.0];
      days.forEach((d, idx) => {
        const histPrice = Math.round(basePrice * variance[idx]);
        historyRows.push(`(${escapeStr(p.id)}, 'flipkart', ${histPrice}, NOW() - INTERVAL '${d} days')`);
      });
    }
  }

  sql += `
-- 1. Insert Products
INSERT INTO public.products (id, name, category, tagline, rating, badge, specs, purposes, budget_min, budget_max)
VALUES
${productRows.join(',\n')}
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  tagline = EXCLUDED.tagline,
  rating = EXCLUDED.rating,
  badge = EXCLUDED.badge,
  specs = EXCLUDED.specs,
  purposes = EXCLUDED.purposes,
  budget_min = EXCLUDED.budget_min,
  budget_max = EXCLUDED.budget_max;

-- 2. Insert Store Prices
INSERT INTO public.product_prices (product_id, store, price, url, is_available, last_checked)
VALUES
${priceRows.join(',\n')};

-- 3. Insert Historical Price Points
INSERT INTO public.price_history (product_id, store, price, recorded_at)
VALUES
${historyRows.join(',\n')};
`;

  fs.writeFileSync(path.join(__dirname, 'seed.sql'), sql, 'utf8');
  console.log(`Generated seed.sql with ${productRows.length} products, ${priceRows.length} store prices, and ${historyRows.length} history records.`);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
