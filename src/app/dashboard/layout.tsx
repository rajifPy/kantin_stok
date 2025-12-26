'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Package, Camera, FileText, Settings } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/products', label: 'Produk', icon: Package },
    { href: '/dashboard/scan', label: 'Scan', icon: Camera },
    { href: '/dashboard/transactions', label: 'Transaksi', icon: FileText },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-blue-600">🏪 Kantin</h2>
        </div>
        <nav className="mt-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-6 py-3 transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}