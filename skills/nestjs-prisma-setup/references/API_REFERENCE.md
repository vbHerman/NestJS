# API Reference Guide

## Authentication Endpoints

### POST /auth/login

User login endpoint that returns JWT tokens.

**Request**

```json
{
  "loginName": "string",
  "password": "string"
}
```

**Parameters**:

- `loginName` (required): Username for login
- `password` (required): User password

**Response** (200 OK)

```json
{
  "access_token": "jwt_token_string",
  "refresh_token": "jwt_token_string",
  "user_info": {
    "userId": "uuid",
    "loginName": "string"
  }
}
```

**Error Responses**:

- 401 Unauthorized: Invalid credentials
- 400 Bad Request: Missing required fields

**Example**:

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"loginName": "admin", "password": "admin123"}'
```

## User Endpoints

### POST /users

Create a new user with authentication credentials.

**Request**

```json
{
  "loginName": "string",
  "password": "string",
  "fullName": "string",
  "email": "string",
  "phone": "string",
  "avatarUrl": "string"
}
```

**Parameters**:

- `loginName` (required): Unique username
- `password` (required): User password (will be hashed)
- `fullName` (optional): User's full name
- `email` (optional): User's email
- `phone` (optional): User's phone number
- `avatarUrl` (optional): URL to user avatar

**Response** (201 Created)

```json
{
  "userId": "uuid",
  "fullName": "string",
  "email": "string",
  "phone": "string",
  "avatarUrl": "string",
  "status": 1
}
```

**Error Responses**:

- 400 Bad Request: Invalid data
- 409 Conflict: LoginName already exists

**Example**:

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "loginName": "john_doe",
    "password": "securepass123",
    "fullName": "John Doe",
    "email": "john@example.com"
  }'
```

### GET /users

Retrieve all users.

**Query Parameters**: None

**Response** (200 OK)

```json
[
  {
    "userId": "uuid",
    "fullName": "string",
    "email": "string",
    "phone": "string",
    "avatarUrl": "string",
    "status": 1
  }
]
```

**Example**:

```bash
curl http://localhost:3000/users
```

### GET /users/:userId

Retrieve a specific user by ID.

**Path Parameters**:

- `userId` (required): User UUID

**Response** (200 OK)

```json
{
  "userId": "uuid",
  "fullName": "string",
  "email": "string",
  "phone": "string",
  "avatarUrl": "string",
  "status": 1
}
```

**Error Responses**:

- 404 Not Found: User not found

**Example**:

```bash
curl http://localhost:3000/users/550e8400-e29b-41d4-a716-446655440000
```

### PATCH /users/:userId

Update user profile information.

**Path Parameters**:

- `userId` (required): User UUID

**Request Body** (any of these fields):

```json
{
  "fullName": "string",
  "email": "string",
  "phone": "string",
  "avatarUrl": "string",
  "status": 1
}
```

**Response** (200 OK)

```json
{
  "userId": "uuid",
  "fullName": "string",
  "email": "string",
  "phone": "string",
  "avatarUrl": "string",
  "status": 1
}
```

**Error Responses**:

- 404 Not Found: User not found
- 400 Bad Request: Invalid data

**Example**:

```bash
curl -X PATCH http://localhost:3000/users/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{"fullName": "Jane Doe", "email": "jane@example.com"}'
```

### DELETE /users/:userId

Delete a user account.

**Path Parameters**:

- `userId` (required): User UUID

**Response** (200 OK)

```json
{
  "message": "User deleted successfully"
}
```

**Error Responses**:

- 404 Not Found: User not found

**Example**:

```bash
curl -X DELETE http://localhost:3000/users/550e8400-e29b-41d4-a716-446655440000
```

## Error Handling

All error responses follow this format:

```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "BadRequest"
}
```

### Common Status Codes

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Invalid credentials or missing token
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource already exists
- `500 Internal Server Error`: Server error

## Request/Response Headers

### Request Headers

```
Content-Type: application/json
```

### Response Headers

```
Content-Type: application/json; charset=utf-8
```

## Data Types

- `uuid`: UUID format string (e.g., "550e8400-e29b-41d4-a716-446655440000")
- `string`: Text string
- `integer`: Whole number
- `boolean`: true or false
- `datetime`: ISO 8601 format (e.g., "2024-04-27T11:29:59Z")

## Rate Limiting

Currently no rate limiting implemented. Consider implementing for production.

## Authentication

Some endpoints may require JWT bearer token in the future:

```
Authorization: Bearer <access_token>
```

## Response Examples

### Success Response

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

### Error Response

```json
{
  "statusCode": 404,
  "message": "User not found",
  "error": "Not Found"
}
```
