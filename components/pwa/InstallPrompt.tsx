'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/**
 * PWAインストールプロンプト
 * ユーザーにアプリのインストールを促す美しいバナー
 */
export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // すでにインストール済みかチェック
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // ユーザーが以前に拒否したかチェック
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
      // 7日以内に拒否した場合は表示しない
      if (daysSinceDismissed < 7) {
        return;
      }
    }

    // beforeinstallprompt イベントをキャプチャ
    const handler = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      // 3秒後にプロンプトを表示（ページ読み込み直後は邪魔にならないように）
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // アプリがインストールされたときのハンドラー
    const appInstalledHandler = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', appInstalledHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', appInstalledHandler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // インストールプロンプトを表示
    deferredPrompt.prompt();

    // ユーザーの選択を待つ
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('PWA installed successfully');
    } else {
      console.log('PWA installation dismissed');
    }

    // プロンプトをクリア
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // 拒否した時刻を保存
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // すでにインストール済みまたはプロンプトがない場合は何も表示しない
  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-20 left-4 right-4 z-40 md:left-auto md:right-8 md:max-w-md"
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 dark:from-primary-600 dark:to-primary-800 p-4 shadow-2xl">
            {/* 閉じるボタン */}
            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/20 transition-colors"
              aria-label="閉じる"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* コンテンツ */}
            <div className="flex items-start gap-4 pr-8">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Download className="w-6 h-6 text-white" />
              </div>

              <div className="flex-1">
                <h3 className="text-white font-bold text-lg mb-1">
                  アプリをインストール
                </h3>
                <p className="text-white/90 text-sm mb-4">
                  Kaleido AI Musicをホーム画面に追加して、いつでも音楽を楽しめます
                </p>

                {/* インストールボタン */}
                <motion.button
                  onClick={handleInstall}
                  className="w-full py-2.5 px-4 bg-white text-primary-700 font-semibold rounded-lg shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  インストール
                </motion.button>
              </div>
            </div>

            {/* 装飾的なグラデーション */}
            <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
