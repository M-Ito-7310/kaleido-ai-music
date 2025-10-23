import { db } from '@/lib/db';
import { categories } from '@/lib/db/schema';

const categoryData = [
  {
    name: 'ポップ',
    slug: 'pop',
    description: '明るく親しみやすいポップミュージック',
    icon: '🎵',
    color: 'blue',
  },
  {
    name: 'ロック',
    slug: 'rock',
    description: 'エネルギッシュなロックサウンド',
    icon: '🎸',
    color: 'red',
  },
  {
    name: 'クラシック',
    slug: 'classical',
    description: '優雅なクラシック音楽',
    icon: '🎻',
    color: 'purple',
  },
  {
    name: 'アンビエント',
    slug: 'ambient',
    description: '落ち着いた雰囲気の環境音楽',
    icon: '🌌',
    color: 'indigo',
  },
  {
    name: 'エレクトロニック',
    slug: 'electronic',
    description: 'シンセサイザーを使った電子音楽',
    icon: '🎹',
    color: 'cyan',
  },
  {
    name: 'ジャズ',
    slug: 'jazz',
    description: '即興性豊かなジャズミュージック',
    icon: '🎷',
    color: 'amber',
  },
  {
    name: 'Lo-Fi',
    slug: 'lofi',
    description: 'リラックスできるLo-Fiヒップホップ',
    icon: '☕',
    color: 'orange',
  },
  {
    name: 'シネマティック',
    slug: 'cinematic',
    description: '映画のような壮大なサウンドトラック',
    icon: '🎬',
    color: 'gray',
  },
];

async function seedCategories() {
  console.log('🌱 Seeding categories...');

  for (const category of categoryData) {
    await db.insert(categories).values(category).onConflictDoNothing();
    console.log(`✅ Created category: ${category.name}`);
  }

  console.log('✅ Categories seeded successfully');
}

seedCategories()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error seeding categories:', error);
    process.exit(1);
  });
