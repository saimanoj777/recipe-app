# Recipe App

End-to-end solution for parsing recipe JSON, storing to a database, and exposing paginated/searchable APIs with a React UI.

## Server (API)

Tech: Node.js, Express, MongoDB (Mongoose).

Environment:
- `MONGODB_URI` (default: `mongodb://127.0.0.1:27017`)

Scripts:
```
cd server
npm install
npm run ingest   # loads server/data/recipes.json into Mongo
npm run dev      # starts API on http://localhost:5000
```

Endpoints:
- `GET /api/recipes?page=1&limit=10` — paginated, sorted by rating desc
- `GET /api/recipes/search?title=pie&cuisine=Southern%20Recipes&rating=>=4.5&total_time=<=60&calories=<=400&page=1&limit=15`

Operator syntax for numeric filters: `<=`, `<`, `=`, `>`, `>=` (e.g., `rating=>=4.5`).

Relational schema example is provided in `server/schema.sql` to align with the prompt.

## Client (React)

```
cd client
npm install
npm run dev
```

Features:
- Table with columns: Title, Cuisine, Rating (stars), Total Time, Serves
- Field-level filters mapped to `/api/recipes/search`
- Pagination, rows per page selectable from 15–50
- Row click opens a right-side drawer with details and nutrition table

## Sample Requests

```
curl "http://localhost:5000/api/recipes?page=1&limit=10"
curl "http://localhost:5000/api/recipes/search?title=pie&rating=>=4.5&calories=<=400"
```


