import React, { useState } from 'react';
import { useThemeStore } from '../../store/themeStore';
import toast from 'react-hot-toast';
import { Palette, CheckCircle } from 'lucide-react';

const THEMES = [
  {
    id: 'theme-neon-shinobi',
    name: 'Neon Shinobi',
    colors: ['#0a0a0a', '#111111', '#ff4e00', '#ffffff'],
    radius: '0px'
  },
  {
    id: 'theme-minimal-zen',
    name: 'Minimal Zen',
    colors: ['#f8f9fa', '#ffffff', '#2b2b2b', '#212529'],
    radius: '8px'
  },
  {
    id: 'theme-cyberpunk',
    name: 'Cyberpunk',
    colors: ['#020204', '#0a0a12', '#ff00ff', '#00ff41'],
    radius: '4px'
  },
  {
    id: 'theme-y2k',
    name: 'Y2K Dream',
    colors: ['#e6e6fa', '#ffffff', '#00ced1', '#ff1493'],
    radius: '24px'
  },
  {
    id: 'theme-earth',
    name: 'Earthy Organic',
    colors: ['#f4ede4', '#ebdcd0', '#8b5a2b', '#4a3f35'],
    radius: '12px'
  },
  {
    id: 'theme-monochrome',
    name: 'Monochrome',
    colors: ['#ffffff', '#f0f0f0', '#000000', '#000000'],
    radius: '2px'
  }
];

export default function ThemeManagement() {
  const { activeTheme, setTheme } = useThemeStore();
  const [saving, setSaving] = useState(false);

  const handleSaveTheme = async (themeId: string) => {
    setSaving(true);
    try {
      await setTheme(themeId);
      toast.success('Theme updated successfully! Changes are live.');
    } catch (error) {
      toast.error('Failed to update theme.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase mb-1">Website Templates</h1>
          <p className="text-xs text-on-surface-variant uppercase tracking-widest">Manage your storefront's dynamic theme</p>
        </div>
        <div className="bg-primary/10 text-primary px-4 py-2 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
          <Palette className="w-4 h-4" /> Live Preview
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {THEMES.map((theme) => {
          const isActive = activeTheme === theme.id;
          
          return (
            <div 
              key={theme.id}
              className={`bg-surface-container-lowest border transition-all duration-300 ${isActive ? 'border-primary shadow-[0_0_15px_var(--color-primary)]' : 'border-outline-variant hover:border-outline'}`}
            >
              <div 
                className="h-32 p-4 flex flex-col justify-end relative overflow-hidden border-b border-outline-variant"
                style={{ backgroundColor: theme.colors[0], borderRadius: `${theme.radius} ${theme.radius} 0 0` }}
              >
                <div className="absolute top-4 right-4 flex gap-2">
                  {theme.colors.map((color, i) => (
                    <div 
                      key={i} 
                      className="w-6 h-6 shadow-md border border-white/20" 
                      style={{ backgroundColor: color, borderRadius: theme.radius }}
                    />
                  ))}
                </div>
                
                <div 
                  className="w-2/3 h-8 shadow-sm border border-white/10 flex items-center px-3"
                  style={{ backgroundColor: theme.colors[1], borderRadius: theme.radius }}
                >
                  <div 
                    className="w-1/2 h-2"
                    style={{ backgroundColor: theme.colors[2], borderRadius: theme.radius }}
                  />
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-black uppercase tracking-widest text-on-background">{theme.name}</h3>
                  {isActive && <CheckCircle className="w-5 h-5 text-primary" />}
                </div>
                <button
                  onClick={() => handleSaveTheme(theme.id)}
                  disabled={isActive || saving}
                  className={`w-full py-3 text-xs font-bold uppercase tracking-widest transition-colors ${
                    isActive 
                      ? 'bg-surface-container-low text-on-surface-variant cursor-default'
                      : 'bg-primary text-on-primary hover:bg-primary-container'
                  }`}
                >
                  {isActive ? 'Active Theme' : 'Apply Theme'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
