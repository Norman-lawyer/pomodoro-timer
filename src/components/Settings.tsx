import React from 'react';
import { X } from 'lucide-react';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  pomodorosUntilLongBreak: number;
  onFocusChange: (value: number) => void;
  onShortBreakChange: (value: number) => void;
  onLongBreakChange: (value: number) => void;
  onPomodorosUntilLongBreakChange: (value: number) => void;
}

const Settings: React.FC<SettingsProps> = ({
  isOpen,
  onClose,
  focusDuration,
  shortBreakDuration,
  longBreakDuration,
  pomodorosUntilLongBreak,
  onFocusChange,
  onShortBreakChange,
  onLongBreakChange,
  onPomodorosUntilLongBreakChange
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">设置</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            aria-label="关闭设置"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="focusDuration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              专注时长（分钟）
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                id="focusDuration"
                min="5"
                max="60"
                step="5"
                value={focusDuration}
                onChange={(e) => onFocusChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <span className="text-gray-700 dark:text-gray-300 font-medium w-8 text-center">{focusDuration}</span>
            </div>
          </div>

          <div>
            <label htmlFor="shortBreakDuration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              短休息时长（分钟）
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                id="shortBreakDuration"
                min="1"
                max="15"
                step="1"
                value={shortBreakDuration}
                onChange={(e) => onShortBreakChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <span className="text-gray-700 dark:text-gray-300 font-medium w-8 text-center">{shortBreakDuration}</span>
            </div>
          </div>

          <div>
            <label htmlFor="longBreakDuration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              长休息时长（分钟）
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                id="longBreakDuration"
                min="5"
                max="30"
                step="5"
                value={longBreakDuration}
                onChange={(e) => onLongBreakChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
              />
              <span className="text-gray-700 dark:text-gray-300 font-medium w-8 text-center">{longBreakDuration}</span>
            </div>
          </div>

          <div>
            <label htmlFor="pomodorosUntilLongBreak" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              长休息前的专注次数
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                id="pomodorosUntilLongBreak"
                min="2"
                max="6"
                step="1"
                value={pomodorosUntilLongBreak}
                onChange={(e) => onPomodorosUntilLongBreakChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <span className="text-gray-700 dark:text-gray-300 font-medium w-8 text-center">{pomodorosUntilLongBreak}</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition-colors duration-200"
        >
          保存设置
        </button>
      </div>
    </div>
  );
};

export default Settings;