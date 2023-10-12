# SimplePersist Core
TypeScript property decorator for easy client-side persistance

## Installation
```bash
npm install @simple-persist/core
```

## Quick start
Add `@Persist()` decorator to any class property:
```ts
import { Persist } from '@simple-persist/core';

class Foo {
  @Persist() public bar;
}
```

## Caveats

### Multi-instance use
SimplePersist is the best fit for singleton use. Class instances are not observed, meaning multiple instances of the same class can cause unexpected behavior:
```ts
const foo1 = new Foo();
foo1.bar = 'baz';

const foo2 = new Foo();
console.log(foo2.bar); // Will be 'baz'.
```
You can overcome this by [writing your own keygen](#keygens).

### Types
By default SimplePersist can only persist scalars, as well as objects and arrays containing scalars. (Basically stuff that survives `JSON.parse(JSON.stringify(value))`.) You can overcome this by [writing your own middleware](#middlewares).
### Storage
By default SimplePersist uses local storage. You can switch to session storage like so:
```ts
class Foo {
  @Persist({ storage: sessionStorage }) public bar;
}
```
You can [write your own storage](#storages) too!

## Advanced use

### Alternate syntax
If decorators are not suitable, you can fall back to the underlying `Persistor` class instead:
```ts
import { Persistor } from '@simple-persist/core';
import { JsonMiddleware } from '@simple-persist/core/middleware';

const persistor = new Persistor<string>({
  keygens: [() => 'foo'],
  middlewares: [new JsonMiddleware()],
  storage: localStorage,
});

persistor.set('bar'); // Saves 'foo': 'bar' to storage.
persistor.get(); // Loads 'foo' from storage.
persistor.delete(); // Deletes 'foo' from storage.
```
> **Note:**  All configuration options of `Persistor` are optionally available for `@Persist()` as well.
> Use the same syntax to define custom keygens, middlewares or storage for your decorator!

### Keygens
By default `@Persist()` uses property names as key. This can easily become an issue:
```ts
class FooA {
  @Persist() public bar; // Persists as 'bar'.
}
class FooB {
  @Persist() public bar; // Persists as 'bar' too, which creates conflict. :(
}
```
You can use a custom *keygen* to overcome this issue. Keygens are functions that modify the default key:
```ts
class FooA {
  @Persist({ keygens: [() => 'FooA.bar'] }) public bar; // Persists as 'FooA.bar'.
}
class FooB {
  @Persist({ keygens: [() => 'FooB.bar'] }) public bar; // Persists as 'FooB.bar'.
}
```
Alternatively:
```ts
class FooA {
  @Persist({ keygens: [(key) => `FooA.${key}`] }) public bar; // Persists as 'FooA.bar'.
}
class FooB {
  @Persist({ keygens: [(key) => `FooB.${key}`] }) public bar; // Persists as 'FooB.bar'.
}
```
When you define multiple keygens they will be chained by SimplePersist.

### Middlewares
By default `@Persist()` converts values to JSON before saving to storage. This happens by utilizing a *middleware*. Middlewares consist of two methods: `encode` and `decode`. These methods are automatically run by SimplePersist. Encode will be called before saving to storage, decode will be called after loading from storage.

> **Note:**  If you set up multiple middlewares, encoders will be called in the defined order, decoders will be called in reverse order.

Take a look at the built-in `JsonMiddleware` as an example:
```ts
import { Middleware } from '@simple-persist/core/middleware';

export class JsonMiddleware implements Middleware<any, string> {
  public encode(value: any): string {
    return JSON.stringify(value);
  }

  public decode(value: string | null | undefined): any | null | undefined {
    return value && JSON.parse(value);
  }
}
```

You can write your own middleware by implementing the `Middleware` interface from `@simple-persist/middleware`.

### Storages
You can choose between local storage and session storage. You can also write your own storage wrapper by implementing the native `Storage` interface.

## Collaboration

SimplePersist is an infant project but I'm planning to extend its functionality with time. Feel free to [open an issue](https://github.com/kobalazs/simple-persist/issues) or [contribute](https://github.com/kobalazs/simple-persist/pulls)!
