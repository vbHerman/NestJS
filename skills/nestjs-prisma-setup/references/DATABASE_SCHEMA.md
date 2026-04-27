# Database Schema Reference

## Overview

This document provides detailed information about the Prisma database schema used in the NestJS project.

## Models

### AuthCredential

Stores authentication credentials and login information.

```prisma
model AuthCredential {
  userId          String   @id @db.UniqueIdentifier
  loginName       String   @unique @db.NVarChar(50)
  passwordHash    String   @db.NVarChar(255)
  salt            String   @db.NVarChar(50)
  lastLoginIp     String?  @db.NVarChar(45)
  lastLoginTime   DateTime? @db.DateTime
  loginFailCount  Int      @default(0)
  isLocked        Boolean  @default(false) @db.Bit
  createdAt       DateTime @default(now()) @db.DateTime

  userProfile     UserProfile?
}
```

#### Fields

| Field          | Type          | Description                    | Nullable            |
| -------------- | ------------- | ------------------------------ | ------------------- |
| userId         | String (UUID) | Primary key, user identifier   | No                  |
| loginName      | String (50)   | Unique login username          | No                  |
| passwordHash   | String (255)  | Bcrypt hashed password         | No                  |
| salt           | String (50)   | Salt used for password hashing | No                  |
| lastLoginIp    | String (45)   | IP address of last login       | Yes                 |
| lastLoginTime  | DateTime      | Timestamp of last login        | Yes                 |
| loginFailCount | Int           | Failed login attempts counter  | No (default: 0)     |
| isLocked       | Boolean       | Account lock status            | No (default: false) |
| createdAt      | DateTime      | Record creation timestamp      | No                  |

#### Relations

- `userProfile` (UserProfile): One-to-one relationship with UserProfile

#### Indexes

- `loginName` - UNIQUE index for login username lookup

### UserProfile

Stores user profile and personal information.

```prisma
model UserProfile {
  userId      String  @id @db.UniqueIdentifier
  fullName    String? @db.NVarChar(100)
  email       String? @db.NVarChar(100)
  phone       String? @db.NVarChar(20)
  avatarUrl   String? @db.NVarChar(500)
  status      Int     @default(1) // 1=active, 2=disabled

  authCredential AuthCredential @relation(fields: [userId], references: [userId])
}
```

#### Fields

| Field     | Type          | Description                                | Nullable        |
| --------- | ------------- | ------------------------------------------ | --------------- |
| userId    | String (UUID) | Primary key, foreign key to AuthCredential | No              |
| fullName  | String (100)  | User's full name                           | Yes             |
| email     | String (100)  | User's email address                       | Yes             |
| phone     | String (20)   | User's phone number                        | Yes             |
| avatarUrl | String (500)  | URL to user's avatar image                 | Yes             |
| status    | Int           | Account status (1=active, 2=disabled)      | No (default: 1) |

#### Relations

- `authCredential` (AuthCredential): Required one-to-one relationship with AuthCredential

#### Foreign Keys

- `userId` → `AuthCredential.userId` - ON DELETE CASCADE

## Data Types

### UniqueIdentifier (SQL Server)

Equivalent to UUID/GUID in SQL Server. Used for unique identifiers.

### NVarChar

Unicode variable-length string. Used for supporting international characters.

### Bit

Boolean representation in SQL Server (0 = false, 1 = true).

## Constraints

### Primary Keys

- AuthCredential: `userId`
- UserProfile: `userId`

### Unique Constraints

- AuthCredential: `loginName`

### Foreign Key Constraints

- UserProfile.userId → AuthCredential.userId (Cascade delete)

## Relationships

```
┌─────────────────────┐
│  AuthCredential     │
├─────────────────────┤
│ userId (PK, UUID)   │
│ loginName (UNIQUE)  │
│ passwordHash        │
│ salt                │
│ lastLoginIp         │
│ lastLoginTime       │
│ loginFailCount      │
│ isLocked            │
│ createdAt           │
└──────────┬──────────┘
           │ 1:1
           │
┌──────────▼──────────┐
│  UserProfile        │
├─────────────────────┤
│ userId (PK, FK)     │
│ fullName            │
│ email               │
│ phone               │
│ avatarUrl           │
│ status              │
└─────────────────────┘
```

## Migration History

### 20250922085051_init

Initial schema setup with base tables.

### 20250925094636_init_user_table

Added UserProfile table and relationships.

### 20260407070954_update_to_new_schema

Updated schema to current structure with optimizations.

## Best Practices

1. **Always create AuthCredential before UserProfile** - Due to foreign key constraint
2. **Use transactions** - When creating both records together
3. **Hash passwords** - Use bcrypt with salt before storing
4. **Update lastLoginTime** - On successful authentication
5. **Track loginFailCount** - For security and account lockout logic
6. **Use status field** - For soft deletion or account state management

## Common Queries

### Find user by login name

```sql
SELECT * FROM AuthCredential
WHERE loginName = 'username'
```

### Get user with profile

```sql
SELECT ac.*, up.*
FROM AuthCredential ac
LEFT JOIN UserProfile up ON ac.userId = up.userId
WHERE ac.loginName = 'username'
```

### List all active users

```sql
SELECT up.*
FROM UserProfile up
WHERE up.status = 1
ORDER BY ac.createdAt DESC
```

### Find locked accounts

```sql
SELECT * FROM AuthCredential
WHERE isLocked = 1
```
