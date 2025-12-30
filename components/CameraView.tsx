
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Camera, ChevronLeft } from 'lucide-react';
import { AppConfig } from '../types';

interface Props {
  config: AppConfig;
  shotsNeeded: number;
  onComplete: (images: string[]) => void;
  onBack: () => void;
}

const CameraView: React.FC<Props> = ({ config, shotsNeeded, onComplete, onBack }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [captured, setCaptured] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    async function setupCamera() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }, 
          audio: false 
        });
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      } catch (err) {
        console.error("Camera access denied", err);
      }
    }
    setupCamera();
    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const takePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setFlash(true);
    setTimeout(() => setFlash(false), 150);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (config.cameraMirror) {
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
      }
      
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCaptured(prev => [...prev, dataUrl]);
    }
  }, [config.cameraMirror]);

  useEffect(() => {
    if (captured.length === shotsNeeded) {
      setTimeout(() => onComplete(captured), 500);
    } else if (isCapturing && countdown === null) {
      setCountdown(config.countdownSeconds);
    }
  }, [captured, isCapturing, shotsNeeded, countdown, config.countdownSeconds, onComplete]);

  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      takePhoto();
      setCountdown(null);
    }
  }, [countdown, takePhoto]);

  const startProcess = () => {
    setIsCapturing(true);
    setCountdown(config.countdownSeconds);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 animate-in fade-in duration-500 overflow-hidden">
      <canvas ref={canvasRef} className="hidden" />
      
      <div className="w-full text-center mb-4 shrink-0">
        <h2 className="text-2xl font-black uppercase tracking-tighter italic">{config.logoText}</h2>
      </div>

      <div className="relative w-full max-w-lg aspect-[3/4] bg-black rounded-lg overflow-hidden shadow-2xl border-[4px] border-black shrink min-h-0">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className={`w-full h-full object-cover ${config.cameraMirror ? 'scale-x-[-1]' : ''}`} 
        />
        
        {/* Countdown Overlay */}
        {countdown !== null && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-10">
            <span className="text-white text-9xl font-black animate-pulse drop-shadow-2xl">
              {countdown === 0 ? "SMILE" : countdown}
            </span>
          </div>
        )}

        {/* Status Overlay */}
        <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 z-20 shadow-md">
          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
          Capture {captured.length + 1} / {shotsNeeded}
        </div>

        {/* Flash effect */}
        {flash && <div className="absolute inset-0 bg-white z-[100]" />}
      </div>

      <div className="mt-6 flex flex-col items-center gap-4 w-full shrink-0">
        {!isCapturing ? (
          <>
            <button 
              onClick={startProcess}
              className="px-12 py-4 bg-black text-white rounded-full font-black text-lg uppercase tracking-widest flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl"
            >
              <Camera size={24} /> Take Photos
            </button>
            <button 
              onClick={onBack}
              className="flex items-center gap-1 text-gray-400 hover:text-black font-black uppercase text-[10px] tracking-widest transition-colors"
            >
              <ChevronLeft size={12} /> BACK TO LAYOUT
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-3">
              {Array.from({ length: shotsNeeded }).map((_, i) => (
                <div 
                  key={i} 
                  className={`w-4 h-4 rounded-full border-2 border-black transition-all ${i < captured.length ? 'bg-black scale-110' : 'bg-transparent'}`} 
                />
              ))}
            </div>
            <p className="text-black font-black uppercase tracking-widest text-sm animate-pulse mt-2">
              SMILE TO THE CAMERA!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraView;