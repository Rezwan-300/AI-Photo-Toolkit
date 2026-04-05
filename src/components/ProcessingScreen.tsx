import React, { useState, useEffect } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { AdSlot } from './AdSlot';

interface ProcessingScreenProps {
  isProcessing: boolean;
  onComplete: () => void;
  message?: string;
}

export function ProcessingScreen({ isProcessing, onComplete, message = "AI is processing your image..." }: ProcessingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isProcessing) {
      setProgress(0);
      const startTime = Date.now();
      const duration = 3000; // 3 seconds delay as requested

      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min((elapsed / duration) * 100, 100);
        setProgress(newProgress);

        if (elapsed >= duration) {
          clearInterval(interval);
          onComplete();
        }
      }, 50);

      return () => clearInterval(interval);
    }
  }, [isProcessing, onComplete]);

  if (!isProcessing) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="relative inline-block">
          <div className="w-24 h-24 bg-blue-600/20 rounded-3xl flex items-center justify-center animate-pulse">
            <Sparkles className="w-12 h-12 text-blue-500" />
          </div>
          <div className="absolute -top-2 -right-2">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-white tracking-tight">{message}</h2>
          <p className="text-neutral-400">Please wait while our AI optimizes your photo. This usually takes a few seconds.</p>
        </div>

        <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-blue-600 h-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="pt-8">
          <AdSlot type="inline" className="bg-neutral-900/50 border-neutral-800" />
          <p className="text-[10px] text-neutral-600 mt-4 uppercase tracking-[0.2em]">Sponsored Content</p>
        </div>
      </div>
    </div>
  );
}
