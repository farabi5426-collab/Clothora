import React, { useState } from 'react';
import { useLayoutStore } from '../../store/layoutStore';
import toast from 'react-hot-toast';
import { LayoutTemplate, CheckCircle } from 'lucide-react';

const LAYOUTS = [
  {
    id: 'layout-classic',
    name: 'Classic Grid',
    description: 'Standard 4-column responsive grid',
    icon: 'grid_view'
  },
  {
    id: 'layout-lookbook',
    name: 'Lookbook',
    description: 'Single-column, full-width immersive scroll',
    icon: 'view_agenda'
  },
  {
    id: 'layout-masonry',
    name: 'Masonry Grid',
    description: 'Pinterest-style uneven columns',
    icon: 'dashboard_customize'
  },
  {
    id: 'layout-horizontal',
    name: 'Horizontal Gallery',
    description: 'Left-to-right scrolling carousel',
    icon: 'view_carousel'
  },
  {
    id: 'layout-magazine',
    name: 'Magazine Style',
    description: 'Asymmetrical grid layout',
    icon: 'auto_awesome_mosaic'
  },
  {
    id: 'layout-splitscreen',
    name: 'Split Screen',
    description: 'Sticky hero left, scrolling products right',
    icon: 'splitscreen'
  }
];

export default function LayoutManagement() {
  const { activeLayout, setLayout } = useLayoutStore();
  const [saving, setSaving] = useState(false);

  const handleSaveLayout = async (layoutId: string) => {
    setSaving(true);
    try {
      await setLayout(layoutId);
      toast.success('Layout updated successfully! Changes are live.');
    } catch (error) {
      toast.error('Failed to update layout.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase mb-1">Store Layouts</h1>
          <p className="text-xs text-[#ffffff60] uppercase tracking-widest">Manage your storefront's structural layout</p>
        </div>
        <div className="bg-[#ff4e00]/10 text-[#ff4e00] px-4 py-2 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
          <LayoutTemplate className="w-4 h-4" /> Live Preview
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {LAYOUTS.map((layout) => {
          const isActive = activeLayout === layout.id;
          
          return (
            <div 
              key={layout.id}
              className={`bg-[#111] border transition-all duration-300 ${isActive ? 'border-[#ff4e00] shadow-[0_0_15px_rgba(255,78,0,0.3)]' : 'border-[#ffffff15] hover:border-[#ffffff40]'}`}
            >
              <div className="h-32 p-4 flex flex-col items-center justify-center relative border-b border-[#ffffff15] bg-[#0a0a0a]">
                 <span className="material-symbols-outlined text-[48px] text-[#ffffff80] group-hover:text-white transition-colors">{layout.icon}</span>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-black uppercase tracking-widest text-white">{layout.name}</h3>
                  {isActive && <CheckCircle className="w-5 h-5 text-[#ff4e00]" />}
                </div>
                <p className="text-[#ffffff60] text-xs font-bold uppercase tracking-widest mb-4">{layout.description}</p>
                <button
                  onClick={() => handleSaveLayout(layout.id)}
                  disabled={isActive || saving}
                  className={`w-full py-3 text-xs font-bold uppercase tracking-widest transition-colors ${
                    isActive 
                      ? 'bg-[#1a1a1a] text-[#ffffff60] cursor-default'
                      : 'bg-[#ff4e00] text-white hover:bg-[#e64600]'
                  }`}
                >
                  {isActive ? 'Active Layout' : 'Apply Layout'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
