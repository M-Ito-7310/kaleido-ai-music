'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi } from 'lucide-react';

/**
 * オフライン状態インジケーター
 * ネットワーク接続状態を監視し、オフライン時に通知を表示
 */
export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // 初期状態をチェック
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setShowNotification(true);
      // 3秒後に「オンラインに戻りました」通知を非表示
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowNotification(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <>
      {/* オフライン時の固定バナー */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 left-0 right-0 z-50 bg-amber-500 dark:bg-amber-600 text-white px-4 py-2 shadow-lg"
          >
            <div className="flex items-center justify-center gap-2 max-w-7xl mx-auto">
              <WifiOff className="w-4 h-4" />
              <p className="text-sm font-medium">
                オフラインモード - キャッシュされた音楽を再生できます
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 接続状態変化の通知トースト */}
      <AnimatePresence>
        {showNotification && isOnline && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-green-500 dark:bg-green-600 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2">
              <Wifi className="w-5 h-5" />
              <p className="text-sm font-semibold">オンラインに戻りました</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
