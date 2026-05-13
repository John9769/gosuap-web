"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAgent } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const data = await loginAgent(email, password);
    setLoading(false);

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("agentId", data.user.id);
      localStorage.setItem("agentName", data.user.name);
      localStorage.setItem("agentRole", data.user.role);

      // Route based on role
      if (data.user.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/agent-dashboard");
      }
    } else {
      setError(data.message || data.error || "E-mel atau kata laluan tidak sah.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center py-5 font-sans">
      <main className="w-full max-w-md bg-white min-h-screen shadow-2xl rounded-3xl overflow-hidden flex flex-col justify-center px-8 py-12">

        <div className="text-center mb-10">
          <img src="/logo.png" alt="GoSuap" className="h-14 w-auto object-contain mx-auto mb-5" />
          <h1 className="text-xl font-black text-blue-900 uppercase tracking-tight leading-none">Log Masuk</h1>
          <p className="text-[10px] font-bold text-gray-400 tracking-[.2em] uppercase mt-1">Portal Rasmi GoSuap</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-2xl text-xs font-bold mb-6 text-center border border-red-100 uppercase tracking-wide">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">E-mel</label>
            <input type="email" placeholder="emel@gosuap.com"
              className="w-full px-4 py-3.5 border border-gray-100 rounded-2xl bg-gray-50 outline-none focus:border-blue-500 focus:bg-white transition text-sm font-medium text-gray-800 placeholder:text-gray-300"
              value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Kata Laluan</label>
            <input type="password" placeholder="••••••••"
              className="w-full px-4 py-3.5 border border-gray-100 rounded-2xl bg-gray-50 outline-none focus:border-blue-500 focus:bg-white transition text-sm font-medium text-gray-800 placeholder:text-gray-300"
              value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-blue-900 hover:bg-blue-800 disabled:bg-blue-400 text-white font-black py-5 rounded-2xl shadow-lg shadow-blue-900/20 uppercase tracking-widest active:scale-[0.98] transition mt-4 text-sm">
            {loading ? "Menyemak..." : "Masuk ke Portal"}
          </button>
        </form>

      </main>
    </div>
  );
}