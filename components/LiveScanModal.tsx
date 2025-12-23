
import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { X, Mic, Radio, ShieldAlert, Activity } from 'lucide-react';

interface LiveScanModalProps {
  onClose: () => void;
}

const LiveScanModal: React.FC<LiveScanModalProps> = ({ onClose }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [transcription, setTranscription] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sessionRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const activeSources = useRef<Set<AudioBufferSourceNode>>(new Set());

  useEffect(() => {
    startSession();
    return () => stopSession();
  }, []);

  const startSession = async () => {
    try {
      // Initialize right before connection
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = inputCtx.createMediaStreamSource(stream);
      const processor = inputCtx.createScriptProcessor(4096, 1, 1);
      
      const analyser = inputCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setIsConnected(true);
            setIsAnalysing(true);
            
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            source.connect(processor);
            processor.connect(inputCtx.destination);
          },
          onmessage: async (message) => {
            const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData) {
              const ctx = audioContextRef.current!;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const buffer = await decodeAudioData(decode(audioData), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(ctx.destination);
              
              source.addEventListener('ended', () => {
                activeSources.current.delete(source);
              });

              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              activeSources.current.add(source);
            }

            // Handle Interruptions (Important for natural UX)
            if (message.serverContent?.interrupted) {
              activeSources.current.forEach(s => s.stop());
              activeSources.current.clear();
              nextStartTimeRef.current = 0;
            }

            if (message.serverContent?.outputTranscription) {
              setTranscription(prev => prev + message.serverContent.outputTranscription.text + ' ');
            }
          },
          onerror: (e) => setError('Signal interference detected.'),
          onclose: () => setIsConnected(false),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: "You are a Digital Detective Intelligence Officer. You analyze spoken claims for disinformation in real-time. Be concise, professional, and use the Tri-Lens logic (Source, Fact, Logic) to debunk or verify what the user says. Use an 'encrypted communication' tone.",
          outputAudioTranscription: {}
        }
      });

      sessionRef.current = await sessionPromise;
      drawWaveform();
    } catch (err) {
      setError('Access Denied: Microphone or API error.');
    }
  };

  const stopSession = () => {
    if (sessionRef.current) sessionRef.current.close();
    if (audioContextRef.current) audioContextRef.current.close();
    activeSources.current.forEach(s => s.stop());
    activeSources.current.clear();
    setIsAnalysing(false);
  };

  const drawWaveform = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      if (!isAnalysing) return;
      requestAnimationFrame(render);
      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        ctx.fillStyle = `rgb(99, 102, 241)`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    };
    render();
  };

  function createBlob(data: Float32Array) {
    const int16 = new Int16Array(data.length);
    for (let i = 0; i < data.length; i++) int16[i] = data[i] * 32768;
    return { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
  }

  function decode(base64: string) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }

  function encode(bytes: Uint8Array) {
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  }

  async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number) {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
    return buffer;
  }

  return (
    <div className="fixed inset-0 z-[110] bg-slate-950 flex flex-col items-center justify-center animate-in fade-in duration-500">
      <div className="absolute top-0 w-full p-6 flex justify-between items-center border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg animate-pulse">
            <Radio className="text-white w-5 h-5" />
          </div>
          <div>
            <h2 className="text-white font-black italic uppercase tracking-widest text-lg">Field Intelligence Terminal</h2>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`}></span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                {isConnected ? 'ENCRYPTED UPLINK ACTIVE' : 'ESTABLISHING CONNECTION...'}
              </span>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors bg-slate-900 rounded-full">
          <X className="w-8 h-8" />
        </button>
      </div>

      <div className="max-w-4xl w-full px-6 flex flex-col items-center gap-12 text-center">
        {error ? (
          <div className="bg-red-950/30 border border-red-500/50 p-8 rounded-3xl text-red-400 flex flex-col items-center gap-4">
            <ShieldAlert className="w-12 h-12" />
            <h3 className="text-xl font-black uppercase tracking-widest">{error}</h3>
            <button onClick={() => window.location.reload()} className="px-6 py-2 bg-red-600 text-white font-bold rounded-xl text-xs uppercase tracking-widest">Retry Connection</button>
          </div>
        ) : (
          <>
            <div className="relative">
              <div className="w-48 h-48 rounded-full border-4 border-indigo-500/30 flex items-center justify-center relative z-10 bg-slate-900 shadow-[0_0_50px_rgba(79,70,229,0.3)]">
                <Mic className={`w-16 h-16 ${isConnected ? 'text-indigo-400' : 'text-slate-700'} transition-colors`} />
              </div>
              <div className="absolute inset-0 w-48 h-48 rounded-full border border-indigo-500 animate-ping opacity-20"></div>
            </div>

            <div className="space-y-4 w-full">
              <h3 className="text-indigo-400 font-black text-2xl uppercase italic tracking-tighter">
                {isConnected ? "Intelligence Officer 'Zephyr' is Listening..." : "Securing Line..."}
              </h3>
              <p className="text-slate-500 font-medium max-w-lg mx-auto italic">
                Speak your claim or read a news paragraph aloud. The officer will provide immediate Tri-Lens feedback via audio.
              </p>
            </div>

            <div className="w-full h-24 bg-slate-900/50 rounded-2xl border border-slate-800 p-4 relative overflow-hidden">
               <canvas ref={canvasRef} width={800} height={100} className="w-full h-full" />
            </div>

            {transcription && (
              <div className="w-full max-h-[200px] overflow-y-auto bg-slate-900 border border-slate-800 p-6 rounded-3xl text-left font-mono">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-indigo-500" />
                  <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-[0.2em]">Live Transcript</span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{transcription}</p>
              </div>
            )}
          </>
        )}
      </div>

      <div className="absolute bottom-12 flex items-center gap-6">
        <div className="flex flex-col items-center">
          <div className="w-1 h-12 bg-slate-800 rounded-full overflow-hidden">
            <div className="w-full bg-indigo-500" style={{ height: isConnected ? '100%' : '0%' }}></div>
          </div>
          <span className="text-[8px] text-slate-500 font-black mt-2 uppercase tracking-widest">Signal Strength</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-1 h-12 bg-slate-800 rounded-full overflow-hidden">
            <div className="w-full bg-emerald-500" style={{ height: isConnected ? '85%' : '0%' }}></div>
          </div>
          <span className="text-[8px] text-slate-500 font-black mt-2 uppercase tracking-widest">Logic Decryption</span>
        </div>
      </div>
    </div>
  );
};

export default LiveScanModal;
