import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CalendarIcon, Clock, Target, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Calendar from 'react-calendar';
import { SessionData } from '../components/History';
import { useOutletContext } from 'react-router-dom';
import 'react-calendar/dist/Calendar.css';

type TimerState = {
  sessionHistory: SessionData[];
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700">
      <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{label}</p>
      <p className="text-base font-semibold text-indigo-600 dark:text-indigo-400">
        {payload[0].value} 分钟
      </p>
    </div>
  );
};

const StatisticsPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const { sessionHistory: sessions } = useOutletContext<TimerState>();

  const stats = useMemo(() => {
    if (!sessions || sessions.length === 0) {
      return {
        totalFocusTime: 0,
        completionRate: 0,
        averageSessionsPerDay: 0,
        longestStreak: 0,
        dailyData: [],
        sessionsByDate: {}
      };
    }

    const focusSessions = sessions.filter(s => s.type === 'focus');
    
    const sessionsByDate = focusSessions.reduce((acc, session) => {
      const date = new Date(session.timestamp).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = {
          sessions: 0,
          totalMinutes: 0,
          completed: 0,
          tasks: new Set()
        };
      }
      acc[date].sessions++;
      acc[date].totalMinutes += session.duration;
      if (session.completed) acc[date].completed++;
      if (session.todoText) acc[date].tasks.add(session.todoText);
      return acc;
    }, {} as Record<string, any>);

    const totalFocusTime = focusSessions.reduce((acc, s) => acc + s.duration, 0);
    const completedSessions = focusSessions.filter(s => s.completed).length;
    const completionRate = focusSessions.length > 0
      ? Math.round((completedSessions / focusSessions.length) * 100)
      : 0;
    
    const uniqueDays = Object.keys(sessionsByDate).length;
    const averageSessionsPerDay = uniqueDays > 0
      ? Math.round((focusSessions.length / uniqueDays) * 10) / 10
      : 0;
    
    const longestStreak = focusSessions.reduce((max, session) => {
      return Math.max(max, session.duration);
    }, 0);

    const dailyData = Object.entries(sessionsByDate).map(([date, data]) => ({
      date: new Date(date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
      totalMinutes: data.totalMinutes,
      sessions: data.sessions,
      completed: data.completed,
      tasks: Array.from(data.tasks).length
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return {
      totalFocusTime,
      completionRate,
      averageSessionsPerDay,
      longestStreak,
      dailyData,
      sessionsByDate
    };
  }, [sessions]);

  const getDateStats = (date: Date) => {
    const dateStr = date.toLocaleDateString();
    return stats.sessionsByDate[dateStr] || {
      sessions: 0,
      totalMinutes: 0,
      completed: 0,
      tasks: new Set()
    };
  };

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return '';
    const dateStats = getDateStats(date);
    if (dateStats.sessions === 0) return '';
    return 'bg-gradient-to-br from-indigo-100/80 to-violet-100/80 dark:from-indigo-900/30 dark:to-violet-900/30 hover:from-indigo-200/80 hover:to-violet-200/80 dark:hover:from-indigo-800/40 dark:hover:to-violet-800/40';
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null;
    const dateStats = getDateStats(date);
    if (dateStats.sessions === 0) return null;
    
    return (
      <div className="absolute bottom-0.5 left-0 right-0 text-[10px] text-center font-medium text-indigo-600/90 dark:text-indigo-400/90">
        {dateStats.totalMinutes}′
      </div>
    );
  };

  const formatShortWeekday = (locale: string, date: Date) => {
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    return weekdays[date.getDay()];
  };

  const formatDay = (locale: string, date: Date) => {
    return date.getDate().toString();
  };

  const selectedDateStats = selectedDate ? getDateStats(selectedDate) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30 dark:from-gray-900 dark:via-indigo-900/10 dark:to-purple-900/10 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft size={24} />
            <span className="font-medium">返回</span>
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            专注统计
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-white to-indigo-50/50 dark:from-gray-800 dark:to-indigo-900/20 rounded-xl p-6 shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
              <h3 className="text-gray-600 dark:text-gray-300 font-medium">总专注时间</h3>
            </div>
            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              {stats.totalFocusTime} 分钟
            </p>
          </div>

          <div className="bg-gradient-to-br from-white to-emerald-50/50 dark:from-gray-800 dark:to-emerald-900/20 rounded-xl p-6 shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <Target className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
              <h3 className="text-gray-600 dark:text-gray-300 font-medium">完成率</h3>
            </div>
            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {stats.completionRate}%
            </p>
          </div>

          <div className="bg-gradient-to-br from-white to-violet-50/50 dark:from-gray-800 dark:to-violet-900/20 rounded-xl p-6 shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <CalendarIcon className="w-6 h-6 text-violet-500 dark:text-violet-400" />
              <h3 className="text-gray-600 dark:text-gray-300 font-medium">平均每日专注</h3>
            </div>
            <p className="text-3xl font-bold text-violet-600 dark:text-violet-400">
              {stats.averageSessionsPerDay} 次
            </p>
          </div>

          <div className="bg-gradient-to-br from-white to-rose-50/50 dark:from-gray-800 dark:to-rose-900/20 rounded-xl p-6 shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-6 h-6 text-rose-500 dark:text-rose-400" />
              <h3 className="text-gray-600 dark:text-gray-300 font-medium">最长专注</h3>
            </div>
            <p className="text-3xl font-bold text-rose-600 dark:text-rose-400">
              {stats.longestStreak} 分钟
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-6 shadow-lg backdrop-blur-sm">
            <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent mb-6">
              每日专注统计
            </h2>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.dailyData}>
                  <XAxis 
                    dataKey="date" 
                    stroke="#6B7280"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#6B7280"
                    fontSize={12}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
                  />
                  <Bar 
                    dataKey="totalMinutes" 
                    name="专注时长（分钟）"
                    fill="url(#colorGradient)"
                    radius={[4, 4, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366F1" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-6 shadow-lg backdrop-blur-sm">
            <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent mb-6">
              日历视图
            </h2>
            <div className="calendar-container">
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileClassName={tileClassName}
                tileContent={tileContent}
                prevLabel={<ChevronLeft className="w-4 h-4" />}
                nextLabel={<ChevronRight className="w-4 h-4" />}
                formatShortWeekday={formatShortWeekday}
                formatDay={formatDay}
                className="!bg-transparent !border-none"
              />
            </div>
            
            {selectedDate && selectedDateStats && (
              <div className="mt-6 p-4 bg-gradient-to-br from-gray-50/80 to-indigo-50/80 dark:from-gray-700/50 dark:to-indigo-900/30 rounded-lg backdrop-blur-sm">
                <h3 className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent mb-3">
                  {selectedDate.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })} 统计
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600 dark:text-gray-300">
                    总专注时间：<span className="font-medium text-indigo-600 dark:text-indigo-400">{selectedDateStats.totalMinutes} 分钟</span>
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    完成番茄钟：<span className="font-medium text-emerald-600 dark:text-emerald-400">{selectedDateStats.completed} 个</span>
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    完成任务数：<span className="font-medium text-violet-600 dark:text-violet-400">{selectedDateStats.tasks.size} 个</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;