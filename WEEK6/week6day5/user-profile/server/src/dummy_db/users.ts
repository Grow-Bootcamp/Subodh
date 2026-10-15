import bcrypt from "bcrypt";

//Stored in Database
export const users = [
  {
    id: 1,
    name: "Subodh",
    email: "subodhshah@gmail.com",
    passwordHash: await bcrypt.hash("adminsubodh", 10),
    role: "admin",
  },
  {
    id: 2,
    name: "Bob",
    email: "bob@gmail.com",
    passwordHash: await bcrypt.hash("userbob123", 10),
    role: "user",
  },
  {
    id: 3,
    name: "Carol",
    email: "carol@gmail.com",
    passwordHash: await bcrypt.hash("usercarol123", 10),
    role: "user",
  },
];
