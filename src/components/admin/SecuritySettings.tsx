import React, { useState } from 'react';
import { 
  ShieldCheck, KeyRound, Lock, Eye, EyeOff, 
  Check, AlertTriangle, RefreshCw, Copy, Smartphone, ShieldAlert
} from 'lucide-react';
import { updateMfaSettings } from '../../services/api';

export const SecuritySettings: React.FC = () => {
  const [mfaActive, setMfaActive] = useState(true);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  const secretKey = 'JBSWY3DPEHPK3PXP';
  const backupCodes = ['849201', '395182', '774921', '602419', '194850'];

  const handleCopyKey = () => {
    navigator.clipboard.writeText(secretKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleSaveSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (newPassword && newPassword.length < 8) {
      setStatusMsg({ type: 'error', text: 'New password must be at least 8 characters long.' });
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setStatusMsg({ type: 'error', text: 'Password confirmation does not match.' });
      return;
    }

    setIsUpdating(true);
    try {
      await updateMfaSettings(mfaActive, newPassword || undefined);
      setNewPassword('');
      setConfirmPassword('');
      setStatusMsg({ type: 'success', text: 'Security and MFA settings updated successfully!' });
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to update settings.' });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-8 text-slate-100 max-w-4xl">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight font-display">
            Admin Authentication & Multi-Factor Security
          </h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Configure two-factor authentication (TOTP), authenticator keys, emergency backup codes, and session security.
        </p>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-xl text-xs border ${
            statusMsg.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
              : 'bg-red-950/80 border-red-800 text-red-300'
          }`}
        >
          {statusMsg.text}
        </div>
      )}

      {/* Secret URL Notice */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
          <ShieldAlert className="w-4 h-4" />
          <span>Stealth Administrative Route Notice</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Per security policy, there are <strong className="text-white">no public links or buttons</strong> to this admin panel anywhere on the user-facing website. Access is restricted to direct URL navigation:
        </p>
        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-blue-400 flex items-center justify-between">
          <span>{window.location.origin}/admin (or #{'/admin'})</span>
          <span className="text-[11px] text-slate-500">2FA Protected</span>
        </div>
      </div>

      {/* Form: MFA and Password */}
      <form onSubmit={handleSaveSecurity} className="space-y-6">
        
        {/* SECTION 1: MFA Toggle & Secret */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Two-Factor Authentication (2FA)</h3>
              <p className="text-xs text-slate-400">Requires a 6-digit TOTP code during every admin login session.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={mfaActive}
                onChange={(e) => setMfaActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {mfaActive && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Authenticator App setup */}
                <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <Smartphone className="w-4 h-4 text-blue-400" />
                    <span>Authenticator App Sync</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Works with Google Authenticator, 1Password, Microsoft Authenticator, or Authy.
                  </p>
                  
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Manual Secret Key:</span>
                    <div className="flex items-center justify-between">
                      <code className="text-xs text-blue-400 font-mono font-bold tracking-wider">{secretKey}</code>
                      <button
                        type="button"
                        onClick={handleCopyKey}
                        className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Standard demo verification code: <code className="text-emerald-400 font-mono">123456</code>
                  </p>
                </div>

                {/* Emergency Backup Codes */}
                <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <KeyRound className="w-4 h-4 text-emerald-400" />
                    <span>Emergency Single-Use Backup Codes</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    If you lose access to your authenticator, use any of these one-time codes:
                  </p>

                  <div className="grid grid-cols-2 gap-2 font-mono text-xs text-slate-300">
                    {backupCodes.map((code) => (
                      <div key={code} className="p-2 rounded bg-slate-900 border border-slate-800 text-center font-bold">
                        {code}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: Master Password Update */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white">Change Master Password</h3>
            <p className="text-xs text-slate-400">Update the administrative account password.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Leave blank to keep unchanged"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Confirm New Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isUpdating}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
          >
            {isUpdating ? 'Updating Security...' : 'Save Security Settings'}
          </button>
        </div>

      </form>

    </div>
  );
};
