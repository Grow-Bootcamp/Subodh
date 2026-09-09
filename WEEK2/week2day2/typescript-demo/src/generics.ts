function identity<T>(value: T): T {
  return value;
}

class Box<T> {
  constructor(public value: T) {}
}

interface Pair<K, V> {
  key: K;
  value: V;
}

class Stack<T> {
  private items: T[] = [];
  push(item: T): void { this.items.push(item); }
  pop(): T | undefined { return this.items.pop(); }
}

console.log(identity(42), identity("hello"));
console.log(new Box(42).value);
console.log({ key: 1, value: "John" } as Pair<number, string>);
