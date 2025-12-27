'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, User, Lock, Eye, EyeOff, ShoppingBag, Sparkles, Zap, Shield } from 'lucide-react';

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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-20 w-48 sm:w-72 h-48 sm:h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-40 right-20 w-48 sm:w-72 h-48 sm:h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-1/2 w-48 sm:w-72 h-48 sm:h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Sparkles className="absolute top-1/4 left-1/4 text-white/20 w-6 h-6 sm:w-8 sm:h-8 animate-float" />
        <ShoppingBag className="absolute top-1/3 right-1/3 text-white/20 w-8 h-8 sm:w-10 sm:h-10 animate-float animation-delay-1000" />
        <Sparkles className="absolute bottom-1/4 right-1/4 text-white/20 w-5 h-5 sm:w-6 sm:h-6 animate-float animation-delay-2000" />
        <Zap className="absolute bottom-1/3 left-1/3 text-white/20 w-7 h-7 sm:w-9 sm:h-9 animate-float animation-delay-1500" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md animate-scale-in">
          {/* Login Card with Glassmorphism */}
          <div className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="relative p-6 sm:p-8 text-center">
              {/* Logo Container */}
              <div className="relative inline-block mb-6 animate-bounce-in">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl" />
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm rounded-full border border-white/30 flex items-center justify-center shadow-xl transform hover:scale-110 transition-transform duration-300">
                  <ShoppingBag className="text-white w-10 h-10 sm:w-12 sm:h-12 animate-float" />
                </div>
                {/* Floating Ring */}
                <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping" />
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 drop-shadow-lg animate-fade-in-down animation-delay-100">
                Kantin Sekolah
              </h1>
              <p className="text-white/80 text-base sm:text-lg animate-fade-in-down animation-delay-200">
                Sistem Manajemen Modern
              </p>
              
              {/* Feature Pills */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4 animate-fade-in-down animation-delay-300">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-xs font-medium border border-white/20">
                  <Shield size={14} />
                  Aman
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-xs font-medium border border-white/20">
                  <Zap size={14} />
                  Cepat
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-xs font-medium border border-white/20">
                  <Sparkles size={14} />
                  Modern
                </span>
              </div>
            </div>

            {/* Login Form */}
            <div className="p-6 sm:p-8 pt-0">
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                {error && (
                  <div className="backdrop-blur-xl bg-red-500/20 border border-red-400/50 p-4 rounded-2xl animate-shake">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-red-200 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span className="text-white text-sm font-medium">{error}</span>
                    </div>
                  </div>
                )}

                {/* Username Input */}
                <div className="space-y-2 animate-fade-in-up animation-delay-300">
                  <label className="text-white/90 text-sm font-medium">Username</label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
                    <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl overflow-hidden transition-all group-hover:border-white/40 group-focus-within:border-white/60 group-focus-within:shadow-lg">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-white">
                        <User className="text-white/60" size={20} />
                      </div>
                      <input
                        type="text"
                        placeholder="Masukkan username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-transparent text-white placeholder-white/50 focus:outline-none text-base"
                        required
                        autoComplete="username"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2 animate-fade-in-up animation-delay-500">
                  <label className="text-white/90 text-sm font-medium">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
                    <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl overflow-hidden transition-all group-hover:border-white/40 group-focus-within:border-white/60 group-focus-within:shadow-lg">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-white">
                        <Lock className="text-white/60" size={20} />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Masukkan password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full pl-12 pr-14 py-3.5 sm:py-4 bg-transparent text-white placeholder-white/50 focus:outline-none text-base"
                        required
                        autoComplete="current-password"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors p-1"
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
                  className="relative w-full group animate-fade-in-up animation-delay-700"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-50 group-hover:opacity-75 transition-opacity" />
                  <div className="relative backdrop-blur-xl bg-gradient-to-r from-blue-500/90 via-purple-500/90 to-pink-500/90 border border-white/20 rounded-2xl px-6 py-3.5 sm:py-4 font-semibold text-white shadow-xl transform transition-all group-hover:scale-[1.02] group-hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                    {loading ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
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
              <div className="mt-6 sm:mt-8 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 animate-fade-in-up animation-delay-1000">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white/90 text-sm font-semibold">Demo Credentials</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between backdrop-blur-xl bg-white/5 px-4 py-3 rounded-xl border border-white/10 hover:bg-white/10 transition-colors group">
                    <span className="text-white/70 text-sm">Username:</span>
                    <code className="bg-white/10 px-3 py-1.5 rounded-lg font-mono font-semibold text-white text-sm border border-white/20 group-hover:bg-white/20 transition-colors">
                      admin
                    </code>
                  </div>
                  <div className="flex items-center justify-between backdrop-blur-xl bg-white/5 px-4 py-3 rounded-xl border border-white/10 hover:bg-white/10 transition-colors group">
                    <span className="text-white/70 text-sm">Password:</span>
                    <code className="bg-white/10 px-3 py-1.5 rounded-lg font-mono font-semibold text-white text-sm border border-white/20 group-hover:bg-white/20 transition-colors">
                      admin123
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 sm:mt-8 text-center animate-fade-in-up animation-delay-1000">
            <p className="text-white/60 text-sm backdrop-blur-sm bg-white/5 rounded-full px-6 py-3 inline-block border border-white/10">
              © 2024 Kantin Sekolah. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
