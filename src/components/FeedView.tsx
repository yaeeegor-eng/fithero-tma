import React, { useState } from 'react';
import {
  Flame,
  Dumbbell,
  Zap,
  MessageSquare,
  Plus,
  Share2,
  Sparkles,
  Send,
  User,
  Heart,
  Activity,
  Image as ImageIcon,
  Check,
  X
} from 'lucide-react';
import { SocialPost, UserProfile, PublicUserProfile, WorkoutLogEntry } from '../types';
import { triggerHaptic } from '../utils/haptics';
import { AthleteAvatar } from './AthleteAvatar';

interface FeedViewProps {
  posts: SocialPost[];
  currentProfile: UserProfile;
  recentLogs: WorkoutLogEntry[];
  onOpenCreatePost: () => void;
  onOpenUserProfile: (user: PublicUserProfile) => void;
  onToggleReaction: (postId: string, reaction: 'like' | 'fire' | 'muscle') => void;
  onAddComment: (postId: string, text: string) => void;
}

export const FeedView: React.FC<FeedViewProps> = ({
  posts,
  currentProfile,
  recentLogs,
  onOpenCreatePost,
  onOpenUserProfile,
  onToggleReaction,
  onAddComment
}) => {
  const [filter, setFilter] = useState<'all' | 'my' | 'top'>('all');
  const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState<string>('');
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const filteredPosts = posts.filter((post) => {
    if (filter === 'my') return post.userId === 'current_user';
    if (filter === 'top') return post.fireCount + post.likesCount > 25;
    return true;
  });

  const handleSendComment = (postId: string) => {
    if (!commentInput.trim()) return;
    triggerHaptic('success');
    onAddComment(postId, commentInput.trim());
    setCommentInput('');
  };

  const formatTimeAgo = (timestamp: number) => {
    const diffMin = Math.max(1, Math.round((Date.now() - timestamp) / 60000));
    if (diffMin < 60) return `${diffMin} мин назад`;
    const diffHours = Math.round(diffMin / 60);
    if (diffHours < 24) return `${diffHours} ч назад`;
    const diffDays = Math.round(diffHours / 24);
    return `${diffDays} дн назад`;
  };

  return (
    <div className="space-y-3.5 pb-24 max-w-lg mx-auto">
      {/* Feed Bento Banner */}
      <div className="bg-[#D21624] text-white rounded-3xl p-5 shadow-2xs relative overflow-hidden">
        <div className="flex items-start justify-between relative z-10">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-red-100 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-white" /> СООБЩЕСТВО АТЛЕТОВ
            </span>
            <h2 className="text-xl font-black tracking-tight mt-1 text-white">
              Лента Тренировок
            </h2>
            <p className="text-xs text-red-100 mt-0.5 font-medium">
              Делитесь результатами, мотивируйте друзей и повышайте общий рейтинг
            </p>
          </div>

          <button
            onClick={() => {
              triggerHaptic('medium');
              onOpenCreatePost();
            }}
            className="bg-white text-[#D21624] px-3.5 py-2 rounded-2xl font-mono text-xs font-bold flex items-center gap-1.5 shadow-2xs active:scale-95 transition-all shrink-0 hover:bg-stone-50"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Пост
          </button>
        </div>

        {/* Quick Share Strip */}
        <div className="mt-4 pt-3 border-t border-red-500/40 flex items-center justify-between text-[11px] font-mono">
          <span className="text-red-100 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-white" /> Ваш стрик: {currentProfile.streakDays} дней
          </span>
          <span className="text-white font-bold">
            {posts.length} публикаций сегодня
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => {
            triggerHaptic('light');
            setFilter('all');
          }}
          className={`px-4 py-2 rounded-2xl text-xs font-mono font-bold transition-all ${
            filter === 'all'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-stone-50'
          }`}
        >
          Все атлеты
        </button>
        <button
          onClick={() => {
            triggerHaptic('light');
            setFilter('my');
          }}
          className={`px-4 py-2 rounded-2xl text-xs font-mono font-bold transition-all ${
            filter === 'my'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-stone-50'
          }`}
        >
          Мои посты
        </button>
        <button
          onClick={() => {
            triggerHaptic('light');
            setFilter('top');
          }}
          className={`px-4 py-2 rounded-2xl text-xs font-mono font-bold transition-all ${
            filter === 'top'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-stone-50'
          }`}
        >
          🔥 Топ недели
        </button>
      </div>

      {/* Post List */}
      <div className="space-y-3.5">
        {filteredPosts.map((post) => {
          const isCommentsOpen = activeCommentsPostId === post.id;

          const handleAuthorClick = () => {
            triggerHaptic('light');
            onOpenUserProfile({
              id: post.userId,
              name: post.userName,
              username: post.userUsername,
              avatarUrl: post.userAvatar,
              level: post.userLevel,
              ovr: post.userOvr,
              clubName: post.userClub || 'FitHero Club',
              countryCode: '🇷🇺',
              streakDays: post.userId === 'current_user' ? currentProfile.streakDays : 18,
              longestStreak: 25,
              totalWorkouts: post.userId === 'current_user' ? currentProfile.totalWorkouts : 65,
              bio: 'Активный атлет сообщества FitHero. Каждый день делаю шаг вперед.',
              stats: currentProfile.stats,
              fifaCardTheme: 'gold',
              positionTitle: 'ALL (Универсал)',
              unlockedTrophiesCount: 6,
              followersCount: 140,
              isFollowing: false
            });
          };

          return (
            <div
              key={post.id}
              className="bg-white rounded-3xl p-4.5 shadow-2xs transition-all relative overflow-hidden"
            >
              {/* Author Header */}
              <div className="flex items-center justify-between gap-3 mb-3">
                <div
                  onClick={handleAuthorClick}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div className="relative">
                    <AthleteAvatar
                      src={post.userAvatar}
                      name={post.userName}
                      id={post.userId}
                      className="w-11 h-11 rounded-2xl object-cover shadow-2xs ring-2 ring-stone-100 group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-slate-900 text-white font-mono font-black text-[9px] px-1 rounded-md">
                      {post.userOvr}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-black text-slate-900 group-hover:text-[#D21624] transition-colors leading-tight">
                        {post.userName}
                      </h4>
                      <span className="text-[9px] font-mono font-bold text-slate-400">
                        • {formatTimeAgo(post.timestamp)}
                      </span>
                    </div>
                    <p className="text-[10px] font-mono font-bold text-slate-500">
                      {post.userUsername} {post.userClub ? `• ${post.userClub}` : ''}
                    </p>
                  </div>
                </div>

                <span className="bg-stone-100 text-slate-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg shrink-0">
                  УР. {post.userLevel}
                </span>
              </div>

              {/* Workout Summary Bento Box if attached */}
              {post.workoutSummary && (
                <div className="bg-stone-50 rounded-2xl p-3 mb-3 flex items-center justify-between gap-3 shadow-2xs">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded-md bg-[#D21624]/10 text-[#D21624]">
                        {post.workoutSummary.category}
                      </span>
                      {post.workoutSummary.statGain && (
                        <span className="text-[9px] font-mono font-bold text-slate-600">
                          {post.workoutSummary.statGain}
                        </span>
                      )}
                    </div>
                    <h5 className="text-xs font-black text-slate-900 mt-1 leading-tight">
                      {post.workoutSummary.title}
                    </h5>
                    <p className="text-[10px] font-mono text-slate-500">
                      {post.workoutSummary.details}
                      {post.workoutSummary.calories ? ` • ${post.workoutSummary.calories} ккал` : ''}
                    </p>
                  </div>

                  <span className="bg-white text-slate-900 font-mono font-bold text-xs px-2.5 py-1 rounded-xl shrink-0 shadow-2xs">
                    +{post.workoutSummary.xpEarned} ОПТ
                  </span>
                </div>
              )}

              {/* Text Caption */}
              {post.text && (
                <p className="text-xs text-slate-800 font-medium leading-relaxed mb-3">
                  {post.text}
                </p>
              )}

              {/* Attached Photo */}
              {post.imageUrl && (
                <div
                  onClick={() => setZoomedImage(post.imageUrl || null)}
                  className="relative rounded-2xl overflow-hidden mb-3.5 bg-stone-900 shadow-2xs max-h-72 cursor-pointer group"
                >
                  <img
                    src={post.imageUrl}
                    alt="Workout post"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute bottom-2 right-2 bg-black/50 text-white font-mono text-[9px] px-2 py-0.5 rounded-lg backdrop-blur-xs">
                    Нажмите для зума
                  </div>
                </div>
              )}

              {/* Interaction Bar */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                <div className="flex items-center gap-1.5">
                  {/* Fire Reaction */}
                  <button
                    onClick={() => {
                      triggerHaptic('light');
                      onToggleReaction(post.id, 'fire');
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
                      post.isFired
                        ? 'bg-[#D21624] text-white shadow-2xs'
                        : 'bg-stone-50 text-slate-700 hover:bg-stone-100'
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>{post.fireCount}</span>
                  </button>

                  {/* Muscle Reaction */}
                  <button
                    onClick={() => {
                      triggerHaptic('light');
                      onToggleReaction(post.id, 'muscle');
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
                      post.isMuscled
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'bg-stone-50 text-slate-700 hover:bg-stone-100'
                    }`}
                  >
                    <Dumbbell className="w-3.5 h-3.5" />
                    <span>{post.muscleCount}</span>
                  </button>

                  {/* Respect Reaction */}
                  <button
                    onClick={() => {
                      triggerHaptic('light');
                      onToggleReaction(post.id, 'like');
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
                      post.isLiked
                        ? 'bg-[#1664B0] text-white shadow-2xs'
                        : 'bg-stone-50 text-slate-700 hover:bg-stone-100'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>{post.likesCount}</span>
                  </button>
                </div>

                {/* Comment Toggle */}
                <button
                  onClick={() => {
                    triggerHaptic('light');
                    setActiveCommentsPostId(isCommentsOpen ? null : post.id);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-50 hover:bg-stone-100 text-slate-600 font-mono text-xs font-bold transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{post.comments.length}</span>
                </button>
              </div>

              {/* Comments Section */}
              {isCommentsOpen && (
                <div className="mt-3.5 pt-3 border-t border-stone-100 space-y-2.5 animate-in fade-in">
                  {post.comments.length > 0 && (
                    <div className="space-y-2">
                      {post.comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="bg-stone-50 rounded-2xl p-2.5 flex items-start gap-2.5"
                        >
                          <AthleteAvatar
                            src={comment.userAvatar}
                            name={comment.userName}
                            id={comment.userId}
                            className="w-7 h-7 rounded-xl object-cover shrink-0 mt-0.5"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-black text-slate-900 leading-tight">
                                {comment.userName}
                              </span>
                              <span className="text-[8px] font-mono text-slate-400">
                                {formatTimeAgo(comment.timestamp)}
                              </span>
                            </div>
                            <p className="text-xs text-slate-700 font-medium mt-0.5 leading-snug">
                              {comment.text}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Comment Input */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSendComment(post.id);
                      }}
                      placeholder="Написать комментарий..."
                      className="flex-1 bg-stone-50 rounded-2xl px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#D21624]/20 font-medium"
                    />
                    <button
                      onClick={() => handleSendComment(post.id)}
                      className="p-2.5 rounded-2xl bg-[#D21624] text-white hover:bg-red-700 active:scale-95 transition-all shadow-2xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Image Zoom Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setZoomedImage(null)}
        >
          <button
            onClick={() => setZoomedImage(null)}
            className="absolute top-4 right-4 p-2 rounded-2xl bg-white/20 text-white hover:bg-white/30 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={zoomedImage}
            alt="Zoomed preview"
            referrerPolicy="no-referrer"
            className="max-w-full max-h-[85vh] rounded-3xl object-contain shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
