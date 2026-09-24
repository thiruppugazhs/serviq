import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import {
  Building2,
  Mail,
  Phone,
  ShieldCheck,
  AlertTriangle,
  Trash2,
  CheckCircle2,
  XCircle,
  Loader2,
  Lock,
} from 'lucide-react';

export const CompanySettings: React.FC = () => {
  const { user, logout } = useAuth();
  const org = typeof user?.organization === 'object' ? user.organization : null;

  // Deletion modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteStep, setDeleteStep] = useState<'initial' | 'otp_sent'>('initial');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deletionSuccess, setDeletionSuccess] = useState(false);

  // Request deletion OTP via Brevo
  const handleRequestDeletionOtp = async () => {
    setLoading(true);
    setStatusMessage(null);
    setErrorMessage(null);
    try {
      const res = await api.post('/auth/send-deletion-otp');
      if (res.data.success) {
        setDeleteStep('otp_sent');
        setStatusMessage(
          res.data.message ||
            `A security authorization code has been dispatched to ${user?.email}. Please check your inbox.`
        );
      }
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || 'Failed to dispatch deletion authorization code.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP and permanently delete account
  const handleConfirmDeletion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) {
      setErrorMessage('Please enter the 6-digit authorization code.');
      return;
    }

    setLoading(true);
    setStatusMessage(null);
    setErrorMessage(null);
    try {
      const res = await api.post('/auth/verify-and-delete-account', {
        otp: otpCode.trim(),
      });
      if (res.data.success) {
        setDeletionSuccess(true);
        setStatusMessage(res.data.message || 'Account successfully deleted.');
        setTimeout(() => {
          logout();
        }, 2200);
      }
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || 'Invalid or expired authorization code. Deletion cancelled.'
      );
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setShowDeleteModal(false);
    setDeleteStep('initial');
    setOtpCode('');
    setStatusMessage(null);
    setErrorMessage(null);
    setDeletionSuccess(false);
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white font-['Outfit',sans-serif]">
          Company & Organization Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your organization profile, enterprise fleet tier, and high-security account settings.
        </p>
      </div>

      {/* Organization Identity Panel */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center font-black text-2xl text-white shadow-xl shadow-emerald-950/50 overflow-hidden border border-emerald-500/20">
            {org?.logo ? (
              <img
                src={org.logo}
                alt={org.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              org?.name?.charAt(0).toUpperCase() || 'C'
            )}
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Registered Organization
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-['Outfit',sans-serif]">
              {org?.name || 'Commercial Fleet'}
            </h2>
            <p className="text-xs text-slate-400">{org?.email || user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400 font-medium">Company Name</span>
            <div className="font-semibold text-white text-sm">{org?.name || 'N/A'}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400 font-medium">Official Contact Email</span>
            <div className="font-semibold text-white text-sm">{org?.email || user?.email}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400 font-medium">Phone Number</span>
            <div className="font-semibold text-white text-sm">{org?.phone || user?.phone || 'Not provided'}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400 font-medium">Registration / Tax Number</span>
            <div className="font-semibold text-white font-mono text-sm">
              {org?.registrationNumber || 'Standard Enterprise Tier'}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 text-xs">
          <span className="text-slate-400 font-medium">Headquarters / Depot Address</span>
          <div className="font-semibold text-white">{org?.address || 'No physical address configured'}</div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-emerald-300">
            Active under <strong>SERVIQ Enterprise Fleet Tier</strong> with live Brevo transactional email delivery & OTP security.
          </span>
        </div>
      </div>

      {/* Danger Zone: Account Deletion */}
      <div className="p-6 sm:p-8 rounded-3xl border border-rose-900/40 bg-rose-950/10 space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 text-rose-400" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white font-['Outfit',sans-serif]">
              Danger Zone: Delete Fleet Account
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Permanently delete this organization, purge all connected vehicles, driver profiles,
              telemetry records, maintenance logs, and financial expenses. This action is irreversible
              and requires 6-digit email OTP verification via Brevo.
            </p>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600 border border-rose-500/40 hover:border-rose-500 text-rose-300 hover:text-white text-xs font-semibold transition-all duration-200 shadow-lg shadow-rose-950/30"
          >
            <Trash2 className="w-4 h-4" />
            Delete Organization Account
          </button>
        </div>
      </div>

      {/* Deletion Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-[#0e1626] border border-rose-900/60 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
            {/* Top Accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-600 via-red-500 to-amber-600" />

            {/* Modal Header */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0">
                <Lock className="w-6 h-6 text-rose-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white font-['Outfit',sans-serif]">
                  Authorize Permanent Deletion
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Verification code will be sent to <span className="text-white font-mono">{user?.email}</span>
                </p>
              </div>
            </div>

            {/* Warning Message */}
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-xs text-rose-300 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-rose-400">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                Irreversible Action
              </div>
              <div>
                All fleet data, assigned vehicles, maintenance tasks, and driver logs will be
                immediately wiped from SERVIQ database servers upon verification.
              </div>
            </div>

            {/* Alerts */}
            {statusMessage && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{statusMessage}</span>
              </div>
            )}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                <XCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Step 1: Initial Request */}
            {deleteStep === 'initial' && !deletionSuccess && (
              <div className="space-y-4">
                <p className="text-xs text-slate-300">
                  To safeguard your fleet organization against unauthorized removal, click below to
                  request a 6-digit authorization code delivered via our secure Brevo mail relay.
                </p>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={resetModal}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleRequestDeletionOtp}
                    disabled={loading}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-all duration-200 disabled:opacity-50 shadow-lg shadow-rose-900/40"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Dispatching Code...
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4" />
                        Send Deletion OTP to Email
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Enter OTP Code */}
            {deleteStep === 'otp_sent' && !deletionSuccess && (
              <form onSubmit={handleConfirmDeletion} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Enter 6-Digit Authorization Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="• • • • • •"
                    className="w-full text-center tracking-[0.5em] font-mono text-xl py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-white placeholder-slate-600 outline-none transition-all"
                    autoFocus
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-[11px] text-slate-500">Expires in 10 minutes</span>
                    <button
                      type="button"
                      onClick={handleRequestDeletionOtp}
                      disabled={loading}
                      className="text-[11px] text-rose-400 hover:text-rose-300 transition-colors underline"
                    >
                      Resend Code
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={resetModal}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || otpCode.length < 6}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all duration-200 disabled:opacity-50 shadow-lg shadow-red-900/50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Purging Account...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        Confirm Permanent Deletion
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Success Animation */}
            {deletionSuccess && (
              <div className="py-6 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-white font-['Outfit',sans-serif]">
                  Account Successfully Purged
                </h4>
                <p className="text-xs text-slate-400">
                  Redirecting to SERVIQ homepage...
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
