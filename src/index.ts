/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/naming-convention */

export const PersistStorage = {
  LocalStorage: 'localStorage',
  SessionStorage: 'sessionStorage',
} as const;
type PersistStorageKey = (typeof PersistStorage)[keyof typeof PersistStorage];

export interface PersistConfig {
  key?: string,
  storage: PersistStorageKey
}

export const Persist = (config: PersistConfig) => ((target: any, memberName: string) => {
  const storage = window[config.storage];
  const key = config.key ?? memberName;
  let value: any = target[memberName] ?? JSON.parse(storage.getItem(key) ?? 'null');

  Object.defineProperty(target, memberName, {
    set: (newValue: any) => {
      storage.setItem(key as string, JSON.stringify(newValue));
      value = newValue;
    },
    get: () => value,
  });
});
