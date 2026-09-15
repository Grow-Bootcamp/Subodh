# Week 3 Day 2 — MongoDB Aggregation, Schema Validation & Data Modeling

## Topics Covered

### 1. MongoDB Aggregation Pipelines
- Aggregation pipelines process data through sequential stages
- `$match` filters documents like `find()` before grouping
- `$group` groups documents by a field and applies accumulators (`$sum`, `$avg`)
- `$sort` orders results (1 = ascending, -1 = descending)
- `$limit` restricts number of output documents
- `$project` includes/excludes fields and reshapes documents
- `$unwind` flattens array fields into individual documents
- `$lookup` joins collections similar to SQL JOINs (referencing pattern)
- `$addFields` adds new computed fields without removing existing ones
- `$cond` provides if-else logic inside aggregation expressions
- Comparison operators: `$gt`, `$lt`, `$gte`, `$lte`, `$eq`, `$in`

### 2. Schema Validation
- Schema validation uses `$jsonSchema` validator on collection creation
- `$jsonSchema` enforces required fields, `bsonType`, `minimum`, `maximum` constraints
- `collMod` command updates validation rules on existing collections
- Validation levels: `strict` (default), `moderate`
- Validation actions: `error` (default), `warn`

### 3. Datatypes & Numeric Types
- `NumberInt` (32-bit integer), `NumberLong` (64-bit integer)
- `NumberDouble` (64-bit floating point), `NumberDecimal` (128-bit exact precision)
- `ISODate` for date storage, `Timestamp` for internal replication timing
- BSON is MongoDB's binary JSON format supporting more data types than JSON

### 4. Embedding vs Referencing
- Embedding stores related data inside documents as nested arrays
- Referencing stores ObjectId references to documents in other collections
- Embedding is better for data accessed together; Referencing for independent data
- `$lookup` bridges referenced collections in aggregation queries

## Key Findings
- Aggregation pipelines are more powerful than simple queries for data analysis
- Schema validation ensures data consistency without application-level checks
- `NumberDecimal` is essential for financial data where precision matters
- Embedding vs Referencing decision impacts query performance and data integrity
- `$lookup` enables relational-style queries in a document database

## Conclusion
Day 2 of Week 3 covered MongoDB aggregation pipelines, schema validation, datatypes, and data modeling patterns. Aggregation pipelines provide a powerful way to transform and analyze data through sequential stages. Schema validation enforces data integrity at the database level. Understanding numeric types prevents precision issues in production. The embedding vs referencing decision is fundamental to MongoDB schema design and impacts both performance and data consistency.
