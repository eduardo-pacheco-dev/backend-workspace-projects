# Backend API

API RESTful built with NestJS, TypeORM, MariaDB and Swagger.

## Requirements

- Node.js >= 20
- MariaDB running on port 3306
- npm

## Installation

```bash
npm install
```

## Environment Variables

Copy `.env` and adjust the values:

```env
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=root
DATABASE_NAME=app
```

## Running the Application

```bash
# development
npm run start:dev

# production
npm run build
npm run start:prod
```

## Docker (MariaDB)

A `docker-compose.yml` is provided to spin up MariaDB:

```bash
docker compose up -d
docker compose down
```

## API Documentation

After starting the application, access Swagger at:

```
http://localhost:3000/docs
```

## Project Structure

```
src/
├── main.ts                  # Application bootstrap + Swagger setup
├── app.module.ts            # Root module (ConfigModule + TypeORM)
├── app.controller.ts
├── app.service.ts
└── users/
    ├── user.entity.ts       # User entity
    ├── dto/
    │   └── create-user.dto.ts
    ├── users.service.ts
    ├── users.controller.ts
    └── users.module.ts
```

## Endpoints

| Method | Endpoint      | Description         |
|--------|---------------|---------------------|
| POST   | /users        | Create a user       |
| GET    | /users        | List all users      |
| GET    | /users/:id    | Get user by id      |
| DELETE | /users/:id    | Delete a user       |

## Scripts

| Command              | Description              |
|----------------------|--------------------------|
| `npm run start:dev`  | Start in development mode|
| `npm run build`      | Build the application    |
| `npm run start:prod` | Start in production mode |
| `npm run lint`       | Run ESLint               |
| `npm run test`       | Run unit tests           |
| `npm run test:e2e`   | Run end-to-end tests     |

## Tech Stack

- [NestJS](https://nestjs.com/) - Framework
- [TypeORM](https://typeorm.io/) - ORM
- [MariaDB](https://mariadb.org/) - Database
- [Swagger](https://swagger.io/) - API documentation
- [class-validator](https://github.com/TypeStack/class-validator) - DTO validation
