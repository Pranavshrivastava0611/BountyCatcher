"use client"
import "./globals.css";
import ClientProviders from "@/Providers/ClientProviders";
import { Toaster } from "react-hot-toast";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="">
        <ClientProviders>{children}</ClientProviders>
        <Toaster position="bottom-right" reverseOrder={true} />
      </body>
    </html>
  );
}
