import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, FileDown, User, Eraser, RefreshCw, Palette, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { AdRenderer, useAds } from './AdContext';
import { cn } from '../lib/utils';

const TOOLS = [
  {
    id: 'enhancer',
    name: 'AI Photo Enhancer',
    description: 'Sharpen, denoise, and improve lighting automatically.',
    icon: Sparkles,
    color: 'blue',
    path: '/enhance'
  },
  {
    id: 'compressor',
    name: 'Image Compressor',
    description: 'Reduce file size with optimized Pillow compression.',
    icon: FileDown,
    color: 'emerald',
    path: '/compress'
  },
  {
    id: 'passport',
    name: 'Passport Photo Maker',
    description: 'Auto-crop to 2x2" or 35x45mm with background options.',
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
  const { ads } = useAds();

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      {/* Global Header Ad */}
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <AdRenderer html={ads?.Global_Header} className="w-full" />
      </div>

      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.1),transparent_50%)]" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-4xl mx-auto"
        >
          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-500">
            AI PHOTO <span className="text-blue-500">ENGINE</span>
          </h1>
          <p className="text-xl text-neutral-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            The all-in-one production-ready toolkit for professional image processing. 
            Powered by advanced AI for enhancement, compression, and more.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6">
            <a href="#tools" className="px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-[0_0_40px_rgba(37,99,235,0.3)] hover:scale-105">
              Explore Tools
            </a>
            <Link to="/admin" className="px-10 py-5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all border border-white/10 backdrop-blur-xl">
              Admin Dashboard
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Hero Ad Slot */}
      <div className="max-w-5xl mx-auto px-4 mb-24">
        <AdRenderer html={ads?.Home_Hero_Ad} className="w-full" />
      </div>

      {/* Tools Grid */}
      <section id="tools" className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TOOLS.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={tool.path}
                className="group relative block h-full bg-neutral-900/40 border border-white/5 p-10 rounded-[3rem] hover:border-blue-500/50 transition-all overflow-hidden backdrop-blur-3xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative z-10">
                  <div className={cn(
                    "w-20 h-20 rounded-[2rem] flex items-center justify-center mb-8 transition-all group-hover:scale-110 group-hover:rotate-3",
                    tool.color === 'blue' && "bg-blue-500/10 text-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.1)]",
                    tool.color === 'emerald' && "bg-emerald-500/10 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.1)]",
                    tool.color === 'purple' && "bg-purple-500/10 text-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.1)]",
                    tool.color === 'rose' && "bg-rose-500/10 text-rose-400 shadow-[0_0_30px_rgba(244,63,94,0.1)]",
                    tool.color === 'amber' && "bg-amber-500/10 text-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.1)]",
                    tool.color === 'indigo' && "bg-indigo-500/10 text-indigo-400 shadow-[0_0_30px_rgba(99,102,241,0.1)]",
                  )}>
                    <tool.icon className="w-10 h-10" />
                  </div>
                  
                  <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">{tool.name}</h3>
                  <p className="text-neutral-400 text-lg leading-relaxed mb-8">{tool.description}</p>
                  
                  <div className="flex items-center text-blue-500 font-bold group-hover:translate-x-2 transition-transform">
                    Get Started <ArrowRight className="ml-2 w-5 h-5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
