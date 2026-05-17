"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAgentVendors, uploadImage, submitPayment, getAgentPayments, changePassword } from "@/lib/api";

const MONTHS = [
  { value: 1, label: "Januari" }, { value: 2, label: "Februari" },
  { value: 3, label: "Mac" }, { value: 4, label: "April" },
  { value: 5, label: "Mei" }, { value: 6, label: "Jun" },
  { value: 7, label: "Julai" }, { value: 8, label: "Ogos" },
  { value: 9, label: "September" }, { value: 10, label: "Oktober" },
  { value: 11, label: "November" }, { value: 12, label: "Disember" },
];

const YEARS = [2026, 2027, 2028];

export default function AgentDashboard() {
  const [agent, setAgent] = useState({ name: "", id: "" });
  const [approved, setApproved] = useState(0);
  const [pending, setPending] = useState(0);
  const [vendors, setVendors] = useState([]);
  const [payments, setPayments] = useState([]);

  // Payment form
  const [selectedVendor, setSelectedVendor] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMonth, setPaymentMonth] = useState("");
  const [paymentYear, setPaymentYear] = useState("");
  const [receiptImage, setReceiptImage] = useState("");
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState("");
  const [paymentError, setPaymentError] = useState("");

  // Change password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [pwSuccess, setPwSuccess] = useState("");
  const [pwError, setPwError] = useState("");

  const router = useRouter();
  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    const name = localStorage.getItem("agentName");
    const id = localStorage.getItem("agentId");
    const token = getToken();
    if (!token) { router.push("/login"); return; }
    setAgent({ name: name || "Agent", id: id || "---" });
    getAgentVendors(token).then((data) => {
      if (Array.isArray(data)) {
        setVendors(data);
        setApproved(data.filter((v) => v.status === "ACTIVE").length);
        setPending(data.filter((v) => v.status === "PENDING").length);
      }
    });
    getAgentPayments(token).then((data) => {
      if (Array.isArray(data)) setPayments(data);
    });
  }, [router]);

  const handleReceiptUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingReceipt(true);
    const result = await uploadImage(file, getToken());
    setUploadingReceipt(false);
    if (result.url) setReceiptImage(result.url);
  };

  const handleSubmitPayment = async () => {
    setPaymentError(""); setPaymentSuccess("");
    if (!selectedVendor || !amount || !receiptImage || !paymentMonth || !paymentYear) {
      setPaymentError("Sila lengkapkan semua maklumat termasuk bulan dan tahun bayaran.");
      return;
    }
    setSubmittingPayment(true);
    const result = await submitPayment({
      vendorId: selectedVendor, amount: parseFloat(amount),
      receiptImage, paymentMonth: parseInt(paymentMonth), paymentYear: parseInt(paymentYear),
    }, getToken());
    setSubmittingPayment(false);
    if (result.payment) {
      setPaymentSuccess("Resit berjaya dihantar. Menunggu pengesahan admin.");
      setSelectedVendor(""); setAmount(""); setPaymentMonth(""); setPaymentYear(""); setReceiptImage("");
      getAgentPayments(getToken()).then((data) => { if (Array.isArray(data)) setPayments(data); });
    } else {
      setPaymentError(result.error || "Gagal menghantar resit.");
    }
  };

  const handleChangePassword = async () => {
    setPwError(""); setPwSuccess("");
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPwError("Sila isi semua ruangan kata laluan.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError("Kata laluan baharu tidak sepadan.");
      return;
    }
    if (newPassword.length < 8) {
      setPwError("Kata laluan baharu mestilah sekurang-kurangnya 8 aksara.");
      return;
    }
    setChangingPassword(true);
    const result = await changePassword(currentPassword, newPassword, getToken());
    setChangingPassword(false);
    if (result.message) {
      setPwSuccess("Kata laluan berjaya ditukar.");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } else {
      setPwError(result.error || "Gagal menukar kata laluan.");
    }
  };

  const handleLogout = () => { localStorage.clear(); window.location.href = "/"; };
  const activeVendors = vendors.filter((v) => v.status === "ACTIVE");

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center py-5 font-sans">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl overflow-hidden rounded-3xl pb-10">

        {/* HEADER */}
        <header className="flex justify-between items-center px-6 py-5 border-b border-gray-100 bg-white sticky top-0 z-50">
          <div>
            <h1 className="text-lg font-black text-blue-900 leading-none tracking-tight">DASHBOARD</h1>
            <p className="text-[10px] font-bold text-gray-400 tracking-[.2em] uppercase mt-0.5">PORTAL RASMI</p>
          </div>
          <img src="/logo.png" alt="GoSuap" className="h-10 w-auto object-contain" />
        </header>

        {/* AGENT BANNER */}
        <div className="px-6 py-6 bg-blue-900 text-white">
          <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Log masuk sebagai</p>
          <h2 className="text-2xl font-black uppercase mt-1 mb-2">{agent.name}</h2>
          <span className="text-[10px] font-bold bg-white/20 px-3 py-1 rounded-full">ID: {agent.id}</span>
        </div>

        <div className="px-6 py-6 space-y-6">

          {/* RECRUIT CTA */}
          <Link href="/add-shop" className="block no-underline">
            <div className="bg-green-600 hover:bg-green-700 active:scale-[0.98] transition text-white px-6 py-5 rounded-2xl text-center font-black text-base uppercase tracking-widest shadow-lg shadow-green-600/30 cursor-pointer">
              + DAFTARKAN VENDOR
            </div>
          </Link>

          {/* STATS */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center py-5 border border-gray-100 rounded-2xl bg-gray-50">
              <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Diluluskan</p>
              <p className="text-3xl font-black text-gray-800 mt-1">{approved}</p>
            </div>
            <div className="text-center py-5 border border-gray-100 rounded-2xl bg-gray-50">
              <p className="text-[10px] font-black text-yellow-600 uppercase tracking-widest">Menunggu</p>
              <p className="text-3xl font-black text-gray-800 mt-1">{pending}</p>
            </div>
          </div>

          {/* SUBMIT PAYMENT */}
          <div className="pt-2 border-t border-gray-100">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Hantar Resit Bayaran</h2>
            {paymentSuccess && <div className="bg-green-50 text-green-700 px-4 py-3 rounded-2xl text-xs font-black mb-4 border border-green-100 uppercase tracking-wide">✅ {paymentSuccess}</div>}
            {paymentError && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-2xl text-xs font-black mb-4 border border-red-100 uppercase tracking-wide">⚠️ {paymentError}</div>}
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pilih Vendor</label>
                <select value={selectedVendor} onChange={(e) => setSelectedVendor(e.target.value)}
                  className="w-full px-4 py-3.5 border border-gray-100 rounded-2xl bg-gray-50 outline-none focus:border-blue-500 focus:bg-white transition text-sm font-medium text-gray-800">
                  <option value="">-- Pilih Kedai --</option>
                  {activeVendors.map((v) => (<option key={v.id} value={v.id}>{v.shopName}</option>))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Bulan</label>
                  <select value={paymentMonth} onChange={(e) => setPaymentMonth(e.target.value)}
                    className="w-full px-4 py-3.5 border border-gray-100 rounded-2xl bg-gray-50 outline-none focus:border-blue-500 focus:bg-white transition text-sm font-medium text-gray-800">
                    <option value="">-- Bulan --</option>
                    {MONTHS.map((m) => (<option key={m.value} value={m.value}>{m.label}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Tahun</label>
                  <select value={paymentYear} onChange={(e) => setPaymentYear(e.target.value)}
                    className="w-full px-4 py-3.5 border border-gray-100 rounded-2xl bg-gray-50 outline-none focus:border-blue-500 focus:bg-white transition text-sm font-medium text-gray-800">
                    <option value="">-- Tahun --</option>
                    {YEARS.map((y) => (<option key={y} value={y}>{y}</option>))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Amaun (RM)</label>
                <input type="number" placeholder="cth. 60.00" value={amount} onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3.5 border border-gray-100 rounded-2xl bg-gray-50 outline-none focus:border-blue-500 focus:bg-white transition text-sm font-medium text-gray-800 placeholder:text-gray-300" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Gambar Resit</label>
                <div className="relative w-full h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center overflow-hidden hover:border-blue-300 transition">
                  {uploadingReceipt ? <span className="text-xs font-black text-blue-500">Memuat naik...</span>
                    : receiptImage ? <img src={receiptImage} alt="resit" className="w-full h-full object-cover" />
                    : <><span className="text-xl mb-1">🧾</span><span className="text-gray-400 font-bold text-xs">Klik untuk muat naik resit</span></>}
                  <input type="file" accept="image/*" capture="environment" className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleReceiptUpload} disabled={uploadingReceipt} />
                </div>
              </div>
              <button onClick={handleSubmitPayment} disabled={submittingPayment}
                className="w-full bg-blue-900 hover:bg-blue-800 disabled:bg-blue-400 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest active:scale-[0.98] transition">
                {submittingPayment ? "Menghantar..." : "📤 Hantar Resit"}
              </button>
            </div>
          </div>

          {/* PAYMENT HISTORY */}
          {payments.length > 0 && (
            <div className="pt-2 border-t border-gray-100">
              <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Sejarah Bayaran</h2>
              <div className="space-y-3">
                {payments.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-2xl bg-gray-50">
                    <img src={p.receiptImage} alt="resit" className="w-12 h-12 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-gray-900 truncate">{p.vendor?.shopName}</p>
                      <p className="text-xs font-bold text-gray-400">RM{Number(p.amount).toFixed(2)}</p>
                      {p.paymentMonth && p.paymentYear && (
                        <p className="text-[10px] font-bold text-blue-500">
                          {MONTHS.find(m => m.value === p.paymentMonth)?.label} {p.paymentYear}
                        </p>
                      )}
                    </div>
                    <span className={`text-[9px] font-black px-2 py-1 rounded-full uppercase ${p.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {p.isVerified ? "Disahkan" : "Menunggu"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CHANGE PASSWORD */}
          <div className="pt-4 border-t border-gray-100">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Tukar Kata Laluan</h2>
            {pwSuccess && <div className="bg-green-50 text-green-700 px-4 py-3 rounded-2xl text-xs font-black mb-4 border border-green-100 uppercase tracking-wide">✅ {pwSuccess}</div>}
            {pwError && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-2xl text-xs font-black mb-4 border border-red-100 uppercase tracking-wide">⚠️ {pwError}</div>}
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Kata Laluan Semasa</label>
                <input type="password" placeholder="••••••••" value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3.5 border border-gray-100 rounded-2xl bg-gray-50 outline-none focus:border-blue-500 focus:bg-white transition text-sm font-medium text-gray-800 placeholder:text-gray-300" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Kata Laluan Baharu</label>
                <input type="password" placeholder="Min 8 aksara" value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3.5 border border-gray-100 rounded-2xl bg-gray-50 outline-none focus:border-blue-500 focus:bg-white transition text-sm font-medium text-gray-800 placeholder:text-gray-300" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Sahkan Kata Laluan Baharu</label>
                <input type="password" placeholder="Ulang kata laluan baharu" value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3.5 border border-gray-100 rounded-2xl bg-gray-50 outline-none focus:border-blue-500 focus:bg-white transition text-sm font-medium text-gray-800 placeholder:text-gray-300" />
              </div>
              <button onClick={handleChangePassword} disabled={changingPassword}
                className="w-full bg-blue-900 hover:bg-blue-800 disabled:bg-blue-400 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest active:scale-[0.98] transition">
                {changingPassword ? "Menukar..." : "🔒 Tukar Kata Laluan"}
              </button>
            </div>
          </div>

          {/* LOGOUT */}
          <button onClick={handleLogout}
            className="w-full py-3 border border-red-400 text-red-500 rounded-xl text-xs font-black uppercase tracking-widest bg-transparent hover:bg-red-50 transition cursor-pointer">
            Log Keluar
          </button>

        </div>
      </div>
    </div>
  );
}