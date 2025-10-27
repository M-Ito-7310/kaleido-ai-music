'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface DownloadButtonProps {
  musicId: number;
  audioUrl: string;
  title: string;
  artist: string;
}

export function DownloadButton({ musicId, audioUrl, title, artist }: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      // ダウンロード数をインクリメント
      await fetch(`/api/music/${musicId}/download`, {
        method: 'POST',
      });

      // ファイルをダウンロード
      const response = await fetch(audioUrl);
      const blob = await response.blob();

      // ファイル名を生成（日本語対応）
      const filename = `${title}.mp3`
        .replace(/[<>:"/\\|?*]/g, '') // ファイルシステムで禁止されている文字を除去
        .replace(/\s+/g, ' ')          // 複数の空白を1つに
        .trim();                       // 前後の空白を削除

      // ダウンロードリンクを作成
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('ダウンロードに失敗しました。もう一度お試しください。');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={isDownloading}
      variant="outline"
      size="md"
      className="w-full sm:w-auto"
    >
      {isDownloading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ダウンロード中...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          ダウンロード
        </>
      )}
    </Button>
  );
}
