import { LocalStorage } from './local.storage';

describe('LocalStorage', () => {
  const storage = new LocalStorage();
  let localStorageGetItemSpy: jest.SpyInstance;
  let localStorageSetItemSpy: jest.SpyInstance;
  let localStorageRemoveItemSpy: jest.SpyInstance;

  beforeEach(() => {
    // https://github.com/jestjs/jest/issues/6798#issuecomment-440988627
    localStorageGetItemSpy = jest.spyOn(window.localStorage.__proto__, 'getItem');
    localStorageSetItemSpy = jest.spyOn(window.localStorage.__proto__, 'setItem');
    localStorageRemoveItemSpy = jest.spyOn(window.localStorage.__proto__, 'removeItem');
  });

  it('should get value', () => {
    expect(storage.get('foo')).toBeUndefined();
    expect(localStorageGetItemSpy).toHaveBeenCalled();
  });

  it('should set value', () => {
    storage.set('foo', 'bar');
    expect(localStorageSetItemSpy).toHaveBeenCalledWith('foo', 'bar');
    expect(storage.get('foo')).toBe('bar');
  });

  it('should remove key from storage if value is undefined', () => {
    storage.set('foo', 'bar');
    storage.delete('foo');
    expect(localStorageRemoveItemSpy).toHaveBeenCalledWith('foo');
    expect(storage.get('foo')).toBeUndefined();
  });
});
