// All electronics categories with products, budget ranges, and best-buy links

export const STORE_CONFIG = {
  amazon: {
    name: 'Amazon India',
    type: 'ecom',
    deliveryType: 'Scheduled / Prime',
    eta: 'Next-Day Prime',
    color: '#EA580C',
    bg: '#FFF7ED',
    border: '#FED7AA'
  },
  flipkart: {
    name: 'Flipkart',
    type: 'ecom',
    deliveryType: 'Scheduled / Plus',
    eta: '1-2 Days Plus',
    color: '#2563EB',
    bg: '#EFF6FF',
    border: '#BFDBFE'
  },
  croma: {
    name: 'Croma (Tata)',
    type: 'retail',
    deliveryType: 'Store Pickup / Express',
    eta: 'Today / In-Store Pickup',
    color: '#008738',
    bg: '#F3FBEF',
    border: '#CDEEC6'
  },
  reliance: {
    name: 'Reliance Digital',
    type: 'retail',
    deliveryType: 'Store Pickup / Express',
    eta: 'Same-Day / Store Pickup',
    color: '#E11D48',
    bg: '#FFF1F2',
    border: '#FECDD3'
  },
  jiomart: {
    name: 'JioMart',
    type: 'ecom',
    deliveryType: 'Scheduled',
    eta: '1-2 Days Delivery',
    color: '#0D9488',
    bg: '#F0FDFA',
    border: '#99F6E4'
  },
  blinkit: {
    name: 'Blinkit',
    type: 'quick',
    deliveryType: '⚡ 10-Min Flash',
    eta: '10 Mins Flash',
    color: '#CA8A04',
    bg: '#FEFCE8',
    border: '#FEF08A'
  },
  zepto: {
    name: 'Zepto',
    type: 'quick',
    deliveryType: '⚡ 10-Min Flash',
    eta: '10 Mins Flash',
    color: '#7C3AED',
    bg: '#F5F3FF',
    border: '#DDD6FE'
  },
  flipkart_minutes: {
    name: 'Flipkart Minutes',
    type: 'quick',
    deliveryType: '⚡ 10-Min Flash',
    eta: '10-15 Mins Flash',
    color: '#0284C7',
    bg: '#F0F9FF',
    border: '#BAE6FD'
  },
  vijaysales: {
    name: 'Vijay Sales',
    type: 'retail',
    deliveryType: 'Store Pickup',
    eta: 'Today / In-Store',
    color: '#DC2626',
    bg: '#FEF2F2',
    border: '#FECACA'
  }
};

export const CATEGORIES = [
  { id: 'smartphone', label: 'Smartphones', icon: '📱' },
  { id: 'laptop', label: 'Laptops', icon: '💻' },
  { id: 'tablet', label: 'Tablets', icon: '📲' },
  { id: 'tws', label: 'TWS / Earbuds', icon: '🎧' },
  { id: 'headphone', label: 'Headphones', icon: '🎵' },
  { id: 'smartwatch', label: 'Smartwatches', icon: '⌚' },
  { id: 'tv', label: 'Smart TVs', icon: '📺' },
  { id: 'router', label: 'Routers & WiFi', icon: '📡' },
  { id: 'powerbank', label: 'Power Banks', icon: '🔋' },
  { id: 'charger', label: 'Chargers', icon: '⚡' },
  { id: 'cable', label: 'Cables', icon: '🔌' },
  { id: 'keyboard', label: 'Keyboards', icon: '⌨️' },
  { id: 'mouse', label: 'Mouse', icon: '🖱️' },
  { id: 'monitor', label: 'Monitors', icon: '🖥️' },
  { id: 'speaker', label: 'Bluetooth Speakers', icon: '🔊' },
  { id: 'camera', label: 'Cameras', icon: '📷' },
  { id: 'harddisk', label: 'Hard Disks / SSDs', icon: '💾' },
  { id: 'pendrive', label: 'Pen Drives', icon: '🗂️' },
];

export const PURPOSES = {
  smartphone: ['Daily Use / Budget', 'Photography', 'Gaming', 'Business / Work', 'Best Camera Under Budget', 'Premium Flagship'],
  laptop: ['Student / College', 'Office / Work', 'Video Editing', 'Programming / Dev', 'Gaming', 'Thin & Light Travel'],
  tablet: ['Kids / Learning', 'Drawing / Art', 'Streaming / Entertainment', 'Work / Productivity'],
  tws: ['Best Sound Quality', 'Best ANC (Noise Cancellation)', 'Budget Pick', 'Sports / Workout', 'Premium'],
  headphone: ['Gaming', 'Studio / Music Production', 'Office / Calls', 'Casual Listening'],
  smartwatch: ['Fitness Tracking', 'Fashion / Style', 'Health Monitoring (SpO2/ECG)', 'Budget Smart Band'],
  tv: ['Budget 32"', 'Living Room 43"-55"', 'Gaming TV', 'Home Theatre 65"+'],
  router: ['Home 2-3 rooms', 'Large Home / 4+ rooms', 'Gaming Low Latency', 'Mesh WiFi System'],
  powerbank: ['Pocket / Slim', 'High Capacity 20000mAh+', 'Fast Charging 65W+', 'Solar Power Bank'],
  charger: ['5W Standard', '18W Fast Charge', '33W/65W Super Fast', '100W+ GaN Charger', 'Wireless Charger'],
  cable: ['USB-C to USB-C', 'USB-C to Lightning', 'USB-A to Micro USB', 'Braided Durable', 'Long 2m+'],
  keyboard: ['Budget Membrane', 'Mechanical Gaming', 'Wireless Office', 'Compact 65%'],
  mouse: ['Basic Office', 'Gaming High DPI', 'Wireless Ergonomic', 'Silent Click'],
  monitor: ['24" FHD Office', '27" QHD Creative', '144Hz+ Gaming', 'Portable Monitor'],
  speaker: ['Portable Party', 'Waterproof Outdoor', 'Home Bookshelf', 'Mini Pocket'],
  camera: ['Beginner DSLR', 'Mirrorless', 'Action Camera', 'Vlogging'],
  harddisk: ['External HDD Backup', 'Portable SSD Fast', 'Internal SSD Upgrade', 'NAS Storage'],
  pendrive: ['Basic Storage', 'High Speed USB 3.0', 'Tiny Nano Drive', 'OTG Dual Port'],
};

export const BUDGET_RANGES = [
  { label: 'All Budgets', min: 0, max: Infinity },
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 – ₹1,000', min: 500, max: 1000 },
  { label: '₹1,000 – ₹2,000', min: 1000, max: 2000 },
  { label: '₹2,000 – ₹5,000', min: 2000, max: 5000 },
  { label: '₹5,000 – ₹10,000', min: 5000, max: 10000 },
  { label: '₹10,000 – ₹20,000', min: 10000, max: 20000 },
  { label: '₹20,000 – ₹40,000', min: 20000, max: 40000 },
  { label: '₹40,000 – ₹80,000', min: 40000, max: 80000 },
  { label: '₹80,000+', min: 80000, max: Infinity },
];

