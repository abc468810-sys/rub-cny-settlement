import type { Metadata } from "next";
import "./globals.css";
import { NotificationProvider } from "@/components/ui/NotificationProvider";
import { LanguageProvider } from "@/components/ui/LanguageProvider";

export const metadata: Metadata = {
  title: "RUB-CNY Trade Remittance Gateway",
  description: "Specialized institutional framework for Russo-Chinese trade settlement",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
