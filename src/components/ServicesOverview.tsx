import React from 'react';
import { ShieldCheck, Scale, AlertOctagon, FileCheck, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { CmsContent } from '../types';

interface ServicesOverviewProps {
  cms: CmsContent;
  onOpenQuiz: () => void;
}

export const ServicesOverview: React.FC<ServicesOverviewProps> = ({ cms, onOpenQuiz }) => {
  return (
    <section id="services" className="py-20 bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Background Architectural Backdrop Image */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/src/assets/images/hero_london_residential_backdrop_1790957970822.jpg"
          alt="London residential architecture backdrop"
          className="w-full h-full object-cover object-center filter brightness-[0.70] contrast-[1.05]"
          referrerPolicy="no-referrer"
        />
        {/* Balanced translucent overlay */}
        <div className="absolute inset-0 bg-slate-950/75" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/50 to-slate-950" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 tracking-wider uppercase">
            <span>Specialist Legal Claims</span>
            <span aria-hidden="true">·</span>
            <span>Housing Act 2004</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight text-balance">
            Comprehensive Tenancy Deposit Claim Services
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            UK landlords and letting agents face strict technical compliance duties. If any procedural duty was breached, the court has no choice but to award statutory financial compensation.
          </p>
        </div>

        {/* Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Marquee Bento (2 cols) */}
          <div className="md:col-span-2 rounded-2xl bg-slate-900 border border-slate-800 p-7 sm:p-9 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-blue-400">01. Unprotected Funds</span>
                <span className="text-xs font-mono text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-md">
                  Statutory 3x Penalty
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Unprotected Deposit Claims
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                Since 6 April 2007, every landlord taking a deposit for an Assured Shorthold Tenancy (AST) in England or Wales must register it in a government-backed custodial or insurance scheme within 30 days. If your deposit was kept in an agent’s or landlord’s personal bank account, you are entitled to the full return of your deposit plus between 1x and 3x in damages.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Applies to private landlords & agencies</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Enforceable for up to 6 years</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={onOpenQuiz}
                className="text-xs font-bold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Check Your Unprotected Claim</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 2: Feature with image (1 col) */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div className="h-44 overflow-hidden relative">
              <img
                src="/src/assets/images/feature_deposit_protection_1790954652855.jpg"
                alt="Deposit protection document and keys"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
            </div>
            <div className="p-6 space-y-3">
              <span className="text-xs font-mono font-bold text-blue-400">02. Deadline Breach</span>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Late Protection Claims
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Even if your landlord eventually registered the deposit on day 31 or months later, the breach cannot be remedied. The Supreme Court precedent confirms late registration is an irrevocable violation.
              </p>
              <button
                onClick={onOpenQuiz}
                className="text-xs font-bold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 pt-2 cursor-pointer"
              >
                <span>Calculate Late Award</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3: Feature with Consultation Image (1 col) */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div className="h-44 overflow-hidden relative">
              <img
                src="/src/assets/images/feature_legal_advisory_1790954663501.jpg"
                alt="UK legal claims specialist consultation"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
            </div>
            <div className="p-6 space-y-3">
              <span className="text-xs font-mono font-bold text-blue-400">03. Omission of Notice</span>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Prescribed Information
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Landlords must serve the official prescribed scheme leaflet, certificate, and dispute clause signed by landlord. Missing even one statutory document triggers the exact same financial penalty.
              </p>
              <button
                onClick={onOpenQuiz}
                className="text-xs font-bold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 pt-2 cursor-pointer"
              >
                <span>Check Documentation</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 4: Multiplier Bento (2 cols) */}
          <div className="md:col-span-2 rounded-2xl bg-slate-900 border border-slate-800 p-7 sm:p-9 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-blue-400">04. Multiple Claims</span>
                <span className="text-xs font-mono text-blue-400 bg-blue-950/60 border border-blue-800/60 px-2.5 py-1 rounded-md">
                  Superstrike Precedent
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Tenancy Renewals & Periodic Multipliers
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                Did you sign an agreement extension or did your contract roll over monthly? In the landmark Court of Appeal case <em className="text-white">Superstrike Ltd v Rodrigues</em>, each renewed term is considered a separate deposit transaction. If your deposit was unprotected across 3 renewals, you can claim 3 separate penalty awards against the same landlord!
              </p>

              <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block">Example on £1,500 deposit with 2 renewals:</span>
                  <span className="font-bold text-white text-sm">3 Terms × Up to £4,500 penalty</span>
                </div>
                <span className="text-emerald-400 font-mono font-extrabold text-base sm:text-lg">
                  Up to £13,500 + Deposit
                </span>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={onOpenQuiz}
                className="text-xs font-bold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Calculate Your Multiplier</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* The 3 Schemes Trust Bar */}
        <div className="mt-14 pt-10 border-t border-slate-800/80">
          <p className="text-xs text-slate-400 text-center uppercase tracking-wider font-semibold mb-6">
            We audit compliance across all three UK Government-Approved Schemes
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300">
              <div className="font-bold text-sm text-white">DPS</div>
              <div className="text-xs text-slate-400 mt-0.5">The Deposit Protection Service</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300">
              <div className="font-bold text-sm text-white">TDS</div>
              <div className="text-xs text-slate-400 mt-0.5">Tenancy Deposit Scheme</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300">
              <div className="font-bold text-sm text-white">MyDeposits</div>
              <div className="text-xs text-slate-400 mt-0.5">Tenancy Deposit Solutions Ltd</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
