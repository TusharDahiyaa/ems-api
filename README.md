### Employee Management System

# Backend RESTful APIs with Node.js, Express, Prisma, and TypeScript

This project demonstrates how to build a backend RESTful API using Node.js, Express.js, Prisma for ORM (Object-Relational Mapping), and TypeScript for type safety.

## Prerequisites

Before getting started, ensure you have the following installed on your machine:

- Node.js (v20.x or later)
- npm (Node Package Manager) or Yarn
- PostgreSQL (or another supported database for Prisma)

## Getting Started

1. **Clone the Repository**

```
git clone https://github.com/TusharDahiyaa/ems-api.git
cd ems-api
```

##Install Dependencies

```
npm install
```

# or

```
yarn install
```

##Set Up Environment Variables

Create a .env file in the root directory and copy the content from .env.example.

##Run Migrations

Use Prisma to apply database migrations:

```
npx prisma migrate dev --name "initDB"
npx prisma generate
npm prisma db seed
```

This will create necessary tables in your database based on your schema.

Start the Development Server

```
npm start

# or

yarn dev
```

This will start the server locally, and you can access the API at http://localhost:3000.

##Project Structure
The project structure is organized as follows:

- src/
- prisma/: Defines Prisma models representing database tables.
- routes/: Defines API routes using Express Router.
- middlewares/: Custom middleware functions.
- validations/: Zod and Permissions Schema
- index.ts: Entry point for the application.
- seed.ts: Entry point for the seeding prisma database

##Available Scripts
npm run dev: Starts the server in development mode
npm run build: Transpiles TypeScript files to JavaScript in the dist/ directory.
npm start: Starts the server in production mode using the compiled JavaScript files.

##License
This project is licensed under the MIT License.

##Acknowledgments
Special thanks to the creators and maintainers of Node.js, Express.js, Prisma, and TypeScript for their amazing tools and libraries.
