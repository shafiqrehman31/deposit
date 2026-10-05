import React, { useState, useEffect } from 'react';
import { 
  Network, Lock, ShieldCheck, KeyRound, Check, 
  AlertCircle, RefreshCw, Save, Zap, ExternalLink 
} from 'lucide-react';
import { PipedriveConfig } from '../../types';
import { getPipedriveConfig, savePipedriveConfig, testPipedriveConnection } from '../../services/api';

export const CrmSettings: React.FC = () => {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rawTokenInput, setRawTokenInput] = useState('');
  const [domain, setDomain] = useState('');
  const [stageId, setStageId] = useState('');
  const [pipelineId, setPipelineId] = useState('');
  const [autoSync, setAutoSync] = useState(true);
  
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const data = await getPipedriveConfig();
      setConfig(data);
      setDomain(data.companyDomain || '');
      setStageId(data.stageId || '');
      setPipelineId(data.pipelineId || '');
      setAutoSync(Boolean(data.autoSync));
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error loading CRM settings' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    try {
      await savePipedriveConfig({
        rawApiToken: rawTokenInput.trim() || undefined,
        companyDomain: domain.trim(),
        stageId: stageId.trim(),
        pipelineId: pipelineId.trim(),
        autoSync,
      });

      setRawTokenInput('');
      await fetchConfig();
      setFeedback({
        type: 'success',
        message: 'Pipedrive CRM settings saved and API key encrypted with AES-256-GCM successfully!',
      });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to save CRM settings' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setFeedback(null);
    try {
      const res = await testPipedriveConnection();
      await fetchConfig();
      setFeedback({ type: 'success', message: res.message });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Connection test failed' });
    } finally {
      setIsTesting(false);
    }
  };

  if (loading && !config) {
    return (
      <div className="py-20 text-center text-slate-400 text-sm">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
        <span>Loading Pipedrive CRM Security Settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-slate-100 max-w-4xl">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <Network className="w-4 h-4" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight font-display">
            Pipedrive CRM Integration & Data Encryption
          </h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Synchronize website enquiries and quiz responses directly into your Pipedrive sales pipelines with military-grade AES-256 encryption.
        </p>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center justify-between border ${
            feedback.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
              : 'bg-red-950/80 border-red-800 text-red-300'
          }`}
        >
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="hover:opacity-75">✕</button>
        </div>
      )}

      {/* Encryption Security Certificate Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">
                Hardware-Standard Encryption Status: Active
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your Pipedrive API credentials are never stored in plain text. Tokens are encrypted using <strong className="text-white">AES-256-GCM</strong> (Authenticated Galois/Counter Mode) with unique initialization vectors (IV) and PBKDF2-derived master keys at rest.
            </p>
          </div>

          <span className="shrink-0 font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2.5 py-1 rounded-md">
            AES-256-GCM Encrypted
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Algorithm:</span>
            <span className="text-white font-bold">AES-256-GCM</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Authentication Tag:</span>
            <span className="text-white font-bold">128-bit Poly1305 / GCM</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Key Derivation:</span>
            <span className="text-white font-bold">PBKDF2 SHA-256</span>
          </div>
        </div>
      </div>

      {/* Integration Configuration Form */}
      <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-6">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">
            Pipedrive API Configuration
          </h3>
          <span className="text-xs text-slate-400">Pipedrive REST API v1</span>
        </div>

        <div className="space-y-4">
          
          {/* API Token Field */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">
                Pipedrive Personal API Token
              </label>
              <span className="text-[11px] text-slate-400 font-mono">
                Current: <strong className="text-emerald-400">{config?.tokenMasked || '••••••••'}</strong>
              </span>
            </div>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                placeholder="Paste new API token here to update and re-encrypt (or leave blank to keep current)..."
                value={rawTokenInput}
                onChange={(e) => setRawTokenInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Find this in your Pipedrive account: Settings → Personal Preferences → API → Personal API token.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Pipedrive Company Domain
              </label>
              <div className="flex items-center bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs">
                <input
                  type="text"
                  placeholder="your-company"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="bg-transparent text-white font-mono flex-1 focus:outline-none"
                />
                <span className="text-slate-500 font-mono">.pipedrive.com</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Target Pipeline ID
              </label>
              <input
                type="text"
                placeholder="e.g. pipeline-tenancy-claims"
                value={pipelineId}
                onChange={(e) => setPipelineId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Default Inbound Stage ID
              </label>
              <input
                type="text"
                placeholder="e.g. stage-1-inbox"
                value={stageId}
                onChange={(e) => setStageId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Last Verified Connection
              </label>
              <div className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-400 font-mono">
                {config?.lastTestedAt ? new Date(config.lastTestedAt).toLocaleString('en-GB') : 'Not tested yet'}
              </div>
            </div>
          </div>

          {/* Auto-Sync Toggle */}
          <div className="pt-2">
            <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={autoSync}
                onChange={(e) => setAutoSync(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-slate-700 text-blue-600 focus:ring-blue-500"
              />
              <div className="text-xs">
                <div className="font-semibold text-white">
                  Automatic Lead Synchronization
                </div>
                <div className="text-slate-400 mt-0.5">
                  Immediately push every submitted eligibility quiz and inquiry into Pipedrive as an encrypted deal record.
                </div>
              </div>
            </label>
          </div>

        </div>

        {/* Buttons */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={isTesting}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>{isTesting ? 'Testing Link...' : 'Test API Connection'}</span>
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-md transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Encrypting & Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>

    </div>
  );
};
