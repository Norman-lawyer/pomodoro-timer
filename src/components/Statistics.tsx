import React, { useMemo } from 'react';
import { BarChart3, Clock, Target, Calendar, TrendingUp } from 'lucide-react';
import { SessionData } from './History';

interface StatisticsProps {
  sessions: SessionData[];
  isVisible: boolean;
  onToggle: () => void;
}

const Statistics: React.FC<StatisticsProps> = ({ sessions, isVisible, onToggle }) => {
  const stats = useMemo(() => {
    const focusSessions = sessions.filter(s => s.type === 'focus');
    
    // 总专注时长（分钟）
    const totalFocusTime = focusSessions.reduce((acc, s) => acc + s.duration, 0);
    
    // 完成率
    const completedSessions = focusSessions.filter(s => s.completed).length;
    const completionRate = focusSessions.length > 0
      ? Math.round((completedSessions / focusSessions.length) * 100)
      : 0;
    
    // 平均每日专注次数
    const sessionsByDate = focusSessions.reduce((acc, session) => {
      const date = new Date(session.timestamp).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const uniqueDays = Object.keys(sessionsByDate).length;
    const averageSessionsPerDay = uniqueDays > 0
      ? Math.round((focusSessions.length / uniqueDays) * 10) / 10
      : 0;
    
    // 最长连续专注时间
    const longestStreak = focusSessions.reduce((max, session) => {
      return Math.max(max, session.duration);
    }, 0);

    return {
      totalFocusTime,
      completionRate,
      averageSessionsPerDay,
      longestStreak,
      totalSessions: focusSessions.length
    };
  }, [sessions]);

  if (sessions.length === 0) return null;

  return (
    <div className="mt-8">
      <button 
        onClick={onToggle}
        className="flex items-center justify-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors rounded-lg"
      >
        <BarChart3 size={20} />
        <span className="font-medium">
          {isVisible ? '隐藏统计' : '显示统计'}
        </span>
      </button>

      {isVisible && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="text-indigo-500 dark:text-indigo-400" />
              <h3 className="text-gray-600 dark:text-gray-300 font-medium">总专注时间</h3>
            </div>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">
              {stats.totalFocusTime} 分钟
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Target className="text-emerald-500 dark:text-emerald-400" />
              <h3 className="text-gray-600 dark:text-gray-300 font-medium">完成率</h3>
            </div>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">
              {stats.completionRate}%
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="text-violet-500 dark:text-violet-400" />
              <h3 className="text-gray-600 dark:text-gray-300 font-medium">平均每日专注</h3>
            </div>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">
              {stats.averageSessionsPerDay} 次
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="text-rose-500 dark:text-rose-400" />
              <h3 className="text-gray-600 dark:text-gray-300 font-medium">最长专注</h3>
            </div>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">
              {stats.longestStreak} 分钟
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;