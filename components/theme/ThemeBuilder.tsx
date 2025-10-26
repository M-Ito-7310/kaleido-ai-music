'use client';

import { useState, useEffect } from 'react';
import { Palette, Download, Upload, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { slideUp } from '@/lib/design/animations';

/**
 * Theme Builder Component
 *
 * User-customizable theme creator with live preview
 */

interface CustomTheme {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  borderRadius: 'none' | 'small' | 'medium' | 'large';
  fontFamily: string;
}

const DEFAULT_THEME: CustomTheme = {
  primaryColor: '#9333ea',
  accentColor: '#06b6d4',
  backgroundColor: '#ffffff',
  textColor: '#171717',
  borderRadius: 'medium',
  fontFamily: 'Inter',
};

const BORDER_RADIUS_VALUES = {
  none: '0px',
  small: '0.25rem',
  medium: '0.5rem',
  large: '1rem',
};

export function ThemeBuilder() {
  const [customTheme, setCustomTheme] = useState<CustomTheme>(DEFAULT_THEME);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('custom-theme');
    if (savedTheme) {
      try {
        setCustomTheme(JSON.parse(savedTheme));
      } catch (error) {
        console.error('Failed to load saved theme:', error);
      }
    }
  }, []);

  const applyTheme = () => {
    const root = document.documentElement;

    // Apply CSS custom properties
    root.style.setProperty('--color-primary', customTheme.primaryColor);
    root.style.setProperty('--color-accent', customTheme.accentColor);
    root.style.setProperty('--color-background', customTheme.backgroundColor);
    root.style.setProperty('--color-text', customTheme.textColor);
    root.style.setProperty(
      '--border-radius',
      BORDER_RADIUS_VALUES[customTheme.borderRadius]
    );

    // Save to localStorage
    localStorage.setItem('custom-theme', JSON.stringify(customTheme));
  };

  const resetTheme = () => {
    setCustomTheme(DEFAULT_THEME);
    localStorage.removeItem('custom-theme');

    // Reset CSS custom properties
    const root = document.documentElement;
    root.style.removeProperty('--color-primary');
    root.style.removeProperty('--color-accent');
    root.style.removeProperty('--color-background');
    root.style.removeProperty('--color-text');
    root.style.removeProperty('--border-radius');
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
        alert('Invalid theme file');
      }
    };
    reader.readAsText(file);
  };

  const updateTheme = (updates: Partial<CustomTheme>) => {
    setCustomTheme((prev) => ({ ...prev, ...updates }));
  };

  return (
    <motion.div
      variants={slideUp}
      initial="initial"
      animate="animate"
      className="mx-auto max-w-6xl space-y-8 p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-3 text-3xl font-bold">
          <Palette className="h-8 w-8 text-primary-600" />
          Theme Builder
        </h2>

        <div className="flex gap-2">
          <button
            onClick={resetTheme}
            className="flex items-center gap-2 rounded-lg bg-gray-200 px-4 py-2 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
          <button
            onClick={exportTheme}
            className="flex items-center gap-2 rounded-lg bg-gray-200 px-4 py-2 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-gray-200 px-4 py-2 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600">
            <Upload className="h-4 w-4" />
            Import
            <input type="file" accept=".json" onChange={importTheme} className="hidden" />
          </label>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Color Controls */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Customize Your Theme</h3>

          {/* Primary Color */}
          <div>
            <label className="mb-2 block font-medium">Primary Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={customTheme.primaryColor}
                onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                className="h-10 w-16 cursor-pointer rounded"
              />
              <input
                type="text"
                value={customTheme.primaryColor}
                onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                className="flex-1 rounded-lg border px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
              />
            </div>
          </div>

          {/* Accent Color */}
          <div>
            <label className="mb-2 block font-medium">Accent Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={customTheme.accentColor}
                onChange={(e) => updateTheme({ accentColor: e.target.value })}
                className="h-10 w-16 cursor-pointer rounded"
              />
              <input
                type="text"
                value={customTheme.accentColor}
                onChange={(e) => updateTheme({ accentColor: e.target.value })}
                className="flex-1 rounded-lg border px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
              />
            </div>
          </div>

          {/* Background Color */}
          <div>
            <label className="mb-2 block font-medium">Background Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={customTheme.backgroundColor}
                onChange={(e) => updateTheme({ backgroundColor: e.target.value })}
                className="h-10 w-16 cursor-pointer rounded"
              />
              <input
                type="text"
                value={customTheme.backgroundColor}
                onChange={(e) => updateTheme({ backgroundColor: e.target.value })}
                className="flex-1 rounded-lg border px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
              />
            </div>
          </div>

          {/* Text Color */}
          <div>
            <label className="mb-2 block font-medium">Text Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={customTheme.textColor}
                onChange={(e) => updateTheme({ textColor: e.target.value })}
                className="h-10 w-16 cursor-pointer rounded"
              />
              <input
                type="text"
                value={customTheme.textColor}
                onChange={(e) => updateTheme({ textColor: e.target.value })}
                className="flex-1 rounded-lg border px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
              />
            </div>
          </div>

          {/* Border Radius */}
          <div>
            <label className="mb-2 block font-medium">Border Radius</label>
            <select
              value={customTheme.borderRadius}
              onChange={(e) =>
                updateTheme({
                  borderRadius: e.target.value as CustomTheme['borderRadius'],
                })
              }
              className="w-full rounded-lg border px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
            >
              <option value="none">None (0px)</option>
              <option value="small">Small (4px)</option>
              <option value="medium">Medium (8px)</option>
              <option value="large">Large (16px)</option>
            </select>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Live Preview</h3>

          <div
            className="space-y-4 border-2 p-6"
            style={{
              backgroundColor: customTheme.backgroundColor,
              borderColor: customTheme.primaryColor,
              borderRadius: BORDER_RADIUS_VALUES[customTheme.borderRadius],
            }}
          >
            <h4 className="text-2xl font-bold" style={{ color: customTheme.textColor }}>
              Sample Heading
            </h4>

            <p style={{ color: customTheme.textColor }}>
              This is sample text to preview your theme. The quick brown fox jumps over the lazy
              dog.
            </p>

            <div className="flex gap-2">
              <button
                className="px-6 py-3 font-semibold text-white"
                style={{
                  backgroundColor: customTheme.primaryColor,
                  borderRadius: BORDER_RADIUS_VALUES[customTheme.borderRadius],
                }}
              >
                Primary Button
              </button>

              <button
                className="px-6 py-3 font-semibold text-white"
                style={{
                  backgroundColor: customTheme.accentColor,
                  borderRadius: BORDER_RADIUS_VALUES[customTheme.borderRadius],
                }}
              >
                Accent Button
              </button>
            </div>

            <div
              className="p-4"
              style={{
                backgroundColor: customTheme.primaryColor + '20',
                borderRadius: BORDER_RADIUS_VALUES[customTheme.borderRadius],
              }}
            >
              <p style={{ color: customTheme.textColor }}>
                This is a card component with a semi-transparent background using your primary
                color.
              </p>
            </div>

            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-12 w-12"
                  style={{
                    backgroundColor: customTheme.accentColor,
                    borderRadius: BORDER_RADIUS_VALUES[customTheme.borderRadius],
                    opacity: i * 0.2,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Apply Button */}
      <button
        onClick={applyTheme}
        className="w-full rounded-xl bg-gradient-to-r from-primary-600 to-accent-DEFAULT px-6 py-4 text-lg font-bold text-white transition-transform hover:scale-[1.02]"
      >
        Apply Theme to App
      </button>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        Your theme will be saved to your browser and applied across the entire app
      </p>
    </motion.div>
  );
}
