const topics = [
  "Errors and it's types",
  "Error debugging techniques",
  "Collections(Map and Set)",
  "Spead/Rest Operators",
  "this keyword",
  "Memory management",
  "Closures",
  "Web storage mechanisms(Cookies and Sessions)",
];

const userData = `{
  "id": 1,
  "name: "Alex Johnson",
  "email": "alex.johnson@example.com",
  "username": "alexj99",
  "isActive": true,
  "roles": ["user", "editor"]
}`;

function parseUserData(userJson) {
  try {
    let user = JSON.parse(userJson);
    if (!user) {
      throw new Error("Failed of parse the user data");
    }
    return user;
  } catch (error) {
    if (error instanceof TypeError) {
      console.error("Type mismatch:" + error.message);
      console.warn("Type mismatch:" + error.message);
      console.trace("Type mismatch:" + error.message);
    }
    if (error instanceof SyntaxError) {
      console.error("Invalid Json format:" + error.message);
      console.warn("Invalid Json format:" + error.message);
      console.trace("Invalid Json format:" + error.message);
    } else {
      console.error("Error:" + error.message);
      console.warn("Error:" + error.message);
      console.trace("Error:" + error.message);
    }
  } finally {
    console.log("Cleaning up .....");
  }
}

console.log(parseUserData(userData));

const users = [
  { id: 1, name: "Alice", email: "alice@example.com", isAdmin: true },
  { id: 2, name: "Bob", email: "bob@example.com", isAdmin: false },
  { id: 3, name: "Charlie", email: "charlie@example.com", isAdmin: false },
];

console.table(users);

// Collections : Map and set

/* Map
- Object where anything can be key
- Create: .set(key, value)
- Read: .get(key), .has(key)
- Update: .set(key, newValue)
- Delete: .delete(key), .clear()
*/

const map = new Map();

map.set("a", 1);
map.set("b", 2);
map.set("c", 3);

console.log(map);
console.log(map.get("a"));
// Expected output: 1

map.set("a", 97);

console.log(map.get("a"));
// Expected output: 97

console.log(map.size);
// Expected output: 3

map.delete("b");

console.log(map.size);
// Expected output: 2

/* Set
- Collection of unique values
- Create: .add()
- Read: .has(value)
- Update: .delete() and .add()
- Delete: .delete(), .clear()
*/

const inventory = new Set();

inventory.add("Laptop"); //Returns inventory object itself
inventory.add("Mobile");
inventory.add("Earbuds");
inventory.add("Earbuds"); //Ignored as it is already added
inventory.add("Speaker");

console.log(inventory); //Output: ('Laptop', 'Mobile', 'Earbuds', 'Speaker')
console.log(inventory.has("Laptop")); //Output: true
console.log(inventory.delete("Speaker")); //Output: true
console.log(inventory.delete("")); //Output: false as there is no '' to delete
console.log(inventory.clear()); //Output: undefined

//Spread and Rest Operators

/*Spread
- expand an iterable(like array or object)
- commonly used right side of assignment and function arguments
*/

const arr1 = [1, 2];
const arr2 = [...arr1, 3, 4, 5];
console.log(arr2); //Output: [1,2,3,4,5]

/*Rest
- condense multiple elements into a single array
- commonly used left side of assignment or function parameters
 */
function sum(...numbers) {
  return numbers.reduce((acc, current) => acc + current, 0);
}

console.log(sum(1, 2, 3, 4, 5)); //Output: 15

/* this keyword
- depends on how the  function is called(dynamic) for normal functions
- depends on where it is written(Lexical) for arrow functions(better for event listeners callback, async operations like  fetch, promise)
*/

const cart = {
  userName: "Subodh",
  items: ["mobile", "earphone", "pc"],
  getDescription: function () {
    // this points to cart object as it is the scope of this method
    console.log(typeof this.userName);
    this.items.forEach(function (item) {
      //this is window(for non-strict) or undefined(for strict) as it is a Plain function call without any binding
      console.log(typeof this.userName); // NO userName in window so undefined. this would have thrown error if strict mode was used
      console.log(`${this.userName} is purchasing ${item}.`);
    });
  },
};

cart.getDescription();

//Fix for the above problem -- Use arrow function which inherits scope from it's environment
const cart1 = {
  userName: "Samit",
  items: ["mobile", "earphone", "pc"],
  getDescription: function () {
    // this points to cart object as it is the scope of this method
    this.items.forEach((item) => {
      //this is Samit as it's scope is same as scope of it's outer env(getDescription) due to arrow function
      console.log(`${this.userName} is purchasing ${item}.`);
    });
  },
};

cart1.getDescription();

// Cookies vs Sessions vs LocalStorage

/*Local Storage
- Persistent Client Storage
- 5-10 MB
- Client Side only
- Persistent app settings, preferences
*/

//CREATE
localStorage.setItem("user", JSON.stringify({ name: "Subodh", age: 21 }));
//READ
const user = JSON.parse(localStorage.getItem("user"));
console.log(user.name);
//UPDATE
user.name = "Samit";
localStorage.setItem("user", JSON.stringify(user));
//DELETE
localStorage.removeItem("user"); //Removes 'user' key
localStorage.clear(); //Clears all keys in localStorage

/* Session Storage
- Temp Tab Scoped Storage
- 5MB
- Useful in cases such as multi-step form
- Client side only
 */

//CREATE
sessionStorage.setItem("token", "uk-123-session");
//READ
const token = sessionStorage.getItem("token");
console.log(token);
// UPDATE
sessionStorage.setItem("token", "us-124-sessionUpdate");
//DELETE
sessionStorage.removeItem("token");
sessionStorage.clear();

/*Cookies
- Server Readable and Expirable Storage(It has lifetime)
- 4KB
- Sent Automatially with every http req
- For authentication tokens, session id
*/

//CREATE - Lifetime of 7 days(Due to 7*24*60*60)
document.cookie =
  "username=Subodh; max-age=" +
  7 * 24 * 60 * 60 +
  "; path=/; SameSite=Strict; Secure";

//READ
console.log(document.cookie); //Output: "username=Subodh"

//UPDATE
document.cookie =
  "username=SubodhShah; max-age=" + 7 * 24 * 60 * 60 + "; path=/";

//DELETE - Just set max-age to 0
document.cookie = "username=SubodhShah; max-age=0; path=/";
