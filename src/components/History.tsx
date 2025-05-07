import React from 'react';
import { History as HistoryIcon, X, CheckCircle, SkipForward, Clock } from 'lucide-react';
import { formatDate } from '../utils/timerUtils';

export interface SessionData {
  id: string;
  type: 'focus' | 'shortBreak' | 'longBreak';
  duration: number;
  timestamp: Date;
  todoText?: string;
  completed: boolean;
  skipped?: boolean;
  earlyCompletion?: boolean;
}

interface HistoryProps {
  sessions: SessionData[];
  isVisible: boolean;
  onToggle: () => void;
}

const History: React.FC<HistoryProps> = ({ sessions, isVisible, onToggle }) => {
  if (sessions.length === 0) return null;

  const getTypeStyles = (type: 'focus' | 'shortBreak' | 'longBreak') => {
    switch (type) {
      case 'focus':
        return {
          row: 'text-indigo-800 dark:text-indigo-300',
          badge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300',
          icon: 'text-indigo-500 dark:text-indigo-400'
        };
      case 'shortBreak':
        return {
          row: 'text-emerald-800 dark:text-emerald-300',
          badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
          icon: 'text-emerald-500 dark:text-emerald-400'
        };
      case 'longBreak':
        return {
          row: 'text-violet-800 dark:text-violet-300',
          badge: 'bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-300',
          icon: 'text-violet-500 dark:text-violet-400'
        };
    }
  };

  const getStatusIcon = (session: SessionData) => {
    const styles = getTypeStyles(session.type);
    if (session.skipped) {
      return <SkipForward size={16} className={styles.icon} />;
    }
    if (session.earlyCompletion) {
      return <CheckCircle size={16} className={styles.icon} />;
    }
    if (session.completed) {
      return <Clock size={16} className={styles.icon} />;
    }
    return null;
  };

  return (
    <div className="mt-8">
      <button 
        onClick={onToggle}
        className="flex items-center justify-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors rounded-lg"
      >
        <HistoryIcon size={20} />
        <span className="font-medium">
          {isVisible ? '隐藏历史记录' : '显示历史记录'}
        </span>
      </button>

      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">历史记录</h3>
              <button
                onClick={onToggle}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg transition-colors"
                aria-label="关闭历史记录"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              <table className="w-full border-collapse">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">类型</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">任务</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">时长</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">时间</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">状态</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {sessions.slice().reverse().map((session) => {
                    const styles = getTypeStyles(session.type);
                    return (
                      <tr key={session.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${styles.row}`}>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${styles.badge}`}>
                            {session.type === 'focus' 
                              ? '专注' 
                              : session.type === 'shortBreak' 
                                ? '短休息' 
                                : '长休息'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {session.todoText || '-'}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {session.duration} 分钟
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {formatDate(new Date(session.timestamp))}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            {getStatusIcon(session)}
                            <span className="text-sm">
                              {session.skipped ? '已跳过' : 
                               session.earlyCompletion ? '提前完成' : 
                               session.completed ? '已完成' : '未完成'}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;