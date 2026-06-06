"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuthModal } from "@/context/AuthModalContext";
import { AiOutlineHome, AiOutlineSetting, AiOutlineSearch } from "react-icons/ai";
import { BsBookmark, BsPen } from "react-icons/bs";
import { FiHelpCircle } from "react-icons/fi";
import { LuLogOut, LuLogIn } from "react-icons/lu";

interface SidebarProps {
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

export default function Sidebar({ isMobileMenuOpen, onToggleMobileMenu }: SidebarProps) {
  const pathname = usePathname();
  const { user, logoutUser, openModal } = useAuthModal();

  if (pathname === "/" || pathname === "/choose-plan") {
    return null;
  }

  const handleAuthClick = () => {
    if (isMobileMenuOpen) onToggleMobileMenu();
    if (user) {
      logoutUser();
    } else {
      openModal();
    }
  };

  const closeMobileMenu = () => {
    if (isMobileMenuOpen) onToggleMobileMenu();
  };

  return (
    <>
      <div 
        onClick={onToggleMobileMenu}
        className={`sidebar__overlay ${!isMobileMenuOpen ? "sidebar__overlay--hidden" : ""}`}
      />

      <aside className={`sidebar ${isMobileMenuOpen ? "sidebar--opened" : ""}`}>

        <div className="sidebar__logo">
          <Image 
            src="/assets/logo.png" 
            alt="Summarist Logo" 
            width={160} 
            height={40} 
            priority 
          />
        </div>

        <div className="sidebar__wrapper">
          <nav className="sidebar__top">
            <Link 
              href="/for-you" 
              className="sidebar__link--wrapper"
              onClick={closeMobileMenu}
            >
              <div className={`sidebar__link--line ${pathname === "/for-you" ? "active--tab" : ""}`} />
              <div className="sidebar__icon--wrapper">
                <AiOutlineHome />
              </div>
              <span className="sidebar__link">For you</span>
            </Link>

            <Link 
              href="/library" 
              className="sidebar__link--wrapper"
              onClick={closeMobileMenu}
            >
              <div className={`sidebar__link--line ${pathname === "/library" ? "active--tab" : ""}`} />
              <div className="sidebar__icon--wrapper">
                <BsBookmark />
              </div>
              <span className="sidebar__link">My Library</span>
            </Link>

            <div className="sidebar__link--wrapper sidebar__link--not-allowed">
              <div className="sidebar__link--line" />
              <div className="sidebar__icon--wrapper">
                <BsPen />
              </div>
              <span className="sidebar__link">Highlights</span>
            </div>

            <div className="sidebar__link--wrapper sidebar__link--not-allowed">
              <div className="sidebar__link--line" />
              <div className="sidebar__icon--wrapper">
                <AiOutlineSearch />
              </div>
              <span className="sidebar__link">Search</span>
            </div>

            <Link 
              href="/settings" 
              className="sidebar__link--wrapper"
              onClick={closeMobileMenu}
            >
              <div className={`sidebar__link--line ${pathname === "/settings" ? "active--tab" : ""}`} />
              <div className="sidebar__icon--wrapper">
                <AiOutlineSetting />
              </div>
              <span className="sidebar__link">Settings</span>
            </Link>

            <div className="sidebar__link--wrapper sidebar__link--not-allowed">
              <div className="sidebar__link--line" />
              <div className="sidebar__icon--wrapper">
                <FiHelpCircle />
              </div>
              <span className="sidebar__link">Help &amp; Support</span>
            </div>

          </nav>

          <div className="sidebar__bottom">
            <div 
              onClick={handleAuthClick}
              className="sidebar__link--wrapper"
              style={{ cursor: "pointer" }}
            >
              <div className="sidebar__link--line" />
              <div className="sidebar__icon--wrapper">
                {user ? <LuLogOut /> : <LuLogIn />}
              </div>
              <span className="sidebar__link">
                {user ? "Log Out" : "Login"}
              </span>
            </div>
          </div>

        </div>
      </aside>
    </>
  );
}