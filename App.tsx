import React, { useState, useEffect } from 'react';
import { analyzeNews } from './services/geminiService';
import { AnalysisResult } from './types';
import Header from './components/Header';
import NewsInput from './components/NewsInput';
import AnalysisDashboard from './components/AnalysisDashboard';
import ProtocolGuide from './components/ProtocolGuide';
// 引入新的图标 Key
import { AlertCircle, ShieldCheck, HelpCircle, Lock, Terminal, Key } from 'lucide-react';

const App: React.FC = () => {
  const [content, setContent] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 新增：API Key 状态管理
  const [apiKey, setApiKey] = useState('');
  const [tempKey, setTempKey] = useState(''); // 输入框的临时值
  const [showKeyInput, setShowKeyInput] = useState(true); // 控制是否显示输入界面

  useEffect(() => {
    // 1. 尝试从 localStorage 读取
    const storedKey = localStorage.getItem('DIGITAL_DETECTIVE_KEY');
    // 2. 也可以保留 .env 作为备选（方便开发）
    const envKey = import.meta.env.VITE_API_KEY;

    if (storedKey) {
      setApiKey(storedKey);
      setShowKeyInput(false);
    } else if (envKey && envKey !== 'undefined' && !envKey.includes('YOUR_API_KEY')) {
      setApiKey(envKey);
      setShowKeyInput(false);
    }
  }, []);

  const handleSaveKey = () => {
    if (tempKey.trim().length > 10) {
      setApiKey(tempKey);
      localStorage.setItem('DIGITAL_DETECTIVE_KEY', tempKey);
      setShowKeyInput(false);
    }
  };

  const handleClearKey = () => {
    localStorage.removeItem('DIGITAL_DETECTIVE_KEY');
    setApiKey('');
    setTempKey('');
    setShowKeyInput(true);
  };

  const handleAnalyze = async () => {
    if (!content.trim()) return;
    setLoading(true);
    setError(null);
    try {
      // 修改：将 apiKey 传递给 service
      const result = await analyzeNews(content, apiKey);
      setAnalysis(result);
    } catch (err: any) {
      // 优化错误处理：如果是 401 或 Key 错误，重新显示输入框
      const errorMessage = err.message || 'Analysis failed.';
      setError(errorMessage);
      if (errorMessage.includes('API key') || errorMessage.includes('401')) {
          setShowKeyInput(true);
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setContent('');
    setAnalysis(null);
    setError(null);
  };

  // 渲染：输入 Key 的全屏界面 (替代了原来的 Error Screen)
  if (showKeyInput) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="relative mx-auto w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center border border-indigo-500/50">
            <Lock className="text-indigo-500 w-10 h-10" />
            <div className="absolute inset-0 rounded-full border border-indigo-500 animate-ping opacity-20"></div>
          </div>
          <div className="space-y-4">
            <h1 className="text-white text-2xl font-black italic tracking-tighter uppercase">Security Clearance</h1>
            <p className="text-slate-400 text-sm leading-relaxed font-mono">
              Identity Verification Required.<br />
              请输入您的 Gemini API Key 以访问 Digital Detective 终端。
            </p>
          </div>
          
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-left space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 mb-1">
              <Key className="w-4 h-4 text-indigo-500" />
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">API CREDENTIALS</span>
            </div>
            
            <input 
                type="password"
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                placeholder="Paste your AIza... key here"
                className="w-full bg-black/50 border border-slate-700 rounded-lg p-3 text-white font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
            />

            <button 
                onClick={handleSaveKey}
                disabled={tempKey.length < 10}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/20"
            >
                <Terminal className="w-4 h-4" />
                Initialize System
            </button>
            
            <p className="text-[10px] text-slate-600 text-center mt-2">
              Key is stored locally in your browser.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* 修改：将 apiKey 传递给 Header */}
      <Header apiKey={apiKey} />
      
      <main className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <ShieldCheck className="text-indigo-600 w-5 h-5" />
                  Feed the Evidence
                </h2>
                {/* 新增：重置 Key 的按钮 */}
                <button 
                  onClick={handleClearKey} 
                  className="text-[10px] text-slate-400 hover:text-red-500 transition-colors font-mono underline decoration-slate-200 underline-offset-4"
                >
                  RESET_KEY
                </button>
            </div>
            <NewsInput 
              value={content} 
              onChange={setContent} 
              onAnalyze={handleAnalyze}
              loading={loading}
              onReset={reset}
            />
            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-start gap-2 text-sm border border-red-100">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </section>

          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <HelpCircle className="text-indigo-600 w-5 h-5" />
              The Tri-Lens Protocol
            </h2>
            <ProtocolGuide />
          </section>
        </div>

        <div className="lg:col-span-7">
          {analysis ? (
            <AnalysisDashboard analysis={analysis} />
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-white rounded-3xl border-2 border-dashed border-slate-200 text-slate-400 p-12 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="w-10 h-10 opacity-20" />
              </div>
              <h3 className="text-lg font-medium text-slate-600">Awaiting Investigation</h3>
              <p className="max-w-xs mt-2">在左侧输入新闻或主张，开启三维真相核查流程。</p>
            </div>
          )}
        </div>
      </main>

      {!analysis && !loading && content.length > 50 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <button 
            onClick={handleAnalyze}
            className="bg-indigo-600 text-white px-8 py-3 rounded-full shadow-xl font-bold hover:bg-indigo-700 transition-all active:scale-95"
          >
            Run Detective Protocol
          </button>
        </div>
      )}
    </div>
  );
};

export default App;