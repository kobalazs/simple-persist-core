import { Storage } from './storage.interface';

export class SessionStorage implements Storage<string> {
  public get(key: string): string | undefined {
    return window.sessionStorage.getItem(key) ?? undefined;
  }

  public set(key: string, value: string): void {
    window.sessionStorage.setItem(key, value);
  }

  public delete(key: string): void {
    window.sessionStorage.removeItem(key);
  }
}