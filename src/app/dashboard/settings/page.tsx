'use client';

import { useState } from 'react';
import { Settings, User, Bell, Shield, Palette, Database, Save, ChevronRight } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    username: 'admin',
    notifications: true,
    autoBackup: true,
    theme: 'light',
    language: 'id',
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const settingSections = [
    {
      title: 'Akun',
      icon: User,
      gradient: 'from-blue-500 to-cyan-500',
      items: [
        { label: 'Username', value: settings.username, type: 'text' },
        { label: 'Email', value: 'admin@kantin.com', type: 'email' },
      ]
    },
    {
      title: 'Notifikasi',
      icon: Bell,
      gradient: 'from-purple-500 to-pink-500',
      items: [
        { label: 'Notifikasi Push', value: settings.notifications, type: 'toggle' },
        { label: 'Email Alerts', value: true, type: 'toggle' },
      ]
    },
    {
      title: 'Keamanan',
      icon: Shield,
      gradient: 'from-green-500 to-emerald-500',
      items: [
        { label: 'Two-Factor Auth', value: false, type: 'toggle' },
        { label: 'Auto Logout', value: '30 menit', type: 'select' },
      ]
    },
    {
      title: 'Tampilan',
      icon: Palette,
      gradient: 'from-orange-500 to-red-500',
      items: [
        { label: 'Theme', value: settings.theme, type: 'select' },
        { label: 'Bahasa', value: settings.language, type: 'select' },
      ]
    },
    {
      title: 'Data',
      icon: Database,
      gradient: 'from-indigo-500 to-purple-500',
      items: [
        { label: 'Auto Backup', value: settings.autoBackup, type: 'toggle' },
        { label: 'Export Data', value: 'CSV/JSON', type: 'button' },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="px-8 py-6">
          <div className="flex items-center gap-3 mb-2 animate-fade-in-down">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <Settings className="text-white" size={24} />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Pengaturan
            </h1>
          </div>
          <p className="text-gray-600 ml-14">Kelola preferensi dan konfigurasi sistem</p>
        </div>
      </div>

      <div className="p-8">
        {/* Success Message */}
        {saved && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-xl animate-bounce-in">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-green-800 font-medium">Pengaturan berhasil disimpan!</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {settingSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div 
                key={section.title}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Section Header */}
                <div className={`bg-gradient-to-r ${section.gradient} p-6 text-white`}>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                      <Icon size={24} />
                    </div>
                    <h3 className="text-xl font-bold">{section.title}</h3>
                  </div>
                </div>

                {/* Section Content */}
                <div className="p-6 space-y-4">
                  {section.items.map((item, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.label}</p>
                        {item.type !== 'toggle' && item.type !== 'button' && (
                          <p className="text-sm text-gray-500 mt-1">{item.value}</p>
                        )}
                      </div>
                      
                      {/* Controls */}
                      <div>
                        {item.type === 'toggle' && (
                          <button
                            className={`relative w-14 h-7 rounded-full transition-colors ${
                              item.value ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                          >
                            <div
                              className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                                item.value ? 'translate-x-7' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        )}
                        
                        {item.type === 'button' && (
                          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                            Export
                          </button>
                        )}
                        
                        {(item.type === 'text' || item.type === 'email' || item.type === 'select') && (
                          <ChevronRight className="text-gray-400 group-hover:text-blue-600 transition-colors" size={20} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end animate-fade-in-up animation-delay-500">
          <button
            onClick={handleSave}
            className="group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
            <div className="relative flex items-center gap-2">
              <Save size={20} />
              <span>Simpan Pengaturan</span>
            </div>
          </button>
        </div>

        {/* Info Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 rounded-2xl p-6 animate-fade-in-up animation-delay-700">
            <div className="text-4xl mb-3">💾</div>
            <h4 className="font-bold text-gray-900 mb-2">Auto Backup</h4>
            <p className="text-sm text-gray-600">Data otomatis tersimpan setiap hari</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-2xl p-6 animate-fade-in-up animation-delay-1000">
            <div className="text-4xl mb-3">🔒</div>
            <h4 className="font-bold text-gray-900 mb-2">Keamanan</h4>
            <p className="text-sm text-gray-600">Enkripsi data end-to-end</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-6 animate-fade-in-up animation-delay-1000">
            <div className="text-4xl mb-3">⚡</div>
            <h4 className="font-bold text-gray-900 mb-2">Performance</h4>
            <p className="text-sm text-gray-600">Optimized untuk kecepatan</p>
          </div>
        </div>
      </div>
    </div>
  );
}
