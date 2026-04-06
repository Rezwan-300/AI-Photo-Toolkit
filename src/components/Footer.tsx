import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileText, Info, Mail, Github, Twitter, Instagram } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-white/5 pt-24 pb-12 px-4 selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.3)]">
                <span className="text-2xl font-black text-white">AI</span>
              </div>
              <h2 className="text-2xl font-black tracking-tighter text-white">PHOTO ENGINE</h2>
            </div>
            <p className="text-neutral-400 text-lg leading-relaxed">
              Professional-grade AI image processing tools for creators, developers, and businesses. 
              Fast, secure, and always free.
            </p>
            <div className="flex gap-6">
              <a href="#" className="w-12 h-12 bg-neutral-900 hover:bg-neutral-800 rounded-xl flex items-center justify-center transition-all border border-white/5">
                <Twitter className="w-5 h-5 text-neutral-400" />
              </a>
              <a href="#" className="w-12 h-12 bg-neutral-900 hover:bg-neutral-800 rounded-xl flex items-center justify-center transition-all border border-white/5">
                <Github className="w-5 h-5 text-neutral-400" />
              </a>
              <a href="#" className="w-12 h-12 bg-neutral-900 hover:bg-neutral-800 rounded-xl flex items-center justify-center transition-all border border-white/5">
                <Instagram className="w-5 h-5 text-neutral-400" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-8 flex items-center gap-3">
              <Info className="w-5 h-5 text-blue-500" /> Company
            </h3>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-neutral-400 hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-neutral-400 hover:text-blue-400 transition-colors">Contact</Link></li>
              <li><Link to="/careers" className="text-neutral-400 hover:text-blue-400 transition-colors">Careers</Link></li>
              <li><Link to="/blog" className="text-neutral-400 hover:text-blue-400 transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-8 flex items-center gap-3">
              <Shield className="w-5 h-5 text-blue-500" /> Legal
            </h3>
            <ul className="space-y-4">
              <li><Link to="/privacy" className="text-neutral-400 hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-neutral-400 hover:text-blue-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/cookies" className="text-neutral-400 hover:text-blue-400 transition-colors">Cookie Policy</Link></li>
              <li><Link to="/gdpr" className="text-neutral-400 hover:text-blue-400 transition-colors">GDPR Compliance</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-8 flex items-center gap-3">
              <Mail className="w-5 h-5 text-blue-500" /> Newsletter
            </h3>
            <p className="text-neutral-400 mb-6">Stay updated with our latest AI tools and features.</p>
            <form className="relative">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-neutral-900 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500/50 transition-all"
              />
              <button className="absolute right-2 top-2 bottom-2 px-6 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all">
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-wrap justify-between items-center gap-8">
          <p className="text-neutral-500 font-medium">
            © {currentYear} AI Photo Engine. All rights reserved.
          </p>
          <div className="flex gap-8 text-neutral-500 font-medium">
            <span>Built with AI</span>
            <span>Powered by Flask & Sharp</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
