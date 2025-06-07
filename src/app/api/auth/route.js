import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        nama: "asc",
      },
      select: {
        id: true,
        nama: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "List data user berhasil diambil",
        data: users,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.error("Gagal mengambil data user:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan pada server.",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}
