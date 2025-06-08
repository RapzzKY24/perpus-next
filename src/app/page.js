import { fetchApi } from "@/libs/api";
import React from "react";
import BooksList from "./booksList/booksList";

const Page = async () => {
  const books = await fetchApi("api", "buku");
  return (
    <div>
      <BooksList api={books} />
    </div>
  );
};

export default Page;
