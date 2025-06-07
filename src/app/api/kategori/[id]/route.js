import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const id = params.id;
  try {
    const category = await prisma.kategori.findUnique({
      where: { id },
      include: {
        buku: true,
      },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Kategori tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Detail Kategori", data: category },
      { status: 200 }
    );
  } catch (err) {
    console.error("Gagal mengambil detail kategori:", err);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}

export const PUT = async (request, { params }) => {
  const id = params.id;
  try {
    const { nama } = await request.json();
    if (!nama) {
      return NextResponse.json(
        { success: false, message: "Nama kategori tidak boleh kosong." },
        { status: 400 }
      );
    }
    const kategori = await prisma.kategori.update({
      where: { id },
      data: { nama },
    });
    return NextResponse.json(
      {
        success: true,
        message: "Kategori berhasil diperbarui",
        data: kategori,
      },
      { status: 200 }
    );
  } catch (err) {
    if (err.code === "P2025") {
      return NextResponse.json(
        {
          success: false,
          message: "Kategori dengan ID tersebut tidak ditemukan.",
        },
        { status: 404 }
      );
    }
    if (err.code === "P2002") {
      return NextResponse.json(
        {
          success: false,
          message: "Gagal memperbarui: Nama kategori tersebut sudah digunakan.",
        },
        { status: 409 }
      );
    }

    console.error("Gagal mengupdate kategori:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan pada server.",
      },
      { status: 500 }
    );
  }
};

export const DELETE = async (request, { params }) => {
  const id = params.id;
  try {
    const kategori = await prisma.kategori.delete({
      where: { id },
    });
    return NextResponse.json(
      {
        success: true,
        message: "berhasil menghapus buku",
        categories: kategori,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    if (err.code === "P2025") {
      return NextResponse.json(
        {
          success: false,
          message: "Kategori dengan ID tersebut tidak ditemukan.",
        },
        { status: 404 }
      );
    }
    console.error("Gagal menghapus kategori:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan pada server.",
      },
      { status: 500 }
    );
  }
};
