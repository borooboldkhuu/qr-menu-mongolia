import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'QR Menu Mongolia — Дижитал QR цэс',
  description: 'Монголын ресторан, кафе, кофе шопуудад зориулсан QR кодтой дижитал цэсний платформ',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mn">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
