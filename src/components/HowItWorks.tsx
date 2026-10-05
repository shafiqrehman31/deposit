import React from 'react';
import { Search, FileText, Scale, Banknote, ShieldCheck } from 'lucide-react';

interface HowItWorksProps {
  onOpenQuiz: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onOpenQuiz }) => {
  const steps = [
    {
      num: '01',
      icon: Search,
      title: 'Free 60-Second Check',
      description: 'Answer a few simple questions about your tenancy, deposit amount, and rental location. Our system immediately calculates your statutory claim viability.',
    },
    {
      num: '02',
      icon: FileText,
      title: 'Government Scheme Audit',
      description: 'Our specialist solicitors conduct forensic searches across all 3 authorized UK tenancy deposit scheme registers (DPS, TDS, MyDeposits) to gather certified proof.',
    },
    {
      num: '03',
      icon: Scale,
      title: 'Formal Letter Before Action',
      description: 'We draft and serve a formal Section 214 legal notice to your landlord or letting agent detailing their statutory breach and demanding settlement.',
    },
    {
      num: '04',
      icon: Banknote,
      title: 'Direct Compensation Payout',
      description: 'Over 95% of claims settle out of court. Once compensation of 1x to 3x deposit is secured, funds are transferred directly into your UK bank account.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-slate-900 text-slate-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 tracking-wider uppercase">
            <ShieldCheck className="w-4 h-4" />
            <span>Stress-Free Legal Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight text-balance">
            How The Claim Process Works
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            We handle everything from government scheme searches to formal settlement negotiations. You never pay a penny upfront.
          </p>
        </div>

        {/* 4 Steps Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={s.num}
                className="relative bg-slate-850/80 rounded-2xl p-6 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black font-mono text-slate-700">
                      {s.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {s.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {s.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
                  Phase {idx + 1} · No Win, No Fee
                </div>
              </div>
            );
          })}
        </div>

        {/* Reassurance Banner */}
        <div className="mt-12 bg-slate-950 rounded-2xl p-6 sm:p-8 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-base font-bold text-white">
              Ready to find out if your landlord owes you compensation?
            </h4>
            <p className="text-xs text-slate-400">
              Check your eligibility in under 60 seconds with zero obligation.
            </p>
          </div>

          <button
            onClick={onOpenQuiz}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap active:scale-[0.98]"
          >
            Start Free Claim Check
          </button>
        </div>

      </div>
    </section>
  );
};
