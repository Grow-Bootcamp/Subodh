const http = require("node:http");
const { EventEmitter } = require("node:events");
const path = require("node:path");
const fs = require("node:fs");

const orderServide = new EventEmitter();

// const createOrder = (order) => {
//   // No error handling
//   console.log(
//     `Order${order.id} is created with the total price of ${order.totalPrice}`,
//   );
// };

const createOrder = (order) => {
  // Throw the error
  if (!order) throw Error(`[Empty order]: Add a proper order`);
  console.log(
    `Order${order.id} is created with the total price of ${order.totalPrice}`,
  );
};

//Listeners
// orderServide.on("orderAdded", createOrder); //Doesn't catch the error
try {
  // Catch the error
  orderServide.on("orderAdded", createOrder);
} catch (err) {
  console.log(err.message);
}

//Emitter
orderServide.emit("orderAdded", null); // Bound to throw error
// orderServide.emit("orderAdded", {
//   id: 1,
//   totalPrice: 12000,
//   products: [
//     "pc",
//     "mouse",
//     "keyboard",
//     "cpu",
//     "monitor",
//     "usb",
//     "graphics card",
//   ],
// });
