import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const BookCard = ({ book }) => {
  return (
    <Link href={`/katalog/${book.id}`} key={book.id}>
      <Card className="h-full flex flex-col hover:shadow-xl hover:border-primary transition-all duration-300 cursor-pointer">
        <CardHeader className="p-0">
          <div className="relative w-full h-60">
            <Image
              src={book.gambarUrl || "/placeholder.jpg"}
              alt={`Sampul ${book.judul}`}
              fill
              className="object-cover rounded-t-lg"
            />
          </div>
        </CardHeader>
        <CardContent className="flex-grow p-4">
          <CardTitle className="text-base font-bold leading-snug line-clamp-2">
            {book.judul}
          </CardTitle>
          <p className="text-sm text-gray-500 mt-1">{book.penulis}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <div className="flex flex-wrap gap-2">
            {book.kategori?.slice(0, 2).map((cat) => (
              <span
                key={cat.id}
                className="text-xs font-semibold bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full"
              >
                {cat.nama}
              </span>
            ))}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default BookCard;
