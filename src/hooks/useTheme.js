import { useEffect, useState } from 'react';

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'system');

  useEffect(() => {
    const resolved = theme === 'system' ? getSystemTheme() : theme;
    document.documentElement.setAttribute('data-theme', resolved);
    if (theme === 'system') {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [theme]);

  function toggle() {
    setTheme(prev => {
      const resolved = prev === 'system' ? getSystemTheme() : prev;
      const next = resolved === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', next);
      return next;
    });
  }

  const resolvedTheme = theme === 'system' ? getSystemTheme() : theme;

  return { theme: resolvedTheme, toggle };
}
