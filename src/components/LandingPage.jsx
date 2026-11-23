export default function LandingPage({ onNavigate }) {
  return (
    <div className="max-w-4xl mx-auto px-4 pb-16">
      {/* Hero */}
      <div className="text-center py-16">
        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-bold mb-6">
          🤙 India's AI Shopping & Rides Buddy
        </div>
        <h1 className="text-5xl font-black text-gray-900 mb-4 leading-tight">
          Your AI Bro for<br />
          <span className="text-[#00B140]">Gadgets & Rides</span>
        </h1>
        <p className="text-gray-500 text-lg mb-8 max-w-lg mx-auto">
          Find the best electronics deal across Amazon, Flipkart & Croma — or compare ride fares across Uber, Rapido & Ola.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => onNavigate('shop')}
            className="bg-[#00B140] hover:bg-[#008f33] text-white font-black px-8 py-4 rounded-2xl text-lg transition-colors shadow-lg shadow-green-200">
            🛒 Shop Electronics
          </button>
          <button onClick={() => onNavigate('rides')}
            className="bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-800 font-black px-8 py-4 rounded-2xl text-lg transition-colors">
            🚗 Compare Rides
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="grid sm:grid-cols-2 gap-6 mb-16">
        <button onClick={() => onNavigate('shop')}
          className="text-left bg-white border-2 border-gray-100 rounded-3xl p-6 hover:border-[#00B140] hover:shadow-xl transition-all group">
          <div className="text-4xl mb-4">🛒</div>
          <h2 className="text-xl font-black text-gray-900 mb-2 group-hover:text-[#00B140]">Bro Shop</h2>
          <p className="text-gray-500 text-sm mb-4">
            Tell me your budget & purpose. I'll find the best electronics deal — from smartphones to pin chargers.
          </p>
          <div className="flex flex-wrap gap-2">
            {['📱 Phones', '💻 Laptops', '🎧 Earbuds', '⚡ Chargers', '🔋 Power Banks', '+12 more'].map(tag => (
              <span key={tag} className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-lg font-semibold">{tag}</span>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-3 text-xs text-gray-400 font-semibold">
            <span className="flex items-center gap-1">📦 Amazon</span>
            <span className="flex items-center gap-1">🛒 Flipkart</span>
            <span className="flex items-center gap-1">🏪 Croma</span>
          </div>
        </button>

        <button onClick={() => onNavigate('rides')}
          className="text-left bg-white border-2 border-gray-100 rounded-3xl p-6 hover:border-[#00B140] hover:shadow-xl transition-all group">
          <div className="text-4xl mb-4">🚗</div>
          <h2 className="text-xl font-black text-gray-900 mb-2 group-hover:text-[#00B140]">Bro Rides</h2>
          <p className="text-gray-500 text-sm mb-4">
            Enter your route & see live fare estimates across all ride platforms side-by-side. Book the cheapest.
          </p>
          <div className="flex flex-wrap gap-2">
            {['🏍️ Bike', '🛺 Auto', '🚗 Mini', '🚙 Sedan', '🚐 SUV', '⚡ Electric'].map(tag => (
              <span key={tag} className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-lg font-semibold">{tag}</span>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-3 text-xs text-gray-400 font-semibold">
            <span>Uber</span>
            <span>Rapido</span>
            <span>Ola</span>
            <span>BlueSmart</span>
          </div>
        </button>
      </div>

      {/* Stats */}
      <div className="bg-[#00B140] rounded-3xl p-8 text-white text-center">
        <h3 className="text-2xl font-black mb-6">Bro saves you money 💚</h3>
        <div className="grid grid-cols-3 gap-6">
          {[
            { num: '18+', label: 'Electronics Categories' },
            { num: '4', label: 'Ride Platforms Compared' },
            { num: '10', label: 'Cities Supported' },
          ].map(stat => (
            <div key={stat.label}>
              <div className="text-3xl font-black">{stat.num}</div>
              <div className="text-green-200 text-sm font-semibold mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
