import BookCard from "../bookCard/bookCard";

const BookGrid = ({ books }) => {
  if (!books || books.length === 0) {
    return (
      <p className="text-center text-gray-500 col-span-full">
        Tidak ada buku yang ditemukan.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
};

export default BookGrid;
