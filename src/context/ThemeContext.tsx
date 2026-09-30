import React, { createContext, useContext, useEffect, useState } from 'react';

export type SkinTheme = 'default' | 'dark' | 'light';

interface ThemeContextType {
  theme: SkinTheme;
  setTheme: (theme: SkinTheme) => void;
  toggleNextTheme: () => void;
  themeLabels: Record<SkinTheme, { label: string; icon: string; description: string }>;
}

const THEME_STORAGE_KEY = 'trilha_sonora_skin_v1';

const THEME_LABELS: Record<SkinTheme, { label: string; icon: string; description: string }> = {
  default: {
    label: 'Clássica Trilha',
    icon: '⚡',
    description: 'Azul Royal & Laranja clássico com fundo dark slate',
  },
  dark: {
    label: 'Noturna (Midnight)',
    icon: '🌙',
    description: 'Preto ônix absoluto com alto contraste e realces neon',
  },
  light: {
    label: 'Clara (Clean)',
    icon: '☀️',
    description: 'Fundo claro off-white, cartões brancos e máxima legibilidade',
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<SkinTheme>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as SkinTheme;
      if (saved === 'default' || saved === 'dark' || saved === 'light') {
        return saved;
      }
    } catch {
      // Fallback
    }
    return 'default';
  });

  const setTheme = (newTheme: SkinTheme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch {
      // Ignore
    }
  };

  const toggleNextTheme = () => {
    if (theme === 'default') setTheme('dark');
    else if (theme === 'dark') setTheme('light');
    else setTheme('default');
  };

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    
    // Manage class on body for global color schemes
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light-skin');
      document.body.classList.remove('bg-slate-950', 'text-slate-100');
      document.body.classList.add('bg-slate-50', 'text-slate-900', 'light-mode-active');
    } else if (theme === 'dark') {
      root.classList.remove('light-skin');
      root.classList.add('dark', 'midnight-skin');
      document.body.classList.remove('bg-slate-50', 'text-slate-900', 'light-mode-active');
      document.body.classList.add('bg-[#050508]', 'text-slate-100');
    } else {
      root.classList.remove('light-skin', 'midnight-skin');
      root.classList.add('dark', 'default-skin');
      document.body.classList.remove('bg-slate-50', 'text-slate-900', 'light-mode-active');
      document.body.classList.add('bg-slate-950', 'text-slate-100');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleNextTheme, themeLabels: THEME_LABELS }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
