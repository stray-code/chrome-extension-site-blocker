import { getLocalStorage } from './utils';

chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  if (details.frameType !== 'outermost_frame') {
    return;
  }

  const siteBlockEnabled = await getLocalStorage('SITE_BLOCK_ENABLED');

  if (!siteBlockEnabled) {
    return;
  }

  const siteBlockUrlList = await getLocalStorage('SITE_BLOCK_URL_LIST');

  if (!siteBlockUrlList) {
    return;
  }

  // 正しいURLのみ抽出
  const correctUrlList = siteBlockUrlList.filter((url) => {
    return /https?:\/\/[\w!?/+\-_~;.,*&@#$%()'[\]]+/.test(url);
  });

  const url = new URL(details.url);
  const origin = url.origin;

  if (correctUrlList.includes(origin)) {
    chrome.tabs.update(details.tabId, { url: 'about:blank' });
  }
});
