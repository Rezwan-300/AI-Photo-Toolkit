import React, { useState } from 'react';
import { ImageUpload } from './ImageUpload';
import { ProcessingScreen } from './ProcessingScreen';
import { AdRenderer, useAds } from './AdContext';
import { Download, User, Palette, Crop, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

const SIZES = [
  { id: '2x2', name: '2x2 inch (US)', width: 600, height: 600 },
  { id: '35x45', name: '35x45 mm (EU/UK)', width: 413, height: 531 },
  { id: 'custom', name: 'Custom', width: 500, height: 500 },
];

const COLORS = [
  { name: 'White', value: '#FFFFFF' },
  { name: 'Blue', value: '#0047AB' },
  { name: 'Light Blue', value: '#ADD8E6' },
  { name: 'Red', value: '#FF0000' },
  { name: 'Transparent', value: 'transparent' },
];

export function PassportMaker() {
  const { settings } = useAds();
  const [image, setImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSize, setSelectedSize] = useState(SIZES[0]);
  const [bgColor, setBgColor] = useState(COLORS[0].value);

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target?.result as string);
    reader.readAsDataURL(file);
    setProcessedImage(null);
  };

  const generatePassportPhoto = async () => {
    if (!image) return;
    setIsLoading(true);

    try {
      const formData = new FormData();
      const blob = await fetch(image).then(r => r.blob());
      formData.append('image', blob);
      formData.append('tool', 'passport');
      formData.append('options', JSON.stringify({ 
        width: selectedSize.width, 
        height: selectedSize.height,
        bgColor 
      }));

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
      console.error("Passport photo generation failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `passport-photo-${selectedSize.id}.png`;
    link.click();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <ProcessingScreen 
        isProcessing={isProcessing} 
        onComplete={() => setIsProcessing(false)} 
        message="Generating Passport Photo..."
      />

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <div className="bg-neutral-900/60 border border-neutral-800 p-6 rounded-3xl">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <User className="w-6 h-6 text-blue-400" />
              Passport Size Photo Maker
            </h2>
            <p className="text-neutral-400 mb-6">Auto-crop and set background for official documents.</p>

            <ImageUpload
              onUpload={handleUpload}
              onClear={() => { setImage(null); setProcessedImage(null); }}
              currentImage={processedImage || image}
            />

            {image && !processedImage && (
              <div className="mt-8 space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-sm font-medium text-neutral-400 flex items-center gap-2">
                      <Crop className="w-4 h-4" /> Select Size
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {SIZES.map((size) => (
                        <button
                          key={size.id}
                          onClick={() => setSelectedSize(size)}
                          className={cn(
                            "px-4 py-3 rounded-xl text-left border transition-all",
                            selectedSize.id === size.id
                              ? "bg-blue-600 border-blue-500 text-white"
                              : "bg-neutral-800 border-neutral-700 text-neutral-400 hover:border-neutral-600"
                          )}
                        >
                          <div className="font-semibold">{size.name}</div>
                          <div className="text-xs opacity-70">{size.width}x{size.height} px</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-medium text-neutral-400 flex items-center gap-2">
                      <Palette className="w-4 h-4" /> Background Color
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {COLORS.map((color) => (
                        <button
                          key={color.name}
                          onClick={() => setBgColor(color.value)}
                          className={cn(
                            "w-full aspect-square rounded-lg border-2 transition-all flex items-center justify-center",
                            bgColor === color.value ? "border-blue-500 scale-110" : "border-neutral-800 hover:border-neutral-700"
                          )}
                          style={{ backgroundColor: color.value === 'transparent' ? '#171717' : color.value }}
                          title={color.name}
                        >
                          {color.value === 'transparent' && <span className="text-[10px] text-neutral-500">None</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={generatePassportPhoto}
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
                      <User className="w-5 h-5" />
                      Create Passport Photo
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
                    Edit Settings
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
            <h3 className="text-lg font-bold text-white mb-4">Official Guidelines</h3>
            <ul className="space-y-4 text-sm text-neutral-400">
              <li className="flex gap-2">
                <span className="text-blue-400">•</span>
                Face should be clearly visible and centered.
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">•</span>
                Neutral expression or natural smile.
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">•</span>
                White background is standard for most countries.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
