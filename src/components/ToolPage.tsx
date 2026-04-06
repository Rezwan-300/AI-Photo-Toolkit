import React, { useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Download, RefreshCw, ArrowLeft, Image as ImageIcon, Sidebar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { AdRenderer, useAds } from './AdContext';
import { LoadingOverlay } from './LoadingOverlay';

interface ToolPageProps {
  title: string;
  description: string;
  toolId: string;
  options?: React.ReactNode;
  getOptions?: () => any;
  icon: React.ElementType;
}

export function ToolPage({ title, description, toolId, options, getOptions, icon: Icon }: ToolPageProps) {
  const { ads } = useAds();
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  });

  const handleProcess = async () => {
    if (!image) return;
    setProcessing(true);
    setError(null);

    // Artificial 3-second delay to maximize ad visibility as requested
    await new Promise(resolve => setTimeout(resolve, 3000));

    const formData = new FormData();
    formData.append('image', image);
    formData.append('tool', toolId);
    formData.append('options', JSON.stringify(getOptions ? getOptions() : {}));

    try {
      const res = await fetch('/api/process', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.image) {
        setResult(data.image);
      } else {
        setError(data.error || 'Processing failed');
      }
    } catch (e) {
      setError('An error occurred during processing');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.href = result;
    link.download = `processed_${toolId}_${Date.now()}.jpg`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      <LoadingOverlay isVisible={processing} />
      
      {/* Global Header Ad */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <AdRenderer html={ads?.Global_Header} className="w-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-neutral-500 hover:text-blue-500 font-bold mb-12 transition-colors group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </Link>

        <div className="grid lg:grid-cols-[1fr_350px] gap-12">
          {/* Main Content */}
          <div className="space-y-12">
            <div className="flex items-center gap-8 mb-16">
              <div className="w-20 h-20 bg-blue-600/10 rounded-[2rem] flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.1)]">
                <Icon className="w-10 h-10 text-blue-500" />
              </div>
              <div>
                <h1 className="text-5xl font-black tracking-tighter mb-2">{title}</h1>
                <p className="text-xl text-neutral-400">{description}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Upload Area */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-widest">Input Image</h3>
                <div 
                  {...getRootProps()} 
                  className={`relative aspect-square rounded-[3rem] border-2 border-dashed transition-all flex flex-center items-center justify-center overflow-hidden group ${
                    isDragActive ? 'border-blue-500 bg-blue-500/5' : 'border-white/5 bg-neutral-900/40 hover:border-white/20'
                  }`}
                >
                  <input {...getInputProps()} />
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-contain p-8" />
                  ) : (
                    <div className="text-center p-8">
                      <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                        <Upload className="w-10 h-10 text-neutral-500" />
                      </div>
                      <p className="text-xl font-bold text-white mb-2">Drop your photo here</p>
                      <p className="text-neutral-500">or click to browse files</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Result Area */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-widest">AI Result</h3>
                <div className="relative aspect-square rounded-[3rem] bg-neutral-900/40 border border-white/5 flex items-center justify-center overflow-hidden">
                  {result ? (
                    <img src={result} alt="Result" className="w-full h-full object-contain p-8" />
                  ) : (
                    <div className="text-center p-8">
                      <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                        <ImageIcon className="w-10 h-10 text-neutral-800" />
                      </div>
                      <p className="text-neutral-600 font-bold">Processed image will appear here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Controls & Ads */}
            <div className="bg-neutral-900/40 border border-white/5 p-12 rounded-[3.5rem] backdrop-blur-3xl">
              <div className="grid md:grid-cols-2 gap-12 items-end">
                <div className="space-y-8">
                  {options}
                  <button
                    onClick={handleProcess}
                    disabled={!image || processing}
                    className="w-full py-5 bg-blue-600 hover:bg-blue-500 disabled:bg-neutral-800 text-white font-bold rounded-2xl transition-all shadow-[0_0_40px_rgba(37,99,235,0.3)] flex items-center justify-center gap-3 text-lg"
                  >
                    {processing ? <RefreshCw className="w-6 h-6 animate-spin" /> : <RefreshCw className="w-6 h-6" />}
                    Start AI Processing
                  </button>
                </div>

                <div className="space-y-8">
                  {/* Download Page Ad */}
                  <AdRenderer html={ads?.Download_Page_Ad} className="w-full" />
                  
                  <button
                    onClick={handleDownload}
                    disabled={!result}
                    className="w-full py-5 bg-white text-black hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-600 font-bold rounded-2xl transition-all flex items-center justify-center gap-3 text-lg"
                  >
                    <Download className="w-6 h-6" /> Download Result
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Ad */}
          <aside className="space-y-8">
            <div className="sticky top-8">
              <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-widest mb-6">Sponsored</h3>
              <AdRenderer html={ads?.Sidebar_Ad} className="w-full min-h-[600px]" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
