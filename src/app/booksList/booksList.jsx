"use client";

import Link from "next/link";
import React from "react";

const BooksList = ({ api }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
      {api.booksList?.map((book) => (
        <Link
          key={book.id}
          className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col hover:shadow-2xl transition-shadow duration-300"
          href={`buku/${book.id}`}
        >
          <img
            src={book.gambarUrl}
            alt={book.judul}
            className="w-full h-64 object-cover"
          />
          <div className="p-4 flex flex-col flex-1">
            <h3 className="text-xl font-bold mb-2 truncate">{book.judul}</h3>
            <p className="text-gray-600 font-medium">{book.penulis}</p>
            <p className="text-gray-500 font-medium">{book.tahunTerbit}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default BooksList;
