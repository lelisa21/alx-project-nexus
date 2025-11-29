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
  title: 'Pollify - Real-time Polling Platform',
  description: 'Create and participate in real-time polls with beautiful charts and instant updates',
  keywords: ['polls', 'voting', 'real-time', 'surveys', 'feedback'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
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
