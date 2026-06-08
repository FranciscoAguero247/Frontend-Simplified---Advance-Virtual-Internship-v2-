"use client";

import React from "react";
import { RxHamburgerMenu } from "react-icons/rx";

interface MobileNavProps {
  onToggleMobileMenu: () => void;
}

export default function MobileNav({ onToggleMobileMenu }: MobileNavProps) {
  return (
    <div className="mobile-nav-bar" style={mobileNavStyles}>
      <div className="mobile-nav-bar__logo" style={{ fontWeight: 700, fontSize: "18px", color: "#032b41" }}>
        Summarist
      </div>
      
      <div 
        className="sidebar__toggle--btn" 
        onClick={onToggleMobileMenu}
        style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", cursor: "pointer" }}
      >
        <RxHamburgerMenu />
      </div>
    </div>
  );
}

const mobileNavStyles: React.CSSProperties = {
  display: "none",
  width: "100%",
  height: "60px",
  backgroundColor: "#f1f6f4",
  borderBottom: "1px solid #e1e7e5",
  padding: "0 24px",
  alignItems: "center",
  justifyContent: "space-between",
  position: "fixed",
  top: 0,
  left: 0,
  zIndex: 99
};