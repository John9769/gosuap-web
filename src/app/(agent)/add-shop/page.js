"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MenuInput from "@/components/MenuInput";
import { uploadImage, getStates, createVendor } from "@/lib/api";

export default function AddShop() {
  const router = useRouter();
  const [token, setToken] = useState("");

  // Form state
  const [shopName, setShopName] = useState("");
  const [shopPhone, setShopPhone] = useState("");
  const [address, setAddress] = useState("");
  const [stateId, setStateId] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [isGrab, setIsGrab] = useState(false);
  const [isPanda, setIsPanda] = useState(false);
  const [shopImage, setShopImage] = useState("");
  const [menuItems, setMenuItems] = useState([{ name: "", price: "", image: "" }]);

  // UI state
  const [states, setStates] = useState([]);
  const [locating, setLocating] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) { router.push("/login"); return; }
    setToken(t);
    getStates().then(setStates);
  }, [router]);

  const detectLocation = () => {
    if (!("geolocation" in navigator)) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toFixed(6));
        setLng(pos.coords.longitude.toFixed(6));
        setLocating(false);
      },
      () => setLocating(false)
    );
  };

  const handleCoverImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingCover(true);
    const result = await uploadImage(file, token);
    setUploadingCover(false);
    if (result.url) setShopImage(result.url);
  };

  const addItem = () => {
    if (menuItems.length < 5) {
      setMenuItems([...menuItems, { name: "", price: "", image: "" }]);
    }
  };

  const updateItem = (index, field, value) => {
    const updated = [...menuItems];
    updated[index][field] = value;
    setMenuItems(updated);
  };

  const handleSubmit = async () => {
    setError("");

    if (!shopName || !shopPhone || !address || !stateId || !lat || !lng || !shopImage) {
      setError("Sila lengkapkan semua maklumat termasuk gambar kedai dan GPS.");
      return;
    }

    for (const item of menuItems) {
      if (!item.name || !item.price || !item.image) {
        setError("Sila lengkapkan nama, harga, dan gambar untuk setiap item menu.");
        return;
      }
    }

    setSubmitting(true);

    const payload = {
      shopName,
      shopPhone,
      address,
      stateId,
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
      shopImage,
      isGrabFood: isGrab,
      isFoodPanda: isPanda,
      menuItems: menuItems.map((item) => ({
        name: item.name,
        price: parseFloat(item.price),
        image: item.image,
      })),
    };

    const result = await createVendor(payload, token);
    setSubmitting(false);

    if (result.vendor) {
      router.push("/agent-dashboard");
    } else {
      setError(result.error || "Gagal mendaftar vendor. Cuba lagi.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <main className="max-w-md mx-auto bg-white min-h-screen shadow-2xl pb-20">

        <header className="flex justify-between items-center px-6 py-5 border-b border-gray-100 bg-white sticky top-0 z-50">
          <div>
            <h1 className="text-lg font-black text-blue-900 leading-none tracking-tight">DAFTARKAN</h1>
            <p className="text-[10px] font-bold text-gray-400 tracking-[.2em] uppercase mt-0.5">Portal Vendor</p>
          </div>
          <img src="/logo.png" alt="GoSuap" className="h-10 w-auto object-contain" />
        </header>

        <div className="px-6 py-6 space-y-8">

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-2xl text-xs font-bold border border-red-100 uppercase tracking-wide">
              ⚠️ {error}
            </div>
          )}

          {/* 1. COVER PHOTO */}
          <section>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Gambar Kedai</label>
            <div className="relative w-full h-44 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center overflow-hidden hover:border-blue-300 transition">
              {uploadingCover ? (
                <span className="text-xs font-black text-blue-500">Memuat naik...</span>
              ) : shopImage ? (
                <img src={shopImage} alt="cover" className="w-full h-full object-cover" />
              ) : (
                <>
                  <span className="text-2xl mb-1">📷</span>
                  <span className="text-gray-400 font-bold text-xs">Ketik untuk muat naik</span>
                </>
              )}
              <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleCoverImage} disabled={uploadingCover} />
            </div>
          </section>

          {/* 2. BASIC INFO */}
          <section className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Nama Kedai</label>
              <input type="text" placeholder="cth. Nasi Lemak Ali" value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full px-4 py-3.5 border border-gray-100 rounded-2xl bg-gray-50 outline-none focus:border-blue-500 focus:bg-white transition text-sm font-medium text-gray-800 placeholder:text-gray-300" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">No. Telefon</label>
              <input type="tel" placeholder="cth. 0123456789" value={shopPhone}
                onChange={(e) => setShopPhone(e.target.value)}
                className="w-full px-4 py-3.5 border border-gray-100 rounded-2xl bg-gray-50 outline-none focus:border-blue-500 focus:bg-white transition text-sm font-medium text-gray-800 placeholder:text-gray-300" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Alamat</label>
              <input type="text" placeholder="cth. No 12, Jalan Ampang, KL" value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-3.5 border border-gray-100 rounded-2xl bg-gray-50 outline-none focus:border-blue-500 focus:bg-white transition text-sm font-medium text-gray-800 placeholder:text-gray-300" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Negeri</label>
              <select value={stateId} onChange={(e) => setStateId(e.target.value)}
                className="w-full px-4 py-3.5 border border-gray-100 rounded-2xl bg-gray-50 outline-none focus:border-blue-500 focus:bg-white transition text-sm font-medium text-gray-800">
                <option value="">-- Pilih Negeri --</option>
                {states.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </section>

          {/* 3. GPS */}
          <section className="p-5 bg-blue-50 rounded-3xl border border-blue-100">
            <p className="text-[10px] font-black text-blue-800 uppercase tracking-widest mb-3 text-center">Lokasi GPS Kedai</p>
            <button onClick={detectLocation} disabled={locating}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-black py-3 rounded-2xl mb-4 shadow-md shadow-blue-600/30 active:scale-95 transition text-sm uppercase tracking-widest">
              {locating ? "⏳ Mengesan..." : "📍 Kesan Koordinat"}
            </button>
            <div className="grid grid-cols-2 gap-2">
              <input type="text" value={lat} readOnly placeholder="Latitud"
                className="p-2.5 border border-gray-100 rounded-xl bg-white text-xs text-center font-mono text-gray-700 placeholder:text-gray-300" />
              <input type="text" value={lng} readOnly placeholder="Longitud"
                className="p-2.5 border border-gray-100 rounded-xl bg-white text-xs text-center font-mono text-gray-700 placeholder:text-gray-300" />
            </div>
          </section>

          {/* 4. MENU */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-black text-gray-800 uppercase text-xs tracking-widest">5 Menu Utama</h2>
              <span className="text-[10px] font-black bg-blue-900 text-white px-2.5 py-1 rounded-full">{menuItems.length} / 5</span>
            </div>
            <div className="space-y-3">
              {menuItems.map((item, index) => (
                <MenuInput key={index} index={index} item={item} updateItem={updateItem} token={token} />
              ))}
            </div>
            {menuItems.length < 5 && (
              <button onClick={addItem}
                className="w-full py-4 border-2 border-dashed border-gray-200 text-gray-400 font-bold rounded-2xl mt-4 text-sm hover:border-gray-300 hover:text-gray-500 transition">
                + Tambah Item
              </button>
            )}
          </section>

          {/* 5. DELIVERY TOGGLES */}
          <section className="pt-6 border-t border-gray-100">
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4">Tersedia juga di:</p>
            <div className="flex gap-10 px-1">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={isGrab} onChange={() => setIsGrab(!isGrab)}
                  className="w-5 h-5 accent-green-600 rounded" />
                <span className="text-xs font-black text-gray-500 uppercase">GrabFood</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={isPanda} onChange={() => setIsPanda(!isPanda)}
                  className="w-5 h-5 accent-pink-600 rounded" />
                <span className="text-xs font-black text-gray-500 uppercase">FoodPanda</span>
              </label>
            </div>
          </section>

          {/* SUBMIT */}
          <button onClick={handleSubmit} disabled={submitting}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-black py-5 rounded-3xl shadow-xl shadow-green-600/30 text-base uppercase tracking-widest active:scale-[0.98] transition">
            {submitting ? "Menghantar..." : "Daftar Vendor"}
          </button>

        </div>
      </main>
    </div>
  );
}