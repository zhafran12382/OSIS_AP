import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { BottomNav } from "@/components/bottom-nav";
import { StudentAuthProvider } from "@/lib/student-auth";
import { StudentLoginModal } from "@/components/student-login-modal";
import { LoginNotification } from "@/components/login-notification";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
  fallback: ["system-ui", "arial"],
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
  fallback: ["monospace"],
});

export const metadata: Metadata = {
  title: "OSIS Akademi Prestasi",
  description: "Manajemen Proyek Divisi Akademi Prestasi OSIS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StudentAuthProvider>
          <LoginNotification />
          {children}
          <BottomNav />
          <StudentLoginModal />
        </StudentAuthProvider>
      </body>
    </html>
  );
}
