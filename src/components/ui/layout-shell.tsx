"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/Footer";

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isEmbedPage = pathname.startsWith("/embed/");

  return (
    <>
      {!isEmbedPage && <Navbar />}

      {children}

      {!isEmbedPage && <Footer />}
    </>
  );
}