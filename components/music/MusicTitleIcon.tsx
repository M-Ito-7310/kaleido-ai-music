interface MusicTitleIconProps {
  title: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function MusicTitleIcon({ title, size = 'md', className = '' }: MusicTitleIconProps) {
  // タイトルから最初の1-2文字を抽出
  const getInitials = (str: string): string => {
    if (!str) return '?';

    // 先頭の空白を除去
    const trimmed = str.trim();

    // 日本語の場合は最初の1文字、英語の場合は最初の2文字
    const isJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(trimmed[0]);

    if (isJapanese) {
      return trimmed.substring(0, 1);
    } else {
      // 英語の場合は最初の2単語の頭文字
      const words = trimmed.split(/\s+/);
      if (words.length >= 2) {
        return (words[0][0] + words[1][0]).toUpperCase();
      }
      return trimmed.substring(0, 2).toUpperCase();
    }
  };

  // タイトルから色を生成（一貫性のあるグラデーション）
  const getGradientColors = (str: string): string => {
    const hash = str.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    const gradients = [
      'from-purple-500 to-pink-500',
      'from-blue-500 to-cyan-500',
      'from-green-500 to-emerald-500',
      'from-orange-500 to-red-500',
      'from-indigo-500 to-purple-500',
      'from-pink-500 to-rose-500',
      'from-cyan-500 to-blue-500',
      'from-yellow-500 to-orange-500',
    ];

    return gradients[Math.abs(hash) % gradients.length];
  };

  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-16 h-16 text-lg',
    lg: 'w-24 h-24 text-2xl',
    xl: 'w-32 h-32 text-4xl',
  };

  const initials = getInitials(title);
  const gradient = getGradientColors(title);

  return (
    <div
      className={`
        flex items-center justify-center
        rounded-lg bg-gradient-to-br ${gradient}
        text-white font-bold shadow-lg
        ${sizeClasses[size]}
        ${className}
      `}
      title={title}
    >
      {initials}
    </div>
  );
}
