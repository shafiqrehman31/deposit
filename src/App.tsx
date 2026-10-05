import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { DepositCalculator } from './components/DepositCalculator';
import { ServicesOverview } from './components/ServicesOverview';
import { HowItWorks } from './components/HowItWorks';
import { InquiryForm } from './components/InquiryForm';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { EligibilityQuiz } from './components/EligibilityQuiz';
import { LegalModal, LegalDocType } from './components/LegalModal';

// Admin Components
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminLayout } from './components/admin/AdminLayout';
import { LeadsManager } from './components/admin/LeadsManager';
import { AnalyticsView } from './components/admin/AnalyticsView';
import { CmsEditor } from './components/admin/CmsEditor';
import { CrmSettings } from './components/admin/CrmSettings';
import { SecuritySettings } from './components/admin/SecuritySettings';

import { CmsContent, Lead } from './types';
import { getCms, getLeads, verifyCurrentAuth } from './services/api';

export default function App() {
  // Navigation / Route state
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '');
    const path = window.location.pathname;
    if (hash.startsWith('/admin') || hash === 'admin') return '/admin';
    if (path.startsWith('/admin')) return '/admin';
    return '/';
  });

  // CMS content state
  const [cms, setCms] = useState<CmsContent | null>(null);
  const [cmsLoading, setCmsLoading] = useState(true);

  // Quiz Modal state
  const [quizOpen, setQuizOpen] = useState(false);
  const [initialQuizDeposit, setInitialQuizDeposit] = useState<number>(1250);
  const [initialQuizRenewals, setInitialQuizRenewals] = useState<number>(1);
  const [initialQuizBreach, setInitialQuizBreach] = useState<string>('no');

  // Legal Modal state
  const [legalModalType, setLegalModalType] = useState<LegalDocType | null>(null);

  // Admin state
  const [adminUser, setAdminUser] = useState<any>(null);
  const [adminTab, setAdminTab] = useState<'leads' | 'analytics' | 'cms' | 'crm' | 'security'>('leads');
  const [adminLeads, setAdminLeads] = useState<Lead[]>([]);
  const [newLeadsCount, setNewLeadsCount] = useState<number>(0);

  // Listen to hash / url changes
  useEffect(() => {
    const handleUrlChange = () => {
      const hash = window.location.hash.replace('#', '');
      const path = window.location.pathname;
      if (hash.startsWith('/admin') || hash === 'admin' || path.startsWith('/admin')) {
        setCurrentPath('/admin');
      } else {
        setCurrentPath('/');
      }
    };

    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  // Fetch initial CMS content
  const loadCmsData = async () => {
    try {
      const data = await getCms();
      setCms(data);
    } catch (err) {
      console.error('Error fetching CMS:', err);
    } finally {
      setCmsLoading(false);
    }
  };

  useEffect(() => {
    loadCmsData();
  }, []);

  // Check auth if on admin route
  useEffect(() => {
    if (currentPath === '/admin') {
      verifyCurrentAuth().then((res) => {
        if (res && res.user) {
          setAdminUser(res.user);
          loadAdminLeads();
        } else {
          setAdminUser(null);
        }
      });
    }
  }, [currentPath]);

  const loadAdminLeads = async () => {
    try {
      const leads = await getLeads();
      setAdminLeads(leads);
      const unread = leads.filter((l) => l.status === 'new').length;
      setNewLeadsCount(unread);
    } catch (err) {
      console.error('Error loading leads:', err);
    }
  };

  const handleStartQuiz = (deposit?: number) => {
    if (deposit) setInitialQuizDeposit(deposit);
    setQuizOpen(true);
  };

  const handleStartQuizWithData = (data: { deposit: number; renewals: number; breachType: string }) => {
    setInitialQuizDeposit(data.deposit);
    setInitialQuizRenewals(data.renewals);
    setInitialQuizBreach(data.breachType);
    setQuizOpen(true);
  };

  const handleScrollTo = (id: string) => {
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navigateToAdmin = () => {
    window.location.hash = '/admin';
    setCurrentPath('/admin');
  };

  const navigateToHome = () => {
    window.location.hash = '';
    setCurrentPath('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If loading CMS initially
  if (cmsLoading || !cms) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono">Initializing Deposit Hero...</span>
        </div>
      </div>
    );
  }

  // --- ADMIN PORTAL ROUTE ---
  if (currentPath === '/admin') {
    if (!adminUser) {
      return (
        <AdminLogin
          onLoginSuccess={(user) => {
            setAdminUser(user);
            loadAdminLeads();
          }}
          onNavigateHome={navigateToHome}
        />
      );
    }

    return (
      <AdminLayout
        activeTab={adminTab}
        onSelectTab={setAdminTab}
        onLogout={() => {
          setAdminUser(null);
          navigateToHome();
        }}
        onViewPublicSite={navigateToHome}
        newLeadsCount={newLeadsCount}
        onNewLeadReceived={(lead) => {
          setAdminLeads((prev) => [lead, ...prev]);
          setNewLeadsCount((prev) => prev + 1);
        }}
      >
        {adminTab === 'leads' && (
          <LeadsManager
            leads={adminLeads}
            onRefresh={loadAdminLeads}
          />
        )}

        {adminTab === 'analytics' && <AnalyticsView />}

        {adminTab === 'cms' && (
          <CmsEditor
            cms={cms}
            onCmsUpdated={(updated) => setCms(updated)}
          />
        )}

        {adminTab === 'crm' && <CrmSettings />}

        {adminTab === 'security' && <SecuritySettings />}
      </AdminLayout>
    );
  }

  // --- PUBLIC CLIENT WEBSITE ROUTE ---
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Public Header following Top Bar Contract (No admin link) */}
      <Header
        cms={cms}
        onOpenQuiz={() => handleStartQuiz()}
        onScrollTo={handleScrollTo}
      />

      {/* Hero Section with Value Proposition & Quick Estimator */}
      <Hero
        cms={cms}
        onStartQuiz={handleStartQuiz}
        onScrollTo={handleScrollTo}
      />

      {/* Interactive Tenancy Deposit Calculator */}
      <DepositCalculator
        onStartQuizWithData={handleStartQuizWithData}
      />

      {/* Core Legal Services Bento Grid */}
      <ServicesOverview
        cms={cms}
        onOpenQuiz={() => handleStartQuiz()}
      />

      {/* 4-Step Claim Process Mechanism */}
      <HowItWorks
        onOpenQuiz={() => handleStartQuiz()}
      />

      {/* Integrated Contact & Case Review Inquiry Form */}
      <InquiryForm
        cms={cms}
        onSuccessSubmitted={loadAdminLeads}
      />

      {/* FAQs Section */}
      <FaqSection
        cms={cms}
      />

      {/* Quiet Legal Footer with SRA Disclaimer (No admin link) */}
      <Footer
        cms={cms}
        onScrollTo={handleScrollTo}
        onOpenQuiz={() => handleStartQuiz()}
        onOpenLegal={(type) => setLegalModalType(type)}
      />

      {/* Multi-Step Eligibility Quiz Modal */}
      <EligibilityQuiz
        isOpen={quizOpen}
        onClose={() => setQuizOpen(false)}
        initialDeposit={initialQuizDeposit}
        initialRenewals={initialQuizRenewals}
        initialBreach={initialQuizBreach}
        onSuccessSubmitted={loadAdminLeads}
      />

      {/* Legal Pages Modal (Privacy, Terms, Complaints, Cookies) */}
      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
        cms={cms}
      />

    </div>
  );
}
