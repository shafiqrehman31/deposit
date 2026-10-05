import React, { useState } from 'react';
import { 
  Save, Upload, Image, Check, AlertCircle, RefreshCw, 
  Trash2, Plus, Sparkles, FileText, Globe
} from 'lucide-react';
import { CmsContent } from '../../types';
import { updateCms, uploadAsset } from '../../services/api';

interface CmsEditorProps {
  cms: CmsContent;
  onCmsUpdated: (updated: CmsContent) => void;
}

export const CmsEditor: React.FC<CmsEditorProps> = ({ cms, onCmsUpdated }) => {
  const [formData, setFormData] = useState<CmsContent>(cms);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingFavicon, setIsUploadingFavicon] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleInputChange = (field: keyof CmsContent, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStatChange = (statKey: keyof CmsContent['stats'], value: string) => {
    setFormData((prev) => ({
      ...prev,
      stats: { ...prev.stats, [statKey]: value },
    }));
  };

  const handleServiceChange = (index: number, field: string, value: string) => {
    const updatedServices = [...formData.services];
    updatedServices[index] = { ...updatedServices[index], [field]: value };
    setFormData((prev) => ({ ...prev, services: updatedServices }));
  };

  const handleFaqChange = (index: number, field: 'question' | 'answer', value: string) => {
    const updatedFaqs = [...formData.faqs];
    updatedFaqs[index] = { ...updatedFaqs[index], [field]: value };
    setFormData((prev) => ({ ...prev, faqs: updatedFaqs }));
  };

  const handleAddFaq = () => {
    setFormData((prev) => ({
      ...prev,
      faqs: [
        ...prev.faqs,
        {
          id: `faq-${Date.now()}`,
          question: 'New Question Title',
          answer: 'Detailed legal explanation here...',
        },
      ],
    }));
  };

  const handleDeleteFaq = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
    }));
  };

  // Logo file upload handler
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const dataUrl = reader.result as string;
        await uploadAsset('logo', dataUrl);
        setFormData((prev) => ({ ...prev, logoUrl: dataUrl }));
        setSaveStatus('Logo uploaded and applied successfully!');
      } catch (err: any) {
        setSaveStatus('Error uploading logo.');
      } finally {
        setIsUploadingLogo(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Favicon file upload handler
  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingFavicon(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const dataUrl = reader.result as string;
        await uploadAsset('favicon', dataUrl);
        setFormData((prev) => ({ ...prev, faviconUrl: dataUrl }));
        // Also update runtime document favicon
        let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.getElementsByTagName('head')[0].appendChild(link);
        }
        link.href = dataUrl;
        setSaveStatus('Favicon uploaded and applied to browser tab!');
      } catch (err: any) {
        setSaveStatus('Error uploading favicon.');
      } finally {
        setIsUploadingFavicon(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus(null);
    try {
      const updated = await updateCms(formData);
      onCmsUpdated(updated);
      setSaveStatus('CMS content saved and published live across the site!');
    } catch (err: any) {
      setSaveStatus(err.message || 'Error updating CMS content');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSaveAll} className="space-y-8 text-slate-100 max-w-5xl">
      
      {/* Title & Save Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight font-display">
            Content Management System (CMS) & Assets
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Edit live website copy, hero messaging, legal disclaimers, services, and upload brand assets.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Publishing Changes...' : 'Save & Publish Live'}</span>
        </button>
      </div>

      {saveStatus && (
        <div className="p-3.5 bg-blue-950/80 border border-blue-800 rounded-xl text-xs text-blue-300 flex items-center justify-between">
          <span>{saveStatus}</span>
          <button type="button" onClick={() => setSaveStatus(null)} className="text-blue-400 hover:text-white">✕</button>
        </div>
      )}

      {/* SECTION 1: Logo & Favicon Upload */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-6">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Image className="w-4 h-4 text-blue-400" />
            <span>Brand Assets: Logo & Favicon Upload</span>
          </h3>
          <p className="text-xs text-slate-400">
            Upload custom company mark and browser tab icon. Changes appear instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Logo Uploader */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">Website Header Logo</span>
              <span className="text-[11px] text-slate-500 font-mono">PNG / SVG / WebP</span>
            </div>

            <div className="h-24 bg-slate-900/80 rounded-lg border border-slate-800 flex items-center justify-center p-3">
              {formData.logoUrl ? (
                <img
                  src={formData.logoUrl}
                  alt="Custom Website Logo"
                  className="max-h-full max-w-full object-contain"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="text-xs text-slate-500">Using Default SVG Wordmark</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <label className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>{isUploadingLogo ? 'Uploading...' : 'Choose Logo File'}</span>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/svg+xml, image/webp"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>

              {formData.logoUrl && (
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, logoUrl: '' }))}
                  className="p-2 text-red-400 hover:bg-red-950/40 rounded-lg transition-colors"
                  title="Remove Custom Logo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-[10px] text-slate-500">Recommended size: 240×60px transparent PNG</p>
          </div>

          {/* Favicon Uploader */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">Browser Favicon</span>
              <span className="text-[11px] text-slate-500 font-mono">ICO / PNG / SVG</span>
            </div>

            <div className="h-24 bg-slate-900/80 rounded-lg border border-slate-800 flex items-center justify-center p-3">
              {formData.faviconUrl ? (
                <img
                  src={formData.faviconUrl}
                  alt="Custom Favicon"
                  className="w-10 h-10 object-contain"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="text-xs text-slate-500">Using Default Favicon</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <label className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>{isUploadingFavicon ? 'Uploading...' : 'Choose Favicon File'}</span>
                <input
                  type="file"
                  accept="image/x-icon, image/png, image/svg+xml"
                  onChange={handleFaviconUpload}
                  className="hidden"
                />
              </label>

              {formData.faviconUrl && (
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, faviconUrl: '' }))}
                  className="p-2 text-red-400 hover:bg-red-950/40 rounded-lg transition-colors"
                  title="Remove Custom Favicon"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-[10px] text-slate-500">Recommended size: 64×64px square icon</p>
          </div>

        </div>
      </div>

      {/* SECTION 2: General Site & Contact Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-4">
        <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
          General Brand & Contact Settings
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">Website Brand Name</label>
            <input
              type="text"
              value={formData.siteName}
              onChange={(e) => handleInputChange('siteName', e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">Tagline</label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => handleInputChange('tagline', e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">Tenant Helpline Phone</label>
            <input
              type="text"
              value={formData.contactPhone}
              onChange={(e) => handleInputChange('contactPhone', e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">Official Claims Email</label>
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => handleInputChange('contactEmail', e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-slate-300 block mb-1">Registered Consultation Office Address</label>
            <input
              type="text"
              value={formData.officeAddress}
              onChange={(e) => handleInputChange('officeAddress', e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: Hero Section Copy */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-4">
        <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
          Homepage Hero & Marquee Messaging
        </h3>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">Top Hero Badge Kicker</label>
            <input
              type="text"
              value={formData.heroBadge}
              onChange={(e) => handleInputChange('heroBadge', e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">Primary Display Headline</label>
            <input
              type="text"
              value={formData.heroHeadline}
              onChange={(e) => handleInputChange('heroHeadline', e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">Value Proposition Subtitle</label>
            <textarea
              rows={3}
              value={formData.heroSubtitle}
              onChange={(e) => handleInputChange('heroSubtitle', e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">Primary CTA Button Text</label>
            <input
              type="text"
              value={formData.ctaText}
              onChange={(e) => handleInputChange('ctaText', e.target.value)}
              className="w-full max-w-sm bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* SECTION 4: Live Social Proof Stats */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-4">
        <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
          Key Statistics & Performance Proof
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">Total Recovered</label>
            <input
              type="text"
              value={formData.stats.claimsRecovered}
              onChange={(e) => handleStatChange('claimsRecovered', e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">Average Payout</label>
            <input
              type="text"
              value={formData.stats.averagePayout}
              onChange={(e) => handleStatChange('averagePayout', e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">Success Rate</label>
            <input
              type="text"
              value={formData.stats.successRate}
              onChange={(e) => handleStatChange('successRate', e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">Client Rating</label>
            <input
              type="text"
              value={formData.stats.clientRating}
              onChange={(e) => handleStatChange('clientRating', e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono"
            />
          </div>
        </div>
      </div>

      {/* SECTION 5: FAQs Manager */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white">Frequently Asked Questions Editor</h3>
            <p className="text-xs text-slate-400">Manage questions and answers displayed to prospective tenants.</p>
          </div>
          <button
            type="button"
            onClick={handleAddFaq}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Question</span>
          </button>
        </div>

        <div className="space-y-4">
          {formData.faqs.map((faq, idx) => (
            <div key={faq.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => handleFaqChange(idx, 'question', e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-semibold focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteFaq(idx)}
                  className="p-1.5 text-red-400 hover:bg-red-950/40 rounded transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <textarea
                rows={2}
                value={faq.answer}
                onChange={(e) => handleFaqChange(idx, 'answer', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 6: Legal Regulatory Disclaimer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-3">
        <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
          Footer Legal & SRA Regulatory Disclaimer
        </h3>
        <textarea
          rows={3}
          value={formData.legalDisclaimer}
          onChange={(e) => handleInputChange('legalDisclaimer', e.target.value)}
          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Bottom Save Button */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-lg transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Publishing...' : 'Save & Publish Live'}</span>
        </button>
      </div>

    </form>
  );
};
