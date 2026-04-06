import React, { createContext, useContext, useEffect, useState } from 'react';

interface AdSettings {
  Global_Header: string;
  Home_Hero_Ad: string;
  Sidebar_Ad: string;
  Download_Page_Ad: string;
}

interface User {
  id: string;
  displayName: string;
  emails: { value: string }[];
  photos: { value: string }[];
}

interface AdContextType {
  ads: AdSettings | null;
  user: User | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

const AdContext = createContext<AdContextType>({
  ads: null,
  user: null,
  loading: true,
  refresh: async () => {},
});

export const useAds = () => useContext(AdContext);

export function AdProvider({ children }: { children: React.ReactNode }) {
  const [ads, setAds] = useState<AdSettings | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [adsRes, userRes] = await Promise.all([
        fetch('/api/ads'),
        fetch('/api/user')
      ]);
      const adsData = await adsRes.json();
      const userData = await userRes.json();
      setAds(adsData);
      setUser(userData);
    } catch (e) {
      console.error("Failed to fetch data", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <AdContext.Provider value={{ ads, user, loading, refresh: fetchData }}>
      {children}
    </AdContext.Provider>
  );
}

export function AdRenderer({ html, className }: { html?: string; className?: string }) {
  if (!html || html.includes('<!--')) {
    return (
      <div className={`bg-neutral-900/50 border border-dashed border-neutral-800 rounded-xl flex items-center justify-center p-8 text-neutral-600 font-mono text-sm ${className}`}>
        [ AD SLOT: {html?.replace('<!-- ', '').replace(' -->', '') || 'Placeholder'} ]
      </div>
    );
  }

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: html }} 
    />
  );
}
