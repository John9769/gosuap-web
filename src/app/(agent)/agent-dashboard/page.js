"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAgentVendors } from "@/lib/api";

export default function AgentDashboard() {
  const [agent, setAgent] = useState({ name: "", id: "" });
  const [approved, setApproved] = useState(0);
  const [pending, setPending] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const name = localStorage.getItem("agentName");
    const id = localStorage.getItem("agentId");
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    setAgent({ name: name || "Agent", id: id || "---" });

    getAgentVendors(token).then((vendors) => {
      if (Array.isArray(vendors)) {
        setApproved(vendors.filter((v) => v.status === "ACTIVE").length);
        setPending(vendors.filter((v) => v.status === "PENDING").length);
      }
    });
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center py-5 font-sans">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl overflow-hidden rounded-3xl">

        <header className="flex justify-between items-center px-6 py-5 border-b border-gray-100 bg-white sticky top-0 z-50">
          <div>
            <h1 className="text-lg font-black text-blue-900 leading-none tracking-tight">DASHBOARD</h1>
            <p className="text-[10px] font-bold text-gray-400 tracking-[.2em] uppercase mt-0.5">PORTAL RASMI</p>
          </div>
          <img src="/logo.png" alt="GoSuap" className="h-10 w-auto object-contain" />
        </header>

        <div className="px-6 py-6 bg-blue-900 text-white">
          <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Log masuk sebagai</p>
          <h2 className="text-2xl font-black uppercase mt-1 mb-2">{agent.name}</h2>
          <span className="text-[10px] font-bold bg-white/20 px-3 py-1 rounded-full">ID: {agent.id}</span>
        </div>

        <div className="px-6 py-6 space-y-6">

          <Link href="/add-shop" className="block no-underline">
            <div className="bg-green-600 hover:bg-green-700 active:scale-[0.98] transition text-white px-6 py-5 rounded-2xl text-center font-black text-base uppercase tracking-widest shadow-lg shadow-green-600/30 cursor-pointer">
              + DAFTARKAN VENDOR
            </div>
          </Link>

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

          <button
            onClick={handleLogout}
            className="w-full py-3 border border-red-400 text-red-500 rounded-xl text-xs font-black uppercase tracking-widest bg-transparent hover:bg-red-50 transition cursor-pointer"
          >
            Log Keluar
          </button>

        </div>
      </div>
    </div>
  );
}