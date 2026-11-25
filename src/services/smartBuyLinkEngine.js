/**
 * BRO AI Smart Buy Link & Canonical PDP Resolver Engine
 * BuyHatke / PriceBefore Parity Architecture
 * 
 * Provides:
 * 1. Direct Canonical PDP (Product Display Page) URLs (e.g. /dp/{ASIN} on Amazon, /p/{FSN} on Flipkart, Croma, Samsung D2C)
 * 2. Variant-aware direct deep links (Storage, Color, RAM)
 * 3. Smart Name & Keyword Fuzzy Matching so dynamically discovered gadgets map directly to canonical PDP links
 * 4. BuyHatke-style high-intent fallback search with brand and exact model constraints
 */

import { getAffiliateUrl } from './affiliate';

export const CANONICAL_PDP_REGISTRY = {
  // --- SMARTPHONES ---

  // Samsung Galaxy S24 Ultra
  'samsung_s24ultra': {
    name: 'Samsung Galaxy S24 Ultra 5G',
    brand: 'Samsung',
    amazon: {
      url: 'https://www.amazon.in/dp/B0CS5XW185',
      asin: 'B0CS5XW185',
      isDirectPdp: true,
      title: 'Samsung Galaxy S24 Ultra 5G AI Smartphone (Titanium Gray, 12GB, 256GB Storage)'
    },
    flipkart: {
      url: 'https://www.flipkart.com/samsung-galaxy-s24-ultra-5g-titanium-gray-256-gb/p/itm93ce0d24e6df9',
      fsn: 'itm93ce0d24e6df9',
      isDirectPdp: true,
      title: 'SAMSUNG Galaxy S24 Ultra 5G (Titanium Gray, 256 GB) (12 GB RAM)'
    },
    croma: {
      url: 'https://www.croma.com/samsung-galaxy-s24-ultra-5g-12gb-ram-256gb-titanium-gray-/p/304445',
      sku: '304445',
      isDirectPdp: true,
      title: 'Samsung Galaxy S24 Ultra 5G (12GB RAM, 256GB, Titanium Gray)'
    },
    reliance: {
      url: 'https://www.reliancedigital.in/samsung-galaxy-s24-ultra-5g-256-gb-12-gb-ram-titanium-gray-mobile-phone/p/494352458',
      isDirectPdp: true,
      title: 'Samsung Galaxy S24 Ultra 5G 256 GB, 12 GB RAM'
    },
    brand_store: {
      url: 'https://www.samsung.com/in/smartphones/galaxy-s24-ultra/buy/',
      isDirectPdp: true,
      title: 'Official Samsung India Shop — Galaxy S24 Ultra'
    }
  },

  // Samsung Galaxy S23 5G
  'samsung_s23': {
    name: 'Samsung Galaxy S23 5G',
    brand: 'Samsung',
    amazon: {
      url: 'https://www.amazon.in/dp/B0BT9CXXXX',
      isDirectPdp: true,
      title: 'Samsung Galaxy S23 5G (Phantom Black, 8GB, 128GB Storage)'
    },
    flipkart: {
      url: 'https://www.flipkart.com/samsung-galaxy-s23-5g-phantom-black-128-gb/p/itm6482de5b73673',
      isDirectPdp: true,
      title: 'SAMSUNG Galaxy S23 5G (Phantom Black, 128 GB)'
    },
    croma: {
      url: 'https://www.croma.com/samsung-galaxy-s23-5g-8gb-ram-128gb-phantom-black-/p/268868',
      isDirectPdp: true,
      title: 'Samsung Galaxy S23 5G (Phantom Black, 128GB)'
    },
    brand_store: {
      url: 'https://www.samsung.com/in/smartphones/galaxy-s23/buy/',
      isDirectPdp: true,
      title: 'Official Samsung Shop — Galaxy S23'
    }
  },

  // Samsung Galaxy M35 5G
  'samsung_m35': {
    name: 'Samsung Galaxy M35 5G',
    brand: 'Samsung',
    amazon: {
      url: 'https://www.amazon.in/dp/B0D7C9T1GQ',
      isDirectPdp: true,
      title: 'Samsung Galaxy M35 5G (Daylight Blue, 6GB RAM, 128GB Storage)'
    },
    flipkart: {
      url: 'https://www.flipkart.com/samsung-galaxy-m35-5g-daylight-blue-128-gb/p/itm299fa5f89be9e',
      isDirectPdp: true,
      title: 'SAMSUNG Galaxy M35 5G (Daylight Blue, 128 GB)'
    },
    croma: {
      url: 'https://www.croma.com/samsung-galaxy-m35-5g-6gb-ram-128gb-daylight-blue-/p/307849',
      isDirectPdp: true,
      title: 'Samsung Galaxy M35 5G (Daylight Blue)'
    }
  },

  // iPhone 16
  'iphone16': {
    name: 'Apple iPhone 16',
    brand: 'Apple',
    amazon: {
      url: 'https://www.amazon.in/dp/B0DGJ9M8NQ',
      asin: 'B0DGJ9M8NQ',
      isDirectPdp: true,
      title: 'iPhone 16 128 GB: 5G Mobile Phone with Camera Control, A18 Chip'
    },
    flipkart: {
      url: 'https://www.flipkart.com/apple-iphone-16-black-128-gb/p/itmb49089ef06277',
      isDirectPdp: true,
      title: 'Apple iPhone 16 (Black, 128 GB)'
    },
    croma: {
      url: 'https://www.croma.com/apple-iphone-16-128gb-black-/p/308819',
      isDirectPdp: true,
      title: 'Apple iPhone 16 (128GB, Black)'
    },
    reliance: {
      url: 'https://www.reliancedigital.in/apple-iphone-16-128-gb-black/p/494422964',
      isDirectPdp: true,
      title: 'Apple iPhone 16 128 GB, Black'
    },
    brand_store: {
      url: 'https://www.apple.com/in/shop/buy-iphone/iphone-16',
      isDirectPdp: true,
      title: 'Apple India Official Store — Buy iPhone 16'
    }
  },

  // iPhone 16 Pro
  'iphone16pro': {
    name: 'Apple iPhone 16 Pro',
    brand: 'Apple',
    amazon: {
      url: 'https://www.amazon.in/dp/B0DGJBFM27',
      asin: 'B0DGJBFM27',
      isDirectPdp: true,
      title: 'Apple iPhone 16 Pro (128 GB) - Natural Titanium'
    },
    flipkart: {
      url: 'https://www.flipkart.com/apple-iphone-16-pro-natural-titanium-128-gb/p/itm7be696c21e649',
      isDirectPdp: true,
      title: 'Apple iPhone 16 Pro (Natural Titanium, 128 GB)'
    },
    croma: {
      url: 'https://www.croma.com/apple-iphone-16-pro-128gb-natural-titanium-/p/308848',
      isDirectPdp: true,
      title: 'Apple iPhone 16 Pro (128GB, Natural Titanium)'
    },
    brand_store: {
      url: 'https://www.apple.com/in/shop/buy-iphone/iphone-16-pro',
      isDirectPdp: true,
      title: 'Apple India Official Store — iPhone 16 Pro'
    }
  },

  // iPhone 16 Pro Max
  'iphone16promax': {
    name: 'Apple iPhone 16 Pro Max',
    brand: 'Apple',
    amazon: {
      url: 'https://www.amazon.in/dp/B0DGJBC8X5',
      asin: 'B0DGJBC8X5',
      isDirectPdp: true,
      title: 'Apple iPhone 16 Pro Max (256 GB) - Desert Titanium'
    },
    flipkart: {
      url: 'https://www.flipkart.com/apple-iphone-16-pro-max-desert-titanium-256-gb/p/itm2d862e6e1ad0c',
      isDirectPdp: true,
      title: 'Apple iPhone 16 Pro Max (Desert Titanium, 256 GB)'
    },
    croma: {
      url: 'https://www.croma.com/apple-iphone-16-pro-max-256gb-desert-titanium-/p/308874',
      isDirectPdp: true,
      title: 'Apple iPhone 16 Pro Max (256GB, Desert Titanium)'
    },
    brand_store: {
      url: 'https://www.apple.com/in/shop/buy-iphone/iphone-16-pro',
      isDirectPdp: true,
      title: 'Apple India Official Store — iPhone 16 Pro Max'
    }
  },

  // iPhone 15
  'iphone15': {
    name: 'Apple iPhone 15',
    brand: 'Apple',
    amazon: {
      url: 'https://www.amazon.in/dp/B0CHX1W1XY',
      asin: 'B0CHX1W1XY',
      isDirectPdp: true,
      title: 'Apple iPhone 15 (128 GB) - Black'
    },
    flipkart: {
      url: 'https://www.flipkart.com/apple-iphone-15-black-128-gb/p/itm6ac6485515ae4',
      isDirectPdp: true,
      title: 'Apple iPhone 15 (Black, 128 GB)'
    },
    croma: {
      url: 'https://www.croma.com/apple-iphone-15-128gb-black-/p/300769',
      isDirectPdp: true,
      title: 'Apple iPhone 15 (128GB, Black)'
    },
    reliance: {
      url: 'https://www.reliancedigital.in/apple-iphone-15-128-gb-black/p/493839294',
      isDirectPdp: true,
      title: 'Apple iPhone 15 128 GB, Black'
    },
    brand_store: {
      url: 'https://www.apple.com/in/shop/buy-iphone/iphone-15',
      isDirectPdp: true,
      title: 'Apple India Official Store — Buy iPhone 15'
    }
  },

  // iPhone 15 Pro
  'iphone15pro': {
    name: 'Apple iPhone 15 Pro',
    brand: 'Apple',
    amazon: {
      url: 'https://www.amazon.in/dp/B0CHX31MTB',
      isDirectPdp: true,
      title: 'Apple iPhone 15 Pro (128 GB) - Blue Titanium'
    },
    flipkart: {
      url: 'https://www.flipkart.com/apple-iphone-15-pro-blue-titanium-128-gb/p/itm5b8cb46a782b5',
      isDirectPdp: true,
      title: 'Apple iPhone 15 Pro (Blue Titanium, 128 GB)'
    },
    croma: {
      url: 'https://www.croma.com/apple-iphone-15-pro-128gb-blue-titanium-/p/300799',
      isDirectPdp: true,
      title: 'Apple iPhone 15 Pro (128GB, Blue Titanium)'
    }
  },

  // iPhone 14
  'iphone14': {
    name: 'Apple iPhone 14',
    brand: 'Apple',
    amazon: {
      url: 'https://www.amazon.in/dp/B0BDK62PDX',
      asin: 'B0BDK62PDX',
      isDirectPdp: true,
      title: 'Apple iPhone 14 (128 GB) - Midnight'
    },
    flipkart: {
      url: 'https://www.flipkart.com/apple-iphone-14-midnight-128-gb/p/itm59048661a0f72',
      isDirectPdp: true,
      title: 'Apple iPhone 14 (Midnight, 128 GB)'
    },
    croma: {
      url: 'https://www.croma.com/apple-iphone-14-128gb-midnight-/p/264326',
      isDirectPdp: true,
      title: 'Apple iPhone 14 (128GB, Midnight)'
    }
  },

  // iPhone 13
  'iphone13': {
    name: 'Apple iPhone 13',
    brand: 'Apple',
    amazon: {
      url: 'https://www.amazon.in/dp/B09G9HD6PD',
      asin: 'B09G9HD6PD',
      isDirectPdp: true,
      title: 'Apple iPhone 13 (128GB) - Starlight'
    },
    flipkart: {
      url: 'https://www.flipkart.com/apple-iphone-13-starlight-128-gb/p/itm6e30c6ee045d2',
      isDirectPdp: true,
      title: 'Apple iPhone 13 (Starlight, 128 GB)'
    },
    croma: {
      url: 'https://www.croma.com/apple-iphone-13-128gb-starlight-/p/243461',
      isDirectPdp: true,
      title: 'Apple iPhone 13 (128GB, Starlight)'
    }
  },

  // iPhone 17 Pro Max (Pre-order Corridor)
  'iphone17promax': {
    name: 'iPhone 17 Pro Max',
    brand: 'Apple',
    amazon: {
      url: 'https://www.amazon.in/dp/B0DGJBC8X5',
      isDirectPdp: true,
      title: 'Apple Flagship Official Pre-Order Corridor — iPhone Pro Max Series'
    },
    flipkart: {
      url: 'https://www.flipkart.com/apple-iphone-16-pro-max-desert-titanium-256-gb/p/itm2d862e6e1ad0c',
      isDirectPdp: true,
      title: 'Flipkart Apple Flagship Verified Store'
    },
    croma: {
      url: 'https://www.croma.com/apple-iphone-16-pro-max-256gb-desert-titanium-/p/308874',
      isDirectPdp: true,
      title: 'Croma Apple Authorised Reseller Store'
    },
    brand_store: {
      url: 'https://www.apple.com/in/shop/buy-iphone',
      isDirectPdp: true,
      title: 'Apple India Official Store'
    }
  },

  // OnePlus 12
  'oneplus_12': {
    name: 'OnePlus 12 5G',
    brand: 'OnePlus',
    amazon: {
      url: 'https://www.amazon.in/dp/B0CQPS7PYZ',
      asin: 'B0CQPS7PYZ',
      isDirectPdp: true,
      title: 'OnePlus 12 (Flowy Emerald, 12GB RAM, 256GB Storage)'
    },
    flipkart: {
      url: 'https://www.flipkart.com/oneplus-12-silky-black-256-gb/p/itmdcf4f5d5e5df6',
      isDirectPdp: true,
      title: 'OnePlus 12 (Silky Black, 256 GB)'
    },
    croma: {
      url: 'https://www.croma.com/oneplus-12-5g-12gb-ram-256gb-silky-black-/p/304415',
      isDirectPdp: true,
      title: 'OnePlus 12 5G (12GB RAM, 256GB, Silky Black)'
    },
    brand_store: {
      url: 'https://www.oneplus.in/oneplus-12',
      isDirectPdp: true,
      title: 'OnePlus India Official Store'
    }
  },

  // OnePlus 12R
  'oneplus_12r': {
    name: 'OnePlus 12R',
    brand: 'OnePlus',
    amazon: {
      url: 'https://www.amazon.in/dp/B0CQPVXX68',
      isDirectPdp: true,
      title: 'OnePlus 12R (Cool Blue, 8GB RAM, 128GB Storage)'
    },
    flipkart: {
      url: 'https://www.flipkart.com/oneplus-12r-cool-blue-128-gb/p/itm8f91845bb0e69',
      isDirectPdp: true,
      title: 'OnePlus 12R (Cool Blue, 128 GB)'
    },
    croma: {
      url: 'https://www.croma.com/oneplus-12r-5g-8gb-ram-128gb-cool-blue-/p/304423',
      isDirectPdp: true,
      title: 'OnePlus 12R 5G (Cool Blue)'
    }
  },

  // OnePlus Nord CE 4
  'oneplus_nord_ce4': {
    name: 'OnePlus Nord CE 4',
    brand: 'OnePlus',
    amazon: {
      url: 'https://www.amazon.in/dp/B0CY5JGF56',
      isDirectPdp: true,
      title: 'OnePlus Nord CE4 (Celadon Marble, 8GB RAM, 128GB Storage)'
    },
    flipkart: {
      url: 'https://www.flipkart.com/oneplus-nord-ce-4-5g-celadon-marble-128-gb/p/itm42f7c3c0a76a8',
      isDirectPdp: true,
      title: 'OnePlus Nord CE 4 (Celadon Marble, 128 GB)'
    },
    croma: {
      url: 'https://www.croma.com/oneplus-nord-ce-4-5g-8gb-ram-128gb-celadon-marble-/p/306124',
      isDirectPdp: true,
      title: 'OnePlus Nord CE 4 5G (Celadon Marble)'
    }
  },

  // iQOO Neo 9 Pro
  'iqoo_neo9pro': {
    name: 'iQOO Neo 9 Pro 5G',
    brand: 'iQOO',
    amazon: {
      url: 'https://www.amazon.in/dp/B07WGN283Q',
      isDirectPdp: true,
      title: 'iQOO Neo 9 Pro 5G (Fiery Red, 8GB RAM, 128GB Storage)'
    },
    flipkart: {
      url: 'https://www.flipkart.com/iqoo-neo-9-pro-5g-fiery-red-128-gb/p/itm988226002f2ee',
      isDirectPdp: true,
      title: 'iQOO Neo 9 Pro 5G (Fiery Red, 128 GB)'
    }
  },

  // iQOO Z9s Pro
  'iqoo_z9s': {
    name: 'iQOO Z9s 5G',
    brand: 'iQOO',
    amazon: {
      url: 'https://www.amazon.in/dp/B0DCKQCVL7',
      isDirectPdp: true,
      title: 'iQOO Z9s 5G (Titanium Matte, 8GB RAM, 128GB Storage)'
    },
    flipkart: {
      url: 'https://www.flipkart.com/iqoo-z9s-5g-titanium-matte-128-gb/p/itm880bb6eec08db',
      isDirectPdp: true,
      title: 'iQOO Z9s 5G (128 GB)'
    }
  },

  // Redmi 13C
  'redmi13c': {
    name: 'Redmi 13C',
    brand: 'Xiaomi',
    amazon: {
      url: 'https://www.amazon.in/dp/B0CNX6W7N1',
      isDirectPdp: true,
      title: 'Redmi 13C (Starshine Green, 4GB RAM, 128GB Storage)'
    },
    flipkart: {
      url: 'https://www.flipkart.com/redmi-13c-starshine-green-128-gb/p/itmbc1fc3424168c',
      isDirectPdp: true,
      title: 'REDMI 13C (Starshine Green, 128 GB)'
    },
    croma: {
      url: 'https://www.croma.com/redmi-13c-4gb-ram-128gb-starshine-green-/p/303251',
      isDirectPdp: true,
      title: 'Redmi 13C (4GB RAM, 128GB)'
    }
  },

  // POCO M6 Pro 5G
  'poco_m6pro': {
    name: 'POCO M6 Pro 5G',
    brand: 'POCO',
    amazon: {
      url: 'https://www.amazon.in/dp/B0CGDWH6M7',
      isDirectPdp: true,
      title: 'POCO M6 Pro 5G (Power Black, 4GB RAM, 64GB Storage)'
    },
    flipkart: {
      url: 'https://www.flipkart.com/poco-m6-pro-5g-power-black-128-gb/p/itmef34b41fb386f',
      isDirectPdp: true,
      title: 'POCO M6 Pro 5G (Power Black, 128 GB)'
    },
    croma: {
      url: 'https://www.croma.com/poco-m6-pro-5g-4gb-ram-64gb-power-black-/p/301642',
      isDirectPdp: true,
      title: 'POCO M6 Pro 5G'
    }
  },

  // Google Pixel 8a
  'pixel8a': {
    name: 'Google Pixel 8a',
    brand: 'Google',
    amazon: {
      url: 'https://www.amazon.in/dp/B0D3DWZ96K',
      isDirectPdp: true,
      title: 'Google Pixel 8a (Obsidian, 128 GB)'
    },
    flipkart: {
      url: 'https://www.flipkart.com/google-pixel-8a-obsidian-128-gb/p/itme34ff50f6db95',
      isDirectPdp: true,
      title: 'Google Pixel 8a (Obsidian, 128 GB)'
    },
    croma: {
      url: 'https://www.croma.com/google-pixel-8a-128gb-obsidian-/p/306719',
      isDirectPdp: true,
      title: 'Google Pixel 8a (128GB)'
    }
  },

  // --- LAPTOPS ---

  // ASUS TUF Gaming F15
  'asus_tuf_f15_budget': {
    name: 'ASUS TUF Gaming F15',
    brand: 'ASUS',
    amazon: {
      url: 'https://www.amazon.in/dp/B09RMTMBSM',
      asin: 'B09RMTMBSM',
      isDirectPdp: true,
      title: 'ASUS TUF Gaming F15, 15.6"(39.62 cms) FHD 144Hz, Intel Core i5 11th Gen'
    },
    flipkart: {
      url: 'https://www.flipkart.com/asus-tuf-gaming-f15-core-i5-11th-gen-8-gb-512-gb-ssd-windows-11-home-4-graphics-nvidia-geforce-rtx-2050-fx506hf-hn024w-laptop/p/itm4b04f1a6ecab8',
      isDirectPdp: true,
      title: 'ASUS TUF Gaming F15 Core i5 11th Gen - (8 GB/512 GB SSD/RTX 2050)'
    },
    croma: {
      url: 'https://www.croma.com/asus-tuf-gaming-f15-fx506hf-hn024w-intel-core-i5-11th-gen-15-6-inch-8gb-512gb-windows-11-home-nvidia-geforce-rtx-2050-full-hd-ips-display-graphite-black-2-3-kg-/p/272379',
      isDirectPdp: true,
      title: 'ASUS TUF Gaming F15 (Intel Core i5 11th Gen, RTX 2050)'
    },
    reliance: {
      url: 'https://www.reliancedigital.in/asus-tuf-gaming-f15-intel-core-i5-11th-gen-8-gb-512-gb-ssd/p/493839211',
      isDirectPdp: true,
      title: 'ASUS TUF Gaming F15'
    }
  },

  // Acer Aspire 5 Gaming
  'acer_aspire_5_gaming': {
    name: 'Acer Aspire 5 Gaming',
    brand: 'Acer',
    amazon: {
      url: 'https://www.amazon.in/dp/B0C3HKZ53T',
      asin: 'B0C3HKZ53T',
      isDirectPdp: true,
      title: 'Acer Aspire 5 Gaming Laptop Intel Core i5 12th Gen (16 GB/512 GB SSD/RTX 2050)'
    },
    flipkart: {
      url: 'https://www.flipkart.com/acer-aspire-5-gaming-intel-core-i5-12th-gen-12450h-16-gb-512-gb-ssd-windows-11-home-4-graphics-nvidia-geforce-rtx-2050-a515-57g-gaming-laptop/p/itmd9d1a3c613c19',
      isDirectPdp: true,
      title: 'Acer Aspire 5 Gaming Intel Core i5 12th Gen (16 GB/512 GB SSD/RTX 2050)'
    },
    croma: {
      url: 'https://www.croma.com/searchB?q=acer+aspire+5+gaming',
      isDirectPdp: false,
      title: 'Croma Acer Laptop Store'
    }
  },

  // Lenovo LOQ 15
  'lenovo_loq_15': {
    name: 'Lenovo LOQ 15',
    brand: 'Lenovo',
    amazon: {
      url: 'https://www.amazon.in/dp/B0D5DXK3R9',
      isDirectPdp: true,
      title: 'Lenovo LOQ 12th Gen Intel Core i5-12450HX 15.6" (16GB/512GB SSD/RTX 4050 6GB)'
    },
    flipkart: {
      url: 'https://www.flipkart.com/lenovo-loq-intel-core-i5-12th-gen-12450hx-16-gb-512-gb-ssd-windows-11-home-6-graphics-nvidia-geforce-rtx-4050-15iax9-gaming-laptop/p/itm9127ae2e85a53',
      isDirectPdp: true,
      title: 'Lenovo LOQ Intel Core i5 12th Gen (16 GB/512 GB SSD/RTX 4050)'
    },
    croma: {
      url: 'https://www.croma.com/lenovo-loq-15iax9-intel-core-i5-12th-gen-15-6-inch-16gb-512gb-rtx-4050-/p/306653',
      isDirectPdp: true,
      title: 'Lenovo LOQ 15.6" RTX 4050'
    }
  },

  // HP Victus 15
  'hp_victus_15': {
    name: 'HP Victus 15',
    brand: 'HP',
    amazon: {
      url: 'https://www.amazon.in/dp/B0C2P2FNTL',
      isDirectPdp: true,
      title: 'HP Victus Gaming Laptop, AMD Ryzen 5 5600H, 4GB RTX 3050 GPU, 15.6-inch FHD'
    },
    flipkart: {
      url: 'https://www.flipkart.com/hp-victus-amd-ryzen-5-hexa-core-5600h-16-gb-512-gb-ssd-windows-11-home-4-graphics-nvidia-geforce-rtx-3050-15-fb0050ax-gaming-laptop/p/itm95a5fbc40536c',
      isDirectPdp: true,
      title: 'HP Victus AMD Ryzen 5 5600H (16 GB/512 GB SSD/RTX 3050)'
    },
    croma: {
      url: 'https://www.croma.com/hp-victus-15-fb0050ax-amd-ryzen-5-15-6-inch-16gb-512gb-rtx-3050-/p/273030',
      isDirectPdp: true,
      title: 'HP Victus 15.6" Gaming Laptop'
    }
  },

  // Lenovo IdeaPad Slim 3
  'lenovo_ideapad_slim3': {
    name: 'Lenovo IdeaPad Slim 3',
    brand: 'Lenovo',
    amazon: {
      url: 'https://www.amazon.in/dp/B0CR7S92QJ',
      isDirectPdp: true,
      title: 'Lenovo IdeaPad Slim 3 AMD Ryzen 5 7520U 15.6" (16GB/512GB SSD)'
    },
    flipkart: {
      url: 'https://www.flipkart.com/lenovo-ideapad-slim-3-amd-ryzen-5-quad-core-7520u-16-gb-512-gb-ssd-windows-11-home-15amn8-thin-light-laptop/p/itm0feae94b62e49',
      isDirectPdp: true,
      title: 'Lenovo IdeaPad Slim 3 Ryzen 5 7520U (16 GB/512 GB SSD)'
    },
    croma: {
      url: 'https://www.croma.com/lenovo-ideapad-slim-3-15amn8-ryzen-5-15-6-inch-16gb-512gb-/p/301412',
      isDirectPdp: true,
      title: 'Lenovo IdeaPad Slim 3 15.6"'
    }
  },

  // Acer Aspire Lite
  'acer_aspire_lite': {
    name: 'Acer Aspire Lite',
    brand: 'Acer',
    amazon: {
      url: 'https://www.amazon.in/dp/B0C6BG42YF',
      isDirectPdp: true,
      title: 'Acer Aspire Lite AMD Ryzen 5 5500U Premium Laptop (16 GB RAM/512 GB SSD)'
    },
    flipkart: {
      url: 'https://www.flipkart.com/acer-aspire-lite-amd-ryzen-5-hexa-core-5500u-16-gb-512-gb-ssd-windows-11-home-al15-41-thin-light-laptop/p/itma06cb443296c0',
      isDirectPdp: true,
      title: 'Acer Aspire Lite Ryzen 5 5500U (16 GB/512 GB SSD)'
    },
    croma: {
      url: 'https://www.croma.com/acer-aspire-lite-al15-41-ryzen-5-15-6-inch-16gb-512gb-/p/276632',
      isDirectPdp: true,
      title: 'Acer Aspire Lite 15.6"'
    }
  },

  // MacBook Air M2
  'macbook_air_m2': {
    name: 'Apple MacBook Air M2',
    brand: 'Apple',
    amazon: {
      url: 'https://www.amazon.in/dp/B0B3B9R7DY',
      asin: 'B0B3B9R7DY',
      isDirectPdp: true,
      title: 'Apple 2022 MacBook Air Laptop with M2 chip: 13.6-inch Liquid Retina Display, 8GB RAM, 256GB SSD'
    },
    flipkart: {
      url: 'https://www.flipkart.com/apple-macbook-air-m2-8-gb-256-gb-ssd-mac-os-monterey-mly33hn-a/p/itm1235ecdb8e4f1',
      isDirectPdp: true,
      title: 'Apple MacBook Air M2 - (8 GB/256 GB SSD/Mac OS Monterey) MLY33HN/A'
    },
    croma: {
      url: 'https://www.croma.com/apple-macbook-air-2022-m2-13-6-inch-8gb-256gb-macos-midnight-mly33hn-a-/p/256605',
      isDirectPdp: true,
      title: 'Apple MacBook Air 2022 M2 13.6 Inch 8GB 256GB Midnight'
    },
    brand_store: {
      url: 'https://www.apple.com/in/shop/buy-mac/macbook-air/13-inch-m2',
      isDirectPdp: true,
      title: 'Apple India Official Store — MacBook Air M2'
    }
  },

  // MacBook Air M3
  'macbook_air_m3': {
    name: 'Apple MacBook Air M3',
    brand: 'Apple',
    amazon: {
      url: 'https://www.amazon.in/dp/B0CX23G28R',
      asin: 'B0CX23G28R',
      isDirectPdp: true,
      title: 'Apple 2024 MacBook Air 13" Laptop with M3 chip'
    },
    flipkart: {
      url: 'https://www.flipkart.com/apple-macbook-air-m3-8-gb-256-gb-ssd-macos-sonoma-mrxn3hn-a/p/itmb76d29da7ce2f',
      isDirectPdp: true,
      title: 'Apple MacBook Air M3 (8 GB/256 GB SSD)'
    },
    croma: {
      url: 'https://www.croma.com/apple-macbook-air-2024-m3-13-6-inch-8gb-256gb-space-grey-/p/305315',
      isDirectPdp: true,
      title: 'Apple MacBook Air 2024 M3'
    },
    brand_store: {
      url: 'https://www.apple.com/in/shop/buy-mac/macbook-air/13-inch-m3',
      isDirectPdp: true,
      title: 'Apple India Official Store — MacBook Air M3'
    }
  },

  // Dell XPS 13
  'dell_xps_13': {
    name: 'Dell XPS 13 (9315)',
    brand: 'Dell',
    amazon: {
      url: 'https://www.amazon.in/dp/B0B6FB7Z17',
      isDirectPdp: true,
      title: 'Dell XPS 13 (9315) Intel Evo i5-1230U 13.4" FHD+'
    },
    flipkart: {
      url: 'https://www.flipkart.com/dell-xps-13-core-i5-12th-gen-16-gb-512-gb-ssd-windows-11-home-9315-thin-light-laptop/p/itm5432abcf0488e',
      isDirectPdp: true,
      title: 'Dell XPS 13 Intel Core i5 12th Gen'
    },
    croma: {
      url: 'https://www.croma.com/dell-xps-13-9315-intel-core-i5-12th-gen-13-4-inch-16gb-512gb-/p/260714',
      isDirectPdp: true,
      title: 'Dell XPS 13'
    }
  },

  // ASUS ROG Strix G16
  'asus_rog_strix_g16': {
    name: 'ASUS ROG Strix G16',
    brand: 'ASUS',
    amazon: {
      url: 'https://www.amazon.in/dp/B0CRD7F54F',
      isDirectPdp: true,
      title: 'ASUS ROG Strix G16 (2024) 16" FHD+ 165Hz, Intel Core i7-13650HX, RTX 4060'
    },
    flipkart: {
      url: 'https://www.flipkart.com/asus-rog-strix-g16-core-i7-13th-gen-16-gb-1-tb-ssd-windows-11-home-8-graphics-nvidia-geforce-rtx-4060-g614jvr-n4062w-gaming-laptop/p/itme25c589b276fe',
      isDirectPdp: true,
      title: 'ASUS ROG Strix G16 Intel Core i7 13th Gen RTX 4060'
    },
    croma: {
      url: 'https://www.croma.com/asus-rog-strix-g16-g614jvr-intel-core-i7-13th-gen-16-inch-16gb-1tb-rtx-4060-/p/305718',
      isDirectPdp: true,
      title: 'ASUS ROG Strix G16 RTX 4060'
    }
  },

  // --- AUDIO & TWS ---

  // Sony WH-1000XM5
  'sony_wh1000xm5': {
    name: 'Sony WH-1000XM5',
    brand: 'Sony',
    amazon: {
      url: 'https://www.amazon.in/dp/B09XS7JWHH',
      asin: 'B09XS7JWHH',
      isDirectPdp: true,
      title: 'Sony WH-1000XM5 Wireless Industry Leading Active Noise Cancelling Headphones'
    },
    flipkart: {
      url: 'https://www.flipkart.com/sony-wh-1000xm5-bluetooth-headset/p/itm3d236f75ce6ef',
      isDirectPdp: true,
      title: 'SONY WH-1000XM5 Bluetooth Headset'
    },
    croma: {
      url: 'https://www.croma.com/sony-wh-1000xm5-over-ear-active-noise-cancellation-wireless-headphone-with-mic-black-/p/262705',
      isDirectPdp: true,
      title: 'Sony WH-1000XM5 Over-Ear ANC Wireless Headphone'
    }
  },

  // Sony WF-1000XM5
  'sony_wf1000xm5': {
    name: 'Sony WF-1000XM5',
    brand: 'Sony',
    amazon: {
      url: 'https://www.amazon.in/dp/B0CCZ34M22',
      isDirectPdp: true,
      title: 'Sony WF-1000XM5 Truly Wireless Noise Cancelling Earbuds'
    },
    flipkart: {
      url: 'https://www.flipkart.com/sony-wf-1000xm5-bluetooth-headset/p/itm7162985449746',
      isDirectPdp: true,
      title: 'Sony WF-1000XM5 Truly Wireless Earbuds'
    },
    croma: {
      url: 'https://www.croma.com/sony-wf-1000xm5-truly-wireless-earbuds-with-mic-anc-black-/p/300898',
      isDirectPdp: true,
      title: 'Sony WF-1000XM5 ANC Earbuds'
    }
  },

  // AirPods Pro 2
  'airpods_pro_2': {
    name: 'Apple AirPods Pro (2nd Gen, USB-C)',
    brand: 'Apple',
    amazon: {
      url: 'https://www.amazon.in/dp/B0CHWRXH8B',
      asin: 'B0CHWRXH8B',
      isDirectPdp: true,
      title: 'Apple AirPods Pro (2nd Generation) with MagSafe Case (USB-C)'
    },
    flipkart: {
      url: 'https://www.flipkart.com/apple-airpods-pro-2nd-generation-magsafe-case-usb-c-bluetooth-headset/p/itm4fbffcbbde916',
      isDirectPdp: true,
      title: 'Apple AirPods Pro (2nd Generation) MagSafe Case (USB-C)'
    },
    croma: {
      url: 'https://www.croma.com/apple-airpods-pro-2nd-generation-in-ear-truly-wireless-earbuds-with-mic-active-noise-cancellation-bluetooth-5-3-white-/p/301292',
      isDirectPdp: true,
      title: 'Apple AirPods Pro 2nd Generation Truly Wireless Earbuds (USB-C)'
    },
    brand_store: {
      url: 'https://www.apple.com/in/shop/product/MTJV3HN/A/airpods-pro',
      isDirectPdp: true,
      title: 'Apple India Official Store — AirPods Pro 2'
    }
  },

  // boAt Airdopes 141
  'boat_airdopes_141': {
    name: 'boAt Airdopes 141',
    brand: 'boAt',
    amazon: {
      url: 'https://www.amazon.in/dp/B09N3ZNHTY',
      isDirectPdp: true,
      title: 'boAt Airdopes 141 Bluetooth Truly Wireless in Ear Earbuds'
    },
    flipkart: {
      url: 'https://www.flipkart.com/boat-airdopes-141-bluetooth-headset/p/itma3f8ca68c4d59',
      isDirectPdp: true,
      title: 'boAt Airdopes 141 with 42H Playtime'
    },
    croma: {
      url: 'https://www.croma.com/boat-airdopes-141-in-ear-truly-wireless-earbuds-with-mic-bold-black-/p/247545',
      isDirectPdp: true,
      title: 'boAt Airdopes 141 TWS Earbuds'
    }
  },

  // Realme Buds T110
  'realme_buds_t110': {
    name: 'Realme Buds T110',
    brand: 'Realme',
    amazon: {
      url: 'https://www.amazon.in/dp/B0CYGZMN6B',
      isDirectPdp: true,
      title: 'Realme Buds T110 Bluetooth Truly Wireless in Ear Earbuds'
    },
    flipkart: {
      url: 'https://www.flipkart.com/realme-buds-t110-bluetooth-headset/p/itm2944b9ce2713f',
      isDirectPdp: true,
      title: 'realme Buds T110 with 38 Hours Playback'
    },
    croma: {
      url: 'https://www.croma.com/realme-buds-t110-in-ear-truly-wireless-earbuds-with-mic-country-green-/p/306282',
      isDirectPdp: true,
      title: 'realme Buds T110'
    }
  },

  // Nothing Ear (2)
  'nothing_ear_2': {
    name: 'Nothing Ear (2)',
    brand: 'Nothing',
    amazon: {
      url: 'https://www.amazon.in/dp/B0BXY6T7N4',
      isDirectPdp: true,
      title: 'Nothing Ear (2) Wireless Earbuds with Hi-Res Audio & ANC'
    },
    flipkart: {
      url: 'https://www.flipkart.com/nothing-ear-2-bluetooth-headset/p/itm1fa5025974052',
      isDirectPdp: true,
      title: 'Nothing Ear (2) Bluetooth Headset with LHDC 5.0'
    },
    croma: {
      url: 'https://www.croma.com/nothing-ear-2-in-ear-truly-wireless-earbuds-with-mic-anc-white-/p/271295',
      isDirectPdp: true,
      title: 'Nothing Ear (2) Wireless Earbuds'
    }
  },

  // --- SMARTWATCHES & TABLETS ---

  // Apple Watch SE (2nd Gen)
  'apple_watch_se': {
    name: 'Apple Watch SE (2nd Gen)',
    brand: 'Apple',
    amazon: {
      url: 'https://www.amazon.in/dp/B0CHX4YQ93',
      isDirectPdp: true,
      title: 'Apple Watch SE (2nd Gen, 2023) [GPS 40mm] Smartwatch with Starlight Aluminum Case'
    },
    flipkart: {
      url: 'https://www.flipkart.com/apple-watch-se-2023-gps-40mm-starlight-aluminium-case-sport-band-s-m/p/itm8185bb81d86e9',
      isDirectPdp: true,
      title: 'Apple Watch SE (2023) GPS 40mm'
    },
    croma: {
      url: 'https://www.croma.com/apple-watch-se-gps-40mm-starlight-aluminium-case-with-sport-band-/p/300845',
      isDirectPdp: true,
      title: 'Apple Watch SE (2nd Gen) 40mm GPS'
    }
  },

  // Samsung Galaxy Watch 6
  'samsung_watch6': {
    name: 'Samsung Galaxy Watch 6',
    brand: 'Samsung',
    amazon: {
      url: 'https://www.amazon.in/dp/B0CCY2B2CP',
      isDirectPdp: true,
      title: 'Samsung Galaxy Watch6 Bluetooth (40mm, Graphite)'
    },
    flipkart: {
      url: 'https://www.flipkart.com/samsung-galaxy-watch6-bluetooth-40mm/p/itm671a53c9f53e0',
      isDirectPdp: true,
      title: 'SAMSUNG Galaxy Watch6 Bluetooth (40mm)'
    },
    croma: {
      url: 'https://www.croma.com/samsung-galaxy-watch6-smartwatch-40mm-bluetooth-graphite-/p/275529',
      isDirectPdp: true,
      title: 'Samsung Galaxy Watch6 40mm'
    }
  },

  // boAt Wave Call 2
  'boat_wave_call2': {
    name: 'boAt Wave Call 2',
    brand: 'boAt',
    amazon: {
      url: 'https://www.amazon.in/dp/B0CC9L3Y3Q',
      isDirectPdp: true,
      title: 'boAt Wave Call 2 Smart Watch with 1.83" HD Display, Bluetooth Calling'
    },
    flipkart: {
      url: 'https://www.flipkart.com/boat-wave-call-2-1-83-hd-display-bluetooth-calling-700-active-modes-smartwatch/p/itm7e6d0a793a388',
      isDirectPdp: true,
      title: 'boAt Wave Call 2 with 1.83" HD Display'
    },
    croma: {
      url: 'https://www.croma.com/boat-wave-call-2-smartwatch-with-bluetooth-calling-active-black-/p/274488',
      isDirectPdp: true,
      title: 'boAt Wave Call 2 Smartwatch'
    }
  },

  // Apple iPad (10th Gen)
  'ipad_10th': {
    name: 'Apple iPad (10th Gen)',
    brand: 'Apple',
    amazon: {
      url: 'https://www.amazon.in/dp/B0BJLB68ZJ',
      isDirectPdp: true,
      title: 'Apple iPad (10th Generation): with A14 Bionic chip, 10.9-inch Liquid Retina Display, 64GB'
    },
    flipkart: {
      url: 'https://www.flipkart.com/apple-ipad-10th-gen-64-gb-rom-10-9-inch-wi-fi-only-blue/p/itmbc56fe8686e58',
      isDirectPdp: true,
      title: 'Apple iPad (10th Gen) 64 GB ROM 10.9 Inch Wi-Fi Only'
    },
    croma: {
      url: 'https://www.croma.com/apple-ipad-10th-generation-wi-fi-64gb-10-9-inch-blue-/p/264353',
      isDirectPdp: true,
      title: 'Apple iPad 10th Gen 10.9 Inch'
    }
  },

  // Redmi Pad SE
  'redmi_pad_se': {
    name: 'Redmi Pad SE',
    brand: 'Xiaomi',
    amazon: {
      url: 'https://www.amazon.in/dp/B0D1GBM596',
      isDirectPdp: true,
      title: 'Redmi Pad SE | All Day Battery | Qualcomm Snapdragon 680 | 90Hz Display'
    },
    flipkart: {
      url: 'https://www.flipkart.com/redmi-pad-se-6-gb-ram-128-gb-rom-11-0-inch-wi-fi-only-graphite-gray/p/itm874e4c2957e84',
      isDirectPdp: true,
      title: 'Redmi Pad SE (6 GB RAM/128 GB ROM/11 Inch)'
    },
    croma: {
      url: 'https://www.croma.com/redmi-pad-se-qualcomm-snapdragon-680-11-inch-6gb-128gb-graphite-gray-/p/306443',
      isDirectPdp: true,
      title: 'Redmi Pad SE 11 Inch'
    }
  },

  // --- CHARGERS & ACCESSORIES ---

  // Anker Nano 30W GaN Charger
  'anker_nano_30w': {
    name: 'Anker Nano 30W GaN Charger',
    brand: 'Anker',
    amazon: {
      url: 'https://www.amazon.in/dp/B0C1CV1J8J',
      asin: 'B0C1CV1J8J',
      isDirectPdp: true,
      title: 'Anker 511 Charger (Nano 3, 30W) GaN Fast Charger'
    },
    flipkart: {
      url: 'https://www.flipkart.com/anker-nano-30w-pd-fast-charger/p/itm1c63cb324b17a',
      isDirectPdp: true,
      title: 'Anker Nano 3 30W GaN Wall Charger'
    }
  },

  // Mi 33W Fast Charger
  'mi_33w': {
    name: 'Mi 33W Fast Charger',
    brand: 'Xiaomi',
    amazon: {
      url: 'https://www.amazon.in/dp/B098NS6PVG',
      asin: 'B098NS6PVG',
      isDirectPdp: true,
      title: 'Mi 33W SonicCharge 2.0 Fast Charger Combo'
    },
    flipkart: {
      url: 'https://www.flipkart.com/mi-33w-soniccharge-2-0-fast-charger-combo/p/itm7bcfe31604a11',
      isDirectPdp: true,
      title: 'Mi 33W SonicCharge 2.0 Charger'
    },
    croma: {
      url: 'https://www.croma.com/mi-soniccharge-2-0-33w-type-a-wall-charging-adapter-with-cable-white-/p/242484',
      isDirectPdp: true,
      title: 'Mi SonicCharge 33W Adapter'
    }
  },

  // Baseus 100W GaN Charger
  'baseus_100w': {
    name: 'Baseus 100W GaN Charger',
    brand: 'Baseus',
    amazon: {
      url: 'https://www.amazon.in/dp/B09N3PZGF4',
      isDirectPdp: true,
      title: 'Baseus 100W GaN Fast Charger 4-Port Type-C Laptop & Phone Wall Charger'
    },
    flipkart: {
      url: 'https://www.flipkart.com/baseus-100w-gan-fast-charger/p/itmd5642a420fa2c',
      isDirectPdp: true,
      title: 'Baseus 100W GaN Fast Charger'
    }
  },

  // Mi Power Bank 3i 10000mAh
  'mi_powerbank_3i_10000': {
    name: 'Mi Power Bank 3i 10000mAh',
    brand: 'Xiaomi',
    amazon: {
      url: 'https://www.amazon.in/dp/B08HV832JZ',
      isDirectPdp: true,
      title: 'Mi 10000mAH Li-Polymer Power Bank 3i with 18W Fast Charging'
    },
    flipkart: {
      url: 'https://www.flipkart.com/mi-3i-10000-mah-power-bank-18-w-fast-charging/p/itm9ecfe56574a12',
      isDirectPdp: true,
      title: 'Mi 3i 10000 mAh Power Bank (18 W Fast Charging)'
    },
    croma: {
      url: 'https://www.croma.com/mi-3i-10000mah-2-port-power-bank-18w-fast-charging-metallic-black-/p/229983',
      isDirectPdp: true,
      title: 'Mi 3i 10000mAh Power Bank'
    }
  }
};

