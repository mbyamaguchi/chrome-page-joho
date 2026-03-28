// メッセージの型定義
export type ContentRequest = { action: 'extractText' };
export type ContentResponse = { title: string; url: string; text: string; error?: string };
