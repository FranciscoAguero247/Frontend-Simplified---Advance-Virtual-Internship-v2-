"use client";

import { AuthModalProvider } from "@/context/AuthModalContext";
import AuthModal from "@/components/AuthModal";
import Sidebar from "@/components/Sidebar"; // Import your Sidebar
import { usePathname } from "next/navigation"; // Hook to check the route
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
          <div className="app-container">
            {showSidebar && <Sidebar />}
            
            <main className="main-content">
              {children}
            </main>
          </div>
          
          <AuthModal />
        </AuthModalProvider>
      </body>
    </html>
  );
}