import { ContentRequest, ContentResponse } from './types';

// ポップアップからのメッセージを受け取るリスナーを設定
chrome.runtime.onMessage.addListener(
    (request: ContentRequest, sender, sendResponse: (response: ContentResponse) => void) => {
        // テキスト抽出の要求がきた場合
        if (request.action === 'extractText') {
            try {
                // ページの全テキストを取得する
                const allText = document.body.innerText;

                // タイトル、URL、抽出したテキストを返す
                sendResponse({
                    title: document.title,
                    url: location.href,
                    text: allText
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