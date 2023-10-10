import { Storage } from './storage.interface';

export class LocalStorage implements Storage<string> {
  public get(key: string): string | undefined {
    return window.localStorage.getItem(key) ?? undefined;
  }

  public set(key: string, value: string): void {
    window.localStorage.setItem(key, value);
  }

  public delete(key: string): void {
    window.localStorage.removeItem(key);
  }
}