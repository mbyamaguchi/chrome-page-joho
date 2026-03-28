import { ContentRequest, ContentResponse } from './types';

// ポップアップからのメッセージを受け取るリスナーを設定
chrome.runtime.onMessage.addListener(
    (request: ContentRequest, sender, sendResponse: (response: ContentResponse) => void) => {
        // テキスト抽出の要求がきた場合
        if (request.action === 'extractText') {
            try {
                // ページの全テキストを取得する
                const mainContent = document.querySelector('article')
                    || document.querySelector('main')
                    || document.body;

                let extractedText = mainContent.innerText || "";

                const MAX_LENGTH = 5000;
                if (extractedText.length > MAX_LENGTH) {
                    extractedText = extractedText.substring(0, MAX_LENGTH);
                }

                // タイトル、URL、抽出したテキストを返す
                sendResponse({
                    title: document.title,
                    url: location.href,
                    text: extractedText
                });
            } catch (error) {
                sendResponse({
                    title: '',
                    url: '',
                    text: '',
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        }
        return true;
    }
);