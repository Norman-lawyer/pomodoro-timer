import { useEffect, useCallback } from 'react';

interface ShortcutHandlers {
  onToggleTimer: () => void;
  onReset: () => void;
  onMute: () => void;
  onSettings: () => void;
}

export const useKeyboardShortcuts = ({
  onToggleTimer,
  onReset,
  onMute,
  onSettings
}: ShortcutHandlers) => {
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.target instanceof HTMLInputElement || 
        event.target instanceof HTMLTextAreaElement) {
      return;
    }

    switch (event.key.toLowerCase()) {
      case ' ':
        event.preventDefault();
        onToggleTimer();
        break;
      case 'escape':
        onReset();
        break;
      case 'm':
        onMute();
        break;
      case 's':
        onSettings();
        break;
    }
  }, [onToggleTimer, onReset, onMute, onSettings]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);
};