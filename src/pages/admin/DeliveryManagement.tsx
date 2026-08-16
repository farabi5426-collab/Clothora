import React, { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Save } from 'lucide-react';

export default function DeliveryManagement() {
  const [insideDhaka, setInsideDhaka] = useState<number>(60);
  const [outsideDhaka, setOutsideDhaka] = useState<number>(120);
  const [freeDelivery, setFreeDelivery] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const docRef = doc(db, 'settings', 'delivery');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setInsideDhaka(docSnap.data().insideDhaka ?? 60);
          setOutsideDhaka(docSnap.data().outsideDhaka ?? 120);
          setFreeDelivery(docSnap.data().freeDelivery ?? false);
        }
      } catch (error: any) {
        console.warn('Failed to load delivery settings (client might be offline):', error);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'delivery'), {
        insideDhaka,
        outsideDhaka,
        freeDelivery
      }, { merge: true });
      alert('Delivery settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save. Make sure you are an admin.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-on-background">Loading...</div>;
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-black tracking-tighter uppercase mb-1">Delivery Charges</h1>
        <p className="text-xs text-on-surface-variant uppercase tracking-widest">Manage shipping costs applied at checkout</p>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant p-8 space-y-6">
        <div>
          <label className="flex items-center gap-3 cursor-pointer p-4 bg-surface-container-low border border-outline-variant hover:border-primary transition-colors">
            <input
              type="checkbox"
              checked={freeDelivery}
              onChange={(e) => setFreeDelivery(e.target.checked)}
              className="w-5 h-5 accent-primary"
            />
            <span className="font-black uppercase tracking-widest text-sm text-on-surface">Enable Free Delivery for All Products</span>
          </label>
        </div>

        <div className={freeDelivery ? 'opacity-50 pointer-events-none' : ''}>
          <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
            Inside Dhaka Charge (৳)
          </label>
          <input
            type="number"
            value={insideDhaka}
            onChange={(e) => setInsideDhaka(Number(e.target.value))}
            className="w-full bg-surface-container-low border border-outline-variant p-4 text-on-background font-bold outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className={freeDelivery ? 'opacity-50 pointer-events-none' : ''}>
          <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
            Outside Dhaka Charge (৳)
          </label>
          <input
            type="number"
            value={outsideDhaka}
            onChange={(e) => setOutsideDhaka(Number(e.target.value))}
            className="w-full bg-surface-container-low border border-outline-variant p-4 text-on-background font-bold outline-none focus:border-primary transition-colors"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary-container text-on-primary p-4 text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
