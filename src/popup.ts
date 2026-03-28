document.addEventListener('DOMContentLoaded', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {

        const currentTab = tabs[0];

        const titleElement = document.getElementById('page-title') as HTMLDivElement | null;
        const urlElement = document.getElementById('page-url') as HTMLDivElement | null;

        if (currentTab && titleElement && urlElement) {
            titleElement.textContent = currentTab.title ?? "タイトルを取得できませんでした。";
            urlElement.textContent = currentTab.url ?? "URLを取得できませんでした。";
        } else if (titleElement && urlElement) {
            titleElement.textContent = "タブの情報を取得できませんでした。";
            urlElement.textContent = "タブの情報を取得できませんでした。";
        }
    });
});