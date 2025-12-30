
import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { LayoutType } from '../types';
import { LAYOUTS } from '../constants';

interface Props {
  onSelect: (layout: LayoutType) => void;
  onBack: () => void;
}

const LayoutSelector: React.FC<Props> = ({ onSelect, onBack }) => {
  return (
    <div className="w-full max-w-4xl flex flex-col items-center animate-in slide-in-from-bottom-4 duration-500 p-6">
      <div className="flex items-center w-full mb-12">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={32} />
        </button>
        <div className="flex-1 text-center">
          <h2 className="text-4xl font-black uppercase tracking-tighter italic">Choose Photo Layout</h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-1">all layouts print on same paper size</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full px-4">
        {LAYOUTS.map((layout) => (
          <button 
            key={layout.id}
            onClick={() => onSelect(layout.id)}
            className="flex flex-col items-center group"
          >
            <div className="w-full aspect-[3/4.5] border-2 border-black p-3 bg-white group-hover:bg-slate-50 transition-all flex flex-col gap-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group-active:scale-95 transform">
              <div className="text-[10px] font-black uppercase text-center border-b border-slate-100 pb-1 mb-1 truncate">wordmark</div>
              <div className="flex-1 w-full bg-slate-100 flex flex-wrap gap-1 p-1">
                 {/* Visual Representation of Layout */}
                 {layout.id === 'SOLO' && <div className="w-full h-full bg-slate-300" />}
                 {layout.id === 'CLASSIC_4' && (
                   <div className="grid grid-cols-2 grid-rows-2 gap-1 w-full h-full">
                     <div className="bg-slate-300" /><div className="bg-slate-300" />
                     <div className="bg-slate-300" /><div className="bg-slate-300" />
                   </div>
                 )}
                 {layout.id === 'DOUBLE_SHOT' && (
                   <div className="flex flex-col gap-1 w-full h-full">
                     <div className="bg-slate-300 flex-1" />
                     <div className="bg-slate-300 flex-1" />
                   </div>
                 )}
                 {layout.id === 'TWIN_STRIP' && (
                   <div className="grid grid-cols-2 grid-rows-4 gap-1 w-full h-full">
                     <div className="bg-slate-300" /><div className="bg-slate-300" />
                     <div className="bg-slate-300" /><div className="bg-slate-300" />
                     <div className="bg-slate-300" /><div className="bg-slate-300" />
                     <div className="bg-slate-300" /><div className="bg-slate-300" />
                   </div>
                 )}
              </div>
              <div className="text-[8px] font-mono flex justify-between pt-1 opacity-50 truncate">
                <span>FOOTER TEXT</span>
              </div>
            </div>
            <span className="mt-4 font-black text-sm uppercase group-hover:tracking-widest transition-all">
              {layout.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LayoutSelector;
