// popupから受信
chrome.runtime.onMessage.addListener(
  (message, _, sendResponse: (response: { origin: string }) => void) => {
    if (message.message === 'GET_URL_ORIGIN') {
      sendResponse({ origin: window.location.origin });
      return;
    }

    if (message.message === 'RELOAD') {
      window.location.reload();
      return;
    }
  },
);
