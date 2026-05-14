"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function VendorDetailPage() {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    if (!params?.id) return;
    fetch(`${API_URL}/public/vendor/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) { setNotFound(true); }
        else { setVendor(data); }
        setLoading(false);
      })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [params?.id]);

  const handleNavigate = () => {
    const wazeUrl = `https://www.waze.com/ul?ll=${vendor.latitude},${vendor.longitude}&navigate=yes`;
    window.open(wazeUrl, "_blank");
  };

  const handleCall = () => {
    window.open(`tel:${vendor.shopPhone}`);
  };

  const handleWhatsApp = () => {
    const phone = vendor.shopPhone.replace(/^0/, '60');
    window.open(`https://wa.me/${phone}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#fafaf7' }}>
        <div style={{
          width: 36, height: 36,
          border: '3px solid #e8f5c8',
          borderTopColor: '#7cc620',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: '#fafaf7' }}>
        <p className="text-4xl">🍽️</p>
        <p className="font-nunito font-black text-gray-400 text-sm uppercase tracking-widest">Kedai tidak dijumpai</p>
        <button onClick={() => router.back()}
          className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition">
          ← Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans" style={{ background: '#fafaf7' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito:wght@400;700;800;900&display=swap');
        .font-bebas { font-family: 'Bebas Neue', sans-serif; }
        .font-nunito { font-family: 'Nunito', sans-serif; }
      `}</style>

      <div className="max-w-md mx-auto min-h-screen shadow-xl" style={{ background: '#ffffff' }}>

        {/* HERO IMAGE */}
        <div className="relative w-full h-64 bg-gray-100">
          <img
            src={vendor.shopImage || "https://placehold.co/400x300?text=No+Image"}
            alt={vendor.shopName}
            className="w-full h-full object-cover"
          />
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-700 font-black text-xs px-3 py-2 rounded-full shadow-sm hover:bg-white transition"
          >
            ← Kembali
          </button>
          {/* Badges */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
            {vendor.isPremium && (
              <span className="bg-yellow-400 text-yellow-900 text-[10px] font-black px-2 py-1 rounded-full uppercase">
                ⭐ Premium
              </span>
            )}
            {vendor.isGrabFood && (
              <span className="bg-green-600 text-white text-[10px] font-black px-2 py-1 rounded-full uppercase">Grab</span>
            )}
            {vendor.isFoodPanda && (
              <span className="bg-pink-500 text-white text-[10px] font-black px-2 py-1 rounded-full uppercase">Panda</span>
            )}
          </div>
        </div>

        <div className="px-5 py-5 space-y-5">

          {/* SHOP INFO */}
          <div>
            <h1 className="font-bebas text-3xl leading-none text-gray-900">{vendor.shopName}</h1>
            <p className="font-nunito text-xs text-gray-400 font-medium mt-1">{vendor.address}</p>
            {vendor.state && (
              <p className="font-nunito text-xs text-gray-400 font-medium">{vendor.state.name}</p>
            )}
          </div>

          {/* CONTACT BUTTONS */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleCall}
              className="flex items-center justify-center gap-2 py-3 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-gray-100 transition"
            >
              <span className="text-base">📞</span>
              <span className="font-nunito text-xs font-black text-gray-700 uppercase tracking-widest">Telefon</span>
            </button>
            <button
              onClick={handleWhatsApp}
              className="flex items-center justify-center gap-2 py-3 rounded-2xl border border-green-100 bg-green-50 hover:bg-green-100 transition"
            >
              <span className="text-base">💬</span>
              <span className="font-nunito text-xs font-black text-green-700 uppercase tracking-widest">WhatsApp</span>
            </button>
          </div>

          {/* MENU */}
          {vendor.menuItems && vendor.menuItems.length > 0 && (
            <div>
              <p className="font-nunito text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                Menu Pilihan
              </p>
              <div className="grid grid-cols-2 gap-3">
                {vendor.menuItems.map((item) => (
                  <div key={item.id} className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-3">
                      <p className="font-nunito text-xs font-black text-gray-800 truncate">{item.name}</p>
                      <p className="font-nunito text-sm font-black mt-0.5" style={{ color: '#7cc620' }}>
                        RM{Number(item.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NAVIGATE */}
          <button
            onClick={handleNavigate}
            style={{ background: '#7cc620' }}
            className="w-full hover:opacity-90 active:scale-[0.98] transition text-white font-black py-4 rounded-2xl text-sm uppercase tracking-widest shadow-lg"
          >
            📍 Navigate via Waze
          </button>

        </div>
      </div>
    </div>
  );
}