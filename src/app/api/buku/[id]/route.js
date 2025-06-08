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
          booksList: null,
        },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: `Detail buku dengan id ${id}`,
        booksList: book,
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
  const body = await request.json();
  const {
    judul,
    penulis,
    penerbit,
    tahunTerbit,
    isbn,
    jumlahStok,
    jumlahTersedia,
    deskripsi,
    gambarUrl,
  } = body;

  try {
    const updatedBook = await prisma.buku.update({
      where: { id },
      data: {
        judul,
        penulis,
        penerbit,
        tahunTerbit,
        isbn,
        jumlahStok,
        jumlahTersedia,
        deskripsi,
        gambarUrl,
      },
    });

    return NextResponse.json(
      { success: true, message: "Buku berhasil diperbarui", data: updatedBook },
      { status: 200 }
    );
  } catch (error) {
    console.error("Gagal memperbarui buku:", error);
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
