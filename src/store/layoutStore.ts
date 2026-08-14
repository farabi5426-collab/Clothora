import { create } from 'zustand';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface LayoutState {
  activeLayout: string;
  loading: boolean;
  initLayout: () => void;
  setLayout: (layoutId: string) => Promise<void>;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  activeLayout: 'layout-classic',
  loading: true,
  initLayout: () => {
    const layoutRef = doc(db, 'settings', 'layout');
    
    const unsubscribe = onSnapshot(layoutRef, (docSnap) => {
      if (docSnap.exists()) {
        set({ activeLayout: docSnap.data().activeLayout || 'layout-classic', loading: false });
      } else {
        setDoc(layoutRef, { activeLayout: 'layout-classic' }, { merge: true });
        set({ activeLayout: 'layout-classic', loading: false });
      }
    }, (error) => {
      console.error('Error fetching layout:', error);
      set({ loading: false });
    });
    
    return unsubscribe;
  },
  setLayout: async (layoutId: string) => {
    try {
      const layoutRef = doc(db, 'settings', 'layout');
      await setDoc(layoutRef, { activeLayout: layoutId }, { merge: true });
    } catch (error) {
      console.error('Error setting layout:', error);
      throw error;
    }
  }
}));
