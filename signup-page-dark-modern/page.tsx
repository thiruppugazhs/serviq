"use client"

import React, { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Building2, Upload, X, Eye, EyeOff, CheckCircle2, ShieldAlert, Loader2, Phone, Mail, User as UserIcon, ArrowRight, ArrowLeft, Lock, Sparkles } from "lucide-react"

export default function SignUpPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Step state: 1 = Company Setup, 2 = Admin Details & OTP, 3 = Password Setting
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)

  // Step 1: Company details
  const [companyName, setCompanyName] = useState("")
  const [logoPreview, setLogoPreview] = useState<string>("")

  // Step 2: Admin details & OTP
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [otpCode, setOtpCode] = useState("")
  const [otpVerified, setOtpVerified] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Step 3: Password setting
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeLogo = () => {
    setLogoPreview("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSendOtp = () => {
    if (!email) return
    setError(null)
    setOtpLoading(true)
    setTimeout(() => {
      setOtpLoading(false)
      setOtpSent(true)
      setMessage("Verification code sent! (Code: 123456)")
    }, 700)
  }

  const handleVerifyOtp = () => {
    if (otpCode.length < 6) return
    setError(null)
    setOtpLoading(true)
    setTimeout(() => {
      setOtpLoading(false)
      setOtpVerified(true)
      setMessage("Email verified successfully!")
    }, 500)
  }

  const goToStepTwo = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!companyName.trim()) {
      setError("Please enter company/organization name.")
      return
    }
    setCurrentStep(2)
  }

  const goToStepThree = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!firstName.trim() || !lastName.trim()) {
      setError("Please enter first and last name.")
      return
    }
    if (!phone.trim()) {
      setError("Please enter phone number.")
      return
    }
    if (!email.trim()) {
      setError("Please enter email address.")
      return
    }
    if (!otpVerified) {
      setError("Please verify your email address with OTP before proceeding.")
      return
    }
    setCurrentStep(3)
  }

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }
    alert("Account created successfully!")
  }

  return (
    <div className="flex h-screen w-screen max-h-screen overflow-hidden bg-black text-white font-sans">
      {/* Left Section - Fits Screen */}
      <div className="relative hidden w-1/2 h-full p-4 lg:p-6 lg:flex flex-col">
        <div className="h-full w-full overflow-hidden rounded-[32px] xl:rounded-[40px] bg-gradient-to-b from-[#3831eb] via-indigo-900 to-black p-6 xl:p-8 flex flex-col justify-between border border-white/10 shadow-2xl">
          <div className="shrink-0">
            <h1 className="text-xl xl:text-2xl font-bold tracking-tight text-white">SERVIQ</h1>
            <span className="text-[10px] text-blue-200 uppercase tracking-wider">Fleet Operating System</span>
          </div>

          <div className="text-center max-w-sm xl:max-w-md mx-auto w-full my-auto py-4">
            <h2 className="mb-2 text-3xl xl:text-4xl font-black">Get Started with Us</h2>
            <p className="mb-6 text-blue-100/80 text-xs xl:text-sm">Three easy steps to establish your organization account.</p>

            <div className="w-full space-y-2.5 text-left">
              {/* Step 1 */}
              <div className={`rounded-xl p-3 backdrop-blur-sm border transition-all ${
                currentStep === 1 ? 'bg-white/15 border-white shadow-xl scale-[1.01]' : currentStep > 1 ? 'bg-white/10 border-emerald-400/40 text-white' : 'bg-white/5 border-white/10 text-white/60'
              }`}>
                <div className="flex items-center gap-3">
                  {currentStep > 1 ? (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-xs shrink-0">✓</span>
                  ) : (
                    <span className={`flex h-7 w-7 items-center justify-center rounded-full font-bold text-xs shrink-0 ${currentStep === 1 ? 'bg-white text-black' : 'bg-white/20 text-white'}`}>1</span>
                  )}
                  <div className="min-w-0">
                    <span className="text-xs font-semibold block truncate">1. Company & Organization</span>
                    <span className="text-[10px] text-white/70 block truncate">Register name & official logo</span>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className={`rounded-xl p-3 backdrop-blur-sm border transition-all ${
                currentStep === 2 ? 'bg-white/15 border-white shadow-xl scale-[1.01]' : currentStep > 2 ? 'bg-white/10 border-emerald-400/40 text-white' : 'bg-white/5 border-white/10 text-white/60'
              }`}>
                <div className="flex items-center gap-3">
                  {currentStep > 2 ? (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-xs shrink-0">✓</span>
                  ) : (
                    <span className={`flex h-7 w-7 items-center justify-center rounded-full font-bold text-xs shrink-0 ${currentStep === 2 ? 'bg-white text-black' : 'bg-white/20 text-white'}`}>2</span>
                  )}
                  <div className="min-w-0">
                    <span className="text-xs font-semibold block truncate">2. Admin Details & OTP</span>
                    <span className="text-[10px] text-white/60 block truncate">Verified administrator credentials</span>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className={`rounded-xl p-3 backdrop-blur-sm border transition-all ${
                currentStep === 3 ? 'bg-white/15 border-white shadow-xl scale-[1.01]' : 'bg-white/5 border-white/10 text-white/60'
              }`}>
                <div className="flex items-center gap-3">
                  <span className={`flex h-7 w-7 items-center justify-center rounded-full font-bold text-xs shrink-0 ${currentStep === 3 ? 'bg-white text-black' : 'bg-white/20 text-white'}`}>3</span>
                  <div className="min-w-0">
                    <span className="text-xs font-semibold block truncate">3. Password Setting</span>
                    <span className="text-[10px] text-white/60 block truncate">Secure password & account launch</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center text-[11px] text-white/40 shrink-0">
            Enterprise Fleet Command Platform
          </div>
        </div>
      </div>

      {/* Right Section - Fits Screen */}
      <div className="flex w-full lg:w-1/2 h-full items-center justify-center bg-black p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="w-full max-w-sm xl:max-w-md my-auto py-2">
          <div className="mb-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#3831eb] bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
              Step {currentStep} of 3
            </span>
            <h2 className="mt-1.5 text-2xl xl:text-3xl font-black text-white">
              {currentStep === 1 && "Company Setup"}
              {currentStep === 2 && "Admin Details"}
              {currentStep === 3 && "Password Setting"}
            </h2>
            <p className="text-xs text-gray-400">
              {currentStep === 1 && "Provide your organization name and upload your company logo."}
              {currentStep === 2 && "Enter admin details and verify your email with OTP."}
              {currentStep === 3 && "Set your secure password to complete account creation."}
            </p>
          </div>

          {error && (
            <div className="mb-3 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="mb-3 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {/* Step 1: Company Setup */}
          {currentStep === 1 && (
            <form onSubmit={goToStepTwo} className="space-y-3">
              {/* Google Only (GitHub removed) */}
              <div>
                <Button type="button" variant="outline" className="h-10 w-full border-gray-800 bg-gray-900 text-white hover:bg-gray-800 text-xs">
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </Button>
              </div>

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-800"></div>
                </div>
                <div className="relative flex justify-center text-[10px]">
                  <span className="bg-black px-2 text-gray-500 font-semibold uppercase">Or</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase text-gray-400">Company Name *</label>
                <Input
                  className="h-10 border-gray-800 bg-gray-900 text-white placeholder:text-gray-500 text-xs"
                  placeholder="Acme Global Logistics Pvt Ltd"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  type="text"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase text-gray-400">Company Logo</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleLogoUpload}
                  accept="image/*"
                  className="hidden"
                />
                {logoPreview ? (
                  <div className="flex items-center gap-2.5 p-2 rounded-xl border border-gray-800 bg-gray-900">
                    <img src={logoPreview} alt="Logo" className="w-9 h-9 object-contain rounded-lg bg-black p-0.5 border border-gray-800" />
                    <span className="text-xs text-white flex-1 truncate">Company logo uploaded</span>
                    <button type="button" onClick={removeLogo} className="p-1 text-gray-400 hover:text-rose-400">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-14 border border-dashed border-gray-800 hover:border-gray-700 rounded-xl flex items-center justify-center gap-2 text-xs text-gray-400 bg-gray-900/50 hover:bg-gray-900 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Company Logo</span>
                  </button>
                )}
              </div>

              <Button type="submit" className="h-10 w-full bg-white text-black hover:bg-gray-100 font-bold text-xs mt-3 flex items-center justify-center gap-2">
                <span>Continue to Admin Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>

              <p className="text-center text-[11px] text-gray-400 pt-1">
                Already have an account?{" "}
                <a href="/login" className="text-white hover:underline font-semibold">
                  Log in
                </a>
              </p>
            </form>
          )}

          {/* Step 2: Admin Details & OTP */}
          {currentStep === 2 && (
            <form onSubmit={goToStepThree} className="space-y-3">
              <div className="grid gap-2.5 grid-cols-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase text-gray-400">First Name *</label>
                  <Input
                    className="h-10 border-gray-800 bg-gray-900 text-white placeholder:text-gray-500 text-xs"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    type="text"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase text-gray-400">Last Name *</label>
                  <Input
                    className="h-10 border-gray-800 bg-gray-900 text-white placeholder:text-gray-500 text-xs"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    type="text"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase text-gray-400">Phone Number *</label>
                <Input
                  className="h-10 border-gray-800 bg-gray-900 text-white placeholder:text-gray-500 text-xs"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="tel"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase text-gray-400 flex items-center justify-between">
                  <span>Mail (OTP Verification) *</span>
                  {otpVerified && <span className="text-emerald-400 text-[10px] font-semibold">Verified</span>}
                </label>
                <div className="flex gap-2">
                  <Input
                    className="h-10 border-gray-800 bg-gray-900 text-white placeholder:text-gray-500 flex-1 text-xs"
                    placeholder="admin@company.com"
                    value={email}
                    disabled={otpVerified}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    required
                  />
                  {!otpVerified && (
                    <Button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={otpLoading || !email}
                      className="h-10 bg-white text-black hover:bg-gray-200 shrink-0 font-bold text-xs px-3"
                    >
                      {otpLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : (otpSent ? "Resend" : "Send OTP")}
                    </Button>
                  )}
                </div>

                {otpSent && !otpVerified && (
                  <div className="flex gap-2 pt-1.5">
                    <Input
                      className="h-9 border-gray-800 bg-gray-950 text-white text-center tracking-widest font-mono text-sm"
                      placeholder="6-digit OTP"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                    />
                    <Button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={otpLoading || otpCode.length < 6}
                      className="h-9 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs"
                    >
                      Verify
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2.5 pt-2">
                <Button type="button" onClick={() => setCurrentStep(1)} variant="outline" className="h-10 border-gray-800 bg-gray-900 text-white text-xs">
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back
                </Button>
                <Button type="submit" className="h-10 flex-1 bg-white text-black hover:bg-gray-100 font-bold text-xs">
                  <span>Continue to Password</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </form>
          )}

          {/* Step 3: Password Setting */}
          {currentStep === 3 && (
            <form onSubmit={handleFinalSubmit} className="space-y-3">
              <div className="p-2.5 rounded-xl border border-gray-800 bg-gray-900/60 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-400">Company:</span>
                  <span className="font-bold text-white truncate">{companyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Admin:</span>
                  <span className="font-semibold text-white">{firstName} {lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Email:</span>
                  <span className="text-emerald-400 font-mono">{email}</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase text-gray-400">Set Password *</label>
                <div className="relative">
                  <Input
                    className="h-10 border-gray-800 bg-gray-900 text-white placeholder:text-gray-500 pr-9 text-xs"
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[10px] text-gray-500">Must be at least 8 characters long.</p>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase text-gray-400">Confirm Password *</label>
                <div className="relative">
                  <Input
                    className="h-10 border-gray-800 bg-gray-900 text-white placeholder:text-gray-500 pr-9 text-xs"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    type={showConfirmPassword ? "text" : "password"}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-2">
                <Button type="button" onClick={() => setCurrentStep(2)} variant="outline" className="h-10 border-gray-800 bg-gray-900 text-white text-xs">
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back
                </Button>
                <Button type="submit" className="h-10 flex-1 bg-white text-black hover:bg-gray-100 font-bold text-xs">
                  Create Account
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
