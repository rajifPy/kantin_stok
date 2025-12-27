import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kantin Sekolah - Sistem Manajemen Modern',
  description: 'Sistem manajemen kantin sekolah dengan barcode scanner, inventory management, dan reporting',
  keywords: ['kantin', 'sekolah', 'pos', 'inventory', 'barcode'],
  authors: [{ name: 'Kantin Sekolah' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏪</text></svg>" />
        <meta name="theme-color" content="#3B82F6" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
