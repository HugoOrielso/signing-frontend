import "./globals.css"
import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: {
    default: "Dimcultura",
    template: "%s | Dimcultura",
  },
  description: "Gestión digital de libranzas, pagarés y procesos documentales.",
  keywords: ["libranza", "pagaré", "dimcultura", "documentos"],
  metadataBase: new URL("https://dimcultura.com"),
  openGraph: {
    title: "Dimcultura",
    description: "Gestión digital de libranzas y documentos.",
    url: "https://dimcultura.com",
    siteName: "Dimcultura",
    locale: "es_CO",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/assets/logo_dimcultura.png",
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