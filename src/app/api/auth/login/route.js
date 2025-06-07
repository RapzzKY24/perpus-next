import prisma from "@/libs/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email dan password tidak boleh kosong." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Email atau Password salah." },
        { status: 401 }
      );
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return NextResponse.json(
        { success: false, message: "Email atau Password salah." },
        { status: 401 }
      );
    }
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        nama: user.nama,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    return NextResponse.json(
      {
        success: true,
        message: "Login berhasil",
        data: { token },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Gagal melakukan login:", err);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
