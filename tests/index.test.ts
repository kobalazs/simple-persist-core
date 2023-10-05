/* eslint-disable no-proto */

import { Persist } from '../src/index';

// https://github.com/jestjs/jest/issues/6798#issuecomment-440988627
const localStorageGetItemSpy = jest.spyOn(window.localStorage.__proto__, 'getItem');
const localStorageSetItemSpy = jest.spyOn(window.localStorage.__proto__, 'setItem');

class TestBed {
  @Persist() public foo: unknown;
}

describe('Persist', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should load value', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const testBed = new TestBed();
    expect(localStorageGetItemSpy).toHaveBeenCalled();
  });

  it('should persist value', () => {
    (new TestBed()).foo = 'bar';
    expect(localStorageSetItemSpy).toHaveBeenCalledWith('foo', '"bar"');
  });
});
