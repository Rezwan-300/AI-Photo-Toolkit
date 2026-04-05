import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Camera, Menu, X, Settings } from 'lucide-react';
import { Home } from './components/Home';
import { Enhancer } from './components/Enhancer';
import { Compressor } from './components/Compressor';
import { PassportMaker } from './components/PassportMaker';
import { ObjectRemover } from './components/ObjectRemover';
import { FormatConverter } from './components/FormatConverter';
import { Colorizer } from './components/Colorizer';
import { Admin } from './components/Admin';
import { AdProvider, AdRenderer, useAds } from './components/AdContext';
import { cn } from './lib/utils';

function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Enhancer', path: '/enhance' },
    { name: 'Compressor', path: '/compress' },
    { name: 'Passport Maker', path: '/passport' },
    { name: 'Object Remover', path: '/remove' },
    { name: 'Converter', path: '/convert' },
    { name: 'Colorizer', path: '/colorize' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-black/50 backdrop-blur-xl border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">AI Photo Toolkit</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-blue-400",
                  location.pathname === item.path ? "text-blue-400" : "text-neutral-400"
                )}
              >
                {item.name}
              </Link>
            ))}
            <Link to="/admin" className="p-2 text-neutral-500 hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-neutral-400 hover:text-white"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-neutral-900 border-b border-neutral-800 py-4 px-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={cn(
                "block px-4 py-3 rounded-xl text-base font-medium transition-colors",
                location.pathname === item.path ? "bg-blue-600 text-white" : "text-neutral-400 hover:bg-neutral-800"
              )}
            >
              {item.name}
            </Link>
          ))}
          <Link
            to="/admin"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-3 rounded-xl text-base font-medium text-neutral-400 hover:bg-neutral-800"
          >
            Admin Panel
          </Link>
        </div>
      )}
    </nav>
  );
}

function Footer() {
  const { settings } = useAds();
  return (
    <footer className="bg-black border-t border-neutral-800 pt-16 pb-8 px-4">
      <div className="max-w-7xl mx-auto mb-12">
        <AdRenderer html={settings?.footer_ad} className="mb-12" />
        <div className="grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">AI Photo Toolkit</span>
            </div>
            <p className="text-neutral-500 max-w-sm leading-relaxed">
              The ultimate suite of AI-powered image processing tools. Enhance, compress, and edit your photos with professional quality in seconds.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Tools</h4>
            <ul className="space-y-4 text-neutral-500 text-sm">
              <li><Link to="/enhance" className="hover:text-blue-400 transition-colors">Photo Enhancer</Link></li>
              <li><Link to="/compress" className="hover:text-blue-400 transition-colors">Image Compressor</Link></li>
              <li><Link to="/passport" className="hover:text-blue-400 transition-colors">Passport Maker</Link></li>
              <li><Link to="/remove" className="hover:text-blue-400 transition-colors">Object Remover</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-neutral-500 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pt-8 border-t border-neutral-900 text-center text-neutral-600 text-xs">
        © {new Date().getFullYear()} AI Photo Toolkit. All rights reserved.
      </div>
    </footer>
  );
}

function Layout() {
  const { settings } = useAds();
  return (
    <div className="min-h-screen bg-black text-neutral-200 selection:bg-blue-500/30">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <AdRenderer html={settings?.header_ad} />
      </div>
      <main className="min-h-[calc(100vh-80px)]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/enhance" element={<Enhancer />} />
          <Route path="/compress" element={<Compressor />} />
          <Route path="/passport" element={<PassportMaker />} />
          <Route path="/remove" element={<ObjectRemover />} />
          <Route path="/convert" element={<FormatConverter />} />
          <Route path="/colorize" element={<Colorizer />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AdProvider>
        <Layout />
      </AdProvider>
    </Router>
  );
}
