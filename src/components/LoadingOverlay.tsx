import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function LoadingOverlay({ isVisible, message = "AI is processing your image..." }: { isVisible: boolean; message?: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isVisible) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) return 100;
          return prev + (100 / 30); // 3 seconds total (30 steps of 100ms)
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-6"
        >
          <div className="max-w-md w-full text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-12"
            >
              <div className="w-24 h-24 bg-blue-600/20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 relative">
                <div className="absolute inset-0 border-4 border-blue-500/20 rounded-[2rem]" />
                <div 
                  className="absolute inset-0 border-4 border-blue-500 rounded-[2rem] transition-all duration-300" 
                  style={{ clipPath: `inset(${100 - progress}% 0 0 0)` }}
                />
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
              <h2 className="text-3xl font-black text-white mb-4 tracking-tight">{message}</h2>
              <p className="text-neutral-400">Our advanced AI models are optimizing your photo for the best results.</p>
            </motion.div>

            <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden mb-4">
              <motion.div 
                className="h-full bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.5)]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <div className="flex justify-between text-xs font-bold text-neutral-500 uppercase tracking-widest">
              <span>Analyzing Pixels</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
