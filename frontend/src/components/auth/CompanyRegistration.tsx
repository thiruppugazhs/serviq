import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import {
  Building2,
  Upload,
  X,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldAlert,
  Loader2,
  Phone,
  Mail,
  User as UserIcon,
  ArrowRight,
  ArrowLeft,
  Lock,
  Sparkles,
} from 'lucide-react';

export const CompanyRegistration: React.FC = () => {
  const navigate = useNavigate();
  const { registerCompany } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step state: 1 = Company Setup, 2 = Admin Details, 3 = Password Setting
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1: Company details
  const [companyName, setCompanyName] = useState('');
  const [companyLogo, setCompanyLogo] = useState<string>('');
  const [logoPreview, setLogoPreview] = useState<string>('');

  // Step 2: Admin details & OTP
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpMessage, setOtpMessage] = useState<string | null>(null);

  // Step 3: Password setting
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form submission state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle Logo Upload
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file for the company logo.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Company logo size must be under 5MB.');
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setCompanyLogo(result);
      setLogoPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setCompanyLogo('');
    setLogoPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Step 1 Validation -> Proceed to Step 2
  const handleProceedToStepTwo = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!companyName.trim()) {
      setError('Please enter your Company / Organization name to continue.');
      return;
    }
    setCurrentStep(2);
  };

  // Send OTP
  const handleSendOtp = async () => {
    if (!email.trim()) {
      setError('Please enter your admin email address first.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setError(null);
    setOtpLoading(true);
    try {
      const res = await api.post('/auth/send-otp', { email: email.trim() });
      if (res.data.success) {
        setOtpSent(true);
        setOtpMessage(res.data.message || `A 6-digit verification code has been sent to ${email.trim()}. Please check your inbox.`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP verification code.');
    } finally {
      setOtpLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (!otpCode.trim()) {
      setError('Please enter the 6-digit OTP code.');
      return;
    }

    setError(null);
    setOtpLoading(true);
    try {
      const res = await api.post('/auth/verify-otp', {
        email: email.trim(),
        otp: otpCode.trim(),
      });
      if (res.data.success) {
        setOtpVerified(true);
        setOtpMessage('Email successfully verified!');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid or expired OTP code.');
    } finally {
      setOtpLoading(false);
    }
  };

  // Step 2 Validation -> Proceed to Step 3
  const handleProceedToStepThree = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!firstName.trim() || !lastName.trim()) {
      setError('Please enter both Admin First Name and Last Name.');
      return;
    }
    if (!phone.trim()) {
      setError('Please enter your Admin Phone Number.');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your Admin Email Address.');
      return;
    }
    if (!otpVerified) {
      setError('Please verify your email address with the 6-digit OTP before proceeding.');
      return;
    }

    setCurrentStep(3);
  };

  // Final Step 3 Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    try {
      await registerCompany({
        companyName: companyName.trim(),
        companyEmail: email.trim(),
        companyLogo,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        adminName: `${firstName.trim()} ${lastName.trim()}`,
        phone: phone.trim(),
        adminEmail: email.trim(),
        password,
        confirmPassword,
      });

      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please check your data and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen max-h-screen overflow-hidden bg-black text-white font-['Plus_Jakarta_Sans',sans-serif]">
      {/* =========================================================================
          Left Showcase Panel (Dark Modern Gradient with Step Progress) - Fits Screen
      ========================================================================= */}
      <div className="relative hidden w-1/2 h-full p-4 lg:p-5 xl:p-6 lg:flex flex-col">
        <div className="h-full w-full overflow-hidden rounded-[32px] xl:rounded-[40px] bg-gradient-to-b from-[#3831eb] via-indigo-900 to-black border border-white/10 p-6 xl:p-8 flex flex-col justify-between relative shadow-2xl">
          {/* Ambient Lighting Orbs */}
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
                <span className="text-xl xl:text-2xl font-black tracking-tight text-white font-['Outfit',sans-serif] block leading-none">
                  serviq.
                </span>
                <span className="text-[9px] xl:text-[10px] text-blue-200 font-semibold tracking-wider uppercase block mt-0.5">
                  Fleet Operating System
                </span>
              </div>
            </Link>
          </div>

          {/* Center Showcase Content */}
          <div className="z-10 my-auto py-4 text-center max-w-sm xl:max-w-md mx-auto w-full">
            <h2 className="mb-2.5 text-3xl xl:text-4xl font-black text-white font-['Outfit',sans-serif] tracking-tight">
              Get Started with Us
            </h2>
            <p className="mb-6 text-xs xl:text-sm text-blue-100/80 leading-relaxed">
              Complete these three simple steps to establish your organization and launch your fleet command center.
            </p>

            {/* Step Indicators with Active Highlighting */}
            <div className="w-full space-y-2.5 xl:space-y-3 text-left">
              {/* Step 1 Pill */}
              <div
                className={`rounded-xl xl:rounded-2xl p-3 xl:p-3.5 backdrop-blur-md border transition-all ${
                  currentStep === 1
                    ? 'bg-white/15 border-white shadow-xl scale-[1.01]'
                    : currentStep > 1
                    ? 'bg-white/10 border-emerald-400/40 text-white'
                    : 'bg-white/5 border-white/10 text-white/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  {currentStep > 1 ? (
                    <span className="flex h-7 w-7 xl:h-8 xl:w-8 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-xs shadow shrink-0">
                      ✓
                    </span>
                  ) : (
                    <span
                      className={`flex h-7 w-7 xl:h-8 xl:w-8 items-center justify-center rounded-full font-bold text-xs shadow shrink-0 ${
                        currentStep === 1 ? 'bg-white text-[#3831eb]' : 'bg-white/20 text-white'
                      }`}
                    >
                      1
                    </span>
                  )}
                  <div className="min-w-0">
                    <span className="text-xs xl:text-sm font-bold text-white block truncate">1. Company Setup</span>
                    <span className="text-[10px] xl:text-xs text-white/70 block truncate">Company name & brand logo</span>
                  </div>
                </div>
              </div>

              {/* Step 2 Pill */}
              <div
                className={`rounded-xl xl:rounded-2xl p-3 xl:p-3.5 backdrop-blur-md border transition-all ${
                  currentStep === 2
                    ? 'bg-white/15 border-white shadow-xl scale-[1.01]'
                    : currentStep > 2
                    ? 'bg-white/10 border-emerald-400/40 text-white'
                    : 'bg-white/5 border-white/10 text-white/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  {currentStep > 2 ? (
                    <span className="flex h-7 w-7 xl:h-8 xl:w-8 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-xs shadow shrink-0">
                      ✓
                    </span>
                  ) : (
                    <span
                      className={`flex h-7 w-7 xl:h-8 xl:w-8 items-center justify-center rounded-full font-bold text-xs shadow shrink-0 ${
                        currentStep === 2 ? 'bg-white text-[#3831eb]' : 'bg-white/20 text-white'
                      }`}
                    >
                      2
                    </span>
                  )}
                  <div className="min-w-0">
                    <span className="text-xs xl:text-sm font-bold text-white block truncate">2. Admin Details & OTP</span>
                    <span className="text-[10px] xl:text-xs text-white/70 block truncate">Contact info & mail verification</span>
                  </div>
                </div>
              </div>

              {/* Step 3 Pill */}
              <div
                className={`rounded-xl xl:rounded-2xl p-3 xl:p-3.5 backdrop-blur-md border transition-all ${
                  currentStep === 3
                    ? 'bg-white/15 border-white shadow-xl scale-[1.01]'
                    : 'bg-white/5 border-white/10 text-white/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-7 w-7 xl:h-8 xl:w-8 items-center justify-center rounded-full font-bold text-xs shadow shrink-0 ${
                      currentStep === 3 ? 'bg-white text-[#3831eb]' : 'bg-white/20 text-white'
                    }`}
                  >
                    3
                  </span>
                  <div className="min-w-0">
                    <span className="text-xs xl:text-sm font-bold text-white block truncate">3. Password Setting</span>
                    <span className="text-[10px] xl:text-xs text-white/70 block truncate">Secure password & account launch</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer Note */}
          <div className="z-10 text-[11px] text-white/50 text-center flex items-center justify-center gap-1.5 shrink-0">
            <Sparkles className="w-3 h-3 text-blue-300" />
            <span>Multi-tenant isolation • Zero mock data</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          Right Form Panel: Step-Wise Account Creation - Fits Screen
      ========================================================================= */}
      <div className="flex w-full lg:w-1/2 h-full items-center justify-center bg-black p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="w-full max-w-md xl:max-w-lg my-auto py-2">
          
          {/* Step Header */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] xl:text-xs font-mono font-bold uppercase tracking-wider text-[#3831eb] bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                Step {currentStep} of 3
              </span>
              <span className="text-[11px] text-gray-500">
                {currentStep === 1 && 'Company Information'}
                {currentStep === 2 && 'Admin & Email Verification'}
                {currentStep === 3 && 'Security & Launch'}
              </span>
            </div>

            <h1 className="text-2xl xl:text-3xl font-black text-white font-['Outfit',sans-serif] tracking-tight mb-1">
              {currentStep === 1 && 'Company Setup'}
              {currentStep === 2 && 'Admin Details'}
              {currentStep === 3 && 'Password Setting'}
            </h1>
            <p className="text-xs text-gray-400">
              {currentStep === 1 && 'Provide your organization name and upload your company logo.'}
              {currentStep === 2 && 'Enter your contact info and verify your email via 6-digit OTP.'}
              {currentStep === 3 && 'Set a strong password to secure your SERVIQ command center.'}
            </p>
          </div>

          {/* Error Notification */}
          {error && (
            <div className="mb-3.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2.5">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* OTP Status Toast Banner */}
          {otpMessage && (
            <div className="mb-3.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{otpMessage}</span>
            </div>
          )}

          {/* ===============================================================
              STEP 1: COMPANY SETUP (Company Name + Company Logo)
          =============================================================== */}
          {currentStep === 1 && (
            <form onSubmit={handleProceedToStepTwo} className="space-y-4">
              {/* Google Auth Button (No GitHub Auth) */}
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setError('Google Workspace sign-in will connect to your corporate Google account.');
                  }}
                  className="w-full h-10 xl:h-11 flex items-center justify-center gap-2.5 rounded-xl border border-gray-800 bg-gray-900/80 hover:bg-gray-800 text-white font-semibold text-xs xl:text-sm transition-all shadow-sm"
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

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-800"></div>
                </div>
                <div className="relative flex justify-center text-[10px]">
                  <span className="bg-black px-2.5 text-gray-500 font-semibold uppercase tracking-wider">
                    Or setup company details
                  </span>
                </div>
              </div>

              {/* Company Name */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <Building2 className="w-3 h-3 text-[#3831eb]" />
                  Company / Organization Name *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. Apex Global Logistics Pvt Ltd"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="h-10 xl:h-11 w-full rounded-xl border border-gray-800 bg-gray-900/90 px-3.5 text-white text-xs xl:text-sm placeholder:text-gray-500 focus:border-[#3831eb] focus:outline-none focus:ring-1 focus:ring-[#3831eb] transition-all"
                />
              </div>

              {/* Company Logo Upload */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Upload className="w-3 h-3 text-[#3831eb]" />
                    Company Logo
                  </span>
                  <span className="text-[10px] text-gray-500 font-normal">PNG, JPG, SVG up to 5MB</span>
                </label>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleLogoChange}
                  accept="image/*"
                  className="hidden"
                />

                {logoPreview ? (
                  <div className="flex items-center gap-3 p-2.5 xl:p-3 rounded-xl border border-gray-800 bg-gray-900/90">
                    <div className="w-12 h-12 xl:w-14 xl:h-14 rounded-lg bg-black border border-gray-800 p-1 flex items-center justify-center overflow-hidden shrink-0">
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs xl:text-sm font-bold text-white block truncate">Logo Attached</span>
                      <span className="text-[10px] text-emerald-400 font-medium">Ready for your organization</span>
                    </div>
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-gray-800 transition-colors"
                      title="Remove Logo"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-16 xl:h-20 border border-dashed border-gray-800 hover:border-[#3831eb] rounded-xl flex flex-col items-center justify-center gap-1 text-xs text-gray-400 hover:text-white bg-gray-900/40 hover:bg-gray-900 transition-all group"
                  >
                    <Upload className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                    <span className="text-[11px]">Click or drag image to upload logo</span>
                  </button>
                )}
              </div>

              {/* Continue to Step 2 Button */}
              <button
                type="submit"
                className="h-10.5 xl:h-11 w-full bg-white text-black font-bold text-xs xl:text-sm rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 mt-4 shadow-lg hover:scale-[1.01] active:scale-[0.99]"
              >
                <span>Continue to Admin Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <p className="text-center text-[11px] text-gray-400 pt-1">
                Already have an account?{' '}
                <Link to="/login" className="text-white font-semibold hover:underline">
                  Log in
                </Link>
              </p>
            </form>
          )}

          {/* ===============================================================
              STEP 2: ADMIN DETAILS & MAIL OTP VERIFICATION
          =============================================================== */}
          {currentStep === 2 && (
            <form onSubmit={handleProceedToStepThree} className="space-y-3.5">
              {/* Admin First Name & Last Name (2 columns) */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                    <UserIcon className="w-3 h-3 text-[#3831eb]" />
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="Admin First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="h-10 xl:h-11 w-full rounded-xl border border-gray-800 bg-gray-900/90 px-3 text-white text-xs xl:text-sm placeholder:text-gray-500 focus:border-[#3831eb] focus:outline-none focus:ring-1 focus:ring-[#3831eb] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Admin Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="h-10 xl:h-11 w-full rounded-xl border border-gray-800 bg-gray-900/90 px-3 text-white text-xs xl:text-sm placeholder:text-gray-500 focus:border-[#3831eb] focus:outline-none focus:ring-1 focus:ring-[#3831eb] transition-all"
                  />
                </div>
              </div>

              {/* Admin Phone Number */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-[#3831eb]" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-10 xl:h-11 w-full rounded-xl border border-gray-800 bg-gray-900/90 px-3.5 text-white text-xs xl:text-sm placeholder:text-gray-500 focus:border-[#3831eb] focus:outline-none focus:ring-1 focus:ring-[#3831eb] transition-all"
                />
              </div>

              {/* Mail with OTP Verification */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-[#3831eb]" />
                    Mail (OTP Verification) *
                  </span>
                  {otpVerified && (
                    <span className="text-emerald-400 flex items-center gap-1 text-[10px] font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </label>

                <div className="flex gap-2">
                  <input
                    type="email"
                    required
                    disabled={otpVerified}
                    placeholder="admin@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-10 xl:h-11 flex-1 rounded-xl border border-gray-800 bg-gray-900/90 px-3.5 text-white text-xs xl:text-sm placeholder:text-gray-500 focus:border-[#3831eb] focus:outline-none focus:ring-1 focus:ring-[#3831eb] disabled:opacity-60 transition-all"
                  />

                  {!otpVerified && (
                    <button
                      type="button"
                      disabled={otpLoading || !email.trim()}
                      onClick={handleSendOtp}
                      className="px-3.5 h-10 xl:h-11 bg-white text-black font-bold text-xs rounded-xl hover:bg-gray-200 disabled:opacity-50 transition-all shrink-0 flex items-center gap-1"
                    >
                      {otpLoading && <Loader2 className="w-3 h-3 animate-spin" />}
                      <span>{otpSent ? 'Resend' : 'Send OTP'}</span>
                    </button>
                  )}
                </div>

                {/* OTP Code Input Box */}
                {otpSent && !otpVerified && (
                  <div className="mt-2 p-3 rounded-xl border border-gray-800 bg-gray-950/80 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-gray-300 font-semibold">Enter 6-digit OTP Code:</span>
                      <span className="text-gray-500">Valid 10 mins</span>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="e.g. 123456"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        className="h-9 xl:h-10 flex-1 tracking-widest text-center text-base font-mono rounded-lg border border-gray-700 bg-gray-900 text-white focus:border-[#3831eb] focus:outline-none"
                      />
                      <button
                        type="button"
                        disabled={otpLoading || otpCode.length < 6}
                        onClick={handleVerifyOtp}
                        className="px-4 h-9 xl:h-10 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
                      >
                        {otpLoading && <Loader2 className="w-3 h-3 animate-spin" />}
                        <span>Verify</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Back & Next Navigation Buttons */}
              <div className="flex items-center gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="h-10.5 xl:h-11 px-4 border border-gray-800 hover:border-gray-700 bg-gray-900 text-gray-300 hover:text-white font-semibold text-xs xl:text-sm rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  className="h-10.5 xl:h-11 flex-1 bg-white text-black font-bold text-xs xl:text-sm rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 shadow-lg hover:scale-[1.01] active:scale-[0.99]"
                >
                  <span>Continue to Password Setting</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* ===============================================================
              STEP 3: PASSWORD SETTING & LAUNCH
          =============================================================== */}
          {currentStep === 3 && (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Summary Card */}
              <div className="p-3 rounded-xl border border-gray-800 bg-gray-900/60 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Company:</span>
                  <span className="font-bold text-white flex items-center gap-1.5 truncate">
                    {logoPreview && (
                      <img src={logoPreview} alt="" className="w-3.5 h-3.5 object-contain rounded" />
                    )}
                    {companyName}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Admin:</span>
                  <span className="font-semibold text-white">{firstName} {lastName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Verified Email:</span>
                  <span className="font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {email}
                  </span>
                </div>
              </div>

              {/* Password Setting */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-[#3831eb]" />
                  Set Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoFocus
                    placeholder="Enter at least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-10 xl:h-11 w-full rounded-xl border border-gray-800 bg-gray-900/90 pl-3.5 pr-10 text-white text-xs xl:text-sm placeholder:text-gray-500 focus:border-[#3831eb] focus:outline-none focus:ring-1 focus:ring-[#3831eb] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[10px] text-gray-500">Must be at least 8 characters long.</p>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-10 xl:h-11 w-full rounded-xl border border-gray-800 bg-gray-900/90 pl-3.5 pr-10 text-white text-xs xl:text-sm placeholder:text-gray-500 focus:border-[#3831eb] focus:outline-none focus:ring-1 focus:ring-[#3831eb] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Back & Submit Actions */}
              <div className="flex items-center gap-2.5 pt-3">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setCurrentStep(2)}
                  className="h-10.5 xl:h-11 px-4 border border-gray-800 hover:border-gray-700 bg-gray-900 text-gray-300 hover:text-white font-semibold text-xs xl:text-sm rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="h-10.5 xl:h-11 flex-1 bg-white text-black font-bold text-xs xl:text-sm rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 shadow-lg hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />}
                  <span>Complete Account Creation</span>
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default CompanyRegistration;
