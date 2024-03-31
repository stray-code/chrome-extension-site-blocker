import { Button, Box, Text } from '@mantine/core';
import { useEffect, useState } from 'react';

function App() {
  const [origin, setOrigin] = useState('');
  const [enabled, setEnabled] = useState(true);

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

    chrome.storage.local.get(['SITE_BLOCK_ENABLED'], (value) => {
      setEnabled(value?.SITE_BLOCK_ENABLED ?? true);
    });
  }, []);

  return (
    <Box p="md">
      <Button
        type="button"
        size="xs"
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
      {!enabled && (
        <Text mt="md" size="xs" c="red">
          サイトブロックが無効です
        </Text>
      )}
    </Box>
  );
}

export default App;
