import React from "react";
import CreateBookForm from "@/components/atom/admin/bookForm/bookForm";

const Page = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tambah Buku Baru</h1>
      <CreateBookForm />
    </div>
  );
};

export default Page;
