import type { Metadata } from "next";
import {Inconsolata} from "next/font/google"
import "./globals.css";
import Navbar from "@/components/navbar";
import AgeBanner from "@/components/agebanner";
import Footer from "@/components/footer";
import CookiesBanner from "@/components/cookiesbanner";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "@/lib/card";

const inconsolata = Inconsolata({
  subsets: ["latin"],
  weight: ["200","300", "400", "500","600", "700", "800", "900"]
})

export const metadata: Metadata = {
  title: `Hydroocann Natural s.r.o.`,
  description: "Všechny potřebné kuřácké potřeby",
  icons: {
    icon: "/images/logo.png"
  },
  applicationName: "Hydroocann Natural s.r.o.",
  generator: "Next.ts",
  authors: [{name: "Adam Hitzger"}, {name: "Ivan Čmiko"}],
  keywords: [
     "Bongy", "Papírky a filtry"
    ],
creator: "Adam Hitzger",
        publisher: "Adam Hitzger",
        formatDetection: {
            email: false,
            address: false,
            telephone: false,
          },
openGraph: {
  title: `HydrooCann Natural s.r.o.`,
  description: "Všechny potřebné kuřácké potřeby",
  url: `https://www.hydroocann.com/`,
  siteName: "HydrooCann Natural s.r.o.",
  locale: "cs_CZ",
  type: "website",
}
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CartProvider>
    <html lang="en">
      <body
        className={`${inconsolata.className} antialiased bg-primary text-primary-foreground`}
      >
        <AgeBanner/>
        <CookiesBanner/>
         <main className="flex flex-col min-h-screen justify-center space-y-6 py-6 px-6 lg:px-16"> 
            <Navbar/>
            {children}
            <Footer/>
            <Toaster
          toastOptions={{
            style: {
              textAlign: "center",
            }
          }}
        />
        </main>
      </body>
    </html>
    </CartProvider>
  );
}
