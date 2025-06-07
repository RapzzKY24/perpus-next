import { Button } from "@/components/ui/button";
import Link from "next/link";

async function getFeaturedBooks() {
  try {
    const res = await fetch("http://localhost:3000/api/buku", {
      cache: "no-store",
    });
    if (!res.ok) {
      return { success: false, data: [] };
    }
    return res.json();
  } catch (error) {
    console.error("Fetch failed:", error);
    return { success: false, data: [] };
  }
}

export default async function HomePage() {
  const response = await getFeaturedBooks();
  const featuredBooks = response?.booksList || [];

  return (
    <>
      <section className="text-center py-20 bg-gray-50">
        <div className="container mx-auto">
          <h1 className="text-5xl font-extrabold tracking-tight">
            Selamat Datang di BookHaven
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Temukan dunia baru dalam setiap halaman. Pinjam dan baca buku
            favorit Anda dengan mudah, di mana saja.
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/katalog">Jelajahi Katalog</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">
            Buku Unggulan Kami
          </h2>
        </div>
      </section>
    </>
  );
}
