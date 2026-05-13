"use client";
import { useState, useEffect } from "react";
import ShopCard from "@/components/ShopCard";
import { getStates } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function CariPage() {
  const [states, setStates] = useState([]);
  const [stateId, setStateId] = useState("");
  const [shops, setShops] = useState([]);
  const [userLat, setUserLat] = useState(null);
  const [userLng, setUserLng] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    getStates().then(setStates);
    if ("geolocation" in navigator) {
      setLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLat(pos.coords.latitude);
          setUserLng(pos.coords.longitude);
          setLocating(false);
        },
        () => setLocating(false)
      );
    }
  }, []);

  const handleStateSelect = async (id) => {
    setStateId(id);
    setLoading(true);
    setSearched(true);
    setShops([]);

    const params = new URLSearchParams({ stateId: id });
    if (userLat) params.append("userLat", userLat);
    if (userLng) params.append("userLong", userLng);

    try {
      const res = await fetch(`${API_URL}/public/discovery?${params}`);
      const data = await res.json();
      setShops(Array.isArray(data) ? data : []);
    } catch {
      setShops([]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen font-sans" style={{ background: '#fafaf7' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito:wght@400;700;800;900&display=swap');
        .font-bebas { font-family: 'Bebas Neue', sans-serif; }
        .font-nunito { font-family: 'Nunito', sans-serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .card-in { animation: fadeUp 0.4s ease forwards; }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .spinner {
          width: 36px; height: 36px;
          border: 3px solid #e8f5c8;
          border-top-color: #7cc620;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
      `}</style>

      <div className="max-w-md mx-auto min-h-screen shadow-xl" style={{ background: '#ffffff' }}>

        {/* STICKY HEADER */}
        <header className="sticky top-0 z-40 px-5 pt-6 pb-4"
          style={{ background: '#ffffff', borderBottom: '1px solid #f0f0ea' }}>

          {/* Top row */}
          <div className="flex justify-between items-center mb-5">
            <div>
              <img src="/logo.png" alt="GoSuap" className="h-9 w-auto object-contain" />
            </div>
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${locating ? 'bg-yellow-400' : userLat ? 'bg-green-500' : 'bg-gray-300'}`}
                style={userLat ? { boxShadow: '0 0 6px #22c55e' } : {}} />
              <span className="font-nunito text-[10px] font-black uppercase tracking-widest"
                style={{ color: locating ? '#ca8a04' : userLat ? '#16a34a' : '#9ca3af' }}>
                {locating ? 'Mengesan GPS...' : userLat ? 'Lokasi OK' : 'Tiada GPS'}
              </span>
            </div>
          </div>

          {/* Headline */}
          <div className="mb-4">
            <h1 className="font-bebas text-[32px] leading-none" style={{ color: '#0a1100' }}>
              MUSLIM FOOD MARKET PLACE
            </h1>
            <p className="font-nunito text-xs font-bold mt-0.5" style={{ color: '#9ca3af' }}>
              Pilih negeri untuk mula cari
            </p>
          </div>

          {/* STATE CHIPS */}
          <div className="flex gap-2 flex-wrap">
            {states.map((s) => {
              const active = stateId === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => handleStateSelect(s.id)}
                  className="font-nunito text-xs font-black uppercase tracking-widest px-4 py-2.5 rounded-xl transition-all"
                  style={{
                    background: active ? '#7cc620' : '#f4f9ea',
                    color: active ? '#ffffff' : '#4a7c10',
                    border: active ? '1.5px solid #7cc620' : '1.5px solid #e2f0c0',
                    boxShadow: active ? '0 4px 14px rgba(124,198,32,0.35)' : 'none',
                    transform: active ? 'scale(1.04)' : 'scale(1)',
                  }}
                >
                  {s.name}
                </button>
              );
            })}
          </div>
        </header>

        {/* RESULTS */}
        <div className="px-4 py-5 space-y-4">

          {/* LOADING */}
          {loading && (
            <div className="flex flex-col items-center py-20 gap-4">
              <div className="spinner" />
              <p className="font-nunito text-xs font-black text-gray-400 uppercase tracking-widest">
                Mencari kedai...
              </p>
            </div>
          )}

          {/* NO RESULTS */}
          {!loading && searched && shops.length === 0 && (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">🍽️</p>
              <p className="font-nunito font-black text-sm text-gray-400 uppercase tracking-widest">
                Tiada kedai aktif
              </p>
              <p className="font-nunito text-xs text-gray-300 mt-1">Cuba negeri lain</p>
            </div>
          )}

          {/* SHOPS */}
          {!loading && shops.map((shop, i) => (
            <div key={shop.id} className="card-in" style={{ animationDelay: `${i * 0.07}s` }}>
              <ShopCard shop={shop} />
            </div>
          ))}

          {/* EMPTY STATE */}
          {!searched && !loading && (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">🕌</p>
              <p className="font-nunito font-black text-sm text-gray-400 uppercase tracking-widest">
                Pilih negeri di atas
              </p>
            </div>
          )}

        </div>

        {/* BACK TO HOME */}
        <div className="px-4 pb-10 text-center">
          <a href="/" className="font-nunito text-[11px] font-black text-gray-300 uppercase tracking-widest hover:text-gray-500 transition">
            ← GoSuap Home
          </a>
        </div>

      </div>
    </div>
  );
}