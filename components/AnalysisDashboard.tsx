
import React from 'react';
import { AnalysisResult, VerdictLevel, LensStatus } from '../types';
import { CheckCircle2, AlertTriangle, XCircle, Info, Database, Fingerprint, BrainCircuit, ExternalLink, Globe, History, Search } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface AnalysisDashboardProps {
  analysis: AnalysisResult;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ analysis }) => {
  const getVerdictStyles = (verdict: VerdictLevel) => {
    switch (verdict) {
      case VerdictLevel.GREEN:
        return { 
          bg: 'bg-emerald-50', 
          text: 'text-emerald-700', 
          border: 'border-emerald-200', 
          icon: <CheckCircle2 className="w-8 h-8 text-emerald-600" />,
          label: 'Verified Credible',
          stamp: 'AUTHENTIC'
        };
      case VerdictLevel.YELLOW:
        return { 
          bg: 'bg-amber-50', 
          text: 'text-amber-700', 
          border: 'border-amber-200', 
          icon: <AlertTriangle className="w-8 h-8 text-amber-600" />,
          label: 'Inconclusive / Vague',
          stamp: 'UNVERIFIED'
        };
      case VerdictLevel.RED:
        return { 
          bg: 'bg-red-50', 
          text: 'text-red-700', 
          border: 'border-red-200', 
          icon: <XCircle className="w-8 h-8 text-red-600" />,
          label: 'Critical Warning / Disinfo',
          stamp: 'FRAUDULENT'
        };
    }
  };

  const styles = getVerdictStyles(analysis.verdict);

  const chartData = [
    { name: 'Source', value: analysis.sourceLens.isRedFlag ? 1 : 10, color: analysis.sourceLens.isRedFlag ? '#ef4444' : '#10b981' },
    { name: 'Fact', value: analysis.factLens.isRedFlag ? 1 : 10, color: analysis.factLens.isRedFlag ? '#ef4444' : '#10b981' },
    { name: 'Logic', value: analysis.logicLens.isRedFlag ? 1 : 10, color: analysis.logicLens.isRedFlag ? '#ef4444' : '#10b981' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      {/* Dossier Header */}
      <div className="flex justify-between items-end border-b-4 border-slate-900 pb-3 mb-6">
        <div>
          <h3 className="text-4xl font-black italic tracking-tighter text-slate-900 leading-none">THE TRUTH FILE</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">Intelligence Division // 001-A</p>
        </div>
        <div className="hidden sm:block text-[10px] font-mono font-bold text-slate-900 bg-amber-400 px-2 py-1 rounded">
          SCAN_ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
        </div>
      </div>

      {/* Verdict Card */}
      <div className={`p-10 rounded-[2.5rem] border-2 ${styles.bg} ${styles.border} flex flex-col md:flex-row items-center gap-8 relative overflow-hidden shadow-2xl`}>
        {/* Detective Stamp Overlay */}
        <div className={`absolute -right-8 -bottom-4 px-12 py-4 border-[8px] rounded-2xl rotate-[-12deg] font-black text-6xl opacity-[0.15] pointer-events-none select-none ${analysis.verdict === VerdictLevel.RED ? 'border-red-600 text-red-600' : 'border-emerald-600 text-emerald-600'}`}>
          {styles.stamp}
        </div>
        
        <div className="shrink-0 scale-150 md:scale-125 z-10">{styles.icon}</div>
        <div className="text-center md:text-left z-10">
          <h3 className={`text-3xl font-black uppercase tracking-tighter ${styles.text} leading-tight`}>
            {styles.label}
          </h3>
          <p className="mt-3 text-slate-800 leading-relaxed font-semibold text-lg max-w-lg">
            {analysis.summary}
          </p>
        </div>
      </div>

      {/* Tri-Lens Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <LensCard 
          icon={<Fingerprint className="w-5 h-5" />}
          title="Credibility"
          status={analysis.sourceLens.status}
          isRed={analysis.sourceLens.isRedFlag}
          details={analysis.sourceLens.details}
        />
        <LensCard 
          icon={<Database className="w-5 h-5" />}
          title="Verifiability"
          status={analysis.factLens.status}
          isRed={analysis.factLens.isRedFlag}
          details={analysis.factLens.details}
        />
        <LensCard 
          icon={<BrainCircuit className="w-5 h-5" />}
          title="Reasoning"
          status={analysis.logicLens.status}
          isRed={analysis.logicLens.isRedFlag}
          details={analysis.logicLens.details}
        />
      </div>

      {/* Verified Sources / Grounding */}
      {analysis.groundingSources && analysis.groundingSources.length > 0 && (
        <section className="bg-white p-8 rounded-[2rem] shadow-xl border-t-8 border-slate-900">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-base font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
              <Search className="w-5 h-5 text-indigo-600" />
              Intelligence Trail (Web Evidence)
            </h4>
            <span className="text-[10px] font-mono text-slate-400">{analysis.groundingSources.length} CROSS-REFERENCES FOUND</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.groundingSources.map((source, idx) => (
              <a 
                key={idx}
                href={source.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl hover:bg-white hover:border-indigo-600 hover:shadow-lg transition-all active:scale-98"
              >
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm group-hover:rotate-6 transition-transform">
                    <img 
                      src={`https://www.google.com/s2/favicons?domain=${new URL(source.uri).hostname}&sz=128`} 
                      alt="" 
                      className="w-6 h-6"
                      onError={(e) => (e.currentTarget.src = 'https://www.google.com/s2/favicons?domain=google.com')}
                    />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-black text-slate-800 truncate group-hover:text-indigo-600">{source.title}</p>
                    <p className="text-[10px] text-slate-400 truncate font-mono uppercase tracking-wider">{new URL(source.uri).hostname}</p>
                  </div>
                </div>
                <div className="bg-slate-200 group-hover:bg-indigo-600 p-2 rounded-lg transition-colors">
                  <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-white" />
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Evidence Extraction */}
      <section className="bg-slate-100 p-8 rounded-[2rem] border border-slate-200">
        <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
          <History className="w-4 h-4" />
          Forensic Evidence (Atomized Claims)
        </h4>
        <div className="space-y-3">
          {analysis.claims.map((claim, idx) => (
            <div key={claim.id} className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-transparent shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-slate-900 text-white w-6 h-6 rounded flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <p className="text-slate-700 font-medium leading-relaxed italic">"{claim.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Visualization */}
      <section className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[120px] opacity-20 translate-x-20 -translate-y-20"></div>
        <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
          <div className="w-56 h-56 shrink-0 relative">
             <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
               <span className="text-3xl font-black">{analysis.verdict === VerdictLevel.RED ? 'F' : 'A'}</span>
               <span className="text-[8px] font-bold tracking-widest text-slate-400 uppercase">GRADE</span>
             </div>
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={10}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '16px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="text-3xl font-black mb-4 tracking-tighter uppercase italic">Digital Integrity Report</h4>
            <p className="text-slate-400 text-lg leading-relaxed max-w-xl font-medium">
              A comprehensive analysis has been completed. The Tri-Lens protocol filters out misinformation by prioritizing <span className="text-white underline decoration-indigo-500 decoration-4">structural truth</span> over emotional narrative.
            </p>
            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-6">
               {chartData.map(item => (
                 <div key={item.name} className="flex flex-col border-l-2 border-slate-700 pl-4">
                   <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">
                     {item.name} Check
                   </div>
                   <div className={`text-sm font-black italic tracking-tighter ${item.value === 1 ? 'text-red-400' : 'text-emerald-400'}`}>
                     {item.value === 1 ? 'VULNERABILITY_FOUND' : 'INTEGRITY_SECURED'}
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

interface LensCardProps {
  title: string;
  status: string;
  isRed: boolean;
  details: string;
  icon: React.ReactNode;
}

const LensCard: React.FC<LensCardProps> = ({ title, status, isRed, details, icon }) => {
  return (
    <div className={`p-8 rounded-[2rem] border-2 transition-all hover:-translate-y-2 duration-500 group ${isRed ? 'bg-red-50 border-red-200' : 'bg-white border-slate-100 shadow-lg'}`}>
      <div className="flex items-center justify-between mb-6">
        <div className={`p-3 rounded-2xl ${isRed ? 'bg-red-600 text-white' : 'bg-slate-900 text-white'} group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <div className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${isRed ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-200 text-slate-600'}`}>
          {isRed ? 'CRITICAL' : 'STABLE'}
        </div>
      </div>
      <h5 className="font-black text-slate-900 text-xs uppercase tracking-[0.2em] mb-1">{title}</h5>
      <p className={`text-xl font-black italic tracking-tighter ${isRed ? 'text-red-700' : 'text-slate-900'}`}>
        {status}
      </p>
      <div className={`mt-5 text-sm leading-relaxed border-t pt-5 font-medium ${isRed ? 'text-red-600 border-red-100' : 'text-slate-500 border-slate-100'}`}>
        {details}
      </div>
    </div>
  );
};

export default AnalysisDashboard;
