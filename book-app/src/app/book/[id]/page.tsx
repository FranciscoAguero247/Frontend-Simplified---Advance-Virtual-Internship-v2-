"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthModal } from '@/context/AuthModalContext';
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineHome, AiOutlineSearch } from "react-icons/ai";
import { BsBookmark, BsPen, BsQuestionCircle } from "react-icons/bs";
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
  subscriptionRequired: boolean;
  isPremium: boolean; // Fixed: Added missing type definition
  summary: string;
  tags: string[];
  bookDescription: string;
  authorDescription: string;
}

export default function BookDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const bookId = params.id as string;

  // Note: If onSaveBook comes from your Auth context, make sure to destructure it here
  const { user, logoutUser, openModal, isSubscribed } = useAuthModal();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookId) return;

    async function fetchBookDetails() {
      try {
        setLoading(true);
        const response = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${bookId}`
        );
        const data = await response.json();
        setBook(data);
      } catch (error) {
        console.error("Error fetching targeted book specifications:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBookDetails();
  }, [bookId]);

  const handleMediaAccess = () => {
    if (!book) return;

    if (!user) {
      openModal(pathname);
      return;
    }
    
    if (book.isPremium && !isSubscribed) {
      router.push('/choose-plan');
      return;
    }

    router.push(`/player/${book.id}`);
  };

  const handleBookmarkClick = () => {
    if (!book) return;

    if (!user) {
      openModal();
      return;
    }

    console.log("Saving book to library:", book.title);
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontFamily: "sans-serif" }}>
        <h2 style={{ color: "#032b41", fontWeight: 500 }}>Loading book details...</h2>
      </div>
    );
  }

  if (!book) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontFamily: "sans-serif" }}>
        <h2 style={{ color: "#032b41", fontWeight: 500 }}>Book layout metadata records not found.</h2>
      </div>
    );
  }

  return (
    <div id="__next">
      <div className="wrapper">
        <div className="search__background">
          <div className="search__wrapper">
            <figure>
              <Image src="/assets/logo.png" alt="Summarist Logo" width={150} height={40} />
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
            <Image src="/assets/logo.png" alt="Logo" width={160} height={37} />
          </div>
          <div className="sidebar__wrapper">
            <div className="sidebar__top">
              <Link className="sidebar__link--wrapper" href="/for-you">
                <div className="sidebar__link--line"></div>
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
                  <svg stroke="currentColor" fill="none" strokeWidth="0" viewBox="0 0 15 15" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M7.07095 0.650238C6.67391 0.650238 6.32977 0.925096 6.24198 1.31231L6.0039 2.36247C5.6249 2.47269 5.26335 2.62363 4.92436 2.81013L4.01335 2.23585C3.67748 2.02413 3.23978 2.07312 2.95903 2.35386L2.35294 2.95996C2.0722 3.2407 2.0232 3.6784 2.23493 4.01427L2.80942 4.92561C2.62307 5.2645 2.47227 5.62594 2.36216 6.00481L1.31209 6.24287C0.924883 6.33065 0.650024 6.6748 0.650024 7.07183V7.92897C0.650024 8.32601 0.924883 8.67015 1.31209 8.75794L2.36228 8.99603C2.47246 9.375 2.62335 9.73652 2.80979 10.0755L2.2354 10.9867C2.02367 11.3225 2.07267 11.7602 2.35341 12.041L2.95951 12.6471C3.24025 12.9278 3.67795 12.9768 4.01382 12.7651L4.92506 12.1907C5.26384 12.377 5.62516 12.5278 6.0039 12.6379L6.24198 13.6881C6.32977 14.0753 6.67391 14.3502 7.07095 14.3502H7.92809C8.32512 14.3502 8.66927 14.0753 8.75705 13.6881L8.99505 12.6383C9.37411 12.5282 9.73573 12.3773 10.0748 12.1909L10.986 12.7653C11.3218 12.977 11.7595 12.928 12.0403 12.6473L12.6464 12.0412C12.9271 11.7604 12.9761 11.3227 12.7644 10.9869L12.1902 10.076C12.3768 9.73688 12.5278 9.37515 12.638 8.99596L13.6879 8.75794C14.0751 8.67015 14.35 8.32601 14.35 7.92897V7.07183C14.35 6.6748 14.0751 6.33065 13.6879 6.24287L12.6381 6.00488C12.528 5.62578 12.3771 5.26414 12.1906 4.92507L12.7648 4.01407C12.9766 3.6782 12.9276 3.2405 12.6468 2.95975L12.0407 2.35366C11.76 2.07292 11.3223 2.02392 10.9864 2.23565L10.0755 2.80989C9.73622 2.62328 9.37437 2.47229 8.99505 2.36209L8.75705 1.31231C8.66927 0.925096 8.32512 0.650238 7.92809 0.650238H7.07095ZM4.92053 3.81251C5.44724 3.44339 6.05665 3.18424 6.71543 3.06839L7.07095 1.50024H7.92809L8.28355 3.06816C8.94267 3.18387 9.5524 3.44302 10.0794 3.81224L11.4397 2.9547L12.0458 3.56079L11.1882 4.92117C11.5573 5.44798 11.8164 6.0575 11.9321 6.71638L13.5 7.07183V7.92897L11.932 8.28444C11.8162 8.94342 11.557 9.55301 11.1878 10.0798L12.0453 11.4402L11.4392 12.0462L10.0787 11.1886C9.55192 11.5576 8.94241 11.8166 8.28355 11.9323L7.92809 13.5002H7.07095L6.71543 11.932C6.0569 11.8162 5.44772 11.5572 4.92116 11.1883L3.56055 12.046L2.95445 11.4399L3.81213 10.0794C3.4431 9.55266 3.18403 8.94326 3.06825 8.2845L1.50002 7.92897V7.07183L3.06818 6.71632C3.18388 6.05765 3.44283 5.44833 3.81171 4.92165L2.95398 3.561L3.56008 2.95491L4.92053 3.81251ZM9.02496 7.50008C9.02496 8.34226 8.34223 9.02499 7.50005 9.02499C6.65786 9.02499 5.97513 8.34226 5.97513 7.50008C5.97513 6.65789 6.65786 5.97516 7.50005 5.97516C8.34223 5.97516 9.02496 6.65789 9.02496 7.50008ZM9.92496 7.50008C9.92496 8.83932 8.83929 9.92499 7.50005 9.92499C6.1608 9.92499 5.07513 8.83932 5.07513 7.50008C5.07513 6.16084 6.1608 5.07516 7.50005 5.07516C8.83929 5.07516 9.92496 6.16084 9.92496 7.50008Z" fill="currentColor" />
                  </svg>
                </div>
                <div className="sidebar__link--text">Settings</div>
              </Link>
              <div className="sidebar__link--wrapper sidebar__link--not-allowed">
                <div className="sidebar__link--line"></div>
                <div className="sidebar__icon--wrapper"><BsQuestionCircle /></div>
                <div className="sidebar__link--text">Help &amp; Support</div>
              </div>

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
          <audio src={book.audioLink}></audio>
          <div className="container">
            <div className="inner__wrapper">
              <div className="inner__book">
                {/* Book Title Layout Block */}
                <div className="inner-book__title">
                  {book.title} {book.subscriptionRequired && "(Premium)"}
                </div>
                <div className="inner-book__author">{book.author}</div>
                <div className="inner-book__sub--title">{book.subTitle}</div>

                <div className="inner-book__wrapper">
                  <div className="inner-book__description--wrapper">
                    <div className="inner-book__description">
                      <div className="inner-book__icon">
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em">
                          <path d="M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 0 0 .6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0 0 46.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3zM664.8 561.6l36.1 210.3L512 672.7 323.1 772l36.1-210.3-152.8-149L417.6 382 512 190.7 606.4 382l211.2 30.7-152.8 148.9z"></path>
                        </svg>
                      </div>
                      <div className="inner-book__overall--rating">{book.averageRating?.toFixed(1)}&nbsp;</div>
                      <div className="inner-book__total--rating">({book.totalRating}&nbsp;ratings)</div>
                    </div>

                    <div className="inner-book__description">
                      <div className="inner-book__icon">
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em">
                          <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                          <path d="M686.7 638.6L544.1 535.5V288c0-4.4-3.6-8-8-8H488c-4.4 0-8 3.6-8 8v275.4c0 2.6 1.2 5 3.3 6.5l165.4 120.6c3.6 2.6 8.6 1.8 11.2-1.7l28.6-39c2.6-3.7 1.8-8.7-1.8-11.2z"></path>
                        </svg>
                      </div>
                      <div className="inner-book__duration">03:23</div>
                    </div>

                    <div className="inner-book__description">
                      <div className="inner-book__icon">
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em">
                          <path d="M842 454c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8 0 140.3-113.7 254-254 254S258 594.3 258 454c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8 0 168.7 126.6 307.9 290 327.6V884H326.7c-13.7 0-24.7 14.3-24.7 32v36c0 4.4 2.8 8 6.2 8h407.6c3.4 0 6.2-3.6 6.2-8v-36c0-17.7-11-32-24.7-32H548V782.1c165.3-18 294-158 294-328.1zM512 624c93.9 0 170-75.2 170-168V232c0-92.8-76.1-168-170-168s-170 75.2-170 168v224c0 92.8 76.1 168 170 168zm-94-392c0-50.6 41.9-92 94-92s94 41.4 94 92v224c0 50.6-41.9 92-94 92s-94-41.4-94-92V232z"></path>
                        </svg>
                      </div>
                      <div className="inner-book__type">{book.type}</div>
                    </div>

                    <div className="inner-book__description">
                      <div className="inner-book__icon">
                        <svg stroke="currentColor" fill="none" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                        </svg>
                      </div>
                      <div className="inner-book__key--ideas">{book.keyIdeas} Key ideas</div>
                    </div>
                  </div>
                </div>

                <div className="inner-book__read--btn-wrapper">
                  <button className="inner-book__read--btn" onClick={handleMediaAccess}>
                    <div className="inner-book__read--icon">
                      <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em">
                        <path d="M928 161H699.2c-49.1 0-97.1 14.1-138.4 40.7L512 233l-48.8-31.3A255.2 255.2 0 0 0 324.8 161H96c-17.7 0-32 14.3-32 32v568c0 17.7 14.3 32 32 32h228.8c49.1 0 97.1 14.1 138.4 40.7l44.4 28.6c1.3.8 2.8 1.3 4.3 1.3s3-.4 4.3-1.3l44.4-28.6C602 807.1 650.1 793 699.2 793H928c17.7 0 32-14.3 32-32V193c0-17.7-14.3-32-32-32zM324.8 721H136V233h188.8c35.4 0 69.8 10.1 99.5 29.2l48.8 31.3 6.9 4.5v462c-47.6-25.6-100.8-39-155.2-39zm563.2 0H699.2c-54.4 0-107.6 13.4-155.2 39V298l6.9-4.5 48.8-31.3c29.7-19.1 64.1-29.2 99.5-29.2H888v488zM396.9 361H211.1c-3.9 0-7.1 3.4-7.1 7.5v45c0 4.1 3.2 7.5 7.1 7.5h185.7c3.9 0 7.1-3.4 7.1-7.5v-45c.1-4.1-3.1-7.5-7-7.5zm223.1 7.5v45c0 4.1 3.2 7.5 7.1 7.5h185.7c3.9 0 7.1-3.4 7.1-7.5v-45c0-4.1-3.2-7.5-7-7.5H627.1c-3.9 0-7.1 3.4-7.1 7.5zM396.9 501H211.1c-3.9 0-7.1 3.4-7.1 7.5v45c0 4.1 3.2 7.5 7.1 7.5h185.7c3.9 0 7.1-3.4 7.1-7.5v-45c.1-4.1-3.1-7.5-7-7.5zm416 0H627.1c-3.9 0-7.1 3.4-7.1 7.5v45c0 4.1 3.2 7.5 7.1 7.5h185.7c3.9 0 7.1-3.4 7.1-7.5v-45c.1-4.1-3.1-7.5-7-7.5z"></path>
                      </svg>
                    </div>
                    <div className="inner-book__read--text">Read</div>
                  </button>
                  <button className="inner-book__read--btn" onClick={handleMediaAccess}>
                    <div className="inner-book__read--icon">
                      <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em">
                        <path d="M842 454c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8 0 140.3-113.7 254-254 254S258 594.3 258 454c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8 0 168.7 126.6 307.9 290 327.6V884H326.7c-13.7 0-24.7 14.3-24.7 32v36c0 4.4 2.8 8 6.2 8h407.6c3.4 0 6.2-3.6 6.2-8v-36c0-17.7-11-32-24.7-32H548V782.1c165.3-18 294-158 294-328.1zM512 624c93.9 0 170-75.2 170-168V232c0-92.8-76.1-168-170-168s-170 75.2-170 168v224c0 92.8 76.1 168 170 168zm-94-392c0-50.6 41.9-92 94-92s94 41.4 94 92v224c0 50.6-41.9 92-94 92s-94-41.4-94-92V232z"></path>
                      </svg>
                    </div>
                    <div className="inner-book__read--text">Listen</div>
                  </button>
                </div>

                <div className="inner-book__bookmark" onClick={handleBookmarkClick} style={{ cursor: 'pointer' }}>
                  <div className="inner-book__bookmark--icon">
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em">
                      <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"></path>
                    </svg>
                  </div>
                  <div className="inner-book__bookmark--text">Add title to My Library</div>
                </div>

                <div className="inner-book__secondary--title">What's it about?</div>
                <div className="inner-book__tags--wrapper">
                  {book.tags?.map((tag, index) => (
                    <div key={index} className="inner-book__tag">
                      {tag}
                    </div>
                  ))}
                </div>

                <div className="inner-book__book--description">{book.bookDescription}</div>
                <h2 className="inner-book__secondary--title">About the author</h2>
                <div className="inner-book__author--description">{book.authorDescription}</div>
              </div>

              <div className="inner-book--img-wrapper">
                <figure className="book__image--wrapper" style={{ height: "300px", width: "300px", minWidth: "300px" }}>
                  <img className="book__image" src={book.imageLink} alt={book.title} style={{ display: "block" }} />
                </figure>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}