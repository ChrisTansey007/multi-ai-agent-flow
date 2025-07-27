// Design system color tokens with semantic naming
export const colors = {
  // Brand colors
  brand: {
    primary: '#3b82f6',
    secondary: '#14b8a6',
    accent: '#d946ef',
  },
  
  // Semantic colors
  semantic: {
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  
  // Agent colors with better contrast
  agent: [
    '#3b82f6', // blue-500
    '#22c55e', // green-500
    '#f97316', // orange-500
    '#ec4899', // pink-500
    '#8b5cf6', // violet-500
    '#06b6d4', // cyan-500
    '#f59e0b', // amber-500
    '#ef4444', // red-500
  ],
  
  // Surface colors for dark theme
  surface: {
    primary: '#0a0a0a',
    secondary: '#171717',
    tertiary: '#262626',
    elevated: '#404040',
  },
  
  // Text colors with proper contrast
  text: {
    primary: '#fafafa',
    secondary: '#d4d4d4',
    tertiary: '#a3a3a3',
    inverse: '#171717',
  },
  
  // Border colors
  border: {
    primary: '#404040',
    secondary: '#262626',
    accent: '#3b82f6',
  },
} as const;

export type ColorToken = keyof typeof colors;