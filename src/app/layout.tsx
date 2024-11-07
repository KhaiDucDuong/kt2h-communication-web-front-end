import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@fortawesome/fontawesome-svg-core/styles.css";
import {config} from "@fortawesome/fontawesome-svg-core";
import "@/styles/globals.css";

config.autoAddCss=false;

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KT2H",
  description: "Communication app made by KT2H from HCMUTE university",
  icons: "/favico.ico"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
