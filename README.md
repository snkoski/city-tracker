# Prisma Commands Reference Guide

## Schema Update Workflow (Safe for Existing Data)

When making updates to your `schema.prisma` file, follow this sequence to apply changes safely without data loss:

### 1. Generate Migration Files

```bash
pnpm prisma migrate dev --name descriptive_migration_name --create-only
```

This command:
- Creates migration files in the `prisma/migrations` directory
- Does NOT apply them to the database yet
- Allows you to review and modify the migration before applying

### 2. Review Generated Migration

Look at the SQL in the generated migration file at:
```
prisma/migrations/[timestamp]_descriptive_migration_name/migration.sql
```

Edit if necessary to ensure data safety (add custom SQL for data preservation).

### 3. Apply Migration

```bash
pnpm prisma migrate dev
```

This applies pending migrations to your development database.

### 4. Update Prisma Client

```bash
pnpm prisma generate
```

Updates your Prisma Client to match the new schema.

## Common Prisma Commands

### Database Management

```bash
# Create a new migration and apply it
pnpm prisma migrate dev --name migration_name

# Apply migrations to production/staging
pnpm prisma migrate deploy

# Reset database (DELETES ALL DATA)
pnpm prisma migrate reset

# View database using Prisma Studio
pnpm prisma studio
```

### Schema Management

```bash
# Format schema file
pnpm prisma format

# Validate schema
pnpm prisma validate

# Pull schema from existing database
pnpm prisma db pull

# Push schema to database without migrations (DEV ONLY)
pnpm prisma db push
```

## Safe Schema Changes vs. Breaking Changes

### Safe Changes (Non-destructive)
- Adding a new model
- Adding a new field with a default value
- Making a required field optional
- Adding an index
- Adding a new enum value

### Potentially Destructive Changes (Require Special Handling)
- Making an optional field required
- Renaming a model or field
- Changing a field type
- Removing a field or model
- Changing relations

## Handling Potentially Destructive Changes

### Making an Optional Field Required

1. Add a default value in the migration file:
```sql
-- Set default values for existing records
UPDATE "User" SET "age" = 0 WHERE "age" IS NULL;
-- Then make the column required
ALTER TABLE "User" ALTER COLUMN "age" SET NOT NULL;
```

### Renaming a Field/Model

Use SQL to rename in the migration file instead of removing and creating:
```sql
-- Instead of DROP and CREATE
ALTER TABLE "User" RENAME COLUMN "name" TO "fullName";
```

### Changing Relations

1. Create a temporary column
2. Copy data
3. Update references
4. Remove old column

## Best Practices

1. **Always use `--create-only` first** to review migrations before applying them
2. **Backup your database** before applying migrations
3. **Test migrations** on a copy of production data
4. **Use custom SQL** in migrations for data transformations
5. **Break complex changes** into multiple small migrations
6. **Check for cascade deletes** in relations

## Troubleshooting

### Migration History Mismatch

If you get errors about migration history:

```bash
# For development (WILL LOSE DATA in affected tables)
pnpm prisma migrate reset

# For production (preserve data)
pnpm prisma migrate resolve --applied "migration_name"
```

### Recovering from Failed Migrations

```bash
# Mark a failed migration as applied
pnpm prisma migrate resolve --applied "migration_name"

# Skip a problematic migration
pnpm prisma migrate resolve --skip "migration_name"
```

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
