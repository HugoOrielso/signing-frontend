import "./globals.css";
import SessionWrapper from "@/components/common/SessionWrapper";
import type { Metadata } from "next";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Contract Signing",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionWrapper>
          <Toaster richColors position="top-right" />
          {children}
        </SessionWrapper>
      </body>
    </html>
  );
}