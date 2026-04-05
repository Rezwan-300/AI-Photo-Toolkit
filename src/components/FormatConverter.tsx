import React, { useState } from 'react';
import { ImageUpload } from './ImageUpload';
import { ProcessingScreen } from './ProcessingScreen';
import { AdRenderer, useAds } from './AdContext';
import { Download, RefreshCw, Layers, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

const FORMATS = [
  { label: 'JPG', mime: 'image/jpeg' },
  { label: 'PNG', mime: 'image/png' },
  { label: 'WebP', mime: 'image/webp' },
];

export function FormatConverter() {
  const { settings } = useAds();
  const [image, setImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [targetFormat, setTargetFormat] = useState(FORMATS[0].mime);

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target?.result as string);
    reader.readAsDataURL(file);
    setProcessedImage(null);
  };

  const handleConvert = async () => {
    if (!image) return;
    setIsLoading(true);

    try {
      const formData = new FormData();
      const blob = await fetch(image).then(r => r.blob());
      formData.append('image', blob);
      formData.append('tool', 'convert');
      formData.append('options', JSON.stringify({ format: targetFormat.split('/')[1] }));

      const res = await fetch('/api/process', {
        method: 'POST',
        body: formData,
      });
      
      const data = await res.json();
      if (data.image) {
        setProcessedImage(data.image);
        setIsProcessing(true);
      }
    } catch (error) {
      console.error("Format conversion failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = () => {
    if (!processedImage) return;
    const extension = targetFormat.split('/')[1];
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `converted-photo.${extension}`;
    link.click();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <ProcessingScreen 
        isProcessing={isProcessing} 
        onComplete={() => setIsProcessing(false)} 
        message="Converting Image Format..."
      />

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <div className="bg-neutral-900/60 border border-neutral-800 p-6 rounded-3xl">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <RefreshCw className="w-6 h-6 text-blue-400" />
              Format Converter
            </h2>
            <p className="text-neutral-400 mb-6">Convert between JPG, PNG, and WebP instantly.</p>

            <ImageUpload
              onUpload={handleUpload}
              onClear={() => { setImage(null); setProcessedImage(null); }}
              currentImage={processedImage || image}
            />

            {image && !processedImage && (
              <div className="mt-8 space-y-6">
                <div className="space-y-4">
                  <label className="text-sm font-medium text-neutral-400 flex items-center gap-2">
                    <Layers className="w-4 h-4" /> Target Format
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {FORMATS.map((format) => (
                      <button
                        key={format.mime}
                        onClick={() => setTargetFormat(format.mime)}
                        className={cn(
                          "px-4 py-3 rounded-xl font-semibold border transition-all uppercase text-sm",
                          targetFormat === format.mime
                            ? "bg-blue-600 border-blue-500 text-white"
                            : "bg-neutral-800 border-neutral-700 text-neutral-400 hover:border-neutral-600"
                        )}
                      >
                        {format.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleConvert}
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
                      <RefreshCw className="w-5 h-5" />
                      Convert Image
                    </>
                  )}
                </button>
              </div>
            )}

            {processedImage && !isProcessing && (
              <div className="mt-8 space-y-6">
                <AdRenderer html={settings?.above_download_ad} />
                <div className="flex gap-4">
                  <button
                    onClick={() => setProcessedImage(null)}
                    className="flex-1 py-4 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-2xl transition-all"
                  >
                    Reset
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
            <h3 className="text-lg font-bold text-white mb-4">Why Convert?</h3>
            <ul className="space-y-4 text-sm text-neutral-400">
              <li className="flex gap-2">
                <span className="text-blue-400">•</span>
                <b>WebP</b> for best web performance.
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">•</span>
                <b>PNG</b> for lossless quality and transparency.
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">•</span>
                <b>JPG</b> for universal compatibility.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
