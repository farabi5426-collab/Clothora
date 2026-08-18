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
  const { activeTheme, customColors, setTheme, setCustomColors } = useThemeStore();
  const [saving, setSaving] = useState(false);
  
  const [customAccent, setCustomAccent] = useState(customColors.accent);
  const [customBackground, setCustomBackground] = useState(customColors.background);
  const [customText, setCustomText] = useState(customColors.text);

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

  const handleSaveCustomTheme = async () => {
    setSaving(true);
    try {
      await setCustomColors({
        accent: customAccent,
        background: customBackground,
        text: customText
      });
      toast.success('Custom theme applied successfully!');
    } catch (error) {
      toast.error('Failed to update custom theme.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-12">
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

      <div className="space-y-8 pt-8 border-t border-outline-variant">
        <div>
          <h2 className="text-3xl font-black tracking-tighter uppercase mb-1">Custom Theme Builder</h2>
          <p className="text-xs text-on-surface-variant uppercase tracking-widest">Create your own branded color combination</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-surface-container-lowest p-6 border-2 border-surface-bright space-y-6">
            <h3 className="text-lg font-bold uppercase tracking-widest border-b-2 border-surface-bright pb-2">Color Setup</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Accent / Primary Color</label>
                <div className="flex gap-4">
                  <input 
                    type="color" 
                    value={customAccent} 
                    onChange={(e) => setCustomAccent(e.target.value)}
                    className="h-10 w-20 cursor-pointer bg-transparent border-0 p-0"
                  />
                  <input 
                    type="text" 
                    value={customAccent} 
                    onChange={(e) => setCustomAccent(e.target.value)}
                    className="flex-1 bg-surface border-2 border-surface-bright p-2 text-sm uppercase outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Background Color</label>
                <div className="flex gap-4">
                  <input 
                    type="color" 
                    value={customBackground} 
                    onChange={(e) => setCustomBackground(e.target.value)}
                    className="h-10 w-20 cursor-pointer bg-transparent border-0 p-0"
                  />
                  <input 
                    type="text" 
                    value={customBackground} 
                    onChange={(e) => setCustomBackground(e.target.value)}
                    className="flex-1 bg-surface border-2 border-surface-bright p-2 text-sm uppercase outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Text Color</label>
                <div className="flex gap-4">
                  <input 
                    type="color" 
                    value={customText} 
                    onChange={(e) => setCustomText(e.target.value)}
                    className="h-10 w-20 cursor-pointer bg-transparent border-0 p-0"
                  />
                  <input 
                    type="text" 
                    value={customText} 
                    onChange={(e) => setCustomText(e.target.value)}
                    className="flex-1 bg-surface border-2 border-surface-bright p-2 text-sm uppercase outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleSaveCustomTheme}
              disabled={saving}
              className="w-full py-4 bg-primary text-on-primary font-black uppercase tracking-widest border-2 border-primary hover:bg-primary/90 transition-colors"
            >
              {activeTheme === 'theme-custom' ? 'Update Custom Theme' : 'Apply Custom Theme'}
            </button>
          </div>

          <div className="bg-surface-container-lowest p-6 border-2 border-surface-bright flex flex-col justify-center items-center" style={{ backgroundColor: customBackground }}>
            <div className="w-full max-w-sm space-y-6">
              <h3 className="text-2xl font-black uppercase tracking-tighter" style={{ color: customText }}>Live Preview</h3>
              <p className="text-sm font-bold opacity-80" style={{ color: customText }}>This is how your storefront will look with these colors applied.</p>
              
              <div className="p-4 border-2 shadow-lg" style={{ borderColor: customText, backgroundColor: customBackground }}>
                <div className="h-32 w-full mb-4 flex items-center justify-center opacity-20 border-2" style={{ borderColor: customText }}>
                  Image Placeholder
                </div>
                <h4 className="font-bold mb-2 uppercase" style={{ color: customText }}>Product Title</h4>
                <div className="font-black text-xl mb-4" style={{ color: customAccent }}>৳999</div>
                <button className="w-full py-2 font-bold uppercase tracking-widest transition-opacity hover:opacity-80" style={{ backgroundColor: customAccent, color: customBackground }}>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
