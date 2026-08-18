import { create } from 'zustand';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface CustomColors {
  accent: string;
  background: string;
  text: string;
}

interface ThemeState {
  activeTheme: string;
  customColors: CustomColors;
  loading: boolean;
  initTheme: () => void;
  setTheme: (themeId: string) => Promise<void>;
  setCustomColors: (colors: CustomColors) => Promise<void>;
}

const defaultCustomColors: CustomColors = {
  accent: '#ff4e00',
  background: '#0a0a0a',
  text: '#ffffff'
};

const applyCustomColors = (colors: CustomColors) => {
  const root = document.documentElement;
  root.style.setProperty('--accent', colors.accent);
  root.style.setProperty('--bg-primary', colors.background);
  root.style.setProperty('--bg-secondary', colors.background); // You can darken/lighten this if needed, or just use the same
  root.style.setProperty('--text-primary', colors.text);
  
  // Create variants using the chosen text color with opacity for secondary/borders
  // A simple way is to use color-mix if supported, or just keep it simple.
  // We'll just set them directly. We would need to parse HEX to RGBA for perfect opacity, 
  // but for now let's just let it be handled by CSS if possible, or simple fallback:
  
  // For better compatibility without HEX to RGBA conversion on the fly, 
  // we can use standard opacity in CSS, but CSS vars here take full strings.
  // Let's implement a quick hex to rgb helper
  const hexToRgb = (hex: string) => {
    let c: any;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return [(c>>16)&255, (c>>8)&255, c&255].join(',');
    }
    return '255,255,255';
  };
  
  const textRgb = hexToRgb(colors.text);
  root.style.setProperty('--text-secondary', `rgba(${textRgb}, 0.6)`);
  root.style.setProperty('--border-color', `rgba(${textRgb}, 0.15)`);
};

export const useThemeStore = create<ThemeState>((set) => ({
  activeTheme: 'theme-neon-shinobi',
  customColors: defaultCustomColors,
  loading: true,
  initTheme: () => {
    const themeRef = doc(db, 'settings', 'theme');
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(themeRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const theme = data.activeTheme || 'theme-neon-shinobi';
        const customColors = data.customColors || defaultCustomColors;
        
        set({ activeTheme: theme, customColors, loading: false });
        
        // Apply to document element
        document.documentElement.className = theme;
        if (theme === 'theme-custom') {
          applyCustomColors(customColors);
        } else {
          // Remove custom styles if switching away from custom theme
          document.documentElement.style.cssText = '';
        }
      } else {
        // If document doesn't exist, create it with default theme
        setDoc(themeRef, { activeTheme: 'theme-neon-shinobi', customColors: defaultCustomColors }, { merge: true });
        set({ activeTheme: 'theme-neon-shinobi', customColors: defaultCustomColors, loading: false });
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
    } catch (error) {
      console.error('Error setting theme:', error);
      throw error;
    }
  },
  setCustomColors: async (colors: CustomColors) => {
    try {
      const themeRef = doc(db, 'settings', 'theme');
      await setDoc(themeRef, { activeTheme: 'theme-custom', customColors: colors }, { merge: true });
    } catch (error) {
      console.error('Error saving custom colors:', error);
      throw error;
    }
  }
}));
