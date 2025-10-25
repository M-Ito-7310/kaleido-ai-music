# Phase 16: Design System Completion

## Status
📋 **PLANNED**

## Implementation Time
Estimated: 2-3 hours

## Overview
デザインシステムの完成。統一されたデザイントークン、カスタマイズ可能なテーマビルダー、アニメーションライブラリ、アイコンシステム、レスポンシブグリッド、コンポーネントドキュメンテーションにより、一貫性のある美しいUIを保証します。

## Technologies to Use
- CSS Custom Properties (design tokens)
- Tailwind CSS (utility classes)
- Framer Motion (animation presets)
- TypeScript (type-safe design system)

## Dependencies

No new dependencies (uses existing tools)

## Files to Create

1. **lib/design/tokens.ts** - Design token definitions
2. **lib/design/animations.ts** - Animation preset library
3. **lib/design/icons.ts** - Icon system
4. **components/theme/ThemeBuilder.tsx** - User-customizable theme creator
5. **components/theme/ThemePreview.tsx** - Live theme preview
6. **styles/design-system.css** - CSS variables and utilities
7. **docs/DESIGN_SYSTEM.md** - Design system documentation

## Key Features

### 1. Design Tokens

```typescript
// lib/design/tokens.ts

export const designTokens = {
  // Colors
  colors: {
    // Primary colors (Purple gradient)
    primary: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7e22ce',
      800: '#6b21a8',
      900: '#581c87',
    },

    // Accent colors (Cyan/Teal)
    accent: {
      50: '#ecfeff',
      100: '#cffafe',
      200: '#a5f3fc',
      300: '#67e8f9',
      400: '#22d3ee',
      500: '#06b6d4',
      600: '#0891b2',
      700: '#0e7490',
      800: '#155e75',
      900: '#164e63',
    },

    // Neutral colors
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },

    // Semantic colors
    semantic: {
      success: {
        light: '#10b981',
        DEFAULT: '#059669',
        dark: '#047857',
      },
      error: {
        light: '#ef4444',
        DEFAULT: '#dc2626',
        dark: '#b91c1c',
      },
      warning: {
        light: '#f59e0b',
        DEFAULT: '#d97706',
        dark: '#b45309',
      },
      info: {
        light: '#3b82f6',
        DEFAULT: '#2563eb',
        dark: '#1d4ed8',
      },
    },
  },

  // Typography
  typography: {
    fontFamily: {
      display: 'var(--font-inter)',
      body: 'var(--font-inter)',
      mono: 'ui-monospace, monospace',
    },
    fontSize: {
      xs: '0.75rem',      // 12px
      sm: '0.875rem',     // 14px
      base: '1rem',       // 16px
      lg: '1.125rem',     // 18px
      xl: '1.25rem',      // 20px
      '2xl': '1.5rem',    // 24px
      '3xl': '1.875rem',  // 30px
      '4xl': '2.25rem',   // 36px
      '5xl': '3rem',      // 48px
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  // Spacing
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
  },

  // Border radius
  borderRadius: {
    none: '0',
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '1rem',      // 16px
    xl: '1.5rem',    // 24px
    '2xl': '2rem',   // 32px
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  },

  // Animations
  animations: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Z-index scale
  zIndex: {
    base: 0,
    dropdown: 10,
    sticky: 20,
    fixed: 30,
    modalBackdrop: 40,
    modal: 50,
    popover: 60,
    tooltip: 70,
  },
};

export type DesignTokens = typeof designTokens;
```

### 2. Animation Library