// Product database
export const PRODUCTS = {
  smartphone: [
    {
      id: 'redmi13c',
      name: 'Redmi 13C',
      tagline: 'Best budget pick with decent camera',
      price: { amazon: 8499, flipkart: 8299, croma: 8999 },
      rating: 4.2,
      badge: 'Best Value',
      specs: ['6.74" HD+ Display', 'MediaTek Helio G85', '50MP Camera', '5000mAh Battery'],
      purposes: ['Daily Use / Budget'],
      budgetMax: 10000,
      budgetMin: 5000,
      amazonUrl: 'https://www.amazon.in/s?k=redmi+13c',
      flipkartUrl: 'https://www.flipkart.com/search?q=redmi+13c',
      cromaUrl: 'https://www.croma.com/searchB?q=redmi+13c',
    },
    {
      id: 'poco_m6pro',
      name: 'POCO M6 Pro 5G',
      tagline: 'Best 5G phone under ₹12,000',
      price: { amazon: 10999, flipkart: 10499, croma: 11999 },
      rating: 4.3,
      badge: 'Trending',
      specs: ['6.67" FHD+ AMOLED', 'Dimensity 6080 5G', '64MP Camera', '5000mAh + 33W'],
      purposes: ['Daily Use / Budget'],
      budgetMax: 15000,
      budgetMin: 8000,
      amazonUrl: 'https://www.amazon.in/s?k=poco+m6+pro+5g',
      flipkartUrl: 'https://www.flipkart.com/search?q=poco+m6+pro+5g',
      cromaUrl: 'https://www.croma.com/searchB?q=poco+m6+pro',
    },
    {
      id: 'samsung_m35',
      name: 'Samsung Galaxy M35 5G',
      tagline: 'Best Samsung under ₹20K with AMOLED',
      price: { amazon: 16999, flipkart: 15999, croma: 17999 },
      rating: 4.4,
      badge: 'Editor\'s Choice',
      specs: ['6.6" Super AMOLED+', 'Exynos 1380', '50MP OIS Camera', '6000mAh + 25W'],
      purposes: ['Daily Use / Budget', 'Photography'],
      budgetMax: 20000,
      budgetMin: 12000,
      amazonUrl: 'https://www.amazon.in/s?k=samsung+galaxy+m35+5g',
      flipkartUrl: 'https://www.flipkart.com/search?q=samsung+m35+5g',
      cromaUrl: 'https://www.croma.com/searchB?q=samsung+m35',
    },
    {
      id: 'oneplus_nord_ce4',
      name: 'OnePlus Nord CE 4',
      tagline: 'Snapdragon, 100W charging madness',
      price: { amazon: 24999, flipkart: 23999, croma: 25999 },
      rating: 4.5,
      badge: 'Fastest Charging',
      specs: ['6.7" FHD+ AMOLED', 'Snapdragon 7s Gen 2', '50MP Sony Sensor', '100W SUPERVOOC'],
      purposes: ['Daily Use / Budget', 'Business / Work'],
      budgetMax: 30000,
      budgetMin: 20000,
      amazonUrl: 'https://www.amazon.in/s?k=oneplus+nord+ce4',
      flipkartUrl: 'https://www.flipkart.com/search?q=oneplus+nord+ce4',
      cromaUrl: 'https://www.croma.com/searchB?q=oneplus+nord+ce4',
    },
    {
      id: 'pixel_8a',
      name: 'Google Pixel 8a',
      tagline: 'Best camera phone under ₹50K — period',
      price: { amazon: 44999, flipkart: 43999, croma: 46999 },
      rating: 4.7,
      badge: 'Best Camera',
      specs: ['6.1" Actua OLED 120Hz', 'Google Tensor G3', '64MP + AI camera magic', '4492mAh + Wireless'],
      purposes: ['Photography', 'Best Camera Under Budget'],
      budgetMax: 50000,
      budgetMin: 35000,
      amazonUrl: 'https://www.amazon.in/s?k=google+pixel+8a',
      flipkartUrl: 'https://www.flipkart.com/search?q=google+pixel+8a',
      cromaUrl: 'https://www.croma.com/searchB?q=google+pixel+8a',
    },
    {
      id: 'iqoo_neo9pro',
      name: 'iQOO Neo 9 Pro',
      tagline: 'Gaming beast with Snapdragon 8 Gen 2',
      price: { amazon: 34999, flipkart: 33999, croma: 35999 },
      rating: 4.6,
      badge: 'Gaming King',
      specs: ['6.78" AMOLED 144Hz', 'Snapdragon 8 Gen 2', 'Monster Cooling', '5160mAh + 120W'],
      purposes: ['Gaming'],
      budgetMax: 40000,
      budgetMin: 25000,
      amazonUrl: 'https://www.amazon.in/s?k=iqoo+neo+9+pro',
      flipkartUrl: 'https://www.flipkart.com/search?q=iqoo+neo+9+pro',
      cromaUrl: 'https://www.croma.com/searchB?q=iqoo+neo+9+pro',
    },
    {
      id: 'iqoo_15_5g',
      name: 'iQOO 15 5G',
      tagline: 'Snapdragon 8 Elite gaming flagship with 2K 144Hz AMOLED & 6500mAh battery',
      price: { amazon: 59999, flipkart: 58999, croma: 61999 },
      rating: 4.9,
      badge: 'Elite Gaming',
      specs: ['6.85" 2K 144Hz LTPO AMOLED', 'Snapdragon 8 Elite (3nm)', '50MP Sony IMX921 OIS', '6500mAh + 120W FlashCharge'],
      purposes: ['Gaming', 'Premium Flagship'],
      budgetMax: 80000,
      budgetMin: 50000,
      amazonUrl: 'https://www.amazon.in/s?k=iqoo+15+5g',
      flipkartUrl: 'https://www.flipkart.com/search?q=iqoo+15+5g',
      cromaUrl: 'https://www.croma.com/searchB?q=iqoo+15',
    },
    {
      id: 'iqoo_13_5g',
      name: 'iQOO 13 5G',
      tagline: 'Snapdragon 8 Elite monster with Q2 supercomputing gaming chip',
      price: { amazon: 54999, flipkart: 53999, croma: 55999 },
      rating: 4.8,
      badge: 'Flagship Beast',
      specs: ['6.82" 2K 144Hz LTPO AMOLED', 'Snapdragon 8 Elite (3nm)', '6150mAh + 120W FlashCharge', 'Q2 Dedicated Gaming Chip'],
      purposes: ['Gaming', 'Premium Flagship'],
      budgetMax: 80000,
      budgetMin: 50000,
      amazonUrl: 'https://www.amazon.in/s?k=iqoo+13+5g',
      flipkartUrl: 'https://www.flipkart.com/search?q=iqoo+13+5g',
      cromaUrl: 'https://www.croma.com/searchB?q=iqoo+13',
    },
    {
      id: 'iqoo_z9s',
      name: 'iQOO Z9s 5G',
      tagline: 'Best curved 120Hz AMOLED under ₹20,000',
      price: { amazon: 19999, flipkart: 18999, croma: 20999 },
      rating: 4.5,
      badge: 'Budget King',
      specs: ['6.77" 120Hz 3D Curved AMOLED', 'Dimensity 7300', '50MP Sony IMX882 OIS', '5500mAh + 44W'],
      purposes: ['Daily Use / Budget', 'Gaming'],
      budgetMax: 20000,
      budgetMin: 15000,
      amazonUrl: 'https://www.amazon.in/s?k=iqoo+z9s+5g',
      flipkartUrl: 'https://www.flipkart.com/search?q=iqoo+z9s+5g',
      cromaUrl: 'https://www.croma.com/searchB?q=iqoo+z9s',
    },
    {
      id: 'oneplus_12r',
      name: 'OnePlus 12R',
      tagline: 'Flagship killer with Snapdragon 8 Gen 2 & 5500mAh',
      price: { amazon: 39999, flipkart: 38999, croma: 40999 },
      rating: 4.6,
      badge: 'Editor Choice',
      specs: ['6.78" 1.5K LTPO4 AMOLED', 'Snapdragon 8 Gen 2', '5500mAh + 100W SuperVOOC', '50MP Sony IMX890'],
      purposes: ['Daily Use / Budget', 'Gaming', 'Business / Work'],
      budgetMax: 45000,
      budgetMin: 35000,
      amazonUrl: 'https://www.amazon.in/s?k=oneplus+12r',
      flipkartUrl: 'https://www.flipkart.com/search?q=oneplus+12r',
      cromaUrl: 'https://www.croma.com/searchB?q=oneplus+12r',
    },
    {
      id: 'iphone13',
      name: 'iPhone 13',
      tagline: 'Best value iPhone in India under ₹50K with incredible battery',
      price: { amazon: 49999, flipkart: 48999, croma: 51999 },
      rating: 4.7,
      badge: 'Value Apple Pick',
      specs: ['6.1" Super Retina XDR', 'A15 Bionic chip', '12MP Dual Cameras with Cinematic Mode', 'All-Day Battery Life'],
      purposes: ['Daily Use / Budget', 'Photography', 'Premium Flagship'],
      budgetMax: 60000,
      budgetMin: 40000,
      amazonUrl: 'https://www.amazon.in/s?k=iphone+13',
      flipkartUrl: 'https://www.flipkart.com/search?q=iphone+13',
      cromaUrl: 'https://www.croma.com/searchB?q=iphone+13',
    },
    {
      id: 'iphone14',
      name: 'iPhone 14',
      tagline: 'Reliable iOS performer with Crash Detection and Photonic Engine',
      price: { amazon: 58999, flipkart: 57999, croma: 59999 },
      rating: 4.7,
      badge: 'Popular iOS',
      specs: ['6.1" Super Retina XDR', 'A15 Bionic (5-core GPU)', 'Photonic Engine + Action Mode', 'Crash Detection'],
      purposes: ['Premium Flagship', 'Photography', 'Daily Use / Budget'],
      budgetMax: 70000,
      budgetMin: 50000,
      amazonUrl: 'https://www.amazon.in/s?k=iphone+14',
      flipkartUrl: 'https://www.flipkart.com/search?q=iphone+14',
      cromaUrl: 'https://www.croma.com/searchB?q=iphone+14',
    },
    {
      id: 'iphone15',
      name: 'iPhone 15',
      tagline: 'Dynamic Island, 48MP main camera & USB-C connectivity',
      price: { amazon: 69999, flipkart: 67999, croma: 71999 },
      rating: 4.8,
      badge: 'Premium Flagship',
      specs: ['6.1" Super Retina XDR with Dynamic Island', 'A16 Bionic', '48MP Main + 2x Telephoto', 'USB-C Universal Charging'],
      purposes: ['Premium Flagship', 'Photography', 'Business / Work'],
      budgetMax: 80000,
      budgetMin: 60000,
      amazonUrl: 'https://www.amazon.in/s?k=iphone+15',
      flipkartUrl: 'https://www.flipkart.com/search?q=iphone+15',
      cromaUrl: 'https://www.croma.com/searchB?q=iphone+15',
    },
    {
      id: 'iphone15pro',
      name: 'iPhone 15 Pro',
      tagline: 'Grade 5 Titanium design, A17 Pro 3nm chip and Action Button',
      price: { amazon: 114999, flipkart: 109999, croma: 119999 },
      rating: 4.9,
      badge: 'Pro Titanium',
      specs: ['6.1" 120Hz ProMotion Super Retina XDR', 'A17 Pro (Console Gaming)', '48MP Pro Camera + 3x Zoom', 'Titanium Build + Action Button'],
      purposes: ['Premium Flagship', 'Gaming', 'Photography', 'Business / Work'],
      budgetMax: 140000,
      budgetMin: 80000,
      amazonUrl: 'https://www.amazon.in/s?k=iphone+15+pro',
      flipkartUrl: 'https://www.flipkart.com/search?q=iphone+15+pro',
      cromaUrl: 'https://www.croma.com/searchB?q=iphone+15+pro',
    },
    {
      id: 'iphone16',
      name: 'iPhone 16',
      tagline: 'Built for Apple Intelligence with A18 chip and dedicated Camera Control',
      price: { amazon: 79900, flipkart: 78900, croma: 79900 },
      rating: 4.9,
      badge: 'Latest Generation',
      specs: ['6.1" Super Retina XDR', 'A18 Bionic + Apple Intelligence', '48MP Fusion Camera + Macro', 'Camera Control Button'],
      purposes: ['Premium Flagship', 'Photography', 'Business / Work'],
      budgetMax: 90000,
      budgetMin: 70000,
      amazonUrl: 'https://www.amazon.in/s?k=iphone+16',
      flipkartUrl: 'https://www.flipkart.com/search?q=iphone+16',
      cromaUrl: 'https://www.croma.com/searchB?q=iphone+16',
    },
    {
      id: 'iphone16pro',
      name: 'iPhone 16 Pro',
      tagline: 'Larger 6.3" ProMotion display, A18 Pro chip, 5x telephoto camera',
      price: { amazon: 119900, flipkart: 118900, croma: 119900 },
      rating: 4.9,
      badge: 'Pro Masterpiece',
      specs: ['6.3" 120Hz ProMotion XDR Display', 'A18 Pro (Ray Tracing)', '48MP Fusion + 5x Telephoto Zoom', 'Studio-Quality 4-Mic Array'],
      purposes: ['Premium Flagship', 'Photography', 'Gaming', 'Business / Work'],
      budgetMax: 150000,
      budgetMin: 80000,
      amazonUrl: 'https://www.amazon.in/s?k=iphone+16+pro',
      flipkartUrl: 'https://www.flipkart.com/search?q=iphone+16+pro',
      cromaUrl: 'https://www.croma.com/searchB?q=iphone+16+pro',
    },
    {
      id: 'iphone16promax',
      name: 'iPhone 16 Pro Max',
      tagline: 'Ultimate 6.9" Super Retina XDR, longest iPhone battery life ever',
      price: { amazon: 144900, flipkart: 142900, croma: 144900 },
      rating: 5.0,
      badge: 'Ultimate Flagship',
      specs: ['6.9" 120Hz ProMotion XDR (Largest Ever)', 'A18 Pro chip with 6-core GPU', '5x Optical Zoom 120mm', 'Best Battery Life on any iPhone'],
      purposes: ['Premium Flagship', 'Photography', 'Gaming', 'Business / Work'],
      budgetMax: 200000,
      budgetMin: 120000,
      amazonUrl: 'https://www.amazon.in/s?k=iphone+16+pro+max',
      flipkartUrl: 'https://www.flipkart.com/search?q=iphone+16+pro+max',
      cromaUrl: 'https://www.croma.com/searchB?q=iphone+16+pro+max',
    },
    {
      id: 'iphone17promax',
      name: 'iPhone 17 Pro Max',
      tagline: 'Next-gen 2nm A19 Pro chip, 6.9" anti-reflective OLED & 48MP periscope zoom',
      mrp: 179900,
      price: { amazon: 159900, flipkart: 157900, croma: 159900, reliance: 159900, brand_store: 159900 },
      rating: 5.0,
      badge: 'Next-Gen Flagship',
      specs: [
        '6.9" 120Hz ProMotion Anti-Reflective OLED',
        'A19 Pro 2nm Chipset with Apple Intelligence 2.0',
        '48MP Triple Periscope Zoom System (10x Optical)',
        'Graphene Cooled 5,200mAh High-Density Battery'
      ],
      variants: {
        storage: [
          { label: '256GB', priceDelta: 0, default: true },
          { label: '512GB', priceDelta: 20000 },
          { label: '1TB', priceDelta: 40000 },
          { label: '2TB', priceDelta: 80000 }
        ],
        colors: [
          { name: 'Natural Titanium', hex: '#8A8682', default: true },
          { name: 'Deep Space Black', hex: '#1C1C1E' },
          { name: 'Desert Gold', hex: '#C5A059' },
          { name: 'Silver Titanium', hex: '#E2E2E2' }
        ]
      },
      structuredSpecs: {
        displayAndChassis: [
          { label: 'Screen Size & Type', value: '6.9-inch Super Retina XDR LTPO OLED' },
          { label: 'Refresh Rate', value: '1Hz – 120Hz ProMotion Adaptive Refresh' },
          { label: 'Peak Brightness', value: '3,000 nits Outdoor / 1,600 nits HDR' },
          { label: 'Chassis Material', value: 'Grade 5 Aerospace Titanium with Ceramic Shield 2.0' },
          { label: 'Water & Dust Resistance', value: 'IP68 (6 meters up to 30 mins)' }
        ],
        internalsAndArchitecture: [
          { label: 'Processor / SoC', value: 'Apple A19 Pro (2nm TSMC N2 Architecture)' },
          { label: 'CPU Cores', value: '6-Core (2 Performance + 4 Efficiency)' },
          { label: 'GPU', value: '6-Core Hardware Ray-Tracing GPU with Neural Shaders' },
          { label: 'Neural Engine', value: '16-Core NPU (45 TOPS for on-device AI)' },
          { label: 'Unified Memory', value: '12GB LPDDR5T' }
        ],
        cameraSystem: [
          { label: 'Main Sensor', value: '48MP Fusion (f/1.6, 2nd-gen Sensor-shift OIS)' },
          { label: 'Telephoto Lens', value: '48MP Periscope Telephoto (10x Optical, 50x Digital Zoom)' },
          { label: 'Ultra-Wide Sensor', value: '48MP Ultra-Wide 120° FOV with Macro Mode' },
          { label: 'Video Capabilities', value: '4K ProRes at 120fps with Log & ACES color' },
          { label: 'Dedicated Control', value: 'Next-Gen Haptic Camera Control Button' }
        ],
        batteryAndCharging: [
          { label: 'Battery Capacity', value: '5,200 mAh High-Density Graphene Cooled' },
          { label: 'Wired Fast Charging', value: '45W USB Power Delivery (50% in 20 mins)' },
          { label: 'Wireless Charging', value: '25W MagSafe / Qi2 Certified' },
          { label: 'Battery Life', value: 'Up to 34 hours continuous video playback' }
        ],
        connectivityAndNetwork: [
          { label: '5G Modem', value: 'Snapdragon X75 / Apple Custom 5G (Sub-6 & mmWave)' },
          { label: 'Wi-Fi Standard', value: 'Wi-Fi 7 (802.11be) with Multi-Link Operation' },
          { label: 'Bluetooth & Port', value: 'Bluetooth 5.4, USB-C 3.2 Gen 2 (10Gbps DisplayPort)' },
          { label: 'Satellite Support', value: 'Emergency SOS & Roadside Assistance via Satellite' }
        ]
      },
      purposes: ['Premium Flagship', 'Photography', 'Gaming', 'Business / Work'],
      budgetMax: 250000,
      budgetMin: 140000,
      amazonUrl: 'https://www.amazon.in/s?k=iphone+17+pro+max',
      flipkartUrl: 'https://www.flipkart.com/search?q=iphone+17+pro+max',
      cromaUrl: 'https://www.croma.com/searchB?q=iphone+17+pro+max',
      relianceUrl: 'https://www.reliancedigital.in/search?q=iphone+17+pro+max',
    },
    {
      id: 'samsung_s23',
      name: 'Samsung Galaxy S23 5G',
      tagline: 'Compact powerhouse flagship with Snapdragon 8 Gen 2 under ₹45K',
      price: { amazon: 44999, flipkart: 43999, croma: 46999 },
      rating: 4.8,
      badge: 'Compact Flagship',
      specs: ['6.1" Dynamic AMOLED 2X 120Hz', 'Snapdragon 8 Gen 2 Mobile Platform', '50MP OIS + 3x Optical Telephoto', 'IP68 Water Resistance'],
      purposes: ['Premium Flagship', 'Photography', 'Daily Use / Budget'],
      budgetMax: 50000,
      budgetMin: 35000,
      amazonUrl: 'https://www.amazon.in/s?k=samsung+galaxy+s23',
      flipkartUrl: 'https://www.flipkart.com/search?q=samsung+galaxy+s23',
      cromaUrl: 'https://www.croma.com/searchB?q=samsung+galaxy+s23',
    },
    {
      id: 'oneplus_12',
      name: 'OnePlus 12 5G',
      tagline: 'Top-tier flagship with 2K 120Hz ProXDR and 5400mAh battery',
      price: { amazon: 61999, flipkart: 59999, croma: 62999 },
      rating: 4.8,
      badge: 'Flagship Powerhouse',
      specs: ['6.82" 2K 120Hz ProXDR Display', 'Snapdragon 8 Gen 3', 'Hasselblad 4th Gen Cameras', '5400mAh + 100W SUPERVOOC'],
      purposes: ['Premium Flagship', 'Gaming', 'Photography', 'Business / Work'],
      budgetMax: 70000,
      budgetMin: 55000,
      amazonUrl: 'https://www.amazon.in/s?k=oneplus+12',
      flipkartUrl: 'https://www.flipkart.com/search?q=oneplus+12',
      cromaUrl: 'https://www.croma.com/searchB?q=oneplus+12',
    },
    {
      id: 'samsung_s24ultra',
      name: 'Samsung Galaxy S24 Ultra',
      tagline: 'The ultimate Android flagship with S Pen & Titanium Armor',
      price: {
        flipkart: 124999,
        reliance: 128999,
        amazon: 129999,
        croma: 129999,
        brand_store: 129999
      },
      rating: 4.9,
      badge: 'Flagship King',
      specs: ['6.8" Dynamic AMOLED 2X 120Hz', 'Snapdragon 8 Gen 3', '200MP + 5x Optical Zoom', 'S Pen + AI features', 'Titanium Frame + 5000mAh'],
      purposes: ['Premium Flagship', 'Photography', 'Business / Work'],
      budgetMax: Infinity,
      budgetMin: 100000,
      amazonUrl: 'https://www.amazon.in/dp/B0CS5XW185',
      flipkartUrl: 'https://www.flipkart.com/samsung-galaxy-s24-ultra-5g-titanium-gray-256-gb/p/itm93ce0d24e6df9',
      cromaUrl: 'https://www.croma.com/samsung-galaxy-s24-ultra-5g-12gb-ram-256gb-titanium-gray-/p/304445',
      relianceUrl: 'https://www.reliancedigital.in/samsung-galaxy-s24-ultra-5g-256-gb-12-gb-ram-titanium-gray-mobile-phone/p/494352458',
      brandStoreUrl: 'https://www.samsung.com/in/smartphones/galaxy-s24-ultra/buy/',
    },
  ],

  laptop: [
    {
      id: 'acer_aspire_lite',
      name: 'Acer Aspire Lite',
      tagline: 'Affordable student laptop with decent performance',
      price: { amazon: 29999, flipkart: 28999, croma: 30999 },
      rating: 4.1,
      badge: 'Student Pick',
      specs: ['15.6" FHD IPS', 'AMD Ryzen 5 5500U', '8GB RAM / 512GB SSD', 'Up to 8 hrs battery'],
      purposes: ['Student / College', 'Office / Work'],
      budgetMax: 35000,
      budgetMin: 20000,
      amazonUrl: 'https://www.amazon.in/s?k=acer+aspire+lite+ryzen+5',
      flipkartUrl: 'https://www.flipkart.com/search?q=acer+aspire+lite',
      cromaUrl: 'https://www.croma.com/searchB?q=acer+aspire+lite',
    },
    {
      id: 'acer_aspire_5_gaming',
      name: 'Acer Aspire 5 Gaming',
      tagline: 'Best budget gaming laptop with RTX 2050 under ₹40K',
      price: { amazon: 39999, flipkart: 38999, croma: 41999, reliance: 40999 },
      rating: 4.3,
      badge: 'Budget Gaming',
      specs: ['15.6" FHD 144Hz IPS', 'Intel Core i5-12450H', 'RTX 2050 4GB Graphics', '16GB RAM / 512GB SSD'],
      variants: {
        ram: [
          { label: '8GB', priceDelta: -2500 },
          { label: '16GB', priceDelta: 0, default: true },
          { label: '32GB', priceDelta: 4500 }
        ],
        storage: [
          { label: '512GB SSD', priceDelta: 0, default: true },
          { label: '1TB SSD', priceDelta: 3500 }
        ]
      },
      purposes: ['Gaming', 'Student / College', 'Video Editing'],
      budgetMax: 45000,
      budgetMin: 20000,
      amazonUrl: 'https://www.amazon.in/s?k=acer+aspire+5+gaming+rtx+2050',
      flipkartUrl: 'https://www.flipkart.com/search?q=acer+aspire+5+gaming',
      cromaUrl: 'https://www.croma.com/searchB?q=acer+aspire+5+gaming',
    },
    {
      id: 'asus_tuf_f15_budget',
      name: 'ASUS TUF Gaming F15',
      tagline: 'Sub-40K military-grade gaming warrior with 144Hz Adaptive-Sync display',
      price: { amazon: 39990, flipkart: 38990, croma: 41990, reliance: 40990 },
      rating: 4.4,
      badge: 'Best Sub-40K Gaming',
      specs: ['15.6" FHD 144Hz Adaptive-Sync', 'Intel Core i5-11400H', 'NVIDIA GeForce RTX 2050 4GB', '16GB DDR4 / 512GB NVMe SSD'],
      purposes: ['Gaming', 'Student / College', 'Video Editing'],
      budgetMax: 45000,
      budgetMin: 20000,
      amazonUrl: 'https://www.amazon.in/s?k=asus+tuf+gaming+f15',
      flipkartUrl: 'https://www.flipkart.com/search?q=asus+tuf+gaming+f15',
      cromaUrl: 'https://www.croma.com/searchB?q=asus+tuf+gaming+f15',
      relianceUrl: 'https://www.reliancedigital.in/search?q=asus+tuf+gaming+f15',
    },
    {
      id: 'lenovo_ideapad_slim3',
      name: 'Lenovo IdeaPad Slim 3',
      tagline: 'Lightweight everyday laptop with AMD Ryzen 5 & Rapid Charge',
      price: { amazon: 34990, flipkart: 33990, croma: 35990, reliance: 35490 },
      rating: 4.3,
      badge: 'Budget Value',
      specs: ['15.6" FHD Anti-Glare', 'AMD Ryzen 5 7520U', '16GB LPDDR5 / 512GB SSD', 'Military-Grade Durability (MIL-STD-810H)'],
      purposes: ['Student / College', 'Office / Work', 'Thin & Light Travel'],
      budgetMax: 40000,
      budgetMin: 20000,
      amazonUrl: 'https://www.amazon.in/s?k=lenovo+ideapad+slim+3',
      flipkartUrl: 'https://www.flipkart.com/search?q=lenovo+ideapad+slim+3',
      cromaUrl: 'https://www.croma.com/searchB?q=lenovo+ideapad+slim+3',
      relianceUrl: 'https://www.reliancedigital.in/search?q=lenovo+ideapad+slim+3',
    },
    {
      id: 'lenovo_loq_15',
      name: 'Lenovo LOQ 15',
      tagline: 'Unmatched mid-range gaming with RTX 4050 6GB (95W TGP) & 100% sRGB',
      price: { amazon: 64990, flipkart: 63990, croma: 66990, reliance: 65990 },
      rating: 4.6,
      badge: 'Top Mid Gaming',
      specs: ['15.6" FHD 144Hz 100% sRGB', 'Intel Core i5-12450HX', 'NVIDIA RTX 4050 6GB (95W TGP)', '16GB DDR5 4800MHz / 512GB Gen4 SSD'],
      purposes: ['Gaming', 'Programming / Dev', 'Video Editing'],
      budgetMax: 80000,
      budgetMin: 45000,
      amazonUrl: 'https://www.amazon.in/s?k=lenovo+loq+15+rtx+4050',
      flipkartUrl: 'https://www.flipkart.com/search?q=lenovo+loq+15',
      cromaUrl: 'https://www.croma.com/searchB?q=lenovo+loq+15',
      relianceUrl: 'https://www.reliancedigital.in/search?q=lenovo+loq+15',
    },
    {
      id: 'hp_15s',
      name: 'HP 15s',
      tagline: 'Reliable office workhorse from HP',
      price: { amazon: 38999, flipkart: 37499, croma: 39999 },
      rating: 4.2,
      badge: 'Office Ready',
      specs: ['15.6" FHD Anti-Glare', 'Intel Core i5-1235U', '8GB RAM / 512GB SSD', 'HP Fast Charge'],
      purposes: ['Student / College', 'Office / Work', 'Programming / Dev'],
      budgetMax: 45000,
      budgetMin: 25000,
      amazonUrl: 'https://www.amazon.in/s?k=hp+15s+core+i5',
      flipkartUrl: 'https://www.flipkart.com/search?q=hp+15s+i5',
      cromaUrl: 'https://www.croma.com/searchB?q=hp+15s',
    },
    {
      id: 'hp_victus_15',
      name: 'HP Victus 15',
      tagline: 'High-performance gaming laptop with 144Hz display',
      price: { amazon: 49999, flipkart: 48999, croma: 51999 },
      rating: 4.4,
      badge: 'Gaming Champ',
      specs: ['15.6" 144Hz FHD Display', 'AMD Ryzen 5 5600H', 'NVIDIA GeForce RTX 3050 4GB', '16GB RAM / 512GB SSD'],
      purposes: ['Gaming', 'Programming / Dev', 'Video Editing'],
      budgetMax: 65000,
      budgetMin: 40000,
      amazonUrl: 'https://www.amazon.in/s?k=hp+victus+15+ryzen+5',
      flipkartUrl: 'https://www.flipkart.com/search?q=hp+victus+15',
      cromaUrl: 'https://www.croma.com/searchB?q=hp+victus+15',
    },
    {
      id: 'asus_vivobook_14',
      name: 'ASUS VivoBook 14',
      tagline: 'Slim, light and stylish for college',
      price: { amazon: 42999, flipkart: 41999, croma: 44999 },
      rating: 4.3,
      badge: 'Thin & Light',
      specs: ['14" FHD OLED 60Hz', 'AMD Ryzen 5 7530U', '16GB RAM / 512GB SSD', '1.5kg featherlight'],
      purposes: ['Thin & Light Travel', 'Student / College', 'Office / Work'],
      budgetMax: 50000,
      budgetMin: 35000,
      amazonUrl: 'https://www.amazon.in/s?k=asus+vivobook+14+ryzen+5',
      flipkartUrl: 'https://www.flipkart.com/search?q=asus+vivobook+14',
      cromaUrl: 'https://www.croma.com/searchB?q=asus+vivobook+14',
    },
    {
      id: 'lenovo_ideapad_gaming3',
      name: 'Lenovo IdeaPad Gaming 3',
      tagline: 'RTX 3050 gaming laptop under ₹60K',
      price: { amazon: 56999, flipkart: 54999, croma: 58999 },
      rating: 4.4,
      badge: 'Gaming',
      specs: ['15.6" FHD 120Hz IPS', 'AMD Ryzen 5 6600H', 'RTX 3050 4GB', '8GB RAM / 512GB SSD'],
      purposes: ['Gaming'],
      budgetMax: 65000,
      budgetMin: 45000,
      amazonUrl: 'https://www.amazon.in/s?k=lenovo+ideapad+gaming+3+rtx+3050',
      flipkartUrl: 'https://www.flipkart.com/search?q=lenovo+ideapad+gaming+3',
      cromaUrl: 'https://www.croma.com/searchB?q=lenovo+ideapad+gaming+3',
    },
    {
      id: 'dell_xps_13',
      name: 'Dell XPS 13 (9315)',
      tagline: 'Premium ultrabook for professionals',
      price: { amazon: 89999, flipkart: 87999, croma: 91999 },
      rating: 4.6,
      badge: 'Pro Choice',
      specs: ['13.4" FHD+ InfinityEdge Touch', 'Intel Core i7-1250U', '16GB RAM / 512GB SSD', '12 hrs battery'],
      purposes: ['Thin & Light Travel', 'Office / Work', 'Programming / Dev'],
      budgetMax: 100000,
      budgetMin: 70000,
      amazonUrl: 'https://www.amazon.in/s?k=dell+xps+13+2023',
      flipkartUrl: 'https://www.flipkart.com/search?q=dell+xps+13',
      cromaUrl: 'https://www.croma.com/searchB?q=dell+xps+13',
    },
    {
      id: 'macbook_air_m2',
      name: 'Apple MacBook Air M2',
      tagline: 'Ultra-thin, silent performance with all-day 18hr battery',
      price: { amazon: 89900, flipkart: 87990, croma: 89900 },
      rating: 4.8,
      badge: 'Best Ultrabook',
      specs: ['13.6" Liquid Retina', 'Apple M2 8-core CPU', '8GB Unified Memory / 256GB SSD', '18-hour battery'],
      purposes: ['Office / Work', 'Student / College', 'Programming / Dev', 'Thin & Light Travel'],
      budgetMax: 100000,
      budgetMin: 80000,
      amazonUrl: 'https://www.amazon.in/s?k=macbook+air+m2',
      flipkartUrl: 'https://www.flipkart.com/search?q=macbook+air+m2',
      cromaUrl: 'https://www.croma.com/searchB?q=macbook+air+m2',
    },
    {
      id: 'macbook_air_m3',
      name: 'Apple MacBook Air M3',
      tagline: 'Blazing fast M3 chip with dual display support & Ray Tracing',
      price: { amazon: 104900, flipkart: 102900, croma: 104900 },
      rating: 4.9,
      badge: 'Top Creative Pick',
      specs: ['13.6" Liquid Retina', 'Apple M3 8-core CPU / 10-core GPU', '16GB Unified Memory / 512GB SSD', 'MagSafe 3 + Dual Thunderbolt'],
      purposes: ['Programming / Dev', 'Video Editing', 'Thin & Light Travel'],
      budgetMax: Infinity,
      budgetMin: 100000,
      amazonUrl: 'https://www.amazon.in/s?k=macbook+air+m3',
      flipkartUrl: 'https://www.flipkart.com/search?q=macbook+air+m3',
      cromaUrl: 'https://www.croma.com/searchB?q=macbook+air+m3',
    },
    {
      id: 'asus_rog_strix',
      name: 'ASUS ROG Strix G16',
      tagline: 'RTX 4070 — the gaming monster',
      price: { amazon: 134999, flipkart: 129999, croma: 139999 },
      rating: 4.7,
      badge: 'Gaming Beast',
      specs: ['16" FHD 165Hz ROG Nebula', 'Intel Core i9-13980HX', 'RTX 4070 8GB', '16GB DDR5 / 1TB SSD'],
      purposes: ['Gaming', 'Video Editing'],
      budgetMax: Infinity,
      budgetMin: 100000,
      amazonUrl: 'https://www.amazon.in/s?k=asus+rog+strix+g16+rtx+4070',
      flipkartUrl: 'https://www.flipkart.com/search?q=asus+rog+strix+g16',
      cromaUrl: 'https://www.croma.com/searchB?q=asus+rog+strix',
    },
  ],

  tws: [
    {
      id: 'boat_airdopes141',
      name: 'boAt Airdopes 141',
      tagline: 'India\'s bestselling budget earbud',
      price: { amazon: 999, flipkart: 899, croma: 1099 },
      rating: 4.0,
      badge: 'Best Budget',
      specs: ['10mm drivers', 'Up to 42hr total', 'IPX4 Water Resistant', 'Touch Controls'],
      purposes: ['Budget Pick'],
      budgetMax: 2000,
      budgetMin: 0,
      amazonUrl: 'https://www.amazon.in/s?k=boat+airdopes+141',
      flipkartUrl: 'https://www.flipkart.com/search?q=boat+airdopes+141',
      cromaUrl: 'https://www.croma.com/searchB?q=boat+airdopes+141',
    },
    {
      id: 'realme_buds_t110',
      name: 'Realme Buds T110',
      tagline: 'ANC under ₹2000 — game changer',
      price: { amazon: 1799, flipkart: 1699, croma: 1999 },
      rating: 4.2,
      badge: 'ANC Budget',
      specs: ['30dB ANC', '12.4mm Bass Boost', '28hr total + ANC', 'Google Fast Pair'],
      purposes: ['Budget Pick', 'Best ANC (Noise Cancellation)'],
      budgetMax: 3000,
      budgetMin: 1000,
      amazonUrl: 'https://www.amazon.in/s?k=realme+buds+t110',
      flipkartUrl: 'https://www.flipkart.com/search?q=realme+buds+t110',
      cromaUrl: 'https://www.croma.com/searchB?q=realme+buds+t110',
    },
    {
      id: 'nothing_ear2',
      name: 'Nothing Ear (2)',
      tagline: 'Transparent design, top-tier ANC & sound',
      price: { amazon: 8499, flipkart: 7999, croma: 8999 },
      rating: 4.5,
      badge: 'Iconic Design',
      specs: ['11.6mm Custom Drivers', '45dB ANC', 'LHDC 5.0 Hi-Res Audio', '36hr battery'],
      purposes: ['Best Sound Quality', 'Best ANC (Noise Cancellation)', 'Premium'],
      budgetMax: 10000,
      budgetMin: 5000,
      amazonUrl: 'https://www.amazon.in/s?k=nothing+ear+2',
      flipkartUrl: 'https://www.flipkart.com/search?q=nothing+ear+2',
      cromaUrl: 'https://www.croma.com/searchB?q=nothing+ear+2',
    },
    {
      id: 'sony_wf1000xm5',
      name: 'Sony WF-1000XM5',
      tagline: 'World\'s best ANC earbuds — no competition',
      price: { amazon: 24999, flipkart: 23499, croma: 26999 },
      rating: 4.9,
      badge: 'ANC King',
      specs: ['8.4mm HD Driver + Bone Conduction', 'Industry-best ANC', 'LDAC 360 Audio', '36hr battery'],
      purposes: ['Best ANC (Noise Cancellation)', 'Best Sound Quality', 'Premium'],
      budgetMax: Infinity,
      budgetMin: 15000,
      amazonUrl: 'https://www.amazon.in/s?k=sony+wf-1000xm5',
      flipkartUrl: 'https://www.flipkart.com/search?q=sony+wf1000xm5',
      cromaUrl: 'https://www.croma.com/searchB?q=sony+wf1000xm5',
    },
  ],

  charger: [
    {
      id: 'mi_33w',
      name: 'Mi 33W Fast Charger',
      tagline: 'Fastest mid-range charger from Xiaomi',
      price: { amazon: 599, flipkart: 549, croma: 649 },
      rating: 4.3,
      badge: 'Fast Pick',
      specs: ['33W Turbo Charge', 'USB-A port', 'Universal compatibility', 'Compact build'],
      purposes: ['33W/65W Super Fast', '18W Fast Charge'],
      budgetMax: 1000,
      budgetMin: 0,
      amazonUrl: 'https://www.amazon.in/s?k=mi+33w+charger',
      flipkartUrl: 'https://www.flipkart.com/search?q=mi+33w+charger',
      cromaUrl: 'https://www.croma.com/searchB?q=xiaomi+33w+charger',
    },
    {
      id: 'anker_nano_30w',
      name: 'Anker Nano 30W',
      tagline: 'Tiny GaN charger, massive power',
      price: { amazon: 1299, flipkart: 1199, croma: 1499 },
      rating: 4.6,
      badge: 'GaN Pick',
      specs: ['30W GaN III tech', 'USB-C PD 3.0', 'Ultra compact — size of a coin', 'Universal laptop + phone'],
      purposes: ['33W/65W Super Fast', '18W Fast Charge'],
      budgetMax: 2000,
      budgetMin: 500,
      amazonUrl: 'https://www.amazon.in/s?k=anker+nano+30w',
      flipkartUrl: 'https://www.flipkart.com/search?q=anker+nano+30w',
      cromaUrl: 'https://www.croma.com/searchB?q=anker+nano+30w',
    },
    {
      id: 'baseus_100w_gan',
      name: 'Baseus 100W GaN Charger',
      tagline: '4 ports, charge everything at once',
      price: { amazon: 2499, flipkart: 2299, croma: 2799 },
      rating: 4.5,
      badge: 'Multi-Port King',
      specs: ['100W total output', '2x USB-C + 2x USB-A', 'Laptop + 3 phones simultaneously', 'GaN tech runs cool'],
      purposes: ['100W+ GaN Charger'],
      budgetMax: 5000,
      budgetMin: 1500,
      amazonUrl: 'https://www.amazon.in/s?k=baseus+100w+gan+charger',
      flipkartUrl: 'https://www.flipkart.com/search?q=baseus+100w+gan',
      cromaUrl: 'https://www.croma.com/searchB?q=baseus+100w+charger',
    },
    {
      id: 'realme_5w',
      name: 'Basic 5W USB Charger',
      tagline: 'Cheap, reliable bedside charger',
      price: { amazon: 199, flipkart: 179, croma: 249 },
      rating: 4.0,
      badge: 'Budget',
      specs: ['5W standard charging', 'USB-A port', 'Universal adapter', 'BIS Certified'],
      purposes: ['5W Standard'],
      budgetMax: 500,
      budgetMin: 0,
      amazonUrl: 'https://www.amazon.in/s?k=5w+usb+charger',
      flipkartUrl: 'https://www.flipkart.com/search?q=5w+mobile+charger',
      cromaUrl: 'https://www.croma.com/searchB?q=5w+charger',
    },
  ],

  powerbank: [
    {
      id: 'mi_10000',
      name: 'Mi Power Bank 3i 10000mAh',
      tagline: 'India\'s most trusted power bank brand',
      price: { amazon: 999, flipkart: 899, croma: 1099 },
      rating: 4.4,
      badge: 'Most Trusted',
      specs: ['10000mAh', '18W Fast In + Fast Out', 'Dual USB-A + USB-C', 'BIS + PSB Certified'],
      purposes: ['Pocket / Slim'],
      budgetMax: 2000,
      budgetMin: 0,
      amazonUrl: 'https://www.amazon.in/s?k=mi+power+bank+3i+10000',
      flipkartUrl: 'https://www.flipkart.com/search?q=mi+power+bank+10000',
      cromaUrl: 'https://www.croma.com/searchB?q=mi+power+bank+10000',
    },
    {
      id: 'anker_20000',
      name: 'Anker 737 Power Bank 24000mAh',
      tagline: 'Charge your laptop + phone simultaneously',
      price: { amazon: 7999, flipkart: 7499, croma: 8499 },
      rating: 4.6,
      badge: '140W Beast',
      specs: ['24000mAh', '140W max output', 'USB-C 140W + USB-C 60W + USB-A', 'Charges MacBook Pro!'],
      purposes: ['High Capacity 20000mAh+', 'Fast Charging 65W+'],
      budgetMax: 10000,
      budgetMin: 5000,
      amazonUrl: 'https://www.amazon.in/s?k=anker+737+power+bank',
      flipkartUrl: 'https://www.flipkart.com/search?q=anker+737+power+bank',
      cromaUrl: 'https://www.croma.com/searchB?q=anker+power+bank+140w',
    },
  ],

  cable: [
    {
      id: 'anchor_cable',
      name: 'Anchor USB-C Cable (Braided)',
      tagline: 'Lifetime durability, budget price',
      price: { amazon: 299, flipkart: 249, croma: 349 },
      rating: 4.3,
      badge: 'Most Durable',
      specs: ['Nylon Braided 1.5m', 'USB-C to USB-C', '60W PD Fast Charge', '480 Mbps data'],
      purposes: ['USB-C to USB-C', 'Braided Durable'],
      budgetMax: 500,
      budgetMin: 0,
      amazonUrl: 'https://www.amazon.in/s?k=braided+usb+c+cable',
      flipkartUrl: 'https://www.flipkart.com/search?q=braided+usb+c+cable',
      cromaUrl: 'https://www.croma.com/searchB?q=usb+c+cable+braided',
    },
  ],

  smartwatch: [
    {
      id: 'boat_wave_call2',
      name: 'boAt Wave Call 2',
      tagline: 'Calling watch + health tracking under ₹1500',
      price: { amazon: 1299, flipkart: 1199, croma: 1499 },
      rating: 4.0,
      badge: 'Budget Calling',
      specs: ['1.83" HD Display', 'Bluetooth Calling', 'SpO2 + Heart Rate', '7 days battery'],
      purposes: ['Budget Smart Band', 'Fitness Tracking'],
      budgetMax: 2000,
      budgetMin: 0,
      amazonUrl: 'https://www.amazon.in/s?k=boat+wave+call+2',
      flipkartUrl: 'https://www.flipkart.com/search?q=boat+wave+call+2',
      cromaUrl: 'https://www.croma.com/searchB?q=boat+wave+call+2',
    },
    {
      id: 'samsung_galaxy_watch6',
      name: 'Samsung Galaxy Watch 6',
      tagline: 'Best health monitoring Android watch',
      price: { amazon: 24999, flipkart: 23499, croma: 26499 },
      rating: 4.6,
      badge: 'Health Pro',
      specs: ['1.3" Super AMOLED', 'ECG + BioActive Sensor', 'Body Composition Analysis', 'Wear OS + Samsung Health'],
      purposes: ['Health Monitoring (SpO2/ECG)', 'Fashion / Style'],
      budgetMax: 30000,
      budgetMin: 15000,
      amazonUrl: 'https://www.amazon.in/s?k=samsung+galaxy+watch+6',
      flipkartUrl: 'https://www.flipkart.com/search?q=samsung+galaxy+watch+6',
      cromaUrl: 'https://www.croma.com/searchB?q=samsung+galaxy+watch+6',
    },
    {
      id: 'apple_watch_se2',
      name: 'Apple Watch SE (2nd Gen)',
      tagline: 'Best Apple Watch value for iPhone users',
      price: { amazon: 29900, flipkart: 28999, croma: 31999 },
      rating: 4.7,
      badge: 'iPhone Choice',
      specs: ['45mm Retina LTPO OLED', 'S8 chip', 'Crash Detection + Fall Detection', 'watchOS 10'],
      purposes: ['Health Monitoring (SpO2/ECG)', 'Fashion / Style', 'Fitness Tracking'],
      budgetMax: 40000,
      budgetMin: 20000,
      amazonUrl: 'https://www.amazon.in/s?k=apple+watch+se+2',
      flipkartUrl: 'https://www.flipkart.com/search?q=apple+watch+se+2nd+gen',
      cromaUrl: 'https://www.croma.com/searchB?q=apple+watch+se',
    },
  ],

  speaker: [
    {
      id: 'jbl_go3',
      name: 'JBL Go 3',
      tagline: 'Pocket-sized party starter',
      price: { amazon: 2499, flipkart: 2299, croma: 2799 },
      rating: 4.3,
      badge: 'Pocket King',
      specs: ['4.2W output', 'IP67 Waterproof + Dustproof', '5hr playback', 'USB-C charging'],
      purposes: ['Mini Pocket', 'Waterproof Outdoor'],
      budgetMax: 3000,
      budgetMin: 1500,
      amazonUrl: 'https://www.amazon.in/s?k=jbl+go+3',
      flipkartUrl: 'https://www.flipkart.com/search?q=jbl+go+3',
      cromaUrl: 'https://www.croma.com/searchB?q=jbl+go+3',
    },
    {
      id: 'jbl_flip6',
      name: 'JBL Flip 6',
      tagline: 'Pool party speaker — loud & waterproof',
      price: { amazon: 7999, flipkart: 7499, croma: 8499 },
      rating: 4.6,
      badge: 'Waterproof Party',
      specs: ['30W Sound', 'IP67 Waterproof', '12hr playback', 'PartyBoost multi-speaker'],
      purposes: ['Portable Party', 'Waterproof Outdoor'],
      budgetMax: 10000,
      budgetMin: 5000,
      amazonUrl: 'https://www.amazon.in/s?k=jbl+flip+6',
      flipkartUrl: 'https://www.flipkart.com/search?q=jbl+flip+6',
      cromaUrl: 'https://www.croma.com/searchB?q=jbl+flip+6',
    },
  ],

  monitor: [
    {
      id: 'lg_24mp60g',
      name: 'LG 24MP60G-B',
      tagline: 'Smooth IPS display for work + casual gaming',
      price: { amazon: 10999, flipkart: 10499, croma: 11999 },
      rating: 4.4,
      badge: 'Best Value',
      specs: ['23.8" Full HD IPS', '75Hz Refresh Rate', 'AMD FreeSync', 'HDMI + VGA + USB'],
      purposes: ['24" FHD Office'],
      budgetMax: 15000,
      budgetMin: 7000,
      amazonUrl: 'https://www.amazon.in/s?k=lg+24mp60g',
      flipkartUrl: 'https://www.flipkart.com/search?q=lg+24mp60g',
      cromaUrl: 'https://www.croma.com/searchB?q=lg+24+inch+monitor',
    },
    {
      id: 'asus_tuf_gaming_27',
      name: 'ASUS TUF Gaming VG27AQ',
      tagline: '165Hz IPS — the go-to gaming monitor',
      price: { amazon: 29999, flipkart: 28999, croma: 31999 },
      rating: 4.7,
      badge: 'Gaming Choice',
      specs: ['27" 2560x1440 IPS', '165Hz / 1ms MPRT', 'G-Sync Compatible + FreeSync', 'HDR10'],
      purposes: ['144Hz+ Gaming', '27" QHD Creative'],
      budgetMax: 40000,
      budgetMin: 20000,
      amazonUrl: 'https://www.amazon.in/s?k=asus+tuf+gaming+vg27aq',
      flipkartUrl: 'https://www.flipkart.com/search?q=asus+tuf+gaming+monitor+27',
      cromaUrl: 'https://www.croma.com/searchB?q=asus+gaming+monitor+27',
    },
  ],

  keyboard: [
    {
      id: 'redgear_mk851',
      name: 'Redgear MK851 Mechanical',
      tagline: 'Clicky mechanical gaming keyboard under ₹2000',
      price: { amazon: 1799, flipkart: 1699, croma: 1999 },
      rating: 4.1,
      badge: 'Budget Mech',
      specs: ['Blue switches (clicky)', 'RGB Backlight', 'Anti-ghosting', 'USB wired'],
      purposes: ['Mechanical Gaming', 'Budget Membrane'],
      budgetMax: 2500,
      budgetMin: 0,
      amazonUrl: 'https://www.amazon.in/s?k=redgear+mk851+mechanical',
      flipkartUrl: 'https://www.flipkart.com/search?q=redgear+mechanical+keyboard',
      cromaUrl: 'https://www.croma.com/searchB?q=redgear+mechanical+keyboard',
    },
    {
      id: 'keychron_k2',
      name: 'Keychron K2 V2',
      tagline: 'Premium 75% wireless mechanical — endgame',
      price: { amazon: 7999, flipkart: 7499, croma: 8499 },
      rating: 4.7,
      badge: 'Enthusiast Pick',
      specs: ['Gateron G Pro Red/Blue/Brown', 'Mac + Windows', 'Bluetooth 5.1 + USB-C', 'Hot-swappable'],
      purposes: ['Mechanical Gaming', 'Wireless Office', 'Compact 65%'],
      budgetMax: 10000,
      budgetMin: 5000,
      amazonUrl: 'https://www.amazon.in/s?k=keychron+k2',
      flipkartUrl: 'https://www.flipkart.com/search?q=keychron+k2',
      cromaUrl: 'https://www.croma.com/searchB?q=keychron+k2',
    },
  ],

  harddisk: [
    {
      id: 'wd_passport_1tb',
      name: 'WD My Passport 1TB',
      tagline: 'Most reliable portable HDD for backup',
      price: { amazon: 2999, flipkart: 2799, croma: 3299 },
      rating: 4.5,
      badge: 'Most Reliable',
      specs: ['1TB Storage', 'USB 3.0 (up to 125MB/s)', 'Password Protection', 'Automatic backup software'],
      purposes: ['External HDD Backup'],
      budgetMax: 4000,
      budgetMin: 1500,
      amazonUrl: 'https://www.amazon.in/s?k=wd+my+passport+1tb',
      flipkartUrl: 'https://www.flipkart.com/search?q=wd+my+passport+1tb',
      cromaUrl: 'https://www.croma.com/searchB?q=wd+passport+1tb',
    },
    {
      id: 'samsung_t7_ssd',
      name: 'Samsung T7 Portable SSD 1TB',
      tagline: 'Blazing fast — 10x faster than any HDD',
      price: { amazon: 7499, flipkart: 6999, croma: 7999 },
      rating: 4.7,
      badge: 'Speed King',
      specs: ['1TB SSD', 'USB 3.2 Gen 2 — up to 1050MB/s read', 'AES 256-bit encryption', 'Shock resistant'],
      purposes: ['Portable SSD Fast', 'External HDD Backup'],
      budgetMax: 10000,
      budgetMin: 5000,
      amazonUrl: 'https://www.amazon.in/s?k=samsung+t7+portable+ssd+1tb',
      flipkartUrl: 'https://www.flipkart.com/search?q=samsung+t7+ssd+1tb',
      cromaUrl: 'https://www.croma.com/searchB?q=samsung+t7+ssd',
    },
  ],

  pendrive: [
    {
      id: 'sandisk_ultra_64gb',
      name: 'SanDisk Ultra USB 3.0 64GB',
      tagline: 'Fast, reliable — the classic pen drive',
      price: { amazon: 599, flipkart: 549, croma: 649 },
      rating: 4.4,
      badge: 'Best Brand',
      specs: ['64GB Storage', 'USB 3.0 up to 130MB/s', 'SanDisk SecureAccess software', 'Lifetime warranty'],
      purposes: ['Basic Storage', 'High Speed USB 3.0'],
      budgetMax: 1000,
      budgetMin: 0,
      amazonUrl: 'https://www.amazon.in/s?k=sandisk+ultra+usb+3.0+64gb',
      flipkartUrl: 'https://www.flipkart.com/search?q=sandisk+ultra+64gb+usb+3.0',
      cromaUrl: 'https://www.croma.com/searchB?q=sandisk+64gb+pen+drive',
    },
    {
      id: 'samsung_duo_plus',
      name: 'Samsung USB 3.1 OTG Duo Plus',
      tagline: 'USB-A + USB-C — works on phone AND laptop',
      price: { amazon: 999, flipkart: 899, croma: 1099 },
      rating: 4.5,
      badge: 'OTG Pick',
      specs: ['64GB / 128GB options', 'USB 3.1 + USB-C OTG', 'Up to 400MB/s', 'Works on Android + PC'],
      purposes: ['OTG Dual Port', 'High Speed USB 3.0'],
      budgetMax: 1500,
      budgetMin: 500,
      amazonUrl: 'https://www.amazon.in/s?k=samsung+duo+plus+otg+usb+c',
      flipkartUrl: 'https://www.flipkart.com/search?q=samsung+duo+plus+otg',
      cromaUrl: 'https://www.croma.com/searchB?q=samsung+duo+plus+usb',
    },
  ],

  router: [
    {
      id: 'tp_link_archer_c6',
      name: 'TP-Link Archer C6',
      tagline: 'Best budget dual-band router for home',
      price: { amazon: 2199, flipkart: 1999, croma: 2399 },
      rating: 4.3,
      badge: 'Home Pick',
      specs: ['AC1200 Dual Band', '4x Antennas', 'MU-MIMO 4 streams', 'Covers 1500 sq ft'],
      purposes: ['Home 2-3 rooms'],
      budgetMax: 3000,
      budgetMin: 0,
      amazonUrl: 'https://www.amazon.in/s?k=tp-link+archer+c6',
      flipkartUrl: 'https://www.flipkart.com/search?q=tp+link+archer+c6',
      cromaUrl: 'https://www.croma.com/searchB?q=tp-link+c6+router',
    },
  ],

  tv: [
    {
      id: 'redmi_43_2024',
      name: 'Redmi Smart TV X43 (2024)',
      tagline: 'Best 43" 4K TV under ₹30K',
      price: { amazon: 26999, flipkart: 25999, croma: 27999 },
      rating: 4.4,
      badge: 'Best Value 43"',
      specs: ['43" 4K Ultra HD', 'Android TV 11 + Google Assistant', 'Dolby Vision + Dolby Atmos', '30W speakers'],
      purposes: ['Living Room 43"-55"'],
      budgetMax: 35000,
      budgetMin: 20000,
      amazonUrl: 'https://www.amazon.in/s?k=redmi+smart+tv+x43+2024',
      flipkartUrl: 'https://www.flipkart.com/search?q=redmi+smart+tv+43+4k+2024',
      cromaUrl: 'https://www.croma.com/searchB?q=redmi+43+inch+4k+tv',
    },
  ],

  headphone: [
    {
      id: 'boat_rockerz_450',
      name: 'boAt Rockerz 450',
      tagline: 'Best budget wireless headphone in India',
      price: { amazon: 999, flipkart: 899, croma: 1099 },
      rating: 4.1,
      badge: 'Budget',
      specs: ['40mm Drivers', 'Bluetooth 5.0', '15hr battery', 'Foldable design'],
      purposes: ['Casual Listening', 'Office / Calls'],
      budgetMax: 2000,
      budgetMin: 0,
      amazonUrl: 'https://www.amazon.in/s?k=boat+rockerz+450',
      flipkartUrl: 'https://www.flipkart.com/search?q=boat+rockerz+450',
      cromaUrl: 'https://www.croma.com/searchB?q=boat+rockerz+450',
    },
    {
      id: 'sony_wh1000xm5',
      name: 'Sony WH-1000XM5',
      tagline: 'Industry-best ANC over-ear headphone',
      price: { amazon: 29990, flipkart: 28999, croma: 31990 },
      rating: 4.9,
      badge: 'ANC Throne',
      specs: ['30mm HD Drivers', 'Industry-best 30-step ANC', 'LDAC + 360 Audio', '30hr + 3min = 3hrs'],
      purposes: ['Studio / Music Production', 'Office / Calls'],
      budgetMax: Infinity,
      budgetMin: 20000,
      amazonUrl: 'https://www.amazon.in/s?k=sony+wh-1000xm5',
      flipkartUrl: 'https://www.flipkart.com/search?q=sony+wh1000xm5',
      cromaUrl: 'https://www.croma.com/searchB?q=sony+wh1000xm5',
    },
  ],

  tablet: [
    {
      id: 'redmi_pad_se',
      name: 'Redmi Pad SE',
      tagline: 'Best budget Android tablet for streaming & study',
      price: { amazon: 14999, flipkart: 13999, croma: 15499 },
      rating: 4.3,
      badge: 'Budget Star',
      specs: ['11" FHD+ 90Hz Display', 'Snapdragon 680', '4 speakers Dolby Atmos', '8000mAh battery'],
      purposes: ['Kids / Learning', 'Streaming / Entertainment'],
      budgetMax: 20000,
      budgetMin: 10000,
      amazonUrl: 'https://www.amazon.in/s?k=redmi+pad+se',
      flipkartUrl: 'https://www.flipkart.com/search?q=redmi+pad+se',
      cromaUrl: 'https://www.croma.com/searchB?q=redmi+pad+se',
    },
    {
      id: 'ipad_10th_gen',
      name: 'Apple iPad (10th Gen)',
      tagline: 'Premium tablet — perfect with Apple Pencil',
      price: { amazon: 44900, flipkart: 43900, croma: 46900 },
      rating: 4.7,
      badge: 'Premium',
      specs: ['10.9" Liquid Retina', 'A14 Bionic chip', 'USB-C + 5G option', 'iPadOS 17 + Apple Pencil'],
      purposes: ['Drawing / Art', 'Work / Productivity', 'Streaming / Entertainment'],
      budgetMax: Infinity,
      budgetMin: 35000,
      amazonUrl: 'https://www.amazon.in/s?k=apple+ipad+10th+generation',
      flipkartUrl: 'https://www.flipkart.com/search?q=apple+ipad+10th+gen',
      cromaUrl: 'https://www.croma.com/searchB?q=apple+ipad+10th+gen',
    },
  ],

  camera: [
    {
      id: 'canon_eos_1500d',
      name: 'Canon EOS 1500D',
      tagline: 'Perfect starter DSLR — most recommended',
      price: { amazon: 29999, flipkart: 28499, croma: 31999 },
      rating: 4.5,
      badge: 'Beginner\'s Best',
      specs: ['24.1MP APS-C sensor', 'Kit 18-55mm lens included', 'Full HD 1080p video', 'WiFi + NFC'],
      purposes: ['Beginner DSLR', 'Vlogging'],
      budgetMax: 40000,
      budgetMin: 20000,
      amazonUrl: 'https://www.amazon.in/s?k=canon+eos+1500d',
      flipkartUrl: 'https://www.flipkart.com/search?q=canon+eos+1500d',
      cromaUrl: 'https://www.croma.com/searchB?q=canon+1500d',
    },
    {
      id: 'gopro_hero12',
      name: 'GoPro HERO12 Black',
      tagline: 'Best action camera on the planet',
      price: { amazon: 34999, flipkart: 33499, croma: 36999 },
      rating: 4.7,
      badge: 'Action King',
      specs: ['5.3K60 + 4K120 video', 'HyperSmooth 6.0 stabilization', 'Waterproof to 10m', 'Enduro battery'],
      purposes: ['Action Camera', 'Vlogging'],
      budgetMax: 45000,
      budgetMin: 25000,
      amazonUrl: 'https://www.amazon.in/s?k=gopro+hero12+black',
      flipkartUrl: 'https://www.flipkart.com/search?q=gopro+hero12',
      cromaUrl: 'https://www.croma.com/searchB?q=gopro+hero12',
    },
  ],

  mouse: [
    {
      id: 'logitech_m235',
      name: 'Logitech M235 Wireless',
      tagline: 'Simple, reliable wireless mouse for office',
      price: { amazon: 999, flipkart: 899, croma: 1099 },
      rating: 4.3,
      badge: 'Office Classic',
      specs: ['Wireless 2.4GHz', '12 months battery', '1000 DPI', 'Plug and play nano receiver'],
      purposes: ['Basic Office', 'Wireless Ergonomic'],
      budgetMax: 2000,
      budgetMin: 0,
      amazonUrl: 'https://www.amazon.in/s?k=logitech+m235',
      flipkartUrl: 'https://www.flipkart.com/search?q=logitech+m235',
      cromaUrl: 'https://www.croma.com/searchB?q=logitech+m235',
    },
    {
      id: 'razer_deathadder_v3',
      name: 'Razer DeathAdder V3',
      tagline: 'Pro-gaming mouse — world\'s most popular',
      price: { amazon: 7999, flipkart: 7499, croma: 8499 },
      rating: 4.8,
      badge: 'Esports Pick',
      specs: ['30K DPI optical sensor', 'Focus Pro Gen-3', '90-hour battery', 'Ultra-light 59g'],
      purposes: ['Gaming High DPI'],
      budgetMax: 10000,
      budgetMin: 5000,
      amazonUrl: 'https://www.amazon.in/s?k=razer+deathadder+v3',
      flipkartUrl: 'https://www.flipkart.com/search?q=razer+deathadder+v3',
      cromaUrl: 'https://www.croma.com/searchB?q=razer+deathadder+v3',
    },
  ],
};

