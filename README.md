# Casino Mini Games Site

This repository contains a minimal example of a casino web application with a React front-end and Go back-end. MongoDB is used for storing user data and game information. Authentication uses hashed passwords and JWT tokens.

## Structure
- `client/` – React front-end written in TypeScript using Vite.
- `server/` – Go back-end providing REST APIs and WebSocket endpoints.

## Development

Ensure MongoDB is running locally. Then start the server:

```bash
cd server
MONGO_URI=mongodb://localhost:27017 JWT_SECRET=mysecret go run .
```

In another terminal, start the client:

```bash
cd client
npm install
npm run start
```

The client will be available at `http://localhost:3000` and proxied to the Go server at port `8080`.

## Docker

A Docker Compose file is provided to run MongoDB, the Go server, and the client together.

```bash
docker-compose up --build
```
