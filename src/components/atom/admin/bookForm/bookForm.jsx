"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const fieldLabels = {
  judul: "Judul",
  penulis: "Penulis",
  penerbit: "Penerbit",
  tahunTerbit: "Tahun Terbit",
  isbn: "ISBN",
  deskripsi: "Deskripsi",
  jumlahStok: "Jumlah Stok",
  jumlahTersedia: "Jumlah Tersedia",
  gambarUrl: "URL Gambar",
};

const CreateBookForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    judul: "",
    penulis: "",
    penerbit: "",
    tahunTerbit: "",
    isbn: "",
    deskripsi: "",
    jumlahStok: 1,
    jumlahTersedia: 1,
    gambarUrl: "",
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const dataToSend = {
        ...formData,
        tahunTerbit: parseInt(formData.tahunTerbit, 10),
        jumlahStok: parseInt(formData.jumlahStok, 10),
        jumlahTersedia: parseInt(formData.jumlahTersedia, 10),
      };

      const response = await fetch("/api/buku", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal membuat buku.");
      }

      alert("Buku berhasil dibuat!");
      router.push("/admin/buku");

      router.refresh();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Tambah Buku Baru
      </h1>
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.keys(formData).map((key) => (
          <div key={key}>
            <label
              className="block text-sm font-medium mb-1 text-gray-700"
              htmlFor={key}
            >
              {fieldLabels[key] || key}
            </label>
            {key === "deskripsi" ? (
              <textarea
                name={key}
                id={key}
                value={formData[key]}
                onChange={handleChange}
                rows="4"
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <input
                type={
                  ["tahunTerbit", "jumlahStok", "jumlahTersedia"].includes(key)
                    ? "number"
                    : "text"
                }
                name={key}
                id={key}
                value={formData[key]}
                onChange={handleChange}
                required={key !== "deskripsi" && key !== "gambarUrl"} // Deskripsi dan Gambar tidak wajib
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              />
            )}
          </div>
        ))}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-2 rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Menyimpan..." : "Simpan Buku"}
        </button>
      </form>
    </div>
  );
};

export default CreateBookForm;
