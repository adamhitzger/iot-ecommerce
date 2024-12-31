import type { Metadata } from "next";
import {Inconsolata} from "next/font/google"
import "./globals.css";
import Navbar from "@/components/navbar";
import AgeBanner from "@/components/agebanner";

const inconsolata = Inconsolata({
  subsets: ["latin"],
  weight: ["200","300", "400", "500","600", "700", "800", "900"]
})

export const metadata: Metadata = {
  title: "Hydroocann",
  description: "Všechny potřebné kuřácké potřeby",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inconsolata.className} antialiased bg-primary text-primary-foreground`}
      >
        <AgeBanner/>
         <main className="min-h-screen py-6 px-6 lg:px-16"> 
            <Navbar/>
            {children}
            
        </main>
      </body>
    </html>
  );
}