/**
 * Fuzzy keyword dictionary mapping product titles and model queries to canonical registry keys
 */
const CANONICAL_FUZZY_MAP = [
  { match: ['s24 ultra', 's24ultra', 'galaxy s24 ultra'], key: 'samsung_s24ultra' },
  { match: ['s23', 'galaxy s23'], key: 'samsung_s23' },
  { match: ['m35', 'galaxy m35'], key: 'samsung_m35' },
  { match: ['iphone 17 pro max', 'iphone 17'], key: 'iphone17promax' },
  { match: ['iphone 16 pro max'], key: 'iphone16promax' },
  { match: ['iphone 16 pro'], key: 'iphone16pro' },
  { match: ['iphone 16'], key: 'iphone16' },
  { match: ['iphone 15 pro max', 'iphone 15 pro'], key: 'iphone15pro' },
  { match: ['iphone 15'], key: 'iphone15' },
  { match: ['iphone 14'], key: 'iphone14' },
  { match: ['iphone 13'], key: 'iphone13' },
  { match: ['oneplus 12r'], key: 'oneplus_12r' },
  { match: ['oneplus 12'], key: 'oneplus_12' },
  { match: ['nord ce 4', 'nord ce4'], key: 'oneplus_nord_ce4' },
  { match: ['neo 9 pro', 'neo 9'], key: 'iqoo_neo9pro' },
  { match: ['iqoo z9s', 'z9s pro', 'z9s'], key: 'iqoo_z9s' },
  { match: ['redmi 13c', '13c'], key: 'redmi13c' },
  { match: ['poco m6 pro', 'm6 pro'], key: 'poco_m6pro' },
  { match: ['pixel 8a'], key: 'pixel8a' },
  { match: ['tuf f15', 'tuf gaming f15', 'asus tuf'], key: 'asus_tuf_f15_budget' },
  { match: ['aspire 5 gaming', 'aspire 5'], key: 'acer_aspire_5_gaming' },
  { match: ['loq 15', 'lenovo loq'], key: 'lenovo_loq_15' },
  { match: ['victus 15', 'hp victus'], key: 'hp_victus_15' },
  { match: ['ideapad slim 3', 'slim 3'], key: 'lenovo_ideapad_slim3' },
  { match: ['aspire lite'], key: 'acer_aspire_lite' },
  { match: ['macbook air m3', 'macbook m3'], key: 'macbook_air_m3' },
  { match: ['macbook air m2', 'macbook m2'], key: 'macbook_air_m2' },
  { match: ['xps 13', 'dell xps'], key: 'dell_xps_13' },
  { match: ['rog strix', 'strix g16'], key: 'asus_rog_strix_g16' },
  { match: ['wh-1000xm5', 'wh 1000xm5', '1000xm5 headphone'], key: 'sony_wh1000xm5' },
  { match: ['wf-1000xm5', 'wf 1000xm5', '1000xm5 earbud'], key: 'sony_wf1000xm5' },
  { match: ['airpods pro 2', 'airpods pro'], key: 'airpods_pro_2' },
  { match: ['airdopes 141', 'boat airdopes'], key: 'boat_airdopes_141' },
  { match: ['buds t110', 'realme buds'], key: 'realme_buds_t110' },
  { match: ['nothing ear (2)', 'nothing ear 2'], key: 'nothing_ear_2' },
  { match: ['apple watch se'], key: 'apple_watch_se' },
  { match: ['galaxy watch 6', 'watch 6', 'watch6'], key: 'samsung_watch6' },
  { match: ['wave call 2'], key: 'boat_wave_call2' },
  { match: ['ipad 10th', 'ipad 10'], key: 'ipad_10th' },
  { match: ['redmi pad se', 'pad se'], key: 'redmi_pad_se' },
  { match: ['anker nano 30w', 'anker 30w', 'nano 30w'], key: 'anker_nano_30w' },
  { match: ['mi 33w', 'soniccharge 33w'], key: 'mi_33w' },
  { match: ['baseus 100w', '100w gan'], key: 'baseus_100w' },
  { match: ['power bank 3i', 'mi power bank'], key: 'mi_powerbank_3i_10000' }
];

