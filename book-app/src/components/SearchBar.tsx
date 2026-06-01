"use client";

import React from "react";
import Image from "next/image";
import { AiOutlineSearch } from "react-icons/ai";
import { IoMenuOutline } from "react-icons/io5";

export default function SearchBar() {
  return (
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
  );
}