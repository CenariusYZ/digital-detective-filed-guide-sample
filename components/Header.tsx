
import React, { useState } from 'react';
import { Shield, Zap, Info, X, BookOpen, AlertOctagon, Terminal } from 'lucide-react';
import LiveScanModal from './LiveScanModal';

const Header: React.FC = () => {
  const [activeConcept, setActiveConcept] = useState<string | null>(null);
  const [isLiveScanOpen, setIsLiveScanOpen] = useState(false);

  const concepts: Record<string, { title: string; icon: React.ReactNode; content: string; color: string }> = {
    protocol: {
      title: "The Tri-Lens Protocol",
      icon: <BookOpen className="w-6 h-6" />,
      color: "bg-indigo-600",
      content: "A systematic approach to truth. We don't just 'fact-check'; we analyze the origin (Source), the evidence (Fact), and the structural integrity (Logic) of a narrative simultaneously."
    },
    sewage: {
      title: "Sewage Theory",
      icon: <AlertOctagon className="w-6 h-6" />,
      color: "bg-red-600",
      content: "Disinformation isn't a score. Like a single drop of sewage ruins a bottle of fine wine, a single fabricated expert or a major logical fallacy invalidates the entire news piece. This is our Red Flag System."
    },
    scan: {
      title: "SCAN Framework",
      icon: <Terminal className="w-6 h-6" />,
      color: "bg-slate-900",
      content: "Human-AI collaboration strategy: Summarize claims, Check fallacies, Analyze sources, and Neutralize emotional bias. Use AI as a power-tool for your own critical thinking."
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Shield className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
              DIGITAL DETECTIVE
              <span className="bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 rounded-full font-bold">PRO</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Intelligence Agency Tool</p>
          </div>
        </div>
        
        <div className="hidden lg:flex items-center gap-8 text-sm font-bold text-slate-500 uppercase tracking-tighter">
          <button onClick={() => setActiveConcept('protocol')} className="hover:text-indigo-600 transition-colors">The Protocol</button>
          <button onClick={() => setActiveConcept('sewage')} className="hover:text-red-600 transition-colors">Sewage Theory</button>
          <button onClick={() => setActiveConcept('scan')} className="hover:text-slate-900 transition-colors">SCAN Framework</button>
          <button 
            onClick={() => setIsLiveScanOpen(true)}
            className="bg-slate-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-slate-200"
          >
            <Zap className="w-4 h-4 fill-current" />
            LIVE SCAN
          </button>
        </div>
      </div>

      {isLiveScanOpen && <LiveScanModal onClose={() => setIsLiveScanOpen(false)} />}

      {/* Concept Modal Overlay */}
      {activeConcept && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className={`p-6 ${concepts[activeConcept].color} text-white flex justify-between items-center`}>
              <div className="flex items-center gap-3">
                {concepts[activeConcept].icon}
                <h3 className="text-xl font-black italic uppercase">{concepts[activeConcept].title}</h3>
              </div>
              <button onClick={() => setActiveConcept(null)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-8">
              <p className="text-slate-600 text-lg leading-relaxed font-medium italic">
                "{concepts[activeConcept].content}"
              </p>
              <button 
                onClick={() => setActiveConcept(null)}
                className="mt-8 w-full py-3 bg-slate-100 text-slate-900 font-black uppercase tracking-widest text-xs rounded-xl hover:bg-slate-200 transition-colors"
              >
                Understood, Detective
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
