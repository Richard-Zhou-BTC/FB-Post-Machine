import React, { useState } from 'react';
import { Header } from './components/Header';
import { ImageLibrary } from './components/ImageLibrary';
import { PostPreview } from './components/PostPreview';
import { UploadedImage, GeneratedPost, AppState } from './types';
import { generateFacebookPost } from './services/geminiService';
import { Sparkles, AlertCircle } from 'lucide-react';

export default function App() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [currentPost, setCurrentPost] = useState<GeneratedPost | null>(null);
  const [status, setStatus] = useState<AppState>(AppState.IDLE);

  const handleUpload = (newImages: UploadedImage[]) => {
    setImages(prev => [...prev, ...newImages]);
  };

  const handleRemoveImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const handleGeneratePost = async () => {
    if (images.length < 1) return;

    setStatus(AppState.GENERATING);
    setCurrentPost(null);

    try {
      // 1. Randomly select 2 to 3 images
      const count = Math.min(images.length, Math.floor(Math.random() * 2) + 2); // Picks 2 or 3, but not more than available
      const shuffled = [...images].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, count);

      // 2. Call Gemini
      const content = await generateFacebookPost(selected);

      // 3. Set State
      setCurrentPost({
        id: crypto.randomUUID(),
        content: content,
        selectedImages: selected,
        timestamp: Date.now()
      });
      setStatus(AppState.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(AppState.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Header />

      <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Controls & Library */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg flex items-start gap-3">
            <Sparkles className="text-amber-600 flex-shrink-0 mt-1" size={20} />
            <div>
              <h2 className="font-semibold text-amber-900">AI Social Manager Mode</h2>
              <p className="text-sm text-amber-800">
                Upload your product folder. The system will automatically pick 2-3 random photos and write a unique B2B post for you.
              </p>
            </div>
          </div>

          <ImageLibrary 
            images={images} 
            onUpload={handleUpload} 
            onRemove={handleRemoveImage} 
          />

          <div className="flex flex-col gap-2">
             <button
              onClick={handleGeneratePost}
              disabled={images.length === 0 || status === AppState.GENERATING}
              className={`
                w-full py-4 rounded-xl font-bold text-lg shadow-md transition flex items-center justify-center gap-3
                ${images.length === 0 
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white transform active:scale-[0.99]'}
              `}
            >
              <Sparkles size={24} className={status === AppState.GENERATING ? 'animate-spin' : ''} />
              {status === AppState.GENERATING ? 'Generating Content...' : 'Generate New Post'}
            </button>
            {images.length === 0 && (
              <p className="text-center text-red-500 text-sm flex items-center justify-center gap-1">
                <AlertCircle size={14} /> Please upload images first
              </p>
            )}
             {status === AppState.ERROR && (
              <p className="text-center text-red-500 text-sm mt-2">
                Something went wrong. Please check your API key or connection.
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Preview */}
        <div className="lg:col-span-5">
           <div className="sticky top-6">
             <h2 className="text-lg font-semibold text-slate-800 mb-4">Preview</h2>
             <PostPreview 
               post={currentPost} 
               isLoading={status === AppState.GENERATING} 
             />
           </div>
        </div>
      </main>
    </div>
  );
}
