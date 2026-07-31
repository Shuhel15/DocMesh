import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import Navbar from "@/components/landing/navbar";
import Footer from "@/components/landing/Footer";


const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Knowly",
  description: "Build and embed your own AI chatbot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={spaceGrotesk.variable}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar/>
          {children}
          <Footer/>
        </ThemeProvider>
      </body>
    </html>
  );
}