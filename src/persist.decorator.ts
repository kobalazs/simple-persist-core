import { Keygen } from './keygen';
import { JsonMiddleware, Middleware } from './middleware';
import { Persistor } from './persistor';

export interface PersistConfig {
  keygens?: Array<Keygen>,
  middlewares?: Array<Middleware<any, any>>,
  storage?: Storage,
}

const defaultConfig: Required<PersistConfig> = {
  keygens: [],
  middlewares: [new JsonMiddleware()],
  storage: window.localStorage,
};

export const Persist = (config?: PersistConfig) => (target: any, memberName: string): void => {
  const persistor = new Persistor({
    keygens: [() => memberName, ...(config?.keygens ?? defaultConfig.keygens)],
    middlewares: config?.middlewares ?? defaultConfig.middlewares,
    storage: config?.storage ?? defaultConfig.storage,
  });

  let value: any = target[memberName] ?? persistor.get();

  Object.defineProperty(target, memberName, {
    set: (newValue: any) => {
      if (newValue === undefined) {
        persistor.delete();
      } else if (newValue !== value) {
        persistor.set(newValue);
      }
      value = newValue;
    },
    get: () => value,
  });
};
