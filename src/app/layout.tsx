import "./globals.css"
import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: "Contract Signing",
  icons: {
    icon: "/assets/logo.webp",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="font-poppins antialiased" cz-shortcut-listen="true" suppressHydrationWarning>
        <Toaster richColors position="top-right" />
        <main>{children}</main>
      </body>
    </html>
  );
}