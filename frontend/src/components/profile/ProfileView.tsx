import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import {
  Building2,
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  FileText,
  Globe,
  Truck,
  ShieldCheck,
  Edit3,
  Save,
  X,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Loader2,
  KeyRound,
  BadgeCheck,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { user, refreshUser, logout } = useAuth();
  const org = typeof user?.organization === 'object' ? user.organization : null;
  const isAdmin = user?.role === 'admin';

  // Submodule navigation state
  const [activeTab, setActiveTab] = useState<'company' | 'user'>('company');

  // Company Profile state
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [companyForm, setCompanyForm] = useState({
    name: '',
    email: '',
    phone: '',
    registrationNumber: '',
    website: '',
    businessType: 'Commercial Fleet Transport',
    address: '',
    logo: '',
  });
  const [companyLoading, setCompanyLoading] = useState(false);
  const [companySuccess, setCompanySuccess] = useState<string | null>(null);
  const [companyError, setCompanyError] = useState<string | null>(null);

  // User Profile state
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [userForm, setUserForm] = useState({
    name: '',
    phone: '',
    employeeId: '',
    address: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [userLoading, setUserLoading] = useState(false);
  const [userSuccess, setUserSuccess] = useState<string | null>(null);
  const [userError, setUserError] = useState<string | null>(null);

  // Danger Zone Deletion state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteStep, setDeleteStep] = useState<'initial' | 'otp_sent'>('initial');
  const [otpCode, setOtpCode] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState<string | null>(null);
  const [deleteErr, setDeleteErr] = useState<string | null>(null);

  // Sync state with user and organization
  useEffect(() => {
    if (org) {
      setCompanyForm({
        name: org.name || '',
        email: org.email || '',
        phone: org.phone || '',
        registrationNumber: org.registrationNumber || '',
        website: org.website || '',
        businessType: org.businessType || 'Commercial Fleet Transport',
        address: org.address || '',
        logo: org.logo || '',
      });
    }
  }, [org]);

  useEffect(() => {
    if (user) {
      setUserForm({
        name: user.name || '',
        phone: user.phone || '',
        employeeId: user.employeeId || '',
        address: user.address || '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  }, [user]);

  // Handle Company Save
  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setCompanyLoading(true);
    setCompanySuccess(null);
    setCompanyError(null);

    try {
      const res = await api.put('/auth/company-profile', companyForm);
      if (res.data.success) {
        setCompanySuccess('Company profile successfully updated.');
        setIsEditingCompany(false);
        await refreshUser();
        setTimeout(() => setCompanySuccess(null), 4000);
      }
    } catch (err: any) {
      setCompanyError(
        err.response?.data?.message || 'Failed to update company profile. Please verify your inputs.'
      );
    } finally {
      setCompanyLoading(false);
    }
  };

  // Handle User Save
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserLoading(true);
    setUserSuccess(null);
    setUserError(null);

    if (userForm.newPassword) {
      if (userForm.newPassword.length < 6) {
        setUserError('Password must be at least 6 characters long.');
        setUserLoading(false);
        return;
      }
      if (userForm.newPassword !== userForm.confirmPassword) {
        setUserError('New password and confirm password do not match.');
        setUserLoading(false);
        return;
      }
    }

    try {
      const payload: any = {
        name: userForm.name,
        phone: userForm.phone,
        employeeId: userForm.employeeId,
        address: userForm.address,
      };
      if (userForm.newPassword) {
        payload.password = userForm.newPassword;
      }

      const res = await api.put('/auth/profile', payload);
      if (res.data.success) {
        setUserSuccess('Admin profile successfully updated.');
        setIsEditingUser(false);
        setUserForm((prev) => ({ ...prev, newPassword: '', confirmPassword: '' }));
        await refreshUser();
        setTimeout(() => setUserSuccess(null), 4000);
      }
    } catch (err: any) {
      setUserError(
        err.response?.data?.message || 'Failed to update user profile. Please verify your inputs.'
      );
    } finally {
      setUserLoading(false);
    }
  };

  // Account Deletion Handlers
  const handleRequestDeletionOtp = async () => {
    setDeleteLoading(true);
    setDeleteMsg(null);
    setDeleteErr(null);
    try {
      const res = await api.post('/auth/send-deletion-otp');
      if (res.data.success) {
        setDeleteStep('otp_sent');
        setDeleteMsg(
          res.data.message || `A verification code has been dispatched to ${user?.email}.`
        );
      }
    } catch (err: any) {
      setDeleteErr(err.response?.data?.message || 'Failed to dispatch deletion authorization code.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleConfirmDeletion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) {
      setDeleteErr('Please enter the 6-digit authorization code.');
      return;
    }
    setDeleteLoading(true);
    setDeleteMsg(null);
    setDeleteErr(null);
    try {
      const res = await api.post('/auth/verify-and-delete-account', { otp: otpCode.trim() });
      if (res.data.success) {
        setDeleteMsg('Account successfully deleted.');
        setTimeout(() => logout(), 2000);
      }
    } catch (err: any) {
      setDeleteErr(err.response?.data?.message || 'Invalid or expired authorization code.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-slate-800 font-['Plus_Jakarta_Sans',sans-serif] animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit',sans-serif] tracking-tight">
          Profile Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your organization details, commercial fleet identity, and administrator credentials.
        </p>
      </div>

      {/* Submodule Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit border border-slate-200/80 shadow-2xs">
        <button
          onClick={() => setActiveTab('company')}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'company'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 className={`w-4 h-4 ${activeTab === 'company' ? 'text-blue-600' : 'text-slate-500'}`} />
          <span>Company Profile</span>
        </button>

        <button
          onClick={() => setActiveTab('user')}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'user'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UserIcon className={`w-4 h-4 ${activeTab === 'user' ? 'text-blue-600' : 'text-slate-500'}`} />
          <span>User Profile</span>
        </button>
      </div>

      {/* SUBMODULE 1: COMPANY PROFILE */}
      {activeTab === 'company' && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-150">
          {/* Company Identity Header Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center font-black text-2xl text-blue-600 shadow-xs overflow-hidden shrink-0">
                  {companyForm.logo ? (
                    <img
                      src={companyForm.logo}
                      alt={companyForm.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    companyForm.name?.charAt(0).toUpperCase() || 'C'
                  )}
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full mb-1">
                    <Building2 className="w-3 h-3" />
                    Registered Company
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Outfit',sans-serif]">
                    {companyForm.name || 'Your Company'}
                  </h2>
                  <p className="text-xs text-slate-500">{companyForm.email || 'company@domain.com'}</p>
                </div>
              </div>

              {isAdmin && (
                <button
                  onClick={() => setIsEditingCompany(!isEditingCompany)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs ${
                    isEditingCompany
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20'
                  }`}
                >
                  {isEditingCompany ? (
                    <>
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </>
                  ) : (
                    <>
                      <Edit3 className="w-4 h-4" />
                      <span>Edit Company Details</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Alert Banners */}
            {companySuccess && (
              <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{companySuccess}</span>
              </div>
            )}
            {companyError && (
              <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{companyError}</span>
              </div>
            )}

            {/* Edit Mode vs View Mode */}
            {isEditingCompany ? (
              <form onSubmit={handleSaveCompany} className="mt-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Company Name *
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={companyForm.name}
                        onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50/50"
                        placeholder="e.g. SRM Transports Pvt Ltd"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Official Contact Email *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={companyForm.email}
                        onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50/50"
                        placeholder="contact@company.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={companyForm.phone}
                        onChange={(e) => setCompanyForm({ ...companyForm, phone: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50/50"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Registration / GST / Tax Number
                    </label>
                    <div className="relative">
                      <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={companyForm.registrationNumber}
                        onChange={(e) =>
                          setCompanyForm({ ...companyForm, registrationNumber: e.target.value })
                        }
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50/50 font-mono"
                        placeholder="GSTIN33AABCU9603R1ZM"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Website URL
                    </label>
                    <div className="relative">
                      <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={companyForm.website}
                        onChange={(e) => setCompanyForm({ ...companyForm, website: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50/50"
                        placeholder="https://serviq.in"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Business Category / Fleet Type
                    </label>
                    <div className="relative">
                      <Truck className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={companyForm.businessType}
                        onChange={(e) =>
                          setCompanyForm({ ...companyForm, businessType: e.target.value })
                        }
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50/50"
                        placeholder="Commercial Transport & Logistics"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Headquarters / Depot Address
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <textarea
                      rows={2}
                      value={companyForm.address}
                      onChange={(e) => setCompanyForm({ ...companyForm, address: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50/50 resize-none"
                      placeholder="Plot 42, Central Transport Hub, Chennai, Tamil Nadu"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Logo Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={companyForm.logo}
                    onChange={(e) => setCompanyForm({ ...companyForm, logo: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50/50"
                    placeholder="https://example.com/logo.png"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsEditingCompany(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={companyLoading}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 disabled:opacity-50"
                  >
                    {companyLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>Save Company Changes</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1">
                    <span className="text-[11px] font-semibold text-slate-400 block">Company Name</span>
                    <span className="text-sm font-bold text-slate-900 block">
                      {companyForm.name || 'Not set'}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1">
                    <span className="text-[11px] font-semibold text-slate-400 block">Contact Email</span>
                    <span className="text-sm font-bold text-slate-900 block truncate">
                      {companyForm.email || 'Not set'}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1">
                    <span className="text-[11px] font-semibold text-slate-400 block">Phone Number</span>
                    <span className="text-sm font-bold text-slate-900 block">
                      {companyForm.phone || 'Not set'}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1">
                    <span className="text-[11px] font-semibold text-slate-400 block">Registration / Tax Number</span>
                    <span className="text-sm font-bold font-mono text-slate-900 block">
                      {companyForm.registrationNumber || 'Standard Enterprise'}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1">
                    <span className="text-[11px] font-semibold text-slate-400 block">Website</span>
                    <span className="text-sm font-bold text-slate-900 block truncate">
                      {companyForm.website ? (
                        <a
                          href={companyForm.website.startsWith('http') ? companyForm.website : `https://${companyForm.website}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {companyForm.website}
                        </a>
                      ) : (
                        'Not set'
                      )}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1">
                    <span className="text-[11px] font-semibold text-slate-400 block">Business Category</span>
                    <span className="text-sm font-bold text-slate-900 block">
                      {companyForm.businessType || 'Commercial Fleet Transport'}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400 block">Depot / Headquarters Address</span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-800 block">
                    {companyForm.address || 'No physical headquarters address configured'}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                  <span className="text-blue-900 font-medium">
                    Operating under <strong>SERVIQ Cloud Enterprise Tier</strong> with verified SSL encryption and dedicated fleet database.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Danger Zone for Organization */}
          {isAdmin && (
            <div className="p-6 rounded-3xl border border-rose-200 bg-rose-50/40 space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-rose-100 border border-rose-200 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Delete Organization Account
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Permanently delete this organization, connected vehicles, driver records, and trip histories.
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Organization</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUBMODULE 2: USER PROFILE (ADMIN DETAILS) */}
      {activeTab === 'user' && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-150">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-2xl shadow-xs shrink-0">
                  {userForm.name?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full mb-1">
                    <BadgeCheck className="w-3 h-3 text-emerald-600" />
                    {user?.role === 'admin' ? 'Organization Administrator' : 'Fleet Controller'}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Outfit',sans-serif]">
                    {userForm.name || user?.name}
                  </h2>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
              </div>

              <button
                onClick={() => setIsEditingUser(!isEditingUser)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs ${
                  isEditingUser
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20'
                }`}
              >
                {isEditingUser ? (
                  <>
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </>
                ) : (
                  <>
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Admin Details</span>
                  </>
                )}
              </button>
            </div>

            {/* Alert Banners */}
            {userSuccess && (
              <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{userSuccess}</span>
              </div>
            )}
            {userError && (
              <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{userError}</span>
              </div>
            )}

            {/* Edit Mode vs View Mode */}
            {isEditingUser ? (
              <form onSubmit={handleSaveUser} className="mt-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={userForm.name}
                        onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50/50"
                        placeholder="Thiruppugazh Srinivasan"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address (Primary Login)
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        disabled
                        value={user?.email || ''}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Email address is tied to your verified Google / account credentials.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={userForm.phone}
                        onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50/50"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Employee ID / Admin Tag
                    </label>
                    <div className="relative">
                      <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={userForm.employeeId}
                        onChange={(e) => setUserForm({ ...userForm, employeeId: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50/50 font-mono"
                        placeholder="EMP-ADM-001"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Office / Residential Address
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <textarea
                      rows={2}
                      value={userForm.address}
                      onChange={(e) => setUserForm({ ...userForm, address: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50/50 resize-none"
                      placeholder="Chennai, Tamil Nadu"
                    />
                  </div>
                </div>

                {/* Password Change Section */}
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 mb-3">
                    <KeyRound className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-900">
                      Change Password (Optional)
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={userForm.newPassword}
                        onChange={(e) =>
                          setUserForm({ ...userForm, newPassword: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                        placeholder="••••••••"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={userForm.confirmPassword}
                        onChange={(e) =>
                          setUserForm({ ...userForm, confirmPassword: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsEditingUser(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={userLoading}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 disabled:opacity-50"
                  >
                    {userLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>Save Admin Details</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1">
                    <span className="text-[11px] font-semibold text-slate-400 block">Admin Name</span>
                    <span className="text-sm font-bold text-slate-900 block">
                      {userForm.name || 'Not set'}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1">
                    <span className="text-[11px] font-semibold text-slate-400 block">Registered Email</span>
                    <span className="text-sm font-bold text-slate-900 block truncate">
                      {user?.email}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1">
                    <span className="text-[11px] font-semibold text-slate-400 block">Direct Phone</span>
                    <span className="text-sm font-bold text-slate-900 block">
                      {userForm.phone || 'Not provided'}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1">
                    <span className="text-[11px] font-semibold text-slate-400 block">Employee / Staff ID</span>
                    <span className="text-sm font-bold font-mono text-slate-900 block">
                      {userForm.employeeId || 'ADMIN-01'}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400 block">Contact Address</span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-800 block">
                    {userForm.address || 'No residential address configured'}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-bold">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">Password & Security</span>
                      <span className="text-slate-500 block text-[11px]">
                        Account protected by bcrypt hash with Google OAuth compatibility.
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEditingUser(true)}
                    className="text-blue-600 hover:text-blue-700 font-bold text-xs"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-slate-900">
                Confirm Account Deletion
              </h3>
              <p className="text-xs text-slate-500">
                This action is permanent and deletes all records associated with{' '}
                <strong className="text-slate-800">{companyForm.name}</strong>.
              </p>
            </div>

            {deleteMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs border border-emerald-200">
                {deleteMsg}
              </div>
            )}
            {deleteErr && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-800 text-xs border border-rose-200">
                {deleteErr}
              </div>
            )}

            {deleteStep === 'initial' ? (
              <div className="space-y-4">
                <p className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  To protect against unauthorized removal, we will dispatch a 6-digit confirmation code to{' '}
                  <strong>{user?.email}</strong>.
                </p>
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleRequestDeletionOtp}
                    disabled={deleteLoading}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm"
                  >
                    {deleteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    <span>Send Verification Code</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmDeletion} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Enter 6-Digit Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    className="w-full text-center text-lg tracking-widest font-mono py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={deleteLoading}
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm"
                  >
                    {deleteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    <span>Confirm & Permanently Delete</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
