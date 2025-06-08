"use client";
import { useRouter } from "next/navigation";
import React, { useRef } from "react";

const SearchBar = () => {
  const searchRef = useRef();
  const router = useRouter();
  const handleSearch = (event) => {
    const keyword = searchRef.current.value;
    if (event.key == "Enter" || event.key == "Click") {
      event.preventDefault();
      router.push(`/buku/${keyword}`);
    }
  };
  return (
    <div>
      <input type="text" ref={searchRef} onKeyDown={handleSearch} />
      <button onClick={handleSearch}>Cari</button>
    </div>
  );
};

export default SearchBar;
