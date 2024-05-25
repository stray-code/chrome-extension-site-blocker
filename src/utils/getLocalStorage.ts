import type { LocalStorageItems } from "../types";

type Return<T> = T extends "SITE_BLOCK_URL_LIST"
  ? LocalStorageItems["SITE_BLOCK_URL_LIST"]
  : LocalStorageItems["SITE_BLOCK_ENABLED"];

export const getLocalStorage = async <T extends keyof LocalStorageItems>(
  key: T,
): Promise<Return<T> | undefined> => {
  return chrome.storage.local.get(key).then((value) => value[key]);
};
