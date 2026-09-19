# Database

**One file only:** `az_web/db/supabase_backup.sql`

That file is the live public schema. New developers migrate from this dump. Do not keep or run SQL from `server/` or anywhere else.

## New developer

1. Create a Supabase project (or `supabase start`).
2. SQL Editor → paste this whole file → Run.

```bash
psql "$DATABASE_URL" -f az_web/db/supabase_backup.sql
```

## After a live DB change

Edit **this file only**, then tell the team so it stays the source of truth. Do not add migration files under `server/`.
