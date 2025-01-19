import type { Metadata } from "next";
import { Ubuntu, Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Head from 'next/head';

const rubik = Ubuntu({
  style: "normal",
  weight: ["400", "500", "700"],
  display: "swap",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SocialMood App",
  description: "",
  icons: {
    icon: '/icon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={rubik.className}>
      <Head>
      <link rel="icon" href="/icon.ico" />
    </Head>
      <body>
        <main className="antialiased min-h-screen flex items-center justify-center">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
