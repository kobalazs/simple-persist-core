import { SessionStorage } from './session.storage';

describe('SessionStorage', () => {
  const storage = new SessionStorage();
  let sessionStorageGetItemSpy: jest.SpyInstance;
  let sessionStorageSetItemSpy: jest.SpyInstance;
  let sessionStorageRemoveItemSpy: jest.SpyInstance;

  beforeEach(() => {
    // https://github.com/jestjs/jest/issues/6798#issuecomment-440988627
    sessionStorageGetItemSpy = jest.spyOn(window.sessionStorage.__proto__, 'getItem');
    sessionStorageSetItemSpy = jest.spyOn(window.sessionStorage.__proto__, 'setItem');
    sessionStorageRemoveItemSpy = jest.spyOn(window.sessionStorage.__proto__, 'removeItem');
  });

  it('should get value', () => {
    expect(storage.get('foo')).toBeUndefined();
    expect(sessionStorageGetItemSpy).toHaveBeenCalled();
  });

  it('should set value', () => {
    storage.set('foo', 'bar');
    expect(sessionStorageSetItemSpy).toHaveBeenCalledWith('foo', 'bar');
    expect(storage.get('foo')).toBe('bar');
  });

  it('should remove key from storage if value is undefined', () => {
    storage.set('foo', 'bar');
    storage.delete('foo');
    expect(sessionStorageRemoveItemSpy).toHaveBeenCalledWith('foo');
    expect(storage.get('foo')).toBeUndefined();
  });
});
