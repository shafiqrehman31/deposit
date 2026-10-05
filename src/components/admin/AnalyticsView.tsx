import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Users, Target, PoundSterling, Smartphone, 
  Monitor, ShieldAlert, Award, Calendar, RefreshCw
} from 'lucide-react';
import { AnalyticsData } from '../../types';
import { getAnalytics } from '../../services/api';

export const AnalyticsView: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await getAnalytics();
      setData(res);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading || !data) {
    return (
      <div className="py-20 text-center text-slate-400 text-sm">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
        <span>Calculating Conversion Metrics...</span>
      </div>
    );
  }

  const completionRate = data.quizStarts > 0 ? ((data.quizCompletions / data.quizStarts) * 100).toFixed(1) : '0';
  const qualificationRate = data.quizCompletions > 0 ? ((data.qualifiedLeadsCount / data.quizCompletions) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-8 text-slate-100">
      
      {/* Top Banner & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight font-display">
            Lead Conversion & Performance Analytics
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time funnel conversion metrics, claim values, and acquisition insights.
          </p>
        </div>
        <button
          onClick={fetchAnalytics}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold self-start transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Overall Visitor Conversion</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono tabular-nums">
            {data.conversionRate}%
          </div>
          <div className="text-[11px] text-slate-400">
            {data.quizCompletions + data.inquirySubmissions} leads from {data.totalVisitors} visitors
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Quiz Completion Rate</span>
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono tabular-nums">
            {completionRate}%
          </div>
          <div className="text-[11px] text-slate-400">
            {data.quizCompletions} finished / {data.quizStarts} started
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Lead Qualification Rate</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-black text-purple-400 font-mono tabular-nums">
            {qualificationRate}%
          </div>
          <div className="text-[11px] text-slate-400">
            {data.qualifiedLeadsCount} cases meet legal threshold
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Pipeline Damages Value</span>
            <PoundSterling className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono tabular-nums">
            £{data.totalClaimPipelineValue.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400">
            Statutory compensation represented
          </div>
        </div>
      </div>

      {/* Visual Conversion Funnel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white tracking-tight">
            Client Acquisition Funnel
          </h3>
          <p className="text-xs text-slate-400">
            Step-by-step drop-off analysis from initial page visit to qualified legal case.
          </p>
        </div>

        <div className="space-y-4">
          {/* Stage 1: Page Visitors */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-200">1. Landing Page Visitors</span>
              <span className="font-mono text-slate-400">{data.totalVisitors} (100%)</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden">
              <div className="bg-blue-600 h-3 rounded-full w-full" />
            </div>
          </div>

          {/* Stage 2: Engaged / Started Quiz */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-200">2. Calculator / Quiz Engagements</span>
              <span className="font-mono text-slate-400">
                {data.quizStarts} ({data.totalVisitors > 0 ? ((data.quizStarts / data.totalVisitors) * 100).toFixed(1) : 0}%)
              </span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden">
              <div
                className="bg-blue-500 h-3 rounded-full"
                style={{ width: `${Math.min(100, (data.quizStarts / Math.max(1, data.totalVisitors)) * 100)}%` }}
              />
            </div>
          </div>

          {/* Stage 3: Completed Questions */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-200">3. Full Eligibility Assessment Completed</span>
              <span className="font-mono text-slate-400">
                {data.quizCompletions} ({data.totalVisitors > 0 ? ((data.quizCompletions / data.totalVisitors) * 100).toFixed(1) : 0}%)
              </span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden">
              <div
                className="bg-emerald-500 h-3 rounded-full"
                style={{ width: `${Math.min(100, (data.quizCompletions / Math.max(1, data.totalVisitors)) * 100)}%` }}
              />
            </div>
          </div>

          {/* Stage 4: Qualified Leads */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-200">4. High-Viability Qualified Claims</span>
              <span className="font-mono text-slate-400">
                {data.qualifiedLeadsCount} ({data.totalVisitors > 0 ? ((data.qualifiedLeadsCount / data.totalVisitors) * 100).toFixed(1) : 0}%)
              </span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden">
              <div
                className="bg-purple-500 h-3 rounded-full"
                style={{ width: `${Math.min(100, (data.qualifiedLeadsCount / Math.max(1, data.totalVisitors)) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Performance Trends & Device Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Daily Leads Bar Chart (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">7-Day Lead Volume Trend</h3>
              <p className="text-xs text-slate-400">Daily incoming quiz and inquiry volume.</p>
            </div>
            <Calendar className="w-4 h-4 text-slate-500" />
          </div>

          {/* Responsive Bar Graphic */}
          <div className="pt-4 flex items-end justify-between gap-3 h-48">
            {data.dailyTrends.map((day) => {
              const maxLeads = Math.max(...data.dailyTrends.map((d) => d.leads), 5);
              const heightPct = Math.max(15, (day.leads / maxLeads) * 100);
              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <span className="text-[10px] font-mono text-slate-400 font-bold group-hover:text-blue-400">
                    {day.leads}
                  </span>
                  <div
                    className="w-full max-w-[36px] bg-blue-600/80 group-hover:bg-blue-500 rounded-t-lg transition-all"
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">
                    {day.date}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Device Breakdown (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white">Device Breakdown</h3>
            <p className="text-xs text-slate-400">Audience platform distribution.</p>
          </div>

          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-300">
                  <Smartphone className="w-4 h-4 text-blue-400" />
                  <span>Mobile Phone</span>
                </span>
                <span className="font-mono font-bold text-white">{data.deviceBreakdown.mobile}%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${data.deviceBreakdown.mobile}%` }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-300">
                  <Monitor className="w-4 h-4 text-emerald-400" />
                  <span>Desktop PC / Mac</span>
                </span>
                <span className="font-mono font-bold text-white">{data.deviceBreakdown.desktop}%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${data.deviceBreakdown.desktop}%` }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-300">
                  <Smartphone className="w-4 h-4 text-purple-400" />
                  <span>Tablet Device</span>
                </span>
                <span className="font-mono font-bold text-white">{data.deviceBreakdown.tablet}%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${data.deviceBreakdown.tablet}%` }} />
              </div>
            </div>
          </div>

          {/* Breach Breakdown Mini Strip */}
          <div className="pt-4 border-t border-slate-800 text-xs space-y-2">
            <span className="font-semibold text-slate-300 block">Top Landlord Breaches:</span>
            <div className="text-[11px] text-slate-400 space-y-1">
              <div className="flex justify-between">
                <span>Never Protected (3x):</span>
                <span className="font-mono font-bold text-white">{data.breachTypes.unprotected}</span>
              </div>
              <div className="flex justify-between">
                <span>Late Protection (&gt;30d):</span>
                <span className="font-mono font-bold text-white">{data.breachTypes.lateProtected}</span>
              </div>
              <div className="flex justify-between">
                <span>No Prescribed Info Pack:</span>
                <span className="font-mono font-bold text-white">{data.breachTypes.noPrescribedInfo}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
