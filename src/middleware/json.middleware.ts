import { Middleware } from './middleware.interface';

export class JsonMiddleware implements Middleware<any, string> {
  public onSet(value: any): string {
    return JSON.stringify(value);
  }

  public onGet(value: string | null | undefined): any | undefined {
    return value ? JSON.parse(value) : undefined;
  }
}
