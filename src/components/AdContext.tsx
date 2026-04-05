import React, { createContext, useContext, useEffect, useState } from 'react';

interface AdSettings {
  header_ad: string;
  sidebar_ad: string;
  above_download_ad: string;
  footer_ad: string;
}

const AdContext = createContext<{ settings: AdSettings | null; refresh: () => void }>({
  settings: null,
  refresh: () => {},
});

export const useAds = () => useContext(AdContext);

export function AdProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AdSettings | null>(null);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setSettings(data);
    } catch (e) {
      console.error("Failed to fetch ad settings", e);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <AdContext.Provider value={{ settings, refresh: fetchSettings }}>
      {children}
    </AdContext.Provider>
  );
}

export function AdRenderer({ html, className }: { html?: string; className?: string }) {
  if (!html) return null;
  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: html }} 
    />
  );
}
