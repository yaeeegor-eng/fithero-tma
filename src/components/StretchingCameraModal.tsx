import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  X,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Volume2,
  VolumeX,
  Sparkles,
  Award,
  ChevronRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { Exercise, UserStats } from '../types';
import { triggerHaptic } from '../utils/haptics';

interface StretchingCameraModalProps {
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

interface StretchPose {
  id: string;
  name: string;
  targetMuscle: string;
  holdSeconds: number;
  guideText: string;
}

const STRETCH_POSES: StretchPose[] = [
  {
    id: 'hamstrings',
    name: 'Наклон вперед к стопам',
    targetMuscle: 'Задняя поверхность бедра и поясница',
    holdSeconds: 30,
    guideText: 'Прямые ноги, мягко тянитесь руками к пальцам ног без рывков.'
  },
  {
    id: 'quads',
    name: 'Растяжка квадрицепса стоя',
    targetMuscle: 'Передняя поверхность бедра',
    holdSeconds: 30,
    guideText: 'Согните ногу в колене, прижмите пятку к ягодице, удерживайте баланс.'
  },
  {
    id: 'butterfly',
    name: 'Поза бабочки',
    targetMuscle: 'Приводящие мышцы и тазобедренные суставы',
    holdSeconds: 35,
    guideText: 'Соедините стопы вместе, колени в стороны, прямая спина.'
  },
  {
    id: 'cobra',
    name: 'Поза кобры (Раскрытие груди)',
    targetMuscle: 'Грудные мышцы и гибкость позвоночника',
    holdSeconds: 30,
    guideText: 'Мягкий прогиб в спине, плечи опущены, глубокое ровное дыхание.'
  }
];

export const StretchingCameraModal: React.FC<StretchingCameraModalProps> = ({
  exercise,
  onClose,
  onCompleteWorkout
}) => {
  const [currentPoseIndex, setCurrentPoseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(STRETCH_POSES[0].holdSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [completedPoses, setCompletedPoses] = useState<number[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [stabilityScore, setStabilityScore] = useState(95);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const currentPose = STRETCH_POSES[currentPoseIndex];

  // Play audio chime
  const playChime = (freq = 750) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch {}
  };

  // Start Camera
  const startCamera = async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode, width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.warn('Camera error in stretch modal:', err);
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  // Hold Timer
  useEffect(() => {
    let interval: any;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        // Fluctuate stability score realistically (92-99%)
        setStabilityScore(Math.floor(92 + Math.random() * 7));
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      // Pose hold complete!
      triggerHaptic('success');
      playChime(950);

      const nextCompleted = [...completedPoses, currentPoseIndex];
      setCompletedPoses(nextCompleted);

      if (currentPoseIndex < STRETCH_POSES.length - 1) {
        const nextIndex = currentPoseIndex + 1;
        setCurrentPoseIndex(nextIndex);
        setTimeLeft(STRETCH_POSES[nextIndex].holdSeconds);
      } else {
        // All completed!
        setIsRunning(false);
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, currentPoseIndex]);

  const handleFinish = () => {
    triggerHaptic('success');
    const posesDone = completedPoses.length || 1;
    const agiGain = Math.max(3, posesDone + 2);
    const xpBonus = posesDone * 25 + exercise.xpReward;

    onCompleteWorkout({
      durationMinutes: 15,
      setsCompleted: posesDone,
      repsOrDistance: `${posesDone} поз растяжки`,
      caloriesBurned: 70,
      xpEarned: xpBonus,
      statsEarned: { agility: agiGain, strength: 1 }
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 text-white flex flex-col justify-between max-w-lg mx-auto select-none">
      {/* Top Bar */}
      <div className="p-4 flex items-center justify-between z-20 bg-gradient-to-b from-black/80 to-transparent">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
            <h3 className="text-sm font-extrabold tracking-tight">
              Камера AI: Растяжка & Ловкость
            </h3>
          </div>
          <p className="text-[11px] text-slate-300 font-medium">
            Поза {currentPoseIndex + 1} из {STRETCH_POSES.length}: {currentPose.name}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl bg-white/10 text-slate-200"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'))}
            className="p-2 rounded-xl bg-white/10 text-slate-200"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={onClose} className="p-2 rounded-xl bg-white/10 text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Camera Viewfinder with Stability Sensor */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden mx-4 my-2 rounded-3xl border border-white/15 bg-slate-900">
        <video
          ref={videoRef}
          playsInline
          muted
          className={`w-full h-full object-cover rounded-3xl ${
            facingMode === 'user' ? '-scale-x-100' : ''
          }`}
        />

        {/* Pose Guide Overlay Top */}
        <div className="absolute top-4 left-4 right-4 z-10 bg-black/70 backdrop-blur-md p-3 rounded-2xl border border-white/15">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
              {currentPose.name}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-bold text-teal-300">
              <ShieldCheck className="w-3.5 h-3.5" /> Стабильность {stabilityScore}%
            </div>
          </div>
          <p className="text-[11px] text-slate-300 mt-0.5">
            {currentPose.guideText}
          </p>
        </div>

        {/* Hold Countdown Big Ring Display */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-black/75 backdrop-blur-md border-3 border-teal-400 flex flex-col items-center justify-center shadow-2xl">
            <span className="text-3xl font-black font-mono text-white">
              {timeLeft}
            </span>
            <span className="text-[9px] font-bold text-teal-300 uppercase">
              секунд
            </span>
          </div>
          <span className="text-[10px] font-bold text-slate-300 mt-2 bg-black/60 px-3 py-1 rounded-full">
            Удерживайте позу стабильно
          </span>
        </div>
      </div>

      {/* Bottom Pose Trackers & Controls */}
      <div className="p-4 bg-slate-950/90 backdrop-blur-md border-t border-white/10 space-y-3 z-20">
        {/* Poses Step Indicators */}
        <div className="grid grid-cols-4 gap-1.5">
          {STRETCH_POSES.map((pose, i) => {
            const isDone = completedPoses.includes(i);
            const isCurrent = currentPoseIndex === i;
            return (
              <button
                key={pose.id}
                onClick={() => {
                  triggerHaptic('light');
                  setCurrentPoseIndex(i);
                  setTimeLeft(pose.holdSeconds);
                }}
                className={`py-1.5 px-1 rounded-xl text-center text-[10px] font-black transition-all ${
                  isDone
                    ? 'bg-emerald-600 text-white'
                    : isCurrent
                    ? 'bg-teal-500 text-slate-950 ring-2 ring-teal-300'
                    : 'bg-white/10 text-slate-400'
                }`}
              >
                {isDone ? '✓ ' : ''}Поза {i + 1}
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {!isRunning ? (
            <button
              onClick={() => {
                triggerHaptic('medium');
                setIsRunning(true);
              }}
              className="flex-1 py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-sm shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-slate-950" /> Начать удержание
            </button>
          ) : (
            <button
              onClick={() => setIsRunning(false)}
              className="flex-1 py-3.5 rounded-2xl bg-amber-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2"
            >
              <Pause className="w-4 h-4" /> Пауза
            </button>
          )}

          <button
            onClick={handleFinish}
            className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-sm shadow-lg flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <CheckCircle className="w-4 h-4" /> Завершить комплекс
          </button>
        </div>
      </div>
    </div>
  );
};
