# Environment Variables Reference

## Configuration

All environment variables should be defined in `.env` file at project root.

## Required Variables

### DATABASE_URL

**Type**: String  
**Description**: SQL Server connection string  
**Example**:

```
DATABASE_URL="sqlserver://SERVERNAME;database=DBNAME;user=sa;password=PASSWORD;encrypt=true;trustServerCertificate=true"
```

**Connection String Components**:

- `SERVERNAME`: SQL Server instance name or IP address
- `database`: Database name
- `user`: Database user (usually `sa` for SQL Server)
- `password`: Database password
- `encrypt`: Enable encryption (recommended: true)
- `trustServerCertificate`: Trust self-signed certificates (set to true for development)

## Optional Variables

### PORT

**Type**: Number  
**Default**: 3000  
**Description**: HTTP server port

**Example**:

```
PORT=8080
```

### JWT_SECRET

**Type**: String  
**Default**: 'your-secret-key'  
**Description**: Secret key for JWT token signing

**Requirements**:

- Must be at least 32 characters in production
- Should be cryptographically random
- Never commit to version control

**Example**:

```
JWT_SECRET=your-super-secret-key-with-at-least-32-characters
```

### NODE_ENV

**Type**: String (development | production | test)  
**Default**: development  
**Description**: Application environment

**Example**:

```
NODE_ENV=production
```

### LOG_LEVEL

**Type**: String (trace | debug | info | warn | error | fatal)  
**Default**: info  
**Description**: Pino logger level

**Example**:

```
LOG_LEVEL=debug
```

## Development Setup

```env
DATABASE_URL="sqlserver://localhost;database=NestTest;user=sa;password=Toppine123;encrypt=true;trustServerCertificate=true"
PORT=3000
JWT_SECRET=dev-secret-key-change-in-production
NODE_ENV=development
LOG_LEVEL=debug
```

## Production Setup

```env
DATABASE_URL="sqlserver://prod-server;database=ProductionDB;user=produser;password=STRONG_PASSWORD;encrypt=true;trustServerCertificate=false"
PORT=3000
JWT_SECRET=production-secret-key-generate-secure-random-key
NODE_ENV=production
LOG_LEVEL=warn
```

## Database Connection String Examples

### Windows Authentication

```
DATABASE_URL="sqlserver://SERVER\\SQLEXPRESS;database=DBNAME;integratedSecurity=true;trustServerCertificate=true"
```

### Named Instance

```
DATABASE_URL="sqlserver://SERVER\\INSTANCE;database=DBNAME;user=sa;password=PASSWORD;encrypt=true;trustServerCertificate=true"
```

### Remote Server

```
DATABASE_URL="sqlserver://192.168.1.100;database=DBNAME;user=sa;password=PASSWORD;encrypt=true;trustServerCertificate=true"
```

### With Port

```
DATABASE_URL="sqlserver://SERVER,1433;database=DBNAME;user=sa;password=PASSWORD;encrypt=true;trustServerCertificate=true"
```

## Security Considerations

1. **Never commit .env to version control**
   - Add `.env` to `.gitignore`
   - Use `.env.example` for templates

2. **JWT_SECRET in Production**
   - Generate strong random key: `openssl rand -base64 32`
   - Store in secure secrets manager
   - Never use weak passwords

3. **Database Password**
   - Use strong passwords (20+ characters recommended)
   - Consider using managed identity or role-based authentication
   - Rotate periodically

4. **Encryption**
   - Always use `encrypt=true` in production
   - Set `trustServerCertificate=false` when using valid certificates

## Docker Environment

When using Docker, pass environment variables via:

```dockerfile
ENV DATABASE_URL="sqlserver://db:1433;..."
ENV JWT_SECRET="your-secret"
ENV NODE_ENV="production"
```

Or in docker-compose.yml:

```yaml
services:
  app:
    environment:
      - DATABASE_URL=sqlserver://db:1433;...
      - JWT_SECRET=your-secret
      - NODE_ENV=production
```

## Troubleshooting

### "Can't find dialect for database"

**Cause**: Incorrect database URL format

**Solution**: Verify connection string format matches SQL Server requirements

### "Login failed"

**Cause**: Invalid credentials or server name

**Solution**:

- Check username and password
- Verify server name/IP address
- Check SQL Server is running and accessible

### "Connection timeout"

**Cause**: Server unreachable or firewall blocking

**Solution**:

- Verify SQL Server is running
- Check firewall rules
- Test connection with SSMS or sqlcmd

## References

- [SQL Server Connection Strings](https://www.connectionstrings.com/sql-server/)
- [Prisma SQL Server Guide](https://www.prisma.io/docs/reference/database-reference/connection-urls#sql-server)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)