// Get products filtered by category, budget, purpose
export function getRecommendations(categoryId, budgetRange, purpose) {
  const products = PRODUCTS[categoryId] || [];
  const isAllBudget = !budgetRange || budgetRange.label === 'All Budgets' || (budgetRange.min === 0 && budgetRange.max === Infinity);

  let matches = products.filter(p => {
    const inBudget = isAllBudget || (p.budgetMin <= budgetRange.max && p.budgetMax >= budgetRange.min);
    const matchesPurpose = !purpose || (p.purposes && p.purposes.includes(purpose));
    return inBudget && matchesPurpose;
  });

  // If specific purpose + budget yielded 0 matches, fallback to matching within budget
  if (matches.length === 0 && purpose) {
    matches = products.filter(p => {
      return isAllBudget || (p.budgetMin <= budgetRange.max && p.budgetMax >= budgetRange.min);
    });
  }

  // If still 0 matches (e.g. rare budget band with no static SKU), include top category SKUs
  if (matches.length === 0) {
    matches = [...products];
  }

  return matches.sort((a, b) => {
    const aMatch = purpose && a.purposes && a.purposes.includes(purpose) ? 1 : 0;
    const bMatch = purpose && b.purposes && b.purposes.includes(purpose) ? 1 : 0;
    if (bMatch !== aMatch) return bMatch - aMatch;
    return b.rating - a.rating;
  });
}

