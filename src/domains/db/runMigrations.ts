// src/domains/db/runMigrations.ts
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

/**
 * Ensures Drizzle migrations are run only once per process.
 * Safe for concurrent calls.
 */
let didRunMigrations = false;

export function runMigrations(db: BetterSQLite3Database): void {
    if (!didRunMigrations) {
        migrate(db, { migrationsFolder: 'migrations' });
        didRunMigrations = true;
    }
}