```typescript
// lib/design/animations.ts

import { Variants } from 'framer-motion';

export const animations = {
  // Fade animations
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  } as Variants,

  // Slide animations
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  } as Variants,

  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  } as Variants,

  slideLeft: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  } as Variants,

  slideRight: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  } as Variants,

  // Scale animations
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  } as Variants,

  scaleSpring: {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { type: 'spring', stiffness: 300, damping: 20 },
    },
    exit: { opacity: 0, scale: 0.8 },
  } as Variants,

  // Rotate animations
  rotate: {
    initial: { opacity: 0, rotate: -180 },
    animate: { opacity: 1, rotate: 0 },
    exit: { opacity: 0, rotate: 180 },
  } as Variants,

  // Blur animations
  blur: {
    initial: { opacity: 0, filter: 'blur(10px)' },
    animate: { opacity: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, filter: 'blur(10px)' },
  } as Variants,

  // Stagger children
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  } as Variants,

  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  } as Variants,

  // Bounce
  bounce: {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatType: 'loop' as const,
      },
    },
  } as Variants,

  // Pulse
  pulse: {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: 'loop' as const,
      },
    },
  } as Variants,

  // Shake
  shake: {
    animate: {
      x: [0, -10, 10, -10, 10, 0],
      transition: {
        duration: 0.5,
      },
    },
  } as Variants,
};

// Preset transition configurations
export const transitions = {
  fast: { duration: 0.15 },
  normal: { duration: 0.3 },
  slow: { duration: 0.5 },
  spring: { type: 'spring' as const, stiffness: 300, damping: 20 },
  springBouncy: { type: 'spring' as const, stiffness: 200, damping: 10 },
};
```

### 3. Theme Builder Component

```typescript
'use client';

import { useState } from 'react';
import { Palette, Download, Upload } from 'lucide-react';
import { designTokens } from '@/lib/design/tokens';

export function ThemeBuilder() {
  const [customTheme, setCustomTheme] = useState({
    primaryColor: '#9333ea',
    accentColor: '#06b6d4',
    backgroundColor: '#ffffff',
    textColor: '#171717',
    borderRadius: 'medium',
    fontFamily: 'Inter',
  });

  const applyTheme = () => {
    const root = document.documentElement;

    // Apply CSS custom properties
    root.style.setProperty('--color-primary', customTheme.primaryColor);
    root.style.setProperty('--color-accent', customTheme.accentColor);
    root.style.setProperty('--color-background', customTheme.backgroundColor);
    root.style.setProperty('--color-text', customTheme.textColor);

    // Save to localStorage
    localStorage.setItem('custom-theme', JSON.stringify(customTheme));
  };

  const exportTheme = () => {
    const dataStr = JSON.stringify(customTheme, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'kaleido-theme.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const theme = JSON.parse(e.target?.result as string);
        setCustomTheme(theme);
        applyTheme();
      } catch (error) {
        console.error('Failed to import theme:', error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <Palette className="w-8 h-8" />
          Theme Builder
        </h2>

        <div className="flex gap-2">
          <button
            onClick={exportTheme}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <label className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer">
            <Upload className="w-4 h-4" />
            Import
            <input type="file" accept=".json" onChange={importTheme} className="hidden" />
          </label>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Color Controls */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Colors</h3>

          <div>
            <label className="block font-medium mb-2">Primary Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={customTheme.primaryColor}
                onChange={(e) =>
                  setCustomTheme({ ...customTheme, primaryColor: e.target.value })
                }
                className="w-16 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={customTheme.primaryColor}
                onChange={(e) =>
                  setCustomTheme({ ...customTheme, primaryColor: e.target.value })
                }
                className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-800"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-2">Accent Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={customTheme.accentColor}
                onChange={(e) =>
                  setCustomTheme({ ...customTheme, accentColor: e.target.value })
                }
                className="w-16 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={customTheme.accentColor}
                onChange={(e) =>
                  setCustomTheme({ ...customTheme, accentColor: e.target.value })
                }
                className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-800"
              />
            </div>
          </div>

          {/* More color controls... */}

          <div>
            <label className="block font-medium mb-2">Border Radius</label>
            <select
              value={customTheme.borderRadius}
              onChange={(e) =>
                setCustomTheme({ ...customTheme, borderRadius: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800"
            >
              <option value="none">None</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Preview</h3>

          <div
            className="p-6 rounded-xl border-2"
            style={{
              backgroundColor: customTheme.backgroundColor,
              borderColor: customTheme.primaryColor,
            }}
          >
            <h4
              className="text-2xl font-bold mb-4"
              style={{ color: customTheme.textColor }}
            >
              Sample Heading
            </h4>

            <button
              className="px-6 py-3 rounded-lg font-semibold mb-4"
              style={{
                backgroundColor: customTheme.primaryColor,
                color: '#ffffff',
              }}
            >
              Primary Button
            </button>

            <button
              className="px-6 py-3 rounded-lg font-semibold ml-2"
              style={{
                backgroundColor: customTheme.accentColor,
                color: '#ffffff',
              }}
            >
              Accent Button
            </button>

            <p style={{ color: customTheme.textColor }} className="mt-4">
              This is sample text to preview your theme. Lorem ipsum dolor sit amet,
              consectetur adipiscing elit.
            </p>
          </div>
        </div>
      </div>

      {/* Apply Button */}
      <button
        onClick={applyTheme}
        className="w-full px-6 py-4 bg-gradient-to-r from-primary-600 to-accent-DEFAULT text-white font-bold rounded-xl text-lg"
      >
        Apply Theme
      </button>
    </div>
  );
}
```

