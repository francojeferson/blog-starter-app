import {
  baseUrl,
  siteTitle,
  siteDescription,
  siteImage,
  siteGtm,
  siteGtag,
} from "@/lib/site-info";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import ClientSideScripts from "@/lib/client-scripts";
import "./globals.css";
import Script from "next/script";
import { TrackingProvider } from "./_context/TrackingContext";
import { SessionProvider } from "./_context/SessionContext";

const openSans = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: siteTitle,
  description: siteDescription,
  openGraph: {
    images: siteImage,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/favicon/safari-pinned-tab.svg"
          color="#000000"
        />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta
          name="msapplication-config"
          content="/favicon/browserconfig.xml"
        />
        <meta name="theme-color" content="#000" />
        <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </head>
      <body className={openSans.className}>
        <TrackingProvider>
          <SessionProvider>
            <div className="min-h-screen">{children}</div>
          </SessionProvider>
          {/* <CtcVerify /> */}
        </TrackingProvider>
        <GoogleTagManager gtmId={siteGtm} />
        <GoogleAnalytics gaId={siteGtag} />
        <ClientSideScripts />
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
