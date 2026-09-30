import React, { useState, useEffect, useRef, useCallback } from 'react';
import jsQR from 'jsqr';
import { CampusBin } from '../types';
import { 
  QrCode, 
  X, 
  Search, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Navigation, 
  Printer, 
  Camera, 
  Trash2,
  Clock,
  Sparkles,
  SwitchCamera,
  Zap,
  ZapOff,
  RefreshCw,
  AlertCircle,
  Video,
  Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ScanBinModalProps {
  isOpen: boolean;
  onClose: () => void;
  bins: CampusBin[];
  onSelectBinAndShowMap: (bin: CampusBin) => void;
  onReportBin: (bin: CampusBin) => void;
  onOpenPlacardModal?: (bin: CampusBin) => void;
}

export const ScanBinModal: React.FC<ScanBinModalProps> = ({
  isOpen,
  onClose,
  bins,
  onSelectBinAndShowMap,
  onReportBin,
  onOpenPlacardModal,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [selectedScannedBin, setSelectedScannedBin] = useState<CampusBin | null>(null);
  const [cameraState, setCameraState] = useState<'idle' | 'requesting' | 'active' | 'denied' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [torchAvailable, setTorchAvailable] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [hasScannedSuccess, setHasScannedSuccess] = useState(false);
  const [lastScannedRaw, setLastScannedRaw] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeStreamRef = useRef<MediaStream | null>(null);
  const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Play short acoustic tone on recognized scan
  const playBeep = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.16);
    } catch {
      // AudioContext restricted or unavailable
    }
  };

  // Match raw decoded text against registered dustbins
  const matchBinFromQrData = useCallback((rawData: string): CampusBin | null => {
    const text = rawData.trim().toLowerCase();
    
    // 1. Direct ID match (e.g. "bin-chem-1")
    const directMatch = bins.find(b => b.id.toLowerCase() === text);
    if (directMatch) return directMatch;

    // 2. Formatted ID match (e.g. "nitp-bin-chem-1" or URL path "/bin-chem-1")
    const formattedMatch = bins.find(b => {
      const bId = b.id.toLowerCase();
      return text.includes(bId) || text.includes(`nitp-${bId}`);
    });
    if (formattedMatch) return formattedMatch;

    // 3. Name or Landmark match (e.g. "chemistry", "sac", "cse")
    const nameMatch = bins.find(b => {
      const lowerName = b.name.toLowerCase();
      const firstWord = lowerName.split(' ')[0];
      return text.includes(lowerName) || text.includes(firstWord);
    });
    if (nameMatch) return nameMatch;

    return null;
  }, [bins]);

  // Cleanly shut down camera stream & timers
  const stopCamera = useCallback(() => {
    if (scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current);
      scanTimeoutRef.current = null;
    }
    if (activeStreamRef.current) {
      activeStreamRef.current.getTracks().forEach((track) => track.stop());
      activeStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setTorchOn(false);
  }, []);

  // Request camera and initialize live stream with resilient fallbacks
  const startCamera = useCallback(async () => {
    stopCamera();
    setCameraState('requesting');
    setErrorMessage(null);

    if (!navigator?.mediaDevices?.getUserMedia) {
      setCameraState('error');
      setErrorMessage('Camera access is not supported by your browser.');
      return;
    }

    let stream: MediaStream | null = null;

    try {
      // Attempt 1: Optimal resolution & requested facingMode
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
      } catch (err1) {
        console.warn('Attempt 1 (ideal resolution) failed, falling back to facingMode:', err1);
        // Attempt 2: facingMode only
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: facingMode } },
            audio: false,
          });
        } catch (err2) {
          console.warn('Attempt 2 (facingMode) failed, falling back to basic video:', err2);
          // Attempt 3: Any available video device
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
        }
      }

      if (!stream) {
        throw new Error('No media stream obtained.');
      }

      activeStreamRef.current = stream;
      setCameraState('active');

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(() => {});
        };
        videoRef.current.play().catch(() => {});
      }

      // Check torch capability
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        const capabilities = (videoTrack.getCapabilities?.() as { torch?: boolean }) || {};
        setTorchAvailable(!!capabilities.torch);
      }
    } catch (err: unknown) {
      console.warn('Camera access error:', err);
      const isDenied = (err as { name?: string })?.name === 'NotAllowedError' || (err as { name?: string })?.name === 'PermissionDeniedError';
      setCameraState(isDenied ? 'denied' : 'error');
      setErrorMessage(
        isDenied
          ? 'Camera permission is required. Please check your browser address bar permissions, or use "Snap Camera Photo" below.'
          : 'Could not connect to camera device. Ensure no other application is using it.'
      );
    }
  }, [facingMode, stopCamera]);

  // Synchronize video element whenever camera becomes active
  useEffect(() => {
    if (cameraState === 'active' && videoRef.current && activeStreamRef.current) {
      if (videoRef.current.srcObject !== activeStreamRef.current) {
        videoRef.current.srcObject = activeStreamRef.current;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(() => {});
        };
        videoRef.current.play().catch(() => {});
      }
    }
  }, [cameraState]);

  // Watch for browser camera permission changes: if user grants, immediately start camera
  useEffect(() => {
    if (!navigator.permissions?.query) return;
    let permStatus: PermissionStatus | null = null;
    navigator.permissions
      .query({ name: 'camera' as PermissionName })
      .then((status) => {
        permStatus = status;
        status.onchange = () => {
          if (status.state === 'granted' && isOpen) {
            startCamera();
          }
        };
      })
      .catch(() => {});

    return () => {
      if (permStatus) {
        permStatus.onchange = null;
      }
    };
  }, [isOpen, startCamera]);

  // Handle open / close lifecycle
  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setSelectedScannedBin(null);
      setSearchInput('');
      setLastScannedRaw(null);
      setErrorMessage(null);
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, startCamera, stopCamera]);

  // Real-time video frame decoding loop using jsQR
  useEffect(() => {
    if (cameraState !== 'active') return;

    const canvas = canvasRef.current || document.createElement('canvas');
    canvasRef.current = canvas;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    let isScanning = true;

    const scanFrame = () => {
      if (!isScanning) return;
      const video = videoRef.current;
      if (!video || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
        scanTimeoutRef.current = setTimeout(scanFrame, 200);
        return;
      }

      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
      }

      if (ctx && canvas.width > 0 && canvas.height > 0) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        try {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const qrCode = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
          });

          if (qrCode && qrCode.data) {
            const foundBin = matchBinFromQrData(qrCode.data);
            if (foundBin) {
              playBeep();
              if (navigator.vibrate) navigator.vibrate(100);
              setSelectedScannedBin(foundBin);
              setLastScannedRaw(qrCode.data);
              setHasScannedSuccess(true);
              setTimeout(() => setHasScannedSuccess(false), 1600);
            }
          }
        } catch {
          // ignore frame decode err
        }
      }

      scanTimeoutRef.current = setTimeout(scanFrame, 180);
    };

    scanFrame();

    return () => {
      isScanning = false;
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
        scanTimeoutRef.current = null;
      }
    };
  }, [cameraState, matchBinFromQrData]);

  // Torch toggle
  const handleToggleTorch = async () => {
    if (!activeStreamRef.current) return;
    const track = activeStreamRef.current.getVideoTracks()[0];
    if (!track) return;
    try {
      const nextTorch = !torchOn;
      // @ts-expect-error torch is advanced constraint in W3C ImageCapture spec
      await track.applyConstraints({ advanced: [{ torch: nextTorch }] });
      setTorchOn(nextTorch);
    } catch {
      // Torch not supported
    }
  };

  // Switch between back / front camera
  const handleSwitchCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Handle native camera photo capture (works reliably in all browser security contexts & iframes)
  const handleNativeCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        try {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const qrCode = jsQR(imageData.data, imageData.width, imageData.height);
          if (qrCode && qrCode.data) {
            const found = matchBinFromQrData(qrCode.data);
            if (found) {
              playBeep();
              if (navigator.vibrate) navigator.vibrate(100);
              setSelectedScannedBin(found);
              setLastScannedRaw(qrCode.data);
              setHasScannedSuccess(true);
              setErrorMessage(null);
              setTimeout(() => setHasScannedSuccess(false), 2000);
            } else {
              setErrorMessage(`Scanned QR code ("${qrCode.data}") does not match a registered campus dustbin.`);
            }
          } else {
            setErrorMessage('No valid QR code was detected in the photo. Please align the QR code squarely in good lighting.');
          }
        } catch (err) {
          console.warn('Decode err:', err);
          setErrorMessage('Could not process photo for QR decoding.');
        }
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  // Filtered bins based on search ID or name
  const matchedBins = bins.filter((b) => {
    const q = searchInput.trim().toLowerCase();
    if (!q) return false;
    const formattedId = `nitp-${b.id}`.toLowerCase();
    return (
      b.id.toLowerCase().includes(q) ||
      formattedId.includes(q) ||
      b.name.toLowerCase().includes(q) ||
      b.locationName.toLowerCase().includes(q) ||
      b.landmark.toLowerCase().includes(q)
    );
  });

  const handleSimulateScan = (bin: CampusBin) => {
    playBeep();
    setSelectedScannedBin(bin);
    setHasScannedSuccess(true);
    setTimeout(() => setHasScannedSuccess(false), 1200);
  };

  const currentBin = selectedScannedBin || (matchedBins.length === 1 ? matchedBins[0] : null);

  if (!isOpen) return null;

  return (
    <div 
      id="modal-scan-bin-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      {/* Hidden native camera capture input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleNativeCameraCapture}
        className="hidden"
        id="camera-native-file-input"
      />

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-stone-900/60"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="relative z-10 bg-white w-full max-w-lg rounded-lg shadow-xl border border-stone-200 overflow-hidden my-auto"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded bg-[#134E3A] text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-bold text-stone-900 font-editorial">
                  Dustbin QR Code Scanner
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded font-mono-code border ${
                  cameraState === 'active' 
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                    : 'bg-stone-200 text-stone-700 border-stone-300'
                }`}>
                  {cameraState === 'active' ? 'Camera Live' : 'Camera Ready'}
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                Point your camera at any campus dustbin placard QR code
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded bg-white hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer border border-stone-200"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
          
          {/* Live Camera Viewfinder Box */}
          <div className="relative rounded-lg overflow-hidden bg-stone-950 border border-stone-800 aspect-4/3 sm:aspect-16/10 flex items-center justify-center shadow-inner">
            
            {/* Real Video Camera Stream */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                cameraState === 'active' ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            />

            {/* Requesting Camera Loader State */}
            {cameraState === 'requesting' && (
              <div className="flex flex-col items-center gap-2 text-stone-300 z-20 px-4 text-center">
                <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
                <span className="font-semibold text-xs text-white">Opening Camera...</span>
                <p className="text-[11px] text-stone-400 max-w-xs">
                  Requesting camera stream. If prompted, please allow camera permission.
                </p>
              </div>
            )}

            {/* Camera Denied / Error State with Direct Access Actions */}
            {(cameraState === 'denied' || cameraState === 'error') && (
              <div className="flex flex-col items-center gap-2.5 text-stone-300 z-20 px-4 text-center max-w-sm">
                <div className="w-10 h-10 rounded-full bg-rose-950/80 border border-rose-700/60 text-rose-400 flex items-center justify-center">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-xs text-white block">
                    Access Campus Camera
                  </span>
                  <p className="text-[11px] text-stone-400 leading-snug mt-1">
                    {errorMessage || 'Tap below to grant camera access or snap a photo of the dustbin QR code.'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 mt-1">
                  <button
                    type="button"
                    onClick={startCamera}
                    className="px-3.5 py-1.5 rounded bg-[#046A38] hover:bg-[#03532c] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <Video className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Access Camera Now</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-600 font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5 text-amber-400" />
                    <span>Snap Photo</span>
                  </button>
                </div>
              </div>
            )}

            {/* Scanner Reticle Overlay (when active) */}
            {cameraState === 'active' && (
              <>
                {/* Dark Vignette Mask */}
                <div className="absolute inset-0 bg-stone-950/30 pointer-events-none" />

                {/* Target Bounding Box */}
                <div className="w-48 h-48 sm:w-56 sm:h-56 relative rounded-lg border-2 border-emerald-400/70 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.25)] z-20 pointer-events-none">
                  {/* Corner Reticles */}
                  <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-emerald-400 rounded-tl-sm"></div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-emerald-400 rounded-tr-sm"></div>
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-emerald-400 rounded-bl-sm"></div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-emerald-400 rounded-br-sm"></div>

                  {/* Scanning Laser Beam */}
                  <motion.div 
                    className="absolute left-2 right-2 h-0.5 bg-emerald-400 shadow-[0_0_10px_#10b981]"
                    animate={{ top: ['10%', '90%', '10%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />

                  {/* Recognition Success Flash */}
                  {hasScannedSuccess && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-emerald-500/30 rounded flex items-center justify-center"
                    >
                      <div className="px-3 py-1 rounded bg-[#046A38] text-white font-bold text-xs flex items-center gap-1 shadow-lg">
                        <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                        <span>QR Recognized!</span>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Top Overlay Camera Status Bar */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-auto">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-900/80 border border-stone-700/80 text-[10px] text-emerald-400 font-mono-code backdrop-blur-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Camera Live &bull; Auto-detecting</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {torchAvailable && (
                      <button
                        type="button"
                        onClick={handleToggleTorch}
                        className={`p-1.5 rounded-full border transition-colors cursor-pointer ${
                          torchOn 
                            ? 'bg-amber-400 text-stone-950 border-amber-300 shadow-xs' 
                            : 'bg-stone-900/80 text-stone-300 border-stone-700 hover:text-white'
                        }`}
                        title={torchOn ? 'Turn off torch' : 'Turn on torch'}
                      >
                        {torchOn ? <Zap className="w-3.5 h-3.5" /> : <ZapOff className="w-3.5 h-3.5" />}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-1.5 rounded-full bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700 transition-colors cursor-pointer"
                      title="Snap photo with camera app"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={handleSwitchCamera}
                      className="p-1.5 rounded-full bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700 transition-colors cursor-pointer"
                      title="Switch front / rear camera"
                    >
                      <SwitchCamera className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Bottom Overlay Instructional Text */}
                <div className="absolute bottom-2.5 left-3 right-3 text-center z-20 pointer-events-none">
                  <span className="px-3 py-1 rounded bg-stone-900/80 text-[10px] text-stone-300 font-mono-code border border-stone-800 backdrop-blur-xs">
                    Align station QR inside green box
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Camera Access Actions Bar */}
          <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-stone-50 border border-stone-200">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#134E3A]" />
              <span className="text-[11px] font-medium text-stone-700">
                {cameraState === 'active' ? 'Camera stream active' : 'Need camera access?'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {cameraState !== 'active' ? (
                <button
                  type="button"
                  onClick={startCamera}
                  className="px-2.5 py-1 rounded bg-[#046A38] hover:bg-[#03532c] text-white font-semibold text-[11px] flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                >
                  <Video className="w-3 h-3 text-emerald-200" />
                  <span>Access Camera</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopCamera}
                  className="px-2.5 py-1 rounded bg-stone-200 hover:bg-stone-300 text-stone-700 font-medium text-[11px] transition-colors cursor-pointer"
                >
                  Pause Camera
                </button>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 rounded bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 font-medium text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                title="Open device camera photo capture"
              >
                <Camera className="w-3 h-3 text-stone-500" />
                <span>Take Photo</span>
              </button>
            </div>
          </div>

          {/* Quick presets for testing or quick simulation */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 font-mono-code">
                Select Station Quick Shortcut:
              </span>
              <span className="text-[10px] text-stone-400">Tap to test scan</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {bins.slice(0, 7).map((b) => (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  key={b.id}
                  type="button"
                  onClick={() => handleSimulateScan(b)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono-code transition-colors cursor-pointer border ${
                    currentBin?.id === b.id
                      ? 'bg-[#134E3A] text-white border-[#134E3A] shadow-2xs'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                  }`}
                >
                  {b.name.split(' ')[0]} ({b.floor.split(' ')[0]})
                </motion.button>
              ))}
            </div>
          </div>

          {/* Search by station ID */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block font-mono-code">
              Or Manual Station ID / Keyword Lookup:
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-2.5 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setSelectedScannedBin(null);
                }}
                placeholder="Search e.g. 'chem', 'sac', 'library', 'gate'..."
                className="w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-300 rounded text-xs text-stone-900 placeholder-stone-400 focus:outline-hidden focus:border-[#134E3A] focus:bg-white font-mono-code"
              />
            </div>

            {searchInput.trim() && matchedBins.length > 1 && !selectedScannedBin && (
              <div className="mt-1 border border-stone-200 rounded max-h-36 overflow-y-auto divide-y divide-stone-100 bg-white shadow-2xs">
                {matchedBins.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => setSelectedScannedBin(b)}
                    className="p-2 hover:bg-stone-50 cursor-pointer flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-stone-900">{b.name}</div>
                      <div className="text-[10px] text-stone-500">{b.locationName}</div>
                    </div>
                    <span className="text-[10px] font-mono-code bg-stone-100 px-1.5 py-0.5 rounded text-stone-700">
                      {b.fillLevel}% Full
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Scanned Station Details Card */}
          {currentBin && (
            <div className="p-3.5 rounded-lg border-2 border-emerald-500 bg-emerald-50/50 space-y-3 animate-in fade-in duration-150">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 font-mono-code">
                      Verified Station #{currentBin.id.toUpperCase()}
                    </span>
                  </div>
                  <h4 className="font-bold text-stone-900 text-sm font-editorial mt-0.5">
                    {currentBin.name}
                  </h4>
                  <p className="text-[11px] text-stone-600 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{currentBin.locationName}</span>
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono-code ${
                    currentBin.status === 'normal'
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : currentBin.status === 'filling'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-rose-100 text-rose-900 border border-rose-300'
                  }`}>
                    {currentBin.status}
                  </span>
                  <div className="text-xs font-bold text-stone-900 font-mono-code mt-1">
                    {currentBin.fillLevel}% Full
                  </div>
                </div>
              </div>

              {/* Detail chips */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded bg-white border border-stone-200">
                  <span className="text-[9px] font-bold uppercase text-stone-500 block font-mono-code">Accepted Streams</span>
                  <div className="flex items-center gap-1 mt-1">
                    {currentBin.hasWet && (
                      <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-900 border border-emerald-200 text-[10px]">
                        Wet (Green)
                      </span>
                    )}
                    {currentBin.hasDry && (
                      <span className="px-1.5 py-0.2 rounded bg-sky-50 text-sky-900 border border-sky-200 text-[10px]">
                        Dry (Blue)
                      </span>
                    )}
                    {currentBin.hasEwaste && (
                      <span className="px-1.5 py-0.2 rounded bg-stone-800 text-stone-100 text-[10px]">
                        E-Waste
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-2 rounded bg-white border border-stone-200">
                  <span className="text-[9px] font-bold uppercase text-stone-500 block font-mono-code">Housekeeping Log</span>
                  <div className="text-stone-800 font-medium mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-stone-500" />
                    <span>Emptied {currentBin.lastEmptied}</span>
                  </div>
                </div>
              </div>

              {/* Landmark info */}
              <div className="p-2 rounded bg-white border border-stone-200 text-[11px] text-stone-600">
                <strong className="text-stone-800">Physical Landmark:</strong> {currentBin.landmark}
              </div>

              {/* Actions toolbar */}
              <div className="pt-2 border-t border-emerald-200 flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onSelectBinAndShowMap(currentBin);
                  }}
                  className="px-3 py-1.5 rounded bg-[#134E3A] hover:bg-[#0F3E2E] text-white text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Highlight on Plan</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onReportBin(currentBin);
                  }}
                  className="px-2.5 py-1.5 rounded bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-medium border border-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                  <span>Report Full / Issue</span>
                </button>

                {onOpenPlacardModal && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenPlacardModal(currentBin);
                    }}
                    className="px-2.5 py-1.5 rounded bg-white hover:bg-stone-100 text-stone-700 text-xs font-medium border border-stone-300 flex items-center gap-1 cursor-pointer transition-colors"
                    title="Print physical signage sticker"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Placard</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span className="font-mono-code text-[11px]">
            Real-time Camera Scanner &bull; NIT Patna SBM
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-stone-200 hover:bg-stone-300 text-stone-800 font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
