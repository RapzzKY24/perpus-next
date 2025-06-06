import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";

const GET = async () => {
  try {
    const books = await prisma.buku.findMany({
      orderBy: {
        judul: "asc",
      },
      include: {
        kategori: true,
      },
    });
    return NextResponse.json(
      {
        success: true,
        message: "List Books Datas",
        data: books,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.log("Gagal memuat buku", err);
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
};

const POST = async (request) => {
  try {
    const {
      judul,
      penulis,
      penerbit,
      tahunTerbit,
      isbn,
      deskripsi,
      jumlahStok,
      gambarUrl,
      kategoriIds,
    } = await request.json();

    if (
      !judul ||
      !penulis ||
      !penerbit ||
      !tahunTerbit ||
      !isbn ||
      !jumlahStok
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Data wajib (judul, penulis, penerbit, tahun, isbn, stok) tidak boleh kosong!",
          data: null,
        },
        { status: 400 }
      );
    }

    const newBook = await prisma.buku.create({
      data: {
        judul,
        penulis,
        penerbit,
        tahunTerbit: parseInt(tahunTerbit),
        isbn,
        deskripsi,
        jumlahStok: parseInt(jumlahStok),
        jumlahTersedia: parseInt(jumlahStok),
        gambarUrl,
        kategori: {
          connect: kategoriIds?.map((id) => ({ id: id })) || [],
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Buku berhasil ditambahkan",
        data: newBook,
      },
      { status: 201 }
    );
  } catch (err) {
    if (err.code === "P2002" && err.meta?.target?.includes("isbn")) {
      return NextResponse.json(
        {
          success: false,
          message: "Gagal menambah buku: ISBN sudah terdaftar.",
          data: null,
        },
        { status: 409 }
      );
    }
    console.error("Gagal menambah buku:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan pada server.",
        data: null,
      },
      { status: 500 }
    );
  }
};

export { GET, POST };