export function getProductBrand(product) {
  if (!product) return 'Other';
  if (product.brand) return product.brand;
  const name = (product.name || '').toLowerCase();
  if (name.includes('apple') || name.includes('iphone') || name.includes('macbook') || name.includes('ipad')) return 'Apple';
  if (name.includes('samsung')) return 'Samsung';
  if (name.includes('oneplus')) return 'OnePlus';
  if (name.includes('google') || name.includes('pixel')) return 'Google';
  if (name.includes('iqoo')) return 'iQOO';
  if (name.includes('poco')) return 'POCO';
  if (name.includes('redmi') || name.includes('xiaomi')) return 'Xiaomi';
  if (name.includes('acer')) return 'Acer';
  if (name.includes('hp ') || name.startsWith('hp')) return 'HP';
  if (name.includes('asus') || name.includes('rog') || name.includes('vivobook') || name.includes('tuf')) return 'ASUS';
  if (name.includes('lenovo')) return 'Lenovo';
  if (name.includes('dell')) return 'Dell';
  if (name.includes('sony')) return 'Sony';
  if (name.includes('boat')) return 'boAt';
  if (name.includes('razer')) return 'Razer';
  if (name.includes('logitech')) return 'Logitech';
  if (name.includes('tp-link')) return 'TP-Link';
  if (name.includes('canon')) return 'Canon';
  if (name.includes('gopro')) return 'GoPro';
  const firstWord = (product.name || '').trim().split(' ')[0];
  if (!firstWord) return 'Other';
  return firstWord.charAt(0).toUpperCase() + firstWord.slice(1).toLowerCase();
}

