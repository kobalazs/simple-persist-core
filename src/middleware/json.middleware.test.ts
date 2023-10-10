import { JsonMiddleware } from './json.middleware';

describe('JsonMiddleware', () => {
  const middleware = new JsonMiddleware();

  it('should encode', () => {
    expect(middleware.encode(undefined)).toBeUndefined();
    expect(middleware.encode(null)).toBe('null');
    expect(middleware.encode(1)).toBe('1');
    expect(middleware.encode('foo')).toBe('"foo"');
    expect(middleware.encode({ foo: 'bar' })).toBe('{"foo":"bar"}');
  });

  it('should decode', () => {
    expect(middleware.decode(undefined)).toBeUndefined();
    expect(middleware.decode(null)).toBeUndefined();
    expect(middleware.decode('null')).toBeNull();
    expect(middleware.decode('1')).toBe(1);
    expect(middleware.decode('"foo"')).toBe('foo');
    expect(middleware.decode('{"foo":"bar"}')).toStrictEqual({ foo: 'bar' });
  });
});
