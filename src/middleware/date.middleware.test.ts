import { DateMiddleware } from './date.middleware';

describe('DateMiddleware', () => {
  const middleware = new DateMiddleware();

  it('should encode', () => {
    expect(middleware.encode(new Date('1985-05-31T12:00:00.000+02:00'))).toBe('1985-05-31T10:00:00.000Z');
  });

  it('should decode', () => {
    expect(middleware.decode('')).toBeUndefined();
    expect(middleware.decode(null)).toBeUndefined();
    expect(middleware.decode(undefined)).toBeUndefined();
    expect(middleware.decode('1985-05-31T10:00:00.000Z')?.toISOString()).toBe('1985-05-31T10:00:00.000Z');
  });
});
