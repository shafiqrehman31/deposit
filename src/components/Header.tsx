import React, { useState } from 'react';
import { ShieldCheck, Menu, X, PhoneCall, Scale } from 'lucide-react';
import { CmsContent } from '../types';

interface HeaderProps {
  cms: CmsContent;
  onOpenQuiz: () => void;
  onScrollTo: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ cms, onOpenQuiz, onScrollTo }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Zone 1: Single text element wordmark or clean logo */}
          <div className="flex items-center gap-3">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg py-1"
            >
              {cms.logoUrl ? (
                <img
                  src={cms.logoUrl}
                  alt={cms.siteName}
                  className="h-9 w-auto max-w-[180px] object-contain"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-900/40">
                    <Scale className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold tracking-tight text-white font-display">
                    {cms.siteName}
                  </span>
                </div>
              )}
            </a>
          </div>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <button
              onClick={() => onScrollTo('calculator')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Deposit Calculator
            </button>
            <button
              onClick={() => onScrollTo('services')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Our Services
            </button>
            <button
              onClick={() => onScrollTo('how-it-works')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => onScrollTo('faqs')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              FAQs
            </button>
            <button
              onClick={() => onScrollTo('contact')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Contact
            </button>
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="hidden sm:flex items-center gap-4">
            <a
              href={`tel:${cms.contactPhone}`}
              className="hidden lg:flex items-center gap-2 text-xs text-slate-300 hover:text-white transition-colors font-medium"
            >
              <PhoneCall className="w-3.5 h-3.5 text-blue-400" />
              <span>{cms.contactPhone}</span>
            </a>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onOpenQuiz();
              }}
              className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm shadow-blue-900/30 transition-all hover:shadow-md cursor-pointer whitespace-nowrap active:scale-[0.98]"
            >
              <ShieldCheck className="w-4 h-4 mr-2" />
              Check Eligibility
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onOpenQuiz();
              }}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-md"
            >
              Check Claim
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-900 px-4 pt-3 pb-6 space-y-3">
          <button
            onClick={() => {
              onScrollTo('calculator');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-slate-200 hover:text-white"
          >
            Deposit Calculator
          </button>
          <button
            onClick={() => {
              onScrollTo('services');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-slate-200 hover:text-white"
          >
            Our Services
          </button>
          <button
            onClick={() => {
              onScrollTo('how-it-works');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-slate-200 hover:text-white"
          >
            How It Works
          </button>
          <button
            onClick={() => {
              onScrollTo('faqs');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-slate-200 hover:text-white"
          >
            FAQs
          </button>
          <button
            onClick={() => {
              onScrollTo('contact');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-slate-200 hover:text-white"
          >
            Contact
          </button>
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Freephone Advice</span>
            <a href={`tel:${cms.contactPhone}`} className="text-blue-400 font-semibold">
              {cms.contactPhone}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
