import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, ShieldAlert, Eye, EyeOff, Loader2, ShieldCheck, Sparkles } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = await login(email, password);
      // Route based on role
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'fleet_manager') {
        navigate('/manager/dashboard');
      } else if (user.role === 'driver') {
        navigate('/driver/home');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen max-h-screen overflow-hidden bg-slate-50 text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* =========================================================================
          Left Showcase Panel (Serviq Studio Blue Brand Gradient) - Fits Screen
      ========================================================================= */}
      <div className="relative hidden w-1/2 h-full p-4 lg:p-5 xl:p-6 lg:flex flex-col">
        <div className="h-full w-full overflow-hidden rounded-[32px] xl:rounded-[40px] bg-studio-blue border border-white/20 p-6 xl:p-8 flex flex-col justify-between relative shadow-xl">
          {/* Ambient Lighting */}
          <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-500/20 rounded-full blur-[90px] pointer-events-none" />

          {/* Top Brand Header */}
          <div className="z-10 shrink-0">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <img
                src="/logo-white.png"
                alt="SERVIQ Logo"
                className="w-8 h-8 xl:w-9 xl:h-9 object-contain drop-shadow group-hover:scale-105 transition-transform"
              />
              <div>
                <img
                  src="/serviq-name-logo.png"
                  alt="Serviq"
                  className="h-5 xl:h-6 w-auto object-contain"
                />
                <span className="text-[9px] xl:text-[10px] text-blue-200 font-semibold tracking-wider uppercase block mt-0.5">
                  Fleet Operating System
                </span>
              </div>
            </Link>
          </div>

          {/* Center Showcase Content */}
          <div className="z-10 my-auto py-4 text-center max-w-sm xl:max-w-md mx-auto w-full">
            <h2 className="mb-2.5 text-3xl xl:text-4xl font-black text-white font-['Outfit',sans-serif] tracking-tight">
              Welcome Back
            </h2>
            <p className="mb-6 text-xs xl:text-sm text-blue-100/90 leading-relaxed">
              Sign in to access your organization command center, manage vehicles, schedule maintenance, and coordinate your drivers.
            </p>

            {/* Info Cards */}
            <div className="w-full space-y-2.5 xl:space-y-3 text-left">
              <div className="rounded-xl xl:rounded-2xl bg-white/15 p-3 xl:p-3.5 backdrop-blur-md border border-white/20 shadow-md">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 xl:h-8 xl:w-8 items-center justify-center rounded-full bg-white text-[#2335f2] font-bold text-xs shadow-xs shrink-0">
                    <ShieldCheck className="w-4 h-4 text-[#2335f2]" />
                  </span>
                  <div className="min-w-0">
                    <span className="text-xs xl:text-sm font-bold text-white block truncate">Multi-Role Architecture</span>
                    <span className="text-[10px] xl:text-xs text-blue-100/80 block truncate">Separate portals for Admins, Managers & Drivers</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl xl:rounded-2xl bg-white/10 p-3 xl:p-3.5 backdrop-blur-md border border-white/15">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 xl:h-8 xl:w-8 items-center justify-center rounded-full bg-white/20 text-white font-bold text-xs shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </span>
                  <div className="min-w-0">
                    <span className="text-xs xl:text-sm font-bold text-white block truncate">Live Cloud Sync</span>
                    <span className="text-[10px] xl:text-xs text-blue-100/70 block truncate">Connected to live MongoDB Atlas</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer Note */}
          <div className="z-10 text-[11px] text-white/70 text-center flex items-center justify-center gap-1.5 shrink-0">
            <span>Enterprise Fleet Command & Driver Portal</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          Right Form Panel (Clean Modern Light Sign In) - Fits Screen
      ========================================================================= */}
      <div className="flex w-full lg:w-1/2 h-full items-center justify-center bg-white p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="w-full max-w-sm xl:max-w-md my-auto py-2">
          
          {/* Form Title & Subtitle */}
          <div className="mb-5">
            <h1 className="text-2xl xl:text-3xl font-black text-slate-900 font-['Outfit',sans-serif] tracking-tight mb-1">
              Sign In
            </h1>
            <p className="text-xs text-slate-500">
              Enter your credentials to access your fleet command center.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Social Authentication: Google Only */}
          <div className="mb-4">
            <button
              type="button"
              onClick={() => {
                setError('Google OAuth will sign you in using your corporate Google account.');
              }}
              className="w-full h-10 xl:h-11 flex items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs xl:text-sm transition-all shadow-2xs"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-[10px]">
              <span className="bg-white px-2.5 text-slate-400 font-semibold uppercase tracking-wider">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Mail className="w-3 h-3 text-[#2335f2]" />
                Email Address
              </label>
              <input
                type="email"
                required
                autoFocus
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 xl:h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-slate-900 text-xs xl:text-sm placeholder:text-slate-400 focus:border-[#2335f2] focus:outline-none focus:ring-1 focus:ring-[#2335f2] transition-all shadow-2xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-[#2335f2]" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 xl:h-11 w-full rounded-xl border border-slate-200 bg-white pl-3.5 pr-10 text-slate-900 text-xs xl:text-sm placeholder:text-slate-400 focus:border-[#2335f2] focus:outline-none focus:ring-1 focus:ring-[#2335f2] transition-all shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-10.5 xl:h-11 w-full bg-[#2335f2] text-white font-bold text-xs xl:text-sm rounded-xl hover:bg-[#1a29cc] transition-all flex items-center justify-center gap-2 mt-4 shadow-md shadow-blue-600/20 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />}
              <span>Sign In to SERVIQ</span>
            </button>

            <p className="text-center text-[11px] text-slate-500 pt-2">
              Don't have an organization account yet?{' '}
              <Link to="/register" className="text-[#2335f2] font-semibold hover:underline">
                Register Company
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
