import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

function getTokenFromHeader(request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }
  return null;
}

export async function GET(request) {
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

    const history = await prisma.peminjaman.findMany({
      where: {
        userId: userIdFromToken,
      },
      include: {
        buku: {
          select: {
            id: true,
            judul: true,
            gambarUrl: true,
          },
        },
      },
      orderBy: {
        tanggalPinjam: "desc",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Riwayat peminjaman berhasil diambil",
        data: history,
      },
      { status: 200 }
    );
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { success: false, message: "Akses ditolak: Token tidak valid." },
        { status: 401 }
      );
    }
    console.error("Gagal mengambil riwayat peminjaman:", err);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
