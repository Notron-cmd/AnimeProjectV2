"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/Footer";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (isAuthPage) {
    return <>{children}</>;
  }
  return (
    <>
      <Navbar />
      <div className="flex-1 flex flex-col">
        {children}
      </div>
      <Footer />
    </>
  );
}