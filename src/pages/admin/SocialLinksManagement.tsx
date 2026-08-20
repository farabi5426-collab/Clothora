import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { Save, Facebook, Instagram, MessageCircle } from 'lucide-react';

interface SocialLinksConfig {
  whatsapp: { url: string; enabled: boolean };
  facebook: { url: string; enabled: boolean };
  instagram: { url: string; enabled: boolean };
}

const DEFAULT_CONFIG: SocialLinksConfig = {
  whatsapp: { url: '+8801234567890', enabled: true },
  facebook: { url: 'https://facebook.com/clothora', enabled: false },
  instagram: { url: 'https://instagram.com/clothora', enabled: false },
};

export default function SocialLinksManagement() {
  const [config, setConfig] = useState<SocialLinksConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const docRef = doc(db, 'settings', 'socialLinks');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setConfig({ ...DEFAULT_CONFIG, ...docSnap.data() });
        }
      } catch (err) {
        console.error("Error fetching social links", err);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'socialLinks'), config);
      toast.success('Social links saved');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (platform: keyof SocialLinksConfig) => {
    setConfig(prev => ({
      ...prev,
      [platform]: { ...prev[platform], enabled: !prev[platform].enabled }
    }));
  };

  const handleChange = (platform: keyof SocialLinksConfig, value: string) => {
    setConfig(prev => ({
      ...prev,
      [platform]: { ...prev[platform], url: value }
    }));
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-end border-b-4 border-surface-bright pb-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-on-surface">Social Widgets</h1>
          <p className="text-on-surface-variant font-bold uppercase tracking-widest mt-2 text-sm">Manage floating social widgets</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary text-on-primary px-6 py-3 font-black uppercase tracking-widest text-sm shadow-[4px_4px_0px_var(--color-on-surface)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_var(--color-on-surface)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50 flex items-center gap-2"
        >
          <Save className="w-5 h-5" /> {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="bg-surface border-2 border-surface-bright p-6 space-y-8">
        
        {/* WhatsApp */}
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#25D366] text-white shadow-[4px_4px_0px_rgba(0,0,0,1)] border-2 border-surface-bright">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <label className="font-bold uppercase tracking-widest text-on-surface">WhatsApp Number</label>
              <button 
                onClick={() => handleToggle('whatsapp')}
                className={`px-4 py-1 text-xs font-bold uppercase tracking-widest border-2 \${config.whatsapp.enabled ? 'bg-primary text-on-primary border-primary' : 'bg-surface-container border-surface-bright text-on-surface-variant'}`}
              >
                {config.whatsapp.enabled ? 'ON' : 'OFF'}
              </button>
            </div>
            <input 
              type="text" 
              value={config.whatsapp.url}
              onChange={(e) => handleChange('whatsapp', e.target.value)}
              placeholder="+8801..."
              className="w-full bg-surface-container-lowest border-2 border-surface-bright p-3 text-on-surface font-bold focus:border-primary outline-none"
            />
          </div>
        </div>

        {/* Facebook */}
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#1877F2] text-white shadow-[4px_4px_0px_rgba(0,0,0,1)] border-2 border-surface-bright">
            <Facebook className="w-6 h-6" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <label className="font-bold uppercase tracking-widest text-on-surface">Facebook URL</label>
              <button 
                onClick={() => handleToggle('facebook')}
                className={`px-4 py-1 text-xs font-bold uppercase tracking-widest border-2 \${config.facebook.enabled ? 'bg-primary text-on-primary border-primary' : 'bg-surface-container border-surface-bright text-on-surface-variant'}`}
              >
                {config.facebook.enabled ? 'ON' : 'OFF'}
              </button>
            </div>
            <input 
              type="text" 
              value={config.facebook.url}
              onChange={(e) => handleChange('facebook', e.target.value)}
              placeholder="https://facebook.com/..."
              className="w-full bg-surface-container-lowest border-2 border-surface-bright p-3 text-on-surface font-bold focus:border-primary outline-none"
            />
          </div>
        </div>

        {/* Instagram */}
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#E4405F] text-white shadow-[4px_4px_0px_rgba(0,0,0,1)] border-2 border-surface-bright">
            <Instagram className="w-6 h-6" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <label className="font-bold uppercase tracking-widest text-on-surface">Instagram URL</label>
              <button 
                onClick={() => handleToggle('instagram')}
                className={`px-4 py-1 text-xs font-bold uppercase tracking-widest border-2 \${config.instagram.enabled ? 'bg-primary text-on-primary border-primary' : 'bg-surface-container border-surface-bright text-on-surface-variant'}`}
              >
                {config.instagram.enabled ? 'ON' : 'OFF'}
              </button>
            </div>
            <input 
              type="text" 
              value={config.instagram.url}
              onChange={(e) => handleChange('instagram', e.target.value)}
              placeholder="https://instagram.com/..."
              className="w-full bg-surface-container-lowest border-2 border-surface-bright p-3 text-on-surface font-bold focus:border-primary outline-none"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
