import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemeState } from '../types';

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      isDark: false,
      toggleTheme: () => set({ isDark: !get().isDark }),
    }),
    {
      name: 'theme-storage',
    }
  )
);
