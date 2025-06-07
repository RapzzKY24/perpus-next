import BookCard from "@/components/atom/bookCard/bookCard";

export default async function Page() {
  const response = await fetch("http://localhost:3000/api/buku");
  const books = await response.json();
  return <BookCard book={books} />;
}
