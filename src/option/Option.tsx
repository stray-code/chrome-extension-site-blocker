import {
  Button,
  Container,
  Flex,
  Group,
  Paper,
  Stack,
  Switch,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { getLocalStorage, setLocalStorage } from "../utils";

function Option() {
  const form = useForm<{ url: string; urlList: string[]; enabled: boolean }>({
    initialValues: {
      url: "",
      urlList: [],
      enabled: true,
    },
    validate: {
      url: (url) =>
        /https?:\/\/[\w!?/+\-_~;.,*&@#$%()'[\]]+/.test(`${url}`)
          ? null
          : "正しい形式のURLを入力してください",
    },
  });

  useEffect(() => {
    (async () => {
      const siteBlockUrlList = await getLocalStorage("SITE_BLOCK_URL_LIST");
      const siteBlockEnabled = await getLocalStorage("SITE_BLOCK_ENABLED");

      form.setFieldValue("urlList", siteBlockUrlList ?? []);
      form.setFieldValue("enabled", siteBlockEnabled ?? true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container my="xl" size="sm">
      <Stack gap="xl">
        <Title size="h3">ブロックするサイトを設定</Title>
        <form
          onSubmit={form.onSubmit((values) => {
            const newUrlList = [...values.urlList, values.url];

            form.setFieldValue("urlList", newUrlList);
            form.setFieldValue("url", "");

            setLocalStorage("SITE_BLOCK_URL_LIST", newUrlList);
          })}
        >
          <Stack>
            <Group>
              <Switch
                label="サイトブロックを有効"
                {...form.getInputProps("enabled", { type: "checkbox" })}
                onChange={(e) => {
                  const checked = e.target.checked;

                  form.setFieldValue("enabled", checked);

                  setLocalStorage("SITE_BLOCK_ENABLED", checked);
                }}
              />
            </Group>
            <Flex gap="md">
              <TextInput
                w="100%"
                {...form.getInputProps("url")}
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
                            wordBreak: "break-word",
                          },
                        }}
                        c={form.values.enabled ? "dark" : "gray"}
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

                          form.setFieldValue("urlList", newUrlList);

                          setLocalStorage("SITE_BLOCK_URL_LIST", newUrlList);
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
          <Text size="sm">ブロックするサイトが登録されていません</Text>
        )}
      </Stack>
    </Container>
  );
}

export default Option;
