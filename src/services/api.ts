import { Lead, CmsContent, PipedriveConfig, AnalyticsData } from '../types';

const TOKEN_KEY = 'deposithero_admin_token';

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function authHeaders(): Record<string, string> {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// 1. CMS API
export async function getCms(): Promise<CmsContent> {
  try {
    const res = await fetch('/api/cms');
    if (!res.ok) throw new Error('Failed to load CMS data');
    const data = await res.json();
    return data.cms;
  } catch (err) {
    console.error('Failed to get CMS:', err);
    throw err;
  }
}

export async function updateCms(content: Partial<CmsContent>): Promise<CmsContent> {
  const res = await fetch('/api/cms', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify(content),
  });
  if (!res.ok) throw new Error('Failed to update CMS');
  const data = await res.json();
  return data.cms;
}

export async function uploadAsset(type: 'logo' | 'favicon', dataUrl: string): Promise<string> {
  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify({ type, dataUrl }),
  });
  if (!res.ok) throw new Error(`Failed to upload ${type}`);
  const data = await res.json();
  return data.url;
}

// 2. Leads & Funnel Submissions
export async function submitLead(payload: Partial<Lead>): Promise<{
  success: boolean;
  leadId: string;
  estimatedCompensationMin: number;
  estimatedCompensationMax: number;
}> {
  const res = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Submission failed. Please check your network and try again.');
  return res.json();
}

export async function trackQuizStart(): Promise<void> {
  try {
    await fetch('/api/analytics/track-quiz-start', { method: 'POST' });
  } catch {
    // Non-critical tracking
  }
}

export async function getLeads(): Promise<Lead[]> {
  const res = await fetch('/api/leads', {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch leads');
  const data = await res.json();
  return data.leads;
}

export async function updateLead(id: string, updates: { status?: Lead['status']; notes?: string }): Promise<Lead> {
  const res = await fetch(`/api/leads/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update lead');
  const data = await res.json();
  return data.lead;
}

export async function deleteLead(id: string): Promise<void> {
  const res = await fetch(`/api/leads/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete lead');
}

export async function syncLeadToPipedrive(id: string): Promise<{ success: boolean; message: string; lead: Lead }> {
  const res = await fetch(`/api/leads/${id}/sync-pipedrive`, {
    method: 'POST',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to sync lead to Pipedrive CRM');
  return res.json();
}

// 3. Pipedrive Integration
export async function getPipedriveConfig(): Promise<PipedriveConfig & { encryptionStatus?: string; encryptionAlgorithm?: string }> {
  const res = await fetch('/api/pipedrive/config', {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to get Pipedrive config');
  const data = await res.json();
  return data.config;
}

export async function savePipedriveConfig(data: {
  rawApiToken?: string;
  companyDomain?: string;
  stageId?: string;
  pipelineId?: string;
  autoSync?: boolean;
}): Promise<void> {
  const res = await fetch('/api/pipedrive/config', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to save Pipedrive CRM settings');
}

export async function testPipedriveConnection(): Promise<{ success: boolean; message: string; testedAt: string }> {
  const res = await fetch('/api/pipedrive/test', {
    method: 'POST',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Pipedrive connection test failed');
  return res.json();
}

// 4. Analytics
export async function getAnalytics(): Promise<AnalyticsData> {
  const res = await fetch('/api/analytics', {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch analytics');
  const data = await res.json();
  return data.analytics;
}

// 5. Authentication & MFA
export async function loginStep1(username: string, password: string): Promise<{
  requiresMfa: boolean;
  mfaSessionToken?: string;
  token?: string;
  user?: any;
  message?: string;
}> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Authentication failed');
  }
  return res.json();
}

export async function loginStep2Mfa(mfaSessionToken: string, code: string): Promise<{
  success: boolean;
  token: string;
  user: any;
}> {
  const res = await fetch('/api/auth/mfa-verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mfaSessionToken, code }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'MFA code verification failed');
  }
  return res.json();
}

export async function verifyCurrentAuth(): Promise<{ user: any; mfaDetails?: any } | null> {
  const token = getAuthToken();
  if (!token) return null;
  try {
    const res = await fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      clearAuthToken();
      return null;
    }
    return res.json();
  } catch {
    return null;
  }
}

export async function logout(): Promise<void> {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: authHeaders(),
    });
  } finally {
    clearAuthToken();
  }
}

export async function updateMfaSettings(enableMfa: boolean, newPassword?: string): Promise<any> {
  const res = await fetch('/api/auth/mfa-settings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify({ enableMfa, newPassword }),
  });
  if (!res.ok) throw new Error('Failed to update security settings');
  return res.json();
}

// 6. Real-Time SSE Listener
export function subscribeToLeadStream(onNewLead: (lead: Lead) => void): () => void {
  try {
    const eventSource = new EventSource('/api/events/leads-stream');

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === 'NEW_LEAD' && payload.lead) {
          onNewLead(payload.lead);
        }
      } catch (err) {
        console.error('Error parsing SSE message:', err);
      }
    };

    eventSource.onerror = (err) => {
      console.warn('SSE connection warning, will automatically retry:', err);
    };

    return () => {
      eventSource.close();
    };
  } catch (err) {
    console.error('Failed to initialize EventSource:', err);
    return () => {};
  }
}
