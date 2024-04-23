import { Button, Box, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { getLocalStorage, setLocalStorage } from '../utils';

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

      const siteBlockEnabled = await getLocalStorage('SITE_BLOCK_ENABLED');

      setEnabled(siteBlockEnabled ?? true);
    })();
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
          const siteBlockUrlList = await getLocalStorage('SITE_BLOCK_URL_LIST');

          await setLocalStorage('SITE_BLOCK_URL_LIST', [
            ...(siteBlockUrlList ?? []),
            origin,
          ]);

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
