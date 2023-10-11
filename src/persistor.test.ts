import { Persistor } from './persistor';
import { LocalStorage, Storage } from './storage';

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

  it('can run keygens', () => {});

  it('can run middlewares', () => {});
});
