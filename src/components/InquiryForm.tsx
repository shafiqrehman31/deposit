import React, { useState } from 'react';
import { Send, CheckCircle2, Phone, Mail, MapPin, ShieldCheck, Scale } from 'lucide-react';
import { CmsContent } from '../types';
import { submitLead } from '../services/api';

interface InquiryFormProps {
  cms: CmsContent;
  onSuccessSubmitted?: () => void;
}

export const InquiryForm: React.FC<InquiryFormProps> = ({ cms, onSuccessSubmitted }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [postcode, setPostcode] = useState('');
  const [depositAmount, setDepositAmount] = useState<number | ''>(1200);
  const [protectionStatus, setProtectionStatus] = useState<'no' | 'late' | 'dont_know'>('no');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedLeadId, setSubmittedLeadId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim() || !email.trim() || !phone.trim() || !postcode.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const deposit = Number(depositAmount) || 1000;
      const res = await submitLead({
        source: 'inquiry_form',
        name,
        email,
        phone,
        postcode,
        depositAmount: deposit,
        protectedWithin30Days: protectionStatus,
        propertyLocation: 'england_wales',
        message: message.trim() || 'General claim inquiry submitted',
        renewalsCount: 0,
        paidWithinSixYears: true,
        receivedPrescribedInfo: 'no',
        hasTenancyAgreement: 'yes',
        tenancyStatus: 'moved_out',
        estimatedCompensationMin: deposit * 1,
        estimatedCompensationMax: deposit * (protectionStatus === 'no' ? 3 : 2),
      });

      setSubmittedLeadId(res.leadId);
      if (onSuccessSubmitted) onSuccessSubmitted();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error submitting inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-slate-950 text-slate-100 relative overflow-hidden">
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
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Contact info & reassurance */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                Direct Legal Assistance
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight text-balance">
                Request a Solicitor Case Review
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Have specific questions regarding your tenancy agreement, unlawful deposit deductions, or landlord dispute? Send our legal specialists a direct inquiry for priority review.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-800 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-900/40 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Tenant Advice Line:</div>
                  <a href={`tel:${cms.contactPhone}`} className="font-bold text-white hover:text-blue-400 transition-colors">
                    {cms.contactPhone}
                  </a>
                  <div className="text-[11px] text-slate-400">Monday - Friday, 9:00am - 6:00pm</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-900/40 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Direct Case Inquiries:</div>
                  <a href={`mailto:${cms.contactEmail}`} className="font-bold text-white hover:text-blue-400 transition-colors">
                    {cms.contactEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-900/40 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">London Consultation Office:</div>
                  <div className="text-slate-200">{cms.officeAddress}</div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Confidentiality & SRA Standards</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                All communications are confidential and protected by legal professional privilege. Your landlord is not notified until you formally instruct our partner solicitors.
              </p>
            </div>
          </div>

          {/* Right Column: Integrated Form */}
          <div className="lg:col-span-7 bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl">
            {submittedLeadId ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white">Inquiry Received Successfully</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Thank you for getting in touch. Your inquiry has been routed to our tenancy disputes desk under reference <strong className="text-white font-mono">#{submittedLeadId}</strong>. A case handler will review your file and respond shortly.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedLeadId(null);
                      setMessage('');
                    }}
                    className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-semibold"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-lg font-bold text-white">Direct Case Review Form</h3>
                  <p className="text-xs text-slate-400">Complete the form below for a free claim assessment.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rachel Adams"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="rachel@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Mobile Telephone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="07700 900000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Rented Property Postcode *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. NW1 6XE"
                      value={postcode}
                      onChange={(e) => setPostcode(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 uppercase"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Deposit Amount Paid (£)
                    </label>
                    <input
                      type="number"
                      min="100"
                      step="50"
                      placeholder="1200"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Deposit Protection Status
                    </label>
                    <select
                      value={protectionStatus}
                      onChange={(e) => setProtectionStatus(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="no">Never Protected in Scheme (3x)</option>
                      <option value="late">Protected Late after 30 days (1x-3x)</option>
                      <option value="dont_know">I don't know / Not sure</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Details of your tenancy or dispute (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about tenancy start date, landlord name, whether deductions were made, or any other notes..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {errorMsg && (
                  <div className="p-3 bg-red-950/60 border border-red-800 rounded-lg text-xs text-red-300">
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <span>Submitting Inquiry...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Confidential Case Inquiry</span>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-center text-slate-400">
                  By submitting, you agree to our terms. We will never share your personal data with your landlord without consent.
                </p>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
