import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from '../context/AppContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SmartLMS: AI-Powered Learning Paths",
  description: "AI-powered placement readiness platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900 text-white`}>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
