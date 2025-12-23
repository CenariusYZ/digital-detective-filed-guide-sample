
import React from 'react';
import { Target, Filter, AlertCircle, Sparkles } from 'lucide-react';

const ProtocolGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex gap-4 group">
        <div className="shrink-0 w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
          <Target className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-bold text-slate-800">1. Atomization</h4>
          <p className="text-xs text-slate-500 leading-relaxed mt-1">
            Breaking down complex narratives into single, testable <strong>Claims</strong>. We verify the bricks, not just the building.
          </p>
        </div>
      </div>

      <div className="flex gap-4 group">
        <div className="shrink-0 w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
          <Filter className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-bold text-slate-800">2. The Tri-Lens Filter</h4>
          <p className="text-xs text-slate-500 leading-relaxed mt-1">
            Passing claims through <strong>Source</strong>, <strong>Fact</strong>, and <strong>Logic</strong> filters simultaneously.
          </p>
        </div>
      </div>

      <div className="flex gap-4 group">
        <div className="shrink-0 w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-bold text-red-800">3. Red Flag System</h4>
          <p className="text-xs text-slate-500 leading-relaxed mt-1">
            Like "Sewage in Red Wine"—if any part is toxic, the whole thing is discarded. Any high-risk finding triggers a critical alert.
          </p>
        </div>
      </div>

      <div className="p-4 bg-slate-900 rounded-2xl text-white relative overflow-hidden group shadow-lg">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-indigo-500/20 to-transparent pointer-events-none"></div>
        <Sparkles className="absolute -right-4 -top-4 w-24 h-24 text-indigo-400 opacity-10 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-500" />
        <h4 className="font-black italic text-[10px] uppercase tracking-[0.2em] mb-3 text-indigo-400 relative z-10">AI CO-PILOT: SCAN</h4>
        <ul className="text-[10px] space-y-2 font-bold relative z-10">
          <li className="flex items-center gap-3">
            <span className="w-5 h-5 rounded-md bg-white text-slate-900 flex items-center justify-center shrink-0 shadow-sm">S</span> 
            <span className="uppercase tracking-wide">Summarize Claims</span>
          </li>
          <li className="flex items-center gap-3">
            <span className="w-5 h-5 rounded-md bg-white text-slate-900 flex items-center justify-center shrink-0 shadow-sm">C</span> 
            <span className="uppercase tracking-wide">Check Fallacies</span>
          </li>
          <li className="flex items-center gap-3">
            <span className="w-5 h-5 rounded-md bg-white text-slate-900 flex items-center justify-center shrink-0 shadow-sm">A</span> 
            <span className="uppercase tracking-wide">Analyze Sources</span>
          </li>
          <li className="flex items-center gap-3">
            <span className="w-5 h-5 rounded-md bg-white text-slate-900 flex items-center justify-center shrink-0 shadow-sm">N</span> 
            <span className="uppercase tracking-wide">Neutralize Tone</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProtocolGuide;
