"use client";

import React from "react";
import { RxHamburgerMenu } from "react-icons/rx";

interface NavigationProps {
  onToggleMobileMenu: () => void;
}

export default function Navigation({ onToggleMobileMenu }: NavigationProps) {
  return (
    <header className="mobile__nav">
      <div className="container mobile__nav--container">
        <div className="mobile__nav--logo">Summarist</div>

        <div 
          className="sidebar__toggle--btn" 
          onClick={onToggleMobileMenu}
          aria-label="Toggle Navigation Menu"
        >
          <RxHamburgerMenu />
        </div>
      </div>
    </header>
  );
}