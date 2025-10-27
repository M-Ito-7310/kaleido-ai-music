export const metadata = {
  title: '管理者ログイン - Kaleido AI Music',
  description: '管理者専用ログインページ',
};

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ログインページは完全に独立したレイアウトで、ヘッダーなし
  return <>{children}</>;
}
