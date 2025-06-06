import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const id = params.id;
  try {
    const book = await prisma.buku.findUnique({
      where: { id },
      include: {
        kategori: {
          select: {
            id: true,
            nama: true,
          },
        },
      },
    });

    if (!book) {
      return NextResponse.json(
        {
          success: false,
          message: "Buku tidak ditemukan",
          data: null,
        },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: `Detail buku dengan id ${id}`,
        data: book,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Gagal mengambil detail buku:", err);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const id = params.id;
  try {
    const { judul, penerbit, gambarUrl, kategoriIds } = await request.json();

    const dataToUpdate = {};
    if (judul) dataToUpdate.judul = judul;
    if (penerbit) dataToUpdate.penerbit = penerbit;
    if (gambarUrl) dataToUpdate.gambarUrl = gambarUrl;

    if (kategoriIds && Array.isArray(kategoriIds)) {
      dataToUpdate.kategori = {
        set: kategoriIds.map((catId) => ({ id: catId })),
      };
    }

    const updatedBook = await prisma.buku.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json(
      { success: true, message: "Buku berhasil diperbarui", data: updatedBook },
      { status: 200 }
    );
  } catch (err) {
    if (err.code === "P2025") {
      return NextResponse.json(
        { success: false, message: "Buku dengan ID tersebut tidak ditemukan." },
        { status: 404 }
      );
    }
    console.error("Gagal memperbarui buku:", err);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const id = params.id;
  try {
    await prisma.buku.delete({
      where: { id },
    });
    return NextResponse.json(
      { success: true, message: "Buku berhasil dihapus." },
      { status: 200 }
    );
  } catch (err) {
    if (err.code === "P2025") {
      return NextResponse.json(
        { success: false, message: "Buku dengan ID tersebut tidak ditemukan." },
        { status: 404 }
      );
    }
    console.error("Gagal menghapus buku:", err);
    r;
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
