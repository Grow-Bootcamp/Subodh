use("sample_mflix");

// 1. Count movies released after 2010
// db.movies.aggregate(
//   [{ $match: { released: { $gt: ISODate("2010-01-01T00:00:00Z") } } },
//   { $count: "movies_after_2010" }]
// );

// 2. Count movies with runtime > 120 minutes
// db.movies.aggregate(
//   [{ $match: { runtime: { $gt: 120 } } },
//   { $count: "movies_with_runtime_gt_120" }]
// );

// 3. Find movies where IMDB rating > 8
// db.movies.aggregate(
//   [{ $match: { "imdb.rating": { $gt: 8 } } },
//   { $project: { title: 1, "imdb.rating": 1, _id: 0 } }]
// );

// 4. Top 5 genres with most movies
// db.movies.aggregate([
//   { $unwind: "$genres" },
//   { $group: { _id: "$genres", count: { $sum: 1 } } },
//   { $sort: { count: -1 } },
//   { $limit: 5 },
// ]);

// 5. Top 5 years with most movie releases
// db.movies.aggregate([
//   { $group: { _id: "$year", count: { $sum: 1 } } },
//   { $sort: { count: -1 } },
//   { $limit: 5 },
// ]);

// 6. Show only title, year, and IMDB rating
// db.movies.aggregate([
//   {
//     $project: {
//       title: 1,
//       year: 1,
//       rating: "$imdb.rating",
//       _id: 0,
//     },
//   },
// ]);

// 7. Add field "isHighRated" (true if imdb.rating > 7)
// db.movies.aggregate([
//   {
//     $addFields: {
//       isHighRated: { $cond: [{ $gt: ["$imdb.rating", 7] }, true, false] },
//     },
//   },
//   {
//     $project: {
//       _id: 0,
//       title: 1,
//       rating: "$imdb.rating",
//       isHighRated: 1,
//     },
//   },
//   { $limit: 5 },
// ]);

// 8. Show comments with movie title
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
//       "movie.title": 1,
//       text: 1,
//     },
//   },
//   { $limit: 5 },
// ]);

// 9. Top 3 genres with most movies released after 2015
// db.movies.aggregate([
//   {
//     $match: {
//       released: { $gt: ISODate("2015-01-01T00:00:00.000Z") },
//     },
//   },
//   { $unwind: "$genres" },
//   { $group: { _id: "$genres", count: { $sum: 1 } } },
//   {
//     $project: {
//       count: 1,
//       released: 1,
//     },
//   },
//   {
//     $sort: {
//       count: -1,
//     },
//   },
//   { $limit: 3 },
// ]);
