import React from 'react';
import { ThumbsUp, MessageCircle, Share2, MoreHorizontal, Globe, Copy, Check } from 'lucide-react';
import { GeneratedPost } from '../types';

interface PostPreviewProps {
  post: GeneratedPost | null;
  isLoading: boolean;
}

export const PostPreview: React.FC<PostPreviewProps> = ({ post, isLoading }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (post?.content) {
      navigator.clipboard.writeText(post.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 animate-pulse h-full flex flex-col justify-center items-center">
        <div className="w-12 h-12 bg-amber-100 rounded-full mb-4 animate-bounce"></div>
        <p className="text-slate-500 font-medium">Analyzing images...</p>
        <p className="text-slate-400 text-sm mt-1">Generating marketing copy...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 h-full flex items-center justify-center text-slate-400">
        <p>No post generated yet. Click "Generate Post" to start.</p>
      </div>
    );
  }

  // Determine grid layout based on image count
  const imageCount = post.selectedImages.length;
  let gridClass = "grid-cols-1";
  if (imageCount === 2) gridClass = "grid-cols-2";
  if (imageCount >= 3) gridClass = "grid-cols-2"; // 3rd image usually spans or is handled by layout logic below

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden max-w-md mx-auto">
      {/* Facebook Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold">
            AC
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-sm leading-tight">ACC Furniture</h3>
            <div className="flex items-center text-xs text-slate-500 gap-1">
              <span>Just now</span>
              <span>•</span>
              <Globe size={12} />
            </div>
          </div>
        </div>
        <MoreHorizontal className="text-slate-500" size={20} />
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        <p className="text-slate-800 text-sm whitespace-pre-wrap leading-relaxed">
          {post.content}
        </p>
      </div>

      {/* Images Grid */}
      <div className={`grid ${gridClass} gap-0.5 bg-white border-y border-slate-100`}>
        {post.selectedImages.map((img, idx) => (
          <div 
            key={img.id} 
            className={`
              relative overflow-hidden bg-slate-100
              ${imageCount === 3 && idx === 0 ? 'col-span-2 aspect-[2/1]' : 'aspect-square'}
              ${imageCount === 1 ? 'aspect-[4/3]' : ''}
            `}
          >
            <img src={img.url} alt="Product" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      {/* Action Bar Mockup */}
      <div className="px-4 py-3 flex justify-between text-slate-500 text-sm border-b border-slate-100">
        <div className="flex items-center gap-1">
          <div className="bg-blue-500 rounded-full p-1 w-5 h-5 flex items-center justify-center">
            <ThumbsUp size={10} className="text-white fill-current" />
          </div>
          <span>You and 12 others</span>
        </div>
        <span>2 comments</span>
      </div>

      <div className="grid grid-cols-3 py-2">
        <button className="flex items-center justify-center gap-2 py-2 hover:bg-slate-50 text-slate-600 font-medium text-sm transition">
          <ThumbsUp size={18} /> Like
        </button>
        <button className="flex items-center justify-center gap-2 py-2 hover:bg-slate-50 text-slate-600 font-medium text-sm transition">
          <MessageCircle size={18} /> Comment
        </button>
        <button className="flex items-center justify-center gap-2 py-2 hover:bg-slate-50 text-slate-600 font-medium text-sm transition">
          <Share2 size={18} /> Share
        </button>
      </div>

      {/* Copy Utility */}
      <div className="bg-slate-50 p-4 border-t border-slate-200">
        <button 
          onClick={handleCopy}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition ${copied ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
          {copied ? 'Copied to Clipboard!' : 'Copy Text for Facebook'}
        </button>
        <p className="text-xs text-center text-slate-400 mt-2">
          Paste this text into your Facebook post composer.
        </p>
      </div>
    </div>
  );
};
