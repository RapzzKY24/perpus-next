import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";

export const PATCH = async (request, { params }) => {
  const peminjamanId = params.id;
  try {
    const returnedPeminjaman = await prisma.$transaction(async (tx) => {
      const peminjaman = await tx.peminjaman.findUnique({
        where: { id: peminjamanId },
      });
      if (!peminjaman) {
        throw new Error("Data peminjaman tidak ditemukan");
      }

      if (peminjaman.status !== "DIPINJAM") {
        throw new Error("Buku ini sudah dikembalikan");
      }

      const updatedPeminjaman = await tx.peminjaman.update({
        where: { id: peminjamanId },
        data: {
          status: "KEMBALI",
          tanggalKembali: new Date(),
        },
      });
      await tx.buku.update({
        where: { id: peminjaman.bukuId },
        data: {
          jumlahTersedia: { increment: 1 },
        },
      });

      return updatedPeminjaman;
    });

    return NextResponse.json(
      {
        success: true,
        message: "Buku berhasil dikembalikan",
        data: returnedPeminjaman,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    if (
      err.message.includes("tidak ditemukan") ||
      err.message.includes("sudah dikembalikan")
    ) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: 404 }
      );
    }

    console.error("Gagal mengembalikan buku:", err);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
};
