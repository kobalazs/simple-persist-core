import { JsonMiddleware } from './json.middleware';

describe('JsonMiddleware', () => {
  const middleware = new JsonMiddleware();

  it('should transform when setting', () => {
    expect(middleware.onSet(undefined)).toBeUndefined();
    expect(middleware.onSet(null)).toBe('null');
    expect(middleware.onSet(1)).toBe('1');
    expect(middleware.onSet('foo')).toBe('"foo"');
    expect(middleware.onSet({ foo: 'bar' })).toBe('{"foo":"bar"}');
  });

  it('should transform when getting', () => {
    expect(middleware.onGet(undefined)).toBeUndefined();
    expect(middleware.onGet(null)).toBeUndefined();
    expect(middleware.onGet('null')).toBeNull();
    expect(middleware.onGet('1')).toBe(1);
    expect(middleware.onGet('"foo"')).toBe('foo');
    expect(middleware.onGet('{"foo":"bar"}')).toStrictEqual({ foo: 'bar' });
  });
});
