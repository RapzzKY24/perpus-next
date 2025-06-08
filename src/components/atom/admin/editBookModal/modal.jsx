"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const EditBookModal = ({ book, isOpen, onClose, onUpdated }) => {
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (book) {
      setFormData({
        judul: book.judul || "",
        penulis: book.penulis || "",
        penerbit: book.penerbit || "",
        tahunTerbit: book.tahunTerbit || "",
        isbn: book.isbn || "",
        jumlahStok: book.jumlahStok || 0,
        jumlahTersedia: book.jumlahTersedia || 0,
        deskripsi: book.deskripsi || "",
        gambarUrl: book.gambarUrl || "",
      });
    }
  }, [book]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/buku/${book.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tahunTerbit: parseInt(formData.tahunTerbit),
          jumlahStok: parseInt(formData.jumlahStok),
          jumlahTersedia: parseInt(formData.jumlahTersedia),
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal memperbarui buku.");
      }

      const updatedBook = await response.json();
      onUpdated(updatedBook.data);
      alert("Buku berhasil diperbarui!");
      onClose();
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Buku: {book?.judul}</DialogTitle>
          <DialogDescription>
            Lakukan perubahan pada detail buku di bawah ini. Klik simpan jika
            sudah selesai.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="judul" className="text-right">
                Judul
              </Label>
              <Input
                id="judul"
                name="judul"
                value={formData.judul}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="penulis" className="text-right">
                Penulis
              </Label>
              <Input
                id="penulis"
                name="penulis"
                value={formData.penulis}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="jumlahStok" className="text-right">
                Jumlah Stok
              </Label>
              <Input
                id="jumlahStok"
                name="jumlahStok"
                type="number"
                value={formData.jumlahStok}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditBookModal;
