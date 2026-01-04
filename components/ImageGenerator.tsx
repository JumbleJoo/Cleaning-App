import React, { useState, useEffect } from 'react';
import { generateCustomImage, checkApiKey, promptApiKeySelection } from '../services/geminiService';
import { AspectRatio, ImageSize } from '../types';
import { Sparkles, Image as ImageIcon, Download, Loader2, AlertTriangle } from 'lucide-react';

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [size, setSize] = useState<ImageSize>('1K');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState<boolean>(false);

  useEffect(() => {
    checkApiKey().then(setHasKey);
  }, []);

  const handleConnect = async () => {
    try {
        await promptApiKeySelection();
        // Assume success if no error thrown, though in reality we'd want to poll or wait for callback
        // The prompt instructions say: "assume the key selection was successful ... and proceed"
        setHasKey(true);
    } catch (e) {
        console.error(e);
        setError("Failed to connect API Key.");
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
        // Double check key right before generation in case session expired or not set
        if (!hasKey) {
             const keyPresent = await checkApiKey();
             if (!keyPresent) {
                 await handleConnect();
             }
        }

        const result = await generateCustomImage(prompt, aspectRatio, size);
        setGeneratedImage(result);
    } catch (err: any) {
        setError(err.message || "Failed to generate image. Please try again.");
        // If entity not found error, reset key state as per instructions
        if (err.message && err.message.includes("Requested entity was not found")) {
            setHasKey(false);
            setError("API Key invalid or expired. Please reconnect.");
        }
    } finally {
        setLoading(false);
    }
  };

  if (!hasKey) {
      return (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-6">
              <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 mb-4">
                  <Sparkles size={40} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Unlock Creative Tools</h2>
              <p className="text-slate-500">
                  To generate custom icons and avatars for your chores, please connect your Google Gemini API key.
              </p>
               <div className="text-xs text-slate-400 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  Uses <strong>gemini-3-pro-image-preview</strong>. Billing may apply.
                  <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline ml-1 text-teal-600">
                      Learn more
                  </a>
              </div>
              <button 
                onClick={handleConnect}
                className="w-full py-4 bg-teal-600 text-white rounded-xl font-bold shadow-lg shadow-teal-200 active:scale-95 transition-all"
              >
                  Connect API Key
              </button>
          </div>
      )
  }

  return (
    <div className="p-6 pb-32">
      <div className="flex items-center space-x-2 mb-6">
        <Sparkles className="text-teal-500" />
        <h1 className="text-2xl font-bold text-slate-800">Studio</h1>
      </div>
      
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
        {/* Prompt Input */}
        <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-400">Prompt</label>
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A cute 3D icon of a washing machine, pastel colors..."
                className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[100px] resize-none"
            />
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-400">Aspect Ratio</label>
                <select 
                    value={aspectRatio} 
                    onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none"
                >
                    {["1:1", "2:3", "3:2", "3:4", "4:3", "9:16", "16:9", "21:9"].map(r => (
                        <option key={r} value={r}>{r}</option>
                    ))}
                </select>
             </div>
             <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-400">Size</label>
                <select 
                    value={size} 
                    onChange={(e) => setSize(e.target.value as ImageSize)}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none"
                >
                    {["1K", "2K", "4K"].map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
             </div>
        </div>

        {/* Generate Button */}
        <button
            onClick={handleGenerate}
            disabled={loading || !prompt}
            className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center space-x-2 shadow-lg transition-all
                ${loading || !prompt ? 'bg-slate-300 shadow-none cursor-not-allowed' : 'bg-teal-600 shadow-teal-200 active:scale-95 hover:bg-teal-700'}`}
        >
            {loading ? (
                <>
                    <Loader2 className="animate-spin" />
                    <span>Dreaming...</span>
                </>
            ) : (
                <>
                    <Sparkles size={20} />
                    <span>Generate Image</span>
                </>
            )}
        </button>

        {/* Error Message */}
        {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center text-sm">
                <AlertTriangle size={18} className="mr-2 flex-shrink-0" />
                {error}
            </div>
        )}

        {/* Result */}
        {generatedImage && (
            <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-100 relative group">
                    <img src={generatedImage} alt="Generated" className="w-full h-auto object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <a 
                            href={generatedImage} 
                            download={`gemini-${Date.now()}.png`}
                            className="p-3 bg-white rounded-full text-slate-800 hover:scale-110 transition-transform"
                        >
                            <Download size={24} />
                        </a>
                    </div>
                </div>
                <p className="text-center text-xs text-slate-400">Long press image to save to photos</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default ImageGenerator;