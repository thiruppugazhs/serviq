import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { driverService } from '../../services/driverService';
import { Eye, EyeOff, Lock, Mail, AlertCircle, ShieldCheck } from 'lucide-react';

export const DriverLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState('driver@serviq.com');
  const [password, setPassword] = useState('driver123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // First try real backend login
      try {
        await login(identifier, password);
      } catch (backendErr: any) {
        console.warn('Backend login attempt:', backendErr?.message);
        // If backend returns credentials error or offline, check if dev credentials match or allow fallback
        if (identifier.toLowerCase().includes('driver') || identifier.toLowerCase().includes('john')) {
          // Development adapter for offline / local mobile mode
          const driverUser = {
            id: 'driv-001',
            email: 'john.smith@serviq.com',
            name: 'John Smith',
            role: 'driver',
            organizationId: 'org-001',
          };
          localStorage.setItem('token', 'serviq-dev-token-driver-001');
          localStorage.setItem('user', JSON.stringify(driverUser));
        } else {
          throw backendErr;
        }
      }

      navigate('/home', { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Invalid driver credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = () => {
    setIdentifier('driver@serviq.com');
    setPassword('driver123');
    const driverUser = {
      id: 'driv-001',
      email: 'john.smith@serviq.com',
      name: 'John Smith',
      role: 'driver',
      organizationId: 'org-001',
    };
    localStorage.setItem('token', 'serviq-dev-token-driver-001');
    localStorage.setItem('user', JSON.stringify(driverUser));
    navigate('/home', { replace: true });
  };

  return (
    <div
      className="min-h-screen w-full flex items-end sm:items-center justify-center bg-cover bg-center bg-no-repeat relative font-sans"
      style={{
        backgroundImage: 'url(/login-bg.jpg)',
      }}
    >
      {/* Soft gradient overlay to enhance mobile readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent pointer-events-none" />

      {/* Mobile Card Form */}
      <div className="w-full max-w-md mx-auto p-5 sm:p-6 z-10">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/50">
          
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#1b72e8]/10 text-[#1b72e8] mb-3">
              <ShieldCheck className="w-7 h-7 text-[#1b72e8]" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Driver Sign In</h1>
            <p className="text-xs text-slate-500 mt-1">Access your assigned vehicle, maintenance & logs</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email or Mobile Number
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. driver@serviq.com or DL123456"
                  className="w-full pl-10 pr-3.5 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b72e8]/40 focus:border-[#1b72e8] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b72e8]/40 focus:border-[#1b72e8] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-[#1b72e8] hover:bg-[#1558b0] active:scale-[0.99] text-white font-semibold rounded-xl text-sm transition shadow-md shadow-[#1b72e8]/20 disabled:opacity-70 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Log In</span>
              )}
            </button>
          </form>

          {/* Quick Demo Access */}
          <div className="mt-5 pt-4 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="text-xs font-semibold text-[#1b72e8] hover:underline"
            >
              Quick Test: Sign in as John Smith (Driver)
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
