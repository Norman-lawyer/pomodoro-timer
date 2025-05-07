import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-4 mb-8">
      <div className="flex items-center justify-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
          Pomodoro Timer
        </h1>
      </div>
      <p className="text-center bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mt-2">
        Focus. Break. Repeat.
      </p>
    </header>
  );
};

export default Header;