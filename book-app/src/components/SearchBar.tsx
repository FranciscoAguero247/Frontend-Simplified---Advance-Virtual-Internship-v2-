"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation"; // Used to hide component on specific Next.js routes
import { AiOutlineSearch } from "react-icons/ai";
import { IoMenuOutline } from "react-icons/io5";

export default function SearchBar() {
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Hide on Home ("/") and Sales Page ("/choose-plan")
  if (pathname === "/" || pathname === "/choose-plan") {
    return null;
  }

  // 2. Implementation of Debounce & API fetching
  useEffect(() => {
    // If the search input is empty, clear the results and don't call the API
    if (!search.trim()) {
      setResults([]);
      return;
    }

    // Set a timer to wait 300ms after the user finishes typing
    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBooksByAuthorOrTitle?search=${encodeURIComponent(search)}`
        );
        const data = await response.json();
        setResults(data || []);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    }, 300);

    // CRITICAL: Cleanup function. This clears the 300ms timer every time the user 
    // presses a key, ensuring the API is only hit 300ms AFTER they completely stop typing.
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  return (
    <div className="search__background">
      <div className="search__wrapper">
        <figure>
          <Image src="/assets/logo.png" alt="Summarist Logo" width={150} height={40} />
        </figure>
        <div className="search__content">
          <div className="search">
            <div className="search__input--wrapper" style={{ position: "relative" }}>
              <input
                className="search__input"
                placeholder="Search for books"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="search__icon">
                <AiOutlineSearch />
              </div>

              {/* --- Dropdown Results Overlay --- */}
              {(loading || results.length > 0) && (
                <div className="search__results--dropdown" style={dropdownStyles}>
                  {loading ? (
                    <div style={{ padding: "12px", color: "#666" }}>Searching...</div>
                  ) : (
                    results.map((book) => (
                      <div key={book.id} className="search__result-item" style={itemStyles}>
                        <div style={{ fontWeight: "bold" }}>{book.title}</div>
                        <div style={{ fontSize: "12px", color: "#666" }}>{book.author}</div>
                      </div>
                    ))
                  )}
                </div>
              )}
              {/* -------------------------------- */}

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

// Inline styles for the dropdown layout (you can move these to your global/module CSS files)
const dropdownStyles = {
  position: "absolute",
  top: "100%",
  left: 0,
  right: 0,
  backgroundColor: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: "4px",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  maxHeight: "320px",
  overflowY: "auto",
  zIndex: 50,
  marginTop: "4px",
};

const itemStyles = {
  padding: "10px 12px",
  borderBottom: "1px solid #f3f4f6",
  cursor: "pointer",
};