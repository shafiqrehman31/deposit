import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Shield, Scale, Clock, Award } from 'lucide-react';
import { CmsContent } from '../types';

interface HeroProps {
  cms: CmsContent;
  onStartQuiz: (initialDeposit?: number) => void;
  onScrollTo: (id: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ cms, onStartQuiz, onScrollTo }) => {
  const [quickDeposit, setQuickDeposit] = useState<number>(1250);
  const [breachSeverity, setBreachSeverity] = useState<'high' | 'medium'>('high');

  const minComp = quickDeposit * 1;
  const maxComp = quickDeposit * (breachSeverity === 'high' ? 3 : 2);
  const totalReturnMax = maxComp + quickDeposit;

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white pt-12 pb-20 lg:pt-18 lg:pb-28">
      {/* Real High-Resolution British Residential Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/src/assets/images/hero_london_residential_backdrop_1790957970822.jpg"
          alt="London residential architecture at twilight"
          className="w-full h-full object-cover object-center filter brightness-[0.82] contrast-[1.05]"
          referrerPolicy="no-referrer"
        />
        {/* Translucent navy tint overlay so image details, windows, and architecture remain clearly visible */}
        <div className="absolute inset-0 bg-slate-950/50" />
        {/* Directional gradient ensuring crisp text legibility on the left while revealing the scene */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/88 via-slate-950/60 to-slate-950/20" />
        {/* Soft top & bottom framing blend */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-slate-950/90" />
      </div>

      {/* Background subtle radial accents */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Value Proposition & Copy */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Human unboxed kicker with metadata discipline */}
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-blue-400">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              <span>{cms.heroBadge}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400">Housing Act 2004 s.213</span>
            </div>

            {/* Marquee Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-display leading-[1.1] text-balance drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
              {cms.heroHeadline}
            </h1>

            {/* Concrete value proposition */}
            <p className="text-base sm:text-lg text-slate-100 leading-relaxed max-w-2xl drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]">
              {cms.heroSubtitle}
            </p>

            {/* Concrete guarantee checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-sm text-slate-300">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% No Win, No Fee Guarantee</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>6-Year Retrospective Claim Window</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>DPS, TDS & MyDeposits Audits</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>SRA-Regulated Solicitors</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <button
                onClick={() => onStartQuiz(quickDeposit)}
                className="inline-flex items-center justify-center px-6 py-3.5 text-base font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <span>{cms.ctaText}</span>
                <ArrowRight className="w-5 h-5 ml-2.5" />
              </button>

              <button
                onClick={() => onScrollTo('calculator')}
                className="inline-flex items-center justify-center px-5 py-3.5 text-sm font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-800 hover:text-white border border-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                <Scale className="w-4 h-4 mr-2 text-slate-400" />
                <span>Interactive Deposit Calculator</span>
              </button>
            </div>

            {/* Quiet social proof numbers */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-6 text-left">
              <div>
                <p className="text-2xl sm:text-3xl font-black text-white font-numeric tabular-nums tracking-tight">
                  {cms.stats.claimsRecovered}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">Recovered for UK Tenants</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-white font-numeric tabular-nums tracking-tight">
                  {cms.stats.averagePayout}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">Average Claim Payout</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-white font-numeric tabular-nums tracking-tight">
                  {cms.stats.successRate}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">Case Success Rate</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-white font-numeric tabular-nums tracking-tight">
                  {cms.stats.clientRating}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">Independent Rating</p>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual + Interactive Quick Estimator Box */}
          <div className="lg:col-span-5 space-y-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-sm p-6 sm:p-7">
              
              {/* Header inside estimator */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-base font-bold text-white tracking-tight">
                    Instant Compensation Estimator
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Based on Section 214 Housing Act 2004
                  </p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-blue-900/50 border border-blue-700/50 flex items-center justify-center text-blue-400">
                  <Award className="w-4 h-4" />
                </div>
              </div>

              {/* Slider for Deposit */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between text-sm">
                  <label htmlFor="quick-deposit-input" className="text-slate-300 font-medium">
                    Tenancy Deposit Paid:
                  </label>
                  <span className="text-xl font-black text-white font-numeric tabular-nums tracking-tight">
                    £{quickDeposit.toLocaleString()}
                  </span>
                </div>

                <input
                  id="quick-deposit-input"
                  type="range"
                  min="400"
                  max="4500"
                  step="50"
                  value={quickDeposit}
                  onChange={(e) => setQuickDeposit(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-numeric">
                  <span>£400</span>
                  <span>£2,000</span>
                  <span>£4,500+</span>
                </div>

                {/* Landlord breach scenario */}
                <div className="space-y-2 pt-1">
                  <span className="text-xs text-slate-300 block font-medium">
                    Landlord Breach Status:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setBreachSeverity('high')}
                      className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer text-left ${
                        breachSeverity === 'high'
                          ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                          : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <div className="font-bold">Not Protected (3x)</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Never placed in scheme</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setBreachSeverity('medium')}
                      className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer text-left ${
                        breachSeverity === 'medium'
                          ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                          : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <div className="font-bold">Protected Late (2x)</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">After 30 statutory days</div>
                    </button>
                  </div>
                </div>

                {/* Calculation Output Box */}
                <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800/80 space-y-2 mt-4">
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>Statutory Penalty (1x to {breachSeverity === 'high' ? '3x' : '2x'}):</span>
                    <span className="font-numeric font-bold text-slate-200">
                      £{minComp.toLocaleString()} – £{maxComp.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>Original Deposit Refund:</span>
                    <span className="font-numeric font-bold text-emerald-400">+£{quickDeposit.toLocaleString()}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Potential Claim:
                    </span>
                    <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-numeric tabular-nums tracking-tight">
                      up to £{totalReturnMax.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Direct Action */}
                <button
                  onClick={() => onStartQuiz(quickDeposit)}
                  className="w-full mt-2 py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                >
                  <span>Verify My Eligibility (Free)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[11px] text-center text-slate-400">
                  Takes 60 seconds · No credit check · Zero impact on tenancy
                </p>
              </div>
            </div>

            {/* Residential Visual Asset banner */}
            <div className="rounded-xl overflow-hidden border border-slate-800 relative h-36 sm:h-44 group">
              <img
                src="/src/assets/images/hero_tenancy_home_1790954635400.jpg"
                alt="UK Residential tenancy property"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex items-end p-4">
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <Shield className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Protecting tenants rights across England and Wales</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
