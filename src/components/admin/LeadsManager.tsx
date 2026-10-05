import React, { useState } from 'react';
import { 
  Search, Filter, Download, ExternalLink, RefreshCw, 
  Trash2, Check, Clock, AlertTriangle, ShieldCheck, 
  Sparkles, Send, Eye, X, MessageSquare, Phone, Mail, MapPin, Building
} from 'lucide-react';
import { Lead } from '../../types';
import { updateLead, deleteLead, syncLeadToPipedrive } from '../../services/api';

interface LeadsManagerProps {
  leads: Lead[];
  onRefresh: () => void;
}

export const LeadsManager: React.FC<LeadsManagerProps> = ({ leads, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [leadNotes, setLeadNotes] = useState<string>('');

  // Filtered leads
  const filtered = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      lead.postcode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;

    return matchesSearch && matchesStatus && matchesSource;
  });

  const handleSelectLead = (lead: Lead) => {
    setSelectedLead(lead);
    setLeadNotes(lead.notes || '');
    setActionMessage(null);
  };

  const handleStatusChange = async (newStatus: Lead['status']) => {
    if (!selectedLead) return;
    setIsUpdating(true);
    try {
      const updated = await updateLead(selectedLead.id, { status: newStatus });
      setSelectedLead(updated);
      onRefresh();
      setActionMessage(`Lead status updated to ${newStatus}`);
    } catch (err: any) {
      setActionMessage(err.message || 'Error updating status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedLead) return;
    setIsUpdating(true);
    try {
      const updated = await updateLead(selectedLead.id, { notes: leadNotes });
      setSelectedLead(updated);
      onRefresh();
      setActionMessage('Case notes saved successfully');
    } catch (err: any) {
      setActionMessage(err.message || 'Error saving notes');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSyncPipedrive = async (leadId: string) => {
    setIsUpdating(true);
    try {
      const res = await syncLeadToPipedrive(leadId);
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead(res.lead);
      }
      onRefresh();
      setActionMessage(res.message);
    } catch (err: any) {
      setActionMessage(err.message || 'Pipedrive sync failed');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (leadId: string) => {
    if (!confirm('Are you sure you want to permanently delete this lead record?')) return;
    try {
      await deleteLead(leadId);
      if (selectedLead?.id === leadId) setSelectedLead(null);
      onRefresh();
    } catch (err) {
      alert('Failed to delete lead');
    }
  };

  const handleExportCsv = () => {
    if (leads.length === 0) return;
    const headers = [
      'ID', 'Date', 'Name', 'Email', 'Phone', 'Postcode', 
      'Deposit (£)', 'Min Comp (£)', 'Max Comp (£)', 
      'Renewals', 'Breach Type', 'Prescribed Info', 'Status', 'Pipedrive Synced'
    ];
    const rows = leads.map((l) => [
      l.id,
      new Date(l.createdAt).toLocaleDateString('en-GB'),
      `"${l.name}"`,
      l.email,
      `"${l.phone}"`,
      l.postcode,
      l.depositAmount,
      l.estimatedCompensationMin,
      l.estimatedCompensationMax,
      l.renewalsCount,
      l.protectedWithin30Days,
      l.receivedPrescribedInfo,
      l.status,
      l.pipedriveSynced ? 'Yes' : 'No',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `deposithero_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Status badge styling helper
  const renderStatusBadge = (status: Lead['status']) => {
    switch (status) {
      case 'new':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-950 text-blue-400 border border-blue-800">
            New Lead
          </span>
        );
      case 'contacted':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-950 text-amber-400 border border-amber-800">
            Contacted
          </span>
        );
      case 'in_review':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-950 text-purple-400 border border-purple-800">
            In Review
          </span>
        );
      case 'qualified':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
            Qualified Claim
          </span>
        );
      case 'closed':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
            Closed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Overview Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Total Enquiries & Quiz Leads</div>
          <div className="text-2xl font-black text-white font-mono mt-1 tabular-nums">
            {leads.length}
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">New Unprocessed Leads</div>
          <div className="text-2xl font-black text-blue-400 font-mono mt-1 tabular-nums">
            {leads.filter((l) => l.status === 'new').length}
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Qualified Claims Pipeline</div>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1 tabular-nums">
            {leads.filter((l) => l.status === 'qualified' || l.status === 'in_review').length}
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Total Potential Damages Value</div>
          <div className="text-2xl font-black text-white font-mono mt-1 tabular-nums">
            £{leads.reduce((acc, l) => acc + (l.estimatedCompensationMax || 0), 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Filter & Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by name, email, phone, postcode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="in_review">In Review</option>
            <option value="qualified">Qualified</option>
            <option value="closed">Closed</option>
          </select>

          {/* Source Filter */}
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Channels</option>
            <option value="quiz">Multi-Step Quiz</option>
            <option value="calculator">Deposit Calculator</option>
            <option value="inquiry_form">Contact Form</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Refresh Leads Table"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/70 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Lead / Contact</th>
                <th className="py-3 px-4">Postcode</th>
                <th className="py-3 px-4">Deposit</th>
                <th className="py-3 px-4">Potential Claim</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Breach Type</th>
                <th className="py-3 px-4">CRM Sync</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No inquiries or leads found matching your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-slate-850/50 transition-colors group cursor-pointer"
                    onClick={() => handleSelectLead(lead)}
                  >
                    <td className="py-3 px-4">
                      <div className="font-bold text-white text-sm">{lead.name}</div>
                      <div className="text-slate-400 text-[11px]">{lead.email} · {lead.phone}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300 font-semibold">
                      {lead.postcode}
                    </td>
                    <td className="py-3 px-4 font-mono text-white font-bold tabular-nums">
                      £{lead.depositAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-emerald-400 font-bold tabular-nums">
                        up to £{lead.estimatedCompensationMax.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="capitalize font-mono text-[11px] text-slate-400">
                        {lead.source.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[11px] text-slate-300">
                        {lead.protectedWithin30Days === 'no'
                          ? 'Unprotected'
                          : lead.protectedWithin30Days === 'late'
                          ? 'Late Protected'
                          : 'Prescribed Info'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {lead.pipedriveSynced ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                          <Check className="w-3 h-3" />
                          <span>Synced</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-500 font-mono">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {renderStatusBadge(lead.status)}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleSelectLead(lead)}
                        className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
                        title="View Full Case Record"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(lead.id)}
                        className="p-1.5 rounded bg-red-950/40 text-red-400 hover:text-red-300 hover:bg-red-900/40"
                        title="Delete Lead"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Lead Detail Modal / Drawer */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 text-slate-100 max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">Ref: #{selectedLead.id}</span>
                  {renderStatusBadge(selectedLead.status)}
                </div>
                <h3 className="text-2xl font-bold text-white mt-1">
                  {selectedLead.name}
                </h3>
                <p className="text-xs text-slate-400">
                  Received {new Date(selectedLead.createdAt).toLocaleString('en-GB')} via {selectedLead.source}
                </p>
              </div>

              <button
                onClick={() => setSelectedLead(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Notification message if action was executed */}
            {actionMessage && (
              <div className="p-3 bg-blue-950/80 border border-blue-800 rounded-xl text-xs text-blue-300 flex items-center justify-between">
                <span>{actionMessage}</span>
                <button onClick={() => setActionMessage(null)} className="text-blue-400 hover:text-white">✕</button>
              </div>
            )}

            {/* Quick Contact & Potential Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">Contact Information</span>
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-white font-medium">
                    <Mail className="w-3.5 h-3.5 text-blue-400" />
                    <a href={`mailto:${selectedLead.email}`} className="hover:underline">{selectedLead.email}</a>
                  </div>
                  <div className="flex items-center gap-1.5 text-white font-medium">
                    <Phone className="w-3.5 h-3.5 text-blue-400" />
                    <a href={`tel:${selectedLead.phone}`} className="hover:underline">{selectedLead.phone}</a>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Postcode: {selectedLead.postcode}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">Statutory Claim Potential</span>
                <div className="text-xs space-y-0.5">
                  <div className="text-slate-400">Deposit Paid: <strong className="text-white font-mono">£{selectedLead.depositAmount.toLocaleString()}</strong></div>
                  <div className="text-slate-400">Statutory Award: <strong className="text-emerald-400 font-mono">£{selectedLead.estimatedCompensationMin.toLocaleString()} – £{selectedLead.estimatedCompensationMax.toLocaleString()}</strong></div>
                  <div className="text-slate-400">Renewals: <strong className="text-white font-mono">{selectedLead.renewalsCount} terms</strong></div>
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-xs text-slate-400 block mb-1">Pipedrive CRM</span>
                  <div className="text-xs">
                    {selectedLead.pipedriveSynced ? (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Synced ({selectedLead.pipedriveDealId || 'Active Deal'})</span>
                      </span>
                    ) : (
                      <span className="text-amber-400">Not synced yet</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleSyncPipedrive(selectedLead.id)}
                  disabled={isUpdating}
                  className="mt-2 w-full py-1.5 px-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded text-xs font-semibold cursor-pointer"
                >
                  {selectedLead.pipedriveSynced ? 'Re-sync Pipedrive' : 'Sync to Pipedrive Now'}
                </button>
              </div>
            </div>

            {/* Quiz Questionnaire Audit */}
            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Full Eligibility & Tenancy Questionnaire Responses
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-2 rounded bg-slate-900 border border-slate-800/80">
                  <span className="text-slate-400 block">Property Location:</span>
                  <span className="font-semibold text-white">
                    {selectedLead.propertyLocation === 'england_wales' ? 'England / Wales (Complies with Housing Act 2004)' : 'Scotland / NI'}
                  </span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800/80">
                  <span className="text-slate-400 block">Protected Within 30 Days:</span>
                  <span className="font-semibold text-white">
                    {selectedLead.protectedWithin30Days === 'no' ? 'No, never protected (3x Penalty)' : selectedLead.protectedWithin30Days === 'late' ? 'Protected Late (Statutory Breach)' : 'Yes / Unknown'}
                  </span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800/80">
                  <span className="text-slate-400 block">Prescribed Information Received:</span>
                  <span className="font-semibold text-white">
                    {selectedLead.receivedPrescribedInfo === 'no' ? 'No, never received pack' : 'Received / Unsure'}
                  </span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800/80">
                  <span className="text-slate-400 block">Tenancy Agreement Available:</span>
                  <span className="font-semibold text-white">
                    {selectedLead.hasTenancyAgreement === 'yes' ? 'Yes, tenant has copy' : 'Needs retrieval support'}
                  </span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800/80">
                  <span className="text-slate-400 block">Current Tenancy Status:</span>
                  <span className="font-semibold text-white">
                    {selectedLead.tenancyStatus === 'moved_out' ? 'Moved out within 6 years' : 'Current tenant'}
                  </span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800/80">
                  <span className="text-slate-400 block">Submission IP / Origin:</span>
                  <span className="font-mono text-slate-400">{selectedLead.ipAddress || '127.0.0.1'}</span>
                </div>
              </div>

              {selectedLead.message && (
                <div className="p-3 bg-slate-900 rounded border border-slate-800 text-xs">
                  <span className="text-slate-400 block font-semibold mb-1">Tenant Inquiry Note:</span>
                  <p className="text-slate-200">{selectedLead.message}</p>
                </div>
              )}
            </div>

            {/* Case Management Controls */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-semibold text-slate-300">Update Lead Workflow Status:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(['new', 'contacted', 'in_review', 'qualified', 'closed'] as Lead['status'][]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(st)}
                      disabled={isUpdating}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                        selectedLead.status === st
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Internal Notes */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Internal Solicitor / Case Handler Notes:
                </label>
                <textarea
                  rows={3}
                  value={leadNotes}
                  onChange={(e) => setLeadNotes(e.target.value)}
                  placeholder="Record call summaries, scheme verification results, or next action items..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <div className="flex justify-end pt-1">
                  <button
                    onClick={handleSaveNotes}
                    disabled={isUpdating}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Save Notes
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
