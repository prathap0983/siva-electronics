import React, { useEffect, useState } from 'react';
import { Settings, Save, Phone, MessageSquare, MapPin, Clock, Share2, Loader2 } from 'lucide-react';
import api from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';
import { useSettings } from '../../context/SettingsContext.jsx';
import DragDropUpload from '../../components/DragDropUpload.jsx';

export const SettingsManagement = () => {
  const { addToast } = useToast();
  const { settings, refreshSettings } = useSettings();

  const [saving, setSaving] = useState(false);

  // Form states
  const [businessName, setBusinessName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  
  // Hours
  const [weekdayHours, setWeekdayHours] = useState('');
  const [sundayHours, setSundayHours] = useState('');

  // Socials
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [youtube, setYoutube] = useState('');

  useEffect(() => {
    if (settings) {
      setBusinessName(settings.business_name || '');
      setLogoUrl(settings.logo_url || '');
      setPhone(settings.phone || '');
      setWhatsapp(settings.whatsapp || '');
      setAddress(settings.address || '');
      setWeekdayHours(settings.business_hours?.weekdays || '9:00 AM - 8:30 PM');
      setSundayHours(settings.business_hours?.sunday || '10:00 AM - 5:00 PM');
      setFacebook(settings.social_links?.facebook || '');
      setInstagram(settings.social_links?.instagram || '');
      setYoutube(settings.social_links?.youtube || '');
    }
  }, [settings]);

  const handleLogoUploaded = (urls) => {
    if (urls.length > 0) {
      setLogoUrl(urls[0]);
    }
  };

  const handleLogoRemoved = () => {
    setLogoUrl('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!businessName || !phone || !whatsapp || !address) {
      addToast('Business Name, Contact Numbers, and Address are required', 'warning');
      return;
    }

    setSaving(true);
    const payload = {
      business_name: businessName,
      logo_url: logoUrl || null,
      phone,
      whatsapp,
      address,
      business_hours: {
        weekdays: weekdayHours,
        sunday: sundayHours
      },
      social_links: {
        facebook,
        instagram,
        youtube
      }
    };

    try {
      await api.put('/settings', payload);
      addToast('Store configurations updated successfully', 'success');
      refreshSettings(); // Refresh context cache
    } catch (err) {
      console.error(err);
      addToast('Failed to save store configurations', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-left animate-enter-up max-w-4xl">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-805 pb-4">
        <div className="space-y-0.5">
          <p className="text-xs font-semibold text-slate-400 font-medium">Configurations</p>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Store Settings</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Core Profile */}
        <div className="bg-white dark:bg-card-dark border border-slate-205 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <h3 className="font-bold text-sm text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">Business Identity</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-450 uppercase">Business Name *</label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full p-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-450 uppercase block">Shop Logo</label>
            <DragDropUpload
              onUploadComplete={handleLogoUploaded}
              existingImages={logoUrl ? [logoUrl] : []}
              onRemoveImage={handleLogoRemoved}
              multiple={false}
              folder="branding"
            />
          </div>
        </div>

        {/* Contact info */}
        <div className="bg-white dark:bg-card-dark border border-slate-205 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <h3 className="font-bold text-sm text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">Contact Details</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-450 uppercase flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-primary" />
                <span>Call Center Phone *</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. +91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm focus:outline-none focus:border-primary"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-455 uppercase flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-green-500" />
                <span>WhatsApp Phone *</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. +91 98765 43210"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full p-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-455 uppercase flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-orange-500" />
              <span>Office Address *</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="e.g. Street, Near landmark, City, Pin Code"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Business Hours */}
        <div className="bg-white dark:bg-card-dark border border-slate-205 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <h3 className="font-bold text-sm text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-805 pb-2">Business Hours</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-450 uppercase flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>Weekdays (Mon - Sat)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 9:00 AM - 8:30 PM"
                value={weekdayHours}
                onChange={(e) => setWeekdayHours(e.target.value)}
                className="w-full p-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm focus:outline-none focus:border-primary"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-450 uppercase flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>Sunday</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 10:00 AM - 5:00 PM"
                value={sundayHours}
                onChange={(e) => setSundayHours(e.target.value)}
                className="w-full p-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Socials */}
        <div className="bg-white dark:bg-card-dark border border-slate-205 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <h3 className="font-bold text-sm text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-805 pb-2">Social Networks</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-450 uppercase">Facebook URL</label>
              <input
                type="text"
                placeholder="e.g. https://facebook.com/siva"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                className="w-full p-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-450 uppercase">Instagram URL</label>
              <input
                type="text"
                placeholder="e.g. https://instagram.com/siva"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full p-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-450 uppercase">YouTube URL</label>
              <input
                type="text"
                placeholder="e.g. https://youtube.com/siva"
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                className="w-full p-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-8 py-3.5 rounded-xl text-sm font-bold tracking-wide shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="w-4.5 h-4.5 animate-spin" />
                <span>Saving settings...</span>
              </>
            ) : (
              <>
                <Save className="w-4.5 h-4.5" />
                <span>Save Configurations</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

export default SettingsManagement;
