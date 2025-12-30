
import React, { useState, useEffect } from 'react';
import { Lock, Home } from 'lucide-react';
import { PhotoboothState, LayoutType, AppConfig } from './types';
import { DEFAULT_CONFIG, LAYOUTS } from './constants';
import CameraView from './components/CameraView';
import LayoutSelector from './components/LayoutSelector';
import PhotoPreview from './components/PhotoPreview';
import AdminPanel from './components/AdminPanel';

const App: React.FC = () => {
  const [config, setConfig] = useState<AppConfig>(() => {
    // This handles the "simpan cache" requirement using localStorage persistence
    const saved = localStorage.getItem('photobooth_config');
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });

  const [state, setState] = useState<PhotoboothState>({
    currentStep: 'HOME',
    selectedLayout: 'SOLO',
    capturedImages: [],
  });

  const [showPinEntry, setShowPinEntry] = useState(false);
  const [pin, setPin] = useState('');

  useEffect(() => {
    localStorage.setItem('photobooth_config', JSON.stringify(config));
  }, [config]);

  const resetSession = () => {
    setState({
      currentStep: 'HOME',
      selectedLayout: 'SOLO',
      capturedImages: [],
    });
  };

  const handleStart = () => {
    setState(prev => ({ ...prev, currentStep: 'LAYOUT' }));
  };

  const handleSelectLayout = (layout: LayoutType) => {
    setState(prev => ({ ...prev, selectedLayout: layout, currentStep: 'CAPTURE', capturedImages: [] }));
  };

  const handlePhotosCaptured = (images: string[]) => {
    setState(prev => ({ ...prev, capturedImages: images, currentStep: 'PREVIEW' }));
  };

  const handleAdminUpdate = (newConfig: AppConfig) => {
    setConfig(newConfig);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1234') {
      setState(prev => ({ ...prev, currentStep: 'ADMIN' }));
      setShowPinEntry(false);
      setPin('');
    } else {
      alert('Wrong PIN!');
      setPin('');
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-white text-black overflow-hidden relative">
      {/* Hidden Admin Trigger - Bottom Left */}
      <button 
        onClick={() => setShowPinEntry(true)}
        className="absolute bottom-4 left-4 z-50 p-3 text-gray-200 hover:text-black transition-colors no-print"
      >
        <Lock size={14} />
      </button>

      {/* PIN Entry Modal */}
      {showPinEntry && (
        <div className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl w-full max-w-xs text-center shadow-2xl">
            <h3 className="text-xl font-black mb-6 uppercase tracking-tighter">Enter Admin PIN</h3>
            <form onSubmit={handlePinSubmit} className="space-y-4">
              <input 
                type="password" 
                autoFocus
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="****"
                className="w-full text-center text-3xl font-black tracking-[1em] border-b-4 border-black outline-none pb-2"
                maxLength={4}
              />
              <div className="flex gap-2">
                <button 
                  type="button"
                  onClick={() => { setShowPinEntry(false); setPin(''); }}
                  className="flex-1 py-3 text-gray-500 font-bold uppercase text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-black text-white font-black uppercase text-sm rounded-lg"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Step Rendering */}
      <main className="flex-1 flex flex-col items-center justify-center overflow-hidden">
        {state.currentStep === 'HOME' && (
          <div 
            className="w-full h-full flex flex-col items-center justify-center cursor-pointer animate-in fade-in duration-700 p-8 relative"
            onClick={handleStart}
            style={config.homeBackgroundImage ? {
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4)), url(${config.homeBackgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            } : {}}
          >
            <div className={`text-center space-y-4 z-10 ${config.homeBackgroundImage ? 'bg-white/80 p-10 rounded-3xl backdrop-blur-md shadow-2xl border-4 border-black' : ''}`}>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none max-w-2xl drop-shadow-sm">
                {config.logoText}
              </h1>
              <p className="text-xl md:text-2xl font-medium tracking-widest text-black/60 uppercase">
                {config.subText}
              </p>
            </div>
            
            <div className="mt-16 md:mt-24 z-10">
              <div className="px-12 py-5 bg-black text-white border-[3px] border-black rounded-full font-black uppercase tracking-[0.2em] text-xl hover:bg-white hover:text-black transition-all transform active:scale-95 shadow-2xl">
                Tap to Start
              </div>
            </div>
          </div>
        )}

        {state.currentStep === 'LAYOUT' && (
          <div className="w-full h-full overflow-hidden flex items-center justify-center">
            <LayoutSelector 
              onSelect={handleSelectLayout} 
              onBack={() => setState(prev => ({ ...prev, currentStep: 'HOME' }))} 
            />
          </div>
        )}

        {state.currentStep === 'CAPTURE' && (
          <div className="w-full h-full overflow-hidden flex items-center justify-center">
            <CameraView 
              config={config}
              shotsNeeded={LAYOUTS.find(l => l.id === state.selectedLayout)?.shotsNeeded || 1}
              onComplete={handlePhotosCaptured}
              onBack={() => setState(prev => ({ ...prev, currentStep: 'LAYOUT' }))}
            />
          </div>
        )}

        {state.currentStep === 'PREVIEW' && (
          <div className="w-full h-full overflow-hidden">
             <PhotoPreview 
              config={config}
              layout={state.selectedLayout}
              images={state.capturedImages}
              onReset={resetSession}
              onRetake={resetSession}
            />
          </div>
        )}

        {state.currentStep === 'ADMIN' && (
          <AdminPanel 
            config={config} 
            onSave={handleAdminUpdate} 
            onClose={() => setState(prev => ({ ...prev, currentStep: 'HOME' }))} 
          />
        )}
      </main>
      
      {state.currentStep !== 'HOME' && state.currentStep !== 'ADMIN' && state.currentStep !== 'PREVIEW' && (
        <footer className="p-4 text-center text-xs text-gray-300 font-mono no-print">
          <button onClick={resetSession} className="hover:text-black flex items-center gap-1 mx-auto transition-colors">
            <Home size={14} /> EXIT SESSION
          </button>
        </footer>
      )}
    </div>
  );
};

export default App;