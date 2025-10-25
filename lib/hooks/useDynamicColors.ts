import { useEffect, useState } from 'react';
import {
  extractColorsFromImage,
  type ColorPalette,
} from '@/lib/colors/extractColors';

/**
 * 画像から動的にカラーパレットを抽出するReact Hook
 * @param imageUrl 画像URL
 * @returns カラーパレットとローディング状態
 */
export function useDynamicColors(imageUrl: string | null | undefined) {
  const [colors, setColors] = useState<ColorPalette | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!imageUrl) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    extractColorsFromImage(imageUrl)
      .then((palette) => {
        setColors(palette);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Failed to extract colors:', error);
        setIsLoading(false);
      });
  }, [imageUrl]);

  return { colors, isLoading };
}
