import React, { useState } from 'react';
import { ImageUpload } from './ImageUpload';
import { ProcessingScreen } from './ProcessingScreen';
import { AdRenderer, useAds } from './AdContext';
import { Download, FileDown, Info, Loader2 } from 'lucide-react';

export function Compressor() {
  const { settings } = useAds();
  const [image, setImage] = useState<string | null>(null);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [quality, setQuality] = useState(80);
  const [stats, setStats] = useState<{ original: number; compressed: number } | null>(null);

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
      setStats({ original: file.size, compressed: 0 });
    };
    reader.readAsDataURL(file);
    setCompressedImage(null);
  };

  const handleCompress = async () => {
    if (!image) return;
    setIsLoading(true);

    try {
      const formData = new FormData();
      const blob = await fetch(image).then(r => r.blob());
      formData.append('image', blob);
      formData.append('tool', 'compress');
      formData.append('options', JSON.stringify({ quality }));

      const res = await fetch('/api/process', {
        method: 'POST',
        body: formData,
      });
      
      const data = await res.json();
      if (data.image) {
        setCompressedImage(data.image);
        setStats(prev => ({ ...prev!, compressed: data.size }));
        setIsProcessing(true);
      }
    } catch (error) {
      console.error("Compression failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const downloadImage = () => {
    if (!compressedImage) return;
    const link = document.createElement('a');
    link.href = compressedImage;
    link.download = 'compressed-photo.jpg';
    link.click();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <ProcessingScreen 
        isProcessing={isProcessing} 
        onComplete={() => setIsProcessing(false)} 
        message="Compressing Image..."
      />

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <div className="bg-neutral-900/60 border border-neutral-800 p-6 rounded-3xl">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <FileDown className="w-6 h-6 text-blue-400" />
              Image Compressor
            </h2>
            <p className="text-neutral-400 mb-6">Reduce file size without losing visible quality.</p>

            <ImageUpload
              onUpload={handleUpload}
              onClear={() => { setImage(null); setCompressedImage(null); setStats(null); }}
              currentImage={compressedImage || image}
            />

            {image && !compressedImage && (
              <div className="mt-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Compression Quality</span>
                    <span className="text-blue-400 font-medium">{quality}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(parseInt(e.target.value))}
                    className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <p className="text-xs text-neutral-500 italic">Lower quality results in smaller file size.</p>
                </div>

                <button
                  onClick={handleCompress}
                  disabled={isLoading}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-neutral-800 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FileDown className="w-5 h-5" />
                      Compress Image
                    </>
                  )}
                </button>
              </div>
            )}

            {compressedImage && !isProcessing && stats && (
              <div className="mt-8 space-y-6">
                <AdRenderer html={settings?.above_download_ad} />
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-neutral-800/50 p-4 rounded-2xl border border-neutral-800">
                    <span className="text-xs text-neutral-500 block mb-1 uppercase tracking-wider">Original</span>
                    <span className="text-lg font-bold text-white">{formatSize(stats.original)}</span>
                  </div>
                  <div className="bg-blue-500/10 p-4 rounded-2xl border border-blue-500/20">
                    <span className="text-xs text-blue-400 block mb-1 uppercase tracking-wider">Compressed</span>
                    <span className="text-lg font-bold text-white">{formatSize(stats.compressed)}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setCompressedImage(null)}
                    className="flex-1 py-4 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-2xl transition-all"
                  >
                    Adjust Quality
                  </button>
                  <button
                    onClick={downloadImage}
                    className="flex-1 py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Download
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:w-80 space-y-6">
          <AdRenderer html={settings?.sidebar_ad} />
          <div className="bg-neutral-900/60 border border-neutral-800 p-6 rounded-3xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-400" />
              Why Compress?
            </h3>
            <ul className="space-y-4 text-sm text-neutral-400">
              <li className="flex gap-2">
                <span className="text-blue-400">•</span>
                Faster website loading speeds.
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">•</span>
                Save storage space on your device.
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">•</span>
                Easier to share via email or messaging apps.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
