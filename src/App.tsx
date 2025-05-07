import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HashRouter, Routes, Route, Link, Outlet } from 'react-router-dom';
import Timer from './components/Timer';
import Controls from './components/Controls';
import Settings from './components/Settings';
import SessionCounter from './components/SessionCounter';
import Header from './components/Header';
import History, { SessionData } from './components/History';
import TodoList, { Todo } from './components/TodoList';
import ThemeToggle from './components/ThemeToggle';
import StatisticsPage from './pages/StatisticsPage';
import { BarChart3 } from 'lucide-react';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { loadState, saveState } from './utils/storage';
import { 
  playNotificationSound, 
  requestNotificationPermission, 
  showNotification, 
  generateId,
  playTickSound,
  stopTickSound,
  calculateElapsedTime
} from './utils/timerUtils';

console.log('App loaded');

function MainLayout() {
  // Load initial state
  const initialState = loadState();
  
  // Timer settings
  const [focusDuration, setFocusDuration] = useState<number>(initialState.settings.focusDuration);
  const [shortBreakDuration, setShortBreakDuration] = useState<number>(initialState.settings.shortBreakDuration);
  const [longBreakDuration, setLongBreakDuration] = useState<number>(initialState.settings.longBreakDuration);
  const [pomodorosUntilLongBreak, setPomodorosUntilLongBreak] = useState<number>(initialState.settings.pomodorosUntilLongBreak);

  // Timer state
  const [timerType, setTimerType] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [minutes, setMinutes] = useState<number>(focusDuration);
  const [seconds, setSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(initialState.settings.isMuted);
  const [theme, setTheme] = useState<'light' | 'dark'>(initialState.settings.theme);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(0);
  const [historyVisible, setHistoryVisible] = useState<boolean>(false);
  const [sessionHistory, setSessionHistory] = useState<SessionData[]>(initialState.sessionHistory);
  
  // Todo state
  const [todos, setTodos] = useState<Todo[]>(initialState.todos);
  const [selectedTodoId, setSelectedTodoId] = useState<string | null>(null);

  // References
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number | null>(null);
  const totalTimeRef = useRef<number>(focusDuration * 60);

  // Theme effect
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Save state effect
  useEffect(() => {
    saveState({
      todos,
      sessionHistory,
      settings: {
        focusDuration,
        shortBreakDuration,
        longBreakDuration,
        pomodorosUntilLongBreak,
        isMuted,
        theme,
        accentColor: 'indigo'
      }
    });
  }, [
    todos,
    sessionHistory,
    focusDuration,
    shortBreakDuration,
    longBreakDuration,
    pomodorosUntilLongBreak,
    isMuted,
    theme
  ]);

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    const handleSound = async () => {
      if (isRunning && timerType === 'focus' && !isMuted) {
        await playTickSound();
      } else {
        stopTickSound();
      }
    };
    
    handleSound();
    
    return () => {
      stopTickSound();
    };
  }, [isRunning, timerType, isMuted]);

  useEffect(() => {
    let duration;
    switch (timerType) {
      case 'focus':
        duration = focusDuration;
        break;
      case 'shortBreak':
        duration = shortBreakDuration;
        break;
      case 'longBreak':
        duration = longBreakDuration;
        break;
    }
    setMinutes(duration);
    setSeconds(0);
    totalTimeRef.current = duration * 60;
  }, [focusDuration, shortBreakDuration, longBreakDuration, timerType]);

  const calculateProgress = useCallback(() => {
    const totalSeconds = minutes * 60 + seconds;
    const totalInitialSeconds = totalTimeRef.current;
    return 1 - (totalSeconds / totalInitialSeconds);
  }, [minutes, seconds]);

  const handleTimerComplete = useCallback(() => {
    if (!isMuted) {
      playNotificationSound();
    }
    stopTickSound();
    
    const completedSessionData: SessionData = {
      id: generateId(),
      type: timerType,
      duration: timerType === 'focus' ? focusDuration : timerType === 'shortBreak' ? shortBreakDuration : longBreakDuration,
      timestamp: new Date(),
      completed: true,
      todoText: selectedTodoId ? todos.find(t => t.id === selectedTodoId)?.text : undefined
    };
    
    setSessionHistory(prev => [...prev, completedSessionData]);
    
    if (timerType === 'focus' && selectedTodoId) {
      setTodos(prevTodos => prevTodos.map(todo => 
        todo.id === selectedTodoId 
          ? { ...todo, pomodoros: todo.pomodoros + 1 }
          : todo
      ));
    }
    
    const notificationTitle = `${timerType === 'focus' ? '专注' : timerType === 'shortBreak' ? '短休息' : '长休息'}完成！`;
    const notificationMessage = timerType === 'focus' 
      ? '该休息一下了！' 
      : '该开始专注了！';
    
    showNotification(notificationTitle, {
      body: notificationMessage,
      icon: '/vite.svg'
    });
    
    if (timerType === 'focus') {
      const newCompletedSessions = completedSessions + 1;
      setCompletedSessions(newCompletedSessions);
      
      if (newCompletedSessions % pomodorosUntilLongBreak === 0) {
        setTimerType('longBreak');
      } else {
        setTimerType('shortBreak');
      }
    } else {
      setTimerType('focus');
    }
  }, [
    timerType,
    completedSessions,
    pomodorosUntilLongBreak,
    focusDuration,
    shortBreakDuration,
    longBreakDuration,
    selectedTodoId,
    isMuted,
    todos
  ]);

  const startTimer = useCallback(() => {
    if (isRunning) return;
    
    setIsRunning(true);
    
    if (pausedTimeRef.current === null) {
      startTimeRef.current = Date.now();
    } else {
      const pauseDuration = Date.now() - pausedTimeRef.current;
      if (startTimeRef.current !== null) {
        startTimeRef.current += pauseDuration;
      }
      pausedTimeRef.current = null;
    }
    
    timerRef.current = window.setInterval(() => {
      setSeconds(prevSeconds => {
        if (prevSeconds === 0) {
          setMinutes(prevMinutes => {
            if (prevMinutes === 0) {
              clearInterval(timerRef.current!);
              setIsRunning(false);
              handleTimerComplete();
              return 0;
            }
            return prevMinutes - 1;
          });
          return 59;
        }
        return prevSeconds - 1;
      });
    }, 1000);
  }, [isRunning, handleTimerComplete]);

  const pauseTimer = useCallback(() => {
    if (!isRunning) return;
    
    clearInterval(timerRef.current!);
    setIsRunning(false);
    pausedTimeRef.current = Date.now();
  }, [isRunning]);

  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current!);
    setIsRunning(false);
    startTimeRef.current = null;
    pausedTimeRef.current = null;
    
    let duration;
    switch (timerType) {
      case 'focus':
        duration = focusDuration;
        break;
      case 'shortBreak':
        duration = shortBreakDuration;
        break;
      case 'longBreak':
        duration = longBreakDuration;
        break;
    }
    
    setMinutes(duration);
    setSeconds(0);
  }, [timerType, focusDuration, shortBreakDuration, longBreakDuration]);

  const handleSkip = useCallback(() => {
    if (timerType === 'focus') return;
    
    const skippedSessionData: SessionData = {
      id: generateId(),
      type: timerType,
      duration: timerType === 'shortBreak' ? shortBreakDuration : longBreakDuration,
      timestamp: new Date(),
      completed: false,
      skipped: true
    };
    
    setSessionHistory(prev => [...prev, skippedSessionData]);
    setTimerType('focus');
    resetTimer();
  }, [timerType, shortBreakDuration, longBreakDuration, resetTimer]);

  const handleComplete = useCallback(() => {
    if (timerType !== 'focus' || !isRunning) return;
    
    const elapsedTime = startTimeRef.current 
      ? calculateElapsedTime(startTimeRef.current, Date.now()) 
      : 0;
    
    const earlyCompletionData: SessionData = {
      id: generateId(),
      type: timerType,
      duration: Math.floor(elapsedTime / 60),
      timestamp: new Date(),
      completed: true,
      earlyCompletion: true,
      todoText: selectedTodoId ? todos.find(t => t.id === selectedTodoId)?.text : undefined
    };
    
    setSessionHistory(prev => [...prev, earlyCompletionData]);
    
    if (selectedTodoId) {
      setTodos(prevTodos => prevTodos.map(todo => 
        todo.id === selectedTodoId 
          ? { ...todo, pomodoros: todo.pomodoros + 1 }
          : todo
      ));
    }
    
    const newCompletedSessions = completedSessions + 1;
    setCompletedSessions(newCompletedSessions);
    
    if (newCompletedSessions % pomodorosUntilLongBreak === 0) {
      setTimerType('longBreak');
    } else {
      setTimerType('shortBreak');
    }
    
    resetTimer();
  }, [
    timerType,
    isRunning,
    selectedTodoId,
    todos,
    completedSessions,
    pomodorosUntilLongBreak,
    resetTimer
  ]);

  const currentTodo = selectedTodoId 
    ? todos.find(todo => todo.id === selectedTodoId)?.text 
    : undefined;

  useKeyboardShortcuts({
    onToggleTimer: isRunning ? pauseTimer : startTimer,
    onReset: resetTimer,
    onMute: () => setIsMuted(!isMuted),
    onSettings: () => setSettingsOpen(true)
  });

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      stopTickSound();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      <div className="container mx-auto px-4 py-8">
        <ThemeToggle theme={theme} onToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
        <Header />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col items-center">
            <Timer 
              minutes={minutes}
              seconds={seconds}
              timerType={timerType}
              progress={calculateProgress()}
              currentTodo={currentTodo}
            />
            
            <SessionCounter 
              completed={completedSessions % pomodorosUntilLongBreak}
              total={pomodorosUntilLongBreak}
            />
            
            <Controls 
              isRunning={isRunning}
              isMuted={isMuted}
              timerType={timerType}
              onStart={startTimer}
              onPause={pauseTimer}
              onReset={resetTimer}
              onSkip={handleSkip}
              onComplete={handleComplete}
              onOpenSettings={() => setSettingsOpen(true)}
              onToggleMute={() => setIsMuted(!isMuted)}
            />
            
            <History 
              sessions={sessionHistory}
              isVisible={historyVisible}
              onToggle={() => setHistoryVisible(!historyVisible)}
            />
            
            <Link 
              to="/statistics"
              className="flex items-center justify-center gap-2 px-4 py-2 mt-4 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors rounded-lg"
            >
              <BarChart3 size={20} />
              <span className="font-medium">查看详细统计</span>
            </Link>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <TodoList 
              todos={todos}
              setTodos={setTodos}
              selectedTodoId={selectedTodoId}
              onSelectTodo={setSelectedTodoId}
              isTimerRunning={isRunning}
            />
          </div>
        </div>
        
        <Settings 
          isOpen={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          focusDuration={focusDuration}
          shortBreakDuration={shortBreakDuration}
          longBreakDuration={longBreakDuration}
          pomodorosUntilLongBreak={pomodorosUntilLongBreak}
          onFocusChange={setFocusDuration}
          onShortBreakChange={setShortBreakDuration}
          onLongBreakChange={setLongBreakDuration}
          onPomodorosUntilLongBreakChange={setPomodorosUntilLongBreak}
        />
      </div>
      <Outlet context={{ sessionHistory }} />
    </div>
  );
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={null} />
          <Route path="statistics" element={<StatisticsPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;