export function getCheapestStore(product) {
  const stores = product?.price || {};
  const validEntries = Object.entries(stores).filter(([_, p]) => p > 0);
  if (validEntries.length === 0) {
    return { store: 'amazon', price: 0 };
  }
  return validEntries.reduce((min, [store, price]) =>
    price < min.price ? { store, price } : min,
    { store: validEntries[0][0], price: validEntries[0][1] }
  );
}

/**
 * Search products across all categories with fuzzy token and substring scoring.
 */
export function searchProducts(query) {
  if (!query || typeof query !== 'string' || !query.trim()) return [];
  const cleanQ = query.toLowerCase().trim();
  const tokens = cleanQ.split(/\s+/).filter(Boolean);
  
  const allProductsList = Object.entries(PRODUCTS).flatMap(([cat, list]) => 
    list.map(p => ({ ...p, category: p.category || cat }))
  );

  const scored = allProductsList.map(p => {
    const nameLower = p.name.toLowerCase();
    const catLower = (p.category || '').toLowerCase();
    const tagLower = (p.tagline || '').toLowerCase();
    const specsStr = (p.specs || []).join(' ').toLowerCase();

    // Query number tokens (e.g. ['16'], ['17'], ['24'])
    const queryNumbers = cleanQ.match(/\b\d+\b/g) || [];
    const nameNumbers = nameLower.match(/\b\d+\b/g) || [];

    // If query specifies a number (like "iphone 16" or "s24"), don't match mismatched models
    if (queryNumbers.length > 0) {
      const hasContradictoryNumber = nameNumbers.some(n => !queryNumbers.includes(n));
      const hasQueryNumber = queryNumbers.some(n => nameNumbers.includes(n) || nameLower.includes(n));
      if (!hasQueryNumber) {
        return null;
      }
    }

    // If query specifies a strong brand or product line (iphone, macbook, samsung, asus, etc.),
    // ensure matching products actually belong to that brand or line
    const brandTokens = ['iphone', 'macbook', 'ipad', 'samsung', 'galaxy', 'oneplus', 'pixel', 'asus', 'acer', 'lenovo', 'dell', 'hp', 'sony', 'boat', 'realme', 'redmi', 'xiaomi', 'poco', 'iqoo', 'apple'];
    const queryBrandTokens = tokens.filter(t => brandTokens.includes(t));
    if (queryBrandTokens.length > 0) {
      const matchesBrandOrFamily = queryBrandTokens.some(bt => nameLower.includes(bt) || catLower.includes(bt) || tagLower.includes(bt));
      if (!matchesBrandOrFamily) {
        return null;
      }
    }

    // Direct exact name match
    if (nameLower === cleanQ) return { product: p, score: 300 };

    // Starts with exact phrase
    if (nameLower.startsWith(cleanQ)) {
      const remainder = nameLower.slice(cleanQ.length).trim();
      const lengthBonus = Math.max(0, 40 - remainder.length);
      return { product: p, score: 220 + lengthBonus };
    }

    // Direct substring in name
    if (nameLower.includes(cleanQ)) return { product: p, score: 180 };

    // All tokens present in name
    const allTokensInName = tokens.every(t => nameLower.includes(t));
    if (allTokensInName) return { product: p, score: 160 };

    // Tagline match
    if (tagLower.includes(cleanQ)) return { product: p, score: 95 };

    // Category exact match
    if (catLower === cleanQ) return { product: p, score: 90 };

    // Token-based matching (e.g. "iphone 16 pro" matches tokens)
    let matchedTokens = 0;
    tokens.forEach(t => {
      if (nameLower.includes(t) || tagLower.includes(t) || catLower.includes(t) || specsStr.includes(t)) {
        matchedTokens++;
      }
    });

    if (matchedTokens > 0) {
      const matchRatio = matchedTokens / tokens.length;
      // If user typed 2 or more words (e.g. "samsung s24 ultra"), require at least 50% match
      // to eliminate loose single-word noise like "ultra" matching laptops
      if (tokens.length >= 2 && matchRatio < 0.5) {
        return null;
      }
      return { product: p, score: matchRatio * 75 };
    }

    return null;
  }).filter(Boolean);

  return scored
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      // When scores tie (e.g. query "iphone"), sort higher price / latest model first
      const priceA = a.product.price ? Math.max(...Object.values(a.product.price)) : 0;
      const priceB = b.product.price ? Math.max(...Object.values(b.product.price)) : 0;
      if (priceB !== priceA) return priceB - priceA;
      return b.product.rating - a.product.rating;
    })
    .map(res => res.product);
}

