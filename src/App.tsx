import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Camera, Menu, X, Shield, Info, Mail } from 'lucide-react';
import { Home } from './components/Home';
import { Enhance, Compress, Passport, Remove, Convert, Colorize } from './components/Tools';
import { AdProvider, AdRenderer, useAds } from './components/AdContext';
import { Footer } from './components/Footer';
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
    <nav className="sticky top-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-[0_0_30px_rgba(37,99,235,0.3)]">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black text-white tracking-tighter">AI PHOTO ENGINE</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-sm font-bold transition-all hover:text-blue-500 tracking-wide uppercase",
                  location.pathname === item.path ? "text-blue-500" : "text-neutral-400"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-3 bg-white/5 rounded-xl text-neutral-400 hover:text-white"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-neutral-900 border-b border-white/5 py-6 px-4 space-y-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={cn(
                "block px-6 py-4 rounded-2xl text-lg font-bold transition-all",
                location.pathname === item.path ? "bg-blue-600 text-white shadow-lg" : "text-neutral-400 hover:bg-white/5"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

function Layout() {
  return (
    <div className="min-h-screen bg-black text-neutral-200 selection:bg-blue-500/30 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/enhance" element={<Enhance />} />
          <Route path="/compress" element={<Compress />} />
          <Route path="/passport" element={<Passport />} />
          <Route path="/remove" element={<Remove />} />
          <Route path="/convert" element={<Convert />} />
          <Route path="/colorize" element={<Colorize />} />
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
