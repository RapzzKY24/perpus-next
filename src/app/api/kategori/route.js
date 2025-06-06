import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";

const GET = async () => {
  try {
    const categories = await prisma.kategori.findMany({
      orderBy: {
        nama: "asc",
      },
    });
    return NextResponse.json(
      {
        success: true,
        message: "list categories books",
        data: categories,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.log("gagal memuat buku: ", err);
    return NextResponse.json(
      {
        success: false,
        message: "cannot get categories books",
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
    const { nama } = await request.json();
    if (!nama) {
      return NextResponse.json(
        { success: false, message: "Nama kategori tidak boleh kosong." },
        { status: 400 }
      );
    }

    const newCategory = await prisma.kategori.create({
      data: {
        nama,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Kategori berhasil dibuat",
        data: newCategory,
      },
      { status: 201 }
    );
  } catch (err) {
    if (err.code === "P2002") {
      return NextResponse.json(
        {
          success: false,
          message: "Gagal: Nama kategori tersebut sudah ada.",
        },
        { status: 409 }
      );
    }
    console.error("Gagal membuat kategori:", err);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
};

export { GET, POST };
