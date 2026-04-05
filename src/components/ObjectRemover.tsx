import React, { useState, useRef, useEffect } from 'react';
import { ImageUpload } from './ImageUpload';
import { ProcessingScreen } from './ProcessingScreen';
import { AdRenderer, useAds } from './AdContext';
import { Download, Eraser, Loader2, MousePointer2, RotateCcw } from 'lucide-react';

export function ObjectRemover() {
  const { settings } = useAds();
  const [image, setImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [brushSize, setBrushSize] = useState(30);
  const [isDrawing, setIsDrawing] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target?.result as string);
    reader.readAsDataURL(file);
    setProcessedImage(null);
  };

  useEffect(() => {
    if (image && canvasRef.current && maskCanvasRef.current) {
      const img = new Image();
      img.src = image;
      img.onload = () => {
        const canvas = canvasRef.current!;
        const maskCanvas = maskCanvasRef.current!;
        
        const containerWidth = canvas.parentElement?.clientWidth || 800;
        const scale = containerWidth / img.width;
        
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        maskCanvas.width = canvas.width;
        maskCanvas.height = canvas.height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const maskCtx = maskCanvas.getContext('2d');
        if (maskCtx) {
          maskCtx.fillStyle = 'black';
          maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
        }
      };
    }
  }, [image]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !maskCanvasRef.current) return;

    const canvas = maskCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = (e as React.MouseEvent).clientX - rect.left;
      y = (e as React.MouseEvent).clientY - rect.top;
    }

    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();

    const mainCanvas = canvasRef.current;
    const mainCtx = mainCanvas?.getContext('2d');
    if (mainCtx) {
      mainCtx.globalAlpha = 0.5;
      mainCtx.fillStyle = '#ef4444';
      mainCtx.beginPath();
      mainCtx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
      mainCtx.fill();
      mainCtx.globalAlpha = 1.0;
    }
  };

  const handleRemove = async () => {
    if (!image || !maskCanvasRef.current) return;
    setIsLoading(true);

    try {
      const formData = new FormData();
      const blob = await fetch(image).then(r => r.blob());
      formData.append('image', blob);
      formData.append('tool', 'remove');
      
      const maskDataUrl = maskCanvasRef.current.toDataURL('image/png');
      const maskBlob = await fetch(maskDataUrl).then(r => r.blob());
      formData.append('mask', maskBlob);

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
      console.error("Object removal failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetMask = () => {
    if (!maskCanvasRef.current || !canvasRef.current || !image) return;
    
    const maskCtx = maskCanvasRef.current.getContext('2d');
    if (maskCtx) {
      maskCtx.fillStyle = 'black';
      maskCtx.fillRect(0, 0, maskCanvasRef.current.width, maskCanvasRef.current.height);
    }

    const img = new Image();
    img.src = image;
    img.onload = () => {
      const mainCtx = canvasRef.current!.getContext('2d');
      mainCtx?.drawImage(img, 0, 0, canvasRef.current!.width, canvasRef.current!.height);
    };
  };

  const downloadImage = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'object-removed.png';
    link.click();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <ProcessingScreen 
        isProcessing={isProcessing} 
        onComplete={() => setIsProcessing(false)} 
        message="Removing Unwanted Objects..."
      />

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <div className="bg-neutral-900/60 border border-neutral-800 p-6 rounded-3xl">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <Eraser className="w-6 h-6 text-blue-400" />
              Object Remover
            </h2>
            <p className="text-neutral-400 mb-6">Brush over unwanted objects to remove them instantly.</p>

            {!image ? (
              <ImageUpload
                onUpload={handleUpload}
                onClear={() => { setImage(null); setProcessedImage(null); }}
                currentImage={null}
              />
            ) : (
              <div className="space-y-6">
                <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-black cursor-crosshair touch-none">
                  {processedImage && !isProcessing ? (
                    <img src={processedImage} alt="Processed" className="w-full h-auto" />
                  ) : (
                    <>
                      <canvas
                        ref={canvasRef}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                        className="w-full h-auto"
                      />
                      <canvas ref={maskCanvasRef} className="hidden" />
                    </>
                  )}
                </div>

                {!processedImage && (
                  <div className="space-y-6">
                    <div className="flex flex-wrap items-center gap-6">
                      <div className="flex-1 min-w-[200px] space-y-2">
                        <div className="flex justify-between text-xs text-neutral-500 uppercase tracking-wider">
                          <span>Brush Size</span>
                          <span>{brushSize}px</span>
                        </div>
                        <input
                          type="range"
                          min="5"
                          max="100"
                          value={brushSize}
                          onChange={(e) => setBrushSize(parseInt(e.target.value))}
                          className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                      </div>
                      <button
                        onClick={resetMask}
                        className="p-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl transition-colors flex items-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4" /> Reset Mask
                      </button>
                    </div>

                    <button
                      onClick={handleRemove}
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
                          <Eraser className="w-5 h-5" />
                          Remove Selected Objects
                        </>
                      )}
                    </button>
                  </div>
                )}

                {processedImage && !isProcessing && (
                  <div className="space-y-6">
                    <AdRenderer html={settings?.above_download_ad} />
                    <div className="flex gap-4">
                      <button
                        onClick={() => { setProcessedImage(null); resetMask(); }}
                        className="flex-1 py-4 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-2xl transition-all"
                      >
                        Back to Editor
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
            )}
          </div>
        </div>

        <div className="lg:w-80 space-y-6">
          <AdRenderer html={settings?.sidebar_ad} />
          <div className="bg-neutral-900/60 border border-neutral-800 p-6 rounded-3xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <MousePointer2 className="w-5 h-5 text-blue-400" />
              Instructions
            </h3>
            <ul className="space-y-4 text-sm text-neutral-400">
              <li className="flex gap-2">
                <span className="text-blue-400">1.</span>
                Upload your photo.
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">2.</span>
                Paint over the objects you want to remove.
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">3.</span>
                Click 'Remove' and wait for the AI to process.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
