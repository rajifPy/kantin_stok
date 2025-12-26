'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, User, Lock, Eye, EyeOff, ShoppingBag, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.username || !formData.password) {
        setError('Username dan password harus diisi');
        setLoading(false);
        return;
      }

      const isValidUser = formData.username === 'admin';
      const isValidPassword = formData.password === 'admin123';

      if (isValidUser && isValidPassword) {
        sessionStorage.setItem('auth', 'true');
        sessionStorage.setItem('username', formData.username);
        await new Promise(resolve => setTimeout(resolve, 500));
        router.push('/dashboard');
      } else if (!isValidUser) {
        setError('Username tidak ditemukan');
      } else {
        setError('Password salah');
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:40px_40px]"></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Sparkles className="absolute top-1/4 left-1/4 text-white/20 w-8 h-8 animate-pulse" />
        <ShoppingBag className="absolute top-1/3 right-1/3 text-white/20 w-10 h-10 animate-bounce" style={{animationDelay: '1s'}} />
        <Sparkles className="absolute bottom-1/4 right-1/4 text-white/20 w-6 h-6 animate-pulse" style={{animationDelay: '2s'}} />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Login Card with Glassmorphism */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="relative p-8 text-center">
              {/* Logo Container */}
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl"></div>
                <div className="relative w-24 h-24 bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm rounded-full border border-white/30 flex items-center justify-center shadow-xl">
                  <ShoppingBag className="text-white w-12 h-12" />
                </div>
                {/* Floating Ring */}
                <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping"></div>
              </div>
              
              <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
                Kantin Sekolah
              </h1>
              <p className="text-white/80 text-lg">Sistem Manajemen Modern</p>
            </div>

            {/* Login Form */}
            <div className="p-8 pt-0">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="backdrop-blur-xl bg-red-500/20 border border-red-400/50 p-4 rounded-2xl animate-shake">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-red-200" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span className="text-white text-sm font-medium">{error}</span>
                    </div>
                  </div>
                )}

                {/* Username Input */}
                <div className="space-y-2">
                  <label className="text-white/90 text-sm font-medium">Username</label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl overflow-hidden transition-all group-hover:border-white/40">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <User className="text-white/60" size={20} />
                      </div>
                      <input
                        type="text"
                        placeholder="Masukkan username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="w-full pl-12 pr-4 py-4 bg-transparent text-white placeholder-white/50 focus:outline-none"
                        required
                        autoComplete="username"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <label className="text-white/90 text-sm font-medium">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl overflow-hidden transition-all group-hover:border-white/40">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <Lock className="text-white/60" size={20} />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Masukkan password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full pl-12 pr-14 py-4 bg-transparent text-white placeholder-white/50 focus:outline-none"
                        required
                        autoComplete="current-password"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                        disabled={loading}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="relative w-full group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative backdrop-blur-xl bg-gradient-to-r from-blue-500/90 via-purple-500/90 to-pink-500/90 border border-white/20 rounded-2xl px-6 py-4 font-semibold text-white shadow-xl transform transition-all group-hover:scale-[1.02] group-hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                    {loading ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Memproses...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <LogIn size={20} />
                        <span>Login Sekarang</span>
                      </div>
                    )}
                  </div>
                </button>
              </form>

              {/* Demo Credentials */}
              <div className="mt-8 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white/90 text-sm font-semibold">Demo Credentials</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between backdrop-blur-xl bg-white/5 px-4 py-3 rounded-xl border border-white/10">
                    <span className="text-white/70 text-sm">Username:</span>
                    <code className="bg-white/10 px-3 py-1.5 rounded-lg font-mono font-semibold text-white text-sm border border-white/20">admin</code>
                  </div>
                  <div className="flex items-center justify-between backdrop-blur-xl bg-white/5 px-4 py-3 rounded-xl border border-white/10">
                    <span className="text-white/70 text-sm">Password:</span>
                    <code className="bg-white/10 px-3 py-1.5 rounded-lg font-mono font-semibold text-white text-sm border border-white/20">admin123</code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-white/60 text-sm backdrop-blur-sm bg-white/5 rounded-full px-6 py-3 inline-block border border-white/10">
              © 2024 Kantin Sekolah. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
          20%, 40%, 60%, 80% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -50px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(50px, 50px) scale(1.05);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .bg-grid-white\/\[0\.05\] {
          background-image: linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
        }
      `}</style>
    </div>
  );
}
