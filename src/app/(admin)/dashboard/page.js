"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createAgent, resetAgentPassword } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const MONTH_NAMES = ["", "Jan", "Feb", "Mac", "Apr", "Mei", "Jun", "Jul", "Ogos", "Sep", "Okt", "Nov", "Dis"];

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function AdminDashboard() {
  const [pending, setPending] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(null);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [verifying, setVerifying] = useState(null);
  const [activeVendors, setActiveVendors] = useState([]);
  const [settingPremium, setSettingPremium] = useState(null);
  const [expiringVendors, setExpiringVendors] = useState([]);
  const [agentStats, setAgentStats] = useState([]);
  const [expandedAgent, setExpandedAgent] = useState(null);

  // Reset password per agent
  const [resetPasswords, setResetPasswords] = useState({});
  const [resetting, setResetting] = useState(null);
  const [resetMessages, setResetMessages] = useState({});

  const [agentForm, setAgentForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [creatingAgent, setCreatingAgent] = useState(false);
  const [agentSuccess, setAgentSuccess] = useState("");
  const [agentError, setAgentError] = useState("");

  const router = useRouter();
  const getToken = () => localStorage.getItem("token");

  const checkAuth = () => {
    const token = getToken();
    const role = localStorage.getItem("agentRole");
    if (!token || role !== "ADMIN") { router.push("/login"); return false; }
    return true;
  };

  const fetchData = async () => {
    if (!checkAuth()) return;
    setLoading(true);
    const token = getToken();
    const [pendingRes, statsRes, paymentsRes, vendorsRes, expiringRes, agentsRes] = await Promise.all([
      fetch(`${API_URL}/admin/pending`, { headers: { Authorization: `Bearer ${token}` } }),
      fetch(`${API_URL}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } }),
      fetch(`${API_URL}/payments/pending`, { headers: { Authorization: `Bearer ${token}` } }),
      fetch(`${API_URL}/admin/vendors`, { headers: { Authorization: `Bearer ${token}` } }),
      fetch(`${API_URL}/admin/expiring`, { headers: { Authorization: `Bearer ${token}` } }),
      fetch(`${API_URL}/admin/agents`, { headers: { Authorization: `Bearer ${token}` } }),
    ]);
    const [pendingData, statsData, paymentsData, vendorsData, expiringData, agentsData] = await Promise.all([
      pendingRes.json(), statsRes.json(), paymentsRes.json(),
      vendorsRes.json(), expiringRes.json(), agentsRes.json(),
    ]);
    setPending(Array.isArray(pendingData) ? pendingData : []);
    setStats(statsData);
    setPendingPayments(Array.isArray(paymentsData) ? paymentsData : []);
    setActiveVendors(Array.isArray(vendorsData) ? vendorsData : []);
    setExpiringVendors(Array.isArray(expiringData) ? expiringData : []);
    setAgentStats(Array.isArray(agentsData) ? agentsData : []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleApprove = async (vendorId) => {
    setApproving(vendorId);
    await fetch(`${API_URL}/admin/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ vendorId }),
    });
    setApproving(null); fetchData();
  };

  const handleVerifyPayment = async (paymentId) => {
    setVerifying(paymentId);
    await fetch(`${API_URL}/payments/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ paymentId }),
    });
    setVerifying(null); fetchData();
  };

  const handleSetPremium = async (vendorId, isPremium) => {
    setSettingPremium(vendorId);
    await fetch(`${API_URL}/admin/set-premium`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ vendorId, isPremium, months: 1 }),
    });
    setSettingPremium(null); fetchData();
  };

  const handleResetPassword = async (agentId) => {
    const newPassword = resetPasswords[agentId];
    if (!newPassword || newPassword.length < 8) {
      setResetMessages({ ...resetMessages, [agentId]: { type: 'error', text: 'Min 8 aksara.' } });
      return;
    }
    setResetting(agentId);
    const result = await resetAgentPassword(agentId, newPassword, getToken());
    setResetting(null);
    if (result.message) {
      setResetMessages({ ...resetMessages, [agentId]: { type: 'success', text: result.message } });
      setResetPasswords({ ...resetPasswords, [agentId]: "" });
    } else {
      setResetMessages({ ...resetMessages, [agentId]: { type: 'error', text: result.error || 'Gagal.' } });
    }
  };

  const handleCreateAgent = async () => {
    setAgentError(""); setAgentSuccess("");
    const { name, email, phone, password } = agentForm;
    if (!name || !email || !phone || !password) { setAgentError("Semua ruangan wajib diisi."); return; }
    setCreatingAgent(true);
    const result = await createAgent({ name, email, phone, password }, getToken());
    setCreatingAgent(false);
    if (result.agent) {
      setAgentSuccess(`Agen ${result.agent.name} berjaya dicipta.`);
      setAgentForm({ name: "", email: "", phone: "", password: "" });
      fetchData();
    } else {
      setAgentError(result.error || "Gagal mencipta agen.");
    }
  };

  const handleLogout = () => { localStorage.clear(); window.location.href = "/"; };

  const whatsappLink = (phone) => {
    const clean = phone.replace(/^0/, '60').replace(/\D/g, '');
    return `https://wa.me/${clean}`;
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <main className="max-w-md mx-auto bg-white min-h-screen shadow-2xl pb-20">

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
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center py-3 border border-gray-100 rounded-2xl bg-gray-50">
                  <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Jumlah</p>
                  <p className="text-2xl font-black text-gray-800 mt-0.5">{stats.totalVendors ?? 0}</p>
                </div>
                <div className="text-center py-3 border border-gray-100 rounded-2xl bg-gray-50">
                  <p className="text-[9px] font-black text-green-600 uppercase tracking-widest">Aktif</p>
                  <p className="text-2xl font-black text-gray-800 mt-0.5">{stats.activeVendors ?? 0}</p>
                </div>
                <div className="text-center py-3 border border-gray-100 rounded-2xl bg-gray-50">
                  <p className="text-[9px] font-black text-yellow-600 uppercase tracking-widest">Pending</p>
                  <p className="text-2xl font-black text-gray-800 mt-0.5">{stats.pendingVendors ?? 0}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center py-3 border border-orange-100 rounded-2xl bg-orange-50">
                  <p className="text-[9px] font-black text-orange-600 uppercase tracking-widest">Tamat ≤30h</p>
                  <p className="text-2xl font-black text-orange-700 mt-0.5">{stats.expiringVendors ?? 0}</p>
                </div>
                <div className="text-center py-3 border border-yellow-100 rounded-2xl bg-yellow-50">
                  <p className="text-[9px] font-black text-yellow-600 uppercase tracking-widest">Premium</p>
                  <p className="text-2xl font-black text-yellow-700 mt-0.5">{stats.premiumVendors ?? 0}</p>
                </div>
                <div className="text-center py-3 border border-blue-100 rounded-2xl bg-blue-50">
                  <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Agen</p>
                  <p className="text-2xl font-black text-blue-700 mt-0.5">{stats.totalAgents ?? 0}</p>
                </div>
              </div>
            </div>
          )}

          {/* PENDING APPROVALS */}
          <div>
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Menunggu Kelulusan Vendor ({pending.length})</h2>
            {loading && <p className="text-center text-gray-400 text-xs font-bold py-8 uppercase tracking-widest">Memuatkan...</p>}
            {!loading && pending.length === 0 && (
              <div className="text-center py-8 border border-gray-100 rounded-2xl bg-gray-50">
                <p className="text-2xl mb-1">✅</p>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Tiada pending</p>
              </div>
            )}
            <div className="space-y-3">
              {pending.map((vendor) => (
                <div key={vendor.id} className="p-4 border border-gray-100 rounded-2xl bg-gray-50 space-y-3">
                  <div className="flex gap-3 items-start">
                    <img src={vendor.shopImage} alt={vendor.shopName} className="w-14 h-14 rounded-xl object-cover shrink-0" />
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

          {/* RECEIPT VERIFICATION */}
          <div className="pt-2 border-t border-gray-100">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Resit Bayaran ({pendingPayments.length})</h2>
            {!loading && pendingPayments.length === 0 && (
              <div className="text-center py-8 border border-gray-100 rounded-2xl bg-gray-50">
                <p className="text-2xl mb-1">💳</p>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Tiada resit pending</p>
              </div>
            )}
            <div className="space-y-3">
              {pendingPayments.map((p) => (
                <div key={p.id} className="p-4 border border-gray-100 rounded-2xl bg-gray-50 space-y-3">
                  <div className="flex gap-3 items-start">
                    <img src={p.receiptImage} alt="resit" className="w-14 h-14 rounded-xl object-cover shrink-0 border border-gray-200" />
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-gray-900 text-sm truncate">{p.vendor?.shopName}</p>
                      <p className="text-[10px] text-gray-400 font-medium mt-0.5">Agen: {p.agent?.name}</p>
                      <p className="text-[10px] text-gray-400 font-medium">{p.agent?.phone}</p>
                      {p.paymentMonth && p.paymentYear && (
                        <p className="text-[10px] text-blue-600 font-black">{MONTH_NAMES[p.paymentMonth]} {p.paymentYear}</p>
                      )}
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

          {/* RENEWAL TRACKER */}
          <div className="pt-2 border-t border-orange-100">
            <h2 className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-3">🔔 Penuh Tempoh — Perlu Diperbaharui ({expiringVendors.length})</h2>
            {!loading && expiringVendors.length === 0 && (
              <div className="text-center py-8 border border-gray-100 rounded-2xl bg-gray-50">
                <p className="text-2xl mb-1">✅</p>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Tiada yang hampir tamat</p>
              </div>
            )}
            <div className="space-y-3">
              {expiringVendors.map((vendor) => {
                const days = daysUntil(vendor.expiryDate);
                return (
                  <div key={vendor.id} className="p-4 border border-orange-100 rounded-2xl bg-orange-50 space-y-3">
                    <div className="flex gap-3 items-start">
                      <img src={vendor.shopImage} alt={vendor.shopName} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-gray-900 text-sm truncate">{vendor.shopName}</p>
                        <p className="text-[10px] text-gray-500 font-medium">{vendor.state?.name}</p>
                        <p className="text-[10px] text-blue-600 font-black">Agen: {vendor.agent?.name}</p>
                        <p className={`text-[10px] font-black mt-0.5 ${days <= 7 ? 'text-red-600' : 'text-orange-600'}`}>⏳ {days} hari lagi</p>
                      </div>
                    </div>
                    <a href={whatsappLink(vendor.agent?.phone)} target="_blank" rel="noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-black py-2.5 rounded-xl text-xs uppercase tracking-widest transition">
                      💬 WhatsApp Agen
                    </a>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PREMIUM MANAGEMENT */}
          <div className="pt-2 border-t border-gray-100">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Urus Premium ({activeVendors.length})</h2>
            {!loading && activeVendors.length === 0 && (
              <div className="text-center py-8 border border-gray-100 rounded-2xl bg-gray-50">
                <p className="text-2xl mb-1">⭐</p>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Tiada vendor aktif</p>
              </div>
            )}
            <div className="space-y-3">
              {activeVendors.map((vendor) => (
                <div key={vendor.id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-2xl bg-gray-50">
                  <img src={vendor.shopImage} alt={vendor.shopName} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-gray-900 text-sm truncate">{vendor.shopName}</p>
                    <p className="text-[10px] text-gray-400 font-medium truncate">{vendor.state?.name}</p>
                    {vendor.isPremium && <span className="text-[9px] font-black text-yellow-600 uppercase">⭐ Premium Aktif</span>}
                  </div>
                  <button onClick={() => handleSetPremium(vendor.id, !vendor.isPremium)} disabled={settingPremium === vendor.id}
                    className={`shrink-0 text-[9px] font-black px-3 py-2 rounded-xl uppercase tracking-widest transition active:scale-95 disabled:opacity-50 ${
                      vendor.isPremium ? 'bg-red-50 text-red-500 border border-red-200 hover:bg-red-100'
                        : 'bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100'
                    }`}>
                    {settingPremium === vendor.id ? '...' : vendor.isPremium ? 'Buang' : '⭐ Set'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* AGENT PERFORMANCE — expandable */}
          <div className="pt-2 border-t border-gray-100">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Prestasi Agen ({agentStats.length})</h2>
            {!loading && agentStats.length === 0 && (
              <div className="text-center py-8 border border-gray-100 rounded-2xl bg-gray-50">
                <p className="text-2xl mb-1">👤</p>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Tiada agen</p>
              </div>
            )}
            <div className="space-y-3">
              {agentStats.map((agent, index) => (
                <div key={agent.id} className="border border-gray-100 rounded-2xl bg-gray-50 overflow-hidden">
                  <div className="p-4 cursor-pointer" onClick={() => setExpandedAgent(expandedAgent === agent.id ? null : agent.id)}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-black text-xs ${
                        index === 0 ? 'bg-yellow-400 text-yellow-900' : index === 1 ? 'bg-gray-300 text-gray-700'
                          : index === 2 ? 'bg-orange-300 text-orange-900' : 'bg-gray-100 text-gray-500'
                      }`}>{index + 1}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-gray-900 text-sm truncate">{agent.name}</p>
                        <p className="text-[10px] text-gray-400 font-medium">{agent.phone}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-black text-green-700">RM{Number(agent.totalCollected).toFixed(2)}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase">Kutipan</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center py-2 bg-white rounded-xl border border-gray-100">
                        <p className="text-base font-black text-gray-800">{agent.totalVendors}</p>
                        <p className="text-[8px] font-black text-gray-400 uppercase">Direkrut</p>
                      </div>
                      <div className="text-center py-2 bg-white rounded-xl border border-gray-100">
                        <p className="text-base font-black text-green-700">{agent.activeVendors}</p>
                        <p className="text-[8px] font-black text-gray-400 uppercase">Aktif</p>
                      </div>
                      <div className="text-center py-2 bg-white rounded-xl border border-gray-100">
                        <p className="text-base font-black text-yellow-600">{agent.pendingVendors}</p>
                        <p className="text-[8px] font-black text-gray-400 uppercase">Pending</p>
                      </div>
                    </div>
                    <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest text-center mt-2">
                      {expandedAgent === agent.id ? '▲ Tutup' : '▼ Lihat Detail'}
                    </p>
                  </div>

                  {expandedAgent === agent.id && (
                    <div className="border-t border-gray-100 bg-white px-4 py-3 space-y-2">
                      {agent.vendors.length === 0 && <p className="text-xs text-gray-400 font-bold text-center py-2">Tiada vendor</p>}
                      {agent.vendors.map((v) => {
                        const days = daysUntil(v.expiryDate);
                        const expiryColor = v.expiryStatus === 'expired' ? 'text-red-500' : v.expiryStatus === 'expiring' ? 'text-orange-500' : 'text-green-600';
                        const expiryBg = v.expiryStatus === 'expired' ? 'bg-red-50 border-red-100' : v.expiryStatus === 'expiring' ? 'bg-orange-50 border-orange-100' : 'bg-green-50 border-green-100';
                        return (
                          <div key={v.id} className={`flex items-center justify-between p-2.5 rounded-xl border ${expiryBg}`}>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-black text-gray-900 truncate">{v.shopName}</p>
                              <p className="text-[9px] text-gray-400 font-medium">{v.state}</p>
                              {v.isPremium && <span className="text-[9px] font-black text-yellow-600">⭐ Premium</span>}
                            </div>
                            <span className={`text-[9px] font-black ${expiryColor} uppercase ml-2 shrink-0`}>
                              {v.expiryStatus === 'expired' ? 'Tamat' : v.expiryStatus === 'expiring' ? `${days}h lagi` : `${days}h`}
                            </span>
                          </div>
                        );
                      })}

                      {Object.keys(agent.monthlyRevenue).length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Kutipan Bulanan</p>
                          {Object.entries(agent.monthlyRevenue).sort((a, b) => b[0].localeCompare(a[0])).slice(0, 6).map(([key, amount]) => {
                            const [year, month] = key.split('-');
                            return (
                              <div key={key} className="flex justify-between items-center py-1">
                                <p className="text-[10px] font-bold text-gray-600">{MONTH_NAMES[parseInt(month)]} {year}</p>
                                <p className="text-[10px] font-black text-green-700">RM{Number(amount).toFixed(2)}</p>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* RESET PASSWORD */}
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Set Semula Kata Laluan</p>
                        {resetMessages[agent.id] && (
                          <div className={`px-3 py-2 rounded-xl text-[10px] font-black mb-2 ${
                            resetMessages[agent.id].type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                          }`}>
                            {resetMessages[agent.id].text}
                          </div>
                        )}
                        <div className="flex gap-2">
                          <input type="password" placeholder="Kata laluan baharu" value={resetPasswords[agent.id] || ""}
                            onChange={(e) => setResetPasswords({ ...resetPasswords, [agent.id]: e.target.value })}
                            className="flex-1 px-3 py-2.5 border border-gray-100 rounded-xl bg-gray-50 outline-none focus:border-blue-500 text-xs font-medium text-gray-800 placeholder:text-gray-300" />
                          <button onClick={() => handleResetPassword(agent.id)} disabled={resetting === agent.id}
                            className="shrink-0 bg-blue-900 hover:bg-blue-800 disabled:bg-blue-400 text-white font-black px-3 py-2.5 rounded-xl text-[10px] uppercase tracking-widest transition">
                            {resetting === agent.id ? '...' : 'Set'}
                          </button>
                        </div>
                      </div>

                      <a href={whatsappLink(agent.phone)} target="_blank" rel="noreferrer"
                        className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-black py-2.5 rounded-xl text-xs uppercase tracking-widest transition mt-2">
                        💬 WhatsApp {agent.name}
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CREATE AGENT */}
          <div className="pt-4 border-t border-gray-100">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Lantik Agen Baru</h2>
            {agentSuccess && <div className="bg-green-50 text-green-700 px-4 py-3 rounded-2xl text-xs font-black mb-4 border border-green-100 uppercase tracking-wide">✅ {agentSuccess}</div>}
            {agentError && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-2xl text-xs font-black mb-4 border border-red-100 uppercase tracking-wide">⚠️ {agentError}</div>}
            <div className="space-y-3">
              {[
                { label: "Nama", key: "name", type: "text", placeholder: "cth. Ahmad Razif" },
                { label: "E-mel", key: "email", type: "email", placeholder: "emel@gosuap.com" },
                { label: "No. Telefon", key: "phone", type: "tel", placeholder: "cth. 0123456789" },
                { label: "Kata Laluan Sementara", key: "password", type: "password", placeholder: "Min 8 aksara" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={agentForm[f.key]}
                    onChange={(e) => setAgentForm({ ...agentForm, [f.key]: e.target.value })}
                    className="w-full px-4 py-3.5 border border-gray-100 rounded-2xl bg-gray-50 outline-none focus:border-blue-500 focus:bg-white transition text-sm font-medium text-gray-800 placeholder:text-gray-300" />
                </div>
              ))}
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