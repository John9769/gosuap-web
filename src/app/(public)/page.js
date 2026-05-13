"use client";
import { useState, useEffect } from "react";
import ShopCard from "@/components/ShopCard";
import { getStates } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function HomePage() {
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
    // Auto-detect location on load
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

  const handleSearch = async () => {
    if (!stateId) return;
    setLoading(true);
    setSearched(true);

    const params = new URLSearchParams({ stateId });
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
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl">

        {/* HEADER */}
        <header className="px-6 pt-8 pb-6 bg-white border-b border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <img src="/logo.png" alt="GoSuap" className="h-10 w-auto object-contain" />
            {locating ? (
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">📍 Mengesan...</span>
            ) : userLat ? (
              <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">📍 Lokasi OK</span>
            ) : (
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">📍 Tiada GPS</span>
            )}
          </div>

          {/* State Selector */}
          <div className="space-y-3">
            <select
              value={stateId}
              onChange={(e) => setStateId(e.target.value)}
              className="w-full px-4 py-3.5 border border-gray-100 rounded-2xl bg-gray-50 outline-none focus:border-green-500 focus:bg-white transition text-sm font-medium text-gray-800"
            >
              <option value="">-- Pilih Negeri --</option>
              {states.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>

            <button
              onClick={handleSearch}
              disabled={!stateId || loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-black py-4 rounded-2xl shadow-lg shadow-green-600/20 active:scale-[0.98] transition text-sm uppercase tracking-widest"
            >
              {loading ? "Mencari..." : "🔍 Cari Kedai"}
            </button>
          </div>
        </header>

        {/* RESULTS */}
        <div className="px-4 py-6 space-y-4">

          {loading && (
            <div className="text-center py-16">
              <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">Memuat kedai...</p>
            </div>
          )}

          {!loading && searched && shops.length === 0 && (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">🍽️</p>
              <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">Tiada kedai dijumpai</p>
              <p className="text-gray-300 text-xs mt-1">Cuba negeri lain</p>
            </div>
          )}

          {!loading && shops.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}

          {!searched && !loading && (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">🕌</p>
              <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">Pilih negeri untuk mulakan</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}