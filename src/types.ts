export interface Lead {
  id: string;
  source: 'quiz' | 'calculator' | 'inquiry_form';
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  postcode: string;
  depositAmount: number;
  tenancyDurationMonths?: number;
  renewalsCount: number;
  propertyLocation: 'england_wales' | 'scotland' | 'northern_ireland';
  paidWithinSixYears: boolean;
  protectedWithin30Days: 'yes' | 'no' | 'dont_know' | 'late';
  receivedPrescribedInfo: 'yes' | 'no' | 'dont_know';
  hasTenancyAgreement: 'yes' | 'no' | 'retrieving';
  tenancyStatus: 'current_tenant' | 'moved_out';
  estimatedCompensationMin: number;
  estimatedCompensationMax: number;
  status: 'new' | 'contacted' | 'in_review' | 'qualified' | 'closed';
  notes?: string;
  pipedriveSynced: boolean;
  pipedriveDealId?: string;
  ipAddress?: string;
  message?: string;
}

export interface CmsContent {
  siteName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  officeAddress: string;
  heroBadge: string;
  heroHeadline: string;
  heroSubtitle: string;
  ctaText: string;
  logoUrl?: string;
  faviconUrl?: string;
  stats: {
    claimsRecovered: string;
    successRate: string;
    averagePayout: string;
    clientRating: string;
  };
  services: Array<{
    id: string;
    title: string;
    tagline: string;
    description: string;
    statKicker: string;
  }>;
  faqs: Array<{
    id: string;
    question: string;
    answer: string;
  }>;
  legalDisclaimer: string;
}

export interface PipedriveConfig {
  encryptedToken?: string;
  tokenMasked: string;
  iv?: string;
  tag?: string;
  companyDomain: string;
  stageId: string;
  pipelineId: string;
  autoSync: boolean;
  lastTestedAt?: string;
  lastTestStatus?: 'success' | 'failed' | 'idle';
  lastTestMessage?: string;
}

export interface AnalyticsData {
  totalVisitors: number;
  quizStarts: number;
  quizCompletions: number;
  inquirySubmissions: number;
  qualifiedLeadsCount: number;
  totalClaimPipelineValue: number;
  conversionRate: number;
  dailyTrends: Array<{
    date: string;
    visitors: number;
    leads: number;
    pipelineValue: number;
  }>;
  breachTypes: {
    unprotected: number;
    lateProtected: number;
    noPrescribedInfo: number;
    multipleRenewals: number;
  };
  deviceBreakdown: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  mfaEnabled: boolean;
  mfaSecret?: string;
  backupCodes: string[];
}

export interface AuthSession {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    mfaEnabled: boolean;
  };
  expiresAt: string;
}
