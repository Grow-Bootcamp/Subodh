/* --- Generics ---
 - Tools that pass type as parametere to make components dynamically reusable
 - Create safe, flexible code without resorting to type-erasing 'any' type
 - Use angle brackets(<T>) to imporarily hold the type parameter/info
 - TS automatically infers the intended type from the input
 - Functions: Capture parameter types to gurantee the identical types return after exec
 - Interfaces: Models Api structures or data wrappers where payload vary dynamically
 - Classes: Build reusable data structures such as container
 - Constraints: Restricting Types with extends
*/

function identity<T>(value: T): T {
  return value;
}

class Queue<T> {
  private data: T[] = [];
  getData(): T[] {
    return this.data;
  }
  push(item: T) {
    this.data.push(item);
  }
  pop(): T | undefined {
    return this.data.shift();
  }
}
const numberQueue = new Queue<number>();
numberQueue.push(1);
numberQueue.push(2);
numberQueue.push(3);

interface Pair<K, V> {
  key: K;
  value: V;
}

class Stack<T> {
  private items: T[] = [];
  push(item: T): void {
    this.items.push(item);
  }
  pop(): T | undefined {
    return this.items.pop();
  }
}

console.log("GENERICS FILE START");
console.log(identity(42), identity("hello"));
console.log(numberQueue.getData());
console.log({ key: 1, value: "John" } as Pair<number, string>);
console.table("GENERICS FILE END");
