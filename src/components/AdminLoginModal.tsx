import React, { useState } from 'react';
import { X, Shield, Lock, User, Eye, EyeOff, AlertCircle, PlusCircle } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
  reason?: 'reports' | 'add_bin' | null;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  reason = null,
}) => {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    const cleanId = adminId.trim();
    const cleanPassword = password.trim();

    // Check credentials:
    // Admin ID: SBM
    // Password: SBM@2612047
    if (cleanId === 'SBM' && cleanPassword === 'SBM@2612047') {
      setTimeout(() => {
        setIsLoading(false);
        onLoginSuccess();
        onClose();
      }, 400);
    } else {
      setTimeout(() => {
        setIsLoading(false);
        setErrorMessage('Invalid Admin ID or Password. Please verify your credentials.');
      }, 300);
    }
  };

  const isAddBinReason = reason === 'add_bin';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full p-4 sm:p-7 shadow-2xl border border-slate-100 relative my-auto max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          id="btn-close-admin-login-modal"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 shrink-0">
            {isAddBinReason ? <PlusCircle className="w-6 h-6" /> : <Shield className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-extrabold text-slate-900 font-['Outfit',sans-serif]">
                {isAddBinReason ? 'Admin Authorization Required' : 'Admin Portal Login'}
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                SBM
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isAddBinReason
                ? 'Only SBM Administrators are authorized to add new dustbins.'
                : 'Authorized access to view & manage submitted reports'}
            </p>
          </div>
        </div>

        {/* Informative message for Add Bin attempt */}
        {isAddBinReason && (
          <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
            <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Restricted to SBM Administration</span>
              <span>Please sign in with your SBM administrator credentials to add and configure a new dustbin on campus.</span>
            </div>
          </div>
        )}

        {/* Error notification */}
        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Admin ID:
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="input-admin-id"
                type="text"
                required
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                placeholder="Enter Admin ID"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">
                Password:
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="input-admin-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Admin Password"
                className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            id="btn-submit-admin-login"
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <span>Verifying Admin...</span>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                <span>{isAddBinReason ? 'Verify & Continue to Add Bin' : 'Sign In as Admin'}</span>
              </>
            )}
          </button>
        </form>

        <p className="text-[11px] text-slate-400 text-center mt-4">
          Swachh Bharat Mission Campus Sanitation Cell • NIT Patna
        </p>
      </div>
    </div>
  );
};
