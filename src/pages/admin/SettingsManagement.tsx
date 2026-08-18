import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function SettingsManagement() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    requireDistrictUpazila: true
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'storeConfig');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSettings(prev => ({ ...prev, ...docSnap.data() }));
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleToggle = async (key: keyof typeof settings) => {
    const newValue = !settings[key];
    setSettings(prev => ({ ...prev, [key]: newValue }));
    
    setSaving(true);
    try {
      const docRef = doc(db, 'settings', 'storeConfig');
      await setDoc(docRef, { [key]: newValue }, { merge: true });
      toast.success('Setting updated successfully');
    } catch (error) {
      console.error('Error updating setting:', error);
      toast.error('Failed to update setting');
      // Revert on fail
      setSettings(prev => ({ ...prev, [key]: !newValue }));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tighter uppercase mb-1">Store Settings</h1>
        <p className="text-xs text-on-surface-variant uppercase tracking-widest">Manage Global Configuration</p>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant p-6 max-w-2xl">
        <h2 className="text-sm font-bold uppercase tracking-widest mb-6">Checkout Settings</h2>
        
        <div className="flex items-center justify-between p-4 border border-outline-variant bg-background">
          <div>
            <h3 className="text-base font-bold text-on-background">District & Upazila Selection</h3>
            <p className="text-xs text-on-surface-variant mt-1">If enabled, users must select their District and Upazila during checkout.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={settings.requireDistrictUpazila}
              onChange={() => handleToggle('requireDistrictUpazila')}
              disabled={saving}
            />
            <div className="w-11 h-6 bg-surface-container peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>
    </div>
  );
}
