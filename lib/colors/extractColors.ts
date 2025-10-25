import { Vibrant } from 'node-vibrant/browser';

export interface ColorPalette {
  vibrant: string;
  muted: string;
  darkVibrant: string;
  lightVibrant: string;
  darkMuted: string;
  lightMuted: string;
  dominant: string;
}

/**
 * アルバムアートから色を抽出してカラーパレットを生成
 * @param imageUrl 画像URL
 * @returns カラーパレット
 */
export async function extractColorsFromImage(
  imageUrl: string
): Promise<ColorPalette> {
  try {
    const palette = await Vibrant.from(imageUrl).getPalette();

    return {
      vibrant: palette.Vibrant?.hex || '#8B5CF6',
      muted: palette.Muted?.hex || '#94A3B8',
      darkVibrant: palette.DarkVibrant?.hex || '#6D28D9',
      lightVibrant: palette.LightVibrant?.hex || '#C4B5FD',
      darkMuted: palette.DarkMuted?.hex || '#475569',
      lightMuted: palette.LightMuted?.hex || '#CBD5E1',
      dominant: palette.Vibrant?.hex || '#8B5CF6',
    };
  } catch (error) {
    console.error('Color extraction failed:', error);
    // フォールバックカラー（プライマリカラー）
    return {
      vibrant: '#8B5CF6',
      muted: '#94A3B8',
      darkVibrant: '#6D28D9',
      lightVibrant: '#C4B5FD',
      darkMuted: '#475569',
      lightMuted: '#CBD5E1',
      dominant: '#8B5CF6',
    };
  }
}

/**
 * カラーパレットから背景グラデーションCSSを生成
 * @param colors カラーパレット
 * @param angle グラデーションの角度（デフォルト: 135deg）
 * @returns CSS gradientプロパティ値
 */
export function createGradientFromPalette(
  colors: ColorPalette,
  angle: number = 135
): string {
  return `linear-gradient(${angle}deg, ${colors.darkVibrant} 0%, ${colors.vibrant} 50%, ${colors.lightVibrant} 100%)`;
}

/**
 * カラーパレットからテキストに適したコントラストカラーを取得
 * @param backgroundColor 背景色（hex）
 * @returns 'white' または 'black'
 */
export function getContrastColor(backgroundColor: string): 'white' | 'black' {
  // hexをRGBに変換
  const hex = backgroundColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // 輝度計算（relative luminance）
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // 輝度が0.5以上なら黒、それ以下なら白
  return luminance > 0.5 ? 'black' : 'white';
}
