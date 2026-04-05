import React, { useState, useEffect } from 'react';
import { Settings, Lock, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAds } from './AdContext';

export function Admin() {
  const { settings: currentSettings, refresh } = useAds();
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [settings, setSettings] = useState({
    header_ad: '',
    sidebar_ad: '',
    above_download_ad: '',
    footer_ad: '',
  });
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (currentSettings) {
      setSettings(currentSettings);
    }
  }, [currentSettings]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin') { // Basic password check for demo
      setIsAuthenticated(true);
    } else {
      setStatus({ type: 'error', message: 'Invalid password' });
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, settings }),
      });
      
      if (res.ok) {
        setStatus({ type: 'success', message: 'Settings saved successfully!' });
        refresh();
      } else {
        setStatus({ type: 'error', message: 'Failed to save settings' });
      }
    } catch (e) {
      setStatus({ type: 'error', message: 'An error occurred' });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 p-8 rounded-3xl space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-blue-500" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Access</h1>
            <p className="text-neutral-500 text-sm mt-2">Enter your password to manage ad settings.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin Password"
              className="w-full px-4 py-3 bg-black border border-neutral-800 rounded-xl text-white focus:border-blue-500 outline-none transition-all"
            />
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all"
            >
              Login
            </button>
          </form>

          {status?.type === 'error' && (
            <div className="flex items-center gap-2 text-red-400 text-sm justify-center">
              <AlertCircle className="w-4 h-4" />
              {status.message}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Ad Manager</h1>
            <p className="text-neutral-500">Configure your AdSense codes here.</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-all"
        >
          <Save className="w-5 h-5" />
          Save Changes
        </button>
      </div>

      {status && (
        <div className={`mb-8 p-4 rounded-xl flex items-center gap-3 ${
          status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
        }`}>
          {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {status.message}
        </div>
      )}

      <div className="grid gap-8">
        {[
          { id: 'header_ad', label: 'Header Ad Code', desc: 'Appears at the very top of all pages.' },
          { id: 'sidebar_ad', label: 'Sidebar Ad Code', desc: 'Appears on the right side of tool pages.' },
          { id: 'above_download_ad', label: 'Above Download Ad Code', desc: 'Appears exactly above the download button.' },
          { id: 'footer_ad', label: 'Footer Ad Code', desc: 'Appears at the bottom of all pages.' },
        ].map((ad) => (
          <div key={ad.id} className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-white">{ad.label}</h3>
                <p className="text-sm text-neutral-500">{ad.desc}</p>
              </div>
            </div>
            <textarea
              value={(settings as any)[ad.id]}
              onChange={(e) => setSettings({ ...settings, [ad.id]: e.target.value })}
              placeholder="Paste your AdSense code here..."
              className="w-full h-32 px-4 py-3 bg-black border border-neutral-800 rounded-xl text-neutral-300 font-mono text-sm focus:border-blue-500 outline-none transition-all resize-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