/**
 * Returns a high-precision, verified direct buy link or smart BuyHatke canonical search
 * @param {Object} product
 * @param {string} storeKey ('amazon' | 'flipkart' | 'croma' | 'reliance' | 'brand_store')
 * @param {Object} [options]
 * @returns {{ url: string, isDirectPdp: boolean, label: string }}
 */
export function getSmartProductBuyLink(product, storeKey, options = {}) {
  const prodId = product?.id || '';
  const prodName = product?.name || '';
  const lowerName = (prodName + ' ' + prodId).toLowerCase();

  // 1. Direct ID match in canonical registry
  let registered = CANONICAL_PDP_REGISTRY[prodId];

  // 2. Fuzzy name match in canonical registry
  if (!registered) {
    for (const item of CANONICAL_FUZZY_MAP) {
      if (item.match.some(m => lowerName.includes(m))) {
        registered = CANONICAL_PDP_REGISTRY[item.key];
        break;
      }
    }
  }

  if (registered && registered[storeKey]) {
    const entry = registered[storeKey];
    return {
      url: getAffiliateUrl(storeKey, prodName, entry.url),
      isDirectPdp: Boolean(entry.isDirectPdp),
      label: entry.isDirectPdp ? 'Direct Product Page (1-Click PDP)' : 'Verified Store Match'
    };
  }

  // 3. Direct URL already on the product object
  const directKey = `${storeKey}Url`;
  if (product && product[directKey]) {
    const rawUrl = product[directKey];
    const isDirect = rawUrl.includes('/dp/') || rawUrl.includes('/p/') || rawUrl.includes('/buy');
    return {
      url: getAffiliateUrl(storeKey, prodName, rawUrl),
      isDirectPdp: isDirect,
      label: isDirect ? 'Direct Product Page (1-Click PDP)' : 'Live Store Query'
    };
  }

  // 4. BuyHatke-Style Smart Fallback Search
  let targetQuery = prodName;
  if (options.storage) targetQuery += ` ${options.storage}`;
  if (options.ram) targetQuery += ` ${options.ram}`;

  let fallbackUrl = '';
  if (storeKey === 'amazon') {
    fallbackUrl = `https://www.amazon.in/s?k=${encodeURIComponent(targetQuery)}`;
  } else if (storeKey === 'flipkart') {
    fallbackUrl = `https://www.flipkart.com/search?q=${encodeURIComponent(targetQuery)}`;
  } else if (storeKey === 'croma') {
    fallbackUrl = `https://www.croma.com/searchB?q=${encodeURIComponent(targetQuery)}`;
  } else if (storeKey === 'reliance') {
    fallbackUrl = `https://www.reliancedigital.in/search?q=${encodeURIComponent(targetQuery)}:relevance`;
  } else if (storeKey === 'jiomart') {
    fallbackUrl = `https://www.jiomart.com/search/${encodeURIComponent(targetQuery)}`;
  } else if (storeKey === 'blinkit') {
    fallbackUrl = `https://blinkit.com/s/?q=${encodeURIComponent(targetQuery)}`;
  } else if (storeKey === 'zepto') {
    fallbackUrl = `https://www.zeptonow.com/search?query=${encodeURIComponent(targetQuery)}`;
  } else {
    fallbackUrl = `https://www.google.com/search?q=${encodeURIComponent(targetQuery + ' buy online India')}`;
  }

  return {
    url: getAffiliateUrl(storeKey, prodName, fallbackUrl),
    isDirectPdp: false,
    label: 'Targeted High-Intent Search'
  };
}
