import { ContentRequest, ContentResponse } from './types';

const getElementById = <T extends HTMLElement>(id: string): T | null => {
    return document.getElementById(id) as T | null;
};

// 疑似要約を行う関数
const simpleSummarize = (text: string): string => {
    const maxLength = 50;
    if (text.length <= maxLength) {
        return text;
    }
    const cleanedText = text.replace(/\s+/g, ' ').trim();
    return cleanedText.substring(0, maxLength) + '...（疑似要約）';
};

// ポップアップが開かれたときの処理
document.addEventListener('DOMContentLoaded', async () => {
    const titleElement = getElementById<HTMLDivElement>('page-title');
    const urlElement = getElementById<HTMLDivElement>('page-url');
    const summaryElement = getElementById<HTMLDivElement>('page-summary');
    const statusElement = getElementById<HTMLDivElement>('status-message');

    if (!titleElement || !urlElement || !summaryElement || !statusElement) return;

    try {
        // 1. 現在アクティブなタブを取得
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        // タブが取得できない、または chrome 独自のページなどの場合は終了
        if (!tab || !tab.id || !tab.url?.startsWith('http')) {
            statusElement.textContent = "このページでは実行できません。";
            return;
        }

        // 2. コンテンツスクリプト（content.js）をそのタブに注入（実行）する
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js']
        });

        // 3. コンテンツスクリプトに対してテキストの抽出を要請
        const request: ContentRequest = { action: 'extractText' };
        const response = await chrome.tabs.sendMessage(tab.id, request) as ContentResponse;

        // 4. コンテンツスクリプトから帰ってきた情報を画面に表示
        if (response && !response.error) {
            statusElement.textContent = "完了。";
            titleElement.textContent = response.title;
            urlElement.textContent = response.url;

            // ここで疑似要約を実行し、その結果を表示
            summaryElement.textContent = simpleSummarize(response.text);
        } else {
            throw new Error(response?.error || "応答がありませんでした。");
        }
    } catch (error) {
        console.error('詳細なエラー:', error);
        statusElement.textContent = "エラーが発生しました。";

        let errorMessage = "原因不明のエラーです。";
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'string') {
            errorMessage = error;
        } else {
            errorMessage = JSON.stringify(error);
        }
        summaryElement.textContent = `【デバッグ情報】\n${errorMessage}`;
    }
});