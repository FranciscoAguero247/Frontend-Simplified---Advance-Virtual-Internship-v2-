"use client";

import React from "react";
import { BsStar } from "react-icons/bs";
import { useMediaAccess } from "@/hooks/useMediaAccess";

interface BookCardProps {
  book: {
    id: string;
    author: string;
    title: string;
    subTitle: string;
    imageLink: string;
    averageRating: number;
    subscriptionRequired: boolean;
  };
}

export default function BookCard({ book }: BookCardProps) {
  const { checkAccessAndNavigate } = useMediaAccess();

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    checkAccessAndNavigate({
      id: book.id,
      isPremium: book.subscriptionRequired,
    });
  };

  return (
    <div 
      className="for-you__recommended--books-link" 
      onClick={handleCardClick}
      style={{ position: "relative", cursor: "pointer" }}
    >
      {book.subscriptionRequired && (
        <div 
          className="book-pill" 
          style={{ 
            position: "absolute", 
            top: "16px", 
            right: "16px", 
            backgroundColor: "#032b41", 
            color: "white", 
            padding: "2px 8px", 
            borderRadius: "20px", 
            fontSize: "10px", 
            fontWeight: "600", 
            zIndex: 10 
          }}
        >
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
          <div className="recommended__book--details-icon">
            <BsStar />
          </div>
          <div className="recommended__book--details-text">
            {book.averageRating ? book.averageRating.toFixed(1) : "0.0"}
          </div>
        </div>
      </div>
    </div>
  );
}