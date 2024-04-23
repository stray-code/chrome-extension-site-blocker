import { LocalStorageItems } from '../types';

type Values<T> = T extends 'SITE_BLOCK_URL_LIST'
  ? LocalStorageItems['SITE_BLOCK_URL_LIST']
  : LocalStorageItems['SITE_BLOCK_ENABLED'];

export const setLocalStorage = async <T extends keyof LocalStorageItems>(
  key: T,
  values: Values<T>,
) => {
  chrome.storage.local.set({ [key]: values });
};
