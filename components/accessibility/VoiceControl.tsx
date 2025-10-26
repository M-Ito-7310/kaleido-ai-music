'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff } from 'lucide-react';
import { useVoiceCommands } from '@/lib/hooks/useVoiceCommands';

/**
 * VoiceControl Component
 *
 * Toggle button for voice commands
 */
export function VoiceControl() {
  const [enabled, setEnabled] = useState(false);
  const { isSupported, isListening, lastCommand } = useVoiceCommands({ enabled });

  if (!isSupported) {
    return null; // Hide if not supported
  }

  return (
    <div className="flex items-center gap-2">
      <motion.button
        onClick={() => setEnabled(!enabled)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative rounded-full p-3 transition-colors ${
          enabled
            ? 'bg-primary-600 text-white dark:bg-primary-500'
            : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
        }`}
        aria-label={enabled ? 'Disable voice control' : 'Enable voice control'}
        aria-pressed={enabled}
      >
        {enabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}

        {/* Listening indicator */}
        {isListening && (
          <motion.div
            className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            aria-hidden="true"
          />
        )}
      </motion.button>

      {/* Last command display */}
      {enabled && lastCommand && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          className="text-sm text-gray-600 dark:text-gray-400"
          aria-live="polite"
        >
          "{lastCommand}"
        </motion.div>
      )}
    </div>
  );
}
