export const PersistStorage = {
  LocalStorage: 'localStorage',
  SessionStorage: 'sessionStorage',
} as const;
type PersistStorageKey = (typeof PersistStorage)[keyof typeof PersistStorage];

export interface PersistConfig {
  key?: string,
  storage?: PersistStorageKey
}

function getValueFromStorage(storage: Storage, key: string): any {
  const item = storage.getItem(key);
  return item ? JSON.parse(item) : undefined;
}

export const Persist = (config?: PersistConfig) => (target: any, memberName: string): void => {
  const storage = window[config?.storage ?? PersistStorage.LocalStorage];
  const key = config?.key ?? memberName;
  let value: any = target[memberName] ?? getValueFromStorage(storage, key);

  Object.defineProperty(target, memberName, {
    set: (newValue: any) => {
      if (newValue === undefined) {
        storage.removeItem(key);
      } else {
        storage.setItem(key, JSON.stringify(newValue));
      }
      value = newValue;
    },
    get: () => value,
  });
};
