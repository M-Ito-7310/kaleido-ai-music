/**
 * MediaSession API統合
 * ロックスクリーンやシステムメディアコントロールで音楽操作を可能にする
 */

export interface MediaMetadata {
  title: string;
  artist: string;
  album?: string;
  artwork?: {
    src: string;
    sizes: string;
    type: string;
  }[];
}

export interface MediaSessionHandlers {
  onPlay?: () => void;
  onPause?: () => void;
  onSeekBackward?: () => void;
  onSeekForward?: () => void;
  onPreviousTrack?: () => void;
  onNextTrack?: () => void;
  onSeekTo?: (time: number) => void;
}

/**
 * MediaSessionをセットアップ
 */
export function setupMediaSession(metadata: MediaMetadata, handlers: MediaSessionHandlers) {
  // MediaSession APIが利用可能かチェック
  if (!('mediaSession' in navigator)) {
    console.warn('MediaSession API is not supported in this browser');
    return;
  }

  // メタデータの設定
  navigator.mediaSession.metadata = new window.MediaMetadata({
    title: metadata.title,
    artist: metadata.artist,
    album: metadata.album || '',
    artwork: metadata.artwork || generateArtwork(metadata.title),
  });

  // アクションハンドラーの設定
  const actions: Array<{
    action: MediaSessionAction;
    handler?: MediaSessionActionHandler;
  }> = [
    { action: 'play', handler: handlers.onPlay },
    { action: 'pause', handler: handlers.onPause },
    { action: 'seekbackward', handler: handlers.onSeekBackward },
    { action: 'seekforward', handler: handlers.onSeekForward },
    { action: 'previoustrack', handler: handlers.onPreviousTrack },
    { action: 'nexttrack', handler: handlers.onNextTrack },
  ];

  // seektoハンドラーは特別な処理が必要
  if (handlers.onSeekTo) {
    actions.push({
      action: 'seekto',
      handler: (details) => {
        if (details.seekTime !== undefined && handlers.onSeekTo) {
          handlers.onSeekTo(details.seekTime);
        }
      },
    });
  }

  // すべてのアクションを登録
  actions.forEach(({ action, handler }) => {
    try {
      if (handler) {
        navigator.mediaSession.setActionHandler(action, handler);
      }
    } catch (error) {
      console.warn(`The action "${action}" is not supported by this browser`, error);
    }
  });
}

/**
 * 再生位置の更新
 */
export function updatePositionState(duration: number, currentTime: number, playbackRate: number = 1.0) {
  if (!('mediaSession' in navigator) || !navigator.mediaSession.setPositionState) {
    return;
  }

  try {
    navigator.mediaSession.setPositionState({
      duration,
      playbackRate,
      position: currentTime,
    });
  } catch (error) {
    console.warn('Failed to update position state:', error);
  }
}

/**
 * 再生状態の更新
 */
export function updatePlaybackState(state: 'none' | 'paused' | 'playing') {
  if (!('mediaSession' in navigator)) {
    return;
  }

  navigator.mediaSession.playbackState = state;
}

/**
 * MediaSessionのクリア
 */
export function clearMediaSession() {
  if (!('mediaSession' in navigator)) {
    return;
  }

  // メタデータをクリア
  navigator.mediaSession.metadata = null;

  // すべてのアクションハンドラーを解除
  const actions: MediaSessionAction[] = [
    'play',
    'pause',
    'seekbackward',
    'seekforward',
    'previoustrack',
    'nexttrack',
    'seekto',
  ];

  actions.forEach((action) => {
    try {
      navigator.mediaSession.setActionHandler(action, null);
    } catch (error) {
      // アクションがサポートされていない場合は無視
    }
  });

  // 再生状態をリセット
  navigator.mediaSession.playbackState = 'none';
}

/**
 * デフォルトのアートワークを生成
 */
function generateArtwork(title: string): { src: string; sizes: string; type: string }[] {
  // アートワークが提供されない場合のフォールバック
  // 本番環境では実際の画像URLを使用
  return [
    { src: '/default-artwork-96.png', sizes: '96x96', type: 'image/png' },
    { src: '/default-artwork-128.png', sizes: '128x128', type: 'image/png' },
    { src: '/default-artwork-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/default-artwork-256.png', sizes: '256x256', type: 'image/png' },
    { src: '/default-artwork-384.png', sizes: '384x384', type: 'image/png' },
    { src: '/default-artwork-512.png', sizes: '512x512', type: 'image/png' },
  ];
}

/**
 * 画像URLから複数サイズのアートワークを生成
 */
export function createArtworkFromUrl(imageUrl: string): { src: string; sizes: string; type: string }[] {
  return [
    { src: imageUrl, sizes: '96x96', type: 'image/jpeg' },
    { src: imageUrl, sizes: '128x128', type: 'image/jpeg' },
    { src: imageUrl, sizes: '192x192', type: 'image/jpeg' },
    { src: imageUrl, sizes: '256x256', type: 'image/jpeg' },
    { src: imageUrl, sizes: '384x384', type: 'image/jpeg' },
    { src: imageUrl, sizes: '512x512', type: 'image/jpeg' },
  ];
}
