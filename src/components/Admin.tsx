import React, { useState, useEffect } from 'react';
import { Layout, Save, LogIn, LogOut, ShieldCheck, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useAds } from './AdContext';

export function Admin() {
  const { ads, user, loading, refresh } = useAds();
  const [formData, setFormData] = useState({
    Global_Header: '',
    Home_Hero_Ad: '',
    Sidebar_Ad: '',
    Download_Page_Ad: ''
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (ads) {
      setFormData(ads);
    }
  }, [ads]);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Ad configurations saved successfully!' });
        await refresh();
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Failed to save configurations' });
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'An error occurred while saving' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center">
              <Layout className="w-8 h-8 text-blue-500" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight">AD MANAGER</h1>
              <p className="text-neutral-400">WordPress-style visual ad configuration</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-white">Public Mode</p>
              <p className="text-xs text-neutral-500">Ad Manager</p>
            </div>
          </div>
        </div>

        {message && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-2xl mb-8 border ${
              message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}
          >
            {message.text}
          </motion.div>
        )}

        <div className="grid gap-8">
          {Object.keys(formData).map((key) => (
            <div key={key} className="bg-neutral-900/40 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-3xl">
              <label className="block text-sm font-bold text-neutral-400 uppercase tracking-widest mb-4">
                {key.replace(/_/g, ' ')}
              </label>
              <textarea
                value={(formData as any)[key]}
                onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                className="w-full h-48 bg-black/50 border border-white/10 rounded-2xl p-6 text-neutral-300 font-mono text-sm focus:border-blue-500/50 outline-none transition-all resize-none"
                placeholder="Paste your AdSense code here..."
              />
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-3 px-12 py-5 bg-blue-600 hover:bg-blue-500 disabled:bg-neutral-800 text-white font-bold rounded-2xl transition-all shadow-[0_0_40px_rgba(37,99,235,0.2)]"
          >
            {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
            Save Configurations
          </button>
        </div>
      </div>
    </div>
  );
}
