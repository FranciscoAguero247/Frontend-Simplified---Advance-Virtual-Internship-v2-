"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { AiOutlineSearch } from "react-icons/ai";
import { IoMenuOutline } from "react-icons/io5";

interface SearchResultBook {
  id: string;
  title: string;
  author: string;
  imageLink: string;      
  audioLink?: string;     
  durationText?: string;  
}

interface SearchResultsListProps {
  books: SearchResultBook[];
  onCloseDropdown: () => void;
}

export default function SearchBar() {
  const pathname = usePathname();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [results, setResults] = useState<SearchResultBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const controller = new AbortController();
    setIsOpen(true);

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBooksByAuthorOrTitle?search=${encodeURIComponent(search)}`,
          { signal: controller.signal }
        );
        const data = await response.json();
        setResults(data || []);
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("Error fetching matching books:", error);
        }
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(delayDebounceFn);
      controller.abort();
    };
  }, [search]);

  const handleCloseDropdown = () => {
    setSearch("");
    setResults([]);
    setIsOpen(false);
  };

  if (pathname === "/" || pathname === "/choose-plan") {
    return null;
  }

  return (
    <div className="search__background">
      <div className="search__wrapper">
        <figure style={{ cursor: "pointer" }} onClick={() => router.push("/for-you")}>
          <Image src="/assets/logo.png" alt="Summarist Logo" width={150} height={40} priority />
        </figure>
        <div className="search__content">
          <div className="search" ref={searchRef}>
            <div className="search__input--wrapper" style={{ position: "relative" }}>
              <input
                className="search__input"
                placeholder="Search for books"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => { if (search.trim()) setIsOpen(true); }}
              />
              <div className="search__icon">
                <AiOutlineSearch />
              </div>

              {isOpen && (loading || results.length > 0) && (
                <div className="search__results--dropdown">
                  {loading ? (
                    <div className="search__loading--spinner">Searching summaries...</div>
                  ) : (
                    <SearchResultsList 
                      books={results} 
                      onCloseDropdown={handleCloseDropdown} 
                    />
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="sidebar__toggle--btn">
            <IoMenuOutline />
          </div>
        </div>
      </div>
    </div>
  );
}

function SearchResultsList({ books, onCloseDropdown }: SearchResultsListProps) {
  const router = useRouter();

  const handleNavigation = (e: React.MouseEvent, bookId: string) => {
    e.preventDefault();
    onCloseDropdown();
    router.push(`/book/${bookId}`);
  };

  if (!books || books.length === 0) {
    return null;
  }

  return (
    <div className="search__books--wrapper">
      {books.map((book) => {
        const safeTitle = book.title || "Untitled Summary";
        const safeAuthor = book.author || "Unknown Author";
        const safeDuration = book.durationText || "Audio & Text"; 
        const safeImage = book.imageLink || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=80&q=75";

        return (
          <a
            key={book.id}
            href={`/book/${book.id}`}
            className="search__book--link"
            onClick={(e) => handleNavigation(e, book.id)}
          >
            {book.audioLink && (
              <audio src={book.audioLink} preload="none" />
            )}

            <figure 
              className="book__image--wrapper" 
              style={{ height: "80px", width: "80px", minWidth: "80px", position: "relative" }}
            >
              <Image
                className="book__image"
                src={safeImage}
                alt={safeTitle}
                fill
                sizes="80px"
                unoptimized 
                style={{ objectFit: "cover", display: "block" }}
              />
            </figure>

            <div>
              <div className="search__book--title">
                {safeTitle}
              </div>
              
              <div className="search__book--author">
                {safeAuthor}
              </div>
              
              <div className="search__book--duration">
                <div className="recommended__book--details" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <div className="recommended__book--details-icon" style={{ display: "flex", alignItems: "center", color: "#6b757b" }}>
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="14px" width="14px">
                      <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
                      <path d="M13 7h-2v6h6v-2h-4z" />
                    </svg>
                  </div>
                  <div className="recommended__book--details-text">
                    {safeDuration}
                  </div>
                </div>
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );
}