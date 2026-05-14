"use client";
import { useState } from "react";
import { uploadImage } from "@/lib/api";

export default function MenuInput({ index, item, updateItem, token }) {
  const [uploading, setUploading] = useState(false);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const result = await uploadImage(file, token);
    setUploading(false);

    if (result.url) {
      updateItem(index, "image", result.url);
    }
  };

  return (
    <div className="flex gap-3 items-start p-3 bg-gray-50 rounded-2xl border border-gray-100">

      {/* Item Image */}
      <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 border-dashed border-gray-200 bg-white flex flex-col items-center justify-center">
        {uploading ? (
          <span className="text-[10px] font-black text-blue-500 text-center px-1">Muat naik...</span>
        ) : item.image ? (
          <img src={item.image} alt="menu" className="w-full h-full object-cover" />
        ) : (
          <span className="text-[10px] font-black text-gray-400 text-center px-1">+ Foto</span>
        )}
        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={handleImageChange}
          disabled={uploading}
        />
      </div>

      {/* Name & Price */}
      <div className="flex-1 space-y-2">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Item #{index + 1}</p>
        <input
          type="text"
          placeholder="Nama Makanan"
          value={item.name}
          onChange={(e) => updateItem(index, "name", e.target.value)}
          className="w-full px-3 py-2 border border-gray-100 rounded-xl bg-white outline-none focus:border-blue-500 text-sm font-medium text-gray-800 placeholder:text-gray-300"
        />
        <input
          type="number"
          placeholder="Harga (RM)"
          value={item.price}
          onChange={(e) => updateItem(index, "price", e.target.value)}
          className="w-full px-3 py-2 border border-gray-100 rounded-xl bg-white outline-none focus:border-blue-500 text-sm font-medium text-gray-800 placeholder:text-gray-300"
        />
      </div>

    </div>
  );
}