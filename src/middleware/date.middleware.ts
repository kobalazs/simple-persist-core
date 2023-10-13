import { Middleware } from './middleware.interface';

export class DateMiddleware implements Middleware<Date, string> {
  public encode = (value: Date) => value.toISOString();
  public decode = (value: string | null | undefined) => (value ? new Date(value) : undefined);
}
