import {
  Group,
  Button,
  Container,
  Flex,
  TextInput,
  Table,
  Title,
  Text,
  Stack,
  Paper,
  Switch,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect } from 'react';

function Option() {
  const form = useForm<{ url: String; urlList: String[]; enabled: Boolean }>({
    initialValues: {
      url: '',
      urlList: [],
      enabled: true,
    },
    validate: {
      url: (url) =>
        /https?:\/\/[\w!?\/+\-_~;.,*&@#$%()'[\]]+/.test(`${url}`)
          ? null
          : '正しい形式のURLを入力してください',
    },
  });

  useEffect(() => {
    chrome.storage.local.get(
      ['SITE_BLOCK_URL_LIST', 'SITE_BLOCK_ENABLED'],
      (value) => {
        form.setFieldValue('urlList', value?.SITE_BLOCK_URL_LIST ?? []);
        form.setFieldValue('enabled', value?.SITE_BLOCK_ENABLED ?? true);
      },
    );
  }, []);

  return (
    <Container my="xl" size="sm">
      <Stack gap="xl">
        <Title size="h3">ブロックするサイトを設定</Title>
        <form
          onSubmit={form.onSubmit((values) => {
            const newUrlList = [...values.urlList, values.url];

            form.setFieldValue('urlList', newUrlList);
            form.setFieldValue('url', '');

            chrome.storage.local.set({ SITE_BLOCK_URL_LIST: newUrlList });
          })}
        >
          <Stack>
            <Group>
              <Switch
                label="サイトブロックを有効"
                {...form.getInputProps('enabled', { type: 'checkbox' })}
                onChange={(e) => {
                  const checked = e.target.checked;

                  form.setFieldValue('enabled', checked);

                  chrome.storage.local.set({ SITE_BLOCK_ENABLED: checked });
                }}
              />
            </Group>
            <Flex gap="md">
              <TextInput
                w="100%"
                {...form.getInputProps('url')}
                placeholder="https://ja.wikipedia.org"
              />
              <Button
                type="submit"
                styles={{
                  root: {
                    flexShrink: 0,
                  },
                }}
              >
                追加
              </Button>
            </Flex>
          </Stack>
        </form>
        {form.values.urlList.length > 0 ? (
          <Paper shadow="md">
            <Table striped stripedColor="gray.1" withRowBorders={false}>
              <Table.Tbody>
                {form.values.urlList.map((url, index) => (
                  <Table.Tr key={index}>
                    <Table.Td>
                      <Text
                        size="sm"
                        styles={{
                          root: {
                            wordBreak: 'break-word',
                          },
                        }}
                        c={form.values.enabled ? 'dark' : 'gray'}
                      >
                        {url}
                      </Text>
                    </Table.Td>
                    <Table.Td w={0}>
                      <Button
                        type="button"
                        styles={{
                          root: {
                            flexShrink: 0,
                          },
                        }}
                        variant="light"
                        color="dark"
                        size="sm"
                        onClick={() => {
                          const newUrlList = form.values.urlList.filter(
                            (_, i) => i !== index,
                          );

                          form.setFieldValue('urlList', newUrlList);

                          chrome.storage.local.set({
                            SITE_BLOCK_URL_LIST: newUrlList,
                          });
                        }}
                      >
                        削除
                      </Button>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Paper>
        ) : (
          <Text size="sm">ブロックするサイトがありません</Text>
        )}
      </Stack>
    </Container>
  );
}

export default Option;