### 4. Design System CSS

```css
/* styles/design-system.css */

:root {
  /* Colors */
  --color-primary-50: #faf5ff;
  --color-primary-500: #a855f7;
  --color-primary-600: #9333ea;
  --color-primary-900: #581c87;

  --color-accent-500: #06b6d4;
  --color-accent-600: #0891b2;

  /* Typography */
  --font-display: var(--font-inter);
  --font-body: var(--font-inter);

  --text-xs: 0.75rem;
  --text-base: 1rem;
  --text-2xl: 1.5rem;
  --text-4xl: 2.25rem;

  /* Spacing */
  --space-xs: 0.25rem;
  --space-md: 1rem;
  --space-xl: 2rem;

  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);

  /* Transitions */
  --transition-fast: 150ms;
  --transition-normal: 300ms;
  --transition-slow: 500ms;

  --easing-ease-out: cubic-bezier(0, 0, 0.2, 1);
}

/* Utility classes */
.text-gradient {
  background: linear-gradient(135deg, var(--color-primary-600), var(--color-accent-500));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.glass {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.dark .glass {
  background: rgba(17, 24, 39, 0.8);
}

.animate-fade-in {
  animation: fadeIn var(--transition-normal) var(--easing-ease-out);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### 5. Component Library Structure

```typescript
// Standardized component structure
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

// Example: Button component
export function Button({
  className = '',
  children,
  variant = 'primary',
  size = 'md',
  ...props
}: ComponentProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white',
    secondary: 'bg-accent-500 hover:bg-accent-600 text-white',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`rounded-lg font-semibold transition-colors ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
```

## Design System Documentation

Create comprehensive documentation in `docs/DESIGN_SYSTEM.md`:

- **Color Palette**: All colors with hex codes
- **Typography Scale**: Font sizes, weights, line heights
- **Spacing System**: All spacing values
- **Component Gallery**: Visual examples of all components
- **Animation Library**: All available animations
- **Accessibility Guidelines**: Color contrast, focus states
- **Usage Examples**: Code snippets for common patterns

## Next Steps
🎉 **All phases complete!** Ready for production deployment.

## Notes
- 統一されたデザイントークンで一貫性を保証
- カスタマイズ可能なテーマで個性を表現
- アニメーションプリセットで簡単に美しい動きを実装
- CSS custom propertiesで動的なテーマ切り替え
- TypeScriptで型安全なデザインシステム
- 包括的なドキュメントで開発効率向上
- Tailwind CSSとの完全な統合
