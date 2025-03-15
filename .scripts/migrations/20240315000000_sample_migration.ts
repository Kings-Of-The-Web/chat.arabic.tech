import db from '../../lib/helpers/Database';

export async function up(): Promise<void> {
  // This is a sample migration that adds a new column to the users table
  await db.query(`
    ALTER TABLE users
    ADD COLUMN profile_picture VARCHAR(255) NULL
  `);
}

export async function down(): Promise<void> {
  // This is the rollback operation that removes the column
  await db.query(`
    ALTER TABLE users
    DROP COLUMN profile_picture
  `);
} 