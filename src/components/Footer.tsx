import React from 'react';
import { Scale, ShieldCheck, FileText, Lock, BookOpen } from 'lucide-react';
import { CmsContent } from '../types';
import { LegalDocType } from './LegalModal';

interface FooterProps {
  cms: CmsContent;
  onScrollTo: (id: string) => void;
  onOpenQuiz: () => void;
  onOpenLegal: (type: LegalDocType) => void;
}

export const Footer: React.FC<FooterProps> = ({ cms, onScrollTo, onOpenQuiz, onOpenLegal }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 text-xs relative overflow-hidden">
      {/* Background Architectural Backdrop Image */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/src/assets/images/hero_london_residential_backdrop_1790957970822.jpg"
          alt="London residential architecture backdrop"
          className="w-full h-full object-cover object-bottom filter brightness-[0.60] contrast-[1.05]"
          referrerPolicy="no-referrer"
        />
        {/* Translucent overlay */}
        <div className="absolute inset-0 bg-slate-950/85" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          
          {/* Brand & Mission (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Scale className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white font-display">
                {cms.siteName}
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Specialist tenancy deposit compensation claims portal helping UK tenants recover up to 3x statutory compensation for unprotected, late, or non-compliant tenancy deposits under the Housing Act 2004.
            </p>

            <div className="flex items-center gap-2 text-slate-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Solicitor Regulated Standards · England & Wales</span>
            </div>
          </div>

          {/* Quick Links (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <div className="font-semibold text-white uppercase tracking-wider text-[11px]">
              Services & Tools
            </div>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onScrollTo('calculator')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Deposit Compensation Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenQuiz}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  60-Second Eligibility Quiz
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('services')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Unprotected Deposit Breaches
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('services')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Late Protection Claims
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('services')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Superstrike Renewal Multipliers
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Pages Column (2 cols) */}
          <div className="md:col-span-2 space-y-3">
            <div className="font-semibold text-white uppercase tracking-wider text-[11px]">
              Legal & Compliance
            </div>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onOpenLegal('privacy')}
                  className="hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <Lock className="w-3 h-3 text-blue-400" />
                  <span>Privacy Policy</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('terms')}
                  className="hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <FileText className="w-3 h-3 text-blue-400" />
                  <span>Terms of Service</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('complaints')}
                  className="hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <BookOpen className="w-3 h-3 text-blue-400" />
                  <span>Complaints Procedure</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('cookies')}
                  className="hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3 h-3 text-blue-400" />
                  <span>Cookie Policy</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <div className="font-semibold text-white uppercase tracking-wider text-[11px]">
              Direct Contact
            </div>
            <p className="text-xs text-slate-300">
              Freephone Tenant Advice: <a href={`tel:${cms.contactPhone}`} className="text-blue-400 font-bold hover:underline">{cms.contactPhone}</a>
            </p>
            <p className="text-xs text-slate-300">
              Email: <a href={`mailto:${cms.contactEmail}`} className="text-blue-400 hover:underline">{cms.contactEmail}</a>
            </p>
            <p className="text-xs text-slate-400">
              Office: {cms.officeAddress}
            </p>
          </div>

        </div>

        {/* Regulatory disclaimer */}
        <div className="pt-8 border-t border-slate-900 text-[11px] text-slate-500 space-y-3">
          <p className="leading-relaxed">
            {cms.legalDisclaimer}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div>
              © {new Date().getFullYear()} {cms.siteName}. All rights reserved. Registered in England & Wales.
            </div>
            <div className="flex flex-wrap items-center gap-4 text-slate-400">
              <button
                onClick={() => onOpenLegal('privacy')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Privacy Policy
              </button>
              <span aria-hidden="true">·</span>
              <button
                onClick={() => onOpenLegal('terms')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Terms of Service
              </button>
              <span aria-hidden="true">·</span>
              <button
                onClick={() => onOpenLegal('complaints')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Complaints Procedure
              </button>
              <span aria-hidden="true">·</span>
              <button
                onClick={() => onOpenLegal('cookies')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Cookie Notice
              </button>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

