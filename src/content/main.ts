// popupから受信
chrome.runtime.onMessage.addListener(
  (message, _, sendResponse: (response: { origin: string }) => void) => {
    if (message.type === "GET_URL_ORIGIN") {
      sendResponse({ origin: window.location.origin });
      return;
    }

    if (message.type === "RELOAD") {
      window.location.reload();
      return;
    }
  },
);
