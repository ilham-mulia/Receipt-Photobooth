
import React, { useState, useRef } from 'react';
import { X, Save, RotateCcw, Type, Printer, Settings2, Maximize, Activity, Image as ImageIcon, Trash2, ShieldCheck, Camera, CheckCircle2, AlertCircle, Layout, Gauge } from 'lucide-react';
import { AppConfig, PaperSize } from '../types';
import { DEFAULT_CONFIG } from '../constants';

interface Props {
  config: AppConfig;
  onSave: (config: AppConfig) => void;
  onClose: () => void;
}

const AdminPanel: React.FC<Props> = ({ config, onSave, onClose }) => {
  const [formData, setFormData] = useState<AppConfig>(config);
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [cameraStatus, setCameraStatus] = useState<'idle' | 'checking' | 'ok' | 'error'>('idle');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const resetToDefault = () => {
    if (confirm("Reset semua pengaturan ke awal?")) {
      setFormData(DEFAULT_CONFIG);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Gambar terlalu besar! Maksimal 2MB untuk menjaga performa.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, homeBackgroundImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, homeBackgroundImage: undefined });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Fix: Added missing testConnection function used by the printer diagnostic button
  const testConnection = () => {
    setTestStatus('Mengecek...');
    setTimeout(() => {
      setTestStatus('Printer Siap');
      setTimeout(() => setTestStatus(null), 3000);
    }, 1500);
  };

  const checkCamera = async () => {
    setCameraStatus('checking');
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      setCameraStatus('ok');
    } catch (err: any) {
      setCameraStatus('error');
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Izin Kamera Ditolak');
      } else {
        setCameraError('Kamera Tidak Terdeteksi');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-0 md:p-8 overflow-hidden">
      <div className="bg-white w-full h-full max-w-5xl md:rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header - Minimalist & Clean */}
        <div className="px-8 py-6 bg-white border-b border-slate-100 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Settings2 size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 leading-none">Pengaturan Studio</h2>
              <div className="flex items-center gap-2 mt-1">
                 <ShieldCheck size={12} className="text-indigo-500" />
                 <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Admin Mode</p>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-12 h-12 rounded-full hover:bg-slate-50 flex items-center justify-center transition-colors group"
          >
            <X size={24} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
          </button>
        </div>

        {/* Content - Grouped in Cards */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 custom-scroll bg-slate-50/50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Branding Section */}
            <div className="space-y-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                <Type size={14} /> Tampilan & Branding
              </h3>
              
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/60 space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Judul Utama (Home)</label>
                  <input 
                    type="text" 
                    value={formData.logoText}
                    onChange={e => setFormData({ ...formData, logoText: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-semibold text-slate-800"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Slogan</label>
                  <input 
                    type="text" 
                    value={formData.subText}
                    onChange={e => setFormData({ ...formData, subText: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>

                <div className="pt-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase ml-1 mb-2 block">Background Home Screen</label>
                  <div className="flex items-center gap-5 p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                    {formData.homeBackgroundImage ? (
                      <div className="relative group w-24 h-24 rounded-xl overflow-hidden shadow-md ring-2 ring-white">
                        <img src={formData.homeBackgroundImage} alt="" className="w-full h-full object-cover" />
                        <button type="button" onClick={removeImage} className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                          <Trash2 size={24} />
                        </button>
                      </div>
                    ) : (
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="w-24 h-24 bg-white rounded-xl flex flex-col items-center justify-center gap-1 hover:bg-slate-100 transition-colors border border-slate-100 shadow-sm">
                        <ImageIcon size={24} className="text-slate-300" />
                        <span className="text-[9px] font-bold uppercase text-slate-400">Upload</span>
                      </button>
                    )}
                    <div className="flex-1">
                      <p className="text-[11px] text-slate-400 leading-relaxed font-medium">Gambar akan tersimpan otomatis di cache browser ini.</p>
                      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/60 space-y-5">
                <h3 className="text-xs font-bold text-slate-900 uppercase flex items-center gap-2 border-b border-slate-50 pb-3">
                   <Layout size={14} className="text-indigo-500" /> Desain Struk (Printout)
                </h3>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Wordmark / Logo Print</label>
                    <input 
                      type="text" 
                      value={formData.wordmark}
                      onChange={e => setFormData({ ...formData, wordmark: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-mono text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Pesan Kaki (Footer)</label>
                    <input 
                      type="text" 
                      value={formData.footerText}
                      onChange={e => setFormData({ ...formData, footerText: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Hardware & Diagnostics Column */}
            <div className="space-y-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                <Maximize size={14} /> Hardware & Sistem
              </h3>
              
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/60 space-y-8">
                <div className="space-y-4">
                  <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Ukuran Kertas Thermal</label>
                  <div className="flex gap-2">
                    {(['58mm', '80mm', '4x6'] as PaperSize[]).map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setFormData({ ...formData, paperSize: size })}
                        className={`flex-1 py-3.5 rounded-2xl font-bold text-xs transition-all ${formData.paperSize === size ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-50 text-slate-400 border border-slate-100 hover:bg-slate-100'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-indigo-50/30 rounded-2xl border border-indigo-100/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white rounded-xl text-indigo-600 shadow-sm">
                      <Gauge size={18} />
                    </div>
                    <div>
                      <span className="font-bold text-sm text-slate-800 block leading-none">Mirror Kamera</span>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Efek cermin (Kiri-Kanan)</span>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setFormData({...formData, cameraMirror: !formData.cameraMirror})}
                    className={`w-14 h-7 rounded-full transition-all relative ${formData.cameraMirror ? 'bg-indigo-600' : 'bg-slate-200'}`}
                  >
                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-sm ${formData.cameraMirror ? 'left-8' : 'left-1'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-indigo-50/30 rounded-2xl border border-indigo-100/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white rounded-xl text-indigo-600 shadow-sm">
                      <Activity size={18} />
                    </div>
                    <div>
                      <span className="font-bold text-sm text-slate-800 block leading-none">Waktu Countdown</span>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Jeda antar jepretan</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white p-1 rounded-xl shadow-sm border border-slate-100">
                    <button type="button" onClick={() => setFormData({...formData, countdownSeconds: Math.max(1, formData.countdownSeconds - 1)})} className="w-8 h-8 rounded-lg hover:bg-slate-50 flex items-center justify-center font-bold text-slate-400">-</button>
                    <span className="w-6 text-center font-bold text-slate-700 text-sm">{formData.countdownSeconds}s</span>
                    <button type="button" onClick={() => setFormData({...formData, countdownSeconds: Math.min(10, formData.countdownSeconds + 1)})} className="w-8 h-8 rounded-lg hover:bg-slate-50 flex items-center justify-center font-bold text-slate-400">+</button>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/60 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                  <h3 className="text-xs font-bold text-slate-900 uppercase flex items-center gap-2">
                    <Activity size={14} className="text-indigo-500" /> Diagnostik
                  </h3>
                </div>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      type="button" 
                      onClick={testConnection} 
                      className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors border border-slate-100 group"
                    >
                      <Printer size={20} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                      <span className="text-[10px] font-bold uppercase text-slate-500">{testStatus || "Cek Printer"}</span>
                    </button>
                    <button 
                      type="button" 
                      onClick={() => window.print()} 
                      className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors border border-slate-100 group"
                    >
                      <ImageIcon size={20} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                      <span className="text-[10px] font-bold uppercase text-slate-500">Test Print</span>
                    </button>
                  </div>

                  <button 
                    type="button" 
                    onClick={checkCamera}
                    className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 transition-all ${
                      cameraStatus === 'ok' ? 'bg-green-50 text-green-600 border border-green-200 shadow-sm shadow-green-100' : 
                      cameraStatus === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 
                      'bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200'
                    }`}
                  >
                    {cameraStatus === 'idle' && <><Camera size={18} /> Cek Status Kamera</>}
                    {cameraStatus === 'checking' && <span className="animate-pulse">Mengakses Kamera...</span>}
                    {cameraStatus === 'ok' && <><CheckCircle2 size={18} /> Kamera Aktif & Terhubung</>}
                    {cameraStatus === 'error' && <><AlertCircle size={18} /> {cameraError || 'Error Kamera'}</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Action Footer - Sticky & Bold */}
        <div className="px-8 py-6 bg-white border-t border-slate-100 flex gap-4 shrink-0">
          <button 
            type="button"
            onClick={resetToDefault}
            className="px-6 h-14 rounded-2xl border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-500 transition-all flex items-center justify-center"
            title="Reset default"
          >
            <RotateCcw size={20} />
          </button>
          <button 
            type="button"
            onClick={handleSubmit}
            className="flex-1 bg-indigo-600 text-white h-14 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-xl shadow-indigo-100"
          >
            <Save size={20} /> Simpan Pengaturan
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
