"use client";

import React from "react";
import { AuthModalProvider } from "@/context/AuthModalContext";
import { LibraryProvider } from "@/context/LibraryContext";
import AuthModal from "@/components/AuthModal";
import Sidebar from "@/components/Sidebar"; 
import { usePathname } from "next/navigation"; 
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const excludedPaths = ["/", "/choose-plan"];
  const showSidebar = !excludedPaths.includes(pathname);

  return (
    <html lang="en">
      <body>
        <AuthModalProvider>
          <LibraryProvider>
            
            <div className="app-container">
              {showSidebar && (
                <Sidebar isMobileMenuOpen={false} onToggleMobileMenu={() => {}} />
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