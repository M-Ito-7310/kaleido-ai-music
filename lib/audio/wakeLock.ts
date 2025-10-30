/**
 * Wake Lock API統合
 * 画面スリープを防止して、バックグラウンド再生を確実にする
 *
 * Note: Wake Lock APIは主にモバイルデバイスで画面がオフになることを防ぐために使用されます。
 * ただし、音楽再生中に画面をオンのままにすることは、バッテリー消費が増えるため、
 * ユーザーのニーズに応じてオプション機能として提供します。
 */

let wakeLock: WakeLockSentinel | null = null;

/**
 * Wake Lockが利用可能かチェック
 */
export function isWakeLockSupported(): boolean {
  return 'wakeLock' in navigator;
}

/**
 * Wake Lockをリクエスト
 * 画面スリープを防止
 */
export async function requestWakeLock(): Promise<boolean> {
  if (!isWakeLockSupported()) {
    console.warn('Wake Lock API is not supported in this browser');
    return false;
  }

  try {
    // 既存のWake Lockがある場合は解放
    await releaseWakeLock();

    // 新しいWake Lockをリクエスト
    wakeLock = await navigator.wakeLock.request('screen');

    // Wake Lockが解放された時のイベントリスナー
    wakeLock.addEventListener('release', () => {
      console.log('Wake Lock was released');
    });

    console.log('Wake Lock is active');
    return true;
  } catch (err) {
    console.error(`Failed to acquire Wake Lock: ${err}`);
    return false;
  }
}

/**
 * Wake Lockを解放
 */
export async function releaseWakeLock(): Promise<void> {
  if (wakeLock) {
    try {
      await wakeLock.release();
      wakeLock = null;
      console.log('Wake Lock released');
    } catch (err) {
      console.error(`Failed to release Wake Lock: ${err}`);
    }
  }
}

/**
 * Wake Lockの状態を取得
 */
export function isWakeLockActive(): boolean {
  return wakeLock !== null && !wakeLock.released;
}

/**
 * ページの可視性が変わった時にWake Lockを再リクエスト
 * ユーザーが別のタブに切り替えた後に戻ってきた時など
 */
export function setupVisibilityChangeHandler(enabled: boolean = true): void {
  if (!isWakeLockSupported() || !enabled) return;

  const handleVisibilityChange = async () => {
    if (document.visibilityState === 'visible' && wakeLock?.released) {
      await requestWakeLock();
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);
}

/**
 * Wake Lock使用時の推奨設定
 * バッテリー消費を考慮して、デフォルトではWake Lockを使用しない
 */
export const WAKE_LOCK_CONFIG = {
  // デフォルトでは無効（バッテリー消費を抑えるため）
  enabledByDefault: false,
  // モバイルデバイスでのみ有効化を推奨
  recommendedForMobile: true,
  // バッテリー残量が低い場合は使用しない（将来的な実装）
  disableOnLowBattery: true,
};
