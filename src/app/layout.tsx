import "./globals.css";
import SessionWrapper from "@/components/common/SessionWrapper";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Contract Signing",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-sans">
        <SessionWrapper>
          <Toaster richColors position="top-right" />
          {children}
        </SessionWrapper>
      </body>
    </html>
  );
}