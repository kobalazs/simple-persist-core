/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/naming-convention */

export const Storage = {
  LocalStorage: 'localStorage',
  SessionStorage: 'sessionStorage',
} as const;
type StorageKey = (typeof Storage)[keyof typeof Storage];

export const Persist =
  (key?: string, storage: StorageKey = Storage.LocalStorage) =>
  (target: any, memberName: string) => {
    if (key === undefined) {
      key = memberName;
    }

    let currentValue: any = target[memberName] ?? JSON.parse(window[storage].getItem(key) ?? 'null');

    Object.defineProperty(target, memberName, {
      set: (newValue: any) => {
        window[storage].setItem(key as string, JSON.stringify(newValue));
        currentValue = newValue;
      },
      get: () => currentValue,
    });
  };
