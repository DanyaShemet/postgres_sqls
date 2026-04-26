# Express + PostgreSQL learning project

This project is structured more like a small backend service you might see in a company codebase.

## Structure

`src/server.js`
- application entrypoint

`src/app.js`
- express app setup, routes, middleware

`src/config`
- environment loading and config mapping

`src/db`
- PostgreSQL pool, query helper, transaction helper

`src/routes`
- HTTP route definitions

`src/controllers`
- request/response layer

`src/services`
- business rules and validation

`src/repositories`
- SQL queries and database access

`src/middlewares`
- error and 404 handlers

## Why this structure is useful

- routes stay small and only describe endpoints
- controllers translate HTTP into service calls
- services contain validation and business logic
- repositories own SQL, so query changes stay in one place
- database config is not hardcoded in source files

## Environment

Create a `.env` file based on `.env.example`.

Example:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=postgres
DB_POOL_MAX=10
```

## Run

```bash
npm install
npm run dev
```

## API

`GET /api/health`
- basic app health

`GET /api/health/db`
- checks PostgreSQL connectivity

`GET /api/posts`
- list posts with author names

`GET /api/posts/:id`
- get one post

`POST /api/posts`
- create post

```json
{
  "title": "First post",
  "userId": 1
}
```

`POST /api/posts/with-comment`
- example of a transaction

```json
{
  "title": "Post with comment",
  "userId": 1,
  "comment": "First comment"
}
```

`PATCH /api/posts/:id`

```json
{
  "title": "Updated title"
}
```

`DELETE /api/posts/:id`

## Expected tables

This code assumes you already have these tables:

- `users(id, name)`
- `posts(id, title, user_id)`
- `comments(id, text, post_id)`

If you want, the next step is to add SQL migrations and seed files so the database setup also looks like a real project.
