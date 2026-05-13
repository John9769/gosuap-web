export default function ShopCard({ shop }) {
  const handleNavigate = () => {
    const wazeUrl = `https://www.waze.com/ul?ll=${shop.latitude},${shop.longitude}&navigate=yes`;
    window.open(wazeUrl, "_blank");
  };

  const distanceKm = shop.distance
    ? (shop.distance * 111).toFixed(1)
    : null;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">

      {/* Shop Image */}
      <div className="relative w-full h-44 bg-gray-100">
        <img
          src={shop.shopImage || "https://placehold.co/400x200?text=No+Image"}
          alt={shop.shopName}
          className="w-full h-full object-cover"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {shop.isPremium && (
            <span className="bg-yellow-400 text-yellow-900 text-[10px] font-black px-2 py-1 rounded-full uppercase">
              ⭐ Premium
            </span>
          )}
          {shop.isGrabFood && (
            <span className="bg-green-600 text-white text-[10px] font-black px-2 py-1 rounded-full uppercase">
              Grab
            </span>
          )}
          {shop.isFoodPanda && (
            <span className="bg-pink-500 text-white text-[10px] font-black px-2 py-1 rounded-full uppercase">
              Panda
            </span>
          )}
        </div>
        {/* Distance — light */}
        {distanceKm && (
          <div className="absolute top-3 right-3 bg-white/90 text-gray-700 text-[10px] font-black px-2 py-1 rounded-full shadow-sm">
            📍 {distanceKm} km
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-base font-black text-gray-900">{shop.shopName}</h3>
          <p className="text-xs text-gray-400 font-medium mt-0.5">{shop.address}</p>
        </div>

        {/* Menu Items */}
        {shop.menuItems && shop.menuItems.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {shop.menuItems.map((item) => (
              <div key={item.id} className="shrink-0 w-16 text-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover border border-gray-100"
                />
                <p className="text-[9px] font-bold text-gray-600 mt-1 truncate">{item.name}</p>
                <p className="text-[9px] font-black" style={{ color: '#7cc620' }}>
                  RM{Number(item.price).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Navigate Button */}
        <button
          onClick={handleNavigate}
          style={{ background: '#7cc620' }}
          className="w-full hover:opacity-90 active:scale-95 transition text-white font-black py-3 rounded-xl text-xs uppercase tracking-widest"
        >
          📍 Navigate via Waze
        </button>
      </div>
    </div>
  );
}