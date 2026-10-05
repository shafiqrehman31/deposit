import React, { useState } from 'react';
import { Calculator, ArrowRight, Info, HelpCircle, Check, ShieldAlert, Sparkles } from 'lucide-react';

interface DepositCalculatorProps {
  onStartQuizWithData: (data: { deposit: number; renewals: number; breachType: string }) => void;
}

export const DepositCalculator: React.FC<DepositCalculatorProps> = ({ onStartQuizWithData }) => {
  const [depositAmount, setDepositAmount] = useState<number>(1350);
  const [renewals, setRenewals] = useState<number>(1);
  const [unprotectedBreach, setUnprotectedBreach] = useState<boolean>(true);
  const [lateProtectionBreach, setLateProtectionBreach] = useState<boolean>(false);
  const [prescribedInfoBreach, setPrescribedInfoBreach] = useState<boolean>(true);
  const [unlawfulDeduction, setUnlawfulDeduction] = useState<number>(0);
  const [showPrecedentInfo, setShowPrecedentInfo] = useState<boolean>(false);

  // Calculate penalties:
  // Each breach term counts as an independent statutory penalty under Section 214 of the Housing Act 2004.
  // Renewal multiplier (termsCount = 1 + renewals)
  const termsCount = 1 + renewals;
  
  // Base multiplier per term (min 1x, max 3x depending on breaches)
  let maxMultiplier = 1;
  if (unprotectedBreach) maxMultiplier = 3;
  else if (lateProtectionBreach) maxMultiplier = 2;
  else if (prescribedInfoBreach) maxMultiplier = 2;

  const minPenalty = depositAmount * 1 * termsCount;
  const maxPenalty = depositAmount * maxMultiplier * termsCount;
  const totalMaxRecovery = maxPenalty + depositAmount + unlawfulDeduction;

  const handleLaunchQuiz = () => {
    const breach = unprotectedBreach ? 'no' : lateProtectionBreach ? 'late' : 'dont_know';
    onStartQuizWithData({
      deposit: depositAmount,
      renewals,
      breachType: breach,
    });
  };

  return (
    <section id="calculator" className="py-20 bg-slate-900 text-slate-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 tracking-wider uppercase">
            <Calculator className="w-4 h-4" />
            <span>Interactive Tenancy Compensation Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight text-balance">
            UK Tenancy Deposit Compensation Calculator
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Under Section 214 of the Housing Act 2004, judges have statutory powers to award 1x to 3x the deposit amount per tenancy breach. Use our live tool to calculate your potential claim.
          </p>
        </div>

        {/* Main Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Column (7 cols) */}
          <div className="lg:col-span-7 bg-slate-800/80 rounded-2xl p-6 sm:p-8 border border-slate-700 shadow-xl space-y-7">
            
            {/* 1. Deposit Amount Slider & Input */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="calc-deposit-input" className="text-sm font-semibold text-white">
                  1. How much deposit did you pay?
                </label>
                <div className="flex items-center gap-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5">
                  <span className="text-slate-400 text-sm font-bold">£</span>
                  <input
                    id="calc-deposit-input"
                    type="number"
                    min="200"
                    max="10000"
                    step="50"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(Math.max(0, Number(e.target.value)))}
                    className="w-24 bg-transparent text-white font-mono font-bold text-right focus:outline-none"
                  />
                </div>
              </div>

              <input
                type="range"
                min="400"
                max="5000"
                step="50"
                value={depositAmount}
                onChange={(e) => setDepositAmount(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-slate-400 font-mono">
                <span>£400</span>
                <span>£1,500 (UK Average)</span>
                <span>£5,000</span>
              </div>
            </div>

            {/* 2. Tenancy Renewals Multiplier */}
            <div className="space-y-3 pt-2 border-t border-slate-700/80">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-semibold text-white">
                      2. Tenancy Renewals & Extensions
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPrecedentInfo(!showPrecedentInfo)}
                      className="text-slate-400 hover:text-blue-400 transition-colors"
                      title="Learn about Superstrike vs Rodrigues case law"
                    >
                      <HelpCircle className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Did you sign a renewal contract or roll into a periodic tenancy?
                  </p>
                </div>
                <span className="text-sm font-mono font-bold text-blue-400 bg-blue-950/60 border border-blue-800/80 px-2.5 py-1 rounded-md">
                  {renewals === 0 ? 'Initial Term Only' : `${renewals} Renewal${renewals > 1 ? 's' : ''} (${termsCount}x terms)`}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[0, 1, 2, 3].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setRenewals(num)}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                      renewals === num
                        ? 'bg-blue-600 border-blue-500 text-white shadow-sm'
                        : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {num === 0 ? 'None (0)' : num === 3 ? '3+ Renewals' : `${num} Term${num > 1 ? 's' : ''}`}
                  </button>
                ))}
              </div>

              {showPrecedentInfo && (
                <div className="bg-slate-950/90 border border-blue-900/60 rounded-xl p-3.5 text-xs text-slate-300 space-y-1.5">
                  <div className="font-semibold text-blue-400 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5" />
                    <span>Legal Precedent: Superstrike Ltd v Rodrigues [2013]</span>
                  </div>
                  <p>
                    The UK Court of Appeal ruled that when a fixed-term tenancy expires and transitions into a statutory periodic tenancy, or a renewal is signed, a new deposit is legally deemed to have been paid. If your deposit was unprotected, your landlord committed a separate breach for each term, multiplying your compensation!
                  </p>
                </div>
              )}
            </div>

            {/* 3. Landlord Breaches Checklist */}
            <div className="space-y-3 pt-2 border-t border-slate-700/80">
              <label className="text-sm font-semibold text-white block">
                3. Check the breaches that apply to your landlord:
              </label>

              <div className="space-y-2">
                <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-700/70 hover:border-slate-600 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={unprotectedBreach}
                    onChange={(e) => {
                      setUnprotectedBreach(e.target.checked);
                      if (e.target.checked) setLateProtectionBreach(false);
                    }}
                    className="mt-0.5 w-4 h-4 rounded border-slate-700 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="text-xs">
                    <div className="font-semibold text-slate-200">
                      Deposit was never placed into a government scheme (DPS / TDS / MyDeposits)
                    </div>
                    <div className="text-slate-400 mt-0.5">
                      Landlord retained your deposit in their private account. Maximum 3x statutory penalty.
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-700/70 hover:border-slate-600 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={lateProtectionBreach}
                    onChange={(e) => {
                      setLateProtectionBreach(e.target.checked);
                      if (e.target.checked) setUnprotectedBreach(false);
                    }}
                    className="mt-0.5 w-4 h-4 rounded border-slate-700 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="text-xs">
                    <div className="font-semibold text-slate-200">
                      Deposit was protected LATE (more than 30 days after you paid it)
                    </div>
                    <div className="text-slate-400 mt-0.5">
                      Statutory deadline missed. Late protection does NOT absolve the landlord.
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-700/70 hover:border-slate-600 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={prescribedInfoBreach}
                    onChange={(e) => setPrescribedInfoBreach(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-slate-700 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="text-xs">
                    <div className="font-semibold text-slate-200">
                      Landlord failed to provide official "Prescribed Information" pack
                    </div>
                    <div className="text-slate-400 mt-0.5">
                      Failure to give the statutory certificate and scheme leaflets within 30 days.
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* 4. Unlawful deductions (optional) */}
            <div className="pt-2 border-t border-slate-700/80">
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="unlawful-deductions-input" className="text-sm font-semibold text-white">
                    4. Any unlawful deposit deductions withheld?
                  </label>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Deductions made for fair wear & tear or without dispute arbitration.
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1">
                  <span className="text-slate-400 text-xs font-bold">£</span>
                  <input
                    id="unlawful-deductions-input"
                    type="number"
                    min="0"
                    max="5000"
                    step="50"
                    value={unlawfulDeduction || ''}
                    placeholder="0"
                    onChange={(e) => setUnlawfulDeduction(Math.max(0, Number(e.target.value)))}
                    className="w-20 bg-transparent text-white font-mono text-sm font-bold text-right focus:outline-none"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Results Summary Column (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-800 via-slate-850 to-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-700 shadow-2xl space-y-6">
            
            <div className="border-b border-slate-700/80 pb-4">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                Estimated Claim Valuation
              </span>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Your Potential Legal Award
              </h3>
            </div>

            {/* Big Award Number */}
            <div className="bg-slate-950/90 rounded-2xl p-5 border border-slate-800 space-y-2">
              <p className="text-xs text-slate-400 font-medium">Estimated Total Compensation Range:</p>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-numeric tracking-tight tabular-nums">
                £{minPenalty.toLocaleString()} – £{maxPenalty.toLocaleString()}
              </div>
              <p className="text-xs text-slate-400 pt-1">
                + Full return of your <span className="font-numeric font-bold text-white">£{depositAmount.toLocaleString()}</span> original deposit
              </p>
              {unlawfulDeduction > 0 && (
                <p className="text-xs text-emerald-400 font-numeric font-semibold">
                  + Recovery of £{unlawfulDeduction.toLocaleString()} disputed deductions
                </p>
              )}
            </div>

            {/* Breakdown itemization */}
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Original Deposit:</span>
                <span className="font-numeric font-bold text-white text-sm">£{depositAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Tenancy Terms Affected:</span>
                <span className="font-numeric font-bold text-white text-sm">{termsCount} term{termsCount > 1 ? 's' : ''}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Statutory Multiplier:</span>
                <span className="font-numeric font-bold text-blue-400 text-sm">1x to {maxMultiplier}x per term</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Max Gross Potential:</span>
                <span className="font-numeric font-black text-emerald-400 text-base">
                  £{totalMaxRecovery.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Legal reassurance card */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-700/60 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-300 leading-normal">
                Strict Court Liability: If the landlord breached the regulations, judges have no discretion to dismiss the penalty — they <span className="text-white font-semibold">must</span> award between 1x and 3x the deposit.
              </p>
            </div>

            {/* CTA to start quiz */}
            <button
              onClick={handleLaunchQuiz}
              className="w-full py-4 px-5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-base rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <span>Submit for Formal Solicitor Check</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <p className="text-[11px] text-center text-slate-400">
              100% Free Claim Evaluation · No Win No Fee Representation
            </p>

          </div>

        </div>

      </div>
    </section>
  );
};
