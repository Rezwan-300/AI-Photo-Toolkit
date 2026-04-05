import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, FileDown, User, Eraser, ArrowRight, RefreshCw, Palette } from 'lucide-react';
import { motion } from 'motion/react';
import { AdRenderer, useAds } from './AdContext';
import { HowToUse } from './HowToUse';
import { cn } from '../lib/utils';

const TOOLS = [
  {
    id: 'enhancer',
    name: 'AI Photo Enhancer',
    description: 'Improve quality, lighting, and sharpness automatically.',
    icon: Sparkles,
    color: 'blue',
    path: '/enhance'
  },
  {
    id: 'compressor',
    name: 'Image Compressor',
    description: 'Reduce file size without losing visible quality.',
    icon: FileDown,
    color: 'emerald',
    path: '/compress'
  },
  {
    id: 'passport',
    name: 'Passport Photo Maker',
    description: 'Auto-crop to official sizes with background options.',
    icon: User,
    color: 'purple',
    path: '/passport'
  },
  {
    id: 'remover',
    name: 'Object Remover',
    description: 'Remove unwanted elements using AI inpainting.',
    icon: Eraser,
    color: 'rose',
    path: '/remove'
  },
  {
    id: 'converter',
    name: 'Format Converter',
    description: 'Convert between JPG, PNG, and WebP instantly.',
    icon: RefreshCw,
    color: 'amber',
    path: '/convert'
  },
  {
    id: 'colorizer',
    name: 'Old Photo Colorizer',
    description: 'Bring old memories back to life with AI colorization.',
    icon: Palette,
    color: 'indigo',
    path: '/colorize'
  }
];

export function Home() {
  const { settings } = useAds();

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
            Professional AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Photo Toolkit</span>
          </h1>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto mb-10">
            Enhance, compress, and edit your photos with our suite of advanced AI-powered tools. Fast, secure, and free.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#tools" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-500/20">
              Get Started
            </a>
            <a href="#how-to-use" className="px-8 py-4 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-2xl transition-all">
              Learn More
            </a>
          </div>
        </motion.div>
      </section>

      <div className="max-w-6xl mx-auto px-4">
        <AdRenderer html={settings?.header_ad} />
      </div>

      {/* Tools Grid */}
      <section id="tools" className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-6">
          {TOOLS.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={tool.path}
                className="group relative block bg-neutral-900/40 border border-neutral-800 p-8 rounded-[2.5rem] hover:border-blue-500/50 transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative z-10 flex items-start justify-between">
                  <div className="space-y-4">
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                      tool.color === 'blue' && "bg-blue-500/10 text-blue-400",
                      tool.color === 'emerald' && "bg-emerald-500/10 text-emerald-400",
                      tool.color === 'purple' && "bg-purple-500/10 text-purple-400",
                      tool.color === 'rose' && "bg-rose-500/10 text-rose-400",
                      tool.color === 'amber' && "bg-amber-500/10 text-amber-400",
                      tool.color === 'indigo' && "bg-indigo-500/10 text-indigo-400",
                    )}>
                      <tool.icon className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{tool.name}</h3>
                      <p className="text-neutral-400 leading-relaxed max-w-xs">{tool.description}</p>
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                    <ArrowRight className="w-5 h-5 text-white" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <HowToUse />
      
      <div className="max-w-4xl mx-auto mb-16 px-4">
        <AdRenderer html={settings?.footer_ad} />
      </div>
    </div>
  );
}