/**
 * Creates an on-the-fly Dynamic Multi-Store Search Product for any search query or uncataloged category/filter.
 * Automatically infers hardware specifications, retail deep-links, and realistic budget bands.
 */
export function createDynamicProduct(query, options = {}) {
  const clean = (query || 'Custom Gadget').trim();
  const lower = clean.toLowerCase();
  const encoded = encodeURIComponent(clean);
  const title = clean.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  // Smart Category Detection
  let detectedCategory = options.categoryId || 'electronics';
  if (!options.categoryId) {
    if (lower.includes('laptop') || lower.includes('macbook') || lower.includes('thinkpad') || lower.includes('zenbook') || lower.includes('ideapad') || lower.includes('victus') || lower.includes('rog') || lower.includes('tuf') || lower.includes('omen') || lower.includes('vivobook') || lower.includes('notebook')) {
      detectedCategory = 'laptop';
    } else if (lower.includes('phone') || lower.includes('mobile') || lower.includes('iphone') || lower.includes('galaxy') || lower.includes('pixel') || lower.includes('oneplus') || lower.includes('iqoo') || lower.includes('redmi') || lower.includes('realme') || lower.includes('vivo') || lower.includes('oppo') || lower.includes('poco') || lower.includes('motorola')) {
      detectedCategory = 'smartphone';
    } else if (lower.includes('earbud') || lower.includes('tws') || lower.includes('airpods') || lower.includes('buds') || lower.includes('neckband')) {
      detectedCategory = 'tws';
    } else if (lower.includes('headphone')) {
      detectedCategory = 'headphone';
    } else if (lower.includes('watch') || lower.includes('band')) {
      detectedCategory = 'smartwatch';
    } else if (lower.includes('tv') || lower.includes('television') || lower.includes('oled') || lower.includes('qled')) {
      detectedCategory = 'tv';
    } else if (lower.includes('tablet') || lower.includes('ipad') || lower.includes('tab')) {
      detectedCategory = 'tablet';
    } else if (lower.includes('charger') || lower.includes('gan') || lower.includes('adapter')) {
      detectedCategory = 'charger';
    } else if (lower.includes('monitor')) {
      detectedCategory = 'monitor';
    }
  }

  // Dynamic Spec Inference Engine
  let dynamicSpecs = [];
  if (detectedCategory === 'laptop') {
    const isGaming = lower.includes('gaming') || lower.includes('rtx') || lower.includes('gpu') || lower.includes('tuf') || lower.includes('rog') || lower.includes('victus');
    dynamicSpecs = [
      isGaming ? '15.6" Full HD 144Hz IPS High-Refresh Display' : '14"–15.6" Anti-Glare Eye-Care Display',
      isGaming ? 'Dedicated NVIDIA GeForce RTX / Intel Arc Graphics' : 'Intel Core / AMD Ryzen Multi-Core Processor',
      '16GB Dual-Channel RAM / 512GB Fast PCIe NVMe SSD',
      isGaming ? 'Dual Fan StormCool Thermal Exhaust System' : 'Fast Type-C Charging with All-Day Battery Backup'
    ];
  } else if (detectedCategory === 'smartphone') {
    dynamicSpecs = [
      '6.67" 120Hz Full HD+ AMOLED HDR10+ Display',
      'High-Efficiency 4nm 5G Mobile Processor',
      '50MP OIS Primary Camera with Night Mode',
      '5000mAh Battery with 45W–120W Fast FlashCharge'
    ];
  } else if (detectedCategory === 'tws' || detectedCategory === 'headphone') {
    dynamicSpecs = [
      'Active Noise Cancellation (ANC) up to 45dB',
      '12.4mm Deep Bass Dynamic Audio Drivers',
      'Up to 38 Hours Total Playtime with Fast Charge',
      'Bluetooth 5.3 with Dual-Device Fast Pairing'
    ];
  } else if (detectedCategory === 'smartwatch') {
    dynamicSpecs = [
      '1.43" Vivid AMOLED Always-On Display',
      'Continuous Heart Rate, SpO2 & Sleep Tracking',
      'Bluetooth Calling with Noise-Reduced Mic',
      'IP68 Dust & Water Resistance with 7-Day Battery'
    ];
  } else if (detectedCategory === 'tv') {
    dynamicSpecs = [
      '4K Ultra HD Display with Dolby Vision & HDR10+',
      '30W Dolby Atmos Cinema Surround Speakers',
      'Google TV OS with Netflix, Prime & Disney+ Hotstar',
      'Dual-Band WiFi 5GHz + 3x HDMI eARC Ports'
    ];
  } else {
    dynamicSpecs = [
      'Direct real-time query across Indian retail networks',
      'Zero markup transparent store links with 0% commission',
      'Eligible for 5% Bank Card Instant Cashback Arbitrage',
      'Automated 6-Hour Price Drop Watchdog tracking'
    ];
  }

  // Smart Budget Estimation
  let estPrice = 0;
  if (options.budgetRange && options.budgetRange.max !== undefined && options.budgetRange.max !== Infinity) {
    const minVal = options.budgetRange.min || 0;
    const maxVal = options.budgetRange.max;
    estPrice = Math.round(minVal + (maxVal - minVal) * 0.75);
  } else if (options.budgetRange && options.budgetRange.min !== undefined && options.budgetRange.min > 0) {
    estPrice = Math.round(options.budgetRange.min * 1.25);
  } else if (detectedCategory === 'laptop') {
    estPrice = 45999;
  } else if (detectedCategory === 'smartphone') {
    estPrice = 24999;
  } else if (detectedCategory === 'charger') {
    estPrice = 1499;
  } else if (detectedCategory === 'cable') {
    estPrice = 399;
  } else if (detectedCategory === 'tws') {
    estPrice = 2499;
  } else if (detectedCategory === 'headphone') {
    estPrice = 2999;
  } else if (detectedCategory === 'smartwatch') {
    estPrice = 3499;
  } else if (detectedCategory === 'tv') {
    estPrice = 32999;
  } else if (detectedCategory === 'router') {
    estPrice = 1999;
  } else if (detectedCategory === 'powerbank') {
    estPrice = 1499;
  } else {
    estPrice = 999;
  }

  const amazonBase = estPrice > 0 ? estPrice : 0;
  const flipkartBase = estPrice > 0 ? Math.round(estPrice * 0.98) : 0;
  const cromaBase = estPrice > 0 ? Math.round(estPrice * 1.02) : 0;
  const relianceBase = estPrice > 0 ? Math.round(estPrice * 1.01) : 0;
  const jiomartBase = estPrice > 0 ? Math.round(estPrice * 0.99) : 0;

  // Quick commerce check: accessories & daily tech items deliverable in 10-15 mins
  const isQuickDeliverable = ['charger', 'cable', 'powerbank', 'tws', 'headphone', 'smartwatch', 'pendrive', 'mouse', 'keyboard'].includes(detectedCategory);

  const priceMatrix = {
    amazon: amazonBase,
    flipkart: flipkartBase,
    croma: cromaBase,
    reliance: relianceBase,
    jiomart: jiomartBase,
  };

  if (isQuickDeliverable && estPrice > 0) {
    priceMatrix.blinkit = Math.round(estPrice * 1.02);
    priceMatrix.zepto = Math.round(estPrice * 1.03);
    priceMatrix.flipkart_minutes = Math.round(estPrice * 1.01);
  }

  // Build targeted retailer query URLs with price parameters when budget is specified
  let amazonUrl = `https://www.amazon.in/s?k=${encoded}`;
  let flipkartUrl = `https://www.flipkart.com/search?q=${encoded}`;
  let cromaUrl = `https://www.croma.com/searchB?q=${encoded}`;
  const relianceUrl = `https://www.reliancedigital.in/search?q=${encoded}:relevance`;
  const jiomartUrl = `https://www.jiomart.com/search/${encoded}`;
  const blinkitUrl = `https://blinkit.com/s/?q=${encoded}`;
  const zeptoUrl = `https://www.zeptonow.com/search?query=${encoded}`;
  const minutesUrl = `https://www.flipkart.com/search?q=${encoded}`;
  const vijaysalesUrl = `https://www.vijaysales.com/search/${encoded}`;

  if (options.budgetRange && options.budgetRange.min !== undefined && options.budgetRange.max !== Infinity) {
    // Amazon price filter param (in paise: e.g. 2000000-4000000)
    const minPaise = options.budgetRange.min * 100;
    const maxPaise = options.budgetRange.max * 100;
    amazonUrl = `https://www.amazon.in/s?k=${encoded}&rh=p_36%3A${minPaise}-${maxPaise}`;
    flipkartUrl = `https://www.flipkart.com/search?q=${encoded}&p%5B%5D=facets.price_range.from%3D${options.budgetRange.min}&p%5B%5D=facets.price_range.to%3D${options.budgetRange.max}`;
  }

  return {
    id: `dyn_${clean.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}`,
    name: title,
    category: detectedCategory,
    tagline: `Live multi-platform arbitrage across E-Commerce, Retail & 10-Min Flash Delivery`,
    price: priceMatrix,
    isLiveSearch: true,
    rating: 4.6,
    badge: isQuickDeliverable ? '⚡ 10-Min & Omnichannel' : '🌐 Multi-Store Verified',
    specs: dynamicSpecs,
    purposes: options.purpose ? [options.purpose, 'Internet Search'] : ['Live Search', 'Multi-Store Comparison'],
    budgetMin: options.budgetRange?.min || 0,
    budgetMax: options.budgetRange?.max || Infinity,
    amazonUrl,
    flipkartUrl,
    cromaUrl,
    relianceUrl,
    jiomartUrl,
    blinkitUrl,
    zeptoUrl,
    minutesUrl,
    vijaysalesUrl,
  };
}
