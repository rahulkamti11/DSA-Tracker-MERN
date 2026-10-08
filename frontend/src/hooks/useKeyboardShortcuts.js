import { useEffect } from 'react';

export default function useKeyboardShortcuts({
  onEscape,
  onN,
  onD,
  onP,
  onQuestion,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.target.tagName === 'INPUT' ||
        e.target.tagName === 'TEXTAREA' ||
        e.target.tagName === 'SELECT' ||
        e.target.isContentEditable
      ) {
        return;
      }

      if (e.key === 'Escape') {
        if (onEscape) onEscape();
      }

      const key = e.key.toLowerCase();
      if (key === 'n') {
        if (onN) onN();
      } else if (key === 'd') {
        if (onD) onD();
      } else if (key === 'p') {
        if (onP) onP();
      } else if (key === '?') {
        if (onQuestion) onQuestion();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onEscape, onN, onD, onP, onQuestion]);
}
