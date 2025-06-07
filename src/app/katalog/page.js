export default async function Page() {
  const response = await fetch("http://localhost:3000/api/buku");
  const books = await response.json();
  return (
    <ul>
      {books.booksList?.map((book) => (
        <li key={book.id}>
          {book.judul} {book.penulis} {book.penerbit}
        </li>
      ))}
    </ul>
  );
}
