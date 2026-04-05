import React from 'react';
import { BookOpen, Zap, Shield, Image as ImageIcon } from 'lucide-react';

export function HowToUse() {
  const steps = [
    {
      title: "Upload Your Image",
      description: "Click on the tool you need and upload your photo. We support JPG, PNG, and WebP formats.",
      icon: ImageIcon,
    },
    {
      title: "AI Processing",
      description: "Our advanced AI models analyze your photo to enhance, compress, or modify it according to your needs.",
      icon: Zap,
    },
    {
      title: "Preview & Adjust",
      description: "See the results in real-time. For tools like the Passport Maker, you can adjust the background and crop.",
      icon: BookOpen,
    },
    {
      title: "Download Securely",
      description: "Once you're happy with the result, download your processed image. Your data is processed securely.",
      icon: Shield,
    }
  ];

  return (
    <section className="py-16 px-4 max-w-6xl mx-auto" id="how-to-use">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">How to Use AI Photo Toolkit</h2>
        <p className="text-neutral-400 max-w-2xl mx-auto">
          Follow these simple steps to get the most out of our AI-powered image processing tools.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="bg-neutral-900/40 border border-neutral-800 p-6 rounded-2xl hover:border-blue-500/50 transition-colors group">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <step.icon className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
            <p className="text-neutral-400 leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-16 bg-neutral-900/60 border border-neutral-800 p-8 rounded-3xl">
        <h3 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h3>
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-medium text-blue-400 mb-2">Is it free to use?</h4>
            <p className="text-neutral-400">Yes, our basic AI photo tools are free to use. Some advanced features might require a premium subscription in the future.</p>
          </div>
          <div>
            <h4 className="text-lg font-medium text-blue-400 mb-2">What image formats are supported?</h4>
            <p className="text-neutral-400">We currently support JPG, PNG, WebP, and BMP formats for all our tools.</p>
          </div>
          <div>
            <h4 className="text-lg font-medium text-blue-400 mb-2">How does the AI Enhancer work?</h4>
            <p className="text-neutral-400">Our AI Enhancer uses deep learning models to reconstruct missing details, reduce noise, and optimize lighting and color balance automatically.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
