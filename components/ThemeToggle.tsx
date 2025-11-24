
'use client';
import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/Button';

export function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const isDark = saved ? saved === 'true' : systemDark;
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle('dark', newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleDarkMode}
      className=" absolute p-2 top-4 right-[40%] z-1000 bg-transparent"
      title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <Sun className={`h-5 w-5 transition-all   ${darkMode ? 'scale-0 rotate-90' : 'scale-100 rotate-0'}`} />
      <Moon className={`  h-5 w-5 transition-all   ${darkMode ? 'scale-100 rotate-0' : 'scale-0 -rotate-90'}`} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
