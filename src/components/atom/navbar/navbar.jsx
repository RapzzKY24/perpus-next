"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { Button } from "@/components/ui/button";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUser(decodedToken);
      } catch (error) {
        console.error("Token tidak valid:", error);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  };

  return (
    <nav className="bg-background/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold">
              BookHaven
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link
                href="/buku"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Katalog Buku
              </Link>
              {user && (
                <Link
                  href="/peminjaman"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  Peminjaman Saya
                </Link>
              )}
            </div>
          </div>
          <div>
            <SearchBar />
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="font-semibold text-sm">
                  Halo, {user.nama}!
                </span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Masuk</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Daftar</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
