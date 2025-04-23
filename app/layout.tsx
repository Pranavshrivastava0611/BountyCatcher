"use client"
import "./globals.css";
import ClientProviders from "@/Providers/ClientProviders";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className=""
      >
        <ClientProviders>
        {children}
        </ClientProviders>
       
      </body>
    </html>
  );
}
