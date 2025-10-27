'use client';

import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  isDeleting?: boolean;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  isDeleting = false,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">削除の確認</h2>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
            aria-label="閉じる"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* コンテンツ */}
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            以下の音楽を削除しようとしています。この操作は取り消せません。
          </p>
          <div className="rounded-lg bg-gray-50 p-4 mb-6">
            <p className="text-sm font-medium text-gray-900">{title}</p>
          </div>
          <p className="text-sm font-semibold text-red-600">
            本当に削除してもよろしいですか？
          </p>
        </div>

        {/* フッター */}
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            キャンセル
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? '削除中...' : '削除する'}
          </button>
        </div>
      </div>
    </div>
  );
}
