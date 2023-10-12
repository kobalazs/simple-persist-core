import 'jest-extended';
import { Persistor } from './persistor';
import { Middleware } from './middleware';

describe('Persistor', () => {
  const storage: Storage = window.localStorage;
  let storageSetItemSpy: jest.SpyInstance;
  let storageGetItemSpy: jest.SpyInstance;
  let storageRemoveItemSpy: jest.SpyInstance;

  beforeEach(() => {
    storage.clear();
    // https://github.com/jestjs/jest/issues/6798#issuecomment-440988627
    storageGetItemSpy = jest.spyOn(window.localStorage.__proto__, 'getItem');
    storageSetItemSpy = jest.spyOn(window.localStorage.__proto__, 'setItem');
    storageRemoveItemSpy = jest.spyOn(window.localStorage.__proto__, 'removeItem');
  });

  it('can read from storage', () => {
    const persistor = new Persistor({ keygens: [() => 'foo'], middlewares: [], storage });
    storageGetItemSpy.mockReturnValueOnce('bar');
    expect(persistor.get()).toBe('bar');
    expect(storageGetItemSpy).toHaveBeenCalledWith('foo');
    storageGetItemSpy.mockReturnValueOnce(undefined);
    expect(persistor.get()).toBeUndefined();
  });

  it('can write to storage', () => {
    const persistor = new Persistor({ keygens: [() => 'foo'], middlewares: [], storage });
    persistor.set('bar');
    expect(storageSetItemSpy).toHaveBeenCalledWith('foo', 'bar');
    persistor.set(undefined);
    expect(storageSetItemSpy).toHaveBeenCalledWith('foo', undefined);
  });

  it('can delete from storage', () => {
    const persistor = new Persistor({ keygens: [() => 'foo'], middlewares: [], storage });
    persistor.delete();
    expect(storageRemoveItemSpy).toHaveBeenCalledWith('foo');
  });

  it('can run keygens', () => {
    const keygen1 = jest.fn().mockImplementation((value) => `${value}_keygen1`);
    const keygen2 = jest.fn().mockImplementation((value) => `${value}_keygen2`);
    const persistor = new Persistor({ keygens: [
      () => 'foo',
      keygen1,
      keygen2,
    ], middlewares: [], storage });
    expect(keygen1).toHaveBeenCalledBefore(keygen2);
    persistor.get();
    expect(storageGetItemSpy).toHaveBeenCalledWith('foo_keygen1_keygen2');
  });

  it('can run middlewares', () => {
    const middleware1: Middleware<string, string> = {
      encode: (value) => `${value}_encoder1`,
      decode: (value) => value && `${value}_decoder1`,
    };
    const spyEncode1 = jest.spyOn(middleware1, 'encode');
    const spyDecode1 = jest.spyOn(middleware1, 'decode');

    const middleware2: Middleware<string, string> = {
      encode: (value) => `${value}_encoder2`,
      decode: (value) => value && `${value}_decoder2`,
    };
    const spyEncode2 = jest.spyOn(middleware2, 'encode');
    const spyDecode2 = jest.spyOn(middleware2, 'decode');
  
    const persistor = new Persistor({ keygens: [() => 'foo'], middlewares: [
      middleware1,
      middleware2,
    ], storage });

    expect(persistor.get()).toBeNull();
    expect(spyDecode2).toHaveBeenCalledBefore(spyDecode1);
    jest.clearAllMocks();

    persistor.set('bar');
    expect(storageSetItemSpy).toHaveBeenCalledWith('foo', 'bar_encoder1_encoder2');
    expect(spyEncode1).toHaveBeenCalledBefore(spyEncode2);
    jest.clearAllMocks();

    expect(persistor.get()).toBe('bar_encoder1_encoder2_decoder2_decoder1');
    expect(spyDecode2).toHaveBeenCalledBefore(spyDecode1);
  });
});
