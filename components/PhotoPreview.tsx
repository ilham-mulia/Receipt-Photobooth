
import React, { useState } from 'react';
import { Printer, Minus, Plus, Check, RotateCcw } from 'lucide-react';
import { LayoutType, AppConfig } from '../types';

interface Props {
  config: AppConfig;
  layout: LayoutType;
  images: string[];
  onReset: () => void;
  onRetake: () => void;
}

const PhotoPreview: React.FC<Props> = ({ config, layout, images, onReset, onRetake }) => {
  const [copies, setCopies] = useState(1);
  const [isPrinting, setIsPrinting] = useState(false);
  const [showDone, setShowDone] = useState(false);
  const [isMirrored, setIsMirrored] = useState(false);
  const currentDate = new Date().toLocaleDateString('en-GB').replace(/\//g, '.');

  const getPaperWidth = (size: string) => {
    switch (size) {
      case '58mm': return '280px';
      case '80mm': return '360px';
      case '4x6': return '560px';
      default: return '360px';
    }
  };

  const handlePrint = () => {
    setIsPrinting(true);
    // Small delay to ensure state is updated before browser print dialog opens
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
      setShowDone(true);
    }, 500);
  };

  const LayoutRenderer: React.FC<{ isPrintVersion?: boolean }> = ({ isPrintVersion = false }) => {
    const paperWidth = getPaperWidth(config.paperSize);
    
    // minimalist container style
    const containerClasses = isPrintVersion 
      ? `bg-white p-6 flex flex-col gap-4 mx-auto` 
      : `bg-white border-[1px] border-slate-100 p-5 flex flex-col gap-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] mx-auto h-full max-h-[72vh] aspect-[1/1.55]`;

    const imgClasses = `w-full h-full object-cover grayscale brightness-[1.08] contrast-[1.12] transition-transform duration-300 ${isMirrored ? 'scale-x-[-1]' : ''}`;

    return (
      <div 
        className={containerClasses} 
        style={{ width: isPrintVersion ? paperWidth : 'auto' }}
      >
        {/* Minimal Wordmark */}
        <div className="text-center">
          <h3 className="text-base sm:text-lg font-black uppercase tracking-[0.3em] italic text-slate-900 truncate">
            {config.wordmark}
          </h3>
          <div className="w-8 h-[1px] bg-slate-100 mx-auto mt-2" />
        </div>
        
        {/* Main Photo Content Area */}
        <div className="flex-1 aspect-[3/4.2] overflow-hidden grid gap-[2px] bg-white">
          {layout === 'SOLO' && (
            <div className="w-full h-full overflow-hidden bg-slate-50">
              <img src={images[0]} alt="" className={imgClasses} />
            </div>
          )}
          
          {layout === 'CLASSIC_4' && (
            <div className="grid grid-cols-2 grid-rows-2 gap-[2px] h-full bg-white">
              {images.slice(0, 4).map((img, i) => (
                <div key={i} className="w-full h-full overflow-hidden bg-slate-50">
                  <img src={img} className={imgClasses} alt="" />
                </div>
              ))}
            </div>
          )}
          
          {layout === 'DOUBLE_SHOT' && (
            <div className="flex flex-col gap-[2px] h-full bg-white">
              {images.slice(0, 2).map((img, i) => (
                <div key={i} className="flex-1 overflow-hidden bg-slate-50">
                  <img src={img} className={imgClasses} alt="" />
                </div>
              ))}
            </div>
          )}
          
          {layout === 'TWIN_STRIP' && (
            <div className="grid grid-cols-2 grid-rows-4 gap-[2px] h-full bg-white">
              {images.slice(0, 8).map((img, i) => (
                <div key={i} className="w-full h-full overflow-hidden bg-slate-50">
                  <img src={img} className={imgClasses} alt="" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Minimalist Footer Typography */}
        <div className="mt-auto pt-4 flex justify-between items-end">
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-[7px] uppercase tracking-[0.2em] text-slate-400">
              {config.footerText}
            </span>
            <span className="text-[6px] font-medium text-slate-200 uppercase tracking-widest tabular-nums">
              Ref.{Math.random().toString(36).substring(7).toUpperCase()}
            </span>
          </div>
          <div className="text-right">
             <span className="text-[7px] font-black text-slate-300 tracking-tighter tabular-nums">
              {currentDate}
            </span>
          </div>
        </div>
      </div>
    );
  };

  if (showDone) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 p-8 bg-white">
        <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center mb-8">
          <Check size={32} />
        </div>
        <h2 className="text-3xl font-black uppercase mb-2 tracking-tighter">Done!</h2>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] mb-12">Take your memory from the tray.</p>
        <button 
          onClick={onReset}
          className="px-10 py-4 bg-slate-900 text-white rounded-full font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:bg-black active:scale-95 transition-all"
        >
          <RotateCcw size={14} /> NEW SESSION
        </button>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col items-center bg-slate-50/30 overflow-hidden p-4 md:p-8">
      {/* 1. Preview Area */}
      <div className="flex-1 flex flex-col items-center justify-center w-full min-h-0 no-print">
        <div className="transform scale-[0.85] sm:scale-95 transition-all duration-700">
          <LayoutRenderer />
        </div>
      </div>

      {/* 2. Print Only Content - Refined for Multi-copy flow */}
      <div className="print-only">
        {Array.from({ length: copies }).map((_, i) => (
          <div key={i} className="page-break">
            <LayoutRenderer isPrintVersion={true} />
          </div>
        ))}
      </div>

      {/* 3. Controls Bar */}
      <div className="w-full max-w-lg shrink-0 bg-white md:rounded-3xl border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] p-5 mb-4 no-print flex flex-col gap-5">
        
        <div className="flex items-center justify-between gap-4">
          <button 
            onClick={onRetake}
            className="flex-1 h-12 bg-slate-50 text-slate-300 rounded-2xl font-black uppercase tracking-widest text-[9px] hover:text-slate-900 transition-colors flex items-center justify-center gap-2 border border-slate-50"
          >
            <RotateCcw size={14} /> Retake
          </button>

          <div className="flex items-center bg-slate-900 text-white px-2 py-1 rounded-2xl gap-2">
            <button 
              onClick={() => setCopies(Math.max(1, copies - 1))}
              className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-xl"
            >
              <Minus size={16} strokeWidth={3} />
            </button>
            <div className="flex flex-col items-center min-w-[28px]">
              <span className="text-lg font-black">{copies}</span>
              <span className="text-[6px] font-bold uppercase opacity-40">Qty</span>
            </div>
            <button 
              onClick={() => setCopies(Math.min(10, copies + 1))}
              className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-xl"
            >
              <Plus size={16} strokeWidth={3} />
            </button>
          </div>

          <button 
            onClick={handlePrint}
            disabled={isPrinting}
            className="flex-1 h-12 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {isPrinting ? 'PRINTING...' : <><Printer size={16} /> PRINT</>}
          </button>
        </div>

        <div className="flex items-center justify-between px-1">
          <button 
            onClick={() => setIsMirrored(!isMirrored)}
            className={`text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border transition-all ${isMirrored ? 'bg-slate-900 text-white border-slate-900' : 'text-slate-300 border-slate-100'}`}
          >
            Mirror {isMirrored ? 'On' : 'Off'}
          </button>
          <div className="text-[8px] font-black text-slate-200 uppercase tracking-[0.2em]">
            Standard {config.paperSize} Output
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isPrinting && (
        <div className="fixed inset-0 bg-white/40 backdrop-blur-md z-[300] flex flex-col items-center justify-center no-print animate-in fade-in">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="font-bold text-[8px] uppercase tracking-[0.3em] text-indigo-600 animate-pulse">Processing Memory...</p>
        </div>
      )}
    </div>
  );
};

export default PhotoPreview;
