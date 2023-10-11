import 'jest-extended';
import { Persistor } from './persistor';
import { LocalStorage, Storage } from './storage';
import { Middleware } from './middleware';

describe('Persistor', () => {
  let storage: Storage<any>;
  let storageSetSpy: jest.SpyInstance;
  let storageGetSpy: jest.SpyInstance;
  let storageDeleteSpy: jest.SpyInstance;

  beforeEach(() => {
    storage = new LocalStorage();
    storageSetSpy = jest.spyOn(storage, 'set');
    storageGetSpy = jest.spyOn(storage, 'get');
    storageDeleteSpy = jest.spyOn(storage, 'delete');
  });

  it('can read from storage', () => {
    const persistor = new Persistor({ keygens: [() => 'foo'], middlewares: [], storage });
    storageGetSpy.mockReturnValueOnce('bar');
    expect(persistor.get()).toBe('bar');
    expect(storageGetSpy).toHaveBeenCalledWith('foo');
    storageGetSpy.mockReturnValueOnce(undefined);
    expect(persistor.get()).toBeUndefined();
  });

  it('can write to storage', () => {
    const persistor = new Persistor({ keygens: [() => 'foo'], middlewares: [], storage });
    persistor.set('bar');
    expect(storageSetSpy).toHaveBeenCalledWith('foo', 'bar');
    persistor.set(undefined);
    expect(storageSetSpy).toHaveBeenCalledWith('foo', undefined);
  });

  it('can delete from storage', () => {
    const persistor = new Persistor({ keygens: [() => 'foo'], middlewares: [], storage });
    persistor.delete();
    expect(storageDeleteSpy).toHaveBeenCalledWith('foo');
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
    expect(storageGetSpy).toHaveBeenCalledWith('foo_keygen1_keygen2');
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

    expect(persistor.get()).toBe(undefined);
    expect(spyDecode2).toHaveBeenCalledBefore(spyDecode1);
    jest.clearAllMocks();

    persistor.set('bar');
    expect(storageSetSpy).toHaveBeenCalledWith('foo', 'bar_encoder1_encoder2');
    expect(spyEncode1).toHaveBeenCalledBefore(spyEncode2);
    jest.clearAllMocks();

    expect(persistor.get()).toBe('bar_encoder1_encoder2_decoder2_decoder1');
    expect(spyDecode2).toHaveBeenCalledBefore(spyDecode1);
  });
});
