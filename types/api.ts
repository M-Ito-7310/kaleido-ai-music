// 成功レスポンス
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

// エラーレスポンス
export interface ApiErrorResponse {
  success: false;
  error: string;
  message?: string;
  statusCode?: number;
}

// ページネーション付きレスポンス
export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

// API レスポンス型（成功 or エラー）
export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;
