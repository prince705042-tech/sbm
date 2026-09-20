import React, { useState } from 'react';
import { X, Shield, Lock, User, Eye, EyeOff, AlertCircle, PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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

    const cleanId = adminId.trim().toUpperCase();
    const cleanPassword = password.trim();

    // Check credentials:
    // Admin ID: SBM (case-insensitive)
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
        setErrorMessage('Invalid Admin ID or Password. Access is restricted to authorized personnel.');
      }, 300);
    }
  };

  const isAddBinReason = reason === 'add_bin';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-stone-900/60"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="relative z-10 bg-white rounded-lg max-w-md w-full p-5 sm:p-6 shadow-xl border border-stone-200 my-auto max-h-[92vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          id="btn-close-admin-login-modal"
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded bg-stone-100 text-stone-500 hover:text-stone-900 hover:bg-stone-200 flex items-center justify-center transition-colors cursor-pointer border border-stone-200"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
          <div className="w-10 h-10 rounded bg-[#134E3A] text-white flex items-center justify-center shrink-0">
            {isAddBinReason ? <PlusCircle className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-stone-900 font-editorial">
                {isAddBinReason ? 'Administrative Authorization' : 'Estate Admin Authentication'}
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-800 border border-stone-200 px-1.5 py-0.2 rounded font-mono-code">
                SBM
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              {isAddBinReason
                ? 'Authorized estate managers only'
                : 'Restricted to SBM campus sanitation supervisors'}
            </p>
          </div>
        </div>

        {/* Informative message for Add Bin attempt */}
        {isAddBinReason && (
          <div className="mt-4 p-3 rounded bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
            <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block">Estate Management Clearance:</span>
              <span className="text-amber-800">Please provide administrative credentials to register and configure dustbin stations on campus.</span>
            </div>
          </div>
        )}

        {/* Error notification */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0, x: [-4, 4, -3, 3, 0] }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="mt-4 p-3 rounded bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
              <span>{errorMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="mt-4 space-y-3.5">
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Admin Identifier:
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="input-admin-id"
                type="text"
                required
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                placeholder="e.g. SBM"
                className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded text-xs font-medium text-stone-900 placeholder-stone-400 focus:outline-hidden focus:border-[#134E3A] focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-stone-700">
                Security Passcode:
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="input-admin-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-9 pr-10 py-2 bg-stone-50 border border-stone-200 rounded text-xs font-medium text-stone-900 placeholder-stone-400 focus:outline-hidden focus:border-[#134E3A] focus:bg-white transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            id="btn-submit-admin-login"
            type="submit"
            disabled={isLoading}
            className="w-full py-2 rounded bg-[#134E3A] hover:bg-[#0F3E2E] active:bg-[#09261C] text-white text-xs font-semibold shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <Shield className="w-3.5 h-3.5" />
                <span>{isAddBinReason ? 'Verify Clearance' : 'Authenticate Session'}</span>
              </>
            )}
          </motion.button>
        </form>

        <p className="text-[11px] text-stone-400 text-center mt-4 pt-3 border-t border-stone-100 font-mono-code">
          Swachh Bharat Mission Sanitation Directorate &bull; NIT Patna
        </p>
      </motion.div>
    </div>
  );
};
