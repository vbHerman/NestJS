---
name: nestjs-prisma-setup
description: Configure and maintain NestJS project with Prisma ORM, SQL Server database, and authentication. Use when setting up development environment, managing database migrations, creating API endpoints, or implementing user authentication flows.
license: MIT
compatibility: Requires Node.js 18+, npm, SQL Server database, and Prisma CLI
metadata:
  author: NestJS Development Team
  version: '1.0'
  project-type: NestJS Application
---

# NestJS + Prisma Project Setup & Development Guide

## Project Overview

This is a production-ready NestJS application with Prisma ORM and SQL Server database integration. The project includes:

- **Authentication System**: JWT-based authentication with user credentials
- **User Management**: Complete user profile management
- **Database**: SQL Server with Prisma migrations
- **API Endpoints**: RESTful API for users and authentication
- **Microservices**: TCP-based microservice support

## Quick Start

### 1. Environment Setup

Create `.env` file in project root:

```env
DATABASE_URL="sqlserver://SERVER_NAME;database=DATABASE_NAME;user=sa;password=YOUR_PASSWORD;encrypt=true;trustServerCertificate=true"
PORT=3000
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Migration

```bash
npx prisma migrate deploy
```

### 4. Start Development Server

```bash
npm run start:dev
```

Server runs on `http://localhost:3000`

## Core Architecture

### Database Schema

The project uses two main models:

- **AuthCredential**: Stores authentication credentials (loginName, passwordHash, salt)
- **UserProfile**: Stores user profile information (email, fullName, phone, etc.)

See [schema reference](references/DATABASE_SCHEMA.md) for complete details.

### Project Structure

```
src/
├── main.ts                    # Application entry point
├── app.module.ts              # Root module
├── auth/                      # Authentication module
│   ├── auth.service.ts        # Authentication logic
│   ├── auth.controller.ts     # Auth endpoints
│   ├── strategies/            # Passport strategies (JWT, Local)
│   └── dto/                   # Data Transfer Objects
├── users/                     # User management module
│   ├── users.service.ts       # User business logic
│   ├── users.controller.ts    # User endpoints
│   └── dto/                   # User DTOs
└── common/                    # Shared utilities
    └── interceptors/          # Logging interceptors

prisma/
├── schema.prisma              # Database schema definition
└── migrations/                # Database migration history
```

## API Endpoints

### User Management

| Method | Endpoint         | Description     | Auth Required |
| ------ | ---------------- | --------------- | ------------- |
| POST   | `/users`         | Create new user | No            |
| GET    | `/users`         | Get all users   | No            |
| GET    | `/users/:userId` | Get single user | No            |
| PATCH  | `/users/:userId` | Update user     | No            |
| DELETE | `/users/:userId` | Delete user     | No            |

### Authentication

| Method | Endpoint      | Description                     |
| ------ | ------------- | ------------------------------- |
| POST   | `/auth/login` | User login (returns JWT tokens) |

## Common Tasks

### Create a New User

**Request:**

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "loginName": "user123",
    "password": "securepass123",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  }'
```

**Response:**

```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "avatarUrl": null,
  "status": 1
}
```

### User Login

**Request:**

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "loginName": "user123",
    "password": "securepass123"
  }'
```

**Response:**

```json
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "user_info": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "loginName": "user123"
  }
}
```

### Database Migration

Create a new migration:

```bash
npx prisma migrate dev --name add_new_field
```

Deploy migrations to production:

```bash
npx prisma migrate deploy
```

View database in Prisma Studio:

```bash
npx prisma studio
```

## Development Workflows

### Adding a New Entity

1. **Update schema.prisma**

   ```prisma
   model NewEntity {
     id    String  @id @default(cuid()) @db.VarChar(255)
     name  String  @db.NVarChar(100)
     createdAt DateTime @default(now())
   }
   ```

2. **Create migration**

   ```bash
   npx prisma migrate dev --name add_new_entity
   ```

3. **Generate Prisma Client**

   ```bash
   npx prisma generate
   ```

4. **Create service and controller** for the new entity

### Password Hashing

Passwords are hashed using bcrypt with salt:

```typescript
const salt = await bcrypt.genSalt();
const passwordHash = await bcrypt.hash(password, salt);
```

### Database Transactions

Use Prisma transactions to ensure data consistency:

```typescript
await this.prisma.$transaction(async (tx) => {
  await tx.authCredential.create({ data: {...} });
  await tx.userProfile.create({ data: {...} });
});
```

## Troubleshooting

### Issue: "Foreign key constraint violated"

**Cause**: Attempting to create UserProfile without corresponding AuthCredential

**Solution**: Always create AuthCredential first, then UserProfile. Use transactions to ensure atomicity.

### Issue: "DATABASE_URL missing"

**Cause**: `.env` file not configured

**Solution**:

1. Create `.env` file in project root
2. Set `DATABASE_URL` with correct SQL Server connection string
3. Restart development server

### Issue: Prisma Client not synced

**Cause**: Schema changes not generated

**Solution**:

```bash
npx prisma generate
npm run start:dev
```

### Issue: Migration conflicts

**Cause**: Multiple migrations or schema drift

**Solution**:

```bash
npx prisma migrate resolve --rolled-back migration_name
# or
npx prisma migrate reset --force  # Development only!
```

## Testing APIs

### Using PowerShell

```powershell
$body = @{ loginName = "admin"; password = "admin123" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/auth/login" `
  -Method Post `
  -Body $body `
  -ContentType "application/json"
```

### Using Postman

1. Create POST request to `http://localhost:3000/users`
2. Add header: `Content-Type: application/json`
3. Add JSON body with loginName, password, and profile fields
4. Send request

### Using REST Client VSCode Extension

Create `.http` file:

```http
POST http://localhost:3000/users
Content-Type: application/json

{
  "loginName": "testuser",
  "password": "testpass123",
  "fullName": "Test User",
  "email": "test@example.com"
}

###

POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "loginName": "testuser",
  "password": "testpass123"
}
```

## Build & Deployment

### Development Build

```bash
npm run build
npm run start
```

### Production Build

```bash
npm run build
npm run start:prod
```

### Docker Deployment

See [Docker setup guide](references/DOCKER_SETUP.md) for containerization.

## Environment Variables Reference

See [environment variables guide](references/ENV_VARIABLES.md) for complete list of supported variables.

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [SQL Server Connection Strings](https://www.connectionstrings.com/sql-server)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)
