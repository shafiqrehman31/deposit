import React, { useState, useEffect } from 'react';
import { 
  Users, BarChart3, FileEdit, Network, ShieldCheck, 
  LogOut, ExternalLink, Bell, Radio, Check, X, Scale
} from 'lucide-react';
import { subscribeToLeadStream, logout } from '../../services/api';
import { Lead } from '../../types';

interface AdminLayoutProps {
  activeTab: 'leads' | 'analytics' | 'cms' | 'crm' | 'security';
  onSelectTab: (tab: 'leads' | 'analytics' | 'cms' | 'crm' | 'security') => void;
  onLogout: () => void;
  onViewPublicSite: () => void;
  children: React.ReactNode;
  newLeadsCount?: number;
  onNewLeadReceived?: (lead: Lead) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  activeTab,
  onSelectTab,
  onLogout,
  onViewPublicSite,
  children,
  newLeadsCount = 0,
  onNewLeadReceived,
}) => {
  const [liveConnected, setLiveConnected] = useState(true);
  const [liveNotification, setLiveNotification] = useState<Lead | null>(null);

  // Play soft subtle chime via Web Audio API on new lead
  const playAlertChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch {
      // Audio autoplay policy fallback
    }
  };

  useEffect(() => {
    const unsubscribe = subscribeToLeadStream((newLead) => {
      setLiveNotification(newLead);
      playAlertChime();
      if (onNewLeadReceived) onNewLeadReceived(newLead);

      // Auto dismiss banner after 10s
      setTimeout(() => {
        setLiveNotification((current) => (current?.id === newLead.id ? null : current));
      }, 10000);
    });

    return () => unsubscribe();
  }, [onNewLeadReceived]);

  const handleLogoutClick = async () => {
    await logout();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Brand & Portal Badge */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Scale className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-white text-base tracking-tight font-display">
                  Deposit Hero
                </span>
                <span className="text-[10px] text-blue-400 font-mono ml-2 px-1.5 py-0.5 rounded bg-blue-950 border border-blue-800/80">
                  Legal Admin Portal
                </span>
              </div>
            </div>

            {/* Middle: Live Stream Status */}
            <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-950/80 px-3 py-1 rounded-full border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Real-time SSE Stream Active</span>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={onViewPublicSite}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                <span>View Public Site</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={handleLogoutClick}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-400 hover:text-red-300 bg-red-950/30 hover:bg-red-950/60 border border-red-900/50 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>

          </div>

          {/* Navigation Bar Tabs */}
          <nav className="flex space-x-1 sm:space-x-3 overflow-x-auto py-2 border-t border-slate-800/80 text-xs font-semibold scrollbar-none">
            <button
              onClick={() => onSelectTab('leads')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'leads'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Inquiries & Responses</span>
              {newLeadsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-blue-900 font-mono">
                  {newLeadsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onSelectTab('analytics')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'analytics'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Conversion Analytics</span>
            </button>

            <button
              onClick={() => onSelectTab('cms')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'cms'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileEdit className="w-4 h-4" />
              <span>CMS & Logo Upload</span>
            </button>

            <button
              onClick={() => onSelectTab('crm')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'crm'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Network className="w-4 h-4" />
              <span>Pipedrive CRM & Encryption</span>
            </button>

            <button
              onClick={() => onSelectTab('security')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'security'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Security & Multi-Factor Auth</span>
            </button>
          </nav>

        </div>
      </header>

      {/* Real-time Incoming Lead Alert Toast Banner */}
      {liveNotification && (
        <div className="bg-blue-600 text-white px-4 py-3 shadow-lg border-b border-blue-400/30 animate-in slide-in-from-top duration-300">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-2.5">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
              </span>
              <span>
                <strong>Real-Time Alert:</strong> New lead submission from <strong>{liveNotification.name}</strong> ({liveNotification.postcode}) · £{liveNotification.depositAmount.toLocaleString()} Deposit · Potential: <strong>£{liveNotification.estimatedCompensationMax.toLocaleString()}</strong>
              </span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => {
                  onSelectTab('leads');
                  setLiveNotification(null);
                }}
                className="px-2.5 py-1 bg-white text-blue-900 font-bold rounded text-xs hover:bg-blue-50 transition-colors"
              >
                View Details
              </button>
              <button
                onClick={() => setLiveNotification(null)}
                className="text-white hover:text-blue-100 p-1"
                aria-label="Dismiss alert"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

    </div>
  );
};
