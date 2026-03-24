import "./globals.css";
import SessionWrapper from "@/components/common/SessionWrapper";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: "Contract Signing",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="font-poppins antialiased" cz-shortcut-listen="true" suppressHydrationWarning>
        <SessionWrapper>
          <Toaster richColors position="top-right" />
          <main>{children}</main>
        </SessionWrapper>
      </body>
    </html>
  );
}