# SimplePersist Core
TypeScript property decorator for easy client-side persistance

#### Table of Contents
* [Installation](#installation)
* [Quick start](#quick-start)
* [Caveats](#caveats)
  * [Multi-instance use](#multi-instance-use)
  * [Types](#types)
  * [Storage](#storage)
* [Advanced use](#advanced-use)
  * [Imperative syntax](#imperative-syntax)
  * [Keygens](#keygens)
  * [Middlewares](#middlewares)
  * [Storages](#storages)
* [Extensions](#extensions)
* [Collaboration](#collaboration)

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
> **Note:** For more features (like persisting RxJS Subjects) check out our [extensions](#extensions)!

## Caveats

### Multi-instance use
SimplePersist is the best fit for singleton use. Class instances are not observed, meaning multiple instances of the same class can cause unexpected behavior:
```ts
const foo1 = new Foo();
foo1.bar = 'baz';

const foo2 = new Foo();
console.log(foo2.bar); // Displays 'baz'.
```
You can overcome this by [writing your own keygen](#keygens).

### Types
By default SimplePersist can only persist scalars, as well as objects and arrays containing scalars. (Basically stuff that survives `JSON.parse(JSON.stringify(value))`.) You can overcome this by [writing your own middleware](#middlewares) to serialize / rehydrate your objects.
### Storage
SimplePersist uses the native `localStorage` by default. You can switch to `sessionStorage` from the global scope like so:
```ts
class Foo {
  @Persist({ storage: sessionStorage }) public bar;
}
```
You can [write your own storage](#storages) too!

## Advanced use

### Imperative syntax
For imperative programming use the `Persistor` class:
```ts
import { Persistor, JsonMiddleware } from '@simple-persist/core';

const persistor = new Persistor<string>({
  keygens: [() => 'foo'],
  middlewares: [new JsonMiddleware()],
  storage: localStorage,
});

persistor.set('bar'); // Saves 'bar' as the value of 'foo' to storage.
persistor.get(); // Loads the value of 'foo' from storage.
persistor.delete(); // Deletes 'foo' from storage.
```
> **Note:**  All configuration options of `Persistor` are optionally available for `@Persist()` as well.
> Use the same syntax to define custom keygens, middlewares or storage for your decorator!

### Keygens
By default `@Persist()` uses property names as key. This can easily become an issue:
```ts
class FooA {
  @Persist()
  public bar; // Persists as 'bar'.
}
class FooB {
  @Persist()
  public bar; // Persists as 'bar' too, which creates conflict. :(
}
```
You can use a custom *keygen* to overcome this issue. Keygens are functions that modify the default key:
```ts
class FooA {
  @Persist({ keygens: [() => 'FooA.bar'] })
  public bar; // Persists as 'FooA.bar'.
}
class FooB {
  @Persist({ keygens: [() => 'FooB.bar'] })
  public bar; // Persists as 'FooB.bar'.
}
```
Alternatively:
```ts
class FooA {
  @Persist({ keygens: [(key) => `FooA.${key}`] })
  public bar; // Persists as 'FooA.bar'.
}
class FooB {
  @Persist({ keygens: [(key) => `FooB.${key}`] })
  public bar; // Persists as 'FooB.bar'.
}
```
> **Note:**  If you set up multiple keygens, they will be chained by SimplePersist.

You can write your own keygen by implementing the `Keygen` interface.

### Middlewares
SimplePersist can encode values before saving them to storage. This happens by utilizing a *middleware*. Middlewares consist of two methods: `encode` and `decode`.

As an example, take a look at the built-in `JsonMiddleware`. (This is the default middleware when using `@Persist()`.)
```ts
import { Middleware } from '@simple-persist/core';

export class JsonMiddleware implements Middleware<any, string> {
  public encode(value: any): string {
    return JSON.stringify(value);
  }

  public decode(value: string | null | undefined): any | null | undefined {
    return value && JSON.parse(value);
  }
}
```
These methods are run automatically by SimplePersist. `encode()` will be called before saving to storage, `decode()` will be called after loading from storage.

> **Note:**  If you set up multiple middlewares, encoders will be chained in the defined order, decoders in reverse order.

Write your own middleware by implementing the `Middleware` interface or use an [extension](#extensions)!

### Storages
The native `localStorage` and `sessionStorage` (from the global scope) are compatible with SimplePersist by design:
```ts
class Foo {
  @Persist({ storage: sessionStorage }) public bar;
}
```

You can also write your own storage wrapper by implementing the native `Storage` interface.

## Extensions
We have you covered for some common use cases with ready-to-use extensions. Check them out and [let me know](https://github.com/kobalazs) if you miss anything!

| Name<br>Package  | Description  |
|:---|:---|
| **@PersistSubject()**<br>[@simple&#8209;persist/rxjs](https://www.npmjs.com/package/@simple-persist/rxjs)  | Decorator for handling RxJS Subjects & BehaviorSubjects.  |
| **ConsoleMiddleware**<br>@simple&#8209;persist/core  | Middleware for displaying values on the console. Useful for debuging.  |
| **CookieStorage**<br>[cookie&#8209;storage](https://www.npmjs.com/package/cookie-storage)  | Storage interface for cookies.  |
| **DateMiddleware**<br>@simple&#8209;persist/core  | Middleware for handling JavaScript Date objects.  |
| **JsonMiddleware**<br>@simple&#8209;persist/core  | Middleware for encoding to/from JSON. (Default when using `@Persist()`.) |

## Collaboration

Feel free to [suggest features](https://github.com/kobalazs), [open issues](https://github.com/kobalazs/simple-persist/issues), or [contribute](https://github.com/kobalazs/simple-persist/pulls)! Also let me know about your extensions, so I can link them in this document.

