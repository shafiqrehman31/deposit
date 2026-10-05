import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, AlertTriangle, ArrowRight, ArrowLeft, 
  HelpCircle, ShieldCheck, Lock, Sparkles, Building2, Calendar, 
  FileText, Check, Phone, Mail, User, MapPin
} from 'lucide-react';
import { submitLead, trackQuizStart } from '../services/api';

interface EligibilityQuizProps {
  isOpen: boolean;
  onClose: () => void;
  initialDeposit?: number;
  initialRenewals?: number;
  initialBreach?: string;
  onSuccessSubmitted?: () => void;
}

export const EligibilityQuiz: React.FC<EligibilityQuizProps> = ({
  isOpen,
  onClose,
  initialDeposit,
  initialRenewals,
  initialBreach,
  onSuccessSubmitted,
}) => {
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedLeadId, setSubmittedLeadId] = useState<string | null>(null);

  // Form states
  const [location, setLocation] = useState<'england_wales' | 'scotland_ni'>('england_wales');
  const [withinSixYears, setWithinSixYears] = useState<boolean>(true);
  const [depositAmount, setDepositAmount] = useState<number>(initialDeposit || 1250);
  const [protectionStatus, setProtectionStatus] = useState<'no' | 'late' | 'dont_know' | 'yes'>(
    (initialBreach as any) || 'no'
  );
  const [prescribedInfo, setPrescribedInfo] = useState<'no' | 'dont_know' | 'yes'>('no');
  const [hasAgreement, setHasAgreement] = useState<'yes' | 'no' | 'retrieving'>('yes');
  const [tenancyStatus, setTenancyStatus] = useState<'moved_out' | 'current_tenant'>('moved_out');
  const [renewals, setRenewals] = useState<number>(initialRenewals ?? 1);

  // Contact details
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [postcode, setPostcode] = useState<string>('');
  const [consent, setConsent] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSubmittedLeadId(null);
      setErrorMsg(null);
      trackQuizStart();
      if (typeof initialDeposit === 'number' && initialDeposit > 0) {
        setDepositAmount(initialDeposit);
      }
      if (typeof initialRenewals === 'number') {
        setRenewals(initialRenewals);
      }
      if (initialBreach) {
        setProtectionStatus(initialBreach as any);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Safe numerical calculations ensuring no undefined or NaN values
  const safeDeposit = typeof depositAmount === 'number' && !isNaN(depositAmount) && depositAmount > 0 ? depositAmount : 1250;
  const termsCount = 1 + (typeof renewals === 'number' && !isNaN(renewals) ? renewals : 0);
  const multiplier = protectionStatus === 'no' ? 3 : protectionStatus === 'late' ? 2 : prescribedInfo === 'no' ? 2 : 1;
  const estimatedMin = Math.round(safeDeposit * 1 * termsCount);
  const estimatedMax = Math.round(safeDeposit * multiplier * termsCount);

  // Check if disqualified by location or limitation
  const isDisqualified = location === 'scotland_ni' || !withinSixYears;

  const handleNextStep = () => {
    setErrorMsg(null);
    if (step === 3 && (safeDeposit < 100 || isNaN(safeDeposit))) {
      setErrorMsg('Please enter a valid deposit amount (at least £100).');
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setErrorMsg(null);
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmitFinal = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim() || !email.trim() || !phone.trim() || !postcode.trim()) {
      setErrorMsg('Please complete all contact details to receive your formal claim pack.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitLead({
        source: 'quiz',
        name: fullName,
        email,
        phone,
        postcode,
        depositAmount: safeDeposit,
        renewalsCount: renewals,
        propertyLocation: location === 'england_wales' ? 'england_wales' : 'scotland',
        paidWithinSixYears: withinSixYears,
        protectedWithin30Days: protectionStatus,
        receivedPrescribedInfo: prescribedInfo,
        hasTenancyAgreement: hasAgreement,
        tenancyStatus,
        estimatedCompensationMin: estimatedMin,
        estimatedCompensationMax: estimatedMax,
      });

      setSubmittedLeadId(res.leadId);
      if (onSuccessSubmitted) onSuccessSubmitted();
    } catch (err: any) {
      setErrorMsg(err.message || 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalSteps = 8;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Progress Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-bold text-white tracking-tight">
              Deposit Hero Claim Eligibility Checker
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors text-sm font-semibold"
          >
            ✕
          </button>
        </div>

        {/* Step Indicator Bar */}
        {!submittedLeadId && (
          <div className="w-full bg-slate-800 h-1.5">
            <div
              className="bg-blue-600 h-1.5 transition-all duration-300 ease-out"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 sm:p-8">

          {/* Success Screen */}
          {submittedLeadId ? (
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                  Claim Reference Generated
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                  Your Claim File is Open!
                </h3>
                <p className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg inline-block border border-slate-800">
                  Reference: #{submittedLeadId}
                </p>
              </div>

              {/* Valuation Banner */}
              <div className="bg-slate-950/90 rounded-2xl p-6 border border-slate-800 text-left max-w-md mx-auto space-y-3">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>Assessed Deposit:</span>
                  <span className="font-numeric text-white font-bold text-sm">£{depositAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>Statutory Penalty Range:</span>
                  <span className="font-numeric text-emerald-400 font-bold text-sm">
                    £{estimatedMin.toLocaleString()} – £{estimatedMax.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>Representation:</span>
                  <span className="text-blue-400 font-semibold">100% No Win, No Fee</span>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-300 max-w-md mx-auto text-left bg-blue-950/30 border border-blue-900/50 p-4 rounded-xl">
                <div className="font-semibold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span>Next Steps by Our Specialist Legal Team:</span>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-300 pl-1">
                  <li>Government scheme search initiated (DPS, TDS, MyDeposits).</li>
                  <li>A dedicated tenancy claims solicitor will review your file.</li>
                  <li>We will contact you at <strong className="text-white">{phone}</strong> or <strong className="text-white">{email}</strong> with your formal assessment.</li>
                </ol>
              </div>

              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors cursor-pointer text-sm"
                >
                  Return to Website
                </button>
              </div>
            </div>
          ) : isDisqualified ? (
            /* Disqualified Screen */
            <div className="py-6 space-y-5 text-center">
              <div className="w-14 h-14 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white">
                Unfortunately, We Cannot Assist With This Claim
              </h3>
              <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                {location === 'scotland_ni'
                  ? 'Our service is strictly governed by the Housing Act 2004, which only applies to tenancies located in England and Wales. Tenancies in Scotland and Northern Ireland fall under different legal jurisdictions.'
                  : 'Under the UK Limitation Act 1980, legal claims for tenancy deposit breaches must be initiated within 6 years of the deposit payment date.'}
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={() => {
                    setLocation('england_wales');
                    setWithinSixYears(true);
                    setStep(1);
                  }}
                  className="px-4 py-2.5 bg-slate-800 text-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-700"
                >
                  Change Answers
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-500"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* Active Step Content */
            <div className="space-y-6">

              {/* Step counter */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Step {step} of {totalSteps}</span>
                <span className="font-semibold text-blue-400">
                  {step <= 7 ? 'Eligibility Verification' : 'Formal Assessment Request'}
                </span>
              </div>

              {/* STEP 1: Property Location */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white">
                      Where was your rented property located?
                    </h3>
                    <p className="text-xs text-slate-400">
                      Tenancy deposit compensation laws under the Housing Act 2004 apply to England & Wales.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setLocation('england_wales');
                        handleNextStep();
                      }}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        location === 'england_wales'
                          ? 'bg-blue-600/20 border-blue-500 text-white shadow-md'
                          : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-base">England or Wales</span>
                        <CheckCircle2 className="w-5 h-5 text-blue-400" />
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        London, Manchester, Birmingham, Cardiff, etc.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setLocation('scotland_ni');
                      }}
                      className="p-4 rounded-xl border border-slate-700 bg-slate-800/60 text-slate-300 text-left hover:bg-slate-800 cursor-pointer"
                    >
                      <div className="font-bold text-base">Scotland or N. Ireland</div>
                      <p className="text-xs text-slate-400 mt-1">
                        Edinburgh, Glasgow, Belfast, etc.
                      </p>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Tenancy Timeline */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white">
                      Did you pay the deposit within the last 6 years?
                    </h3>
                    <p className="text-xs text-slate-400">
                      Under the UK Limitation Act 1980, you have up to 6 years from when the deposit should have been protected to claim.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setWithinSixYears(true);
                        handleNextStep();
                      }}
                      className="p-4 rounded-xl border border-blue-500 bg-blue-600/20 text-white text-left cursor-pointer hover:bg-blue-600/30 transition-all"
                    >
                      <div className="font-bold text-base">Yes, within last 6 years</div>
                      <p className="text-xs text-slate-300 mt-1">
                        Between 2020 and today (or tenancy started recently)
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setWithinSixYears(false)}
                      className="p-4 rounded-xl border border-slate-700 bg-slate-800/60 text-slate-300 text-left hover:bg-slate-800 cursor-pointer"
                    >
                      <div className="font-bold text-base">No, more than 6 years ago</div>
                      <p className="text-xs text-slate-400 mt-1">
                        Deposit paid prior to 2020
                      </p>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Deposit Amount */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white">
                      How much deposit did you pay?
                    </h3>
                    <p className="text-xs text-slate-400">
                      Enter the total security deposit amount paid to your landlord or letting agency.
                    </p>
                  </div>

                  <div className="pt-2">
                    <div className="flex items-center gap-3 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3">
                      <span className="text-2xl font-bold text-slate-400 font-mono">£</span>
                      <input
                        type="number"
                        min="100"
                        max="20000"
                        step="50"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(Number(e.target.value))}
                        className="w-full bg-transparent text-2xl font-bold text-white font-mono focus:outline-none"
                        placeholder="1200"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {[800, 1200, 1500, 2000, 2500].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setDepositAmount(val)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                          depositAmount === val
                            ? 'bg-blue-600 border-blue-500 text-white'
                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        £{val.toLocaleString()}
                      </button>
                    ))}
                  </div>

                  <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800 text-xs text-slate-400">
                    💡 If you lived in a flatshare, enter your individual share or the total household deposit if claiming on behalf of lead tenants.
                  </div>
                </div>
              )}

              {/* STEP 4: Protection Status within 30 days */}
              {step === 4 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white">
                      Was your deposit protected within 30 days?
                    </h3>
                    <p className="text-xs text-slate-400">
                      Landlords are strictly mandated by law to place funds into DPS, TDS, or MyDeposits within 30 days.
                    </p>
                  </div>

                  <div className="space-y-2 pt-1">
                    {[
                      {
                        key: 'no',
                        title: 'No, it was never protected',
                        desc: 'The landlord kept the deposit in their personal or business account.',
                        tag: 'High Compensation (3x)',
                      },
                      {
                        key: 'late',
                        title: 'Protected LATE (after 30 days)',
                        desc: 'The landlord only registered it weeks or months later.',
                        tag: 'Statutory Breach (1x-3x)',
                      },
                      {
                        key: 'dont_know',
                        title: "I'm not sure / I never received proof",
                        desc: 'We can check all 3 government schemes on your behalf.',
                        tag: 'Scheme Search Included',
                      },
                      {
                        key: 'yes',
                        title: 'Yes, protected on time',
                        desc: 'I received the scheme deposit certificate within 30 days.',
                        tag: 'May still have Prescribed Info claim',
                      },
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => {
                          setProtectionStatus(opt.key as any);
                          handleNextStep();
                        }}
                        className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          protectionStatus === opt.key
                            ? 'bg-blue-600/20 border-blue-500 text-white'
                            : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-sm text-white">{opt.title}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{opt.desc}</div>
                        </div>
                        <span className="text-[10px] font-mono text-blue-400 shrink-0 ml-2">
                          {opt.tag}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 5: Prescribed Information Pack */}
              {step === 5 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white">
                      Did you receive the official "Prescribed Information" pack?
                    </h3>
                    <p className="text-xs text-slate-400">
                      The law requires landlords to supply a formal prescribed pack signed by them detailing the scheme dispute rules, contact info, and terms.
                    </p>
                  </div>

                  <div className="space-y-2 pt-1">
                    {[
                      {
                        key: 'no',
                        title: 'No, I never received the official paperwork',
                        desc: 'Even if protected, omission of this pack entitles you to 1x to 3x compensation.',
                      },
                      {
                        key: 'dont_know',
                        title: 'I do not recall or do not have it',
                        desc: 'Our legal solicitors can audit your landlord’s compliance records.',
                      },
                      {
                        key: 'yes',
                        title: 'Yes, I received the full pack and signed it',
                        desc: 'The landlord provided all statutory documentation on time.',
                      },
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => {
                          setPrescribedInfo(opt.key as any);
                          handleNextStep();
                        }}
                        className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer ${
                          prescribedInfo === opt.key
                            ? 'bg-blue-600/20 border-blue-500 text-white'
                            : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="font-bold text-sm text-white">{opt.title}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 6: Tenancy Agreement & Renewals */}
              {step === 6 && (
                <div className="space-y-5">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white">
                      Tenancy Agreement & Renewals
                    </h3>
                    <p className="text-xs text-slate-400">
                      Each renewal counts as a separate statutory penalty under Court of Appeal case law.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-slate-300 block">
                      How many times did your tenancy renew or roll over?
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[0, 1, 2, 3].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setRenewals(num)}
                          className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                            renewals === num
                              ? 'bg-blue-600 border-blue-500 text-white'
                              : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {num === 0 ? 'None' : num === 3 ? '3+ Times' : `${num} Time${num > 1 ? 's' : ''}`}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <label className="text-xs font-semibold text-slate-300 block">
                      Do you have a copy of your tenancy agreement?
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { key: 'yes', label: 'Yes, I have it' },
                        { key: 'retrieving', label: 'In my emails' },
                        { key: 'no', label: 'No, need help' },
                      ].map((item) => (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => setHasAgreement(item.key as any)}
                          className={`py-2 px-2 text-center text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                            hasAgreement === item.key
                              ? 'bg-blue-600 border-blue-500 text-white'
                              : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 7: Tenancy Status */}
              {step === 7 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white">
                      What is your current tenancy status?
                    </h3>
                    <p className="text-xs text-slate-400">
                      Both current and former tenants have full legal rights to claim.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setTenancyStatus('moved_out');
                        handleNextStep();
                      }}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        tenancyStatus === 'moved_out'
                          ? 'bg-blue-600/20 border-blue-500 text-white'
                          : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="font-bold text-base">I have moved out</div>
                      <p className="text-xs text-slate-400 mt-1">
                        Completed tenancy within the last 6 years
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setTenancyStatus('current_tenant');
                        handleNextStep();
                      }}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        tenancyStatus === 'current_tenant'
                          ? 'bg-blue-600/20 border-blue-500 text-white'
                          : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="font-bold text-base">Still living at property</div>
                      <p className="text-xs text-slate-400 mt-1">
                        Protected against unlawful retaliatory eviction
                      </p>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 8: Qualification Verdict + Contact Capture */}
              {step === 8 && (
                <form onSubmit={handleSubmitFinal} className="space-y-5">
                  {/* Verdict Card */}
                  <div className="bg-slate-950 rounded-2xl p-4 sm:p-5 border border-emerald-500/40 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                      <Sparkles className="w-4 h-4" />
                      <span>Claim Assessment: Highly Viable</span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-slate-400">Estimated Statutory Penalty:</span>
                      <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-numeric tracking-tight tabular-nums">
                        £{estimatedMin.toLocaleString()} – £{estimatedMax.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                      Based on <span className="font-numeric font-bold text-slate-200">£{depositAmount.toLocaleString()}</span> deposit with {termsCount} term(s) under Housing Act 2004 s.214.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-base font-bold text-white">
                      Where should our legal team send your formal claim report?
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-300 font-medium block mb-1">
                          Full Name *
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                          <input
                            type="text"
                            required
                            placeholder="e.g. Alex Morgan"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-slate-300 font-medium block mb-1">
                          Email Address *
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                          <input
                            type="email"
                            required
                            placeholder="alex@example.co.uk"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-slate-300 font-medium block mb-1">
                          UK Phone Number *
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                          <input
                            type="tel"
                            required
                            placeholder="07123 456789"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-slate-300 font-medium block mb-1">
                          Rented Property Postcode *
                        </label>
                        <div className="relative">
                          <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                          <input
                            type="text"
                            required
                            placeholder="e.g. SW11 4NU"
                            value={postcode}
                            onChange={(e) => setPostcode(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 uppercase"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Consent checkbox */}
                    <label className="flex items-start gap-2.5 pt-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded border-slate-700 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-[11px] text-slate-400 leading-normal">
                        I confirm the information provided is accurate and consent to Deposit Hero's regulated legal partners conducting free tenancy deposit scheme searches on my behalf under a No Win, No Fee agreement.
                      </span>
                    </label>
                  </div>

                  {errorMsg && (
                    <div className="p-3 bg-red-950/60 border border-red-800 rounded-lg text-xs text-red-300">
                      {errorMsg}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !consent}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>Running Scheme Verification...</span>
                    ) : (
                      <>
                        <span>Submit Claim for Immediate Legal Review</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Navigation Controls */}
              {step < 8 && (
                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Previous</span>
                    </button>
                  ) : <div />}

                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
