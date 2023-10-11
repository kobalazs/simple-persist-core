import { Keygen } from './keygen';
import { JsonMiddleware, Middleware } from './middleware';
import { LocalStorage, Storage } from './storage';

export interface PersistConfig {
  keygens?: Array<Keygen>,
  middlewares?: Array<Middleware<any, any>>,
  storage?: Storage<any>,
}

const getKey = (defaultKey: string, keygens: Array<Keygen>) => {
  let key = defaultKey;
  keygens.forEach((keygen) => {
    key = keygen(key);
  });
  return key;
};

const setValue = (key: string, value: any, middlewares: Array<Middleware<any, any>>, storage: Storage<any>): void => {
  middlewares.forEach((middleware) => {
    value = middleware.encode(value);
  });
  storage.set(key, value);
};

const getValue = (key: string, middlewares: Array<Middleware<any, any>>, storage: Storage<any>): any => {
  let value = storage.get(key);
  middlewares.reverse().forEach((middleware) => {
    value = middleware.decode(value);
  });
  return value;
};

const deleteValue = (key: string, storage: Storage<any>): void => {
  storage.delete(key);
};

const defaultConfig: Required<PersistConfig> = {
  keygens: [],
  middlewares: [new JsonMiddleware()],
  storage: new LocalStorage(),
};

export const Persist = (config?: PersistConfig) => (target: any, memberName: string): void => {
  const keygens = config?.keygens ?? defaultConfig.keygens;
  const middlewares = config?.middlewares ?? defaultConfig.middlewares;
  const storage = config?.storage ?? defaultConfig.storage;

  const key = getKey(memberName, keygens);
  let value: any = target[memberName] ?? getValue(key, middlewares, storage);

  Object.defineProperty(target, memberName, {
    set: (newValue: any) => {
      if (newValue === undefined) {
        deleteValue(key, storage);
      } else if (newValue !== value) {
        setValue(key, newValue, middlewares, storage);
      }
      value = newValue;
    },
    get: () => value,
  });
};
