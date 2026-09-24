// Database configuration lives here.
//
// ==========================================
// LEARNING TASK: MONGODB CONNECTION
// ==========================================
//
// Implement the MongoDB Atlas connection yourself.
//
// Questions to answer:
//
// 1. What does mongoose.connect() do?
// 2. Where should the connection URI come from?
//    (Hint: process.env — never hardcode it)
// 3. Why should the URI not be hardcoded?
// 4. What should happen if the connection fails?
//    Should the process exit? Log and continue?
// 5. When should the application start listening
//    for HTTP requests — before or after the connection?
//
// ------------------------------------------
// HINTS (not solutions):
//
// - Your .env file has MONGODB_URI=
// - dotenv is already loaded in src/server.ts
// - You will probably export an async function
//   that server.ts can await before listening
//
// IMPLEMENT THIS YOURSELF.

export {};
