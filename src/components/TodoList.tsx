import React, { useState } from 'react';
import { Plus, Check, X, Clock } from 'lucide-react';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  pomodoros: number;
  estimatedPomodoros?: number;
}

interface TodoListProps {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  selectedTodoId: string | null;
  onSelectTodo: (id: string | null) => void;
  isTimerRunning: boolean;
}

const TodoList: React.FC<TodoListProps> = ({ 
  todos, 
  setTodos, 
  selectedTodoId, 
  onSelectTodo,
  isTimerRunning 
}) => {
  const [newTodo, setNewTodo] = useState('');
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(1);

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      setTodos(prevTodos => [
        ...prevTodos,
        {
          id: Date.now().toString(),
          text: newTodo.trim(),
          completed: false,
          pomodoros: 0,
          estimatedPomodoros
        }
      ]);
      setNewTodo('');
      setEstimatedPomodoros(1);
    }
  };

  const handleToggleTodo = (id: string) => {
    setTodos(prevTodos => prevTodos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
    
    if (selectedTodoId === id) {
      onSelectTodo(null);
    }
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    if (selectedTodoId === id) {
      onSelectTodo(null);
    }
  };

  const handleTodoSelect = (id: string) => {
    if (!isTimerRunning) {
      onSelectTodo(selectedTodoId === id ? null : id);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleAddTodo();
    }
  };

  const handleEstimatedPomodorosChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value) || 1;
    setEstimatedPomodoros(Math.max(1, Math.min(10, value)));
  };

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Tasks</h2>
      
      <div className="flex gap-2 mb-6">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={newTodo}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="添加新任务..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
          />
          <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
            <Clock size={16} className="text-indigo-500 dark:text-indigo-400" />
            <input
              type="number"
              min="1"
              max="10"
              value={estimatedPomodoros}
              onChange={handleEstimatedPomodorosChange}
              className="w-12 text-center border-none focus:outline-none dark:bg-gray-700 dark:text-white"
              title="预计番茄钟数量"
            />
          </div>
        </div>
        <button
          onClick={handleAddTodo}
          className="p-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50"
          title="添加任务"
        >
          <Plus size={24} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {todos.map(todo => (
          <div
            key={todo.id}
            onClick={() => !todo.completed && handleTodoSelect(todo.id)}
            className={`flex items-center gap-3 p-3 mb-2 rounded-lg border transition-all ${
              todo.completed 
                ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700' 
                : selectedTodoId === todo.id
                  ? `${isTimerRunning ? 'animate-pulse' : ''} bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-700`
                  : 'hover:border-indigo-200 dark:hover:border-indigo-700 dark:border-gray-700'
            }`}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggleTodo(todo.id);
              }}
              className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                todo.completed
                  ? 'bg-indigo-500 border-indigo-500 dark:bg-indigo-400 dark:border-indigo-400'
                  : 'border-gray-400 dark:border-gray-500 hover:border-indigo-500 dark:hover:border-indigo-400'
              }`}
            >
              {todo.completed && <Check size={14} className="text-white" />}
            </button>
            
            <span className={`flex-1 ${
              todo.completed 
                ? 'line-through text-gray-500 dark:text-gray-400' 
                : 'text-gray-800 dark:text-gray-200'
            }`}>
              {todo.text}
            </span>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-700 rounded-full text-sm">
                <Clock size={16} className="text-indigo-500 dark:text-indigo-400" />
                <span className="text-gray-600 dark:text-gray-300">
                  {todo.pomodoros}/{todo.estimatedPomodoros}
                </span>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteTodo(todo.id);
                }}
                className="text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                title="删除任务"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoList;