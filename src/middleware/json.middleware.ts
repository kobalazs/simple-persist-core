import { Middleware } from './middleware.interface';

export class JsonMiddleware implements Middleware<any, string> {
  public encode(value: any): string {
    return JSON.stringify(value);
  }

  public decode(value: string | null | undefined): any | null | undefined {
    return value && JSON.parse(value);
  }
}
