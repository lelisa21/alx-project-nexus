import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { SocketStatus } from '@/components/SocketStatus';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Pollify - Real-time Polling Platform",
  description: "Create and participate in real-time polls with beautiful charts and instant updates",
  keywords: ["polls", "voting", "real-time", "surveys", "feedback", "pollify", "online polls"],
  manifest: "/manifest.json",
  openGraph: {
    title: "Pollify - Real-time Polling Platform",
    description: "Create and participate in real-time polls with beautiful charts and instant updates",
    url: "https://online-polling-system.vercel.app",
    siteName: "Pollify",
    type: "website",
    images: [
      {
        url: "https://online-polling-system.vercel.app/social-preview.png",
        width: 1200,
        height: 630,
        alt: "Pollify - Real-time Polling Platform"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Pollify - Real-time Polling Platform",
    description: "Create and participate in real-time polls with beautiful charts and instant updates",
    images: ["https://online-polling-system.vercel.app/social-preview.png"],
    site: "@YourTwitterHandle"
  },
  robots: {
    index: true,
    follow: true,
    nocache: true
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        {/* Canonical URL */}
        <link rel="canonical" href="https://online-polling-system.vercel.app/" />

        {/* Favicons / Apple touch icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/logo.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icons/icon-512.png" />

        {/* PWA manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Viewport */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Theme color for mobile */}
        <meta name="theme-color" content="#00c4cc" />

        {/* Preconnect & preload fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
          rel="stylesheet"
        />

        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Pollify",
              "url": "https://online-polling-system.vercel.app",
              "description": "Create and participate in real-time polls with beautiful charts and instant updates"
            })
          }}
        />
      </head>

      <body className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <ThemeProvider>
          <Providers>
            <ThemeToggle />
            {children}
            <SocketStatus />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
