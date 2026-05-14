"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createAgent } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function AdminDashboard() {
  const [pending, setPending] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(null);

  // Payments
  const [pendingPayments, setPendingPayments] = useState([]);
  const [verifying, setVerifying] = useState(null);

  // Create Agent
  const [agentForm, setAgentForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [creatingAgent, setCreatingAgent] = useState(false);
  const [agentSuccess, setAgentSuccess] = useState("");
  const [agentError, setAgentError] = useState("");

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

    const [pendingRes, statsRes, paymentsRes] = await Promise.all([
      fetch(`${API_URL}/admin/pending`, { headers: { Authorization: `Bearer ${token}` } }),
      fetch(`${API_URL}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } }),
      fetch(`${API_URL}/payments/pending`, { headers: { Authorization: `Bearer ${token}` } }),
    ]);

    const pendingData = await pendingRes.json();
    const statsData = await statsRes.json();
    const paymentsData = await paymentsRes.json();

    setPending(Array.isArray(pendingData) ? pendingData : []);
    setStats(statsData);
    setPendingPayments(Array.isArray(paymentsData) ? paymentsData : []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleApprove = async (vendorId) => {
    setApproving(vendorId);
    const token = getToken();
    await fetch(`${API_URL}/admin/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ vendorId }),
    });
    setApproving(null);
    fetchData();
  };

  const handleVerifyPayment = async (paymentId) => {
    setVerifying(paymentId);
    const token = getToken();
    await fetch(`${API_URL}/payments/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ paymentId }),
    });
    setVerifying(null);
    fetchData();
  };

  const handleCreateAgent = async () => {
    setAgentError("");
    setAgentSuccess("");
    const { name, email, phone, password } = agentForm;
    if (!name || !email || !phone || !password) {
      setAgentError("Semua ruangan wajib diisi.");
      return;
    }
    setCreatingAgent(true);
    const token = getToken();
    const result = await createAgent({ name, email, phone, password }, token);
    setCreatingAgent(false);
    if (result.agent) {
      setAgentSuccess(`Agen ${result.agent.name} berjaya dicipta.`);
      setAgentForm({ name: "", email: "", phone: "", password: "" });
      fetchData();
    } else {
      setAgentError(result.error || "Gagal mencipta agen.");
    }
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

          {/* PENDING VENDOR APPROVALS */}
          <div>
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
              Menunggu Kelulusan Vendor ({pending.length})
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
                    <img src={vendor.shopImage} alt={vendor.shopName}
                      className="w-14 h-14 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-gray-900 text-sm truncate">{vendor.shopName}</p>
                      <p className="text-[10px] text-gray-400 font-medium mt-0.5 truncate">{vendor.address}</p>
                      <p className="text-[10px] text-gray-400 font-medium">{vendor.state?.name}</p>
                      <p className="text-[10px] text-blue-600 font-black mt-1">Agen: {vendor.agent?.name}</p>
                    </div>
                  </div>
                  <button onClick={() => handleApprove(vendor.id)} disabled={approving === vendor.id}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-black py-3 rounded-xl text-xs uppercase tracking-widest active:scale-95 transition">
                    {approving === vendor.id ? "Meluluskan..." : "✓ Lulus & Aktifkan"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* PENDING PAYMENTS */}
          <div className="pt-2 border-t border-gray-100">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
              Resit Bayaran ({pendingPayments.length})
            </h2>
            {!loading && pendingPayments.length === 0 && (
              <div className="text-center py-10 border border-gray-100 rounded-2xl bg-gray-50">
                <p className="text-2xl mb-2">💳</p>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Tiada resit pending</p>
              </div>
            )}
            <div className="space-y-3">
              {pendingPayments.map((p) => (
                <div key={p.id} className="p-4 border border-gray-100 rounded-2xl bg-gray-50 space-y-3">
                  <div className="flex gap-3 items-start">
                    <img src={p.receiptImage} alt="resit"
                      className="w-14 h-14 rounded-xl object-cover shrink-0 border border-gray-200" />
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-gray-900 text-sm truncate">{p.vendor?.shopName}</p>
                      <p className="text-[10px] text-gray-400 font-medium mt-0.5">Agen: {p.agent?.name}</p>
                      <p className="text-[10px] text-gray-400 font-medium">{p.agent?.phone}</p>
                      <p className="text-base font-black text-green-700 mt-1">RM{Number(p.amount).toFixed(2)}</p>
                    </div>
                  </div>
                  <button onClick={() => handleVerifyPayment(p.id)} disabled={verifying === p.id}
                    className="w-full bg-blue-900 hover:bg-blue-800 disabled:bg-blue-400 text-white font-black py-3 rounded-xl text-xs uppercase tracking-widest active:scale-95 transition">
                    {verifying === p.id ? "Mengesahkan..." : "✓ Sahkan Bayaran"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* CREATE AGENT */}
          <div className="pt-4 border-t border-gray-100">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Lantik Agen Baru</h2>
            {agentSuccess && (
              <div className="bg-green-50 text-green-700 px-4 py-3 rounded-2xl text-xs font-black mb-4 border border-green-100 uppercase tracking-wide">
                ✅ {agentSuccess}
              </div>
            )}
            {agentError && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-2xl text-xs font-black mb-4 border border-red-100 uppercase tracking-wide">
                ⚠️ {agentError}
              </div>
            )}
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Nama</label>
                <input type="text" placeholder="cth. Ahmad Razif" value={agentForm.name}
                  onChange={(e) => setAgentForm({ ...agentForm, name: e.target.value })}
                  className="w-full px-4 py-3.5 border border-gray-100 rounded-2xl bg-gray-50 outline-none focus:border-blue-500 focus:bg-white transition text-sm font-medium text-gray-800 placeholder:text-gray-300" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">E-mel</label>
                <input type="email" placeholder="emel@gosuap.com" value={agentForm.email}
                  onChange={(e) => setAgentForm({ ...agentForm, email: e.target.value })}
                  className="w-full px-4 py-3.5 border border-gray-100 rounded-2xl bg-gray-50 outline-none focus:border-blue-500 focus:bg-white transition text-sm font-medium text-gray-800 placeholder:text-gray-300" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">No. Telefon</label>
                <input type="tel" placeholder="cth. 0123456789" value={agentForm.phone}
                  onChange={(e) => setAgentForm({ ...agentForm, phone: e.target.value })}
                  className="w-full px-4 py-3.5 border border-gray-100 rounded-2xl bg-gray-50 outline-none focus:border-blue-500 focus:bg-white transition text-sm font-medium text-gray-800 placeholder:text-gray-300" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Kata Laluan Sementara</label>
                <input type="password" placeholder="Min 8 aksara" value={agentForm.password}
                  onChange={(e) => setAgentForm({ ...agentForm, password: e.target.value })}
                  className="w-full px-4 py-3.5 border border-gray-100 rounded-2xl bg-gray-50 outline-none focus:border-blue-500 focus:bg-white transition text-sm font-medium text-gray-800 placeholder:text-gray-300" />
              </div>
              <button onClick={handleCreateAgent} disabled={creatingAgent}
                className="w-full bg-blue-900 hover:bg-blue-800 disabled:bg-blue-400 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest active:scale-[0.98] transition">
                {creatingAgent ? "Mencipta..." : "+ Lantik Agen"}
              </button>
            </div>
          </div>

          {/* LOGOUT */}
          <button onClick={handleLogout}
            className="w-full py-3 border border-red-400 text-red-500 rounded-xl text-xs font-black uppercase tracking-widest bg-transparent hover:bg-red-50 transition">
            Log Keluar
          </button>

        </div>
      </main>
    </div>
  );
}