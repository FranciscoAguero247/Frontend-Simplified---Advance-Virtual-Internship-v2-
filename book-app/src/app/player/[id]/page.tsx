"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import { useAuthModal } from "@/context/AuthModalContext";
import { useLibrary } from "@/context/LibraryContext";
import { PlayerSummarySkeleton, PlayerTrackSkeleton } from "@/components/Skeletons";
import { IoPlay, IoPause } from "react-icons/io5";

interface Book {
  id: string;
  author: string;
  title: string;
  subTitle: string;
  imageLink: string;
  audioLink: string;
  summary: string;
}

export default function PlayerPage() {
  const params = useParams();
  const bookId = params.id as string;
  const { loading: authLoading } = useAuthModal();
  const { markAsFinished } = useLibrary();

  const [book, setBook] = useState<Book | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!bookId) return;
    async function fetchBookForPlayer() {
      try {
        setDataLoading(true);
        const response = await fetch(`https://us-central1-summaristt.cloudfunctions.net/getBook?id=${bookId}`);
        const data = await response.json();
        setBook(data);
      } catch (error) {
        console.error("Error loading targeted player specs:", error);
      } finally {
        setDataLoading(false);
      }
    }
    fetchBookForPlayer();
  }, [bookId]);

  const onTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      setCurrentTime(current);

      if (current > 0 && total > 0 && current >= total - 1.5) {
        markAsFinished(bookId);
      }
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetValue = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = targetValue;
      setCurrentTime(targetValue);
    }
  };

  const adjustTime = (amount: number) => {
    if (audioRef.current) {
      let newTime = audioRef.current.currentTime + amount;
      if (newTime < 0) newTime = 0;
      if (newTime > duration) newTime = duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return "00:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  if (!authLoading && !dataLoading && !book) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontFamily: "sans-serif" }}>
        <h2 style={{ color: "#032b41", fontWeight: 500 }}>Book metrics metadata not found.</h2>
      </div>
    );
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div id="__next">
      <div className="wrapper">
        <SearchBar />
        <div className="sidebar__overlay sidebar__overlay--hidden"></div>
        <Sidebar isMobileMenuOpen={false} onToggleMobileMenu={() => {}} />

        <div className="summary">
          {dataLoading ? (
            <PlayerSummarySkeleton />
          ) : (
            book && (
              <div className="audio__book--summary" style={{ fontSize: "16px" }}>
                <div className="audio__book--summary-title">
                  <b>{book.title}</b>
                </div>
                <div className="audio__book--summary-text">
                  {book.summary}
                </div>
              </div>
            )
          )}

          <div className="audio__wrapper">
            {book && (
              <audio 
                ref={audioRef}
                src={book.audioLink}
                onTimeUpdate={onTimeUpdate}
                onLoadedMetadata={onLoadedMetadata}
                onEnded={() => {
                  setIsPlaying(false);
                  markAsFinished(bookId);
                }}
              />
            )}
            
            <div className="audio__track--wrapper">
              {dataLoading ? (
                <PlayerTrackSkeleton />
              ) : (
                book && (
                  <>
                    <figure className="audio__track--image-mask">
                      <figure className="book__image--wrapper" style={{ height: "48px", width: "48px", minWidth: "48px", position: "relative" }}>
                        <img className="book__image" src={book.imageLink} alt={book.title} style={{ display: "block" }} />
                      </figure>
                    </figure>
                    <div className="audio__track--details-wrapper">
                      <div className="audio__track--title">{book.title}</div>
                      <div className="audio__track--author">{book.author}</div>
                    </div>
                  </>
                )
              )}
            </div>

            <div className="audio__controls--wrapper">
              <div className="audio__controls">
                <button className="audio__controls--btn" onClick={() => adjustTime(-15)} disabled={dataLoading}>
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <path fill="none" stroke="#000" strokeWidth="2" d="M3.11111111,7.55555556 C4.66955145,4.26701301 8.0700311,2 12,2 C17.5228475,2 22,6.4771525 22,12 C22,17.5228475 17.5228475,22 12,22 L12,22 C6.4771525,22 2,17.5228475 2,12 M2,4 L2,8 L6,8 M9,16 L9,9 L7,9.53333333 M17,12 C17,10 15.9999999,8.5 14.5,8.5 C13.0000001,8.5 12,10 12,12 C12,14 13,15.5000001 14.5,15.5 C16,15.4999999 17,14 17,12 Z M14.5,8.5 C16.9253741,8.5 17,11 17,12 C17,13 17,15.5 14.5,15.5 C12,15.5 12,13 12,12 C12,11 12.059,8.5 14.5,8.5 Z"></path>
                  </svg>
                </button>

                <button className="audio__controls--btn audio__controls--btn-play" onClick={togglePlay} disabled={dataLoading}>
                  {isPlaying ? (
                    <div className="audio__controls--play-icon">
                      <IoPause />
                    </div>
                  ) : (
                    <div className="audio__controls--play-icon">
                      <IoPlay />
                    </div>
                  )}
                </button>

                <button className="audio__controls--btn" onClick={() => adjustTime(15)} disabled={dataLoading}>
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <path fill="none" stroke="#000" strokeWidth="2" d="M20.8888889,7.55555556 C19.3304485,4.26701301 15.9299689,2 12,2 C6.4771525,2 2,6.4771525 2,12 C2,17.5228475 6.4771525,22 12,22 L12,22 C17.5228475,22 22,17.5228475 22,12 M22,4 L22,8 L18,8 M9,16 L9,9 L7,9.53333333 M17,12 C17,10 15.9999999,8.5 14.5,8.5 C13.0000001,8.5 12,10 12,12 C12,14 13,15.5000001 14.5,15.5 C16,15.4999999 17,14 17,12 Z M14.5,8.5 C16.9253741,8.5 17,11 17,12 C17,13 17,15.5 14.5,15.5 C12,15.5 12,13 12,12 C12,11 12.059,8.5 14.5,8.5 Z"></path>
                  </svg>
                </button>
              </div>
            </div>

            <div className="audio__progress--wrapper">
              <div className="audio__time">{formatTime(currentTime)}</div>
              <input 
                type="range" 
                className="audio__progress--bar" 
                value={currentTime} 
                min="0"
                max={duration || 100} 
                onChange={handleScrub}
                disabled={dataLoading}
                style={{ 
                  background: `linear-gradient(to right, rgb(43, 217, 124) ${progressPercentage}%, rgb(109, 120, 125) ${progressPercentage}%)`,
                  windowRangeProgress: `${progressPercentage}%`
                } as React.CSSProperties}
              />
              <div className="audio__time">{formatTime(duration)}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}