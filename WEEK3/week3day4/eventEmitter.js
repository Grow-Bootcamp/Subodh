const { EventEmitter } = require("node:events");

const userService = new EventEmitter();
const createUser = (user) => {
  console.log(`[Listener] Created User: ${user.name}(Id:${user.id})`);
};
// Listeners
userService.on("userCreated", createUser);

userService.once("userCreated", (user) => {
  console.log(`[Once] Welcome to ${user.name}`);
});

userService.on("userUpdated", (user) => {
  console.log(`[Listener] User ${user.name}(Id:${user.id}) is updated`);
});

userService.on("userDeleted", (user) => {
  console.log(`[Listener] User ${user.name}(Id:${user.id}) is removed`);
});

// Emitters
userService.emit("userCreated", { name: "Subodh", id: 1 });
userService.emit("userDeleted", { name: "Samit", id: 2 });
userService.emit("userUpdated", { name: "Sugam", id: 3 });

// Remove event
userService.removeListener("userCreated", createUser);
//After listener is removed
userService.on("userCreated", createUser); //WIll NOT RUN
userService.on("userCreated", createUser); //WIll NOT RUN
