# Auth API — Lab 8

## Project Overview

This project is a RESTful API built with Node.js, Express, and Sequelize.

It provides two versions of CRUD routes for Food and Clothes collections, along with user authentication and role-based authorization.

## Technologies Used

- Node.js
- Express.js
- Sequelize
- SQLite
- JSON Web Tokens (JWT)
- Basic Authentication
- Jest
- Supertest

## Installation

Clone the repository and install dependencies:

```bash
npm install
```

Create a `.env` file with the required environment variables:

```env
PORT=3000
DATABASE_URL=sqlite:./auth-api.sqlite
SECRET=replace-with-a-long-random-secret
```

Use a secure, private value for `SECRET`. Never commit the `.env` file.

## Authentication Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | `/signup` | Register a new user |
| POST | `/signin` | Sign in using Basic Authentication |
| GET | `/secret` | Access a JWT-protected route |
| GET | `/users` | Retrieve users (admin only) |

Successful signup and signin responses include a JWT.

## API Version 1 — Public CRUD

Base route: `/api/v1`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/:model` | Retrieve all records |
| GET | `/:model/:id` | Retrieve one record |
| POST | `/:model` | Create a record |
| PUT | `/:model/:id` | Update a record |
| DELETE | `/:model/:id` | Delete a record |

Supported models: `food` and `clothes`.

## API Version 2 — Protected CRUD

Base route: `/api/v2`

All V2 endpoints require a valid Bearer token.

| Method | Endpoint | Required capability |
|---|---|---|
| GET | `/:model` | read |
| GET | `/:model/:id` | read |
| POST | `/:model` | create |
| PUT | `/:model/:id` | update |
| DELETE | `/:model/:id` | delete |

## Role-Based Access Control

| Role | Read | Create | Update | Delete |
|---|---|---|---|---|
| user | Yes | No | No | No |
| writer | Yes | Yes | No | No |
| editor | Yes | Yes | Yes | No |
| admin | Yes | Yes | Yes | Yes |

New accounts created through `/signup` receive the `user` role.

## Running the Application

Start the application:

```bash
npm start
```

## Testing

Run the automated test suite:

```bash
npm test -- --runInBand
```


The Jest and Supertest suite covers authentication, JWT protection, authorization, and protected CRUD operations.

Latest verified result: **10 tests passing**, with **80.82% statement coverage**.

## Error Handling

The API includes error-handling middleware for invalid requests, unauthorized access, forbidden operations, and server errors.

## UML Diagram

The following diagram illustrates the Lab 8 Auth API architecture, including authentication, authorization, CRUD routes, and the shared database.

![Lab 8 Auth API UML Diagram](./docs/uml.png)

## Author

Luis R. Lopez

Code Fellows — Code 401
