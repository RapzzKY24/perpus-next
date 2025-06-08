import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { fetchApi } from "@/libs/api";

export default async function BookDetailPage({ params }) {
  const { id } = params;

  const responseJson = await fetchApi("api/buku", id);
  const book = responseJson.booksList;
  if (!book) {
    return notFound();
  }
  return (
    <main className="container mx-auto p-4 md:p-8 mt-10">
      <div className="grid md:grid-cols-3 gap-10 lg:gap-16 bg-white/80 rounded-xl shadow-2xl p-6 md:p-10">
        <div className="md:col-span-1 flex flex-col items-center">
          <div className="relative w-full flex justify-center aspect-[2/3] rounded-xl overflow-hidden shadow-lg border-4 border-primary/30">
            <img
              src={book.gambarUrl}
              alt={"https://placehold.co/600x400/png"}
              className="object-cover transition-transform duration-300 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        </div>

        <div className="md:col-span-2 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-primary drop-shadow mb-2">
              {book.judul}
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              oleh <span className="font-semibold">{book.penulis}</span>
            </p>

            <div className="mt-6 border-t pt-6">
              <h3 className="font-bold text-lg mb-2 text-primary">
                Detail Buku
              </h3>
              <div className="text-sm space-y-2">
                <p>
                  <span className="font-semibold w-32 inline-block">
                    Penerbit
                  </span>
                  : {book.penerbit}
                </p>
                <p>
                  <span className="font-semibold w-32 inline-block">
                    Tahun Terbit
                  </span>
                  : {book.tahunTerbit}
                </p>
                <p>
                  <span className="font-semibold w-32 inline-block">ISBN</span>:{" "}
                  {book.isbn}
                </p>
                <p>
                  <span className="font-semibold w-32 inline-block">
                    Deskripsi
                  </span>
                  : {book.deskripsi}
                </p>
                <p>
                  <span className="font-semibold w-32 inline-block">
                    Stok Tersedia
                  </span>
                  :{" "}
                  <span
                    className={
                      book.jumlahTersedia > 0
                        ? "text-green-600 font-bold"
                        : "text-red-600 font-bold"
                    }
                  >
                    {book.jumlahTersedia}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <Button
              size="lg"
              disabled={book.jumlahTersedia <= 0}
              className="transition-all duration-200 shadow-lg hover:scale-105"
            >
              {book.jumlahTersedia > 0 ? "📚 Pinjam Buku" : "❌ Stok Habis"}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
