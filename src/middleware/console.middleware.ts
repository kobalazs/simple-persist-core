import { Middleware } from './middleware.interface';

export class ConsoleMiddleware implements Middleware<any, any> {
  private _id = (Math.random() + 1).toString(36).substring(2, 7);

  public constructor(info?: any) {
    console.log(`📨 Init #${this._id}`, info);
  }

  public encode = (value: any) => {
    console.log(`📥 Encoding #${this._id}`, value);
    return value;
  };

  public decode = (value: any) => {
    console.log(`📤 Decoding #${this._id}`, value);
    return value;
  };
}
