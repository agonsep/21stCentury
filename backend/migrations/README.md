# Database Migrations

This directory contains database migration scripts for production deployments.

## Migration Process

1. **Development**: Use `npx prisma db push` to sync schema changes
2. **Production**: Use `npx prisma migrate deploy` to apply migrations safely

## Migration Files

- Each migration is a separate SQL file
- Migrations are applied in order
- Never edit existing migration files
- Always test migrations on staging before production

## Production Deployment

```bash
# Apply pending migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# Start application
node server.js
```

## Best Practices

1. **Never drop tables in production** - use data migration scripts instead
2. **Always backup before migrations**
3. **Test migrations on staging environment first**
4. **Use transactions for complex migrations**
5. **Keep migrations small and focused**