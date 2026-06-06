"use client";

import React from "react";

// Individual Book Card Skeleton for horizontal slider structures
export function BookCardSkeleton() {
  return (
    <div className="for-you__recommended--books-link style={{ cursor: 'default' }}">
      <div className="recommended__book--img-mask">
        <div className="recommended__book--img skeleton" style={{ height: "240px", borderRadius: "4px" }} />
      </div>
      <div className="recommended__book--title skeleton" style={{ height: "20px", width: "80%", marginBottom: "8px" }} />
      <div className="recommended__book--author skeleton" style={{ height: "16px", width: "60%", marginBottom: "8px" }} />
      <div className="recommended__book--sub-title skeleton" style={{ height: "14px", width: "90%", marginBottom: "8px" }} />
      <div className="recommended__book--details-wrapper">
        <div className="recommended__book--details skeleton" style={{ height: "16px", width: "40%" }} />
      </div>
    </div>
  );
}

// Slider Row Group Loading State (For You / Home Rows)
export function BookRowSkeleton() {
  return (
    <div className="recommended__books--skeleton-wrapper">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="recommended__books--skeleton">
          <BookCardSkeleton />
        </div>
      ))}
    </div>
  );
}

// Single Highlighted/Selected Book Banner Skeleton
export function SelectedBookSkeleton() {
  return (
    <div className="selected__book--skeleton skeleton" style={{ borderRadius: "4px" }} />
  );
}

// Individual Book View Page Skeleton
export function BookPageSkeleton() {
  return (
    <div className="container">
      <div className="row">
        <div className="inner__book--skeleton">
          {/* Cover Mask */}
          <div className="inner__book--skeleton-img" style={{ minWidth: "200px" }}>
            <div className="book__image--skeleton skeleton" style={{ height: "260px", width: "172px" }} />
          </div>
          {/* Metadata Block */}
          <div className="inner__book--skeleton-content" style={{ width: "100%", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="skeleton" style={{ height: "36px", width: "60%" }} />
            <div className="skeleton" style={{ height: "20px", width: "40%" }} />
            <div className="skeleton" style={{ height: "24px", width: "80%" }} />
            <div className="inner-book__wrapper" style={{ border: "none", padding: "0" }}>
              <div className="skeleton" style={{ height: "48px", width: "144px", borderRadius: "4px" }} />
            </div>
            <div className="skeleton" style={{ height: "80px", width: "100%" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Settings Page Account Detail Row Skeletons
export function SettingsSkeleton() {
  return (
    <div className="container">
      <div className="row">
        <div className="skeleton" style={{ height: "40px", width: "250px", marginBottom: "32px" }} />
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="setting__content" style={{ width: "100%" }}>
            <div className="skeleton" style={{ height: "24px", width: "200px", marginBottom: "12px" }} />
            <div className="skeleton" style={{ height: "16px", width: "350px", marginBottom: "16px" }} />
            <div className="skeleton" style={{ height: "40px", width: "140px", borderRadius: "4px" }} />
          </div>
        ))}
      </div>
    </div>
  );
}