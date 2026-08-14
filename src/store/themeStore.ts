import { create } from 'zustand';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface ThemeState {
  activeTheme: string;
  loading: boolean;
  initTheme: () => void;
  setTheme: (themeId: string) => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set) => ({
  activeTheme: 'theme-neon-shinobi',
  loading: true,
  initTheme: () => {
    const themeRef = doc(db, 'settings', 'theme');
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(themeRef, (docSnap) => {
      if (docSnap.exists()) {
        const theme = docSnap.data().activeTheme || 'theme-neon-shinobi';
        set({ activeTheme: theme, loading: false });
        
        // Apply to document element
        document.documentElement.className = theme;
      } else {
        // If document doesn't exist, create it with default theme
        setDoc(themeRef, { activeTheme: 'theme-neon-shinobi' }, { merge: true });
        set({ activeTheme: 'theme-neon-shinobi', loading: false });
        document.documentElement.className = 'theme-neon-shinobi';
      }
    }, (error) => {
      console.error('Error fetching theme:', error);
      set({ loading: false });
    });
    
    return unsubscribe;
  },
  setTheme: async (themeId: string) => {
    try {
      const themeRef = doc(db, 'settings', 'theme');
      await setDoc(themeRef, { activeTheme: themeId }, { merge: true });
      // The onSnapshot listener will handle updating the state and DOM
    } catch (error) {
      console.error('Error setting theme:', error);
      throw error;
    }
  }
}));
