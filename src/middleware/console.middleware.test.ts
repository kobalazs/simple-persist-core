import { ConsoleMiddleware } from './console.middleware';
import mockConsole from 'jest-mock-console';

describe('ConsoleMiddleware', () => {
  it('should show message when initialized', () => {
    const restoreConsole = mockConsole();
    new ConsoleMiddleware('test');
    expect(console.log).toHaveBeenCalledWith(
      expect.stringMatching(/^📨 Init #[a-z0-9]{5}$/),
      'test',
    );
    restoreConsole();
  });

  it('should encode', () => {
    const restoreConsole = mockConsole();
    expect(new ConsoleMiddleware().encode({ foo: 'bar' })).toStrictEqual({ foo: 'bar' });
    expect(console.log).toHaveBeenCalledWith(
      expect.stringMatching(/^📥 Encoding #[a-z0-9]{5}$/),
      { foo: 'bar' },
    );
    restoreConsole();
  });

  it('should decode', () => {
    const restoreConsole = mockConsole();
    expect(new ConsoleMiddleware().decode('{"foo":"bar"}')).toStrictEqual('{"foo":"bar"}');
    expect(console.log).toHaveBeenCalledWith(
      expect.stringMatching(/^📤 Decoding #[a-z0-9]{5}$/),
      '{"foo":"bar"}',
    );
    restoreConsole();
  });
});
