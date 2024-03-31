import { Button, Box } from '@mantine/core';
import { useEffect, useState } from 'react';

function App() {
  const [origin, setOrigin] = useState('');

  const getTab = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    return tab;
  };

  useEffect(() => {
    (async () => {
      const tab = await getTab();

      if (!tab.id) {
        return;
      }

      chrome.tabs.sendMessage(
        tab.id,
        { message: 'GET_URL_ORIGIN' },
        (response) => {
          if (response) {
            setOrigin(response.origin);
          }
        },
      );
    })();
  }, []);

  return (
    <Box p="md">
      <Button
        type="button"
        size="xs"
        color="red"
        styles={{
          root: {
            flexShrink: 0,
          },
        }}
        disabled={!origin}
        onClick={async () => {
          chrome.storage.local.get('SITE_BLOCK_URL_LIST', (value) => {
            const newUrlList = [...(value?.SITE_BLOCK_URL_LIST ?? []), origin];

            chrome.storage.local.set({ SITE_BLOCK_URL_LIST: newUrlList });
          });

          const tab = await getTab();

          if (!tab.id) {
            return;
          }

          chrome.tabs.sendMessage(tab.id, { message: 'RELOAD' });
        }}
      >
        このサイトをブロック
      </Button>
      <Button
        mt="md"
        variant="light"
        color="dark"
        size="xs"
        onClick={() => {
          chrome.runtime.openOptionsPage();
        }}
      >
        設定ページ
      </Button>
    </Box>
  );
}

export default App;
