use("sample_mflix");

// --- Section 1: Datatypes & Numeric Types (Collection: datatypes_demo) ---

// Create datatypes_demo collection with validator
// db.createCollection("datatypes_demo", {
//   validator: {
//     $jsonSchema: {
//       bsonType: "object",
//       required: ["username", "age", "balance", "joinedAt"],
//       properties: {
//         username: {
//           bsonType: "string",
//           description: "Must be a string and required",
//         },
//         age: {
//           bsonType: "int",
//           minimum: 0,
//         },
//         balance: {
//           bsonType: "decimal",
//         },
//         joinedAt: {
//           bsonType: "date",
//         },
//       },
//     },
//   },
// });

// 1. Insert document with all numeric types (Int32, Int64, Double, Decimal128)
// db.datatypes_demo.insertOne({
//   username: "Subodh",
//   age: NumberInt(21),
//   balance: NumberDecimal("21345.666"),
//   joinedAt: new ISODate("2026-09-15"),
// });

// 2. Insert document with Date, ISODate, Timestamp
// db.datatypes_demo.insertOne({
//   username: "Rahul",
//   age: NumberInt(25),
//   balance: NumberDecimal("5000.50"),
//   joinedAt: new ISODate("2026-01-15"),
//   createdAt: new Timestamp(),
// });

// 3. Insert document with mixed type field
// db.datatypes_demo.insertOne({
//   username: "Priya",
//   age: NumberInt(22),
//   balance: NumberDecimal("1000.00"),
//   joinedAt: new ISODate("2026-06-01"),
//   phone: "9876543210",
// });

// --- Section 2: Schema Validation (Collection: students) ---

// 4. Create students collection with validation rules (required fields, types, min/max)
// db.createCollection("students", {
//   validator: {
//     $jsonSchema: {
//       bsonType: "object",
//       required: [
//         "studentId",
//         "name",
//         "faculty",
//         "semester",
//         "gpa",
//         "enrolledAt",
//       ],
//       properties: {
//         studentId: {
//           bsonType: "string",
//           description: "Required string ID",
//         },
//         name: {
//           bsonType: "string",
//           description: "Required string",
//         },
//         faculty: {
//           bsonType: "string",
//           description: "Required string",
//         },
//         semester: {
//           bsonType: "int",
//           description: "Required integer",
//         },
//         gpa: {
//           bsonType: "decimal",
//           description: "Required decimal",
//         },
//         enrolledAt: {
//           bsonType: "date",
//           description: "Required date",
//         },
//       },
//     },
//   },
// });

// 5. Try inserting invalid document and see validation error
// db.students.insertOne({ name: "Test" });

// 6. Update validation rules using collMod
// db.runCommand({
//   collMod: "students",
//   validator: {
//     $jsonSchema: {
//       bsonType: "object",
//       required: ["studentId", "name", "faculty", "semester", "gpa", "enrolledAt"],
//       properties: {
//         studentId: { bsonType: "string" },
//         name: { bsonType: "string" },
//         faculty: { bsonType: "string" },
//         semester: { bsonType: "int", minimum: 1, maximum: 8 },
//         gpa: { bsonType: "decimal", minimum: 0, maximum: 4 },
//         enrolledAt: { bsonType: "date" },
//       },
//     },
//   },
// });

// --- Section 3: Embedding vs Referencing (Collections: movies + comments) ---

// 7. Query comments with embedded pattern (show comment + movie title via lookup)
// db.comments.aggregate([
//   {
//     $lookup: {
//       from: "movies",
//       localField: "movie_id",
//       foreignField: "_id",
//       as: "movie",
//     },
//   },
//   {
//     $project: {
//       _id: 0,
//       name: 1,
//       text: 1,
//       "movie.title": 1,
//     },
//   },
//   { $limit: 5 },
// ]);

// 8. Query movies with embedded arrays (genres, cast, directors)
// db.movies.aggregate([
//   {
//     $project: {
//       _id: 0,
//       title: 1,
//       genres: 1,
//       cast: 1,
//       directors: 1,
//     },
//   },
//   { $limit: 5 },
// ]);

// 9. Compare: embedded vs referenced data in comments ↔ movies relationship
// Embedding: genres, cast, directors are embedded arrays in movies
// Referencing: comments reference movies via movie_id

// Show embedded pattern
// db.movies.aggregate([
//   { $project: { _id: 0, title: 1, genres: 1, cast: 1 } },
//   { $limit: 3 },
// ]);

// Show referenced pattern (lookup)
// db.comments.aggregate([
//   {
//     $lookup: {
//       from: "movies",
//       localField: "movie_id",
//       foreignField: "_id",
//       as: "movie",
//     },
//   },
//   { $unwind: "$movie" },
//   { $project: { _id: 0, name: 1, text: 1, "movie.title": 1 } },
//   { $limit: 3 },
// ]);
