const http = require("node:http");
const { EventEmitter } = require("node:events");
const path = require("node:path");
const fs = require("node:fs");

console.log(`This is synchronous op`);
let count = 1;

setTimeout(() => {
  console.log(`${count++} this is timer op 1`);
  process.nextTick(() => {
    console.log(`${count++} this is nextTick op 2`); // This will execute after setTimeout is finished as after every macro queue callback execution node checks the microtask queue for any callback in there
  });
}, 0);

process.nextTick(() => {
  console.log(`${count++} this is nextTick op 1`);
});

fs.readFile(__filename, () => {
  console.log(`${count++} this is io op 1`);
});

setImmediate(() => {
  console.log(`${count++} this is check op 1`);
});

Promise.resolve()
  .then(() => {
    console.log(`${count++} this is promise op 1`);
  })
  .catch((err) => {
    return err;
  });

/*
Output for the above code will be different each time due to the race condition between libuv thread pool and OS timer. Between timers and io , which one finished first is executed first. In most case file operations(io) takes longer than timer if timers are not explicitly set higher. So first three output are fixed but after that it depends on which one finish first and passes callback to the respective queue. 

…/WEEK3/week3day4 week3day4  ❯ node app.js
This is synchronous op
1 this is nextTick op 1
2 this is promise op 1
3 this is timer op 1
4 this is nextTick op 2
5 this is io op 1
6 this is check op 1

…/WEEK3/week3day4 week3day4  ❯ node app.js
This is synchronous op
1 this is nextTick op 1
2 this is promise op 1
3 this is io op 1
4 this is check op 1
5 this is timer op 1
6 this is nextTick op 2

…/WEEK3/week3day4 week3day4  ❯ node app.js
This is synchronous op
1 this is nextTick op 1
2 this is promise op 1
3 this is timer op 1
4 this is nextTick op 2
5 this is io op 1
6 this is check op 1

…/WEEK3/week3day4 week3day4  ❯ node app.js
This is synchronous op
1 this is nextTick op 1
2 this is promise op 1
3 this is io op 1
4 this is check op 1
5 this is timer op 1
6 this is nextTick op 2
*/
