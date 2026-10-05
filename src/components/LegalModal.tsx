import React, { useState } from 'react';
import { X, ShieldCheck, Printer, FileText, Scale, Lock, AlertCircle } from 'lucide-react';
import { CmsContent } from '../types';

export type LegalDocType = 'privacy' | 'terms' | 'complaints' | 'cookies';

interface LegalModalProps {
  type: LegalDocType | null;
  onClose: () => void;
  cms: CmsContent;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose, cms }) => {
  if (!type) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden text-slate-100 my-6 flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">
                {type === 'privacy' && 'UK Privacy & Data Protection Policy'}
                {type === 'terms' && 'Terms of Service & Engagement'}
                {type === 'complaints' && 'Formal Complaints Handling Procedure'}
                {type === 'cookies' && 'Cookie Policy & Consent Notice'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {cms.siteName} · Governed by the Laws of England & Wales
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              title="Print document"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Close legal modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / Scrollable Legal Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
          
          {/* ================= PRIVACY POLICY ================= */}
          {type === 'privacy' && (
            <div className="space-y-5">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                <span className="font-bold text-blue-400 block">UK GDPR & Data Protection Act 2018 Compliance</span>
                <p>
                  Last Updated: October 2026. This Privacy Notice describes how {cms.siteName} ("we", "us", or "our") collects, uses, and shares your personal data when you access our claim evaluation website, submit inquiry forms, or engage our legal partners.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-base font-bold text-white">1. Data Controller Identity & Contact</h4>
                <p>
                  {cms.siteName} operates as an intake and claim evaluation portal in partnership with SRA-regulated solicitors in England & Wales. The Data Protection Officer can be contacted directly at <strong className="text-white">{cms.contactEmail}</strong> or via our registered office address at {cms.officeAddress}.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-base font-bold text-white">2. What Personal Data We Collect</h4>
                <p>We process the following categories of personal data strictly necessary to assess your deposit breach claim:</p>
                <ul className="list-disc list-inside space-y-1 pl-2 text-slate-300">
                  <li><strong>Identity & Contact Data:</strong> Full name, telephone number, residential address, current email address, and rental property postcode.</li>
                  <li><strong>Tenancy Data:</strong> Copy of Tenancy Agreement, monthly rent, deposit amount paid, dates of tenancy start and renewal, and landlord or letting agent details.</li>
                  <li><strong>Scheme Compliance Evidence:</strong> Official correspondence or lack thereof from DPS (Deposit Protection Service), TDS (Tenancy Deposit Scheme), and MyDeposits.</li>
                  <li><strong>Technical & Usage Data:</strong> IP address, device type, browser user-agent, and date/time stamps of inquiry submissions.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="text-base font-bold text-white">3. Lawful Basis for Processing</h4>
                <p>Under Article 6 of the UK GDPR, we rely on the following lawful bases:</p>
                <ul className="list-disc list-inside space-y-1 pl-2 text-slate-300">
                  <li><strong>Performance of a Contract:</strong> Taking necessary steps prior to entering into a Conditional Fee Agreement ("No Win No Fee") and assessing legal claim merits.</li>
                  <li><strong>Legitimate Interests:</strong> Verifying deposit scheme records, preventing fraudulent claims, and ensuring system security.</li>
                  <li><strong>Explicit Consent:</strong> Where you provide consent to receive updates or share your documents with panel solicitors.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="text-base font-bold text-white">4. Third-Party Disclosures</h4>
                <p>We do not sell personal data. Your data is shared strictly with:</p>
                <ul className="list-disc list-inside space-y-1 pl-2 text-slate-300">
                  <li>Our regulated legal partners and solicitors governed by the Solicitors Regulation Authority (SRA).</li>
                  <li>Authorized government deposit protection scheme registries (DPS, TDS, MyDeposits) solely for forensic registration checks.</li>
                  <li>Encrypted CRM cloud providers (Pipedrive) using AES-256 encrypted protocols.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="text-base font-bold text-white">5. Retention Period</h4>
                <p>
                  In accordance with the Limitation Act 1980 statutory period for claims founded on tort or statute, legal claim files are retained for 6 years following the conclusion of your matter, after which records are securely destroyed.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-base font-bold text-white">6. Your Statutory Rights</h4>
                <p>
                  You possess statutory rights to request access, rectification, erasure ("Right to be Forgotten"), or restriction of processing. If you are dissatisfied with our response, you have the right to lodge a complaint with the UK Information Commissioner's Office (ICO) at <span className="text-blue-400 font-mono">ico.org.uk</span>.
                </p>
              </div>
            </div>
          )}

          {/* ================= TERMS OF SERVICE ================= */}
          {type === 'terms' && (
            <div className="space-y-5">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                <span className="font-bold text-blue-400 block">Terms & Conditions of Service</span>
                <p>
                  Please review these Terms carefully before using our website or submitting a tenancy deposit compensation inquiry. By utilizing this website, you agree to be legally bound by these terms.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-base font-bold text-white">1. Nature of the Service</h4>
                <p>
                  {cms.siteName} is a legal claim assessment portal. The initial calculation and eligibility quiz provide indicative assessments based on Section 214 of the Housing Act 2004 and relevant Court of Appeal precedents (including <em className="text-white">Superstrike Ltd v Rodrigues</em>). Formal representation is subject to written Conditional Fee Agreements with SRA-regulated partner solicitors.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-base font-bold text-white">2. No Win, No Fee Terms (Conditional Fee Agreement)</h4>
                <p>
                  Where your claim is accepted on a No Win, No Fee basis:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-2 text-slate-300">
                  <li>You pay zero upfront fees, zero retainer costs, and zero out-of-pocket expenses.</li>
                  <li>If your claim is unsuccessful through no fault of your own (e.g., failure to cooperate), you pay nothing.</li>
                  <li>If compensation is recovered from your landlord, a pre-agreed success fee (detailed in your solicitor's client care pack) will be deducted from the awarded damages.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="text-base font-bold text-white">3. Accuracy of Information Supplied by Tenants</h4>
                <p>
                  You warrant that all information provided regarding your deposit amount, tenancy dates, and receipt of statutory documentation is accurate to the best of your knowledge. Knowingly submitting falsified tenancy documents is strictly prohibited.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-base font-bold text-white">4. Retaliation & Protection Against Eviction</h4>
                <p>
                  Under UK law (Deregulation Act 2015), landlords who have breached deposit protection rules cannot serve a valid Section 21 "no-fault" eviction notice unless the deposit has been returned in full or proceedings settled.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-base font-bold text-white">5. Governing Law & Jurisdiction</h4>
                <p>
                  These Terms of Service are governed by and construed in accordance with the laws of England and Wales. The courts of England and Wales have exclusive jurisdiction over any claim or dispute.
                </p>
              </div>
            </div>
          )}

          {/* ================= COMPLAINTS PROCEDURE ================= */}
          {type === 'complaints' && (
            <div className="space-y-5">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                <span className="font-bold text-blue-400 block">Solicitors Regulation Authority Compliant Complaints Protocol</span>
                <p>
                  We are committed to providing the highest quality legal claims service. However, if you are dissatisfied with any aspect of our service or your case handling, we operate a transparent, 3-tier complaints process.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-base font-bold text-white">Stage 1: Informal Resolution</h4>
                <p>
                  In the first instance, please contact your allocated Case Handler or email <strong className="text-white">{cms.contactEmail}</strong> with details of your concern. We resolve over 90% of queries informally within <strong>3 business days</strong>.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-base font-bold text-white">Stage 2: Formal Investigation by Complaints Director</h4>
                <p>
                  If your issue remains unresolved, you may request a formal Stage 2 review. Please write to:
                </p>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1">
                  <div><strong>The Complaints Director</strong>, {cms.siteName}</div>
                  <div>Address: {cms.officeAddress}</div>
                  <div>Email: <span className="text-blue-400">{cms.contactEmail}</span> (Subject: "Formal Complaint - Legal Review")</div>
                </div>
                <p className="pt-1">
                  We will formally acknowledge receipt of your complaint within <strong>48 hours</strong> and issue a comprehensive written final decision within <strong>14 business days</strong>.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-base font-bold text-white">Stage 3: Referral to the Legal Ombudsman (LeOD)</h4>
                <p>
                  If you remain dissatisfied after receiving our final response, or if 8 weeks have passed without resolution, you have the statutory right to refer your complaint to the independent Legal Ombudsman:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-2 text-slate-300">
                  <li><strong>Website:</strong> <span className="text-blue-400 font-mono">www.legalombudsman.org.uk</span></li>
                  <li><strong>Telephone:</strong> 0300 555 0333</li>
                  <li><strong>Post:</strong> Legal Ombudsman, PO Box 6806, Wolverhampton, WV1 9WJ</li>
                  <li><strong>Time Limit:</strong> Within 6 months of receiving our final written complaint response.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="text-base font-bold text-white">Solicitors Regulation Authority (SRA) Oversight</h4>
                <p>
                  If your complaint involves breaches of professional integrity or regulatory ethics, you may also report the matter directly to the Solicitors Regulation Authority at <span className="text-blue-400 font-mono">www.sra.org.uk/consumers/problems/report-solicitor</span>.
                </p>
              </div>
            </div>
          )}

          {/* ================= COOKIES POLICY ================= */}
          {type === 'cookies' && (
            <div className="space-y-5">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                <span className="font-bold text-blue-400 block">Cookie & Tracking Notice</span>
                <p>
                  This notice explains how {cms.siteName} uses cookies and similar technologies to ensure seamless calculator performance, save multi-step quiz state, and safeguard administrative logins.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-base font-bold text-white">1. What Are Cookies?</h4>
                <p>
                  Cookies are small text files placed on your browser or device when visiting web pages. They enable the portal to remember your selections and maintain secure session integrity.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-base font-bold text-white">2. Cookies We Utilize</h4>
                <div className="space-y-2">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <strong className="text-white block">Strictly Necessary & Functional Cookies:</strong>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Required for the multi-step eligibility quiz state, calculation preservation, CSRF token security, and admin 2FA verification sessions.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <strong className="text-white block">Performance & Anonymized Analytics:</strong>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Enables counting page views and quiz step completions to optimize claim processing speed. No individual profiling occurs.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-base font-bold text-white">3. How to Manage Cookies</h4>
                <p>
                  You can set your browser to reject all or some browser cookies, or to alert you when websites set or access cookies. Note that disabling essential cookies may impact the eligibility calculator's ability to save your claim figures.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>SRA & UK Legal Compliance Standard</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Acknowledge & Close
          </button>
        </div>

      </div>
    </div>
  );
};
