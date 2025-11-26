# Prisma Migration Guide

## What Was Done

Your backend has been successfully migrated from **TypeORM** to **Prisma**! 🎉

### Changes Made:

1. **Dependencies Updated**
   - Removed: `@nestjs/typeorm`, `typeorm`, `pg`
   - Added: `@prisma/client` and `prisma` (dev dependency)

2. **Prisma Setup**
   - Created `prisma/schema.prisma` with all your models
   - Created `PrismaService` and `PrismaModule` for dependency injection

3. **Services Updated**
   - ✅ UsersService
   - ✅ AuthService  
   - ✅ ArticlesService
   - ✅ ReactionService
   - ✅ ImagesService

4. **Modules Updated**
   - All modules now use PrismaModule instead of TypeOrmModule
   - AppModule updated to import PrismaModule globally

5. **Entity Files Removed**
   - Deleted all TypeORM entity files (they're replaced by Prisma schema)
   - Deleted custom `Role` enum (now using Prisma-generated enum from `@prisma/client`)

## Next Steps

### 1. Install Dependencies

```bash
cd apps/backend
npm install
```

### 2. Set Up Database

Make sure your `.env` file has the `DATABASE_URL`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
```

### 3. Create Database Tables

Since you're migrating from TypeORM, you have two options:

**Option A: Use existing database (recommended)**
```bash
npm run prisma:push
```
This will sync your Prisma schema with your existing database without migrations.

**Option B: Start fresh with migrations**
```bash
npm run prisma:migrate
```
This creates a migration file and applies it.

### 4. Generate Prisma Client

```bash
npm run prisma:generate
```

### 5. Build and Run

```bash
npm run build
npm run dev
```

## Prisma Commands

- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Create and apply migrations
- `npm run prisma:studio` - Open Prisma Studio (visual database editor)
- `npm run prisma:push` - Push schema changes to database without migrations

## Important: Role Enum Changes

The custom `Role` enum has been replaced by Prisma's auto-generated enum. **Two changes required:**

### 1. Update Imports:

```typescript
// Old
import { Role } from 'src/enum/role.enum';

// New
import { Role } from '@prisma/client';
```

### 2. Update Enum Values (lowercase):

```typescript
// Old (uppercase)
Role.ADMIN
Role.USER

// New (lowercase)
Role.admin
Role.user
```

**Why?** Prisma generates enum values as lowercase strings matching your schema definition:
```prisma
enum Role {
  admin  // becomes Role.admin
  user   // becomes Role.user
}
```

Prisma automatically generates TypeScript types for all enums defined in your schema, providing better type safety!

## Key Differences from TypeORM

### Querying
```typescript
// TypeORM
await this.userRepo.find({ where: { email } })

// Prisma
await this.prisma.user.findMany({ where: { email } })
```

### Relations
```typescript
// TypeORM
await this.articleRepo.find({ relations: ['user', 'reactions'] })

// Prisma
await this.prisma.article.findMany({ include: { user: true, reactions: true } })
```

### Creating Records
```typescript
// TypeORM
const user = this.userRepo.create({ email, hash, name })
await this.userRepo.save(user)

// Prisma
await this.prisma.user.create({ data: { email, hash, name } })
```

## Benefits of Prisma

- 🚀 Type-safe database queries
- 📝 Auto-generated types
- 🔍 Better IDE autocomplete
- 🎨 Prisma Studio for visual database management
- ⚡ Better performance
- 📚 Excellent documentation

## Troubleshooting

### If you get "Cannot find module '@prisma/client'"
```bash
npm run prisma:generate
```

### If tables don't match schema
```bash
npm run prisma:push
```

### To reset database (CAUTION: deletes all data)
```bash
npx prisma migrate reset
```

## Schema Changes

To modify your database schema:
1. Edit `prisma/schema.prisma`
2. Run `npm run prisma:migrate` to create a migration
3. The migration will be applied automatically

## Need Help?

- Prisma Docs: https://www.prisma.io/docs
- Prisma with NestJS: https://docs.nestjs.com/recipes/prisma

