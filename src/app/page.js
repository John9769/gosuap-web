"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";

export default function LandingPage() {
  const heroRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const handleMove = (e) => {
      const { left, top, width, height } = hero.getBoundingClientRect();
      const x = ((e.clientX - left) / width - 0.5) * 12;
      const y = ((e.clientY - top) / height - 0.5) * 8;
      hero.style.setProperty("--rx", `${y}deg`);
      hero.style.setProperty("--ry", `${x}deg`);
    };
    hero.addEventListener("mousemove", handleMove);
    return () => hero.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <main className="bg-[#0a1100] min-h-screen font-sans overflow-x-hidden">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito:wght@400;700;800;900&display=swap');

        :root {
          --lime: #b8e030;
          --lime-bright: #d4f040;
          --lime-dark: #6aaa22;
          --dark: #0a1100;
        }

        .font-bebas { font-family: 'Bebas Neue', sans-serif; }
        .font-nunito { font-family: 'Nunito', sans-serif; }

        .hero-wrap {
          transform: perspective(900px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
          transition: transform 0.12s ease-out;
        }

        .speed-bg {
          background: repeating-conic-gradient(
            from 0deg at 60% 50%,
            transparent 0deg,
            transparent 2.8deg,
            rgba(184,224,48,0.06) 3deg,
            transparent 3.2deg
          );
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .shimmer-line {
          background: linear-gradient(90deg, transparent 0%, rgba(212,240,64,0.25) 50%, transparent 100%);
          background-size: 200% 100%;
          animation: shimmer 2.8s infinite;
        }

        @keyframes floatY {
          0%, 100% { transform: translateY(0px) rotate(var(--rot, 0deg)); }
          50% { transform: translateY(-14px) rotate(var(--rot, 0deg)); }
        }
        .float { animation: floatY 4s ease-in-out infinite; }

        @keyframes pulseRing {
          0% { transform: scale(0.92); opacity: 0.6; }
          100% { transform: scale(1.18); opacity: 0; }
        }
        .pulse-ring { animation: pulseRing 2s ease-out infinite; }
        .pulse-ring-2 { animation: pulseRing 2s ease-out infinite 0.7s; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up-1 { animation: fadeUp 0.8s ease forwards 0.1s; opacity: 0; }
        .fade-up-2 { animation: fadeUp 0.8s ease forwards 0.3s; opacity: 0; }
        .fade-up-3 { animation: fadeUp 0.8s ease forwards 0.5s; opacity: 0; }
        .fade-up-4 { animation: fadeUp 0.8s ease forwards 0.7s; opacity: 0; }
        .fade-up-5 { animation: fadeUp 0.8s ease forwards 0.9s; opacity: 0; }

        .glow-text {
          text-shadow: 0 0 40px rgba(184,224,48,0.5), 0 0 80px rgba(184,224,48,0.2);
        }

        .feat-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .feat-card:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 20px 60px rgba(106,170,34,0.2);
        }

        @keyframes ctaPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(184,224,48,0.5); }
          50% { box-shadow: 0 0 0 14px rgba(184,224,48,0); }
        }
        .cta-btn {
          animation: ctaPulse 2.5s ease infinite;
          transition: transform 0.15s ease, background 0.2s ease;
        }
        .cta-btn:hover { transform: scale(1.04); background: #d4f040; }
        .cta-btn:active { transform: scale(0.97); }

        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .marquee-inner { animation: marquee 18s linear infinite; }

        @keyframes cardFloat {
          0%, 100% { transform: translateY(0) rotate(var(--rot)); }
          50% { transform: translateY(-8px) rotate(var(--rot)); }
        }
        .food-badge { animation: cardFloat 3.5s ease-in-out infinite; }

        .noise::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          opacity: 0.06;
          mix-blend-mode: overlay;
        }
      `}</style>

      {/* NAVBAR — logo only, no button */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center items-center px-6 py-4"
        style={{ background: 'linear-gradient(to bottom, rgba(10,17,0,0.95), transparent)' }}>
        <img src="/logo.png" alt="GoSuap" className="h-20 w-auto object-contain" />
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden noise" ref={heroRef}>
        <div className="absolute inset-0 speed-bg opacity-80" />
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 60% 50%, rgba(106,170,34,0.12) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-40"
          style={{ background: 'linear-gradient(to bottom, transparent, #0a1100)' }} />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-8 pt-28 pb-16">

          {/* TEXT */}
          <div className="flex-1">

            {/* Eyebrow badge */}
            <div className="fade-up-1 inline-flex items-center gap-2 bg-[#162200] border border-[#2a4400] rounded-full px-4 py-1.5 mb-5">
              <span className="w-2 h-2 rounded-full bg-[#b8e030] inline-block" style={{boxShadow:'0 0 8px #b8e030'}}/>
              <span className="font-nunito text-[10px] font-black text-[#b8e030] uppercase tracking-[.25em]">
                Halal Food Across Malaysia
              </span>
            </div>

            {/* MAIN HEADLINE */}
            <h1 className="fade-up-2 font-bebas leading-none mb-2">
              <span className="block text-[56px] lg:text-[76px] text-white tracking-wide">Muslim Food</span>
              <span className="block text-[56px] lg:text-[76px] glow-text tracking-wide" style={{color:'#b8e030'}}>
                Market Place
              </span>
            </h1>

            {/* GoSuap brand line */}
            <div className="fade-up-3 flex items-center gap-3 mb-5">
              <div className="h-px flex-1 max-w-[60px]" style={{background:'linear-gradient(90deg, #2a4400, transparent)'}}/>
              <p className="font-nunito text-sm font-black text-gray-500 uppercase tracking-[.2em]">
                Your Digital Foodie Companion
              </p>
              <div className="h-px flex-1 max-w-[60px]" style={{background:'linear-gradient(90deg, transparent, #2a4400)'}}/>
            </div>

            <p className="fade-up-3 font-nunito text-gray-400 text-base leading-relaxed mb-8 max-w-md">
              Direktori digital untuk peniaga makanan Muslim Malaysia. GPS-based discovery, menu showcase, navigate terus via Waze.
            </p>

            {/* CTA — centered with Percuma directly below */}
            <div className="fade-up-4 flex flex-col items-center gap-2 lg:items-start">
              <Link href="/cari">
                <button className="cta-btn font-bebas text-[20px] tracking-widest text-[#0a1100] bg-[#b8e030] px-10 py-4 rounded-2xl">
                  CARI KEDAI SEKARANG
                </button>
              </Link>
              <span className="font-nunito text-xs text-gray-600 font-black uppercase tracking-widest text-center">
                Percuma · Tanpa Daftar
              </span>
            </div>

            {/* Stats — each number centered above its label */}
            <div className="fade-up-5 flex gap-8 mt-10">
              {[
                { n: "3", label: "Negeri" },
                { n: "100%", label: "Muslim Owned" },
                { n: "GPS", label: "Powered" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="font-bebas text-3xl glow-text" style={{color:'#b8e030'}}>{s.n}</p>
                  <p className="font-nunito text-[10px] text-gray-500 font-black uppercase tracking-widest">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* HERO IMAGE */}
          <div className="flex-1 flex justify-center items-center relative">
            <div className="absolute w-80 h-80 rounded-full border border-[#b8e030]/20 pulse-ring" />
            <div className="absolute w-80 h-80 rounded-full border border-[#b8e030]/15 pulse-ring-2" />
            <div className="absolute w-72 h-72 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(106,170,34,0.25) 0%, transparent 70%)', filter: 'blur(30px)' }} />
            <div className="relative float hero-wrap">
              <img src="/Hero.png" alt="GoSuap Muslim Food Market Place"
                className="relative z-10 w-full max-w-sm lg:max-w-md object-contain"
                style={{ filter: 'drop-shadow(0 20px 60px rgba(106,170,34,0.35))' }} />
              <div className="absolute inset-0 z-20 shimmer-line rounded-3xl pointer-events-none" />
            </div>
            <div className="food-badge absolute top-12 left-4 bg-[#0f1a00] border border-[#2a4400] rounded-2xl px-3 py-2 z-30" style={{'--rot': '-4deg'}}>
              <p className="font-nunito text-xs font-black text-[#b8e030]">🍛 Nasi Lemak</p>
              <p className="font-nunito text-[10px] text-gray-500 font-bold">📍 1.2 km</p>
            </div>
            <div className="food-badge absolute bottom-20 right-2 bg-[#0f1a00] border border-[#2a4400] rounded-2xl px-3 py-2 z-30" style={{'--rot': '3deg', animationDelay: '1.2s'}}>
              <p className="font-nunito text-xs font-black text-[#b8e030]">🥩 Satay Kajang</p>
              <p className="font-nunito text-[10px] text-gray-500 font-bold">📍 0.8 km</p>
            </div>
            <div className="food-badge absolute top-1/2 right-0 bg-[#0f1a00] border border-[#2a4400] rounded-2xl px-3 py-2 z-30" style={{'--rot': '5deg', animationDelay: '0.6s'}}>
              <p className="font-nunito text-xs font-black text-[#b8e030]">🍜 Mee Goreng</p>
              <p className="font-nunito text-[10px] text-yellow-600 font-black">⭐ Premium</p>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="relative overflow-hidden py-4 border-y border-[#1c2e00]" style={{ background: '#0d1600' }}>
        <div className="marquee-inner flex gap-12 whitespace-nowrap w-max">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-12 items-center">
              {["🍛 Nasi Lemak", "🥩 Satay", "🍜 Mee Goreng", "🐟 Ikan Bakar", "🍖 Ayam Penyet", "🍚 Nasi Kerabu", "🥘 Rendang", "🫕 Laksa"].map((food) => (
                <span key={food} className="font-bebas text-lg tracking-widest text-[#3a5800]">
                  {food} <span className="text-[#1c2e00]">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="font-nunito text-[11px] font-black text-[#6aaa22] uppercase tracking-[.3em] mb-3">Kenapa GoSuap?</p>
          {/* Reduced font size */}
          <h2 className="font-bebas text-[40px] lg:text-[52px] text-white leading-none">
            SEMUA YANG ANDA PERLUKAN
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: "📍", title: "GPS Discovery", desc: "Kedai terdekat muncul dulu. Premium kedai di bahagian atas. Sorted by jarak dari lokasi anda.", accent: "#b8e030" },
            { icon: "🕌", title: "Muslim Owned", desc: "Semua vendor adalah peniaga Muslim Malaysia yang telah disahkan oleh agen kami.", accent: "#90c828" },
            { icon: "🧾", title: "Top 5 Menu", desc: "Setiap kedai tunjuk 5 menu terbaik dengan gambar dan harga. Tau apa nak order sebelum sampai.", accent: "#d4f040" },
            { icon: "🛵", title: "GrabFood & Panda", desc: "Tahu dalam sekelip mata jika kedai tersedia di platform penghantaran kegemaran anda.", accent: "#b8e030" },
            { icon: "🗺️", title: "Waze Navigate", desc: "Satu ketik terus navigate ke kedai. Tak perlu copy paste alamat lagi.", accent: "#90c828" },
            { icon: "⭐", title: "Premium Boost", desc: "Kedai premium muncul pertama sekali. Lebih visibility, lebih pelanggan.", accent: "#d4f040" },
          ].map((f) => (
            <div key={f.title} className="feat-card bg-[#0d1600] border border-[#1c2e00] rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full"
                style={{ background: `radial-gradient(circle, ${f.accent}15 0%, transparent 70%)`, transform: 'translate(30%, -30%)' }} />
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-bebas text-2xl text-white mb-2 tracking-wide">{f.title}</h3>
              <p className="font-nunito text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative py-24 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0d1600 0%, #0a1100 50%, #0f1900 100%)' }}>
        <div className="absolute inset-0 speed-bg opacity-40" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <p className="font-nunito text-[11px] font-black text-[#6aaa22] uppercase tracking-[.3em] mb-3">Cara Guna</p>
          <h2 className="font-bebas text-[40px] lg:text-[56px] text-white leading-none mb-16">3 LANGKAH MUDAH</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", icon: "🗺️", title: "Pilih Negeri", desc: "Pilih negeri anda — Penang, Kedah, atau Negeri Sembilan." },
              { step: "02", icon: "🔍", title: "Cari Kedai", desc: "Kedai Muslim berdekatan tersusun mengikut jarak dari GPS anda." },
              { step: "03", icon: "📍", title: "Navigate & Makan", desc: "Ketik Navigate, Waze bawa anda terus ke pintu kedai." },
            ].map((s) => (
              <div key={s.step} className="flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
                    style={{ background: '#162200', border: '1px solid #2a4400' }}>
                    {s.icon}
                  </div>
                  <div className="absolute -top-3 -right-3 font-bebas text-sm text-[#b8e030] bg-[#0a1100] border border-[#2a4400] rounded-full w-8 h-8 flex items-center justify-center"
                    style={{ boxShadow: '0 0 12px rgba(184,224,48,0.3)' }}>
                    {s.step}
                  </div>
                </div>
                <h3 className="font-bebas text-2xl text-white mb-2 tracking-wide">{s.title}</h3>
                <p className="font-nunito text-sm text-gray-500 leading-relaxed max-w-xs">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(106,170,34,0.1) 0%, transparent 70%)' }} />
        <div className="relative max-w-2xl mx-auto px-6 text-center">
          <img src="/logo.png" alt="GoSuap" className="h-16 w-auto object-contain mx-auto mb-8 opacity-90" />
          <h2 className="font-bebas text-[60px] lg:text-[80px] text-white leading-none mb-2 glow-text">LAPAR?</h2>
          <p className="font-bebas text-[28px] text-[#6aaa22] tracking-widest mb-4">MUSLIM FOOD MARKET PLACE</p>
          <p className="font-nunito text-gray-500 text-base mb-10">
            Buka GoSuap. Jumpa kedai Muslim berhampiran. Pergi makan.
          </p>
          <Link href="/cari">
            <button className="cta-btn font-bebas text-[22px] tracking-widest text-[#0a1100] bg-[#b8e030] px-14 py-5 rounded-2xl">
              BUKA GOSUAP
            </button>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#1c2e00] px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <img src="/logo.png" alt="GoSuap" className="h-8 w-auto object-contain opacity-60" />
          <p className="font-nunito text-[11px] text-gray-700 font-bold uppercase tracking-widest text-center">
            © 2026 GoSuap · Muslim Food Market Place Malaysia
          </p>
          <Link href="/login">
            <span className="font-nunito text-[11px] text-gray-700 font-black uppercase tracking-widest hover:text-[#b8e030] transition cursor-pointer">
              Portal Agen →
            </span>
          </Link>
        </div>
      </footer>

    </main>
  );
}