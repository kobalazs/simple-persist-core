# SimplePersist Core
TypeScript property decorator for easy client-side persistance

## Installation
```
npm install @simple-persist/core
```

## Usage
Add `@Persist()` decorator to a class property

```
class Foo {
  @Persist() public bar;
}
```

## Options

### Custom key
By default SimplePersist saves your property to storage using its name as key. This can easily become an issue for identical property names:
```
class FooA {
  @Persist() public bar;
}
class FooB {
  @Persist() public bar; // Conflicts with FooA.bar!
}
```
To avoid conflict, use a custom key:
```
class FooA {
  @Persist({ key: 'FooA.bar' }) public bar;
}
class FooB {
  @Persist({ key: 'FooB.bar' }) public bar;
}
```

### Custom storage
By default SimplePersist uses `localStorage`. You can switch to `sessionStorage` by setting storage config:
```
class Foo {
  @Persist({ storage: PersistStorage.SessionStorage }) public bar;
}
```

## Caveats

### Types
This package can persist only scalars or objects & arrays containing scalars. (Basically only stuff that survives `JSON.parse(JSON.stringify(value))`.)

### Multi-instance use
Class instances are not observed, meaning the example below causes unexpected behavior:
```
class Foo {
  @Persist() public bar;
}
const foo1 = new Foo();
foo1.bar = 'baz';
const foo2 = new Foo();
console.log(foo2.bar); // will be 'baz'
```
SimplePersist in its current state is the best fit for singleton use.

## Collaboration

SimplePersist is an infant project but I'm willing to extend its functionality with time. Feel free to [open an issue](https://github.com/kobalazs/simple-persist/issues) with feature requests or [contribute](https://github.com/kobalazs/simple-persist/pulls)!
