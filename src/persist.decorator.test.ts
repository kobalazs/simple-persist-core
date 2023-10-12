import { Persist } from './persist.decorator';

// https://github.com/jestjs/jest/issues/6798#issuecomment-440988627
const localStorageGetItemSpy = jest.spyOn(window.localStorage.__proto__, 'getItem');
const localStorageSetItemSpy = jest.spyOn(window.localStorage.__proto__, 'setItem');
const localStorageRemoveItemSpy = jest.spyOn(window.localStorage.__proto__, 'removeItem');

class TestBed {
  @Persist() public foo: unknown;
}

describe('@Persist()', () => {
  let testBed: TestBed;

  beforeEach(() => {
    testBed = new TestBed();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should load value', () => {
    expect(localStorageGetItemSpy).toHaveBeenCalled();
    expect(testBed.foo).toBeUndefined();
  });

  it('should persist scalar value', () => {
    testBed.foo = 'bar';
    expect(localStorageSetItemSpy).toHaveBeenCalledWith('foo', '"bar"');
    expect(testBed.foo).toBe('bar');
  });

  it('should remove key from storage if value is undefined', () => {
    testBed.foo = undefined;
    expect(localStorageRemoveItemSpy).toHaveBeenCalledWith('foo');
    expect(testBed.foo).toBeUndefined();
  });
});
