import React from 'react';
import { Play, Pause, RotateCcw, Settings, Volume2, VolumeX, SkipForward, CheckCircle } from 'lucide-react';

interface ControlsProps {
  isRunning: boolean;
  isMuted: boolean;
  timerType: 'focus' | 'shortBreak' | 'longBreak';
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onOpenSettings: () => void;
  onToggleMute: () => void;
  onSkip: () => void;
  onComplete: () => void;
}

const Controls: React.FC<ControlsProps> = ({ 
  isRunning, 
  isMuted,
  timerType,
  onStart, 
  onPause, 
  onReset, 
  onOpenSettings,
  onToggleMute,
  onSkip,
  onComplete
}) => {
  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      <button
        onClick={isRunning ? onPause : onStart}
        className="flex items-center justify-center w-12 h-12 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50"
        title={isRunning ? '暂停 (空格键)' : '开始 (空格键)'}
        aria-label={isRunning ? '暂停' : '开始'}
      >
        {isRunning ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
      </button>
      
      <button
        onClick={onReset}
        className="flex items-center justify-center w-12 h-12 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-50"
        title="重置计时器 (ESC)"
        aria-label="重置计时器"
      >
        <RotateCcw size={20} />
      </button>
      
      <button
        onClick={onToggleMute}
        className={`flex items-center justify-center w-12 h-12 rounded-full shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
          isMuted 
            ? 'bg-rose-500 hover:bg-rose-600 focus:ring-rose-400 text-white'
            : 'bg-emerald-500 hover:bg-emerald-600 focus:ring-emerald-400 text-white'
        }`}
        title={isMuted ? '取消静音 (M)' : '开启静音 (M)'}
        aria-label={isMuted ? '取消静音' : '开启静音'}
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>

      {timerType !== 'focus' && (
        <button
          onClick={onSkip}
          className="flex items-center justify-center w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
          title="跳过休息时间"
          aria-label="跳过休息时间"
        >
          <SkipForward size={20} />
        </button>
      )}

      {timerType === 'focus' && isRunning && (
        <button
          onClick={onComplete}
          className="flex items-center justify-center w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
          title="提前完成专注"
          aria-label="提前完成专注"
        >
          <CheckCircle size={20} />
        </button>
      )}
      
      <button
        onClick={onOpenSettings}
        className="flex items-center justify-center w-12 h-12 bg-violet-500 hover:bg-violet-600 text-white rounded-full shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-opacity-50"
        title="打开设置 (S)"
        aria-label="打开设置"
      >
        <Settings size={20} />
      </button>
    </div>
  );
};

export default Controls;