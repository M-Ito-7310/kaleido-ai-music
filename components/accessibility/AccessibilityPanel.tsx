'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, Eye, Zap, Type } from 'lucide-react';

/**
 * AccessibilityPanel Component
 *
 * Settings panel for accessibility options:
 * - High contrast mode
 * - Reduced motion
 * - Font size adjustment
 * - Keyboard shortcuts help
 */
export function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [fontSize, setFontSize] = useState(100); // Percentage

  // Load settings from localStorage
  useEffect(() => {
    const savedHighContrast = localStorage.getItem('accessibility-highContrast') === 'true';
    const savedReducedMotion = localStorage.getItem('accessibility-reducedMotion') === 'true';
    const savedFontSize = parseInt(localStorage.getItem('accessibility-fontSize') || '100');

    setHighContrast(savedHighContrast);
    setReducedMotion(savedReducedMotion);
    setFontSize(savedFontSize);

    // Apply settings
    applyHighContrast(savedHighContrast);
    applyReducedMotion(savedReducedMotion);
    applyFontSize(savedFontSize);
  }, []);

  const applyHighContrast = (enabled: boolean) => {
    if (enabled) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  };

  const applyReducedMotion = (enabled: boolean) => {
    if (enabled) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  };

  const applyFontSize = (size: number) => {
    document.documentElement.style.fontSize = `${size}%`;
  };

  const toggleHighContrast = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    localStorage.setItem('accessibility-highContrast', String(newValue));
    applyHighContrast(newValue);
  };

  const toggleReducedMotion = () => {
    const newValue = !reducedMotion;
    setReducedMotion(newValue);
    localStorage.setItem('accessibility-reducedMotion', String(newValue));
    applyReducedMotion(newValue);
  };

  const handleFontSizeChange = (newSize: number) => {
    setFontSize(newSize);
    localStorage.setItem('accessibility-fontSize', String(newSize));
    applyFontSize(newSize);
  };

  const keyboardShortcuts = [
    { key: 'Space', action: 'Play/Pause' },
    { key: 'Arrow Right', action: 'Next track' },
    { key: 'Arrow Left', action: 'Previous track' },
    { key: 'R', action: 'Cycle repeat mode' },
    { key: 'S', action: 'Toggle shuffle' },
    { key: 'F', action: 'Toggle full-screen' },
  ];

  return (
    <>
      {/* Floating Settings Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-24 right-4 z-40 rounded-full bg-gray-900 p-4 text-white shadow-lg dark:bg-gray-100 dark:text-gray-900"
        aria-label="Open accessibility settings"
      >
        <Settings className="h-6 w-6" />
      </motion.button>

      {/* Settings Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl dark:bg-gray-900"
              role="dialog"
              aria-labelledby="accessibility-title"
              aria-modal="true"
            >
              {/* Header */}
              <div className="mb-6 flex items-center justify-between">
                <h2 id="accessibility-title" className="text-2xl font-bold text-gray-900 dark:text-white">
                  Accessibility Settings
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                  aria-label="Close settings"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Settings */}
              <div className="space-y-6">
                {/* High Contrast */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Eye className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">High Contrast</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Increase color contrast
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={toggleHighContrast}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      highContrast ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                    role="switch"
                    aria-checked={highContrast}
                    aria-label="Toggle high contrast"
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                        highContrast ? 'left-5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>

                {/* Reduced Motion */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Reduced Motion</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Minimize animations
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={toggleReducedMotion}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      reducedMotion ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                    role="switch"
                    aria-checked={reducedMotion}
                    aria-label="Toggle reduced motion"
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                        reducedMotion ? 'left-5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>

                {/* Font Size */}
                <div>
                  <div className="mb-2 flex items-center gap-3">
                    <Type className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <div className="font-medium text-gray-900 dark:text-white">
                      Font Size: {fontSize}%
                    </div>
                  </div>
                  <input
                    type="range"
                    min="75"
                    max="150"
                    step="25"
                    value={fontSize}
                    onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
                    className="w-full accent-primary-600"
                    aria-label="Adjust font size"
                  />
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>75%</span>
                    <span>100%</span>
                    <span>125%</span>
                    <span>150%</span>
                  </div>
                </div>

                {/* Keyboard Shortcuts */}
                <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                    Keyboard Shortcuts
                  </h3>
                  <div className="space-y-2">
                    {keyboardShortcuts.map(({ key, action }) => (
                      <div
                        key={key}
                        className="flex justify-between text-sm text-gray-700 dark:text-gray-300"
                      >
                        <span className="font-mono rounded bg-gray-100 px-2 py-1 dark:bg-gray-800">
                          {key}
                        </span>
                        <span>{action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
