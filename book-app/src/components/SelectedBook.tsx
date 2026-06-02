import React from "react";
import Link from "next/link";
import { Book } from "@/app/foryou/page"; // Adjust this import based on your page file location

interface SelectedBookProps {
  book: Book;
}

export default function SelectedBook({ book }: SelectedBookProps) {
  return (
    <>
      <audio src={book.audioLink}></audio>
      <Link className="selected__book" href={`/book/${book.id}`}>
        <div className="selected__book--sub-title">{book.subTitle}</div>
        <div className="selected__book--line"></div>
        <div className="selected__book--content">
          <figure className="recommended__book--img-mask" style={{ height: "140px", width: "140px", minWidth: "140px", position: "relative" }}>
            <img className="recommended__book--img" src={book.imageLink} alt={book.title} style={{ display: "block" }} />
          </figure>
          <div className="selected__book--text">
            <div className="selected__book--title">{book.title}</div>
            <div className="selected__book--author">{book.author}</div>
            <div className="selected__book--duration-wrapper">
              <div className="selected__book--icon">
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em">
                  <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path>
                </svg>
              </div>
              <div className="selected__book--duration">
                3 min 23 sec
              </div>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}