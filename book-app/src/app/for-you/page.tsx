"use client";

import React, { useState, useEffect } from "react";
import { useAuthModal } from "@/context/AuthModalContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from 'next/image';
import { AiOutlineHome, AiOutlineSearch } from "react-icons/ai";
import { BsBookmark, BsPen, BsQuestionCircle, BsStar } from "react-icons/bs";
import { IoLogOutOutline, IoMenuOutline, IoTimeOutline } from "react-icons/io5";

interface Book {
  id: string;
  title: string;
  author: string;
  subTitle: string;
  imageUrl: string;
  audioUrl: string;
  duration: number; // seconds
  averageRating: number;
}

export default function ForYouPage() {
  const { user, loading, logoutUser } = useAuthModal();
  const router = useRouter();

  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [suggestedBooks, setSuggestedBooks] = useState<Book[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Guard routing logic
  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  // Data pulling engine
  useEffect(() => {
    if (!user) return;

    async function fetchDashboardData() {
      try {
        setDataLoading(true);
        const baseUrl = "https://us-central1-summaristt.cloudfunctions.net/getBooks";
        
        const [selectedRes, recommendedRes, suggestedRes] = await Promise.all([
          fetch(`${baseUrl}?status=selected`),
          fetch(`${baseUrl}?status=recommended`),
          fetch(`${baseUrl}?status=suggested`)
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
        console.error("Error loading dashboard data streams:", error);
      } finally {
        setDataLoading(false);
      }
    }

    fetchDashboardData();
  }, [user]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };
  

  if (loading || dataLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontFamily: "sans-serif" }}>
        <h2 style={{ color: "#032b41", fontWeight: 500 }}>Loading your personalized view...</h2>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div id="__next">
      <div className="wrapper">
        
        {/* --- GLOBAL SEARCH HEADER BAR --- */}
        <div className="search__background">
          <div className="search__wrapper">
            <figure>
                <Image
                src="/assets/logo.png" alt="Summarist Logo" width={150}
                height={40}
                />
            </figure>
            <div className="search__content">
              <div className="search">
                <div className="search__input--wrapper">
                  <input className="search__input" placeholder="Search for books" type="text" />
                  <div className="search__icon">
                    <AiOutlineSearch />
                  </div>
                </div>
              </div>
              <div className="sidebar__toggle--btn">
                <IoMenuOutline />
              </div>
            </div>
          </div>
        </div>

        {/* --- NAVIGATION SIDEBAR --- */}
        <div className="sidebar__overlay sidebar__overlay--hidden"></div>
        <div className="sidebar">
          <div className="sidebar__logo">
            <Image
                src="/assets/logo.png" 
                alt="Logo" 
                width="160" 
                height="37"
            />
          </div>
          <div className="sidebar__wrapper">
            <div className="sidebar__top">
              <Link className="sidebar__link--wrapper" href="/for-you">
                <div className="sidebar__link--line active--tab"></div>
                <div className="sidebar__icon--wrapper"><AiOutlineHome /></div>
                <div className="sidebar__link--text">For you</div>
              </Link>
              <Link className="sidebar__link--wrapper" href="/library">
                <div className="sidebar__link--line"></div>
                <div className="sidebar__icon--wrapper"><BsBookmark /></div>
                <div className="sidebar__link--text">My Library</div>
              </Link>
              <div className="sidebar__link--wrapper sidebar__link--not-allowed">
                <div className="sidebar__link--line"></div>
                <div className="sidebar__icon--wrapper"><BsPen /></div>
                <div className="sidebar__link--text">Highlights</div>
              </div>
              <div className="sidebar__link--wrapper sidebar__link--not-allowed">
                <div className="sidebar__link--line"></div>
                <div className="sidebar__icon--wrapper"><AiOutlineSearch /></div>
                <div className="sidebar__link--text">Search</div>
              </div>
            </div>
            <div className="sidebar__bottom">
              <Link className="sidebar__link--wrapper" href="/settings">
                <div className="sidebar__link--line"></div>
                <div className="sidebar__icon--wrapper"><BsQuestionCircle /></div>
                <div className="sidebar__link--text">Settings</div>
              </Link>
              <div className="sidebar__link--wrapper sidebar__link--not-allowed">
                <div className="sidebar__link--line"></div>
                <div className="sidebar__icon--wrapper"><BsQuestionCircle /></div>
                <div className="sidebar__link--text">Help &amp; Support</div>
              </div>
              <div className="sidebar__link--wrapper" onClick={logoutUser} style={{ cursor: "pointer" }}>
                <div className="sidebar__link--line"></div>
                <div className="sidebar__icon--wrapper"><IoLogOutOutline /></div>
                <div className="sidebar__link--text">Logout</div>
              </div>
            </div>
          </div>
        </div>

        {/* --- MAIN INTERFACE PANELS --- */}
        <div className="row">
          <div className="container">
            <div className="for-you__wrapper">
              
              {/* --- MODULE 1: SELECTED JUST FOR YOU --- */}
              <div className="for-you__title">Selected just for you</div>
              {selectedBook && (
                <>
                  <audio src={selectedBook.audioUrl}></audio>
                  <Link className="selected__book" href={`/book/${selectedBook.id}`}>
                    <div className="selected__book--sub-title">{selectedBook.subTitle}</div>
                    <div className="selected__book--line"></div>
                    <div className="selected__book--content">
                      <figure className="recommended__book--img-mask" style={{ height: "140px", width: "140px", minWidth: "140px" }}>
                        <img className="recommended__book--img" src={selectedBook.imageUrl} alt={selectedBook.title} style={{ display: "block" }} />
                      </figure>
                      <div className="selected__book--text">
                        <div className="selected__book--title">{selectedBook.title}</div>
                        <div className="selected__book--author">{selectedBook.author}</div>
                        <div className="selected__book--duration-wrapper">
                          <div className="selected__book--icon">
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path></svg>
                          </div>
                          <div className="selected__book--duration">
                            {formatDuration(selectedBook.duration)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </>
              )}

              {/* --- MODULE 2: RECOMMENDED FOR YOU --- */}
              <div>
                <div className="for-you__title">Recommended For You</div>
                <div className="for-you__sub--title">We think you’ll like these</div>
                <div className="for-you__recommended--books">
                  {recommendedBooks.map((book) => (
                    <Link key={book.id} className="for-you__recommended--books-link" href={`/book/${book.id}`}>
                      <audio src={book.audioUrl}></audio>
                      <figure className="recommended__book--img-mask">
                        <img className="recommended__book--img" src={book.imageUrl} alt={book.title} />
                      </figure>
                      <div className="recommended__book--title">{book.title}</div>
                      <div className="recommended__book--author">{book.author}</div>
                      <div className="recommended__book--sub-title">{book.subTitle}</div>
                      <div className="recommended__book--details-wrapper">
                        <div className="recommended__book--details">
                          <div className="recommended__book--details-icon"><IoTimeOutline /></div>
                          <div className="recommended__book--details-text">{formatDuration(book.duration)}</div>
                        </div>
                        <div className="recommended__book--details">
                          <div className="recommended__book--details-icon"><BsStar /></div>
                          <div className="recommended__book--details-text">{book.averageRating.toFixed(1)}</div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* --- MODULE 3: SUGGESTED BOOKS --- */}
              <div>
                <div className="for-you__title">Suggested Books</div>
                <div className="for-you__sub--title">Browse those books</div>
                <div className="for-you__recommended--books">
                  {suggestedBooks.map((book) => (
                    <Link key={book.id} className="for-you__recommended--books-link" href={`/book/${book.id}`}>
                      <audio src={book.audioUrl}></audio>
                      <figure className="recommended__book--img-mask">
                        <img className="recommended__book--img" src={book.imageUrl} alt={book.title} />
                      </figure>
                      <div className="recommended__book--title">{book.title}</div>
                      <div className="recommended__book--author">{book.author}</div>
                      <div className="recommended__book--sub-title">{book.subTitle}</div>
                      <div className="recommended__book--details-wrapper">
                        <div className="recommended__book--details">
                          <div className="recommended__book--details-icon"><IoTimeOutline /></div>
                          <div className="recommended__book--details-text">{formatDuration(book.duration)}</div>
                        </div>
                        <div className="recommended__book--details">
                          <div className="recommended__book--details-icon"><BsStar /></div>
                          <div className="recommended__book--details-text">{book.averageRating.toFixed(1)}</div>
                        </div>
                      </div>
                    </Link>
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