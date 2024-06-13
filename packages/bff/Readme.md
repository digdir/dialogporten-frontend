# BFF

Backend-for-frontend service for Dialogporten

## Development

### Database migrations

To generate DB migrations:

1. Start Docker with the database. Make sure the DB is on the last version so that TypeORM can diff the current schema defined in code with what you currently have in the DB.

2. Then run the following:

```bash
TYPEORM_SYNCHRONIZE_ENABLED="" pnpm typeorm migration:generate --dataSource ./src/data-source.ts ./src/migrations/name-of-new-migration
```
