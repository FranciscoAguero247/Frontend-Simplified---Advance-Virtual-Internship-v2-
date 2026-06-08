import React from "react";
import Link from "next/link";
import { BsStar } from "react-icons/bs";

export interface Book {
  id: string;
  title: string;
  subTitle: string;
  author: string;
  imageLink: string;
  audioLink: string;
  subscriptionRequired: boolean;
  averageRating?: number; 
}

interface BookCardProps {
  book: Book;
}


export default function BookCard({ book }: BookCardProps) {
  return (
    <Link className="for-you__recommended--books-link" href={`/book/${book.id}`} style={{ position: "relative" }}>
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
  );
}