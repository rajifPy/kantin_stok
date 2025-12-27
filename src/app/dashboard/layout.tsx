'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Package, Camera, FileText, BarChart3, LogOut, User, Menu, X, ChevronRight, Bell, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [username, setUsername] = useState('Admin');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications] = useState(3);

  useEffect(() => {
    const auth = sessionStorage.getItem('auth');
    const storedUsername = sessionStorage.getItem('username');
    
    if (auth !== 'true') {
      router.push('/login');
    } else {
      setUsername(storedUsername || 'Admin');
    }
  }, [router]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

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
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    { 
      href: '/dashboard/products', 
      label: 'Produk', 
      icon: Package,
      gradient: 'from-green-500 to-emerald-500',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    { 
      href: '/dashboard/scan', 
      label: 'Scan', 
      icon: Camera,
      gradient: 'from-purple-500 to-pink-500',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    { 
      href: '/dashboard/transactions', 
      label: 'Transaksi', 
      icon: FileText,
      gradient: 'from-orange-500 to-red-500',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    { 
      href: '/dashboard/reports', 
      label: 'Laporan', 
      icon: BarChart3,
      gradient: 'from-indigo-500 to-purple-500',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-fade-in-up"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-72 bg-white shadow-2xl flex flex-col border-r border-gray-100
          transform transition-transform duration-300 ease-in-out
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-purple-50/50 opacity-50 pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Logo Section */}
        <div className="relative p-6 border-b border-gray-100 animate-fade-in-down">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 group cursor-pointer">
              {/* Animated Logo */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform">
                  <span className="text-3xl animate-float">🏪</span>
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

            {/* Close Button (Mobile) */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="relative flex-1 py-6 overflow-y-auto">
          <div className="px-4 space-y-2">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative block animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Active Indicator */}
                  {isActive && (
                    <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${item.gradient} rounded-r-full animate-scale-in`} />
                  )}
                  
                  {/* Menu Item */}
                  <div
                    className={`
                      relative flex items-center gap-3 px-4 py-3.5 rounded-xl
                      transition-all duration-300
                      ${isActive
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg'
                        : 'hover:bg-gray-50'
                      }
                    `}
                  >
                    {/* Icon Container */}
                    <div 
                      className={`
                        relative p-2 rounded-lg transition-all duration-300
                        ${isActive 
                          ? `bg-gradient-to-br ${item.gradient} shadow-lg` 
                          : `${item.bgColor} group-hover:scale-110`
                        }
                      `}
                    >
                      <Icon 
                        size={20} 
                        className={`transition-colors ${
                          isActive ? 'text-white' : item.color
                        }`}
                      />
                      
                      {/* Glow Effect */}
                      {isActive && (
                        <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} rounded-lg blur-lg opacity-50 animate-pulse-glow`} />
                      )}
                    </div>
                    
                    {/* Label */}
                    <span className={`
                      flex-1 font-semibold transition-colors
                      ${isActive 
                        ? 'text-gray-900' 
                        : 'text-gray-600 group-hover:text-gray-900'
                      }
                    `}>
                      {item.label}
                    </span>
                    
                    {/* Chevron */}
                    <ChevronRight 
                      size={16} 
                      className={`
                        transition-all duration-300
                        ${isActive 
                          ? 'opacity-100 translate-x-0' 
                          : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
                        }
                      `}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
          
          {/* Divider */}
          <div className="my-6 px-6">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
          </div>
          
          {/* Quick Actions */}
          <div className="px-4">
            <p className="px-4 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Quick Actions
            </p>
            <Link
              href="/dashboard/settings"
              className="group flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-all duration-300 animate-fade-in-up animation-delay-300"
            >
              <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 group-hover:scale-110 transition-all duration-300">
                <Settings size={20} className="text-gray-600" />
              </div>
              <span className="flex-1 font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                Pengaturan
              </span>
            </Link>
          </div>
        </nav>

        {/* User Section */}
        <div className="relative p-4 border-t border-gray-100 bg-gradient-to-br from-gray-50 to-blue-50 animate-fade-in-up">
          {/* User Profile Card */}
          <div className="mb-3 p-4 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              {/* Avatar */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-md opacity-50" />
                <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg animate-pulse-glow">
                  <User size={24} className="text-white" />
                </div>
                {/* Online Status */}
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-ping" />
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{username}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              
              {/* Notification Bell */}
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors group">
                <Bell size={18} className="text-gray-600 group-hover:text-blue-600 transition-colors" />
                {notifications > 0 && (
                  <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                )}
                {notifications > 0 && (
                  <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>
            </div>
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="group w-full relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity" />
              <div className="relative flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-50 to-pink-50 group-hover:from-red-100 group-hover:to-pink-100 border border-red-100 rounded-xl transition-all transform group-hover:scale-105">
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

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
          <div className="px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu size={24} className="text-gray-600" />
            </button>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-lg">🏪</span>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Kantin
              </span>
            </div>
            
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell size={20} className="text-gray-600" />
              {notifications > 0 && (
                <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
          </div>
        </div>

        {/* Pattern Overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
        
        {/* Content */}
        <div className="relative animate-fade-in-up">
          {children}
        </div>
      </main>
    </div>
  );
}
