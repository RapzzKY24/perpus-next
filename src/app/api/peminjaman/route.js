import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const validStatuses = ["DIPINJAM", "KEMBALI", "TERLAMBAT"];
    const status = searchParams.get("status")?.toUpperCase();

    const whereClause =
      status && validStatuses.includes(status) ? { status } : {};

    const semuaPeminjaman = await prisma.peminjaman.findMany({
      where: whereClause,
      include: {
        peminjam: {
          select: { nama: true, email: true },
        },
        buku: {
          select: { judul: true },
        },
      },
      orderBy: {
        tanggalPinjam: "desc",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "List data peminjaman berhasil diambil",
        data: semuaPeminjaman,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Gagal mengambil data peminjaman:", err);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}

function getTokenFromHeader(request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }
  return null;
}

export async function POST(request) {
  try {
    const token = getTokenFromHeader(request);
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Akses ditolak: Token tidak disediakan." },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userIdFromToken = decoded.userId;

    const { bukuId, tanggalJatuhTempo } = await request.json();

    if (!bukuId || !tanggalJatuhTempo) {
      return NextResponse.json(
        {
          success: false,
          message: "bukuId dan tanggalJatuhTempo tidak boleh kosong",
        },
        { status: 400 }
      );
    }

    const newPeminjaman = await prisma.$transaction(async (tx) => {
      const buku = await tx.buku.findUnique({ where: { id: bukuId } });
      if (!buku) {
        throw new Error("Buku tidak ditemukan.");
      }
      if (buku.jumlahTersedia <= 0) {
        throw new Error("Stok buku habis.");
      }

      await tx.buku.update({
        where: { id: bukuId },
        data: { jumlahTersedia: { decrement: 1 } },
      });

      const peminjaman = await tx.peminjaman.create({
        data: {
          userId: userIdFromToken,
          bukuId,
          tanggalJatuhTempo: new Date(tanggalJatuhTempo),
          status: "DIPINJAM",
        },
      });
      return peminjaman;
    });

    return NextResponse.json(
      {
        success: true,
        message: "Buku berhasil dipinjam",
        data: newPeminjaman,
      },
      { status: 201 }
    );
  } catch (err) {
    if (
      err.message.includes("Stok buku habis") ||
      err.message.includes("Buku tidak ditemukan")
    ) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: 400 }
      );
    }

    if (err instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { success: false, message: "Token tidak valid." },
        { status: 401 }
      );
    }

    console.error("Gagal melakukan peminjaman:", err);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
