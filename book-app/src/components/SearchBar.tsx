"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { AiOutlineSearch } from "react-icons/ai";

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
                {search ? (
                  <svg 
                    stroke="currentColor" 
                    fill="none" 
                    strokeWidth="0" 
                    viewBox="0 0 24 24" 
                    className="search__delete--icon" 
                    height="1em" 
                    width="1em" 
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ cursor: "pointer" }}
                    onClick={handleCloseDropdown}
                  >
                    <path d="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z" fill="currentColor"></path>
                  </svg>
                ) : (
                  <AiOutlineSearch />
                )}
              </div>

              {isOpen && (loading || results.length > 0) && (
                <div className="search__results--dropdown">
                  {loading ? (
                    <div className="search__loading--spinner"></div>
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

          <div className="sidebar__toggle--btn" style={{ display: "none" }}>
            <svg stroke="currentColor" fill="none" strokeWidth="0" viewBox="0 0 15 15" height="1em" width="1em">
              <path fillRule="evenodd" clipRule="evenodd" d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z" fill="currentColor" />
            </svg>
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