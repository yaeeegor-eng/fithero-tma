import React, { useState, useRef } from 'react';
import {
  X,
  Image as ImageIcon,
  Send,
  Dumbbell,
  Sparkles,
  Camera,
  Check,
  UploadCloud,
  Trash2
} from 'lucide-react';
import { UserProfile, WorkoutLogEntry, SocialPost } from '../types';
import { triggerHaptic } from '../utils/haptics';
import { AthleteAvatar } from './AthleteAvatar';
import { createWorkoutVisualSvg } from '../utils/postImageUtils';

interface CreatePostModalProps {
  profile: UserProfile;
  recentLogs: WorkoutLogEntry[];
  prefilledWorkout?: WorkoutLogEntry | null;
  onClose: () => void;
  onPublishPost: (post: Omit<SocialPost, 'id' | 'timestamp' | 'likesCount' | 'fireCount' | 'muscleCount' | 'comments'>) => void;
}

const PRESET_PHOTOS = [
  { label: 'Зал & Сила', url: createWorkoutVisualSvg('strength', 'Тренажерный Зал & База', '+3 СИЛ') },
  { label: 'Беговой Трек', url: createWorkoutVisualSvg('cardio', 'Темповая Пробежка 5 км', '+3 ВЫН') },
  { label: 'Рассвет & Кардио', url: createWorkoutVisualSvg('endurance', 'Интервальное Кардио', '+2 ВЫН') },
  { label: 'Гибкость & Йога', url: createWorkoutVisualSvg('flexibility', 'Мобильность & Растяжка', '+2 ЛОВ') },
  { label: 'Книги & Инсайт', url: createWorkoutVisualSvg('mind', 'Чтение & Продуктивность', '+2 ИНТ') }
];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  profile,
  recentLogs,
  prefilledWorkout,
  onClose,
  onPublishPost
}) => {
  const [text, setText] = useState('');
  const [selectedLogId, setSelectedLogId] = useState<string>(prefilledWorkout ? prefilledWorkout.id : (recentLogs[0]?.id || 'none'));
  const [imageUrl, setImageUrl] = useState<string>(prefilledWorkout ? PRESET_PHOTOS[0].url : '');
  const [showPresets, setShowPresets] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const selectedWorkoutLog = recentLogs.find((l) => l.id === selectedLogId) || (prefilledWorkout?.id === selectedLogId ? prefilledWorkout : null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      triggerHaptic('light');
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      triggerHaptic('light');
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !imageUrl && !selectedWorkoutLog) {
      alert('Пожалуйста, напишите текст или прикрепите фото/тренировку.');
      return;
    }

    triggerHaptic('success');

    let workoutSummary = undefined;
    if (selectedWorkoutLog) {
      workoutSummary = {
        title: selectedWorkoutLog.exerciseTitle,
        category: selectedWorkoutLog.category,
        statGain: selectedWorkoutLog.statsEarned
          ? Object.entries(selectedWorkoutLog.statsEarned)
              .map(([k, v]) => `+${v} ${k.toUpperCase()}`)
              .join(', ')
          : undefined,
        statsEarned: selectedWorkoutLog.statsEarned,
        durationMinutes: selectedWorkoutLog.durationMinutes,
        calories: selectedWorkoutLog.caloriesBurned,
        xpEarned: selectedWorkoutLog.xpEarned,
        details: selectedWorkoutLog.repsOrDistance
      };
    }

    onPublishPost({
      userId: 'current_user',
      userName: profile.name,
      userUsername: profile.username,
      userAvatar: profile.avatarUrl,
      userLevel: profile.level,
      userOvr: 82,
      userClub: profile.clubName || 'Telegram Fit Club',
      text: text.trim() || (selectedWorkoutLog ? `Завершил отличную тренировку: ${selectedWorkoutLog.exerciseTitle}! 💪` : 'Новый тренировочный отчет!'),
      imageUrl: imageUrl || undefined,
      workoutSummary
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl p-5 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 my-auto max-h-[90vh] overflow-y-auto no-scrollbar relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-slate-600 active:scale-95 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <AthleteAvatar
            src={profile.avatarUrl}
            name={profile.name}
            id={profile.id}
            className="w-11 h-11 rounded-2xl object-cover shadow-2xs"
          />
          <div>
            <h3 className="text-base font-black text-slate-900 leading-tight">
              Новая публикация
            </h3>
            <p className="text-xs font-mono text-slate-500">
              Поделиться с атлетами сообщества
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Post Textarea */}
          <div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Расскажите о тренировке, инсайтах, темпе или настроении..."
              rows={3}
              className="w-full bg-stone-50 rounded-2xl p-3.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#D21624]/20 resize-none font-medium"
            />
          </div>

          {/* Workout Attachment Selector */}
          <div>
            <label className="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-1.5 flex items-center gap-1">
              <Dumbbell className="w-3 h-3 text-[#D21624]" /> Прикрепить тренировку
            </label>
            <select
              value={selectedLogId}
              onChange={(e) => setSelectedLogId(e.target.value)}
              className="w-full bg-stone-50 rounded-2xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#D21624]/20"
            >
              <option value="none">Без привязки к тренировке</option>
              {recentLogs.map((log) => (
                <option key={log.id} value={log.id}>
                  {log.exerciseTitle} • {log.repsOrDistance} (+{log.xpEarned} XP)
                </option>
              ))}
            </select>
          </div>

          {/* Attached Workout Preview Card */}
          {selectedWorkoutLog && (
            <div className="bg-stone-50 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-2xs">
              <div>
                <span className="text-[9px] font-mono font-bold text-[#D21624] uppercase block">
                  ПОДТВЕРЖДЕННАЯ СЕССИЯ
                </span>
                <h4 className="text-xs font-black text-slate-900 leading-tight">
                  {selectedWorkoutLog.exerciseTitle}
                </h4>
                <p className="text-[10px] font-mono text-slate-500">
                  {selectedWorkoutLog.repsOrDistance} • {selectedWorkoutLog.caloriesBurned} ккал
                </p>
              </div>
              <span className="bg-white text-slate-900 font-mono font-bold text-xs px-2.5 py-1 rounded-xl shrink-0 shadow-2xs">
                +{selectedWorkoutLog.xpEarned} XP
              </span>
            </div>
          )}

          {/* Photo Attachment Section */}
          <div>
            <label className="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <ImageIcon className="w-3 h-3 text-[#1664B0]" /> Фото к посту
              </span>
              <button
                type="button"
                onClick={() => setShowPresets(!showPresets)}
                className="text-[10px] text-[#1664B0] font-mono font-bold hover:underline"
              >
                {showPresets ? 'Скрыть шаблоны' : 'Выбрать шаблон'}
              </button>
            </label>

            {/* Quick Photo Presets */}
            {showPresets && (
              <div className="grid grid-cols-5 gap-1.5 mb-2.5">
                {PRESET_PHOTOS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      setImageUrl(p.url);
                    }}
                    className="relative aspect-square rounded-xl overflow-hidden shadow-2xs group focus:outline-none ring-2 ring-transparent focus:ring-[#D21624]"
                  >
                    <img
                      src={p.url}
                      alt={p.label}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-end p-0.5 text-[7px] text-white font-mono font-bold text-center leading-none">
                      {p.label.split(' ')[0]}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Photo preview or dropzone */}
            {imageUrl ? (
              <div className="relative rounded-2xl overflow-hidden h-36 bg-stone-900 shadow-2xs group">
                <img
                  src={imageUrl}
                  alt="Post preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('medium');
                    setImageUrl('');
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-xl bg-black/60 text-white hover:bg-black/80 transition-all shadow-xs"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="h-28 rounded-2xl bg-stone-50 hover:bg-stone-100 transition-colors flex flex-col items-center justify-center cursor-pointer p-4 text-center"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <UploadCloud className="w-6 h-6 text-slate-400 mb-1" />
                <span className="text-xs font-mono font-bold text-slate-700">
                  Загрузить фото или перетащить сюда
                </span>
                <span className="text-[10px] font-mono text-slate-400 mt-0.5">
                  JPG, PNG или фото тренировки
                </span>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-[#D21624] hover:bg-red-700 text-white rounded-2xl font-mono text-xs font-bold shadow-2xs active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Опубликовать (+20 XP сообщества)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
