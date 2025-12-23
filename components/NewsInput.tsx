
import React from 'react';
import { Loader2, Trash2, Send } from 'lucide-react';

interface NewsInputProps {
  value: string;
  onChange: (val: string) => void;
  onAnalyze: () => void;
  onReset: () => void;
  loading: boolean;
}

const NewsInput: React.FC<NewsInputProps> = ({ value, onChange, onAnalyze, onReset, loading }) => {
  return (
    <div className="space-y-4">
      <div className="relative group">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste news text, social media posts, or specific claims here..."
          className="w-full min-h-[300px] p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none text-slate-700 leading-relaxed"
          disabled={loading}
        />
        <div className="absolute bottom-4 right-4 flex items-center gap-2">
           <button 
            onClick={onReset}
            className="p-2 text-slate-400 hover:text-red-500 transition-colors bg-white border border-slate-200 rounded-lg"
            title="Clear"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <button
        onClick={onAnalyze}
        disabled={loading || value.length < 20}
        className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all ${
          loading || value.length < 20 
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100'
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Consulting Truth Oracle...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Analyze with Tri-Lens
          </>
        )}
      </button>
      
      <p className="text-[11px] text-slate-400 text-center italic">
        * Works best with full articles or multi-paragraph social media threads.
      </p>
    </div>
  );
};

export default NewsInput;
