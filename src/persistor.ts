import { Keygen } from './keygen';
import { Middleware } from './middleware';

export interface PersistorConfig {
  keygens: { 0: Keygen } & Array<Keygen>,
  middlewares: Array<Middleware<any, any>>,
  storage: Storage,
}

export class Persistor<T> {
  private key: string;
  private middlewares: Array<Middleware<any, any>>;
  private storage: Storage;

  public constructor(config: PersistorConfig) {
    this.key = this.generateKey(config.keygens);
    this.middlewares = config.middlewares;
    this.storage = config.storage;
  }

  private generateKey = (keygens: Array<Keygen>): string => {
    let key = '';
    keygens.forEach((keygen) => {
      key = keygen(key);
    });
    return key;
  };
  
  public set = (value: T): void => {
    this.middlewares.forEach((middleware) => {
      value = middleware.encode(value);
    });
    this.storage.setItem(this.key, value as string);
  };
  
  public get = (): T => {
    let value = this.storage.getItem(this.key);
    [...this.middlewares].reverse().forEach((middleware) => {
      value = middleware.decode(value);
    });
    return value as T;
  };
  
  public delete = (): void => {
    this.storage.removeItem(this.key);
  };
}
