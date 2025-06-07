import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";

export const POST = async (request, { params }) => {
  try {
    const { userId, bukuId, tanggaJatuhTempo } = await request.json();
    if (!userId || !bukuId || !tanggaJatuhTempo) {
      return NextResponse.json(
        {
          success: false,
          message: "user id ,bukuid,dan tanggal tidak boleh kosong",
        },
        {
          status: 400,
        }
      );
    }
    const newPeminjaman = await prisma.$transaction(async (tx) => {
      const book = await tx.buku.findUnique({
        where: { id: bukuId },
      });
      if (!book) {
        throw new Error("buku tidak tersedia");
      }
      if (book.jumlahTersedia <= 0) {
        throw new Error("stok habis");
      }
      await tx.buku.update({
        where: { id: bukuId },
        data: { jumlahTersedia: { decrement: 1 } },
      });
      const peminjman = await tx.peminjman.create({
        data: {
          userId,
          bukuId,
          tanggaJatuhTempo: new Date(tanggaJatuhTempo),
          status: "DIPINJAM",
        },
      });
      return peminjman;
    });
    return NextResponse.json(
      {
        success: true,
        message: "buku berhasil dipinjam",
        data: newPeminjaman,
      },
      {
        status: 201,
      }
    );
  } catch (err) {
    if (
      err.message === "Stok buku habis." ||
      err.message === "Buku tidak ditemukan."
    ) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: 400 }
      );
    }

    // Tangani error server lainnya
    console.error("Gagal melakukan peminjaman:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan pada server.",
      },
      { status: 500 }
    );
  }
};
