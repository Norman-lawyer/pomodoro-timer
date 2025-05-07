import { Todo } from '../components/TodoList';
import { SessionData } from '../components/History';

interface AppSettings {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  pomodorosUntilLongBreak: number;
  isMuted: boolean;
  theme: 'light' | 'dark';
  accentColor: string;
}

interface AppState {
  todos: Todo[];
  sessionHistory: SessionData[];
  settings: AppSettings;
}

const STORAGE_KEY = 'pomodoroAppState';

const defaultSettings: AppSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  pomodorosUntilLongBreak: 4,
  isMuted: false,
  theme: 'light',
  accentColor: 'red',
};

export const clearStorage = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const loadState = (): AppState => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (!serializedState) return { 
      todos: [], 
      sessionHistory: [], 
      settings: defaultSettings 
    };
    
    const parsedState = JSON.parse(serializedState);
    
    // 确保 sessionHistory 中的日期被正确解析
    if (parsedState.sessionHistory) {
      parsedState.sessionHistory = parsedState.sessionHistory.map((session: any) => ({
        ...session,
        timestamp: new Date(session.timestamp)
      }));
    }
    
    return parsedState;
  } catch (err) {
    console.warn('Error loading state:', err);
    return { 
      todos: [], 
      sessionHistory: [], 
      settings: defaultSettings 
    };
  }
};

export const saveState = (state: AppState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (err) {
    console.warn('Error saving state:', err);
  }
};