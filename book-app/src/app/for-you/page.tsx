"use client";

import React, { useState, useEffect } from "react";
import { useAuthModal } from "@/context/AuthModalContext";
import { useMediaAccess } from "@/hooks/useMediaAccess";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import BookCard from "@/components/BookCard";

interface Book {
  id: string;
  author: string;
  title: string;
  subTitle: string;
  imageLink: string;
  audioLink: string;
  totalRating: number;
  averageRating: number;
  keyIdeas: number;
  type: string;
  status: "selected" | "recommended" | "suggested";
  subscriptionRequired: boolean;
  summary: string;
  tags: string[];
  bookDescription: string;
  authorDescription: string;
}

export default function ForYouPage() {
  const { loading } = useAuthModal();
  const { checkAccessAndNavigate } = useMediaAccess();

  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [suggestedBooks, setSuggestedBooks] = useState<Book[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setDataLoading(true);
        
        const [selectedRes, recommendedRes, suggestedRes] = await Promise.all([
          fetch("https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected"),
          fetch("https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended"),
          fetch("https://us-central1-summaristt.cloudfunctions.net/getBooks?status=suggested")
        ]);

        const selectedData = await selectedRes.json();
        const recommendedData = await recommendedRes.json();
        const suggestedData = await suggestedRes.json();

        if (selectedData && selectedData.length > 0) {
          setSelectedBook(selectedData[0]);
        }
        setRecommendedBooks(recommendedData || []);
        setSuggestedBooks(suggestedData || []);
      } catch (error) {
        console.error("Error standardizing dashboard data streams:", error);
      } finally {
        setDataLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading || dataLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontFamily: "sans-serif" }}>
        <h2 style={{ color: "#032b41", fontWeight: 500 }}>Loading your personalized view...</h2>
      </div>
    );
  }

  return (
    <div id="__next">
      <div className="wrapper">
        <SearchBar />
        <div className="sidebar__overlay sidebar__overlay--hidden"></div>
        <Sidebar />
        <div className="row">
          <div className="container">
            <div className="for-you__wrapper">
              
              <div className="for-you__title">Selected just for you</div>
              {selectedBook && (
                <div 
                  className="selected__book" 
                  onClick={() => checkAccessAndNavigate({ id: selectedBook.id, isPremium: selectedBook.subscriptionRequired })}
                  style={{ cursor: "pointer" }}
                >
                  <div className="selected__book--sub-title">{selectedBook.subTitle}</div>
                  <div className="selected__book--line"></div>
                  <div className="selected__book--content">
                    <figure className="recommended__book--img-mask" style={{ height: "140px", width: "140px", minWidth: "140px", position: "relative" }}>
                      <img className="recommended__book--img" src={selectedBook.imageLink} alt={selectedBook.title} style={{ display: "block" }} />
                    </figure>
                    <div className="selected__book--text">
                      <div className="selected__book--title">{selectedBook.title}</div>
                      <div className="selected__book--author">{selectedBook.author}</div>
                      <div className="selected__book--duration-wrapper">
                        <div className="selected__book--icon">
                          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em">
                            <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path>
                          </svg>
                        </div>
                        <div className="selected__book--duration">3 min 23 sec</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <div className="for-you__title">Recommended For You</div>
                <div className="for-you__sub--title">We think you’ll like these</div>
                <div className="for-you__recommended--books">
                  {recommendedBooks.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              </div>

              <div>
                <div className="for-you__title">Suggested Books</div>
                <div className="for-you__sub--title">Browse those books</div>
                <div className="for-you__recommended--books">
                  {suggestedBooks.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}