"use client";

import React, { useState, useEffect } from "react";
import { useAuthModal } from "@/context/AuthModalContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from 'next/image';
import { AiOutlineHome, AiOutlineSearch } from "react-icons/ai";
import { BsBookmark, BsPen, BsQuestionCircle, BsStar } from "react-icons/bs";
import { IoLogOutOutline, IoMenuOutline } from "react-icons/io5";

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
  const { user, loading, logoutUser, openModal } = useAuthModal();
  const router = useRouter();

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
        <div className="search__background">
          <div className="search__wrapper">
            <figure>
              <Image
                src="/assets/logo.png" 
                alt="Summarist Logo" 
                width={150}
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
                <div className="sidebar__icon--wrapper">
                  <svg 
                    stroke="currentColor" 
                    fill="none" 
                    strokeWidth="0" 
                    viewBox="0 0 15 15" 
                    height="1em" 
                    width="1em" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      fillRule="evenodd" 
                      clipRule="evenodd" 
                      d="M7.07095 0.650238C6.67391 0.650238 6.32977 0.925096 6.24198 1.31231L6.0039 2.36247C5.6249 2.47269 5.26335 2.62363 4.92436 2.81013L4.01335 2.23585C3.67748 2.02413 3.23978 2.07312 2.95903 2.35386L2.35294 2.95996C2.0722 3.2407 2.0232 3.6784 2.23493 4.01427L2.80942 4.92561C2.62307 5.2645 2.47227 5.62594 2.36216 6.00481L1.31209 6.24287C0.924883 6.33065 0.650024 6.6748 0.650024 7.07183V7.92897C0.650024 8.32601 0.924883 8.67015 1.31209 8.75794L2.36228 8.99603C2.47246 9.375 2.62335 9.73652 2.80979 10.0755L2.2354 10.9867C2.02367 11.3225 2.07267 11.7602 2.35341 12.041L2.95951 12.6471C3.24025 12.9278 3.67795 12.9768 4.01382 12.7651L4.92506 12.1907C5.26384 12.377 5.62516 12.5278 6.0039 12.6379L6.24198 13.6881C6.32977 14.0753 6.67391 14.3502 7.07095 14.3502H7.92809C8.32512 14.3502 8.66927 14.0753 8.75705 13.6881L8.99505 12.6383C9.37411 12.5282 9.73573 12.3773 10.0748 12.1909L10.986 12.7653C11.3218 12.977 11.7595 12.928 12.0403 12.6473L12.6464 12.0412C12.9271 11.7604 12.9761 11.3227 12.7644 10.9869L12.1902 10.076C12.3768 9.73688 12.5278 9.37515 12.638 8.99596L13.6879 8.75794C14.0751 8.67015 14.35 8.32601 14.35 7.92897V7.07183C14.35 6.6748 14.0751 6.33065 13.6879 6.24287L12.6381 6.00488C12.528 5.62578 12.3771 5.26414 12.1906 4.92507L12.7648 4.01407C12.9766 3.6782 12.9276 3.2405 12.6468 2.95975L12.0407 2.35366C11.76 2.07292 11.3223 2.02392 10.9864 2.23565L10.0755 2.80989C9.73622 2.62328 9.37437 2.47229 8.99505 2.36209L8.75705 1.31231C8.66927 0.925096 8.32512 0.650238 7.92809 0.650238H7.07095ZM4.92053 3.81251C5.44724 3.44339 6.05665 3.18424 6.71543 3.06839L7.07095 1.50024H7.92809L8.28355 3.06816C8.94267 3.18387 9.5524 3.44302 10.0794 3.81224L11.4397 2.9547L12.0458 3.56079L11.1882 4.92117C11.5573 5.44798 11.8164 6.0575 11.9321 6.71638L13.5 7.07183V7.92897L11.932 8.28444C11.8162 8.94342 11.557 9.55301 11.1878 10.0798L12.0453 11.4402L11.4392 12.0462L10.0787 11.1886C9.55192 11.5576 8.94241 11.8166 8.28355 11.9323L7.92809 13.5002H7.07095L6.71543 11.932C6.0569 11.8162 5.44772 11.5572 4.92116 11.1883L3.56055 12.046L2.95445 11.4399L3.81213 10.0794C3.4431 9.55266 3.18403 8.94326 3.06825 8.2845L1.50002 7.92897V7.07183L3.06818 6.71632C3.18388 6.05765 3.44283 5.44833 3.81171 4.92165L2.95398 3.561L3.56008 2.95491L4.92053 3.81251ZM9.02496 7.50008C9.02496 8.34226 8.34223 9.02499 7.50005 9.02499C6.65786 9.02499 5.97513 8.34226 5.97513 7.50008C5.97513 6.65789 6.65786 5.97516 7.50005 5.97516C8.34223 5.97516 9.02496 6.65789 9.02496 7.50008ZM9.92496 7.50008C9.92496 8.83932 8.83929 9.92499 7.50005 9.92499C6.1608 9.92499 5.07513 8.83932 5.07513 7.50008C5.07513 6.16084 6.1608 5.07516 7.50005 5.07516C8.83929 5.07516 9.92496 6.16084 9.92496 7.50008Z" 
                      fill="currentColor"
                    ></path>
                  </svg>
                </div>
                <div className="sidebar__link--text">Settings</div>
              </Link>

              <div className="sidebar__link--wrapper sidebar__link--not-allowed">
                <div className="sidebar__link--line"></div>
                <div className="sidebar__icon--wrapper"><BsQuestionCircle /></div>
                <div className="sidebar__link--text">Help &amp; Support</div>
              </div>

              {/* Dynamic Authentication Button Action Element */}
              {user ? (
                <div className="sidebar__link--wrapper" onClick={logoutUser} style={{ cursor: "pointer" }}>
                  <div className="sidebar__link--line"></div>
                  <div className="sidebar__icon--wrapper"><IoLogOutOutline /></div>
                  <div className="sidebar__link--text">Logout</div>
                </div>
              ) : (
                <div className="sidebar__link--wrapper" onClick={openModal} style={{ cursor: "pointer" }}>
                  <div className="sidebar__link--line"></div>
                  <div className="sidebar__icon--wrapper"><IoLogOutOutline /></div>
                  <div className="sidebar__link--text">Login</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="container">
            <div className="for-you__wrapper">
              <div className="for-you__title">Selected just for you</div>
              {selectedBook && (
                <>
                  <audio src={selectedBook.audioLink}></audio>
                  <Link className="selected__book" href={`/book/${selectedBook.id}`}>
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
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path></svg>
                          </div>
                          <div className="selected__book--duration">
                            3 min 23 sec
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </>
              )}

              <div>
                <div className="for-you__title">Recommended For You</div>
                <div className="for-you__sub--title">We think you’ll like these</div>
                <div className="for-you__recommended--books">
                  {recommendedBooks.map((book) => (
                    <Link key={book.id} className="for-you__recommended--books-link" href={`/book/${book.id}`} style={{ position: "relative" }}>
                      <audio src={book.audioLink}></audio>
                      
                      {book.subscriptionRequired && (
                        <div className="book-pill" style={{ position: "absolute", top: "16px", right: "16px", backgroundColor: "#032b41", color: "white", padding: "2px 8px", borderRadius: "20px", fontSize: "10px", fontWeight: "600", zIndex: 10 }}>
                          Premium
                        </div>
                      )}

                      <figure className="recommended__book--img-mask">
                        <img className="recommended__book--img" src={book.imageLink} alt={book.title} />
                      </figure>
                      <div className="recommended__book--title">{book.title}</div>
                      <div className="recommended__book--author">{book.author}</div>
                      <div className="recommended__book--sub-title">{book.subTitle}</div>
                      <div className="recommended__book--details-wrapper">
                        <div className="recommended__book--details">
                          <div className="recommended__book--details-icon"><BsStar /></div>
                          <div className="recommended__book--details-text">{book.averageRating?.toFixed(1)}</div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <div className="for-you__title">Suggested Books</div>
                <div className="for-you__sub--title">Browse those books</div>
                <div className="for-you__recommended--books">
                  {suggestedBooks.map((book) => (
                    <Link key={book.id} className="for-you__recommended--books-link" href={`/book/${book.id}`} style={{ position: "relative" }}>
                      <audio src={book.audioLink}></audio>

                      {book.subscriptionRequired && (
                        <div className="book-pill" style={{ position: "absolute", top: "16px", right: "16px", backgroundColor: "#032b41", color: "white", padding: "2px 8px", borderRadius: "20px", fontSize: "10px", fontWeight: "600", zIndex: 10 }}>
                          Premium
                        </div>
                      )}

                      <figure className="recommended__book--img-mask">
                        <img className="recommended__book--img" src={book.imageLink} alt={book.title} />
                      </figure>
                      <div className="recommended__book--title">{book.title}</div>
                      <div className="recommended__book--author">{book.author}</div>
                      <div className="recommended__book--sub-title">{book.subTitle}</div>
                      <div className="recommended__book--details-wrapper">
                        <div className="recommended__book--details">
                          <div className="recommended__book--details-icon"><BsStar /></div>
                          <div className="recommended__book--details-text">{book.averageRating?.toFixed(1)}</div>
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