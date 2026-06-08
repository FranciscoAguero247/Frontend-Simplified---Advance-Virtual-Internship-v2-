"use client";

import React, { useState } from "react";
import { AuthModalProvider } from "@/context/AuthModalContext";
import { LibraryProvider } from "@/context/LibraryContext";
import AuthModal from "@/components/AuthModal";
import Sidebar from "@/components/Sidebar"; 
import MobileNav from "@/components/MobileNav";
import { usePathname } from "next/navigation"; 
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const excludedPaths = ["/", "/choose-plan"];
  const showSidebar = !excludedPaths.includes(pathname);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <html lang="en">
      <body>
        <AuthModalProvider>
          <LibraryProvider>
            
            <div className="app-container">
              {showSidebar && (
                <>
                  <MobileNav onToggleMobileMenu={toggleMobileMenu} />
                  <Sidebar 
                    isMobileMenuOpen={isMobileMenuOpen} 
                    onToggleMobileMenu={toggleMobileMenu} 
                  />
                </>
              )}
              
              <main className="main-content">
                {children}
              </main>
            </div>
            
            <AuthModal />

          </LibraryProvider>
        </AuthModalProvider>
      </body>
    </html>
  );
}