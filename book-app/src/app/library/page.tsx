"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AiOutlineClockCircle, AiFillStar } from "react-icons/ai";
import { BookRowSkeleton } from "@/components/Skeletons";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import { useLibrary } from "@/context/LibraryContext";

interface Book {
  id: string;
  title: string;
  author: string;
  subTitle: string;
  imageLink: string;
  audioLink?: string;
  durationText?: string;
  averageRating?: number;
  subscriptionRequired?: boolean;
}

export default function LibraryPage() {
  const { savedBookIds, finishedBookIds, loading: contextLoading } = useLibrary();
  
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [loadingBooks, setLoadingBooks] = useState<boolean>(true);

  useEffect(() => {
    async function fetchCatalog() {
      try {
        setLoadingBooks(true);
        const response = await fetch("https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended");
        const data = await response.json();
        setAllBooks(data || []);
      } catch (error) {
        console.error("Error loading master catalog metadata resources:", error);
      } finally {
        setLoadingBooks(false);
      }
    }
    fetchCatalog();
  }, []);

  const savedBooksList = allBooks.filter((book) => savedBookIds.includes(book.id));
  const finishedBooksList = allBooks.filter((book) => finishedBookIds.includes(book.id));

  const pageLoading = contextLoading || loadingBooks;

  return (
    <div id="__next">
      <div className="wrapper">
        <SearchBar />
        <div className="sidebar__overlay sidebar__overlay--hidden"></div>
        <Sidebar isMobileMenuOpen={false} onToggleMobileMenu={() => {}} />

        <div className="container">
          <div className="row" style={{ padding: "40px 0" }}>
            
            {pageLoading ? (
              <>
                <div className="for-you__title" style={{ marginBottom: "20px" }}>Saved Books</div>
                <BookRowSkeleton />
                <div className="for-you__title" style={{ marginTop: "40px", marginBottom: "20px" }}>Finished</div>
                <BookRowSkeleton />
              </>
            ) : (
              <>
                <div className="for-you__title">Saved Books</div>
                <div className="for-you__sub--title" style={{ marginBottom: "24px" }}>
                  {savedBooksList.length} {savedBooksList.length === 1 ? "item" : "items"}
                </div>
                
                {savedBooksList.length === 0 ? (
                  <div className="finished__books--block-wrapper" style={{ marginBottom: "40px" }}>
                    <div className="finished__books--title">Save your favorite books!</div>
                    <div className="finished__books--sub-title">When you save a book, it will appear here.</div>
                  </div>
                ) : (
                  <div className="for-you__recommended--books" style={{ display: "flex", flexWrap: "wrap", gap: "24px", marginBottom: "48px" }}>
                    {savedBooksList.map((book) => renderLibraryBookCard(book))}
                  </div>
                )}

                <div className="for-you__title">Finished</div>
                <div className="for-you__sub--title" style={{ marginBottom: "24px" }}>
                  {finishedBooksList.length} {finishedBooksList.length === 1 ? "item" : "items"}
                </div>
                
                {finishedBooksList.length === 0 ? (
                  <div className="finished__books--block-wrapper">
                    <div className="finished__books--title">Done reading?</div>
                    <div className="finished__books--sub-title">When you finish an audiobook, it will appear here.</div>
                  </div>
                ) : (
                  <div className="for-you__recommended--books" style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
                    {finishedBooksList.map((book) => renderLibraryBookCard(book))}
                  </div>
                )}
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

function renderLibraryBookCard(book: Book) {
  const safeTitle = book.title || "Untitled Summary";
  const safeAuthor = book.author || "Unknown Author";
  const safeSubtitle = book.subTitle || "";
  const safeDuration = book.durationText || "Audio & Text";
  const safeRating = book.averageRating || 4.5;
  const safeImage = book.imageLink || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=180&q=75";

  return (
    <Link 
      key={book.id} 
      className="for-you__recommended--books-link" 
      href={`/book/${book.id}`}
      style={{ textDecoration: "none", width: "calc(33.333% - 16px)", minWidth: "180px" }}
    >
      {book.subscriptionRequired && (
        <div className="book__pill book__pill--subscription-required" style={{ zIndex: 2 }}>Premium</div>
      )}
      
      <figure className="book__image--wrapper" style={{ marginBottom: "12px", width: "100%", height: "240px", position: "relative" }}>
        <img 
          className="book__image" 
          src={safeImage} 
          alt={safeTitle} 
          style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", borderRadius: "4px" }} 
        />
      </figure>
      
      <div className="recommended__book--title" style={{ fontWeight: 700, color: "#032b41", fontSize: "16px", marginBottom: "4px" }}>
        {safeTitle}
      </div>
      <div className="recommended__book--author" style={{ color: "#6b757b", fontSize: "14px", marginBottom: "4px" }}>
        {safeAuthor}
      </div>
      <div className="recommended__book--sub-title" style={{ color: "#394547", fontSize: "13px", marginBottom: "8px", lineClamp: 2, WebkitLineClamp: 2, display: "-webkit-box", WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {safeSubtitle}
      </div>
      
      <div className="recommended__book--details-wrapper" style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <div className="recommended__book--details" style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#6b757b" }}>
          <div className="recommended__book--details-icon" style={{ display: "flex" }}>
            <AiOutlineClockCircle />
          </div>
          <div>{safeDuration}</div>
        </div>
        
        <div className="recommended__book--details" style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#6b757b" }}>
          <div className="recommended__book--details-icon" style={{ display: "flex", color: "#f1c40f" }}>
            <AiFillStar />
          </div>
          <div>{safeRating}</div>
        </div>
      </div>
    </Link>
  );
}