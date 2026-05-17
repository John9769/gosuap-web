import Link from "next/link";

export const metadata = {
  title: "Dasar Privasi — GoSuap",
};

export default function PrivacyPage() {
  return (
    <main className="bg-[#0a1100] min-h-screen font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito:wght@400;700;800;900&display=swap');
        .font-bebas { font-family: 'Bebas Neue', sans-serif; }
        .font-nunito { font-family: 'Nunito', sans-serif; }
      `}</style>

      <div className="max-w-2xl mx-auto px-6 py-16">

        {/* Back */}
        <Link href="/">
          <span className="font-nunito text-[11px] font-black text-[#6aaa22] uppercase tracking-widest hover:text-[#b8e030] transition cursor-pointer">
            ← Kembali ke GoSuap
          </span>
        </Link>

        <h1 className="font-bebas text-[48px] text-white mt-6 mb-2 leading-none">DASAR PRIVASI</h1>
        <p className="font-nunito text-xs text-gray-500 mb-10">Kemaskini: Januari 2026</p>

        <div className="space-y-8 font-nunito text-gray-400 text-sm leading-relaxed">

          <section>
            <h2 className="font-bebas text-xl text-white mb-3 tracking-wide">1. Maklumat Syarikat</h2>
            <p>GoSuap adalah platform direktori makanan Muslim Malaysia yang dimiliki dan dikendalikan oleh:</p>
            <div className="mt-3 p-4 bg-[#0d1600] border border-[#1c2e00] rounded-2xl">
              <p className="text-white font-black">ICONIX GROUP SDN BHD (1506178-H)</p>
              <p className="mt-1">13-1, Jalan Setia Utara 8, Bandar Setia Fontaines,</p>
              <p>13200 Kepala Batas, Pulau Pinang, Malaysia</p>
              <p className="mt-1">Tel: 017-231 7077</p>
            </div>
          </section>

          <section>
            <h2 className="font-bebas text-xl text-white mb-3 tracking-wide">2. Maklumat Yang Kami Kumpul</h2>
            <p>GoSuap <span className="text-white font-black">tidak</span> mengumpul sebarang maklumat peribadi daripada pengguna awam. Tiada pendaftaran atau log masuk diperlukan untuk mencari kedai.</p>
            <p className="mt-3">Maklumat yang kami simpan adalah berkaitan <span className="text-white font-black">vendor (peniaga)</span> sahaja, termasuk:</p>
            <ul className="mt-2 space-y-1 ml-4 list-disc">
              <li>Nama kedai dan nombor telefon</li>
              <li>Alamat dan koordinat GPS kedai</li>
              <li>Gambar kedai dan menu</li>
              <li>Status ketersediaan GrabFood / FoodPanda</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bebas text-xl text-white mb-3 tracking-wide">3. Maklumat Agen</h2>
            <p>Agen yang dilantik oleh GoSuap akan mempunyai akaun dengan maklumat berikut:</p>
            <ul className="mt-2 space-y-1 ml-4 list-disc">
              <li>Nama penuh</li>
              <li>Alamat e-mel</li>
              <li>Nombor telefon</li>
              <li>Kata laluan (disimpan dalam bentuk terenkripsi)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bebas text-xl text-white mb-3 tracking-wide">4. Penyimpanan Data</h2>
            <p>Semua data disimpan dengan selamat menggunakan perkhidmatan berikut:</p>
            <ul className="mt-2 space-y-1 ml-4 list-disc">
              <li><span className="text-white font-black">Neon PostgreSQL</span> — pangkalan data utama</li>
              <li><span className="text-white font-black">Cloudinary</span> — storan gambar</li>
              <li><span className="text-white font-black">Render</span> — pelayan aplikasi</li>
              <li><span className="text-white font-black">Vercel</span> — platform web</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bebas text-xl text-white mb-3 tracking-wide">5. Penggunaan Maklumat</h2>
            <p>Maklumat vendor digunakan semata-mata untuk:</p>
            <ul className="mt-2 space-y-1 ml-4 list-disc">
              <li>Memaparkan kedai kepada pengguna awam</li>
              <li>Pengiraan jarak menggunakan GPS</li>
              <li>Navigasi via Waze</li>
            </ul>
            <p className="mt-3">Kami <span className="text-white font-black">tidak</span> berkongsi, menjual atau mendedahkan sebarang maklumat kepada pihak ketiga.</p>
          </section>

          <section>
            <h2 className="font-bebas text-xl text-white mb-3 tracking-wide">6. Hubungi Kami</h2>
            <p>Sebarang pertanyaan berkaitan privasi boleh diajukan kepada:</p>
            <p className="mt-2 text-white font-black">Tel: 017-231 7077</p>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t border-[#1c2e00]">
          <Link href="/terms">
            <span className="font-nunito text-[11px] font-black text-[#6aaa22] uppercase tracking-widest hover:text-[#b8e030] transition cursor-pointer">
              Baca Terma & Syarat →
            </span>
          </Link>
        </div>

      </div>
    </main>
  );
}