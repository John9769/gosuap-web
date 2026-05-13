"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function AdminDashboard() {
  const [pending, setPending] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(null);
  const router = useRouter();

  const getToken = () => localStorage.getItem("token");

  const checkAuth = () => {
    const token = getToken();
    const role = localStorage.getItem("agentRole");
    if (!token || role !== "ADMIN") {
      router.push("/login");
      return false;
    }
    return true;
  };

  const fetchData = async () => {
    if (!checkAuth()) return;
    setLoading(true);
    const token = getToken();

    const [pendingRes, statsRes] = await Promise.all([
      fetch(`${API_URL}/admin/pending`, { headers: { Authorization: `Bearer ${token}` } }),
      fetch(`${API_URL}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } }),
    ]);

    const pendingData = await pendingRes.json();
    const statsData = await statsRes.json();

    setPending(Array.isArray(pendingData) ? pendingData : []);
    setStats(statsData);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleApprove = async (vendorId) => {
    setApproving(vendorId);
    const token = getToken();

    await fetch(`${API_URL}/admin/approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ vendorId }),
    });

    setApproving(null);
    fetchData();
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <main className="max-w-md mx-auto bg-white min-h-screen shadow-2xl pb-20">

        {/* HEADER */}
        <header className="flex justify-between items-center px-6 py-5 border-b border-gray-100 bg-white sticky top-0 z-50">
          <div>
            <h1 className="text-lg font-black text-blue-900 leading-none tracking-tight">ADMIN</h1>
            <p className="text-[10px] font-bold text-gray-400 tracking-[.2em] uppercase mt-0.5">Panel Kawalan</p>
          </div>
          <img src="/logo.png" alt="GoSuap" className="h-10 w-auto object-contain" />
        </header>

        <div className="px-6 py-6 space-y-6">

          {/* STATS */}
          {stats && (
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center py-4 border border-gray-100 rounded-2xl bg-gray-50">
                <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Jumlah</p>
                <p className="text-2xl font-black text-gray-800 mt-1">{stats.totalVendors ?? 0}</p>
              </div>
              <div className="text-center py-4 border border-gray-100 rounded-2xl bg-gray-50">
                <p className="text-[9px] font-black text-green-600 uppercase tracking-widest">Aktif</p>
                <p className="text-2xl font-black text-gray-800 mt-1">{stats.activeVendors ?? 0}</p>
              </div>
              <div className="text-center py-4 border border-gray-100 rounded-2xl bg-gray-50">
                <p className="text-[9px] font-black text-yellow-600 uppercase tracking-widest">Pending</p>
                <p className="text-2xl font-black text-gray-800 mt-1">{stats.pendingVendors ?? 0}</p>
              </div>
            </div>
          )}

          {/* PENDING APPROVALS */}
          <div>
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
              Menunggu Kelulusan ({pending.length})
            </h2>

            {loading && (
              <p className="text-center text-gray-400 text-xs font-bold py-8 uppercase tracking-widest">Memuatkan...</p>
            )}

            {!loading && pending.length === 0 && (
              <div className="text-center py-10 border border-gray-100 rounded-2xl bg-gray-50">
                <p className="text-2xl mb-2">✅</p>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Tiada pending</p>
              </div>
            )}

            <div className="space-y-3">
              {pending.map((vendor) => (
                <div key={vendor.id} className="p-4 border border-gray-100 rounded-2xl bg-gray-50 space-y-3">
                  <div className="flex gap-3 items-start">
                    <img
                      src={vendor.shopImage}
                      alt={vendor.shopName}
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-gray-900 text-sm truncate">{vendor.shopName}</p>
                      <p className="text-[10px] text-gray-400 font-medium mt-0.5 truncate">{vendor.address}</p>
                      <p className="text-[10px] text-gray-400 font-medium">{vendor.state?.name}</p>
                      <p className="text-[10px] text-blue-600 font-black mt-1">
                        Agen: {vendor.agent?.name}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleApprove(vendor.id)}
                    disabled={approving === vendor.id}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-black py-3 rounded-xl text-xs uppercase tracking-widest active:scale-95 transition"
                  >
                    {approving === vendor.id ? "Meluluskan..." : "✓ Lulus & Aktifkan"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="w-full py-3 border border-red-400 text-red-500 rounded-xl text-xs font-black uppercase tracking-widest bg-transparent hover:bg-red-50 transition"
          >
            Log Keluar
          </button>

        </div>
      </main>
    </div>
  );
}