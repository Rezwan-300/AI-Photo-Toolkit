import React, { useState } from 'react';
import { Sparkles, FileDown, User, Eraser, RefreshCw, Palette } from 'lucide-react';
import { ToolPage } from './ToolPage';

export function Enhance() {
  return (
    <ToolPage
      toolId="enhance"
      title="AI Photo Enhancer"
      description="Sharpen, denoise, and improve lighting automatically using advanced AI models."
      icon={Sparkles}
      options={
        <div className="space-y-4">
          <label className="block text-sm font-bold text-neutral-400 uppercase tracking-widest">Enhancement Level</label>
          <div className="grid grid-cols-3 gap-4">
            {['Standard', 'High', 'Ultra'].map(level => (
              <button key={level} className="py-3 bg-white/5 border border-white/5 rounded-xl text-white font-bold hover:bg-white/10 transition-all">
                {level}
              </button>
            ))}
          </div>
        </div>
      }
    />
  );
}

export function Compress() {
  const [quality, setQuality] = useState(80);
  return (
    <ToolPage
      toolId="compress"
      title="Image Compressor"
      description="Reduce file size with optimized Pillow compression while maintaining visual quality."
      icon={FileDown}
      getOptions={() => ({ quality })}
      options={
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-neutral-400 uppercase tracking-widest">Compression Quality</label>
            <span className="text-blue-500 font-black text-xl">{quality}%</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="100" 
            value={quality} 
            onChange={(e) => setQuality(parseInt(e.target.value))}
            className="w-full h-2 bg-neutral-800 rounded-full appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs font-bold text-neutral-500 uppercase tracking-widest">
            <span>Smallest Size</span>
            <span>Best Quality</span>
          </div>
        </div>
      }
    />
  );
}

export function Passport() {
  const [type, setType] = useState('2x2');
  const [bgColor, setBgColor] = useState('original');

  return (
    <ToolPage
      toolId="passport"
      title="Passport Photo Maker"
      description="Auto-crop to 2x2 inch or 35x45mm formats with background options."
      icon={User}
      getOptions={() => ({ type, bgColor })}
      options={
        <div className="space-y-8">
          <div className="space-y-4">
            <label className="block text-sm font-bold text-neutral-400 uppercase tracking-widest">Photo Format</label>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setType('2x2')}
                className={`py-4 rounded-2xl font-bold transition-all border ${type === '2x2' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/5 text-neutral-400'}`}
              >
                2x2 inch (US)
              </button>
              <button 
                onClick={() => setType('35x45')}
                className={`py-4 rounded-2xl font-bold transition-all border ${type === '35x45' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/5 text-neutral-400'}`}
              >
                35x45 mm (EU)
              </button>
            </div>
          </div>
          <div className="space-y-4">
            <label className="block text-sm font-bold text-neutral-400 uppercase tracking-widest">Background Color</label>
            <div className="flex gap-4">
              {[
                { id: 'original', color: 'transparent', label: 'Original' },
                { id: 'white', color: '#FFFFFF', label: 'White' },
                { id: 'blue', color: '#0000FF', label: 'Blue' }
              ].map(bg => (
                <button 
                  key={bg.id}
                  onClick={() => setBgColor(bg.id === 'original' ? 'original' : bg.color)}
                  className={`w-12 h-12 rounded-full border-2 transition-all ${bgColor === (bg.id === 'original' ? 'original' : bg.color) ? 'border-blue-500 scale-110 shadow-[0_0_20px_rgba(37,99,235,0.3)]' : 'border-white/10'}`}
                  style={{ backgroundColor: bg.id === 'original' ? 'transparent' : bg.color }}
                  title={bg.label}
                />
              ))}
            </div>
          </div>
        </div>
      }
    />
  );
}

export function Remove() {
  return (
    <ToolPage
      toolId="remove"
      title="Object Remover"
      description="Remove unwanted elements using AI inpainting. Simply paint over the object."
      icon={Eraser}
      options={
        <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-400 text-sm font-medium leading-relaxed">
          AI Inpainting is currently in beta. For best results, ensure the object is clearly defined against the background.
        </div>
      }
    />
  );
}

export function Convert() {
  const [format, setFormat] = useState('webp');
  return (
    <ToolPage
      toolId="convert"
      title="Format Converter"
      description="Convert between JPG, PNG, and WebP instantly with AI optimization."
      icon={RefreshCw}
      getOptions={() => ({ format })}
      options={
        <div className="space-y-4">
          <label className="block text-sm font-bold text-neutral-400 uppercase tracking-widest">Target Format</label>
          <div className="grid grid-cols-3 gap-4">
            {['JPG', 'PNG', 'WebP'].map(f => (
              <button 
                key={f}
                onClick={() => setFormat(f.toLowerCase())}
                className={`py-4 rounded-2xl font-bold transition-all border ${format === f.toLowerCase() ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/5 text-neutral-400'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      }
    />
  );
}

export function Colorize() {
  return (
    <ToolPage
      toolId="colorize"
      title="Old Photo Colorizer"
      description="Bring old memories back to life with AI colorization and restoration."
      icon={Palette}
      options={
        <div className="p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400 text-sm font-medium leading-relaxed">
          Our restoration model automatically detects faces and applies natural skin tones.
        </div>
      }
    />
  );
}
