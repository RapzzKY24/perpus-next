"use client";
import React, { useState, useEffect } from "react";
import TableAdmin from "@/components/atom/admin/tableAdmin/tableAdmin";
import EditBookModal from "@/components/atom/admin/editBookModal/modal";

const Page = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/buku");
        const responseData = await response.json();
        if (responseData.success) setBooks(responseData.booksList);
      } catch (error) {
        console.error("Gagal mengambil data buku:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const handleEdit = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  const handleUpdateSuccess = (updatedBook) => {
    setBooks(books.map((b) => (b.id === updatedBook.id ? updatedBook : b)));
  };

  const handleDelete = async (book) => {
    if (window.confirm(`Yakin ingin menghapus ${book.judul}?`)) {
      await fetch(`/api/buku/${book.id}`, { method: "DELETE" });
      setBooks(books.filter((b) => b.id !== book.id));
      alert("Buku berhasil dihapus");
    }
  };

  const columns = [
    { key: "judul", label: "Judul" },
    { key: "penulis", label: "Penulis" },
    { key: "penerbit", label: "Penerbit" },
    { key: "tahunTerbit", label: "Tahun Terbit" },
    { key: "isbn", label: "ISBN" },
    { key: "jumlahStok", label: "Jumlah Stok" },
    { key: "jumlahTersedia", label: "Jumlah Tersedia" },
    {
      key: "gambarUrl",
      label: "Gambar",
      render: (book) => (
        <img
          src={book.gambarUrl}
          alt={book.judul}
          className="w-16 h-16 object-cover"
        />
      ),
    },
  ];

  if (isLoading)
    return <div className="container mx-auto p-4">Memuat data...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Daftar Buku</h1>
      <TableAdmin
        columns={columns}
        data={books}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <EditBookModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        book={selectedBook}
        onUpdated={handleUpdateSuccess}
      />
    </div>
  );
};

export default Page;
