chrome.webNavigation.onBeforeNavigate.addListener(function (details) {
  if (details.frameType !== 'outermost_frame') {
    return;
  }

  const url = new URL(details.url);
  const origin = url.origin;

  chrome.storage.local.get(
    ['SITE_BLOCK_URL_LIST', 'SITE_BLOCK_ENABLED'],
    (value) => {
      if (value?.SITE_BLOCK_ENABLED === false) {
        return;
      }

      if (!value?.SITE_BLOCK_URL_LIST) {
        return;
      }

      const urlList = value.SITE_BLOCK_URL_LIST as string[];

      // 正しいURLのみ抽出
      const correctUrlList = urlList.filter((url) => {
        return /https?:\/\/[\w!?/+\-_~;.,*&@#$%()'[\]]+/.test(url);
      });

      if (correctUrlList.includes(origin)) {
        chrome.tabs.update(details.tabId, { url: 'about:blank' });
      }
    },
  );
});
