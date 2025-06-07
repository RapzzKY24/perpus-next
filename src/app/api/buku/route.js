import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";

const GET = async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    let books;
    if (query) {
      books = await prisma.buku.findMany({
        where: {
          OR: [
            {
              judul: {
                contains: query,
              },
            },
            {
              penulis: {
                contains: query,
              },
            },
          ],
        },
        include: {
          kategori: true,
        },
        orderBy: {
          judul: "asc",
        },
      });
    } else {
      books = await prisma.buku.findMany({
        include: {
          kategori: true,
        },
        orderBy: {
          judul: "asc",
        },
      });
    }
    return NextResponse.json(
      {
        success: true,
        founded: 1,
        booksList: books,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.log("gagal mengambil buku", err);
    return NextResponse.json(
      {
        success: false,
        message: "gagal memuat buku",
        booksList: null,
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
