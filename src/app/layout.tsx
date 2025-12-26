'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Package, Camera, FileText, BarChart3, LogOut, User, Settings, Bell, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [username, setUsername] = useState('Admin');
  const [notifications, setNotifications] = useState(3);

  useEffect(() => {
    const auth = sessionStorage.getItem('auth');
    const storedUsername = sessionStorage.getItem('username');
    
    if (auth !== 'true') {
      router.push('/login');
    } else {
      setUsername(storedUsername || 'Admin');
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('auth');
    sessionStorage.removeItem('username');
    router.push('/login');
  };

  const navItems = [
    { 
      href: '/dashboard', 
      label: 'Dashboard', 
      icon: Home,
      gradient: 'from-blue-500 to-cyan-500',
      color: 'text-blue-600'
    },
    { 
      href: '/dashboard/products', 
      label: 'Produk', 
      icon: Package,
      gradient: 'from-green-500 to-emerald-500',
      color: 'text-green-600'
    },
    { 
      href: '/dashboard/scan', 
      label: 'Scan', 
      icon: Camera,
      gradient: 'from-purple-500 to-pink-500',
      color: 'text-purple-600'
    },
    { 
      href: '/dashboard/transactions', 
      label: 'Transaksi', 
      icon: FileText,
      gradient: 'from-orange-500 to-red-500',
      color: 'text-orange-600'
    },
    { 
      href: '/dashboard/reports', 
      label: 'Laporan', 
      icon: BarChart3,
      gradient: 'from-indigo-500 to-purple-500',
      color: 'text-indigo-600'
    },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Enhanced Sidebar */}
      <aside className="w-72 bg-white shadow-2xl flex flex-col border-r border-gray-100 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-purple-50/50 opacity-50"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
        
        {/* Logo Section */}
        <div className="relative p-6 border-b border-gray-100">
          <div className="flex items-center gap-4 group cursor-pointer">
            {/* Animated Logo */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform">
                <span className="text-3xl">🏪</span>
              </div>
              {/* Notification Badge */}
              {notifications > 0 && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg animate-bounce">
                  {notifications}
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Kantin
              </h2>
              <p className="text-xs text-gray-500 font-medium">Sistem Manajemen</p>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="relative flex-1 py-6 overflow-y-auto">
          <div className="px-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative block"
                >
                  {/* Active Indicator */}
                  {isActive && (
                    <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${item.gradient} rounded-r-full`}></div>
                  )}
                  
                  {/* Menu Item */}
                  <div
                    className={`relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {/* Icon Container */}
                    <div className={`relative p-2 rounded-lg transition-all duration-300 ${
                      isActive 
                        ? `bg-gradient-to-br ${item.gradient}` 
                        : 'bg-gray-100 group-hover:bg-gray-200'
                    }`}>
                      <Icon 
                        size={20} 
                        className={`transition-colors ${
                          isActive ? 'text-white' : item.color
                        }`}
                      />
                      
                      {/* Glow Effect */}
                      {isActive && (
                        <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} rounded-lg blur-lg opacity-50`}></div>
                      )}
                    </div>
                    
                    {/* Label */}
                    <span className={`flex-1 font-semibold transition-colors ${
                      isActive 
                        ? 'text-gray-900' 
                        : 'text-gray-600 group-hover:text-gray-900'
                    }`}>
                      {item.label}
                    </span>
                    
                    {/* Chevron */}
                    <ChevronRight 
                      size={16} 
                      className={`transition-all ${
                        isActive 
                          ? 'opacity-100 translate-x-0' 
                          : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
                      }`}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
          
          {/* Divider */}
          <div className="my-6 px-6">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </div>
          
          {/* Quick Actions */}
          <div className="px-4">
            <p className="px-4 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Quick Actions
            </p>
            <Link
              href="/dashboard/settings"
              className="group flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                <Settings size={20} className="text-gray-600" />
              </div>
              <span className="flex-1 font-medium text-gray-600 group-hover:text-gray-900">
                Pengaturan
              </span>
            </Link>
          </div>
        </nav>

        {/* User Section */}
        <div className="relative p-4 border-t border-gray-100 bg-gradient-to-br from-gray-50 to-blue-50">
          {/* User Profile Card */}
          <div className="mb-3 p-4 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              {/* Avatar */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-md opacity-50"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <User size={24} className="text-white" />
                </div>
                {/* Online Status */}
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{username}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              
              {/* Notification Bell */}
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell size={18} className="text-gray-600" />
                {notifications > 0 && (
                  <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                )}
              </button>
            </div>
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="group w-full relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
              <div className="relative flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-50 to-pink-50 group-hover:from-red-100 group-hover:to-pink-100 border border-red-100 rounded-xl transition-all">
                <LogOut size={18} className="text-red-600" />
                <span className="text-sm font-semibold text-red-600">Logout</span>
              </div>
            </button>
          </div>
          
          {/* Version Info */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              v1.0.0 • © 2024 Kantin Sekolah
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content with Enhanced Container */}
      <main className="flex-1 overflow-y-auto relative">
        {/* Optional: Add a subtle pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none"></div>
        <div className="relative">
          {children}
        </div>
      </main>

      <style jsx>{`
        .bg-grid-pattern {
          background-image: linear-gradient(rgba(0, 0, 0, 0.02) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0, 0, 0, 0.02) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
}
