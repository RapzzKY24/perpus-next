import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export const POST = async (request) => {
  try {
    const { email, nama, password } = await request.json();
    if (!email || !nama || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "kolom email,nama,password wajib diisi",
        },
        {
          status: 400,
        }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "password minimal  dari 6 karakter",
        },
        {
          status: 400,
        }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        nama,
        password: hashedPassword,
      },
    });
    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json(
      {
        success: true,
        message: "berhasil membuat akun",
        data: userWithoutPassword,
      },
      {
        status: 201,
      }
    );
  } catch (err) {
    if (err.code === "P2002") {
      return NextResponse.json(
        { success: false, message: "Gagal: Email sudah terdaftar." },
        { status: 409 }
      );
    }

    console.error("Gagal mendaftarkan user:", err);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
};
