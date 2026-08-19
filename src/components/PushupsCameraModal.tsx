import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  X,
  Play,
  RotateCcw,
  CheckCircle,
  Volume2,
  VolumeX,
  Sparkles,
  Flame,
  Award,
  Plus,
  Minus,
  RefreshCw
} from 'lucide-react';
import { Exercise, UserStats } from '../types';
import { triggerHaptic } from '../utils/haptics';

interface PushupsCameraModalProps {
  exercise: Exercise;
  onClose: () => void;
  onCompleteWorkout: (result: {
    durationMinutes: number;
    setsCompleted: number;
    repsOrDistance: string;
    caloriesBurned: number;
    xpEarned: number;
    statsEarned: Partial<UserStats>;
  }) => void;
}

export const PushupsCameraModal: React.FC<PushupsCameraModalProps> = ({
  exercise,
  onClose,
  onCompleteWorkout
}) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [reps, setReps] = useState(0);
  const [targetReps, setTargetReps] = useState(15);
  const [isWorkoutRunning, setIsWorkoutRunning] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [poseState, setPoseState] = useState<'UP' | 'DOWN' | 'READY'>('READY');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Motion detection variables
  const prevFrameDataRef = useRef<Uint8ClampedArray | null>(null);
  const positionHistoryRef = useRef<number[]>([]);
  const lastStateChangeTimeRef = useRef<number>(Date.now());
  const inDownPositionRef = useRef<boolean>(false);

  // Sound beep utility
  const playBeep = (freq = 600, duration = 120) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration / 1000);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration / 1000);
    } catch {
      // Audio context might be restricted before interaction
    }
  };

  // Start Camera
  const startCamera = async () => {
    try {
      setCameraError(null);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError('Камера недоступна. Вы можете считать повторения вручную или разрешить доступ к камере.');
      setCameraActive(false);
    }
  };

  useEffect(() => {
    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [facingMode]);

  // Workout Timer
  useEffect(() => {
    let timer: any;
    if (isWorkoutRunning) {
      timer = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isWorkoutRunning]);

  // Real-time Motion & Rep Detection Loop
  useEffect(() => {
    if (!cameraActive || !isWorkoutRunning) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const processFrame = () => {
      if (!isWorkoutRunning || video.readyState !== 4) {
        animFrameIdRef.current = requestAnimationFrame(processFrame);
        return;
      }

      const width = canvas.width;
      const height = canvas.height;

      ctx.drawImage(video, 0, 0, width, height);
      const frame = ctx.getImageData(0, 0, width, height);
      const data = frame.data;

      // Optical movement & center of mass analysis
      let totalMotion = 0;
      let weightedY = 0;
      let motionPixels = 0;

      if (prevFrameDataRef.current) {
        const prevData = prevFrameDataRef.current;
        const step = 4; // Sample every 4th pixel for high performance

        for (let i = 0; i < data.length; i += step * 4) {
          const rDiff = Math.abs(data[i] - prevData[i]);
          const gDiff = Math.abs(data[i + 1] - prevData[i + 1]);
          const bDiff = Math.abs(data[i + 2] - prevData[i + 2]);
          const diff = (rDiff + gDiff + bDiff) / 3;

          if (diff > 35) {
            const pixelIndex = i / 4;
            const y = Math.floor(pixelIndex / width);
            totalMotion += diff;
            weightedY += y;
            motionPixels++;
          }
        }
      }

      // Save copy of current frame for next diff
      prevFrameDataRef.current = new Uint8ClampedArray(data);

      if (motionPixels > 250) {
        const avgMotionY = weightedY / motionPixels; // 0 (top) to height (bottom)
        const normalizedY = avgMotionY / height;

        const history = positionHistoryRef.current;
        history.push(normalizedY);
        if (history.length > 8) history.shift();

        const avgY = history.reduce((a, b) => a + b, 0) / history.length;
        const now = Date.now();

        // Rep detection state machine
        // Down position: body motion shifts towards lower part (> 0.55)
        // Up position: body returns to upper part (< 0.42)
        if (avgY > 0.52 && !inDownPositionRef.current && now - lastStateChangeTimeRef.current > 500) {
          inDownPositionRef.current = true;
          setPoseState('DOWN');
          lastStateChangeTimeRef.current = now;
          playBeep(450, 100);
          triggerHaptic('light');
        } else if (avgY < 0.45 && inDownPositionRef.current && now - lastStateChangeTimeRef.current > 500) {
          inDownPositionRef.current = false;
          setPoseState('UP');
          lastStateChangeTimeRef.current = now;
          playBeep(880, 180);
          triggerHaptic('success');
          setReps((prev) => prev + 1);
        }
      }

      animFrameIdRef.current = requestAnimationFrame(processFrame);
    };

    animFrameIdRef.current = requestAnimationFrame(processFrame);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [cameraActive, isWorkoutRunning]);

  const handleFinish = () => {
    triggerHaptic('success');
    const durationMin = Math.max(1, Math.ceil(secondsElapsed / 60));
    const bonusXp = reps * 5 + exercise.xpReward;
    const strGain = Math.max(3, Math.round(reps / 5));

    onCompleteWorkout({
      durationMinutes: durationMin,
      setsCompleted: 1,
      repsOrDistance: `${reps} отжиманий`,
      caloriesBurned: Math.round(reps * 0.8 + 20),
      xpEarned: bonusXp,
      statsEarned: { strength: strGain, endurance: 1 }
    });
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 text-white flex flex-col justify-between max-w-lg mx-auto select-none">
      {/* Top Bar */}
      <div className="p-4 flex items-center justify-between z-20 bg-gradient-to-b from-black/80 to-transparent">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <h3 className="text-sm font-extrabold tracking-tight">
              Камера AI: Отжимания
            </h3>
          </div>
          <p className="text-[11px] text-slate-300 font-medium">
            Поставьте телефон так, чтобы корпус был виден в кадре
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'))}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200"
            title="Переключить камеру"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Video Viewfinder & AI HUD */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden mx-4 my-2 rounded-3xl border border-white/15 bg-slate-900">
        <video
          ref={videoRef}
          playsInline
          muted
          className={`w-full h-full object-cover rounded-3xl ${
            facingMode === 'user' ? '-scale-x-100' : ''
          }`}
        />

        {/* Hidden Canvas for Frame Processing */}
        <canvas ref={canvasRef} width={240} height={180} className="hidden" />

        {/* Camera Guidelines Silhouette Overlay */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-4/5 h-1/2 border-2 border-dashed border-white/30 rounded-2xl flex items-center justify-center">
            <span className="text-[11px] font-bold text-white/60 bg-black/40 px-3 py-1 rounded-full backdrop-blur-xs">
              Расположите тело горизонтально в рамке
            </span>
          </div>
        </div>

        {/* Pose State HUD Pill */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          <div
            className={`px-3 py-1.5 rounded-xl text-xs font-black backdrop-blur-md transition-all ${
              poseState === 'DOWN'
                ? 'bg-[#D21624]/90 text-white shadow-lg shadow-red-500/30 scale-105'
                : poseState === 'UP'
                ? 'bg-emerald-600/90 text-white shadow-lg shadow-emerald-500/30'
                : 'bg-black/60 text-slate-300'
            }`}
          >
            {poseState === 'DOWN'
              ? '⬇️ НИЗ (Опустились)'
              : poseState === 'UP'
              ? '⬆️ ВВЕРХ (Отжались)'
              : 'Готовьтесь к отжиманию'}
          </div>
        </div>

        {/* Live Timer Pill */}
        <div className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-slate-200">
          ⏱️ {formatTime(secondsElapsed)}
        </div>

        {/* Big Rep Counter Hero Badge */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
          <div className="bg-black/70 backdrop-blur-md border border-white/20 px-8 py-3 rounded-3xl flex items-baseline gap-2 shadow-2xl">
            <span className="text-5xl sm:text-6xl font-black text-amber-400 font-mono tracking-tight">
              {reps}
            </span>
            <span className="text-sm font-bold text-slate-300">/ {targetReps} повт</span>
          </div>
          <span className="text-[10px] font-black uppercase text-slate-400 mt-1.5 tracking-wider">
            Автоматический подсчет повторений
          </span>
        </div>

        {/* Camera Permission Warning if failed */}
        {cameraError && (
          <div className="absolute inset-0 bg-slate-950/90 p-6 flex flex-col items-center justify-center text-center z-30">
            <Camera className="w-12 h-12 text-slate-400 mb-2" />
            <p className="text-sm font-bold text-slate-200 mb-4">{cameraError}</p>
            <div className="flex gap-2">
              <button
                onClick={startCamera}
                className="bg-[#1664B0] px-4 py-2 rounded-xl text-xs font-bold"
              >
                Повторить запрос
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls Bar */}
      <div className="p-4 bg-slate-950/90 backdrop-blur-md border-t border-white/10 space-y-3 z-20">
        {/* Manual Adjust Bar (if camera missed one) */}
        <div className="flex items-center justify-between px-2">
          <span className="text-xs font-bold text-slate-400">
            Ручная корректировка:
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setReps((prev) => Math.max(0, prev - 1))}
              className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center active:scale-95 text-slate-300"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-mono text-sm font-black text-white">{reps}</span>
            <button
              onClick={() => setReps((prev) => prev + 1)}
              className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center active:scale-95 text-slate-300"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {!isWorkoutRunning ? (
            <button
              onClick={() => {
                triggerHaptic('medium');
                setIsWorkoutRunning(true);
              }}
              className="flex-1 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-white" /> Запустить тренировку
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-sm shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <CheckCircle className="w-4 h-4" /> Завершить ({reps} повт)
            </button>
          )}

          <button
            onClick={() => {
              triggerHaptic('light');
              setReps(0);
              setSecondsElapsed(0);
            }}
            className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-300"
            title="Сбросить счетчик"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
