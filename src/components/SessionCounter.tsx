import React from 'react';

interface SessionCounterProps {
  completed: number;
  total: number;
}

const SessionCounter: React.FC<SessionCounterProps> = ({ completed, total }) => {
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      {Array.from({ length: total }).map((_, index) => (
        <div 
          key={index}
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            index < completed 
              ? 'bg-red-500 scale-100' 
              : 'bg-gray-300 scale-90'
          }`}
          aria-label={index < completed ? "Completed session" : "Incomplete session"}
        />
      ))}
    </div>
  );
};

export default SessionCounter;