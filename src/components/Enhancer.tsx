import React, { useState } from 'react';
import { ImageUpload } from './ImageUpload';
import { ProcessingScreen } from './ProcessingScreen';
import { AdRenderer, useAds } from './AdContext';
import { Download, Sliders, Sparkles, Loader2 } from 'lucide-react';

export function Enhancer() {
  const { settings } = useAds();
  const [image, setImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [intensity, setIntensity] = useState(50);

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target?.result as string);
    reader.readAsDataURL(file);
    setProcessedImage(null);
  };

  const handleEnhance = async () => {
    if (!image) return;
    setIsLoading(true);

    try {
      const formData = new FormData();
      const blob = await fetch(image).then(r => r.blob());
      formData.append('image', blob);
      formData.append('tool', 'enhance');
      formData.append('options', JSON.stringify({ intensity }));

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
      console.error("Enhancement failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'enhanced-photo.png';
    link.click();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <ProcessingScreen 
        isProcessing={isProcessing} 
        onComplete={() => setIsProcessing(false)} 
        message="Enhancing Image Quality..."
      />

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <div className="bg-neutral-900/60 border border-neutral-800 p-6 rounded-3xl">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-blue-400" />
              AI Photo Enhancer
            </h2>
            <p className="text-neutral-400 mb-6">Improve quality, lighting, and sharpness using professional algorithms.</p>

            <ImageUpload
              onUpload={handleUpload}
              onClear={() => { setImage(null); setProcessedImage(null); }}
              currentImage={processedImage || image}
            />

            {image && !processedImage && (
              <div className="mt-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Enhancement Intensity</span>
                    <span className="text-blue-400 font-medium">{intensity}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={intensity}
                    onChange={(e) => setIntensity(parseInt(e.target.value))}
                    className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                <button
                  onClick={handleEnhance}
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
                      <Sparkles className="w-5 h-5" />
                      Enhance Photo
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
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-blue-400" />
              Pro Tips
            </h3>
            <ul className="space-y-4 text-sm text-neutral-400">
              <li className="flex gap-2">
                <span className="text-blue-400">•</span>
                Use high-resolution originals for best results.
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">•</span>
                Avoid photos with extreme motion blur.
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">•</span>
                Higher intensity works better for dark photos.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
