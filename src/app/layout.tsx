import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kantin Sekolah - Sistem Manajemen Modern',
  description: 'Sistem manajemen kantin sekolah dengan barcode scanner, inventory management, dan reporting',
  keywords: ['kantin', 'sekolah', 'pos', 'inventory', 'barcode'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏪</text></svg>" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
