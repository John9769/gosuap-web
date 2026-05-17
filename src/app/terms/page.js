import Link from "next/link";

export const metadata = {
  title: "Terma & Syarat — GoSuap",
};

export default function TermsPage() {
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

        <h1 className="font-bebas text-[48px] text-white mt-6 mb-2 leading-none">TERMA & SYARAT</h1>
        <p className="font-nunito text-xs text-gray-500 mb-10">Kemaskini: Januari 2026</p>

        <div className="space-y-8 font-nunito text-gray-400 text-sm leading-relaxed">

          <section>
            <h2 className="font-bebas text-xl text-white mb-3 tracking-wide">1. Penerimaan Terma</h2>
            <p>Dengan menggunakan platform GoSuap, anda bersetuju untuk mematuhi terma dan syarat yang ditetapkan oleh ICONIX GROUP SDN BHD (1506178-H). Jika anda tidak bersetuju, sila hentikan penggunaan platform ini.</p>
          </section>

          <section>
            <h2 className="font-bebas text-xl text-white mb-3 tracking-wide">2. Perkhidmatan GoSuap</h2>
            <p>GoSuap adalah platform direktori dalam talian yang menghubungkan pengguna dengan peniaga makanan Muslim yang telah disahkan. Kami tidak menyediakan perkhidmatan penghantaran makanan secara langsung.</p>
          </section>

          <section>
            <h2 className="font-bebas text-xl text-white mb-3 tracking-wide">3. Pendaftaran Vendor</h2>
            <ul className="space-y-2 ml-4 list-disc">
              <li>Pendaftaran vendor hanya boleh dilakukan melalui agen yang dilantik secara rasmi oleh GoSuap.</li>
              <li>Vendor yang didaftarkan mestilah peniaga makanan Muslim yang sah.</li>
              <li>Semua maklumat yang diberikan semasa pendaftaran mestilah tepat dan benar.</li>
              <li>GoSuap berhak untuk menolak atau membatalkan pendaftaran mana-mana vendor tanpa sebarang sebab.</li>
              <li>Vendor yang diluluskan akan dipaparkan dalam platform selama tempoh langganan yang ditetapkan.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bebas text-xl text-white mb-3 tracking-wide">4. Tanggungjawab Agen</h2>
            <ul className="space-y-2 ml-4 list-disc">
              <li>Agen bertanggungjawab untuk memastikan kesahihan vendor yang didaftarkan.</li>
              <li>Agen bertanggungjawab untuk mengutip bayaran daripada vendor dan menyerahkan kepada GoSuap.</li>
              <li>Agen wajib memuat naik bukti pembayaran melalui sistem selepas setiap kutipan.</li>
              <li>Sebarang penipuan atau salah laku oleh agen boleh menyebabkan penamatan akaun serta-merta.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bebas text-xl text-white mb-3 tracking-wide">5. Bayaran & Langganan</h2>
            <ul className="space-y-2 ml-4 list-disc">
              <li>Bayaran langganan vendor adalah seperti yang ditetapkan oleh GoSuap dari semasa ke semasa.</li>
              <li>Bayaran yang telah dibuat tidak boleh dikembalikan.</li>
              <li>Vendor yang gagal memperbaharui langganan akan dikeluarkan daripada senarai carian secara automatik.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bebas text-xl text-white mb-3 tracking-wide">6. Kandungan Platform</h2>
            <ul className="space-y-2 ml-4 list-disc">
              <li>Semua gambar dan maklumat yang dimuat naik adalah tanggungjawab agen dan vendor.</li>
              <li>GoSuap berhak untuk memadam sebarang kandungan yang tidak sesuai tanpa notis.</li>
              <li>Vendor tidak dibenarkan memaparkan maklumat yang mengelirukan atau palsu.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bebas text-xl text-white mb-3 tracking-wide">7. Had Liabiliti</h2>
            <p>GoSuap tidak bertanggungjawab atas sebarang kerugian yang timbul daripada penggunaan platform ini, termasuk ketidaktepatan maklumat vendor, gangguan perkhidmatan, atau masalah navigasi.</p>
          </section>

          <section>
            <h2 className="font-bebas text-xl text-white mb-3 tracking-wide">8. Pindaan Terma</h2>
            <p>GoSuap berhak untuk meminda terma dan syarat ini pada bila-bila masa. Pengguna akan dimaklumkan melalui platform. Penggunaan berterusan selepas pindaan bermakna anda menerima terma yang baru.</p>
          </section>

          <section>
            <h2 className="font-bebas text-xl text-white mb-3 tracking-wide">9. Hubungi Kami</h2>
            <div className="p-4 bg-[#0d1600] border border-[#1c2e00] rounded-2xl">
              <p className="text-white font-black">ICONIX GROUP SDN BHD (1506178-H)</p>
              <p className="mt-1">13-1, Jalan Setia Utara 8, Bandar Setia Fontaines,</p>
              <p>13200 Kepala Batas, Pulau Pinang, Malaysia</p>
              <p className="mt-1">Tel: 017-231 7077</p>
            </div>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t border-[#1c2e00]">
          <Link href="/privacy">
            <span className="font-nunito text-[11px] font-black text-[#6aaa22] uppercase tracking-widest hover:text-[#b8e030] transition cursor-pointer">
              Baca Dasar Privasi →
            </span>
          </Link>
        </div>

      </div>
    </main>
  );
}