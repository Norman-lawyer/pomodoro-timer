import React from 'react';
import { formatTime } from '../utils/timerUtils';

interface TimerProps {
  minutes: number;
  seconds: number;
  timerType: 'focus' | 'shortBreak' | 'longBreak';
  progress: number;
  currentTodo?: string;
}

const Timer: React.FC<TimerProps> = ({ 
  minutes, 
  seconds, 
  timerType, 
  progress,
  currentTodo 
}) => {
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference * (1 - progress);

  const getProgressColor = () => {
    switch (timerType) {
      case 'focus': return 'stroke-indigo-500 dark:stroke-indigo-400';
      case 'shortBreak': return 'stroke-emerald-500 dark:stroke-emerald-400';
      case 'longBreak': return 'stroke-violet-500 dark:stroke-violet-400';
      default: return 'stroke-indigo-500 dark:stroke-indigo-400';
    }
  };

  const getTextColor = () => {
    switch (timerType) {
      case 'focus': return 'text-indigo-600 dark:text-indigo-300';
      case 'shortBreak': return 'text-emerald-600 dark:text-emerald-300';
      case 'longBreak': return 'text-violet-600 dark:text-violet-300';
      default: return 'text-indigo-600 dark:text-indigo-300';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm shadow-lg transition-all duration-500">
      {currentTodo && timerType === 'focus' && (
        <div className="mb-4 text-center">
          <p className="text-lg font-medium text-gray-600 dark:text-gray-400">Current Task:</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">{currentTodo}</p>
        </div>
      )}
      
      <div className="relative w-64 h-64 flex items-center justify-center">
        <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 256 256">
          <circle
            cx="128"
            cy="128"
            r="120"
            fill="none"
            strokeWidth="8"
            className="stroke-gray-200 dark:stroke-gray-700"
          />
        </svg>
        
        <svg className="absolute w-full h-full -rotate-90 transition-all duration-300" viewBox="0 0 256 256">
          <circle
            cx="128"
            cy="128"
            r="120"
            fill="none"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`${getProgressColor()} transition-all duration-300`}
          />
        </svg>
        
        <div className="text-center z-10">
          <h2 className={`text-5xl font-bold ${getTextColor()} transition-colors duration-300`}>
            {formatTime(minutes, seconds)}
          </h2>
          <p className={`text-lg mt-2 capitalize ${getTextColor()} opacity-80 transition-colors duration-300`}>
            {timerType === 'focus' ? 'Focus Time' : 
             timerType === 'shortBreak' ? 'Short Break' : 'Long Break'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Timer;